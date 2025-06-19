from flask import Flask, render_template
from flask_login import LoginManager, current_user
from flask_migrate import migrate
from models import db, User
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from routes import dashboard_bp, patients_bp, appointments_bp, doctors_bp
from routes import pharmacy_bp, records_bp, programs_bp, analytics_bp
from routes import settings_bp, notifications_bp

app = Flask(__name__, template_folder='.')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///healthcare.db'
app.config['SECRET_KEY'] = 'your_secret_key_here'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db.init_app(app)
migrate = Migrate(app, db)
login_manager = LoginManager(app)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Register blueprints
app.register_blueprint(dashboard_bp)
app.register_blueprint(patients_bp)
app.register_blueprint(appointments_bp)
app.register_blueprint(doctors_bp)
app.register_blueprint(pharmacy_bp)
app.register_blueprint(records_bp)
app.register_blueprint(programs_bp)
app.register_blueprint(analytics_bp)
app.register_blueprint(settings_bp)
app.register_blueprint(notifications_bp)

# Index route
@app.route("/")
def index():
    return render_template('dashboard.html', user=current_user)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5001)