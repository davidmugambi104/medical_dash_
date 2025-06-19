from datetime import datetime, date
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from sqlalchemy import func, case, or_, distinct, extract, and_
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

# Association table for many-to-many relationship
medical_record_prescriptions = db.Table(
    'medical_record_prescriptions',
    db.Column('medical_record_id', db.Integer, db.ForeignKey('medical_records.id'), primary_key=True),
    db.Column('prescription_id', db.Integer, db.ForeignKey('prescriptions.id'), primary_key=True)
)

class PendingAction(db.Model):
    __tablename__ = 'pending_actions'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    action_type = db.Column(db.String(50))
    related_id = db.Column(db.Integer)
    description = db.Column(db.String(200))
    due_date = db.Column(db.DateTime)
    completed = db.Column(db.Boolean, default=False)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)

    patient = db.relationship('Patient', back_populates='pending_actions')
    user = db.relationship('User', back_populates='pending_actions')

class Appointment(db.Model):
    __tablename__ = 'appointments'
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'))
    doctor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time)
    status = db.Column(db.String(20), default='scheduled')
    is_urgent = db.Column(db.Boolean, default=False)
    notes = db.Column(db.Text)
    telemedicine = db.Column(db.Boolean, default=False)
    reason = db.Column(db.String(200), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    patient = db.relationship('Patient', back_populates='appointments')
    doctor = db.relationship('User', back_populates='appointments')

class Program(db.Model):
    __tablename__ = 'programs'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text)
    code = db.Column(db.String(10))

    patients = db.relationship('Patient', secondary='enrollments', back_populates='programs')
    enrollments = db.relationship('Enrollment', back_populates='program')

class Enrollment(db.Model):
    __tablename__ = 'enrollments'
    id = db.Column(db.Integer, primary_key=True)
    program_id = db.Column(db.Integer, db.ForeignKey('programs.id'), nullable=False)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'))
    enrolled_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='active')

    program = db.relationship('Program', back_populates='enrollments')
    patient = db.relationship('Patient', back_populates='enrollments')

class MedicalRecord(db.Model):
    __tablename__ = 'medical_records'
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'))
    diagnosis = db.Column(db.Text, nullable=False)
    visit_date = db.Column(db.DateTime, default=datetime.utcnow)
    doctor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    notes = db.Column(db.Text)
    treatment_plan = db.Column(db.Text)

    patient = db.relationship('Patient', back_populates='medical_records')
    doctor = db.relationship('User', back_populates='medical_records')
    prescriptions = db.relationship('Prescription', secondary=medical_record_prescriptions, back_populates='medical_records')

