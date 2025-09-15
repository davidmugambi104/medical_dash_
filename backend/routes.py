from flask import Blueprint, jsonify, request
from datetime import datetime, date, timedelta
from flask_login import login_required, current_user
from sqlalchemy import func, case, or_, distinct, extract, and_
from models import db, Patient, Appointment, User, Prescription, LabResult, Notification
from models import HealthMetric, VitalSign, PendingAction, Medication, MedicalRecord, Program

# Blueprint for dashboard API
dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/api/dashboard')

@dashboard_bp.route('/data')
@login_required
def dashboard_data():
    return jsonify(get_dashboard_data())

def get_dashboard_data():
    today = datetime.today().date()
    
    # Patient Statistics
    patient_stats = db.session.query(
        func.count(Patient.id).label('total_patients'),
        func.sum(case((Patient.blood_type == 'O-', 1), else_=0)).label('universal_donors'),
        func.sum(case(
            ((HealthMetric.metric_type == 'blood_sugar') & (HealthMetric.value > 200), 1),
            else_=0)).label('high_blood_sugar'),
        func.avg(VitalSign.bmi).label('avg_bmi'),
        func.count(Appointment.id).filter(
            Appointment.date == today
        ).label('todays_appointments'),
        func.count(Prescription.id).filter(
            Prescription.status == 'pending'
        ).label('pending_prescriptions'),
        func.count(LabResult.id).filter(
            LabResult.critical_flag == True,
            LabResult.acknowledged == False
        ).label('critical_labs')
    ).outerjoin(HealthMetric, HealthMetric.patient_id == Patient.id
    ).outerjoin(VitalSign, VitalSign.patient_id == Patient.id
    ).outerjoin(Appointment, Appointment.patient_id == Patient.id
    ).outerjoin(Prescription, Prescription.patient_id == Patient.id
    ).outerjoin(LabResult, LabResult.patient_id == Patient.id).first()

    # Today's Appointments
    appointments = db.session.query(
        Appointment.id,
        Appointment.start_time,
        Patient.first_name,
        Patient.last_name,
        User.username.label('doctor_name'),
        Appointment.reason,
        Appointment.status,
        Appointment.is_urgent
    ).join(Patient, Appointment.patient_id == Patient.id
    ).join(User, Appointment.doctor_id == User.id
    ).filter(Appointment.date == today
    ).order_by(Appointment.start_time).limit(5).all()

    # Available Doctors
    available_doctors = db.session.query(
        User.id,
        User.username,
        User.specialization,
        func.count(Appointment.id).label('patient_count'),
        func.avg(Patient.satisfaction_score).label('avg_rating')
    ).outerjoin(Appointment, Appointment.doctor_id == User.id
    ).outerjoin(Patient, Appointment.patient_id == Patient.id
    ).filter(User.role == 'doctor', User.status == 'active'
    ).group_by(User.id).limit(4).all()

    # Resource Status
    resource_status = {
        'icu': {
            'total': 15,
            'occupied': Patient.query.filter_by(in_icu=True).count()
        },
        'ventilators': {
            'total': 12,
            'in_use': Patient.query.filter_by(on_ventilator=True).count()
        },
        'isolation_beds': {
            'total': 10,
            'occupied': Patient.query.filter(Patient.isolation_status.isnot(None)).count()
        }
    }

    # Telemedicine Stats
    telemedicine_stats = {
        'eligible': Patient.query.filter(
            Patient.telemedicine_ready == True
        ).count(),
        'scheduled': Appointment.query.filter(
            Appointment.telemedicine == True,
            Appointment.status == 'scheduled',
            Appointment.date >= today
        ).count(),
        'completed': Appointment.query.filter(
            Appointment.telemedicine == True,
            Appointment.status == 'completed',
            Appointment.date == today
        ).count()
    }

    # Health Metrics
    health_metrics = db.session.query(
        func.avg(VitalSign.heart_rate).label('avg_heart_rate'),
        func.avg(VitalSign.oxygen_saturation).label('avg_oxygen'),
        func.avg(VitalSign.bmi).label('avg_bmi')
    ).first()

    # Pending actions
    pending_actions = PendingAction.query.filter_by(completed=False).count()

    # Format appointments for response
    formatted_appointments = []
    for appt in appointments:
        formatted_appointments.append({
            'id': appt.id,
            'time': appt.start_time.strftime('%H:%M') if appt.start_time else 'N/A',
            'patient': f"{appt.first_name} {appt.last_name}",
            'doctor': appt.doctor_name,
            'reason': appt.reason,
            'status': appt.status,
            'urgent': appt.is_urgent
        })

    # Format doctors for response
    formatted_doctors = []
    for doc in available_doctors:
        formatted_doctors.append({
            'id': doc.id,
            'name': doc.username,
            'specialty': doc.specialization or 'General',
            'patients': doc.patient_count,
            'rating': f"{doc.avg_rating:.1f}" if doc.avg_rating else "N/A"
        })

    # Compile data
    return {
        'patient_stats': {
            'total': patient_stats.total_patients,
            'todays_appointments': patient_stats.todays_appointments,
            'pending_prescriptions': patient_stats.pending_prescriptions,
            'critical_labs': patient_stats.critical_labs
        },
        'appointments': formatted_appointments,
        'doctors': formatted_doctors,
        'resource_status': resource_status,
        'telemedicine': telemedicine_stats,
        'health_metrics': {
            'heart_rate': f"{health_metrics.avg_heart_rate:.0f}" if health_metrics.avg_heart_rate else "N/A",
            'blood_pressure': "120/80",  # Placeholder
            'oxygen': f"{health_metrics.avg_oxygen:.0f}%" if health_metrics.avg_oxygen else "N/A",
            'bmi': f"{health_metrics.avg_bmi:.1f}" if health_metrics.avg_bmi else "N/A"
        },
        'pending_actions': pending_actions
    }

