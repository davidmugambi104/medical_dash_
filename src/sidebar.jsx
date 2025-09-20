// Sidebar Component (added to App.js)
const Sidebar = ({ currentPage, navigateTo, unreadAppointments, unreadPharmacy }) => {
  return (
    <div className="sidebar" style={{ width: '300px' }}>
      {/* Logo and System Name */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <i className="fas fa-heartbeat"></i>
        </div>
        <div className="system-name">
          <span>MediCare</span>
          <span>Dashboard</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="sidebar-nav">
        <div 
          className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`}
          onClick={() => navigateTo('dashboard')}
        >
          <i className="fas fa-home"></i>
          <span>Dashboard</span>
        </div>

        <div 
          className={`nav-item ${currentPage === 'patients' ? 'active' : ''}`}
          onClick={() => navigateTo('patients')}
        >
          <i className="fas fa-user-injured"></i>
          <span>Patients</span>
        </div>

        <div 
          className={`nav-item ${currentPage === 'doctors' ? 'active' : ''}`}
          onClick={() => navigateTo('doctors')}
        >
          <i className="fas fa-stethoscope"></i>
          <span>Doctors</span>
        </div>

        <div 
          className={`nav-item ${currentPage === 'appointments' ? 'active' : ''}`}
          onClick={() => navigateTo('appointments')}
        >
          <i className="fas fa-calendar-check"></i>
          <span>Appointments</span>
          {unreadAppointments > 0 && (
            <div className="nav-badge">{unreadAppointments}</div>
          )}
        </div>

        <div 
          className={`nav-item ${currentPage === 'pharmacy' ? 'active' : ''}`}
          onClick={() => navigateTo('pharmacy')}
        >
          <i className="fas fa-pills"></i>
          <span>Pharmacy</span>
          {unreadPharmacy > 0 && (
            <div className="nav-badge">{unreadPharmacy}</div>
          )}
        </div>

        <div 
          className={`nav-item ${currentPage === 'records' ? 'active' : ''}`}
          onClick={() => navigateTo('records')}
        >
          <i className="fas fa-file-medical"></i>
          <span>Medical Records</span>
        </div>

        <div 
          className={`nav-item ${currentPage === 'programs' ? 'active' : ''}`}
          onClick={() => navigateTo('programs')}
        >
          <i className="fas fa-heartbeat"></i>
          <span>Health Programs</span>
        </div>

        <div 
          className={`nav-item ${currentPage === 'analytics' ? 'active' : ''}`}
          onClick={() => navigateTo('analytics')}
        >
          <i className="fas fa-chart-line"></i>
          <span>Analytics</span>
        </div>
      </div>

      {/* Settings Section */}
      <div 
        className={`nav-item settings-item ${currentPage === 'settings' ? 'active' : ''}`}
        onClick={() => navigateTo('settings')}
      >
        <i className="fas fa-cog"></i>
        <span>Settings</span>
      </div>
    </div>
  );
};

export default Sidebar;