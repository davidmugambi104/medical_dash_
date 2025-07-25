"""added

Revision ID: d48bc169afb5
Revises: 
Create Date: 2025-06-19 19:31:27.109005

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd48bc169afb5'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('patients',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('first_name', sa.String(length=50), nullable=False),
    sa.Column('last_name', sa.String(length=50), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('phone', sa.String(length=20), nullable=False),
    sa.Column('date_of_birth', sa.Date(), nullable=False),
    sa.Column('password_hash', sa.String(length=128), nullable=True),
    sa.Column('blood_type', sa.String(length=3), nullable=True),
    sa.Column('allergies', sa.Text(), nullable=True),
    sa.Column('current_medications', sa.Text(), nullable=True),
    sa.Column('last_physical', sa.Date(), nullable=True),
    sa.Column('primary_physician', sa.String(length=100), nullable=True),
    sa.Column('insurance_provider', sa.String(length=100), nullable=True),
    sa.Column('policy_number', sa.String(length=50), nullable=True),
    sa.Column('emergency_contact', sa.Text(), nullable=True),
    sa.Column('two_factor_auth', sa.Boolean(), nullable=True),
    sa.Column('last_login', sa.DateTime(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.Column('avatar', sa.String(length=120), nullable=True),
    sa.Column('in_icu', sa.Boolean(), nullable=True),
    sa.Column('on_ventilator', sa.Boolean(), nullable=True),
    sa.Column('isolation_status', sa.String(length=50), nullable=True),
    sa.Column('satisfaction_score', sa.Float(), nullable=True),
    sa.Column('telemedicine_ready', sa.Boolean(), nullable=True),
    sa.Column('is_active', sa.Boolean(), nullable=True),
    sa.Column('is_vip', sa.Boolean(), nullable=True),
    sa.Column('gender', sa.String(length=10), nullable=True),
    sa.Column('patient_id', sa.String(length=20), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('patient_id'),
    sa.UniqueConstraint('phone')
    )
    op.create_table('programs',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('code', sa.String(length=10), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=80), nullable=False),
    sa.Column('password_hash', sa.String(length=200), nullable=False),
    sa.Column('role', sa.String(length=20), nullable=False),
    sa.Column('last_login', sa.DateTime(), nullable=True),
    sa.Column('active', sa.Boolean(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('specialization', sa.String(length=100), nullable=True),
    sa.Column('avatar', sa.String(length=120), nullable=True),
    sa.Column('status', sa.String(length=20), nullable=True),
    sa.Column('phone', sa.String(length=20), nullable=True),
    sa.Column('bio', sa.Text(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )
    op.create_table('appointments',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('patient_id', sa.Integer(), nullable=True),
    sa.Column('doctor_id', sa.Integer(), nullable=False),
    sa.Column('date', sa.Date(), nullable=False),
    sa.Column('start_time', sa.Time(), nullable=False),
    sa.Column('end_time', sa.Time(), nullable=True),
    sa.Column('status', sa.String(length=20), nullable=True),
    sa.Column('is_urgent', sa.Boolean(), nullable=True),
    sa.Column('notes', sa.Text(), nullable=True),
    sa.Column('telemedicine', sa.Boolean(), nullable=True),
    sa.Column('reason', sa.String(length=200), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['doctor_id'], ['users.id'], ),
    sa.ForeignKeyConstraint(['patient_id'], ['patients.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('audit_logs',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('action', sa.String(length=50), nullable=False),
    sa.Column('timestamp', sa.DateTime(), nullable=True),
    sa.Column('details', sa.Text(), nullable=True),
    sa.Column('patient_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['patient_id'], ['patients.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('enrollments',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('program_id', sa.Integer(), nullable=False),
    sa.Column('patient_id', sa.Integer(), nullable=True),
    sa.Column('enrolled_at', sa.DateTime(), nullable=True),
    sa.Column('status', sa.String(length=20), nullable=True),
    sa.ForeignKeyConstraint(['patient_id'], ['patients.id'], ),
    sa.ForeignKeyConstraint(['program_id'], ['programs.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('health_metrics',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('patient_id', sa.Integer(), nullable=True),
    sa.Column('metric_type', sa.String(length=50), nullable=True),
    sa.Column('value', sa.Float(), nullable=True),
    sa.Column('date', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['patient_id'], ['patients.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('lab_results',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('patient_id', sa.Integer(), nullable=True),
    sa.Column('test_name', sa.String(length=100), nullable=False),
    sa.Column('result_value', sa.String(length=50), nullable=True),
    sa.Column('date', sa.Date(), nullable=True),
    sa.Column('lab_name', sa.String(length=100), nullable=True),
    sa.Column('notes', sa.String(length=500), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('critical_flag', sa.Boolean(), nullable=True),
    sa.Column('acknowledged', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['patient_id'], ['patients.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('medical_records',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('patient_id', sa.Integer(), nullable=True),
    sa.Column('diagnosis', sa.Text(), nullable=False),
    sa.Column('visit_date', sa.DateTime(), nullable=True),
    sa.Column('doctor_id', sa.Integer(), nullable=False),
    sa.Column('notes', sa.Text(), nullable=True),
    sa.Column('treatment_plan', sa.Text(), nullable=True),
    sa.ForeignKeyConstraint(['doctor_id'], ['users.id'], ),
    sa.ForeignKeyConstraint(['patient_id'], ['patients.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('medications',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('interactions', sa.JSON(), nullable=True),
    sa.Column('patient_id', sa.Integer(), nullable=True),
    sa.Column('quantity', sa.Integer(), nullable=True),
    sa.Column('low_stock_threshold', sa.Integer(), nullable=True),
    sa.Column('category', sa.String(length=50), nullable=True),
    sa.ForeignKeyConstraint(['patient_id'], ['patients.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('notifications',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('message', sa.Text(), nullable=True),
    sa.Column('timestamp', sa.DateTime(), nullable=True),
    sa.Column('read', sa.Boolean(), nullable=True),
    sa.Column('patient_id', sa.Integer(), nullable=True),
    sa.Column('notification_type', sa.String(length=50), nullable=True),
    sa.ForeignKeyConstraint(['patient_id'], ['patients.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('pending_actions',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('action_type', sa.String(length=50), nullable=True),
    sa.Column('related_id', sa.Integer(), nullable=True),
    sa.Column('description', sa.String(length=200), nullable=True),
    sa.Column('due_date', sa.DateTime(), nullable=True),
    sa.Column('completed', sa.Boolean(), nullable=True),
    sa.Column('patient_id', sa.Integer(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['patient_id'], ['patients.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('prescriptions',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('patient_id', sa.Integer(), nullable=True),
    sa.Column('medication_name', sa.String(length=100), nullable=False),
    sa.Column('dosage', sa.String(length=50), nullable=True),
    sa.Column('start_date', sa.Date(), nullable=True),
    sa.Column('end_date', sa.Date(), nullable=True),
    sa.Column('prescribing_doctor', sa.String(length=100), nullable=True),
    sa.Column('notes', sa.String(length=500), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('last_taken', sa.Date(), nullable=True),
    sa.Column('status', sa.String(length=20), nullable=True),
    sa.ForeignKeyConstraint(['patient_id'], ['patients.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('vital_signs',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('patient_id', sa.Integer(), nullable=True),
    sa.Column('recorded_at', sa.DateTime(), nullable=True),
    sa.Column('heart_rate', sa.Integer(), nullable=True),
    sa.Column('systolic', sa.Integer(), nullable=True),
    sa.Column('diastolic', sa.Integer(), nullable=True),
    sa.Column('temperature', sa.Float(), nullable=True),
    sa.Column('oxygen_saturation', sa.Float(), nullable=True),
    sa.Column('weight', sa.Float(), nullable=True),
    sa.Column('height', sa.Float(), nullable=True),
    sa.Column('bmi', sa.Float(), nullable=True),
    sa.ForeignKeyConstraint(['patient_id'], ['patients.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('medical_record_prescriptions',
    sa.Column('medical_record_id', sa.Integer(), nullable=False),
    sa.Column('prescription_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['medical_record_id'], ['medical_records.id'], ),
    sa.ForeignKeyConstraint(['prescription_id'], ['prescriptions.id'], ),
    sa.PrimaryKeyConstraint('medical_record_id', 'prescription_id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('medical_record_prescriptions')
    op.drop_table('vital_signs')
    op.drop_table('prescriptions')
    op.drop_table('pending_actions')
    op.drop_table('notifications')
    op.drop_table('medications')
    op.drop_table('medical_records')
    op.drop_table('lab_results')
    op.drop_table('health_metrics')
    op.drop_table('enrollments')
    op.drop_table('audit_logs')
    op.drop_table('appointments')
    op.drop_table('users')
    op.drop_table('programs')
    op.drop_table('patients')
    # ### end Alembic commands ###