# Patients API
patients_bp = Blueprint('patients', __name__, url_prefix='/api/patients')

@patients_bp.route('/', methods=['GET'])
@login_required
def get_patients():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    search = request.args.get('search', '')
    
    query = Patient.query
    
    if search:
        query = query.filter(or_(
            Patient.first_name.ilike(f'%{search}%'),
            Patient.last_name.ilike(f'%{search}%'),
            Patient.email.ilike(f'%{search}%')
        ))
    
    patients = query.paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'patients': [{
            'id': p.id,
            'first_name': p.first_name,
            'last_name': p.last_name,
            'email': p.email,
            'phone': p.phone,
            'age': p.age,
            'gender': p.gender,
            'status': 'active' if p.is_active else 'inactive'
        } for p in patients.items],
        'total': patients.total,
        'pages': patients.pages,
        'current_page': page
    })

@patients_bp.route('/', methods=['POST'])
@login_required
def create_patient():
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['first_name', 'last_name', 'email', 'date_of_birth', 'gender']
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    try:
        new_patient = Patient(
            first_name=data.get('first_name'),
            last_name=data.get('last_name'),
            email=data.get('email'),
            phone=data.get('phone'),
            date_of_birth=datetime.strptime(data.get('date_of_birth'), '%Y-%m-%d').date(),
            gender=data.get('gender'),
            blood_type=data.get('blood_type'),
            is_active=True
        )
        db.session.add(new_patient)
        db.session.commit()
        
        return jsonify({
            'status': 'success', 
            'patient_id': new_patient.id,
            'message': 'Patient created successfully'
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@patients_bp.route('/<int:patient_id>', methods=['GET'])
@login_required
def get_patient(patient_id):
    patient = Patient.query.get_or_404(patient_id)
    return jsonify({
        'id': patient.id,
        'first_name': patient.first_name,
        'last_name': patient.last_name,
        'email': patient.email,
        'phone': patient.phone,
        'date_of_birth': patient.date_of_birth.isoformat(),
        'gender': patient.gender,
        'blood_type': patient.blood_type,
        'status': 'active' if patient.is_active else 'inactive'
    })

@patients_bp.route('/<int:patient_id>', methods=['PUT'])
@login_required
def update_patient(patient_id):
    patient = Patient.query.get_or_404(patient_id)
    data = request.get_json()
    
    try:
        if 'first_name' in data:
            patient.first_name = data['first_name']
        if 'last_name' in data:
            patient.last_name = data['last_name']
        if 'email' in data:
            patient.email = data['email']
        if 'phone' in data:
            patient.phone = data['phone']
        if 'date_of_birth' in data:
            patient.date_of_birth = datetime.strptime(data['date_of_birth'], '%Y-%m-%d').date()
        if 'gender' in data:
            patient.gender = data['gender']
        if 'blood_type' in data:
            patient.blood_type = data['blood_type']
        if 'is_active' in data:
            patient.is_active = data['is_active']
            
        db.session.commit()
        
        return jsonify({
            'status': 'success', 
            'message': 'Patient updated successfully'
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@patients_bp.route('/<int:patient_id>', methods=['DELETE'])
@login_required
def delete_patient(patient_id):
    patient = Patient.query.get_or_404(patient_id)
    
    try:
        db.session.delete(patient)
        db.session.commit()
        
        return jsonify({
            'status': 'success', 
            'message': 'Patient deleted successfully'
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Appointments API
appointments_bp = Blueprint('appointments', __name__, url_prefix='/api/appointments')

@appointments_bp.route('/', methods=['GET'])
@login_required
def get_appointments():
    start_date = request.args.get('start_date', default=date.today().isoformat())
    end_date = request.args.get('end_date', default=date.today().isoformat())
    doctor_id = request.args.get('doctor_id', type=int)
    patient_id = request.args.get('patient_id', type=int)
    
    query = Appointment.query.filter(
        Appointment.date >= start_date,
        Appointment.date <= end_date
    )
    
    if doctor_id:
        query = query.filter(Appointment.doctor_id == doctor_id)
    
    if patient_id:
        query = query.filter(Appointment.patient_id == patient_id)
    
    appointments = query.all()
    
    return jsonify([{
        'id': a.id,
        'title': f"{a.patient.first_name} {a.patient.last_name}",
        'start': datetime.combine(a.date, a.start_time).isoformat(),
        'end': datetime.combine(a.date, a.end_time).isoformat() if a.end_time else None,
        'doctor': a.doctor.username,
        'doctor_id': a.doctor_id,
        'patient_id': a.patient_id,
        'status': a.status,
        'urgent': a.is_urgent,
        'telemedicine': a.telemedicine,
        'reason': a.reason
    } for a in appointments])

@appointments_bp.route('/', methods=['POST'])
@login_required
def create_appointment():
    data = request.get_json()
    
    required_fields = ['patient_id', 'doctor_id', 'date', 'start_time', 'reason']
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    try:
        new_appointment = Appointment(
            patient_id=data['patient_id'],
            doctor_id=data['doctor_id'],
            date=datetime.strptime(data['date'], '%Y-%m-%d').date(),
            start_time=datetime.strptime(data['start_time'], '%H:%M').time(),
            end_time=datetime.strptime(data['end_time'], '%H:%M').time() if data.get('end_time') else None,
            reason=data['reason'],
            status=data.get('status', 'scheduled'),
            is_urgent=data.get('is_urgent', False),
            telemedicine=data.get('telemedicine', False)
        )
        db.session.add(new_appointment)
        db.session.commit()
        
        return jsonify({
            'status': 'success', 
            'appointment_id': new_appointment.id,
            'message': 'Appointment created successfully'
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Doctors API
doctors_bp = Blueprint('doctors', __name__, url_prefix='/api/doctors')

@doctors_bp.route('/', methods=['GET'])
@login_required
def get_doctors():
    doctors = User.query.filter_by(role='doctor').all()
    return jsonify([{
        'id': d.id,
        'name': d.username,
        'specialization': d.specialization,
        'status': d.status,
        'email': d.email,
        'phone': d.phone
    } for d in doctors])

# Pharmacy API
pharmacy_bp = Blueprint('pharmacy', __name__, url_prefix='/api/pharmacy')

@pharmacy_bp.route('/inventory', methods=['GET'])
@login_required
def get_inventory():
    inventory = Medication.query.all()
    return jsonify([{
        'id': m.id,
        'name': m.name,
        'quantity': m.quantity,
        'low_stock': m.quantity <= m.low_stock_threshold,
        'category': m.category
    } for m in inventory])

@pharmacy_bp.route('/prescriptions', methods=['GET'])
@login_required
def get_prescriptions():
    status = request.args.get('status', 'all')
    patient_id = request.args.get('patient_id', type=int)
    
    query = Prescription.query
    
    if status != 'all':
        query = query.filter_by(status=status)
    
    if patient_id:
        query = query.filter_by(patient_id=patient_id)
    
    prescriptions = query.all()
    
    return jsonify([{
        'id': p.id,
        'patient_id': p.patient_id,
        'patient': f"{p.patient.first_name} {p.patient.last_name}",
        'medication': p.medication_name,
        'dosage': p.dosage,
        'status': p.status,
        'start_date': p.start_date.isoformat() if p.start_date else None,
        'end_date': p.end_date.isoformat() if p.end_date else None
    } for p in prescriptions])

# Records API
records_bp = Blueprint('records', __name__, url_prefix='/api/records')

@records_bp.route('/', methods=['GET'])
@login_required
def get_records():
    patient_id = request.args.get('patient_id')
    if patient_id:
        records = MedicalRecord.query.filter_by(patient_id=patient_id).all()
    else:
        records = MedicalRecord.query.all()
    
    return jsonify([{
        'id': r.id,
        'patient_id': r.patient_id,
        'patient': f"{r.patient.first_name} {r.patient.last_name}",
        'diagnosis': r.diagnosis,
        'visit_date': r.visit_date.isoformat(),
        'doctor': r.doctor.username
    } for r in records])

# Programs API
programs_bp = Blueprint('programs', __name__, url_prefix='/api/programs')

@programs_bp.route('/', methods=['GET'])
@login_required
def get_programs():
    programs = Program.query.all()
    return jsonify([{
        'id': p.id,
        'name': p.name,
        'description': p.description,
        'code': p.code,
        'participants': len(p.patients)
    } for p in programs])

# Analytics API
analytics_bp = Blueprint('analytics', __name__, url_prefix='/api/analytics')

@analytics_bp.route('/patient-demographics', methods=['GET'])
@login_required
def patient_demographics():
    # Age groups
    age_groups = db.session.query(
        case(
            (Patient.age < 18, '0-17'),
            (and_(Patient.age >= 18, Patient.age < 30), '18-29'),
            (and_(Patient.age >= 30, Patient.age < 45), '30-44'),
            (and_(Patient.age >= 45, Patient.age < 60), '45-59'),
            (Patient.age >= 60, '60+')
        ).label('age_group'),
        func.count(Patient.id).label('count')
    ).group_by('age_group').all()
    
    # Gender distribution
    gender_dist = db.session.query(
        Patient.gender,
        func.count(Patient.id).label('count')
    ).group_by(Patient.gender).all()
    
    # Blood types
    blood_types = db.session.query(
        Patient.blood_type,
        func.count(Patient.id).label('count')
    ).group_by(Patient.blood_type).all()
    
    return jsonify({
        'age_groups': [{'group': g[0], 'count': g[1]} for g in age_groups],
        'gender_dist': [{'gender': g[0], 'count': g[1]} for g in gender_dist],
        'blood_types': [{'type': b[0], 'count': b[1]} for b in blood_types]
    })

@analytics_bp.route('/appointment-trends', methods=['GET'])
@login_required
def appointment_trends():
    # Monthly appointments
    monthly = db.session.query(
        extract('year', Appointment.date).label('year'),
        extract('month', Appointment.date).label('month'),
        func.count(Appointment.id).label('count')
    ).group_by('year', 'month').order_by('year', 'month').all()
    
    # By status
    by_status = db.session.query(
        Appointment.status,
        func.count(Appointment.id).label('count')
    ).group_by(Appointment.status).all()
    
    # By doctor
    by_doctor = db.session.query(
        User.username,
        func.count(Appointment.id).label('count')
    ).join(User, Appointment.doctor_id == User.id
    ).group_by(User.username).all()
    
    return jsonify({
        'monthly': [{'year': int(m[0]), 'month': int(m[1]), 'count': m[2]} for m in monthly],
        'by_status': [{'status': s[0], 'count': s[1]} for s in by_status],
        'by_doctor': [{'doctor': d[0], 'count': d[1]} for d in by_doctor]
    })

# Settings API
settings_bp = Blueprint('settings', __name__, url_prefix='/api/settings')

@settings_bp.route('/', methods=['GET'])
@login_required
def get_settings():
    return jsonify({
        'theme': 'light',
        'language': 'en',
        'time_format': '24h',
        'email_notifications': True,
        'sms_notifications': False
    })

@settings_bp.route('/', methods=['POST'])
@login_required
def update_settings():
    data = request.get_json()
    # In a real app, you would save these settings to the database
    return jsonify({'status': 'success', 'message': 'Settings updated'})

# Notification API
notifications_bp = Blueprint('notifications', __name__, url_prefix='/api/notifications')

@notifications_bp.route('/', methods=['GET'])
@login_required
def get_notifications():
    notifications = Notification.query.filter_by(
        user_id=current_user.id, read=False
    ).order_by(Notification.timestamp.desc()).limit(10).all()
    
    return jsonify([{
        'id': n.id,
        'message': n.message,
        'timestamp': n.timestamp.isoformat(),
        'type': n.notification_type
    } for n in notifications])

@notifications_bp.route('/<int:notification_id>/read', methods=['POST'])
@login_required
def mark_as_read(notification_id):
    notification = Notification.query.get_or_404(notification_id)
    if notification.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
        
    notification.read = True
    db.session.commit()
    return jsonify({'status': 'success'})

# Register all blueprints
# def register_blueprints(app):
#     app.register_blueprint(dashboard_bp)
#     app.register_blueprint(patients_bp)
#     app.register_blueprint(appointments_bp)
#     app.register_blueprint(doctors_bp)
#     app.register_blueprint(pharmacy_bp)
#     app.register_blueprint(records_bp)
#     app.register_blueprint(programs_bp)
#     app.register_blueprint(analytics_bp)
#     app.register_blueprint(settings_bp)
#     app.register_blueprint(notifications_bp)