class AuditLog(db.Model):
    __tablename__ = 'audit_logs'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    action = db.Column(db.String(50), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    details = db.Column(db.Text)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'))

    user = db.relationship('User', back_populates='audit_logs')

class Medication(db.Model):
    __tablename__ = 'medications'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    interactions = db.Column(db.JSON)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'))
    quantity = db.Column(db.Integer, default=0)
    low_stock_threshold = db.Column(db.Integer, default=10)
    category = db.Column(db.String(50))

    patient = db.relationship('Patient', back_populates='medications')

class Notification(db.Model):
    __tablename__ = 'notifications'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    message = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    read = db.Column(db.Boolean, default=False)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'))
    notification_type = db.Column(db.String(50))

    patient = db.relationship('Patient', back_populates='notifications')
    user = db.relationship('User', back_populates='notifications')

class HealthMetric(db.Model):
    __tablename__ = 'health_metrics'
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'))
    metric_type = db.Column(db.String(50))
    value = db.Column(db.Float)
    date = db.Column(db.DateTime, default=datetime.utcnow)

    patient = db.relationship('Patient', back_populates='health_metrics')

class VitalSign(db.Model):
    __tablename__ = 'vital_signs'
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'))
    recorded_at = db.Column(db.DateTime, default=datetime.utcnow)
    heart_rate = db.Column(db.Integer)
    systolic = db.Column(db.Integer)
    diastolic = db.Column(db.Integer)
    temperature = db.Column(db.Float)
    oxygen_saturation = db.Column(db.Float)
    weight = db.Column(db.Float)
    height = db.Column(db.Float)
    bmi = db.Column(db.Float)

    patient = db.relationship('Patient', back_populates='vital_signs')

    @property
    def blood_pressure(self):
        return f"{self.systolic}/{self.diastolic}"

class Prescription(db.Model):
    __tablename__ = 'prescriptions'
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'))
    medication_name = db.Column(db.String(100), nullable=False)
    dosage = db.Column(db.String(50))
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    prescribing_doctor = db.Column(db.String(100))
    notes = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_taken = db.Column(db.Date)
    status = db.Column(db.String(20), default='active')  # active, pending, completed

    patient = db.relationship('Patient', back_populates='prescriptions')
    medical_records = db.relationship('MedicalRecord', secondary=medical_record_prescriptions, back_populates='prescriptions')

class LabResult(db.Model):
    __tablename__ = 'lab_results'
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'))
    test_name = db.Column(db.String(100), nullable=False)
    result_value = db.Column(db.String(50))
    date = db.Column(db.Date)
    lab_name = db.Column(db.String(100))
    notes = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    critical_flag = db.Column(db.Boolean, default=False)
    acknowledged = db.Column(db.Boolean, default=False)

    patient = db.relationship('Patient', back_populates='lab_results')

class Patient(UserMixin, db.Model):
    __tablename__ = 'patients'
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20), unique=True, nullable=False)
    date_of_birth = db.Column(db.Date, nullable=False)
    password_hash = db.Column(db.String(128))
    blood_type = db.Column(db.String(3))
    allergies = db.Column(db.Text)
    current_medications = db.Column(db.Text)
    last_physical = db.Column(db.Date)
    primary_physician = db.Column(db.String(100))
    insurance_provider = db.Column(db.String(100))
    policy_number = db.Column(db.String(50))
    emergency_contact = db.Column(db.Text)
    two_factor_auth = db.Column(db.Boolean, default=False)
    last_login = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    avatar = db.Column(db.String(120), nullable=True, default='default.png')
    in_icu = db.Column(db.Boolean, default=False)
    on_ventilator = db.Column(db.Boolean, default=False)
    isolation_status = db.Column(db.String(50), nullable=True)
    satisfaction_score = db.Column(db.Float, default=0.0)
    telemedicine_ready = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    is_vip = db.Column(db.Boolean, default=False)
    gender = db.Column(db.String(10), nullable=True)
    patient_id = db.Column(db.String(20), unique=True)  # PT-1001 format

    appointments = db.relationship('Appointment', back_populates='patient')
    prescriptions = db.relationship('Prescription', back_populates='patient')
    lab_results = db.relationship('LabResult', back_populates='patient')
    vital_signs = db.relationship('VitalSign', back_populates='patient')
    health_metrics = db.relationship('HealthMetric', back_populates='patient')
    medical_records = db.relationship('MedicalRecord', back_populates='patient')
    notifications = db.relationship('Notification', back_populates='patient')
    programs = db.relationship('Program', secondary='enrollments', back_populates='patients')
    pending_actions = db.relationship('PendingAction', back_populates='patient')
    medications = db.relationship('Medication', back_populates='patient')
    enrollments = db.relationship('Enrollment', back_populates='patient')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password) if self.password_hash else False

    @property
    def name(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def age(self):
        today = date.today()
        born = self.date_of_birth
        return today.year - born.year - ((today.month, today.day) < (born.month, born.day))

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), default='doctor', nullable=False)
    last_login = db.Column(db.DateTime)
    active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    email = db.Column(db.String(120), unique=True, nullable=False)
    specialization = db.Column(db.String(100), nullable=True)
    avatar = db.Column(db.String(120), nullable=True, default='default_doctor.png')
    status = db.Column(db.String(20), default='active')  # active, inactive, absent
    phone = db.Column(db.String(20))
    bio = db.Column(db.Text)

    appointments = db.relationship('Appointment', back_populates='doctor')
    medical_records = db.relationship('MedicalRecord', back_populates='doctor')
    audit_logs = db.relationship('AuditLog', back_populates='user')
    pending_actions = db.relationship('PendingAction', back_populates='user')
    notifications = db.relationship('Notification', back_populates='user')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)