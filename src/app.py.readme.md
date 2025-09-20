// // src/App.js
// import React, { useState, useEffect, useRef } from 'react';
// import './App.css';
// import { Chart, registerables } from 'chart.js';
// import moment from 'moment';
// // import Sidebar from './sidebar';

// // Register Chart.js components
// Chart.register(...registerables);

// // API Service Layer - Real integration points
// class HealthcareService {
//   static async fetchPatients() {
//     // In a real app, this would be a real API call
//     return [
//       { id: "PT-1001", name: "John Smith", status: "active", age: 45, gender: "Male", contact: "john.smith@example.com", registered: "Jan 12, 2023", conditions: ["Hypertension", "Diabetes"], lastVisit: "2023-05-15" },
//       { id: "PT-1002", name: "Emma Wilson", status: "active", age: 32, gender: "Female", contact: "emma.w@example.com", registered: "Feb 28, 2023", conditions: ["Asthma"], lastVisit: "2023-05-18" },
//       { id: "PT-1003", name: "Robert Brown", status: "active", age: 58, gender: "Male", contact: "robert.b@example.com", registered: "Mar 15, 2023", conditions: ["Arthritis", "Osteoporosis"], lastVisit: "2023-05-10" },
//       { id: "PT-1004", name: "Lisa Davis", status: "inactive", age: 29, gender: "Female", contact: "lisa.d@example.com", registered: "Apr 3, 2023", conditions: ["Migraine"], lastVisit: "2023-04-22" }
//     ];
//   }

//   static async fetchAppointments() {
//     // Real implementation would use actual date handling
//     return [
//       { id: "A1001", time: "09:00", patient: "John Smith", doctor: "Dr. Sarah Johnson", status: "scheduled", duration: 30, reason: "Follow-up", notes: "Check HbA1c levels" },
//       { id: "A1002", time: "10:30", patient: "Emma Wilson", doctor: "Dr. Michael Chen", status: "scheduled", duration: 45, reason: "Consultation", notes: "Asthma management" },
//       { id: "A1003", time: "11:15", patient: "Robert Brown", doctor: "Dr. Priya Patel", status: "urgent", duration: 60, reason: "Pain management", notes: "Knee pain worsening" },
//       { id: "A1004", time: "13:45", patient: "Lisa Davis", doctor: "Dr. Robert Williams", status: "confirmed", duration: 30, reason: "Annual checkup", notes: "" }
//     ];
//   }

//   static async fetchMedications(patientId) {
//     // Simulated medication data
//     return [
//       { id: "M1001", name: "Metformin", dosage: "500mg", frequency: "Twice daily", status: "active", startDate: "2023-01-15" },
//       { id: "M1002", name: "Lisinopril", dosage: "10mg", frequency: "Once daily", status: "active", startDate: "2023-02-10" }
//     ];
//   }

//   static async savePatient(patientData) {
//     // In a real app, this would POST to an API
//     return { success: true, patient: {...patientData, id: `PT-${Math.floor(1000 + Math.random() * 9000)}` }};
//   }
// }

// function App() {
//   const [currentPage, setCurrentPage] = useState('dashboard');
//   const [darkMode, setDarkMode] = useState(() => {
//     // Load dark mode preference from localStorage
//     const savedMode = localStorage.getItem('darkMode');
//     return savedMode ? JSON.parse(savedMode) : false;
//   });
//   const [notifications, setNotifications] = useState([]);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [doctor, setDoctor] = useState('1');
//   const [patients, setPatients] = useState([]);
//   const [appointments, setAppointments] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
  
//   // Enhanced mock data with real-world structure
//   const mockData = {
//     patient_stats: {
//       total: 1245,
//       todays_appointments: 8,
//       pending_prescriptions: 3,
//       critical_labs: 2,
//       high_blood_sugar: 4
//     },
//     health_metrics: {
//       heart_rate: 72,
//       blood_pressure: "120/80",
//       oxygen: 98,
//       bmi: 24.2
//     },
//     telemedicine: {
//       eligible: 24,
//       scheduled: 12,
//       completed: 8
//     },
//     doctors: [
//       { id: "1", name: "Dr. Sarah Johnson", specialty: "Cardiology", patients: 245, rating: 4.9 },
//       { id: "2", name: "Dr. Michael Chen", specialty: "Neurology", patients: 198, rating: 4.8 },
//       { id: "3", name: "Dr. Priya Patel", specialty: "Pediatrics", patients: 312, rating: 4.7 },
//       { id: "4", name: "Dr. Robert Williams", specialty: "Orthopedics", patients: 176, rating: 4.9 }
//     ],
//     resource_status: {
//       icu: { occupied: 12, total: 15 },
//       ventilators: { in_use: 8, total: 12 },
//       isolation_beds: { occupied: 5, total: 10 }
//     }
//   };

//   // Initialize data
//   useEffect(() => {
//     const loadData = async () => {
//       setIsLoading(true);
      
//       try {
//         // Fetch real data in production - using mocks for demonstration
//         const [patientsData, appointmentsData] = await Promise.all([
//           HealthcareService.fetchPatients(),
//           HealthcareService.fetchAppointments()
//         ]);
        
//         setPatients(patientsData);
//         setAppointments(appointmentsData);
        
//         // Initialize notifications
//         setNotifications([
//           { id: 1, message: "New appointment request from John Smith", time: "10 mins ago", read: false, type: "appointment" },
//           { id: 2, message: "Lab results for Emma Wilson are available", time: "45 mins ago", read: false, type: "lab" },
//           { id: 3, message: "Prescription for Robert Brown needs approval", time: "2 hours ago", read: true, type: "prescription" },
//           { id: 4, message: "Dr. Patel is running 15 minutes late", time: "3 hours ago", read: true, type: "alert" },
//           { id: 5, message: "System update completed successfully", time: "1 day ago", read: true, type: "system" }
//         ]);
//       } catch (error) {
//         console.error("Failed to load data:", error);
//         // Add error notification
//         setNotifications(prev => [
//           { id: Date.now(), message: "Failed to load patient data", time: "Just now", read: false, type: "error" },
//           ...prev
//         ]);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadData();
//   }, []);

//   // Save dark mode preference
//   useEffect(() => {
//     localStorage.setItem('darkMode', JSON.stringify(darkMode));
//   }, [darkMode]);

//   // Calculate unread notifications
//   const unreadNotifications = notifications.filter(n => !n.read).length;

//   // Toggle notification panel
//   const toggleNotifications = () => {
//     setShowNotifications(!showNotifications);
//   };

//   // Mark notification as read
//   const markAsRead = (id) => {
//     setNotifications(notifications.map(n => 
//       n.id === id ? {...n, read: true} : n
//     ));
//   };

//   // Clear all notifications
//   const clearNotifications = () => {
//     setNotifications([]);
//   };

//   // Toggle dark mode
//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode);
//   };

//   // Navigate to page
//   const navigateTo = (page) => {
//     setCurrentPage(page);
//     setShowNotifications(false);
//   };

//   // Handle new patient creation
//   const handleAddPatient = async (patientData) => {
//     setIsLoading(true);
//     try {
//       const result = await HealthcareService.savePatient(patientData);
//       if (result.success) {
//         setPatients(prev => [...prev, result.patient]);
//         // Add success notification
//         setNotifications(prev => [
//           { id: Date.now(), message: `Patient ${result.patient.name} added successfully`, time: "Just now", read: false, type: "success" },
//           ...prev
//         ]);
//         return true;
//       }
//     } catch (error) {
//       console.error("Failed to add patient:", error);
//       setNotifications(prev => [
//         { id: Date.now(), message: "Failed to add patient", time: "Just now", read: false, type: "error" },
//         ...prev
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//     return false;
//   };

//   // Render main content based on current page
//   const renderContent = () => {
//     if (isLoading) {
//       return (
//         <div className="loading-screen">
//           <i className="fas fa-spinner fa-spin"></i>
//           <span>Loading healthcare data...</span>
//         </div>
//       );
//     }
    
//     switch(currentPage) {
//       case 'dashboard': return <DashboardPage data={mockData} appointments={appointments} />;
//       case 'patients': return <PatientsPage patients={patients} onAddPatient={handleAddPatient} />;
//       case 'doctors': return <DoctorsPage doctors={mockData.doctors} />;
//       case 'settings': return <SettingsPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
//       case 'appointments': return <AppointmentsPage appointments={appointments} doctors={mockData.doctors} />;
//       case 'pharmacy': return <PharmacyPage />;
//       case 'records': return <RecordsPage patients={patients} />;
//       case 'programs': return <ProgramsPage />;
//       case 'analytics': return <AnalyticsPage />;
//       default: return <DashboardPage data={mockData} appointments={appointments} />;
//     }
//   };

//   return (
//     <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
//       <Sidebar 
//         currentPage={currentPage} 
//         navigateTo={navigateTo} 
//         unreadAppointments={appointments.filter(a => a.status === 'pending').length}
//         unreadPharmacy={2}
//       />
      
//       <div className="main-content">
//         <Topbar 
//           doctor={doctor} 
//           setDoctor={setDoctor}
//           showNotifications={showNotifications}
//           toggleNotifications={toggleNotifications}
//           notifications={notifications}
//           unreadNotifications={unreadNotifications}
//           markAsRead={markAsRead}
//           clearNotifications={clearNotifications}
//           doctors={mockData.doctors}
//         />
        
//         <div className="content-area">
//           {renderContent()}
//         </div>
//       </div>
//     </div>
//   );
// }

// // Sidebar Component (unchanged)
// // Sidebar Component (added to App.js)
// const Sidebar = ({ currentPage, navigateTo, unreadAppointments, unreadPharmacy }) => {
//   return (
//     <div className="sidebar" style={{ width: '300px' }}>
//       {/* Logo and System Name */}
//       <div className="sidebar-logo">
//         <div className="logo-icon">
//           <i className="fas fa-heartbeat"></i>
//         </div>
//         <div className="system-name">
//           <span>MediCare</span>
//           <span>Dashboard</span>
//         </div>
//       </div>

//       {/* Navigation Links */}
//       <div className="sidebar-nav">
//         <div 
//           className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`}
//           onClick={() => navigateTo('dashboard')}
//         >
//           <i className="fas fa-home"></i>
//           <span>Dashboard</span>
//         </div>

//         <div 
//           className={`nav-item ${currentPage === 'patients' ? 'active' : ''}`}
//           onClick={() => navigateTo('patients')}
//         >
//           <i className="fas fa-user-injured"></i>
//           <span>Patients</span>
//         </div>

//         <div 
//           className={`nav-item ${currentPage === 'doctors' ? 'active' : ''}`}
//           onClick={() => navigateTo('doctors')}
//         >
//           <i className="fas fa-stethoscope"></i>
//           <span>Doctors</span>
//         </div>

//         <div 
//           className={`nav-item ${currentPage === 'appointments' ? 'active' : ''}`}
//           onClick={() => navigateTo('appointments')}
//         >
//           <i className="fas fa-calendar-check"></i>
//           <span>Appointments</span>
//           {unreadAppointments > 0 && (
//             <div className="nav-badge">{unreadAppointments}</div>
//           )}
//         </div>

//         <div 
//           className={`nav-item ${currentPage === 'pharmacy' ? 'active' : ''}`}
//           onClick={() => navigateTo('pharmacy')}
//         >
//           <i className="fas fa-pills"></i>
//           <span>Pharmacy</span>
//           {unreadPharmacy > 0 && (
//             <div className="nav-badge">{unreadPharmacy}</div>
//           )}
//         </div>

//         <div 
//           className={`nav-item ${currentPage === 'records' ? 'active' : ''}`}
//           onClick={() => navigateTo('records')}
//         >
//           <i className="fas fa-file-medical"></i>
//           <span>Medical Records</span>
//         </div>

//         <div 
//           className={`nav-item ${currentPage === 'programs' ? 'active' : ''}`}
//           onClick={() => navigateTo('programs')}
//         >
//           <i className="fas fa-heartbeat"></i>
//           <span>Health Programs</span>
//         </div>

//         <div 
//           className={`nav-item ${currentPage === 'analytics' ? 'active' : ''}`}
//           onClick={() => navigateTo('analytics')}
//         >
//           <i className="fas fa-chart-line"></i>
//           <span>Analytics</span>
//         </div>
//       </div>

//       {/* Settings Section */}
//       <div 
//         className={`nav-item settings-item ${currentPage === 'settings' ? 'active' : ''}`}
//         onClick={() => navigateTo('settings')}
//       >
//         <i className="fas fa-cog"></i>
//         <span>Settings</span>
//       </div>
//     </div>
//   );
// };

// // Topbar Component
// const Topbar = ({ 
//   doctor, 
//   setDoctor, 
//   showNotifications, 
//   toggleNotifications, 
//   notifications, 
//   unreadNotifications, 
//   markAsRead,
//   clearNotifications,
//   doctors
// }) => {
//   const [searchTerm, setSearchTerm] = useState('');
  
//   const handleSearch = (e) => {
//     e.preventDefault();
//     // Real implementation would execute search
//     console.log("Searching for:", searchTerm);
//     // Add notification for demo
//     if (searchTerm) {
//       setNotifications(prev => [
//         { id: Date.now(), message: `Search executed for "${searchTerm}"`, time: "Just now", read: false, type: "search" },
//         ...prev
//       ]);
//     }
//     setSearchTerm('');
//   };

//   return (
//     <div className="topbar">
//       <form className="search-bar" onSubmit={handleSearch}>
//         <i className="fas fa-search"></i>
//         <input 
//           type="text" 
//           placeholder="Search patients, records, appointments..." 
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </form>
      
//       <div className="user-actions">
//         <div 
//           className="notification-icon" 
//           onClick={(e) => {
//             e.stopPropagation();
//             toggleNotifications();
//           }}
//         >
//           <i className="fas fa-bell"></i>
//           {unreadNotifications > 0 && (
//             <div className="badge">{unreadNotifications}</div>
//           )}
          
//           {showNotifications && (
//             <div className="notification-panel">
//               <div className="notification-header">
//                 <div className="notification-title">Notifications</div>
//                 <div className="clear-notifications" onClick={clearNotifications}>Clear All</div>
//               </div>
//               <ul className="notification-list">
//                 {notifications.length > 0 ? (
//                   notifications.map(notification => (
//                     <li 
//                       key={notification.id}
//                       className={`notification-item ${notification.read ? '' : 'unread'} ${notification.type}`}
//                       onClick={() => markAsRead(notification.id)}
//                     >
//                       <div className="notification-icon">
//                         {notification.type === 'appointment' && <i className="fas fa-calendar-check"></i>}
//                         {notification.type === 'lab' && <i className="fas fa-vial"></i>}
//                         {notification.type === 'prescription' && <i className="fas fa-prescription-bottle-alt"></i>}
//                         {notification.type === 'alert' && <i className="fas fa-exclamation-circle"></i>}
//                         {notification.type === 'system' && <i className="fas fa-cog"></i>}
//                         {notification.type === 'error' && <i className="fas fa-exclamation-triangle"></i>}
//                         {notification.type === 'success' && <i className="fas fa-check-circle"></i>}
//                       </div>
//                       <div className="notification-content">
//                         <div className="notification-message">{notification.message}</div>
//                         <div className="notification-time">{notification.time}</div>
//                       </div>
//                     </li>
//                   ))
//                 ) : (
//                   <li className="no-notifications">
//                     <i className="fas fa-check-circle"></i>
//                     <span>No notifications</span>
//                   </li>
//                 )}
//               </ul>
//             </div>
//           )}
//         </div>
        
//         <div className="user-profile">
//           <div className="user-avatar">DR</div>
//           <div className="doctor-selector">
//             <select 
//               value={doctor}
//               onChange={(e) => setDoctor(e.target.value)}
//               className="doctor-dropdown"
//             >
//               {doctors.map(doc => (
//                 <option key={doc.id} value={doc.id}>{doc.name}</option>
//               ))}
//             </select>
//           </div>
//           <i className="fas fa-chevron-down"></i>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Dashboard Page with real-time data
// const DashboardPage = ({ data, appointments }) => {
//   const healthChartRef = useRef(null);
//   const appointmentChartRef = useRef(null);
//   const [healthMetrics, setHealthMetrics] = useState(data.health_metrics);
  
//   // Simulate real-time data updates
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setHealthMetrics(prev => ({
//         ...prev,
//         heart_rate: Math.max(60, Math.min(100, prev.heart_rate + (Math.random() * 4 - 2))),
//         oxygen: Math.max(95, Math.min(100, prev.oxygen + (Math.random() * 0.4 - 0.2)))
//       }));
//     }, 5000);
    
//     return () => clearInterval(interval);
//   }, []);

//   // Health metrics chart
//   useEffect(() => {
//     if (healthChartRef.current) {
//       const ctx = healthChartRef.current.getContext('2d');
//       const chart = new Chart(ctx, {
//         type: 'line',
//         data: {
//           labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
//           datasets: [
//             {
//               label: 'Heart Rate (bpm)',
//               data: [76, 74, 72, 73, 71, 72],
//               borderColor: '#ff5252',
//               backgroundColor: 'rgba(255, 82, 82, 0.1)',
//               tension: 0.4,
//               fill: true
//             },
//             {
//               label: 'Oxygen Saturation (%)',
//               data: [96, 97, 97, 98, 98, 98],
//               borderColor: '#00b8d4',
//               backgroundColor: 'rgba(0, 184, 212, 0.1)',
//               tension: 0.4,
//               fill: true
//             }
//           ]
//         },
//         options: {
//           responsive: true,
//           maintainAspectRatio: false,
//           plugins: {
//             legend: { position: 'top' },
//             title: {
//               display: true,
//               text: 'Patient Health Trends',
//               font: { size: 16 }
//             },
//             tooltip: {
//               callbacks: {
//                 label: function(context) {
//                   return `${context.dataset.label}: ${context.parsed.y}`;
//                 }
//               }
//             }
//           },
//           scales: { 
//             y: { 
//               beginAtZero: false, 
//               min: 60,
//               ticks: {
//                 callback: function(value, index, ticks) {
//                   // 'this' refers to the tick context, but datasetIndex is not available here
//                   // Instead, just return the value as a string, or append a unit if needed
//                   return value;
//                 }
//               }
//             } 
//           }
//         }
//       });
      
//       return () => chart.destroy();
//     }
//   }, []);
  
//   // Appointment stats chart
//   useEffect(() => {
//     if (appointmentChartRef.current) {
//       const ctx = appointmentChartRef.current.getContext('2d');
      
//       // Calculate appointment types
//       const appointmentTypes = {
//         scheduled: appointments.filter(a => a.status === 'scheduled').length,
//         urgent: appointments.filter(a => a.status === 'urgent').length,
//         confirmed: appointments.filter(a => a.status === 'confirmed').length,
//         pending: appointments.filter(a => a.status === 'pending').length
//       };
      
//       const chart = new Chart(ctx, {
//         type: 'doughnut',
//         data: {
//           labels: ['Scheduled', 'Urgent', 'Confirmed', 'Pending'],
//           datasets: [{
//             data: [
//               appointmentTypes.scheduled,
//               appointmentTypes.urgent,
//               appointmentTypes.confirmed,
//               appointmentTypes.pending
//             ],
//             backgroundColor: [
//               'rgba(0, 200, 83, 0.7)',
//               'rgba(255, 82, 82, 0.7)',
//               'rgba(26, 115, 232, 0.7)',
//               'rgba(255, 171, 0, 0.7)'
//             ],
//             borderWidth: 1
//           }]
//         },
//         options: {
//           responsive: true,
//           maintainAspectRatio: false,
//           plugins: {
//             legend: { position: 'bottom' },
//             title: {
//               display: true,
//               text: 'Appointment Status Distribution',
//               font: { size: 16 }
//             },
//             tooltip: {
//               callbacks: {
//                 label: function(context) {
//                   const label = context.label || '';
//                   const value = context.raw || 0;
//                   const total = context.dataset.data.reduce((a, b) => a + b, 0);
//                   const percentage = Math.round((value / total) * 100);
//                   return `${label}: ${value} (${percentage}%)`;
//                 }
//               }
//             }
//           }
//         }
//       });
      
//       return () => chart.destroy();
//     }
//   }, [appointments]);
  
//   return (
//     <div id="dashboard-page">
//       <div className="page-title">
//         <i className="fas fa-home"></i>
//         <span>Healthcare Dashboard</span>
//       </div>
      
//       {/* Stats Cards */}
//       <div className="stats-grid">
//         <StatCard 
//           icon="fas fa-user-injured"
//           color="rgba(26, 115, 232, 0.1)"
//           iconColor="var(--primary)"
//           title="Total Patients"
//           value={data.patient_stats.total}
//           change="12% from last month"
//           changeType="positive"
//         />
        
//         <StatCard 
//           icon="fas fa-calendar-check"
//           color="rgba(0, 200, 83, 0.1)"
//           iconColor="var(--secondary)"
//           title="Today's Appointments"
//           value={data.patient_stats.todays_appointments}
//           change="3 new"
//           changeType="positive"
//         />
        
//         <StatCard 
//           icon="fas fa-prescription-bottle-alt"
//           color="rgba(255, 171, 0, 0.1)"
//           iconColor="var(--warning)"
//           title="Pending Prescriptions"
//           value={data.patient_stats.pending_prescriptions}
//           change="1 critical"
//           changeType="negative"
//         />
        
//         <StatCard 
//           icon="fas fa-vial"
//           color="rgba(255, 82, 82, 0.1)"
//           iconColor="var(--danger)"
//           title="Critical Lab Results"
//           value={data.patient_stats.critical_labs}
//           change="1 new"
//           changeType="negative"
//         />
//       </div>
      
//       {/* Main Dashboard Row */}
//       <div className="dashboard-row">
//         {/* Left Column */}
//         <div>
//           {/* Appointments Card */}
//           <div className="card">
//             <div className="card-header">
//               <div className="card-title">Today's Appointments</div>
//               <div className="card-action">View All</div>
//             </div>
            
//             <ul className="appointment-list">
//               {appointments.map((appointment) => (
//                 <AppointmentItem 
//                   key={appointment.id}
//                   time={appointment.time}
//                   patient={appointment.patient}
//                   doctor={appointment.doctor}
//                   status={appointment.status}
//                   duration={appointment.duration}
//                   reason={appointment.reason}
//                 />
//               ))}
//             </ul>
//           </div>
          
//           {/* Doctors Card */}
//           <div className="card" style={{ marginTop: '30px' }}>
//             <div className="card-header">
//               <div className="card-title">Available Doctors</div>
//               <div className="card-action">Manage</div>
//             </div>
            
//             <div className="doctor-grid">
//               {data.doctors.map((doctor) => (
//                 <DoctorCard 
//                   key={doctor.id}
//                   name={doctor.name}
//                   specialty={doctor.specialty}
//                   patients={doctor.patients}
//                   rating={doctor.rating}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>
        
//         {/* Right Column */}
//         <div>
//           {/* Health Metrics Card */}
//           {/* <div className="card">
//             <div className="card-header">
//               <div className="card-title">Patient Health Metrics</div>
//               <div className="card-action">Details</div>
//             </div> */}
            
//             {/* <div className="health-metrics">
//               <MetricCard 
//                 value={`${healthMetrics.heart_rate} bpm`}
//                 label="Avg Heart Rate"
//                 trend={healthMetrics.heart_rate > 75 ? 'up' : healthMetrics.heart_rate < 70 ? 'down' : 'neutral'}
//               />
              
//               <MetricCard 
//                 value={data.health_metrics.blood_pressure}
//                 label="Avg Blood Pressure"
//               />
              
//               <MetricCard 
//                 value={`${healthMetrics.oxygen}%`}
//                 label="Oxygen Sat."
//                 trend={healthMetrics.oxygen > 97 ? 'up' : healthMetrics.oxygen < 96 ? 'down' : 'neutral'}
//               />
              
//               <MetricCard 
//                 value={data.health_metrics.bmi}
//                 label="Avg BMI"
//               />
//             </div> */}
            
//             {/* <div className="chart-container">
//               <canvas ref={healthChartRef} id="health-chart"></canvas>
//             </div>
//           </div>
//            */}
//           {/* Resource Status Card */}
//           <div className="card" style={{ marginTop: '30px' }}>
//             <div className="card-header">
//               <div className="card-title">Resource Status</div>
//               <div className="card-action">Manage</div>
//             </div>
            
//             <div className="resource-grid">
//               <ResourceCard 
//                 icon="fas fa-procedures"
//                 name="ICU Beds"
//                 stats={`${data.resource_status.icu.occupied}/${data.resource_status.icu.total}`}
//                 progress={Math.round((data.resource_status.icu.occupied / data.resource_status.icu.total) * 100)}
//                 color="var(--warning)"
//               />
              
//               <ResourceCard 
//                 icon="fas fa-lungs"
//                 name="Ventilators"
//                 stats={`${data.resource_status.ventilators.in_use}/${data.resource_status.ventilators.total}`}
//                 progress={Math.round((data.resource_status.ventilators.in_use / data.resource_status.ventilators.total) * 100)}
//                 color="var(--secondary)"
//               />
              
//               <ResourceCard 
//                 icon="fas fa-bed"
//                 name="Isolation Beds"
//                 stats={`${data.resource_status.isolation_beds.occupied}/${data.resource_status.isolation_beds.total}`}
//                 progress={Math.round((data.resource_status.isolation_beds.occupied / data.resource_status.isolation_beds.total) * 100)}
//                 color="var(--secondary)"
//               />
//             </div>
//           </div>
          
//           {/* Telemedicine Card */}
//           <div className="card" style={{ marginTop: '30px' }}>
//             <div className="card-header">
//               <div className="card-title">Telemedicine</div>
//               <div className="card-action">View</div>
//             </div>
            
//             <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
//               <MetricCard 
//                 value={data.telemedicine.eligible}
//                 label="Eligible"
//                 valueStyle={{ color: 'var(--primary)' }}
//               />
              
//               <MetricCard 
//                 value={data.telemedicine.scheduled}
//                 label="Scheduled"
//                 valueStyle={{ color: 'var(--secondary)' }}
//               />
              
//               <MetricCard 
//                 value={data.telemedicine.completed}
//                 label="Completed"
//                 valueStyle={{ color: 'var(--info)' }}
//               />
//             </div>
            
//             <div className="chart-container">
//               <canvas ref={appointmentChartRef} id="appointment-chart"></canvas>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Reusable Components
// const StatCard = ({ icon, color, iconColor, title, value, change, changeType }) => (
//   <div className="stat-card">
//     <div className="stat-icon" style={{ background: color, color: iconColor }}>
//       <i className={icon}></i>
//     </div>
//     <div className="stat-info">
//       <div className="stat-title">{title}</div>
//       <div className="stat-value">{value}</div>
//       <div className={`stat-change ${changeType === 'positive' ? 'change-positive' : 'change-negative'}`}>
//         <i className={`fas fa-arrow-${changeType === 'positive' ? 'up' : 'down'}`}></i> 
//         <span>{change}</span>
//       </div>
//     </div>
//   </div>
// );

// const AppointmentItem = ({ time, patient, doctor, status, duration, reason }) => (
//   <li className="appointment-item">
//     <div className="appointment-time">{time}</div>
//     <div className="appointment-info">
//       <div className="appointment-title">{patient}</div>
//       <div className="appointment-meta">
//         <div><i className="fas fa-user-md"></i> {doctor}</div>
//         <div><i className="fas fa-clock"></i> {duration} min</div>
//       </div>
//       <div className="appointment-reason">{reason}</div>
//     </div>
//     <div className={`appointment-status status-${status}`}>
//       {status.charAt(0).toUpperCase() + status.slice(1)}
//     </div>
//   </li>
// );

// const DoctorCard = ({ name, specialty, patients, rating }) => {
//   const initials = name.split(' ').map(n => n[0]).join('');
  
//   return (
//     <div className="doctor-card">
//       <div className="doctor-avatar">{initials}</div>
//       <div className="doctor-name">{name}</div>
//       <div className="doctor-specialty">{specialty}</div>
//       <div className="doctor-stats">
//         <div><i className="fas fa-user"></i> {patients}</div>
//         <div><i className="fas fa-star"></i> {rating}</div>
//       </div>
//     </div>
//   );
// };

// const MetricCard = ({ value, label, valueStyle = {}, trend }) => (
//   <div className="metric-card">
//     <div className="metric-value" style={valueStyle}>{value}</div>
//     {trend && (
//       <div className={`metric-trend ${trend}`}>
//         <i className={`fas fa-arrow-${trend}`}></i>
//       </div>
//     )}
//     <div className="metric-label">{label}</div>
//   </div>
// );

// const ResourceCard = ({ icon, name, stats, progress, color }) => (
//   <div className="resource-card">
//     <div className="resource-icon" style={{ color }}>
//       <i className={icon}></i>
//     </div>
//     <div className="resource-name">{name}</div>
//     <div className="resource-stats">{stats}</div>
//     <div className="progress-container">
//       <div className="progress-bar" style={{ background: color, width: `${progress}%` }}></div>
//       <div className="progress-text">{progress}% utilized</div>
//     </div>
//   </div>
// );

// // Patients Page with full CRUD functionality
// const PatientsPage = ({ patients, onAddPatient }) => {
//   const [showForm, setShowForm] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     age: '',
//     gender: 'Male',
//     contact: '',
//     conditions: []
//   });
//   const [currentCondition, setCurrentCondition] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
  
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };
  
//   const handleAddCondition = () => {
//     if (currentCondition.trim()) {
//       setFormData(prev => ({
//         ...prev,
//         conditions: [...prev.conditions, currentCondition.trim()]
//       }));
//       setCurrentCondition('');
//     }
//   };
  
//   const handleRemoveCondition = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       conditions: prev.conditions.filter((_, i) => i !== index)
//     }));
//   };
  
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const success = await onAddPatient({
//       ...formData,
//       age: parseInt(formData.age),
//       registered: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
//       status: 'active'
//     });
    
//     if (success) {
//       setFormData({
//         name: '',
//         age: '',
//         gender: 'Male',
//         contact: '',
//         conditions: []
//       });
//       setShowForm(false);
//     }
//   };
  
//   const filteredPatients = patients.filter(patient => {
//     const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
//                           patient.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
//                           patient.contact.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });
  
//   return (
//     <div className="patients-page">
//       <div className="page-header">
//         <div className="page-title">
//           <i className="fas fa-user-injured"></i>
//           <span>Patients Management</span>
//         </div>
//         <button className="btn" onClick={() => setShowForm(!showForm)}>
//           <i className="fas fa-plus"></i> {showForm ? 'Cancel' : 'New Patient'}
//         </button>
//       </div>
      
//       {showForm && (
//         <div className="card patient-form">
//           <div className="card-header">
//             <h3>Add New Patient</h3>
//           </div>
//           <form onSubmit={handleSubmit}>
//             <div className="form-row">
//               <div className="form-group">
//                 <label>Full Name</label>
//                 <input 
//                   type="text" 
//                   name="name" 
//                   value={formData.name} 
//                   onChange={handleInputChange}
//                   required 
//                 />
//               </div>
              
//               <div className="form-group">
//                 <label>Age</label>
//                 <input 
//                   type="number" 
//                   name="age" 
//                   value={formData.age} 
//                   onChange={handleInputChange}
//                   min="1"
//                   max="120"
//                   required 
//                 />
//               </div>
//             </div>
            
//             <div className="form-row">
//               <div className="form-group">
//                 <label>Gender</label>
//                 <select 
//                   name="gender" 
//                   value={formData.gender} 
//                   onChange={handleInputChange}
//                   required
//                 >
//                   <option value="Male">Male</option>
//                   <option value="Female">Female</option>
//                   <option value="Other">Other</option>
//                 </select>
//               </div>
              
//               <div className="form-group">
//                 <label>Contact Email</label>
//                 <input 
//                   type="email" 
//                   name="contact" 
//                   value={formData.contact} 
//                   onChange={handleInputChange}
//                   required 
//                 />
//               </div>
//             </div>
            
//             <div className="form-group">
//               <label>Medical Conditions</label>
//               <div className="conditions-input">
//                 <input 
//                   type="text" 
//                   value={currentCondition} 
//                   onChange={(e) => setCurrentCondition(e.target.value)}
//                   placeholder="Add a condition..."
//                 />
//                 <button 
//                   type="button" 
//                   className="btn-icon"
//                   onClick={handleAddCondition}
//                 >
//                   <i className="fas fa-plus"></i>
//                 </button>
//               </div>
              
//               {formData.conditions.length > 0 && (
//                 <div className="conditions-list">
//                   {formData.conditions.map((condition, index) => (
//                     <div key={index} className="condition-tag">
//                       {condition}
//                       <button 
//                         type="button" 
//                         className="btn-icon"
//                         onClick={() => handleRemoveCondition(index)}
//                       >
//                         <i className="fas fa-times"></i>
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
            
//             <div className="form-actions">
//               <button type="submit" className="save-btn">
//                 Save Patient
//               </button>
//             </div>
//           </form>
//         </div>
//       )}
      
//       {/* Patients Filter */}
//       <div className="card">
//         <div className="card-body patient-filters">
//           <input 
//             type="text" 
//             placeholder="Search patients by name, ID or condition..." 
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <select 
//             className="form-select"
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//           >
//             <option value="all">All Statuses</option>
//             <option value="active">Active</option>
//             <option value="inactive">Inactive</option>
//           </select>
//           <button className="btn">
//             <i className="fas fa-filter"></i> Apply Filters
//           </button>
//         </div>
//       </div>
      
//       {/* Patients Grid */}
//       <div className="patients-grid">
//         {filteredPatients.length > 0 ? (
//           filteredPatients.map(patient => (
//             <PatientCard 
//               key={patient.id}
//               id={patient.id}
//               name={patient.name}
//               status={patient.status}
//               age={patient.age}
//               gender={patient.gender}
//               contact={patient.contact}
//               registered={patient.registered}
//               conditions={patient.conditions}
//             />
//           ))
//         ) : (
//           <div className="no-results">
//             <i className="fas fa-user-injured"></i>
//             <h3>No patients found</h3>
//             <p>Try adjusting your search or filters</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// const PatientCard = ({ id, name, status, age, gender, contact, registered, conditions }) => {
//   const initials = name.split(' ').map(n => n[0]).join('');
  
//   return (
//     <div className="patient-card">
//       <div className="patient-header">
//         <div className="patient-avatar">{initials}</div>
//         <div className="patient-info">
//           <div className="patient-name">{name}</div>
//           <div className="patient-id">ID: {id}</div>
//           <span className={`patient-status ${status === 'active' ? 'status-active' : 'status-inactive'}`}>
//             {status === 'active' ? 'Active' : 'Inactive'}
//           </span>
//         </div>
//       </div>
//       <div className="patient-details">
//         <DetailRow label="Age:" value={age} />
//         <DetailRow label="Gender:" value={gender} />
//         <DetailRow label="Contact:" value={contact} />
//         <DetailRow label="Registered:" value={registered} />
        
//         {conditions.length > 0 && (
//           <div className="detail-row">
//             <div className="detail-label">Conditions:</div>
//             <div className="detail-value conditions">
//               {conditions.map((condition, index) => (
//                 <span key={index} className="condition-tag">{condition}</span>
//               ))}
//             </div>
//           </div>
//         )}
        
//         <div className="action-buttons">
//           <div className="action-btn"><i className="fas fa-user"></i> Profile</div>
//           <div className="action-btn"><i className="fas fa-file-medical"></i> Records</div>
//           <div className="action-btn"><i className="fas fa-calendar"></i> Appointment</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const DetailRow = ({ label, value }) => (
//   <div className="detail-row">
//     <div className="detail-label">{label}</div>
//     <div className="detail-value">{value}</div>
//   </div>
// );

// // Enhanced Doctors Page
// const DoctorsPage = ({ doctors }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [specialtyFilter, setSpecialtyFilter] = useState('all');
  
//   const filteredDoctors = doctors.filter(doctor => {
//     const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
//                           doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesSpecialty = specialtyFilter === 'all' || doctor.specialty === specialtyFilter;
//     return matchesSearch && matchesSpecialty;
//   });
  
//   // Get unique specialties for filter
//   const specialties = [...new Set(doctors.map(d => d.specialty))];
  
//   return (
//     <div className="doctors-page">
//       <div className="page-header">
//         <div className="page-title">
//           <i className="fas fa-stethoscope"></i>
//           <span>Doctors Management</span>
//         </div>
//         <button className="btn">
//           <i className="fas fa-plus"></i> Add Doctor
//         </button>
//       </div>
      
//       {/* Doctors Filter */}
//       <div className="card">
//         <div className="card-body">
//           <input 
//             type="text" 
//             placeholder="Search doctors..." 
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <select 
//             className="form-select"
//             value={specialtyFilter}
//             onChange={(e) => setSpecialtyFilter(e.target.value)}
//           >
//             <option value="all">All Specialties</option>
//             {specialties.map(specialty => (
//               <option key={specialty} value={specialty}>{specialty}</option>
//             ))}
//           </select>
//           <select className="form-select">
//             <option>All Statuses</option>
//             <option>Active</option>
//             <option>Inactive</option>
//             <option>Absent</option>
//           </select>
//           <button className="btn">
//             <i className="fas fa-filter"></i> Apply Filters
//           </button>
//         </div>
//       </div>
      
//       {/* Doctors Grid */}
//       <div className="doctor-grid">
//         {filteredDoctors.map(doctor => (
//           <DoctorProfileCard 
//             key={doctor.id}
//             name={doctor.name}
//             specialty={doctor.specialty}
//             status={doctor.status || "active"}
//             contact={doctor.contact || `${doctor.name.split(' ')[0].toLowerCase()}.${doctor.name.split(' ')[1].toLowerCase()}@medicare.com`}
//             phone={doctor.phone || "(555) 123-4567"}
//             patients={doctor.patients}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// const DoctorProfileCard = ({ name, specialty, status, contact, phone, patients }) => {
//   const initials = name.split(' ').map(n => n[0]).join('');
  
//   return (
//     <div className="doctor-profile-card">
//       <div className="doctor-header">
//         <div className="doctor-avatar-lg">{initials}</div>
//         <div className="doctor-info">
//           <div className="doctor-name-lg">{name}</div>
//           <div className="doctor-specialty-lg">{specialty}</div>
//           <span className={`doctor-status ${status === 'active' ? 'status-active' : status === 'absent' ? 'status-absent' : 'status-inactive'}`}>
//             {status === 'active' ? 'Active' : status === 'absent' ? 'Absent' : 'Inactive'}
//           </span>
//         </div>
//       </div>
//       <div className="doctor-details">
//         <DetailRow label="Contact:" value={contact} />
//         <DetailRow label="Phone:" value={phone} />
//         <DetailRow label="Patients:" value={patients} />
//         <div className="action-buttons">
//           <div className="action-btn"><i className="fas fa-user-md"></i> Profile</div>
//           <div className="action-btn"><i className="fas fa-calendar"></i> Schedule</div>
//           <div className="action-btn"><i className="fas fa-comment"></i> Message</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Settings Page with persistence
// const SettingsPage = ({ darkMode, toggleDarkMode }) => {
//   const [settings, setSettings] = useState({
//     language: 'English',
//     timeFormat: '12-hour format',
//     emailNotifications: true,
//     smsNotifications: false,
//     appointmentReminders: true,
//     twoFactorAuth: false,
//     autoLogout: '30 minutes',
//     dataSharing: false,
//     analyticsTracking: true
//   });
  
//   const handleSettingChange = (name, value) => {
//     setSettings(prev => ({ ...prev, [name]: value }));
//     // In a real app, this would save to backend
//     localStorage.setItem(name, JSON.stringify(value));
//   };
  
//   return (
//     <div className="settings-page">
//       <div className="page-title">
//         <i className="fas fa-cog"></i>
//         <span>System Settings</span>
//       </div>
      
//       {/* General Settings */}
//       <div className="card">
//         <div className="card-header">
//           <h2 className="card-title">General Settings</h2>
//         </div>
//         <div className="card-body">
//           <div className="settings-group">
//             <div className="setting-item">
//               <div>
//                 <div className="setting-label">System Theme</div>
//                 <div className="setting-description">Choose between light and dark mode</div>
//               </div>
//               <label className="toggle-switch">
//                 <input 
//                   type="checkbox" 
//                   checked={darkMode} 
//                   onChange={toggleDarkMode} 
//                 />
//                 <span className="slider"></span>
//               </label>
//             </div>
            
//             <div className="setting-item">
//               <div>
//                 <div className="setting-label">Language</div>
//                 <div className="setting-description">System interface language</div>
//               </div>
//               <select 
//                 className="form-select"
//                 value={settings.language}
//                 onChange={(e) => handleSettingChange('language', e.target.value)}
//               >
//                 <option>English</option>
//                 <option>Spanish</option>
//                 <option>French</option>
//                 <option>German</option>
//               </select>
//             </div>
            
//             <div className="setting-item">
//               <div>
//                 <div className="setting-label">Time Format</div>
//                 <div className="setting-description">Display format for time</div>
//               </div>
//               <select 
//                 className="form-select"
//                 value={settings.timeFormat}
//                 onChange={(e) => handleSettingChange('timeFormat', e.target.value)}
//               >
//                 <option>12-hour format</option>
//                 <option>24-hour format</option>
//               </select>
//             </div>
//           </div>
          
//           <div className="settings-group">
//             <h3 className="settings-title">Notification Settings</h3>
            
//             <div className="setting-item">
//               <div>
//                 <div className="setting-label">Email Notifications</div>
//                 <div className="setting-description">Receive notifications via email</div>
//               </div>
//               <label className="toggle-switch">
//                 <input 
//                   type="checkbox" 
//                   checked={settings.emailNotifications}
//                   onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
//                 />
//                 <span className="slider"></span>
//               </label>
//             </div>
            
//             <div className="setting-item">
//               <div>
//                 <div className="setting-label">SMS Notifications</div>
//                 <div className="setting-description">Receive notifications via SMS</div>
//               </div>
//               <label className="toggle-switch">
//                 <input 
//                   type="checkbox" 
//                   checked={settings.smsNotifications}
//                   onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
//                 />
//                 <span className="slider"></span>
//               </label>
//             </div>
            
//             <div className="setting-item">
//               <div>
//                 <div className="setting-label">Appointment Reminders</div>
//                 <div className="setting-description">Send reminders before appointments</div>
//               </div>
//               <label className="toggle-switch">
//                 <input 
//                   type="checkbox" 
//                   checked={settings.appointmentReminders}
//                   onChange={(e) => handleSettingChange('appointmentReminders', e.target.checked)}
//                 />
//                 <span className="slider"></span>
//               </label>
//             </div>
//           </div>
          
//           <div className="settings-group">
//             <h3 className="settings-title">Security Settings</h3>
            
//             <div className="setting-item">
//               <div>
//                 <div className="setting-label">Two-Factor Authentication</div>
//                 <div className="setting-description">Add an extra layer of security</div>
//               </div>
//               <label className="toggle-switch">
//                 <input 
//                   type="checkbox" 
//                   checked={settings.twoFactorAuth}
//                   onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
//                 />
//                 <span className="slider"></span>
//               </label>
//             </div>
            
//             <div className="setting-item">
//               <div>
//                 <div className="setting-label">Auto Logout</div>
//                 <div className="setting-description">Logout after period of inactivity</div>
//               </div>
//               <select 
//                 className="form-select"
//                 value={settings.autoLogout}
//                 onChange={(e) => handleSettingChange('autoLogout', e.target.value)}
//               >
//                 <option>5 minutes</option>
//                 <option>15 minutes</option>
//                 <option>30 minutes</option>
//                 <option>1 hour</option>
//                 <option>Never</option>
//               </select>
//             </div>
            
//             <div className="setting-item">
//               <div>
//                 <div className="setting-label">Password Update</div>
//                 <div className="setting-description">Last changed 3 months ago</div>
//               </div>
//               <button className="btn">
//                 Change Password
//               </button>
//             </div>
//           </div>
          
//           <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
//             <button className="btn">
//               Cancel
//             </button>
//             <button className="save-btn">
//               Save Changes
//             </button>
//           </div>
//         </div>
//       </div>
      
//       {/* Privacy Settings */}
//       <div className="card" style={{ marginTop: '30px' }}>
//         <div className="card-header">
//           <h2 className="card-title">Privacy Settings</h2>
//         </div>
//         <div className="card-body">
//           <div className="settings-group">
//             <div className="setting-item">
//               <div>
//                 <div className="setting-label">Data Sharing</div>
//                 <div className="setting-description">Allow anonymized data for research</div>
//               </div>
//               <label className="toggle-switch">
//                 <input 
//                   type="checkbox" 
//                   checked={settings.dataSharing}
//                   onChange={(e) => handleSettingChange('dataSharing', e.target.checked)}
//                 />
//                 <span className="slider"></span>
//               </label>
//             </div>
            
//             <div className="setting-item">
//               <div>
//                 <div className="setting-label">Analytics Tracking</div>
//                 <div className="setting-description">Help improve our services</div>
//               </div>
//               <label className="toggle-switch">
//                 <input 
//                   type="checkbox" 
//                   checked={settings.analyticsTracking}
//                   onChange={(e) => handleSettingChange('analyticsTracking', e.target.checked)}
//                 />
//                 <span className="slider"></span>
//               </label>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Enhanced Appointments Page

// const AppointmentsPage = ({ appointments, doctors }) => {
//   const [dateFilter, setDateFilter] = useState('today');
//   const [doctorFilter, setDoctorFilter] = useState('all');
  
//   const filteredAppointments = appointments.filter(appointment => {
//     const matchesDoctor = doctorFilter === 'all' || appointment.doctor === doctors.find(d => d.id === doctorFilter)?.name;
//     return matchesDoctor;
//   });
  
//   return (
//     <div className="appointments-page">
//       <div className="page-header">
//         <div className="page-title">
//           <i className="fas fa-calendar-check"></i>
//           <span>Appointments Management</span>
//         </div>
//         <button className="btn">
//           <i className="fas fa-plus"></i> New Appointment
//         </button>
//       </div>
      
//       {/* Appointments Filter */}
//       <div className="card">
//         <div className="card-body appointment-filters">
//           <select 
//             className="form-select"
//             value={dateFilter}
//             onChange={(e) => setDateFilter(e.target.value)}
//           >
//             <option value="today">Today</option>
//             <option value="tomorrow">Tomorrow</option>
//             <option value="this-week">This Week</option>
//             <option value="next-week">Next Week</option>
//             <option value="this-month">This Month</option>
//           </select>
          
//           <select 
//             className="form-select"
//             value={doctorFilter}
//             onChange={(e) => setDoctorFilter(e.target.value)}
//           >
//             <option value="all">All Doctors</option>
//             {doctors.map(doctor => (
//               <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
//             ))}
//           </select>
          
//           <button className="btn">
//             <i className="fas fa-filter"></i> Apply Filters
//           </button>
//         </div>
//       </div>
      
//       {/* Appointments List */}
//       <div className="card">
//         <div className="card-header">
//           <div className="card-title">Scheduled Appointments</div>
//           <div className="card-action">Export</div>
//         </div>
        
//         <div className="appointments-list">
//           <div className="appointment-header">
//             <div>Time</div>
//             <div>Patient</div>
//             <div>Doctor</div>
//             <div>Reason</div>
//             <div>Status</div>
//             <div>Actions</div>
//           </div>
          
//           {filteredAppointments.map(appointment => (
//             <div key={appointment.id} className="appointment-row">
//               <div className="appointment-time">{appointment.time}</div>
//               <div className="appointment-patient">{appointment.patient}</div>
//               <div className="appointment-doctor">{appointment.doctor}</div>
//               <div className="appointment-reason">{appointment.reason}</div>
//               <div className={`appointment-status status-${appointment.status}`}>
//                 {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
//               </div>
//               <div className="appointment-actions">
//                 <button className="btn-icon">
//                   <i className="fas fa-edit"></i>
//                 </button>
//                 <button className="btn-icon">
//                   <i className="fas fa-calendar-check"></i>
//                 </button>
//                 <button className="btn-icon">
//                   <i className="fas fa-times"></i>
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Other Pages with enhanced implementations
// // Pharmacy Management Page
// const PharmacyPage = () => {
//   const [prescriptions, setPrescriptions] = useState([
//     { id: "RX-1001", patient: "John Smith", medication: "Metformin 500mg", status: "pending", date: "2023-05-15", quantity: 30 },
//     { id: "RX-1002", patient: "Emma Wilson", medication: "Albuterol Inhaler", status: "approved", date: "2023-05-16", quantity: 1 },
//     { id: "RX-1003", patient: "Robert Brown", medication: "Lisinopril 10mg", status: "rejected", date: "2023-05-14", quantity: 90 },
//     { id: "RX-1004", patient: "Lisa Davis", medication: "Atorvastatin 20mg", status: "pending", date: "2023-05-17", quantity: 30 },
//     { id: "RX-1005", patient: "Michael Taylor", medication: "Levothyroxine 50mcg", status: "filled", date: "2023-05-13", quantity: 90 }
//   ]);
  
//   const [inventory, setInventory] = useState([
//     { id: "MED-101", name: "Metformin 500mg", stock: 450, threshold: 100, lastOrder: "2023-05-01" },
//     { id: "MED-102", name: "Lisinopril 10mg", stock: 320, threshold: 50, lastOrder: "2023-05-10" },
//     { id: "MED-103", name: "Atorvastatin 20mg", stock: 280, threshold: 75, lastOrder: "2023-04-25" },
//     { id: "MED-104", name: "Albuterol Inhaler", stock: 45, threshold: 20, lastOrder: "2023-05-05" },
//     { id: "MED-105", name: "Levothyroxine 50mcg", stock: 210, threshold: 100, lastOrder: "2023-04-30" }
//   ]);
  
//   const [newPrescription, setNewPrescription] = useState({
//     patient: '',
//     medication: '',
//     dosage: '',
//     frequency: '',
//     quantity: 30,
//     instructions: ''
//   });
  
//   const [showNewForm, setShowNewForm] = useState(false);
//   const [filterStatus, setFilterStatus] = useState('all');
  
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewPrescription(prev => ({ ...prev, [name]: value }));
//   };
  
//   const handleAddPrescription = () => {
//     if (newPrescription.patient && newPrescription.medication) {
//       const newRx = {
//         id: `RX-${Math.floor(1000 + Math.random() * 9000)}`,
//         patient: newPrescription.patient,
//         medication: newPrescription.medication,
//         status: "pending",
//         date: new Date().toISOString().split('T')[0],
//         quantity: parseInt(newPrescription.quantity),
//         dosage: newPrescription.dosage,
//         frequency: newPrescription.frequency,
//         instructions: newPrescription.instructions
//       };
      
//       setPrescriptions(prev => [newRx, ...prev]);
      
//       // Update inventory
//       const medIndex = inventory.findIndex(item => item.name === newPrescription.medication);
//       if (medIndex !== -1) {
//         const updatedInventory = [...inventory];
//         updatedInventory[medIndex].stock -= parseInt(newPrescription.quantity);
//         setInventory(updatedInventory);
//       }
      
//       setNewPrescription({
//         patient: '',
//         medication: '',
//         dosage: '',
//         frequency: '',
//         quantity: 30,
//         instructions: ''
//       });
//       setShowNewForm(false);
//     }
//   };
  
//   const updatePrescriptionStatus = (id, status) => {
//     setPrescriptions(prescriptions.map(rx => 
//       rx.id === id ? {...rx, status} : rx
//     ));
//   };
  
//   const filteredPrescriptions = filterStatus === 'all' 
//     ? prescriptions 
//     : prescriptions.filter(rx => rx.status === filterStatus);
  
//   const lowStockItems = inventory.filter(item => item.stock < item.threshold);
  
//   return (
//     <div className="pharmacy-page">
//       <div className="page-header">
//         <div className="page-title">
//           <i className="fas fa-pills"></i>
//           <span>Pharmacy Management</span>
//         </div>
//         <button className="btn" onClick={() => setShowNewForm(!showNewForm)}>
//           <i className="fas fa-plus"></i> {showNewForm ? 'Cancel' : 'New Prescription'}
//         </button>
//       </div>
      
//       {showNewForm && (
//         <div className="card">
//           <div className="card-header">
//             <h3>New Prescription</h3>
//           </div>
//           <div className="card-body">
//             <div className="form-row">
//               <div className="form-group">
//                 <label>Patient</label>
//                 <input 
//                   type="text" 
//                   name="patient" 
//                   value={newPrescription.patient} 
//                   onChange={handleInputChange}
//                   placeholder="Patient Name"
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Medication</label>
//                 <select 
//                   name="medication" 
//                   value={newPrescription.medication} 
//                   onChange={handleInputChange}
//                   required
//                 >
//                   <option value="">Select Medication</option>
//                   {inventory.map(med => (
//                     <option key={med.id} value={med.name}>
//                       {med.name} (Stock: {med.stock})
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
            
//             <div className="form-row">
//               <div className="form-group">
//                 <label>Dosage</label>
//                 <input 
//                   type="text" 
//                   name="dosage" 
//                   value={newPrescription.dosage} 
//                   onChange={handleInputChange}
//                   placeholder="e.g., 500mg"
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Frequency</label>
//                 <input 
//                   type="text" 
//                   name="frequency" 
//                   value={newPrescription.frequency} 
//                   onChange={handleInputChange}
//                   placeholder="e.g., Twice daily"
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Quantity</label>
//                 <input 
//                   type="number" 
//                   name="quantity" 
//                   value={newPrescription.quantity} 
//                   onChange={handleInputChange}
//                   min="1"
//                   max="90"
//                   required
//                 />
//               </div>
//             </div>
            
//             <div className="form-group">
//               <label>Instructions</label>
//               <textarea 
//                 name="instructions" 
//                 value={newPrescription.instructions} 
//                 onChange={handleInputChange}
//                 placeholder="Special instructions for the patient"
//               />
//             </div>
            
//             <div className="form-actions">
//               <button className="btn" onClick={() => setShowNewForm(false)}>
//                 Cancel
//               </button>
//               <button className="save-btn" onClick={handleAddPrescription}>
//                 Save Prescription
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
      
//       <div className="pharmacy-dashboard">
//         {/* Prescription Management */}
//         <div className="card">
//           <div className="card-header">
//             <div className="card-title">Prescription Management</div>
//             <div className="filter-group">
//               <select 
//                 className="form-select"
//                 value={filterStatus}
//                 onChange={(e) => setFilterStatus(e.target.value)}
//               >
//                 <option value="all">All Statuses</option>
//                 <option value="pending">Pending</option>
//                 <option value="approved">Approved</option>
//                 <option value="rejected">Rejected</option>
//                 <option value="filled">Filled</option>
//               </select>
//               <input type="text" placeholder="Search prescriptions..." />
//             </div>
//           </div>
          
//           <div className="prescription-list">
//             <div className="prescription-header">
//               <div>ID</div>
//               <div>Patient</div>
//               <div>Medication</div>
//               <div>Date</div>
//               <div>Status</div>
//               <div>Actions</div>
//             </div>
            
//             {filteredPrescriptions.map(rx => (
//               <div key={rx.id} className={`prescription-item status-${rx.status}`}>
//                 <div className="prescription-id">{rx.id}</div>
//                 <div className="prescription-patient">{rx.patient}</div>
//                 <div className="prescription-medication">{rx.medication}</div>
//                 <div className="prescription-date">{rx.date}</div>
//                 <div className="prescription-status">{rx.status}</div>
//                 <div className="prescription-actions">
//                   {rx.status === 'pending' && (
//                     <>
//                       <button 
//                         className="btn-icon success"
//                         onClick={() => updatePrescriptionStatus(rx.id, 'approved')}
//                       >
//                         <i className="fas fa-check"></i>
//                       </button>
//                       <button 
//                         className="btn-icon danger"
//                         onClick={() => updatePrescriptionStatus(rx.id, 'rejected')}
//                       >
//                         <i className="fas fa-times"></i>
//                       </button>
//                     </>
//                   )}
//                   {rx.status === 'approved' && (
//                     <button 
//                       className="btn-icon"
//                       onClick={() => updatePrescriptionStatus(rx.id, 'filled')}
//                     >
//                       <i className="fas fa-check-circle"></i> Mark as Filled
//                     </button>
//                   )}
//                   <button className="btn-icon">
//                     <i className="fas fa-print"></i>
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
        
//         {/* Inventory Management */}
//         <div className="card" style={{ marginTop: '20px' }}>
//           <div className="card-header">
//             <div className="card-title">Medication Inventory</div>
//             <button className="btn">
//               <i className="fas fa-plus"></i> Reorder Stock
//             </button>
//           </div>
          
//           {lowStockItems.length > 0 && (
//             <div className="inventory-alert">
//               <i className="fas fa-exclamation-triangle"></i>
//               <span>{lowStockItems.length} medications below stock threshold</span>
//             </div>
//           )}
          
//           <div className="inventory-grid">
//             {inventory.map(med => (
//               <div key={med.id} className={`inventory-item ${med.stock < med.threshold ? 'low-stock' : ''}`}>
//                 <div className="inventory-name">{med.name}</div>
//                 <div className="inventory-stock">
//                   <div className="stock-value">{med.stock}</div>
//                   <div className="stock-label">in stock</div>
//                 </div>
//                 <div className="inventory-threshold">
//                   Threshold: {med.threshold}
//                 </div>
//                 <div className="inventory-last-order">
//                   Last order: {med.lastOrder}
//                 </div>
//                 <button className="btn-icon">
//                   <i className="fas fa-box"></i> Reorder
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Medical Records Page
// const RecordsPage = ({ patients }) => {
//   const [selectedPatient, setSelectedPatient] = useState(null);
//   const [medicalRecords, setMedicalRecords] = useState([
//     { id: "REC-1001", patientId: "PT-1001", date: "2023-05-15", type: "Visit Note", provider: "Dr. Sarah Johnson", diagnosis: "Type 2 Diabetes" },
//     { id: "REC-1002", patientId: "PT-1001", date: "2023-04-10", type: "Lab Result", provider: "MedLab Inc", test: "HbA1c", result: "7.2%" },
//     { id: "REC-1003", patientId: "PT-1001", date: "2023-03-22", type: "Imaging", provider: "Radiology Center", study: "Chest X-ray", findings: "Normal" },
//     { id: "REC-1004", patientId: "PT-1002", date: "2023-05-18", type: "Visit Note", provider: "Dr. Michael Chen", diagnosis: "Asthma exacerbation" },
//     { id: "REC-1005", patientId: "PT-1003", date: "2023-05-10", type: "Procedure", provider: "Dr. Robert Williams", procedure: "Knee injection" }
//   ]);
  
//   const [newRecord, setNewRecord] = useState({
//     type: 'Visit Note',
//     date: new Date().toISOString().split('T')[0],
//     provider: '',
//     diagnosis: '',
//     notes: ''
//   });
  
//   const [showRecordForm, setShowRecordForm] = useState(false);
  
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewRecord(prev => ({ ...prev, [name]: value }));
//   };
  
//   const handleAddRecord = () => {
//     if (selectedPatient && newRecord.type) {
//       const record = {
//         id: `REC-${Math.floor(1000 + Math.random() * 9000)}`,
//         patientId: selectedPatient.id,
//         ...newRecord
//       };
      
//       setMedicalRecords(prev => [record, ...prev]);
      
//       setNewRecord({
//         type: 'Visit Note',
//         date: new Date().toISOString().split('T')[0],
//         provider: '',
//         diagnosis: '',
//         notes: ''
//       });
//       setShowRecordForm(false);
//     }
//   };
  
//   const patientRecords = selectedPatient 
//     ? medicalRecords.filter(record => record.patientId === selectedPatient.id) 
//     : [];
  
//   return (
//     <div className="records-page">
//       <div className="page-header">
//         <div className="page-title">
//           <i className="fas fa-file-medical"></i>
//           <span>Medical Records</span>
//         </div>
//         <button 
//           className="btn" 
//           disabled={!selectedPatient}
//           onClick={() => setShowRecordForm(true)}
//         >
//           <i className="fas fa-plus"></i> Add Record
//         </button>
//       </div>
      
//       <div className="records-container">
//         {/* Patient Selector */}
//         <div className="card">
//           <div className="card-header">
//             <h3>Select Patient</h3>
//           </div>
//           <div className="patient-selector">
//             {patients.map(patient => (
//               <div 
//                 key={patient.id} 
//                 className={`patient-selector-item ${selectedPatient?.id === patient.id ? 'selected' : ''}`}
//                 onClick={() => setSelectedPatient(patient)}
//               >
//                 <div className="patient-avatar">
//                   {patient.name.split(' ').map(n => n[0]).join('')}
//                 </div>
//                 <div className="patient-info">
//                   <div className="patient-name">{patient.name}</div>
//                   <div className="patient-id">ID: {patient.id}</div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
        
//         {/* Records Management */}
//         <div className="card">
//           <div className="card-header">
//             <h3>
//               {selectedPatient 
//                 ? `${selectedPatient.name}'s Medical Records` 
//                 : "Select a patient to view records"}
//             </h3>
//             <input type="text" placeholder="Search records..." />
//           </div>
          
//           {showRecordForm && (
//             <div className="record-form">
//               <div className="form-row">
//                 <div className="form-group">
//                   <label>Record Type</label>
//                   <select 
//                     name="type" 
//                     value={newRecord.type} 
//                     onChange={handleInputChange}
//                     required
//                   >
//                     <option value="Visit Note">Visit Note</option>
//                     <option value="Lab Result">Lab Result</option>
//                     <option value="Imaging">Imaging Study</option>
//                     <option value="Procedure">Procedure Note</option>
//                     <option value="Prescription">Prescription</option>
//                   </select>
//                 </div>
                
//                 <div className="form-group">
//                   <label>Date</label>
//                   <input 
//                     type="date" 
//                     name="date" 
//                     value={newRecord.date} 
//                     onChange={handleInputChange}
//                     required
//                   />
//                 </div>
                
//                 <div className="form-group">
//                   <label>Provider</label>
//                   <input 
//                     type="text" 
//                     name="provider" 
//                     value={newRecord.provider} 
//                     onChange={handleInputChange}
//                     placeholder="Provider name"
//                     required
//                   />
//                 </div>
//               </div>
              
//               {newRecord.type === 'Visit Note' && (
//                 <div className="form-group">
//                   <label>Diagnosis</label>
//                   <input 
//                     type="text" 
//                     name="diagnosis" 
//                     value={newRecord.diagnosis} 
//                     onChange={handleInputChange}
//                     placeholder="Primary diagnosis"
//                   />
//                 </div>
//               )}
              
//               {newRecord.type === 'Lab Result' && (
//                 <div className="form-row">
//                   <div className="form-group">
//                     <label>Test Name</label>
//                     <input 
//                       type="text" 
//                       name="test" 
//                       value={newRecord.test || ''} 
//                       onChange={handleInputChange}
//                       placeholder="Test name"
//                     />
//                   </div>
//                   <div className="form-group">
//                     <label>Result</label>
//                     <input 
//                       type="text" 
//                       name="result" 
//                       value={newRecord.result || ''} 
//                       onChange={handleInputChange}
//                       placeholder="Test result"
//                     />
//                   </div>
//                 </div>
//               )}
              
//               <div className="form-group">
//                 <label>Notes</label>
//                 <textarea 
//                   name="notes" 
//                   value={newRecord.notes} 
//                   onChange={handleInputChange}
//                   placeholder="Clinical notes..."
//                   rows="4"
//                 />
//               </div>
              
//               <div className="form-actions">
//                 <button 
//                   className="btn" 
//                   onClick={() => setShowRecordForm(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button 
//                   className="save-btn" 
//                   onClick={handleAddRecord}
//                 >
//                   Save Record
//                 </button>
//               </div>
//             </div>
//           )}
          
//           {selectedPatient && (
//             <div className="records-list">
//               {patientRecords.length > 0 ? (
//                 patientRecords.map(record => (
//                   <div key={record.id} className="record-item">
//                     <div className="record-header">
//                       <div className="record-type">{record.type}</div>
//                       <div className="record-date">{record.date}</div>
//                     </div>
//                     <div className="record-provider">
//                       Provider: {record.provider}
//                     </div>
//                     {record.diagnosis && (
//                       <div className="record-diagnosis">
//                         Diagnosis: {record.diagnosis}
//                       </div>
//                     )}
//                     {record.test && (
//                       <div className="record-test">
//                         Test: {record.test} = {record.result}
//                       </div>
//                     )}
//                     {record.notes && (
//                       <div className="record-notes">
//                         {record.notes}
//                       </div>
//                     )}
//                     <div className="record-actions">
//                       <button className="btn-icon">
//                         <i className="fas fa-print"></i> Print
//                       </button>
//                       <button className="btn-icon">
//                         <i className="fas fa-share-alt"></i> Share
//                       </button>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="no-records">
//                   <i className="fas fa-file-medical-alt"></i>
//                   <h4>No medical records found</h4>
//                   <p>Add a new record or select another patient</p>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Health Programs Page
// const ProgramsPage = () => {
//   const [programs, setPrograms] = useState([
//     { id: "PROG-101", name: "Diabetes Management", participants: 42, status: "active", startDate: "2023-01-15" },
//     { id: "PROG-102", name: "Cardiac Rehabilitation", participants: 28, status: "active", startDate: "2023-03-01" },
//     { id: "PROG-103", name: "Weight Management", participants: 65, status: "active", startDate: "2022-11-10" },
//     { id: "PROG-104", name: "Smoking Cessation", participants: 19, status: "completed", startDate: "2023-02-20", endDate: "2023-05-20" },
//     { id: "PROG-105", name: "Pulmonary Rehabilitation", participants: 15, status: "upcoming", startDate: "2023-06-01" }
//   ]);
  
//   const [enrollments, setEnrollments] = useState([
//     { id: "ENR-1001", patient: "John Smith", program: "PROG-101", status: "active", startDate: "2023-02-10", progress: 65 },
//     { id: "ENR-1002", patient: "Emma Wilson", program: "PROG-103", status: "active", startDate: "2023-01-20", progress: 80 },
//     { id: "ENR-1003", patient: "Robert Brown", program: "PROG-102", status: "completed", startDate: "2023-03-05", endDate: "2023-05-15", progress: 100 },
//     { id: "ENR-1004", patient: "Lisa Davis", program: "PROG-101", status: "active", startDate: "2023-04-22", progress: 30 },
//     { id: "ENR-1005", patient: "Michael Taylor", program: "PROG-103", status: "active", startDate: "2022-12-01", progress: 95 }
//   ]);
  
//   const [activeTab, setActiveTab] = useState('programs');
//   const [newProgram, setNewProgram] = useState({
//     name: '',
//     description: '',
//     type: 'Chronic Disease',
//     status: 'upcoming',
//     startDate: new Date().toISOString().split('T')[0]
//   });
  
//   const [showProgramForm, setShowProgramForm] = useState(false);
  
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewProgram(prev => ({ ...prev, [name]: value }));
//   };
  
//   const handleAddProgram = () => {
//     if (newProgram.name) {
//       const program = {
//         id: `PROG-${Math.floor(1000 + Math.random() * 9000)}`,
//         name: newProgram.name,
//         description: newProgram.description,
//         type: newProgram.type,
//         status: newProgram.status,
//         startDate: newProgram.startDate,
//         participants: 0
//       };
      
//       setPrograms(prev => [program, ...prev]);
      
//       setNewProgram({
//         name: '',
//         description: '',
//         type: 'Chronic Disease',
//         status: 'upcoming',
//         startDate: new Date().toISOString().split('T')[0]
//       });
//       setShowProgramForm(false);
//     }
//   };
  
//   const updateEnrollmentStatus = (id, status) => {
//     setEnrollments(enrollments.map(enrollment => 
//       enrollment.id === id ? {...enrollment, status} : enrollment
//     ));
//   };
  
//   const activePrograms = programs.filter(p => p.status === 'active');
  
//   return (
//     <div className="programs-page">
//       <div className="page-header">
//         <div className="page-title">
//           <i className="fas fa-heartbeat"></i>
//           <span>Health Programs</span>
//         </div>
//         <button className="btn" onClick={() => setShowProgramForm(true)}>
//           <i className="fas fa-plus"></i> New Program
//         </button>
//       </div>
      
//       {/* Tabs */}
//       <div className="tabs">
//         <div 
//           className={`tab ${activeTab === 'programs' ? 'active' : ''}`}
//           onClick={() => setActiveTab('programs')}
//         >
//           <i className="fas fa-project-diagram"></i> Programs
//         </div>
//         <div 
//           className={`tab ${activeTab === 'participants' ? 'active' : ''}`}
//           onClick={() => setActiveTab('participants')}
//         >
//           <i className="fas fa-users"></i> Participants
//         </div>
//         <div 
//           className={`tab ${activeTab === 'reports' ? 'active' : ''}`}
//           onClick={() => setActiveTab('reports')}
//         >
//           <i className="fas fa-chart-bar"></i> Reports
//         </div>
//       </div>
      
//       {showProgramForm && (
//         <div className="card">
//           <div className="card-header">
//             <h3>Create New Health Program</h3>
//           </div>
//           <div className="card-body">
//             <div className="form-row">
//               <div className="form-group">
//                 <label>Program Name</label>
//                 <input 
//                   type="text" 
//                   name="name" 
//                   value={newProgram.name} 
//                   onChange={handleInputChange}
//                   placeholder="Program name"
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Program Type</label>
//                 <select 
//                   name="type" 
//                   value={newProgram.type} 
//                   onChange={handleInputChange}
//                   required
//                 >
//                   <option value="Chronic Disease">Chronic Disease Management</option>
//                   <option value="Rehabilitation">Rehabilitation</option>
//                   <option value="Preventive">Preventive Care</option>
//                   <option value="Wellness">Wellness Program</option>
//                   <option value="Behavioral">Behavioral Health</option>
//                 </select>
//               </div>
//             </div>
            
//             <div className="form-group">
//               <label>Description</label>
//               <textarea 
//                 name="description" 
//                 value={newProgram.description} 
//                 onChange={handleInputChange}
//                 placeholder="Program description..."
//                 rows="3"
//               />
//             </div>
            
//             <div className="form-row">
//               <div className="form-group">
//                 <label>Status</label>
//                 <select 
//                   name="status" 
//                   value={newProgram.status} 
//                   onChange={handleInputChange}
//                   required
//                 >
//                   <option value="upcoming">Upcoming</option>
//                   <option value="active">Active</option>
//                   <option value="paused">Paused</option>
//                   <option value="completed">Completed</option>
//                 </select>
//               </div>
              
//               <div className="form-group">
//                 <label>Start Date</label>
//                 <input 
//                   type="date" 
//                   name="startDate" 
//                   value={newProgram.startDate} 
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>
//             </div>
            
//             <div className="form-actions">
//               <button 
//                 className="btn" 
//                 onClick={() => setShowProgramForm(false)}
//               >
//                 Cancel
//               </button>
//               <button 
//                 className="save-btn" 
//                 onClick={handleAddProgram}
//               >
//                 Create Program
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
      
//       {activeTab === 'programs' && (
//         <div className="programs-grid">
//           {programs.map(program => (
//             <div key={program.id} className={`program-card status-${program.status}`}>
//               <div className="program-header">
//                 <div className="program-name">{program.name}</div>
//                 <div className="program-status">{program.status}</div>
//               </div>
//               <div className="program-type">{program.type}</div>
//               <div className="program-stats">
//                 <div className="stat">
//                   <i className="fas fa-users"></i>
//                   {program.participants} Participants
//                 </div>
//                 <div className="stat">
//                   <i className="fas fa-calendar"></i>
//                   {program.startDate}
//                 </div>
//               </div>
//               <div className="program-description">
//                 {program.description || "No description available"}
//               </div>
//               <div className="program-actions">
//                 <button className="btn">
//                   <i className="fas fa-eye"></i> View Details
//                 </button>
//                 <button className="btn">
//                   <i className="fas fa-user-plus"></i> Enroll Patients
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
      
//       {activeTab === 'participants' && (
//         <div className="card">
//           <div className="card-header">
//             <div className="card-title">Program Participants</div>
//             <select className="form-select">
//               <option>All Programs</option>
//               {activePrograms.map(program => (
//                 <option key={program.id} value={program.id}>{program.name}</option>
//               ))}
//             </select>
//           </div>
          
//           <div className="participants-list">
//             <div className="participant-header">
//               <div>Patient</div>
//               <div>Program</div>
//               <div>Start Date</div>
//               <div>Progress</div>
//               <div>Status</div>
//               <div>Actions</div>
//             </div>
            
//             {enrollments.map(enrollment => (
//               <div key={enrollment.id} className="participant-item">
//                 <div className="participant-patient">{enrollment.patient}</div>
//                 <div className="participant-program">
//                   {programs.find(p => p.id === enrollment.program)?.name || enrollment.program}
//                 </div>
//                 <div className="participant-start">{enrollment.startDate}</div>
//                 <div className="participant-progress">
//                   <div className="progress-bar">
//                     <div 
//                       className="progress-fill" 
//                       style={{ width: `${enrollment.progress}%` }}
//                     ></div>
//                   </div>
//                   <div className="progress-text">{enrollment.progress}%</div>
//                 </div>
//                 <div className={`participant-status status-${enrollment.status}`}>
//                   {enrollment.status}
//                 </div>
//                 <div className="participant-actions">
//                   {enrollment.status === 'active' && (
//                     <button 
//                       className="btn-icon success"
//                       onClick={() => updateEnrollmentStatus(enrollment.id, 'completed')}
//                     >
//                       <i className="fas fa-check"></i> Complete
//                     </button>
//                   )}
//                   <button className="btn-icon">
//                     <i className="fas fa-chart-line"></i> Progress
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
      
//       {activeTab === 'reports' && (
//         <div className="card">
//           <div className="card-header">
//             <div className="card-title">Program Analytics</div>
//             <select className="form-select">
//               <option>Overall Summary</option>
//               {programs.map(program => (
//                 <option key={program.id} value={program.id}>{program.name} Report</option>
//               ))}
//             </select>
//           </div>
          
//           <div className="program-analytics">
//             <div className="analytics-row">
//               <div className="metric-card">
//                 <div className="metric-value">87%</div>
//                 <div className="metric-label">Average Completion Rate</div>
//               </div>
//               <div className="metric-card">
//                 <div className="metric-value">4.2/5</div>
//                 <div className="metric-label">Participant Satisfaction</div>
//               </div>
//               <div className="metric-card">
//                 <div className="metric-value">42%</div>
//                 <div className="metric-label">Health Outcome Improvement</div>
//               </div>
//             </div>
            
//             <div className="chart-container">
//               <canvas id="program-chart"></canvas>
//             </div>
            
//             <div className="program-comparison">
//               <h4>Program Effectiveness</h4>
//               <table>
//                 <thead>
//                   <tr>
//                     <th>Program</th>
//                     <th>Participants</th>
//                     <th>Completion Rate</th>
//                     <th>Satisfaction</th>
//                     <th>Health Improvement</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {programs.map(program => (
//                     <tr key={program.id}>
//                       <td>{program.name}</td>
//                       <td>{program.participants}</td>
//                       <td>{(Math.random() * 30 + 70).toFixed(0)}%</td>
//                       <td>{(Math.random() + 3.5).toFixed(1)}/5</td>
//                       <td>{(Math.random() * 30 + 30).toFixed(0)}%</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Analytics Page
// const AnalyticsPage = () => {
//   const [activeTab, setActiveTab] = useState('overview');
//   const [dateRange, setDateRange] = useState('last30');
//   const [departmentFilter, setDepartmentFilter] = useState('all');
  
//   // Mock analytics data
//   const analyticsData = {
//     overview: {
//       totalPatients: 1245,
//       newPatients: 42,
//       avgWaitTime: 15,
//       satisfaction: 4.7
//     },
//     financial: {
//       revenue: 245832,
//       expenses: 187945,
//       outstanding: 42875,
//       collections: 92.4
//     },
//     clinical: {
//       readmissionRate: 8.2,
//       avgHospitalStay: 4.5,
//       infectionRate: 1.8,
//       mortalityRate: 2.1
//     }
//   };
  
//   // Mock department data
//   const departments = [
//     { id: 'cardio', name: 'Cardiology', patients: 320, revenue: 84250 },
//     { id: 'neuro', name: 'Neurology', patients: 285, revenue: 76500 },
//     { id: 'ortho', name: 'Orthopedics', patients: 198, revenue: 62300 },
//     { id: 'peds', name: 'Pediatrics', patients: 312, revenue: 56700 },
//     { id: 'onco', name: 'Oncology', patients: 175, revenue: 105200 }
//   ];
  
//   // Mock patient demographics
//   const demographics = [
//     { ageGroup: '0-18', count: 215, percentage: 17.3 },
//     { ageGroup: '19-35', count: 320, percentage: 25.7 },
//     { ageGroup: '36-50', count: 285, percentage: 22.9 },
//     { ageGroup: '51-65', count: 245, percentage: 19.7 },
//     { ageGroup: '65+', count: 180, percentage: 14.5 }
//   ];
  
//   const filteredDepartments = departmentFilter === 'all' 
//     ? departments 
//     : departments.filter(dept => dept.id === departmentFilter);
  
//   return (
//     <div className="analytics-page">
//       <div className="page-header">
//         <div className="page-title">
//           <i className="fas fa-chart-line"></i>
//           <span>Healthcare Analytics</span>
//         </div>
//         <div className="date-filter">
//           <select 
//             className="form-select"
//             value={dateRange}
//             onChange={(e) => setDateRange(e.target.value)}
//           >
//             <option value="last7">Last 7 Days</option>
//             <option value="last30">Last 30 Days</option>
//             <option value="last90">Last 90 Days</option>
//             <option value="ytd">Year to Date</option>
//             <option value="full">Full Year</option>
//           </select>
//         </div>
//       </div>
      
//       {/* Tabs */}
//       <div className="tabs">
//         <div 
//           className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
//           onClick={() => setActiveTab('overview')}
//         >
//           <i className="fas fa-home"></i> Overview
//         </div>
//         <div 
//           className={`tab ${activeTab === 'financial' ? 'active' : ''}`}
//           onClick={() => setActiveTab('financial')}
//         >
//           <i className="fas fa-dollar-sign"></i> Financial
//         </div>
//         <div 
//           className={`tab ${activeTab === 'clinical' ? 'active' : ''}`}
//           onClick={() => setActiveTab('clinical')}
//         >
//           <i className="fas fa-heartbeat"></i> Clinical
//         </div>
//         <div 
//           className={`tab ${activeTab === 'operations' ? 'active' : ''}`}
//           onClick={() => setActiveTab('operations')}
//         >
//           <i className="fas fa-clipboard-list"></i> Operations
//         </div>
//       </div>
      
//       {activeTab === 'overview' && (
//         <div className="analytics-overview">
//           <div className="stats-grid">
//             <StatCard 
//               icon="fas fa-user-injured"
//               color="rgba(26, 115, 232, 0.1)"
//               iconColor="var(--primary)"
//               title="Total Patients"
//               value={analyticsData.overview.totalPatients}
//               change="5.2% from last period"
//               changeType="positive"
//             />
            
//             <StatCard 
//               icon="fas fa-user-plus"
//               color="rgba(0, 200, 83, 0.1)"
//               iconColor="var(--secondary)"
//               title="New Patients"
//               value={analyticsData.overview.newPatients}
//               change="12 new this month"
//               changeType="positive"
//             />
            
//             <StatCard 
//               icon="fas fa-clock"
//               color="rgba(255, 171, 0, 0.1)"
//               iconColor="var(--warning)"
//               title="Avg. Wait Time"
//               value={`${analyticsData.overview.avgWaitTime} min`}
//               change="2 min improvement"
//               changeType="positive"
//             />
            
//             <StatCard 
//               icon="fas fa-smile"
//               color="rgba(156, 39, 176, 0.1)"
//               iconColor="var(--purple)"
//               title="Satisfaction"
//               value={analyticsData.overview.satisfaction}
//               change="0.3 increase"
//               changeType="positive"
//             />
//           </div>
          
//           <div className="analytics-row">
//             <div className="card">
//               <div className="card-header">
//                 <h3>Patient Demographics</h3>
//               </div>
//               <div className="demographics-chart">
//                 <canvas id="demographics-chart"></canvas>
//               </div>
//             </div>
            
//             <div className="card">
//               <div className="card-header">
//                 <h3>Department Performance</h3>
//                 <select 
//                   className="form-select"
//                   value={departmentFilter}
//                   onChange={(e) => setDepartmentFilter(e.target.value)}
//                 >
//                   <option value="all">All Departments</option>
//                   {departments.map(dept => (
//                     <option key={dept.id} value={dept.id}>{dept.name}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="department-performance">
//                 <table>
//                   <thead>
//                     <tr>
//                       <th>Department</th>
//                       <th>Patients</th>
//                       <th>Revenue</th>
//                       <th>Avg. Cost</th>
//                       <th>Utilization</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredDepartments.map(dept => (
//                       <tr key={dept.id}>
//                         <td>{dept.name}</td>
//                         <td>{dept.patients}</td>
//                         <td>${dept.revenue.toLocaleString()}</td>
//                         <td>${Math.round(dept.revenue / dept.patients).toLocaleString()}</td>
//                         <td>{(Math.random() * 30 + 70).toFixed(0)}%</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
          
//           <div className="card">
//             <div className="card-header">
//               <h3>Patient Volume Trends</h3>
//             </div>
//             <div className="trend-chart">
//               <canvas id="volume-trend-chart"></canvas>
//             </div>
//           </div>
//         </div>
//       )}
      
//       {activeTab === 'financial' && (
//         <div className="analytics-financial">
//           <div className="stats-grid">
//             <StatCard 
//               icon="fas fa-money-bill-wave"
//               color="rgba(0, 200, 83, 0.1)"
//               iconColor="var(--secondary)"
//               title="Total Revenue"
//               value={`$${analyticsData.financial.revenue.toLocaleString()}`}
//               change="8.3% increase"
//               changeType="positive"
//             />
            
//             <StatCard 
//               icon="fas fa-file-invoice-dollar"
//               color="rgba(255, 171, 0, 0.1)"
//               iconColor="var(--warning)"
//               title="Outstanding"
//               value={`$${analyticsData.financial.outstanding.toLocaleString()}`}
//               change="12.7% decrease"
//               changeType="positive"
//             />
            
//             <StatCard 
//               icon="fas fa-wallet"
//               color="rgba(255, 82, 82, 0.1)"
//               iconColor="var(--danger)"
//               title="Expenses"
//               value={`$${analyticsData.financial.expenses.toLocaleString()}`}
//               change="4.2% increase"
//               changeType="negative"
//             />
            
//             <StatCard 
//               icon="fas fa-percentage"
//               color="rgba(156, 39, 176, 0.1)"
//               iconColor="var(--purple)"
//               title="Collection Rate"
//               value={`${analyticsData.financial.collections}%`}
//               change="1.5% improvement"
//               changeType="positive"
//             />
//           </div>
          
//           <div className="analytics-row">
//             <div className="card">
//               <div className="card-header">
//                 <h3>Revenue by Department</h3>
//               </div>
//               <div className="revenue-chart">
//                 <canvas id="revenue-chart"></canvas>
//               </div>
//             </div>
            
//             <div className="card">
//               <div className="card-header">
//                 <h3>Expense Breakdown</h3>
//               </div>
//               <div className="expense-chart">
//                 <canvas id="expense-chart"></canvas>
//               </div>
//             </div>
//           </div>
          
//           <div className="card">
//             <div className="card-header">
//               <h3>Financial Trends</h3>
//             </div>
//             <div className="trend-chart">
//               <canvas id="financial-trend-chart"></canvas>
//             </div>
//           </div>
//         </div>
//       )}
      
//       {activeTab === 'clinical' && (
//         <div className="analytics-clinical">
//           <div className="stats-grid">
//             <StatCard 
//               icon="fas fa-procedures"
//               color="rgba(255, 82, 82, 0.1)"
//               iconColor="var(--danger)"
//               title="Readmission Rate"
//               value={`${analyticsData.clinical.readmissionRate}%`}
//               change="1.2% decrease"
//               changeType="positive"
//             />
            
//             <StatCard 
//               icon="fas fa-bed"
//               color="rgba(26, 115, 232, 0.1)"
//               iconColor="var(--primary)"
//               title="Avg. Hospital Stay"
//               value={`${analyticsData.clinical.avgHospitalStay} days`}
//               change="0.3 day reduction"
//               changeType="positive"
//             />
            
//             <StatCard 
//               icon="fas fa-virus"
//               color="rgba(255, 171, 0, 0.1)"
//               iconColor="var(--warning)"
//               title="Infection Rate"
//               value={`${analyticsData.clinical.infectionRate}%`}
//               change="0.4% improvement"
//               changeType="positive"
//             />
            
//             <StatCard 
//               icon="fas fa-heartbeat"
//               color="rgba(156, 39, 176, 0.1)"
//               iconColor="var(--purple)"
//               title="Mortality Rate"
//               value={`${analyticsData.clinical.mortalityRate}%`}
//               change="0.2% improvement"
//               changeType="positive"
//             />
//           </div>
          
//           <div className="analytics-row">
//             <div className="card">
//               <div className="card-header">
//                 <h3>Disease Prevalence</h3>
//               </div>
//               <div className="disease-chart">
//                 <canvas id="disease-chart"></canvas>
//               </div>
//             </div>
            
//             <div className="card">
//               <div className="card-header">
//                 <h3>Treatment Outcomes</h3>
//               </div>
//               <div className="outcome-chart">
//                 <canvas id="outcome-chart"></canvas>
//               </div>
//             </div>
//           </div>
          
//           <div className="card">
//             <div className="card-header">
//               <h3>Quality Metrics</h3>
//             </div>
//             <div className="quality-metrics">
//               <table>
//                 <thead>
//                   <tr>
//                     <th>Metric</th>
//                     <th>Current</th>
//                     <th>Target</th>
//                     <th>Benchmark</th>
//                     <th>Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td>Diabetes Control (HbA1c &lt; 7%)</td>
//                     <td>68%</td>
//                     <td>75%</td>
//                     <td>72%</td>
//                     <td className="metric-warning">Needs Improvement</td>
//                   </tr>
//                   <tr>
//                     <td>Hypertension Control (&lt; 140/90)</td>
//                     <td>76%</td>
//                     <td>80%</td>
//                     <td>78%</td>
//                     <td className="metric-positive">On Track</td>
//                   </tr>
//                   <tr>
//                     <td>Cancer Screening Rate</td>
//                     <td>62%</td>
//                     <td>70%</td>
//                     <td>65%</td>
//                     <td className="metric-warning">Needs Improvement</td>
//                   </tr>
//                   <tr>
//                     <td>Vaccination Rate</td>
//                     <td>85%</td>
//                     <td>90%</td>
//                     <td>88%</td>
//                     <td className="metric-positive">On Track</td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}
      
//       {activeTab === 'operations' && (
//         <div className="analytics-operations">
//           <div className="stats-grid">
//             <StatCard 
//               icon="fas fa-user-md"
//               color="rgba(26, 115, 232, 0.1)"
//               iconColor="var(--primary)"
//               title="Physician Utilization"
//               value="84%"
//               change="3% improvement"
//               changeType="positive"
//             />
            
//             <StatCard 
//               icon="fas fa-bed"
//               color="rgba(0, 200, 83, 0.1)"
//               iconColor="var(--secondary)"
//               title="Bed Occupancy"
//               value="78%"
//               change="Optimal range"
//               changeType="positive"
//             />
            
//             <StatCard 
//               icon="fas fa-clock"
//               color="rgba(255, 171, 0, 0.1)"
//               iconColor="var(--warning)"
//               title="Avg. Appointment Time"
//               value="22 min"
//               change="2 min increase"
//               changeType="negative"
//             />
            
//             <StatCard 
//               icon="fas fa-sync-alt"
//               color="rgba(156, 39, 176, 0.1)"
//               iconColor="var(--purple)"
//               title="Patient No-Show Rate"
//               value="12%"
//               change="1.5% decrease"
//               changeType="positive"
//             />
//           </div>
          
//           <div className="analytics-row">
//             <div className="card">
//               <div className="card-header">
//                 <h3>Resource Utilization</h3>
//               </div>
//               <div className="resource-chart">
//                 <canvas id="resource-chart"></canvas>
//               </div>
//             </div>
            
//             <div className="card">
//               <div className="card-header">
//                 <h3>Staff Productivity</h3>
//               </div>
//               <div className="productivity-chart">
//                 <canvas id="productivity-chart"></canvas>
//               </div>
//             </div>
//           </div>
          
//           <div className="card">
//             <div className="card-header">
//               <h3>Operational Efficiency</h3>
//             </div>
//             <div className="efficiency-metrics">
//               <table>
//                 <thead>
//                   <tr>
//                     <th>Department</th>
//                     <th>Avg. Wait Time</th>
//                     <th>Patient Throughput</th>
//                     <th>Staff to Patient Ratio</th>
//                     <th>Cost per Patient</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {departments.map(dept => (
//                     <tr key={dept.id}>
//                       <td>{dept.name}</td>
//                       <td>{Math.floor(Math.random() * 10 + 10)} min</td>
//                       <td>{Math.floor(Math.random() * 20 + 30)} patients/day</td>
//                       <td>1:{Math.floor(Math.random() * 8 + 4)}</td>
//                       <td>${Math.floor(Math.random() * 200 + 150)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default App;
// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { Chart, registerables } from 'chart.js';
import moment from 'moment';
// import Sidebar from './sidebar';

// Register Chart.js components
Chart.register(...registerables);

// API Service Layer - Real integration points
class HealthcareService {
  static async fetchPatients() {
    // Adapted real data with required fields
    return [
      { 
        id: "PT-1001", 
        name: "John Doe", 
        status: "active", 
        age: moment().diff(moment("1985-05-15"), 'years'), 
        gender: "Male", 
        contact: "john.doe@email.com", 
        registered: "Sep 19, 2025", 
        conditions: ["Penicillin", "Peanuts"], 
        lastVisit: "2025-09-19" 
      },
      { 
        id: "PT-1002", 
        name: "Jane Smith", 
        status: "active", 
        age: moment().diff(moment("1978-08-22"), 'years'), 
        gender: "Female", 
        contact: "jane.smith@email.com", 
        registered: "Sep 19, 2025", 
        conditions: ["None"], 
        lastVisit: "2025-09-19" 
      },
      { 
        id: "PT-1003", 
        name: "Robert Johnson", 
        status: "active", 
        age: moment().diff(moment("1992-12-03"), 'years'), 
        gender: "Male", 
        contact: "robert.j@email.com", 
        registered: "Sep 19, 2025", 
        conditions: ["Shellfish"], 
        lastVisit: "2025-09-19" 
      }
    ];
  }

  static async fetchAppointments() {
    // Real data
    return [
      {"id":"A0001", "time":"09:00", "patient":"John Doe", "doctor":"dr_smith", "status":"scheduled", "duration":30, "reason":"Annual checkup", "notes":""},
      {"id":"A0002", "time":"10:00", "patient":"Jane Smith", "doctor":"dr_jones", "status":"scheduled", "duration":45, "reason":"Follow-up on test results", "notes":""}
    ];
  }

  static async fetchMedications(patientId) {
    // No data available, keeping minimal
    return [];
  }

  static async savePatient(patientData) {
    // In a real app, this would POST to an API
    return { success: true, patient: {...patientData, id: `PT-${Math.floor(1000 + Math.random() * 9000)}` }};
  }
}

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(() => {
    // Load dark mode preference from localStorage
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [doctor, setDoctor] = useState('1');
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Real data integrated instead of mock
  const mockData = {
    patient_stats: {
      total: 3,
      todays_appointments: 2,
      pending_prescriptions: 0,
      critical_labs: 1,
      high_blood_sugar: 4 // Kept from original as not in API
    },
    health_metrics: {
      heart_rate: 78,
      blood_pressure: "120/80",
      oxygen: 98,
      bmi: 24.2
    },
    telemedicine: {
      eligible: 1,
      scheduled: 1,
      completed: 0
    },
    doctors: [
      {"id":1,"name":"Dr. dr_smith","patients":2,"rating":4.8,"specialty":"Cardiology"},
      {"id":2,"name":"Dr. dr_jones","patients":1,"rating":4.8,"specialty":"Neurology"}
    ],
    resource_status: {
      icu: { occupied: 1, total: 15 },
      ventilators: { in_use: 0, total: 12 },
      isolation_beds: { occupied: 0, total: 10 }
    }
  };

  // Initialize data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch real data in production - using mocks for demonstration
        const [patientsData, appointmentsData] = await Promise.all([
          HealthcareService.fetchPatients(),
          HealthcareService.fetchAppointments()
        ]);
        
        setPatients(patientsData);
        setAppointments(appointmentsData);
        
        // Initialize notifications with real data
        setNotifications([
          { id: 3, message: "Lab results ready for review.", time: "Just now", read: false, type: "lab" },
          { id: 2, message: "New prescription available.", time: "Just now", read: false, type: "prescription" },
          { id: 1, message: "Upcoming appointment scheduled.", time: "Just now", read: false, type: "appointment" }
        ]);
      } catch (error) {
        console.error("Failed to load data:", error);
        // Add error notification
        setNotifications(prev => [
          { id: Date.now(), message: "Failed to load patient data", time: "Just now", read: false, type: "error" },
          ...prev
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Calculate unread notifications
  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Toggle notification panel
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? {...n, read: true} : n
    ));
  };

  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Navigate to page
  const navigateTo = (page) => {
    setCurrentPage(page);
    setShowNotifications(false);
  };

  // Handle new patient creation
  const handleAddPatient = async (patientData) => {
    setIsLoading(true);
    try {
      const result = await HealthcareService.savePatient(patientData);
      if (result.success) {
        setPatients(prev => [...prev, result.patient]);
        // Add success notification
        setNotifications(prev => [
          { id: Date.now(), message: `Patient ${result.patient.name} added successfully`, time: "Just now", read: false, type: "success" },
          ...prev
        ]);
        return true;
      }
    } catch (error) {
      console.error("Failed to add patient:", error);
      setNotifications(prev => [
        { id: Date.now(), message: "Failed to add patient", time: "Just now", read: false, type: "error" },
        ...prev
      ]);
    } finally {
      setIsLoading(false);
    }
    return false;
  };

  // Render main content based on current page
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="loading-screen">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Loading healthcare data...</span>
        </div>
      );
    }
    
    switch(currentPage) {
      case 'dashboard': return <DashboardPage data={mockData} appointments={appointments} />;
      case 'patients': return <PatientsPage patients={patients} onAddPatient={handleAddPatient} />;
      case 'doctors': return <DoctorsPage doctors={mockData.doctors} />;
      case 'settings': return <SettingsPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
      case 'appointments': return <AppointmentsPage appointments={appointments} doctors={mockData.doctors} />;
      case 'pharmacy': return <PharmacyPage />;
      case 'records': return <RecordsPage patients={patients} />;
      case 'programs': return <ProgramsPage />;
      case 'analytics': return <AnalyticsPage />;
      default: return <DashboardPage data={mockData} appointments={appointments} />;
    }
  };

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      <Sidebar 
        currentPage={currentPage} 
        navigateTo={navigateTo} 
        unreadAppointments={appointments.filter(a => a.status === 'pending').length}
        unreadPharmacy={2}
      />
      
      <div className="main-content">
        <Topbar 
          doctor={doctor} 
          setDoctor={setDoctor}
          showNotifications={showNotifications}
          toggleNotifications={toggleNotifications}
          notifications={notifications}
          unreadNotifications={unreadNotifications}
          markAsRead={markAsRead}
          clearNotifications={clearNotifications}
          doctors={mockData.doctors}
        />
        
        <div className="content-area">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

// Sidebar Component (unchanged)
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

// Topbar Component
const Topbar = ({ 
  doctor, 
  setDoctor, 
  showNotifications, 
  toggleNotifications, 
  notifications, 
  unreadNotifications, 
  markAsRead,
  clearNotifications,
  doctors
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearch = (e) => {
    e.preventDefault();
    // Real implementation would execute search
    console.log("Searching for:", searchTerm);
    // Add notification for demo
    if (searchTerm) {
      setNotifications(prev => [
        { id: Date.now(), message: `Search executed for "${searchTerm}"`, time: "Just now", read: false, type: "search" },
        ...prev
      ]);
    }
    setSearchTerm('');
  };

  return (
    <div className="topbar">
      <form className="search-bar" onSubmit={handleSearch}>
        <i className="fas fa-search"></i>
        <input 
          type="text" 
          placeholder="Search patients, records, appointments..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      
      <div className="user-actions">
        <div 
          className="notification-icon" 
          onClick={(e) => {
            e.stopPropagation();
            toggleNotifications();
          }}
        >
          <i className="fas fa-bell"></i>
          {unreadNotifications > 0 && (
            <div className="badge">{unreadNotifications}</div>
          )}
          
          {showNotifications && (
            <div className="notification-panel">
              <div className="notification-header">
                <div className="notification-title">Notifications</div>
                <div className="clear-notifications" onClick={clearNotifications}>Clear All</div>
              </div>
              <ul className="notification-list">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <li 
                      key={notification.id}
                      className={`notification-item ${notification.read ? '' : 'unread'} ${notification.type}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="notification-icon">
                        {notification.type === 'appointment' && <i className="fas fa-calendar-check"></i>}
                        {notification.type === 'lab' && <i className="fas fa-vial"></i>}
                        {notification.type === 'prescription' && <i className="fas fa-prescription-bottle-alt"></i>}
                        {notification.type === 'alert' && <i className="fas fa-exclamation-circle"></i>}
                        {notification.type === 'system' && <i className="fas fa-cog"></i>}
                        {notification.type === 'error' && <i className="fas fa-exclamation-triangle"></i>}
                        {notification.type === 'success' && <i className="fas fa-check-circle"></i>}
                      </div>
                      <div className="notification-content">
                        <div className="notification-message">{notification.message}</div>
                        <div className="notification-time">{notification.time}</div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="no-notifications">
                    <i className="fas fa-check-circle"></i>
                    <span>No notifications</span>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
        
        <div className="user-profile">
          <div className="user-avatar">DR</div>
          <div className="doctor-selector">
            <select 
              value={doctor}
              onChange={(e) => setDoctor(e.target.value)}
              className="doctor-dropdown"
            >
              {doctors.map(doc => (
                <option key={doc.id} value={doc.id}>{doc.name}</option>
              ))}
            </select>
          </div>
          <i className="fas fa-chevron-down"></i>
        </div>
      </div>
    </div>
  );
};

// Dashboard Page with real-time data
const DashboardPage = ({ data, appointments }) => {
  const healthChartRef = useRef(null);
  const appointmentChartRef = useRef(null);
  const [healthMetrics, setHealthMetrics] = useState(data.health_metrics);
  
  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setHealthMetrics(prev => ({
        ...prev,
        heart_rate: Math.max(60, Math.min(100, prev.heart_rate + (Math.random() * 4 - 2))),
        oxygen: Math.max(95, Math.min(100, prev.oxygen + (Math.random() * 0.4 - 0.2)))
      }));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Health metrics chart
  useEffect(() => {
    if (healthChartRef.current) {
      const ctx = healthChartRef.current.getContext('2d');
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'Heart Rate (bpm)',
              data: [76, 74, 72, 73, 71, 72],
              borderColor: '#ff5252',
              backgroundColor: 'rgba(255, 82, 82, 0.1)',
              tension: 0.4,
              fill: true
            },
            {
              label: 'Oxygen Saturation (%)',
              data: [96, 97, 97, 98, 98, 98],
              borderColor: '#00b8d4',
              backgroundColor: 'rgba(0, 184, 212, 0.1)',
              tension: 0.4,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: {
              display: true,
              text: 'Patient Health Trends',
              font: { size: 16 }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `${context.dataset.label}: ${context.parsed.y}`;
                }
              }
            }
          },
          scales: { 
            y: { 
              beginAtZero: false, 
              min: 60,
              ticks: {
                callback: function(value, index, ticks) {
                  // 'this' refers to the tick context, but datasetIndex is not available here
                  // Instead, just return the value as a string, or append a unit if needed
                  return value;
                }
              }
            } 
          }
        }
      });
      
      return () => chart.destroy();
    }
  }, []);
  
  // Appointment stats chart
  useEffect(() => {
    if (appointmentChartRef.current) {
      const ctx = appointmentChartRef.current.getContext('2d');
      
      // Calculate appointment types
      const appointmentTypes = {
        scheduled: appointments.filter(a => a.status === 'scheduled').length,
        urgent: appointments.filter(a => a.status === 'urgent').length,
        confirmed: appointments.filter(a => a.status === 'confirmed').length,
        pending: appointments.filter(a => a.status === 'pending').length
      };
      
      const chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Scheduled', 'Urgent', 'Confirmed', 'Pending'],
          datasets: [{
            data: [
              appointmentTypes.scheduled,
              appointmentTypes.urgent,
              appointmentTypes.confirmed,
              appointmentTypes.pending
            ],
            backgroundColor: [
              'rgba(0, 200, 83, 0.7)',
              'rgba(255, 82, 82, 0.7)',
              'rgba(26, 115, 232, 0.7)',
              'rgba(255, 171, 0, 0.7)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: {
              display: true,
              text: 'Appointment Status Distribution',
              font: { size: 16 }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = Math.round((value / total) * 100);
                  return `${label}: ${value} (${percentage}%)`;
                }
              }
            }
          }
        }
      });
      
      return () => chart.destroy();
    }
  }, [appointments]);
  
  return (
    <div id="dashboard-page">
      <div className="page-title">
        <i className="fas fa-home"></i>
        <span>Healthcare Dashboard</span>
      </div>
      
      {/* Stats Cards */}
      <div className="stats-grid">
        <StatCard 
          icon="fas fa-user-injured"
          color="rgba(26, 115, 232, 0.1)"
          iconColor="var(--primary)"
          title="Total Patients"
          value={data.patient_stats.total}
          change="12% from last month"
          changeType="positive"
        />
        
        <StatCard 
          icon="fas fa-calendar-check"
          color="rgba(0, 200, 83, 0.1)"
          iconColor="var(--secondary)"
          title="Today's Appointments"
          value={data.patient_stats.todays_appointments}
          change="3 new"
          changeType="positive"
        />
        
        <StatCard 
          icon="fas fa-prescription-bottle-alt"
          color="rgba(255, 171, 0, 0.1)"
          iconColor="var(--warning)"
          title="Pending Prescriptions"
          value={data.patient_stats.pending_prescriptions}
          change="1 critical"
          changeType="negative"
        />
        
        <StatCard 
          icon="fas fa-vial"
          color="rgba(255, 82, 82, 0.1)"
          iconColor="var(--danger)"
          title="Critical Lab Results"
          value={data.patient_stats.critical_labs}
          change="1 new"
          changeType="negative"
        />
      </div>
      
      {/* Main Dashboard Row */}
      <div className="dashboard-row">
        {/* Left Column */}
        <div>
          {/* Appointments Card */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Today's Appointments</div>
              <div className="card-action">View All</div>
            </div>
            
            <ul className="appointment-list">
              {appointments.map((appointment) => (
                <AppointmentItem 
                  key={appointment.id}
                  time={appointment.time}
                  patient={appointment.patient}
                  doctor={appointment.doctor}
                  status={appointment.status}
                  duration={appointment.duration}
                  reason={appointment.reason}
                />
              ))}
            </ul>
          </div>
          
          {/* Doctors Card */}
          <div className="card" style={{ marginTop: '30px' }}>
            <div className="card-header">
              <div className="card-title">Available Doctors</div>
              <div className="card-action">Manage</div>
            </div>
            
            <div className="doctor-grid">
              {data.doctors.map((doctor) => (
                <DoctorCard 
                  key={doctor.id}
                  name={doctor.name}
                  specialty={doctor.specialty}
                  patients={doctor.patients}
                  rating={doctor.rating}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Right Column */}
        <div>
          {/* Health Metrics Card */}
          {/* <div className="card">
            <div className="card-header">
              <div className="card-title">Patient Health Metrics</div>
              <div className="card-action">Details</div>
            </div> */}
            
            {/* <div className="health-metrics">
              <MetricCard 
                value={`${healthMetrics.heart_rate} bpm`}
                label="Avg Heart Rate"
                trend={healthMetrics.heart_rate > 75 ? 'up' : healthMetrics.heart_rate < 70 ? 'down' : 'neutral'}
              />
              
              <MetricCard 
                value={data.health_metrics.blood_pressure}
                label="Avg Blood Pressure"
              />
              
              <MetricCard 
                value={`${healthMetrics.oxygen}%`}
                label="Oxygen Sat."
                trend={healthMetrics.oxygen > 97 ? 'up' : healthMetrics.oxygen < 96 ? 'down' : 'neutral'}
              />
              
              <MetricCard 
                value={data.health_metrics.bmi}
                label="Avg BMI"
              />
            </div> */}
            
            {/* <div className="chart-container">
              <canvas ref={healthChartRef} id="health-chart"></canvas>
            </div>
          </div>
           */}
          {/* Resource Status Card */}
          <div className="card" style={{ marginTop: '30px' }}>
            <div className="card-header">
              <div className="card-title">Resource Status</div>
              <div className="card-action">Manage</div>
            </div>
            
            <div className="resource-grid">
              <ResourceCard 
                icon="fas fa-procedures"
                name="ICU Beds"
                stats={`${data.resource_status.icu.occupied}/${data.resource_status.icu.total}`}
                progress={Math.round((data.resource_status.icu.occupied / data.resource_status.icu.total) * 100)}
                color="var(--warning)"
              />
              
              <ResourceCard 
                icon="fas fa-lungs"
                name="Ventilators"
                stats={`${data.resource_status.ventilators.in_use}/${data.resource_status.ventilators.total}`}
                progress={Math.round((data.resource_status.ventilators.in_use / data.resource_status.ventilators.total) * 100)}
                color="var(--secondary)"
              />
              
              <ResourceCard 
                icon="fas fa-bed"
                name="Isolation Beds"
                stats={`${data.resource_status.isolation_beds.occupied}/${data.resource_status.isolation_beds.total}`}
                progress={Math.round((data.resource_status.isolation_beds.occupied / data.resource_status.isolation_beds.total) * 100)}
                color="var(--secondary)"
              />
            </div>
          </div>
          
          {/* Telemedicine Card */}
          <div className="card" style={{ marginTop: '30px' }}>
            <div className="card-header">
              <div className="card-title">Telemedicine</div>
              <div className="card-action">View</div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
              <MetricCard 
                value={data.telemedicine.eligible}
                label="Eligible"
                valueStyle={{ color: 'var(--primary)' }}
              />
              
              <MetricCard 
                value={data.telemedicine.scheduled}
                label="Scheduled"
                valueStyle={{ color: 'var(--secondary)' }}
              />
              
              <MetricCard 
                value={data.telemedicine.completed}
                label="Completed"
                valueStyle={{ color: 'var(--info)' }}
              />
            </div>
            
            <div className="chart-container">
              <canvas ref={appointmentChartRef} id="appointment-chart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Components
const StatCard = ({ icon, color, iconColor, title, value, change, changeType }) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ background: color, color: iconColor }}>
      <i className={icon}></i>
    </div>
    <div className="stat-info">
      <div className="stat-title">{title}</div>
      <div className="stat-value">{value}</div>
      <div className={`stat-change ${changeType === 'positive' ? 'change-positive' : 'change-negative'}`}>
        <i className={`fas fa-arrow-${changeType === 'positive' ? 'up' : 'down'}`}></i> 
        <span>{change}</span>
      </div>
    </div>
  </div>
);

const AppointmentItem = ({ time, patient, doctor, status, duration, reason }) => (
  <li className="appointment-item">
    <div className="appointment-time">{time}</div>
    <div className="appointment-info">
      <div className="appointment-title">{patient}</div>
      <div className="appointment-meta">
        <div><i className="fas fa-user-md"></i> {doctor}</div>
        <div><i className="fas fa-clock"></i> {duration} min</div>
      </div>
      <div className="appointment-reason">{reason}</div>
    </div>
    <div className={`appointment-status status-${status}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </div>
  </li>
);

const DoctorCard = ({ name, specialty, patients, rating }) => {
  const initials = name.split(' ').map(n => n[0]).join('');
  
  return (
    <div className="doctor-card">
      <div className="doctor-avatar">{initials}</div>
      <div className="doctor-name">{name}</div>
      <div className="doctor-specialty">{specialty}</div>
      <div className="doctor-stats">
        <div><i className="fas fa-user"></i> {patients}</div>
        <div><i className="fas fa-star"></i> {rating}</div>
      </div>
    </div>
  );
};

const MetricCard = ({ value, label, valueStyle = {}, trend }) => (
  <div className="metric-card">
    <div className="metric-value" style={valueStyle}>{value}</div>
    {trend && (
      <div className={`metric-trend ${trend}`}>
        <i className={`fas fa-arrow-${trend}`}></i>
      </div>
    )}
    <div className="metric-label">{label}</div>
  </div>
);

const ResourceCard = ({ icon, name, stats, progress, color }) => (
  <div className="resource-card">
    <div className="resource-icon" style={{ color }}>
      <i className={icon}></i>
    </div>
    <div className="resource-name">{name}</div>
    <div className="resource-stats">{stats}</div>
    <div className="progress-container">
      <div className="progress-bar" style={{ background: color, width: `${progress}%` }}></div>
      <div className="progress-text">{progress}% utilized</div>
    </div>
  </div>
);

// Patients Page with full CRUD functionality
const PatientsPage = ({ patients, onAddPatient }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    contact: '',
    conditions: []
  });
  const [currentCondition, setCurrentCondition] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddCondition = () => {
    if (currentCondition.trim()) {
      setFormData(prev => ({
        ...prev,
        conditions: [...prev.conditions, currentCondition.trim()]
      }));
      setCurrentCondition('');
    }
  };
  
  const handleRemoveCondition = (index) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onAddPatient({
      ...formData,
      age: parseInt(formData.age),
      registered: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      status: 'active'
    });
    
    if (success) {
      setFormData({
        name: '',
        age: '',
        gender: 'Male',
        contact: '',
        conditions: []
      });
      setShowForm(false);
    }
  };
  
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          patient.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          patient.contact.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  return (
    <div className="patients-page">
      <div className="page-header">
        <div className="page-title">
          <i className="fas fa-user-injured"></i>
          <span>Patients Management</span>
        </div>
        <button className="btn" onClick={() => setShowForm(!showForm)}>
          <i className="fas fa-plus"></i> {showForm ? 'Cancel' : 'New Patient'}
        </button>
      </div>
      
      {showForm && (
        <div className="card patient-form">
          <div className="card-header">
            <h3>Add New Patient</h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Age</label>
                <input 
                  type="number" 
                  name="age" 
                  value={formData.age} 
                  onChange={handleInputChange}
                  min="1"
                  max="120"
                  required 
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Gender</label>
                <select 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleInputChange}
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Contact Email</label>
                <input 
                  type="email" 
                  name="contact" 
                  value={formData.contact} 
                  onChange={handleInputChange}
                  required 
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Medical Conditions</label>
              <div className="conditions-input">
                <input 
                  type="text" 
                  value={currentCondition} 
                  onChange={(e) => setCurrentCondition(e.target.value)}
                  placeholder="Add a condition..."
                />
                <button 
                  type="button" 
                  className="btn-icon"
                  onClick={handleAddCondition}
                >
                  <i className="fas fa-plus"></i>
                </button>
              </div>
              
              {formData.conditions.length > 0 && (
                <div className="conditions-list">
                  {formData.conditions.map((condition, index) => (
                    <div key={index} className="condition-tag">
                      {condition}
                      <button 
                        type="button" 
                        className="btn-icon"
                        onClick={() => handleRemoveCondition(index)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="form-actions">
              <button type="submit" className="save-btn">
                Save Patient
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Patients Filter */}
      <div className="card">
        <div className="card-body patient-filters">
          <input 
            type="text" 
            placeholder="Search patients by name, ID or condition..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button className="btn">
            <i className="fas fa-filter"></i> Apply Filters
          </button>
        </div>
      </div>
      
      {/* Patients Grid */}
      <div className="patients-grid">
        {filteredPatients.length > 0 ? (
          filteredPatients.map(patient => (
            <PatientCard 
              key={patient.id}
              id={patient.id}
              name={patient.name}
              status={patient.status}
              age={patient.age}
              gender={patient.gender}
              contact={patient.contact}
              registered={patient.registered}
              conditions={patient.conditions}
            />
          ))
        ) : (
          <div className="no-results">
            <i className="fas fa-user-injured"></i>
            <h3>No patients found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

const PatientCard = ({ id, name, status, age, gender, contact, registered, conditions }) => {
  const initials = name.split(' ').map(n => n[0]).join('');
  
  return (
    <div className="patient-card">
      <div className="patient-header">
        <div className="patient-avatar">{initials}</div>
        <div className="patient-info">
          <div className="patient-name">{name}</div>
          <div className="patient-id">ID: {id}</div>
          <span className={`patient-status ${status === 'active' ? 'status-active' : 'status-inactive'}`}>
            {status === 'active' ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
      <div className="patient-details">
        <DetailRow label="Age:" value={age} />
        <DetailRow label="Gender:" value={gender} />
        <DetailRow label="Contact:" value={contact} />
        <DetailRow label="Registered:" value={registered} />
        
        {conditions.length > 0 && (
          <div className="detail-row">
            <div className="detail-label">Conditions:</div>
            <div className="detail-value conditions">
              {conditions.map((condition, index) => (
                <span key={index} className="condition-tag">{condition}</span>
              ))}
            </div>
          </div>
        )}
        
        <div className="action-buttons">
          <div className="action-btn"><i className="fas fa-user"></i> Profile</div>
          <div className="action-btn"><i className="fas fa-file-medical"></i> Records</div>
          <div className="action-btn"><i className="fas fa-calendar"></i> Appointment</div>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="detail-row">
    <div className="detail-label">{label}</div>
    <div className="detail-value">{value}</div>
  </div>
);

// Enhanced Doctors Page
const DoctorsPage = ({ doctors }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = specialtyFilter === 'all' || doctor.specialty === specialtyFilter;
    return matchesSearch && matchesSpecialty;
  });
  
  // Get unique specialties for filter
  const specialties = [...new Set(doctors.map(d => d.specialty))];
  
  return (
    <div className="doctors-page">
      <div className="page-header">
        <div className="page-title">
          <i className="fas fa-stethoscope"></i>
          <span>Doctors Management</span>
        </div>
        <button className="btn">
          <i className="fas fa-plus"></i> Add Doctor
        </button>
      </div>
      
      {/* Doctors Filter */}
      <div className="card">
        <div className="card-body">
          <input 
            type="text" 
            placeholder="Search doctors..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="form-select"
            value={specialtyFilter}
            onChange={(e) => setSpecialtyFilter(e.target.value)}
          >
            <option value="all">All Specialties</option>
            {specialties.map(specialty => (
              <option key={specialty} value={specialty}>{specialty}</option>
            ))}
          </select>
          <select className="form-select">
            <option>All Statuses</option>
            <option>Active</option>
            <option>Inactive</option>
            <option>Absent</option>
          </select>
          <button className="btn">
            <i className="fas fa-filter"></i> Apply Filters
          </button>
        </div>
      </div>
      
      {/* Doctors Grid */}
      <div className="doctor-grid">
        {filteredDoctors.map(doctor => (
          <DoctorProfileCard 
            key={doctor.id}
            name={doctor.name}
            specialty={doctor.specialty}
            status={doctor.status || "active"}
            contact={doctor.contact || `${doctor.name.split(' ')[0].toLowerCase()}.${doctor.name.split(' ')[1].toLowerCase()}@medicare.com`}
            phone={doctor.phone || "(555) 123-4567"}
            patients={doctor.patients}
          />
        ))}
      </div>
    </div>
  );
};

const DoctorProfileCard = ({ name, specialty, status, contact, phone, patients }) => {
  const initials = name.split(' ').map(n => n[0]).join('');
  
  return (
    <div className="doctor-profile-card">
      <div className="doctor-header">
        <div className="doctor-avatar-lg">{initials}</div>
        <div className="doctor-info">
          <div className="doctor-name-lg">{name}</div>
          <div className="doctor-specialty-lg">{specialty}</div>
          <span className={`doctor-status ${status === 'active' ? 'status-active' : status === 'absent' ? 'status-absent' : 'status-inactive'}`}>
            {status === 'active' ? 'Active' : status === 'absent' ? 'Absent' : 'Inactive'}
          </span>
        </div>
      </div>
      <div className="doctor-details">
        <DetailRow label="Contact:" value={contact} />
        <DetailRow label="Phone:" value={phone} />
        <DetailRow label="Patients:" value={patients} />
        <div className="action-buttons">
          <div className="action-btn"><i className="fas fa-user-md"></i> Profile</div>
          <div className="action-btn"><i className="fas fa-calendar"></i> Schedule</div>
          <div className="action-btn"><i className="fas fa-comment"></i> Message</div>
        </div>
      </div>
    </div>
  );
};

// Settings Page with persistence
const SettingsPage = ({ darkMode, toggleDarkMode }) => {
  const [settings, setSettings] = useState({
    language: 'English',
    timeFormat: '12-hour format',
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    twoFactorAuth: false,
    autoLogout: '30 minutes',
    dataSharing: false,
    analyticsTracking: true
  });
  
  const handleSettingChange = (name, value) => {
    setSettings(prev => ({ ...prev, [name]: value }));
    // In a real app, this would save to backend
    localStorage.setItem(name, JSON.stringify(value));
  };
  
  return (
    <div className="settings-page">
      <div className="page-title">
        <i className="fas fa-cog"></i>
        <span>System Settings</span>
      </div>
      
      {/* General Settings */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">General Settings</h2>
        </div>
        <div className="card-body">
          <div className="settings-group">
            <div className="setting-item">
              <div>
                <div className="setting-label">System Theme</div>
                <div className="setting-description">Choose between light and dark mode</div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={darkMode} 
                  onChange={toggleDarkMode} 
                />
                <span className="slider"></span>
              </label>
            </div>
            
            <div className="setting-item">
              <div>
                <div className="setting-label">Language</div>
                <div className="setting-description">System interface language</div>
              </div>
              <select 
                className="form-select"
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
              >
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>
            
            <div className="setting-item">
              <div>
                <div className="setting-label">Time Format</div>
                <div className="setting-description">Display format for time</div>
              </div>
              <select 
                className="form-select"
                value={settings.timeFormat}
                onChange={(e) => handleSettingChange('timeFormat', e.target.value)}
              >
                <option>12-hour format</option>
                <option>24-hour format</option>
              </select>
            </div>
          </div>
          
          <div className="settings-group">
            <h3 className="settings-title">Notification Settings</h3>
            
            <div className="setting-item">
              <div>
                <div className="setting-label">Email Notifications</div>
                <div className="setting-description">Receive notifications via email</div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.emailNotifications}
                  onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
            
            <div className="setting-item">
              <div>
                <div className="setting-label">SMS Notifications</div>
                <div className="setting-description">Receive notifications via SMS</div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.smsNotifications}
                  onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
            
            <div className="setting-item">
              <div>
                <div className="setting-label">Appointment Reminders</div>
                <div className="setting-description">Send reminders before appointments</div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.appointmentReminders}
                  onChange={(e) => handleSettingChange('appointmentReminders', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
          
          <div className="settings-group">
            <h3 className="settings-title">Security Settings</h3>
            
            <div className="setting-item">
              <div>
                <div className="setting-label">Two-Factor Authentication</div>
                <div className="setting-description">Add an extra layer of security</div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.twoFactorAuth}
                  onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
            
            <div className="setting-item">
              <div>
                <div className="setting-label">Auto Logout</div>
                <div className="setting-description">Logout after period of inactivity</div>
              </div>
              <select 
                className="form-select"
                value={settings.autoLogout}
                onChange={(e) => handleSettingChange('autoLogout', e.target.value)}
              >
                <option>5 minutes</option>
                <option>15 minutes</option>
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>Never</option>
              </select>
            </div>
            
            <div className="setting-item">
              <div>
                <div className="setting-label">Password Update</div>
                <div className="setting-description">Last changed 3 months ago</div>
              </div>
              <button className="btn">
                Change Password
              </button>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
            <button className="btn">
              Cancel
            </button>
            <button className="save-btn">
              Save Changes
            </button>
          </div>
        </div>
      </div>
      
      {/* Privacy Settings */}
      <div className="card" style={{ marginTop: '30px' }}>
        <div className="card-header">
          <h2 className="card-title">Privacy Settings</h2>
        </div>
        <div className="card-body">
          <div className="settings-group">
            <div className="setting-item">
              <div>
                <div className="setting-label">Data Sharing</div>
                <div className="setting-description">Allow anonymized data for research</div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.dataSharing}
                  onChange={(e) => handleSettingChange('dataSharing', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
            
            <div className="setting-item">
              <div>
                <div className="setting-label">Analytics Tracking</div>
                <div className="setting-description">Help improve our services</div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={settings.analyticsTracking}
                  onChange={(e) => handleSettingChange('analyticsTracking', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Appointments Page

const AppointmentsPage = ({ appointments, doctors }) => {
  const [dateFilter, setDateFilter] = useState('today');
  const [doctorFilter, setDoctorFilter] = useState('all');
  
  const filteredAppointments = appointments.filter(appointment => {
    const matchesDoctor = doctorFilter === 'all' || appointment.doctor === doctors.find(d => d.id === doctorFilter)?.name;
    return matchesDoctor;
  });
  
  return (
    <div className="appointments-page">
      <div className="page-header">
        <div className="page-title">
          <i className="fas fa-calendar-check"></i>
          <span>Appointments Management</span>
        </div>
        <button className="btn">
          <i className="fas fa-plus"></i> New Appointment
        </button>
      </div>
      
      {/* Appointments Filter */}
      <div className="card">
        <div className="card-body appointment-filters">
          <select 
            className="form-select"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="this-week">This Week</option>
            <option value="next-week">Next Week</option>
            <option value="this-month">This Month</option>
          </select>
          
          <select 
            className="form-select"
            value={doctorFilter}
            onChange={(e) => setDoctorFilter(e.target.value)}
          >
            <option value="all">All Doctors</option>
            {doctors.map(doctor => (
              <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
            ))}
          </select>
          
          <button className="btn">
            <i className="fas fa-filter"></i> Apply Filters
          </button>
        </div>
      </div>
      
      {/* Appointments List */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Scheduled Appointments</div>
          <div className="card-action">Export</div>
        </div>
        
        <div className="appointments-list">
          <div className="appointment-header">
            <div>Time</div>
            <div>Patient</div>
            <div>Doctor</div>
            <div>Reason</div>
            <div>Status</div>
            <div>Actions</div>
          </div>
          
          {filteredAppointments.map(appointment => (
            <div key={appointment.id} className="appointment-row">
              <div className="appointment-time">{appointment.time}</div>
              <div className="appointment-patient">{appointment.patient}</div>
              <div className="appointment-doctor">{appointment.doctor}</div>
              <div className="appointment-reason">{appointment.reason}</div>
              <div className={`appointment-status status-${appointment.status}`}>
                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
              </div>
              <div className="appointment-actions">
                <button className="btn-icon">
                  <i className="fas fa-edit"></i>
                </button>
                <button className="btn-icon">
                  <i className="fas fa-calendar-check"></i>
                </button>
                <button className="btn-icon">
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Other Pages with enhanced implementations
// Pharmacy Management Page
const PharmacyPage = () => {
  const [prescriptions, setPrescriptions] = useState([
    { id: "RX-1001", patient: "John Smith", medication: "Metformin 500mg", status: "pending", date: "2023-05-15", quantity: 30 },
    { id: "RX-1002", patient: "Emma Wilson", medication: "Albuterol Inhaler", status: "approved", date: "2023-05-16", quantity: 1 },
    { id: "RX-1003", patient: "Robert Brown", medication: "Lisinopril 10mg", status: "rejected", date: "2023-05-14", quantity: 90 },
    { id: "RX-1004", patient: "Lisa Davis", medication: "Atorvastatin 20mg", status: "pending", date: "2023-05-17", quantity: 30 },
    { id: "RX-1005", patient: "Michael Taylor", medication: "Levothyroxine 50mcg", status: "filled", date: "2023-05-13", quantity: 90 }
  ]);
  
  const [inventory, setInventory] = useState([
    { id: "MED-101", name: "Metformin 500mg", stock: 450, threshold: 100, lastOrder: "2023-05-01" },
    { id: "MED-102", name: "Lisinopril 10mg", stock: 320, threshold: 50, lastOrder: "2023-05-10" },
    { id: "MED-103", name: "Atorvastatin 20mg", stock: 280, threshold: 75, lastOrder: "2023-04-25" },
    { id: "MED-104", name: "Albuterol Inhaler", stock: 45, threshold: 20, lastOrder: "2023-05-05" },
    { id: "MED-105", name: "Levothyroxine 50mcg", stock: 210, threshold: 100, lastOrder: "2023-04-30" }
  ]);
  
  const [newPrescription, setNewPrescription] = useState({
    patient: '',
    medication: '',
    dosage: '',
    frequency: '',
    quantity: 30,
    instructions: ''
  });
  
  const [showNewForm, setShowNewForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPrescription(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddPrescription = () => {
    if (newPrescription.patient && newPrescription.medication) {
      const newRx = {
        id: `RX-${Math.floor(1000 + Math.random() * 9000)}`,
        patient: newPrescription.patient,
        medication: newPrescription.medication,
        status: "pending",
        date: new Date().toISOString().split('T')[0],
        quantity: parseInt(newPrescription.quantity),
        dosage: newPrescription.dosage,
        frequency: newPrescription.frequency,
        instructions: newPrescription.instructions
      };
      
      setPrescriptions(prev => [newRx, ...prev]);
      
      // Update inventory
      const medIndex = inventory.findIndex(item => item.name === newPrescription.medication);
      if (medIndex !== -1) {
        const updatedInventory = [...inventory];
        updatedInventory[medIndex].stock -= parseInt(newPrescription.quantity);
        setInventory(updatedInventory);
      }
      
      setNewPrescription({
        patient: '',
        medication: '',
        dosage: '',
        frequency: '',
        quantity: 30,
        instructions: ''
      });
      setShowNewForm(false);
    }
  };
  
  const updatePrescriptionStatus = (id, status) => {
    setPrescriptions(prescriptions.map(rx => 
      rx.id === id ? {...rx, status} : rx
    ));
  };
  
  const filteredPrescriptions = filterStatus === 'all' 
    ? prescriptions 
    : prescriptions.filter(rx => rx.status === filterStatus);
  
  const lowStockItems = inventory.filter(item => item.stock < item.threshold);
  
  return (
    <div className="pharmacy-page">
      <div className="page-header">
        <div className="page-title">
          <i className="fas fa-pills"></i>
          <span>Pharmacy Management</span>
        </div>
        <button className="btn" onClick={() => setShowNewForm(!showNewForm)}>
          <i className="fas fa-plus"></i> {showNewForm ? 'Cancel' : 'New Prescription'}
        </button>
      </div>
      
      {showNewForm && (
        <div className="card">
          <div className="card-header">
            <h3>New Prescription</h3>
          </div>
          <div className="card-body">
            <div className="form-row">
              <div className="form-group">
                <label>Patient</label>
                <input 
                  type="text" 
                  name="patient" 
                  value={newPrescription.patient} 
                  onChange={handleInputChange}
                  placeholder="Patient Name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Medication</label>
                <select 
                  name="medication" 
                  value={newPrescription.medication} 
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Medication</option>
                  {inventory.map(med => (
                    <option key={med.id} value={med.name}>
                      {med.name} (Stock: {med.stock})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Dosage</label>
                <input 
                  type="text" 
                  name="dosage" 
                  value={newPrescription.dosage} 
                  onChange={handleInputChange}
                  placeholder="e.g., 500mg"
                  required
                />
              </div>
              <div className="form-group">
                <label>Frequency</label>
                <input 
                  type="text" 
                  name="frequency" 
                  value={newPrescription.frequency} 
                  onChange={handleInputChange}
                  placeholder="e.g., Twice daily"
                  required
                />
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input 
                  type="number" 
                  name="quantity" 
                  value={newPrescription.quantity} 
                  onChange={handleInputChange}
                  min="1"
                  max="90"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Instructions</label>
              <textarea 
                name="instructions" 
                value={newPrescription.instructions} 
                onChange={handleInputChange}
                placeholder="Special instructions for the patient"
              />
            </div>
            
            <div className="form-actions">
              <button className="btn" onClick={() => setShowNewForm(false)}>
                Cancel
              </button>
              <button className="save-btn" onClick={handleAddPrescription}>
                Save Prescription
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="pharmacy-dashboard">
        {/* Prescription Management */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Prescription Management</div>
            <div className="filter-group">
              <select 
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="filled">Filled</option>
              </select>
              <input type="text" placeholder="Search prescriptions..." />
            </div>
          </div>
          
          <div className="prescription-list">
            <div className="prescription-header">
              <div>ID</div>
              <div>Patient</div>
              <div>Medication</div>
              <div>Date</div>
              <div>Status</div>
              <div>Actions</div>
            </div>
            
            {filteredPrescriptions.map(rx => (
              <div key={rx.id} className={`prescription-item status-${rx.status}`}>
                <div className="prescription-id">{rx.id}</div>
                <div className="prescription-patient">{rx.patient}</div>
                <div className="prescription-medication">{rx.medication}</div>
                <div className="prescription-date">{rx.date}</div>
                <div className="prescription-status">{rx.status}</div>
                <div className="prescription-actions">
                  {rx.status === 'pending' && (
                    <>
                      <button 
                        className="btn-icon success"
                        onClick={() => updatePrescriptionStatus(rx.id, 'approved')}
                      >
                        <i className="fas fa-check"></i>
                      </button>
                      <button 
                        className="btn-icon danger"
                        onClick={() => updatePrescriptionStatus(rx.id, 'rejected')}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </>
                  )}
                  {rx.status === 'approved' && (
                    <button 
                      className="btn-icon"
                      onClick={() => updatePrescriptionStatus(rx.id, 'filled')}
                    >
                      <i className="fas fa-check-circle"></i> Mark as Filled
                    </button>
                  )}
                  <button className="btn-icon">
                    <i className="fas fa-print"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Inventory Management */}
        <div className="card" style={{ marginTop: '20px' }}>
          <div className="card-header">
            <div className="card-title">Medication Inventory</div>
            <button className="btn">
              <i className="fas fa-plus"></i> Reorder Stock
            </button>
          </div>
          
          {lowStockItems.length > 0 && (
            <div className="inventory-alert">
              <i className="fas fa-exclamation-triangle"></i>
              <span>{lowStockItems.length} medications below stock threshold</span>
            </div>
          )}
          
          <div className="inventory-grid">
            {inventory.map(med => (
              <div key={med.id} className={`inventory-item ${med.stock < med.threshold ? 'low-stock' : ''}`}>
                <div className="inventory-name">{med.name}</div>
                <div className="inventory-stock">
                  <div className="stock-value">{med.stock}</div>
                  <div className="stock-label">in stock</div>
                </div>
                <div className="inventory-threshold">
                  Threshold: {med.threshold}
                </div>
                <div className="inventory-last-order">
                  Last order: {med.lastOrder}
                </div>
                <button className="btn-icon">
                  <i className="fas fa-box"></i> Reorder
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Medical Records Page
const RecordsPage = ({ patients }) => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([
    { id: "REC-1001", patientId: "PT-1001", date: "2023-05-15", type: "Visit Note", provider: "Dr. Sarah Johnson", diagnosis: "Type 2 Diabetes" },
    { id: "REC-1002", patientId: "PT-1001", date: "2023-04-10", type: "Lab Result", provider: "MedLab Inc", test: "HbA1c", result: "7.2%" },
    { id: "REC-1003", patientId: "PT-1001", date: "2023-03-22", type: "Imaging", provider: "Radiology Center", study: "Chest X-ray", findings: "Normal" },
    { id: "REC-1004", patientId: "PT-1002", date: "2023-05-18", type: "Visit Note", provider: "Dr. Michael Chen", diagnosis: "Asthma exacerbation" },
    { id: "REC-1005", patientId: "PT-1003", date: "2023-05-10", type: "Procedure", provider: "Dr. Robert Williams", procedure: "Knee injection" }
  ]);
  
  const [newRecord, setNewRecord] = useState({
    type: 'Visit Note',
    date: new Date().toISOString().split('T')[0],
    provider: '',
    diagnosis: '',
    notes: ''
  });
  
  const [showRecordForm, setShowRecordForm] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecord(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddRecord = () => {
    if (selectedPatient && newRecord.type) {
      const record = {
        id: `REC-${Math.floor(1000 + Math.random() * 9000)}`,
        patientId: selectedPatient.id,
        ...newRecord
      };
      
      setMedicalRecords(prev => [record, ...prev]);
      
      setNewRecord({
        type: 'Visit Note',
        date: new Date().toISOString().split('T')[0],
        provider: '',
        diagnosis: '',
        notes: ''
      });
      setShowRecordForm(false);
    }
  };
  
  const patientRecords = selectedPatient 
    ? medicalRecords.filter(record => record.patientId === selectedPatient.id) 
    : [];
  
  return (
    <div className="records-page">
      <div className="page-header">
        <div className="page-title">
          <i className="fas fa-file-medical"></i>
          <span>Medical Records</span>
        </div>
        <button 
          className="btn" 
          disabled={!selectedPatient}
          onClick={() => setShowRecordForm(true)}
        >
          <i className="fas fa-plus"></i> Add Record
        </button>
      </div>
      
      <div className="records-container">
        {/* Patient Selector */}
        <div className="card">
          <div className="card-header">
            <h3>Select Patient</h3>
          </div>
          <div className="patient-selector">
            {patients.map(patient => (
              <div 
                key={patient.id} 
                className={`patient-selector-item ${selectedPatient?.id === patient.id ? 'selected' : ''}`}
                onClick={() => setSelectedPatient(patient)}
              >
                <div className="patient-avatar">
                  {patient.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="patient-info">
                  <div className="patient-name">{patient.name}</div>
                  <div className="patient-id">ID: {patient.id}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Records Management */}
        <div className="card">
          <div className="card-header">
            <h3>
              {selectedPatient 
                ? `${selectedPatient.name}'s Medical Records` 
                : "Select a patient to view records"}
            </h3>
            <input type="text" placeholder="Search records..." />
          </div>
          
          {showRecordForm && (
            <div className="record-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Record Type</label>
                  <select 
                    name="type" 
                    value={newRecord.type} 
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Visit Note">Visit Note</option>
                    <option value="Lab Result">Lab Result</option>
                    <option value="Imaging">Imaging Study</option>
                    <option value="Procedure">Procedure Note</option>
                    <option value="Prescription">Prescription</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Date</label>
                  <input 
                    type="date" 
                    name="date" 
                    value={newRecord.date} 
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Provider</label>
                  <input 
                    type="text" 
                    name="provider" 
                    value={newRecord.provider} 
                    onChange={handleInputChange}
                    placeholder="Provider name"
                    required
                  />
                </div>
              </div>
              
              {newRecord.type === 'Visit Note' && (
                <div className="form-group">
                  <label>Diagnosis</label>
                  <input 
                    type="text" 
                    name="diagnosis" 
                    value={newRecord.diagnosis} 
                    onChange={handleInputChange}
                    placeholder="Primary diagnosis"
                  />
                </div>
              )}
              
              {newRecord.type === 'Lab Result' && (
                <div className="form-row">
                  <div className="form-group">
                    <label>Test Name</label>
                    <input 
                      type="text" 
                      name="test" 
                      value={newRecord.test || ''} 
                      onChange={handleInputChange}
                      placeholder="Test name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Result</label>
                    <input 
                      type="text" 
                      name="result" 
                      value={newRecord.result || ''} 
                      onChange={handleInputChange}
                      placeholder="Test result"
                    />
                  </div>
                </div>
              )}
              
              <div className="form-group">
                <label>Notes</label>
                <textarea 
                  name="notes" 
                  value={newRecord.notes} 
                  onChange={handleInputChange}
                  placeholder="Clinical notes..."
                  rows="4"
                />
              </div>
              
              <div className="form-actions">
                <button 
                  className="btn" 
                  onClick={() => setShowRecordForm(false)}
                >
                  Cancel
                </button>
                <button 
                  className="save-btn" 
                  onClick={handleAddRecord}
                >
                  Save Record
                </button>
              </div>
            </div>
          )}
          
          {selectedPatient && (
            <div className="records-list">
              {patientRecords.length > 0 ? (
                patientRecords.map(record => (
                  <div key={record.id} className="record-item">
                    <div className="record-header">
                      <div className="record-type">{record.type}</div>
                      <div className="record-date">{record.date}</div>
                    </div>
                    <div className="record-provider">
                      Provider: {record.provider}
                    </div>
                    {record.diagnosis && (
                      <div className="record-diagnosis">
                        Diagnosis: {record.diagnosis}
                      </div>
                    )}
                    {record.test && (
                      <div className="record-test">
                        Test: {record.test} = {record.result}
                      </div>
                    )}
                    {record.notes && (
                      <div className="record-notes">
                        {record.notes}
                      </div>
                    )}
                    <div className="record-actions">
                      <button className="btn-icon">
                        <i className="fas fa-print"></i> Print
                      </button>
                      <button className="btn-icon">
                        <i className="fas fa-share-alt"></i> Share
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-records">
                  <i className="fas fa-file-medical-alt"></i>
                  <h4>No medical records found</h4>
                  <p>Add a new record or select another patient</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Health Programs Page
const ProgramsPage = () => {
  const [programs, setPrograms] = useState([
    { id: "PROG-101", name: "Diabetes Management", participants: 42, status: "active", startDate: "2023-01-15" },
    { id: "PROG-102", name: "Cardiac Rehabilitation", participants: 28, status: "active", startDate: "2023-03-01" },
    { id: "PROG-103", name: "Weight Management", participants: 65, status: "active", startDate: "2022-11-10" },
    { id: "PROG-104", name: "Smoking Cessation", participants: 19, status: "completed", startDate: "2023-02-20", endDate: "2023-05-20" },
    { id: "PROG-105", name: "Pulmonary Rehabilitation", participants: 15, status: "upcoming", startDate: "2023-06-01" }
  ]);
  
  const [enrollments, setEnrollments] = useState([
    { id: "ENR-1001", patient: "John Smith", program: "PROG-101", status: "active", startDate: "2023-02-10", progress: 65 },
    { id: "ENR-1002", patient: "Emma Wilson", program: "PROG-103", status: "active", startDate: "2023-01-20", progress: 80 },
    { id: "ENR-1003", patient: "Robert Brown", program: "PROG-102", status: "completed", startDate: "2023-03-05", endDate: "2023-05-15", progress: 100 },
    { id: "ENR-1004", patient: "Lisa Davis", program: "PROG-101", status: "active", startDate: "2023-04-22", progress: 30 },
    { id: "ENR-1005", patient: "Michael Taylor", program: "PROG-103", status: "active", startDate: "2022-12-01", progress: 95 }
  ]);
  
  const [activeTab, setActiveTab] = useState('programs');
  const [newProgram, setNewProgram] = useState({
    name: '',
    description: '',
    type: 'Chronic Disease',
    status: 'upcoming',
    startDate: new Date().toISOString().split('T')[0]
  });
  
  const [showProgramForm, setShowProgramForm] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProgram(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddProgram = () => {
    if (newProgram.name) {
      const program = {
        id: `PROG-${Math.floor(1000 + Math.random() * 9000)}`,
        name: newProgram.name,
        description: newProgram.description,
        type: newProgram.type,
        status: newProgram.status,
        startDate: newProgram.startDate,
        participants: 0
      };
      
      setPrograms(prev => [program, ...prev]);
      
      setNewProgram({
        name: '',
        description: '',
        type: 'Chronic Disease',
        status: 'upcoming',
        startDate: new Date().toISOString().split('T')[0]
      });
      setShowProgramForm(false);
    }
  };
  
  const updateEnrollmentStatus = (id, status) => {
    setEnrollments(enrollments.map(enrollment => 
      enrollment.id === id ? {...enrollment, status} : enrollment
    ));
  };
  
  const activePrograms = programs.filter(p => p.status === 'active');
  
  return (
    <div className="programs-page">
      <div className="page-header">
        <div className="page-title">
          <i className="fas fa-heartbeat"></i>
          <span>Health Programs</span>
        </div>
        <button className="btn" onClick={() => setShowProgramForm(true)}>
          <i className="fas fa-plus"></i> New Program
        </button>
      </div>
      
      {/* Tabs */}
      <div className="tabs">
        <div 
          className={`tab ${activeTab === 'programs' ? 'active' : ''}`}
          onClick={() => setActiveTab('programs')}
        >
          <i className="fas fa-project-diagram"></i> Programs
        </div>
        <div 
          className={`tab ${activeTab === 'participants' ? 'active' : ''}`}
          onClick={() => setActiveTab('participants')}
        >
          <i className="fas fa-users"></i> Participants
        </div>
        <div 
          className={`tab ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          <i className="fas fa-chart-bar"></i> Reports
        </div>
      </div>
      
      {showProgramForm && (
        <div className="card">
          <div className="card-header">
            <h3>Create New Health Program</h3>
          </div>
          <div className="card-body">
            <div className="form-row">
              <div className="form-group">
                <label>Program Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={newProgram.name} 
                  onChange={handleInputChange}
                  placeholder="Program name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Program Type</label>
                <select 
                  name="type" 
                  value={newProgram.type} 
                  onChange={handleInputChange}
                  required
                >
                  <option value="Chronic Disease">Chronic Disease Management</option>
                  <option value="Rehabilitation">Rehabilitation</option>
                  <option value="Preventive">Preventive Care</option>
                  <option value="Wellness">Wellness Program</option>
                  <option value="Behavioral">Behavioral Health</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea 
                name="description" 
                value={newProgram.description} 
                onChange={handleInputChange}
                placeholder="Program description..."
                rows="3"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Status</label>
                <select 
                  name="status" 
                  value={newProgram.status} 
                  onChange={handleInputChange}
                  required
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Start Date</label>
                <input 
                  type="date" 
                  name="startDate" 
                  value={newProgram.startDate} 
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button 
                className="btn" 
                onClick={() => setShowProgramForm(false)}
              >
                Cancel
              </button>
              <button 
                className="save-btn" 
                onClick={handleAddProgram}
              >
                Create Program
              </button>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'programs' && (
        <div className="programs-grid">
          {programs.map(program => (
            <div key={program.id} className={`program-card status-${program.status}`}>
              <div className="program-header">
                <div className="program-name">{program.name}</div>
                <div className="program-status">{program.status}</div>
              </div>
              <div className="program-type">{program.type}</div>
              <div className="program-stats">
                <div className="stat">
                  <i className="fas fa-users"></i>
                  {program.participants} Participants
                </div>
                <div className="stat">
                  <i className="fas fa-calendar"></i>
                  {program.startDate}
                </div>
              </div>
              <div className="program-description">
                {program.description || "No description available"}
              </div>
              <div className="program-actions">
                <button className="btn">
                  <i className="fas fa-eye"></i> View Details
                </button>
                <button className="btn">
                  <i className="fas fa-user-plus"></i> Enroll Patients
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {activeTab === 'participants' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">Program Participants</div>
            <select className="form-select">
              <option>All Programs</option>
              {activePrograms.map(program => (
                <option key={program.id} value={program.id}>{program.name}</option>
              ))}
            </select>
          </div>
          
          <div className="participants-list">
            <div className="participant-header">
              <div>Patient</div>
              <div>Program</div>
              <div>Start Date</div>
              <div>Progress</div>
              <div>Status</div>
              <div>Actions</div>
            </div>
            
            {enrollments.map(enrollment => (
              <div key={enrollment.id} className="participant-item">
                <div className="participant-patient">{enrollment.patient}</div>
                <div className="participant-program">
                  {programs.find(p => p.id === enrollment.program)?.name || enrollment.program}
                </div>
                <div className="participant-start">{enrollment.startDate}</div>
                <div className="participant-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${enrollment.progress}%` }}
                    ></div>
                  </div>
                  <div className="progress-text">{enrollment.progress}%</div>
                </div>
                <div className={`participant-status status-${enrollment.status}`}>
                  {enrollment.status}
                </div>
                <div className="participant-actions">
                  {enrollment.status === 'active' && (
                    <button 
                      className="btn-icon success"
                      onClick={() => updateEnrollmentStatus(enrollment.id, 'completed')}
                    >
                      <i className="fas fa-check"></i> Complete
                    </button>
                  )}
                  <button className="btn-icon">
                    <i className="fas fa-chart-line"></i> Progress
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {activeTab === 'reports' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">Program Analytics</div>
            <select className="form-select">
              <option>Overall Summary</option>
              {programs.map(program => (
                <option key={program.id} value={program.id}>{program.name} Report</option>
              ))}
            </select>
          </div>
          
          <div className="program-analytics">
            <div className="analytics-row">
              <div className="metric-card">
                <div className="metric-value">87%</div>
                <div className="metric-label">Average Completion Rate</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">4.2/5</div>
                <div className="metric-label">Participant Satisfaction</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">42%</div>
                <div className="metric-label">Health Outcome Improvement</div>
              </div>
            </div>
            
            <div className="chart-container">
              <canvas id="program-chart"></canvas>
            </div>
            
            <div className="program-comparison">
              <h4>Program Effectiveness</h4>
              <table>
                <thead>
                  <tr>
                    <th>Program</th>
                    <th>Participants</th>
                    <th>Completion Rate</th>
                    <th>Satisfaction</th>
                    <th>Health Improvement</th>
                  </tr>
                </thead>
                <tbody>
                  {programs.map(program => (
                    <tr key={program.id}>
                      <td>{program.name}</td>
                      <td>{program.participants}</td>
                      <td>{(Math.random() * 30 + 70).toFixed(0)}%</td>
                      <td>{(Math.random() + 3.5).toFixed(1)}/5</td>
                      <td>{(Math.random() * 30 + 30).toFixed(0)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Analytics Page
const AnalyticsPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('last30');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  
  // Mock analytics data
  const analyticsData = {
    overview: {
      totalPatients: 1245,
      newPatients: 42,
      avgWaitTime: 15,
      satisfaction: 4.7
    },
    financial: {
      revenue: 245832,
      expenses: 187945,
      outstanding: 42875,
      collections: 92.4
    },
    clinical: {
      readmissionRate: 8.2,
      avgHospitalStay: 4.5,
      infectionRate: 1.8,
      mortalityRate: 2.1
    }
  };
  
  // Mock department data
  const departments = [
    { id: 'cardio', name: 'Cardiology', patients: 320, revenue: 84250 },
    { id: 'neuro', name: 'Neurology', patients: 285, revenue: 76500 },
    { id: 'ortho', name: 'Orthopedics', patients: 198, revenue: 62300 },
    { id: 'peds', name: 'Pediatrics', patients: 312, revenue: 56700 },
    { id: 'onco', name: 'Oncology', patients: 175, revenue: 105200 }
  ];
  
  // Mock patient demographics
  const demographics = [
    { ageGroup: '0-18', count: 215, percentage: 17.3 },
    { ageGroup: '19-35', count: 320, percentage: 25.7 },
    { ageGroup: '36-50', count: 285, percentage: 22.9 },
    { ageGroup: '51-65', count: 245, percentage: 19.7 },
    { ageGroup: '65+', count: 180, percentage: 14.5 }
  ];
  
  const filteredDepartments = departmentFilter === 'all' 
    ? departments 
    : departments.filter(dept => dept.id === departmentFilter);
  
  return (
    <div className="analytics-page">
      <div className="page-header">
        <div className="page-title">
          <i className="fas fa-chart-line"></i>
          <span>Healthcare Analytics</span>
        </div>
        <div className="date-filter">
          <select 
            className="form-select"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="last7">Last 7 Days</option>
            <option value="last30">Last 30 Days</option>
            <option value="last90">Last 90 Days</option>
            <option value="ytd">Year to Date</option>
            <option value="full">Full Year</option>
          </select>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="tabs">
        <div 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <i className="fas fa-home"></i> Overview
        </div>
        <div 
          className={`tab ${activeTab === 'financial' ? 'active' : ''}`}
          onClick={() => setActiveTab('financial')}
        >
          <i className="fas fa-dollar-sign"></i> Financial
        </div>
        <div 
          className={`tab ${activeTab === 'clinical' ? 'active' : ''}`}
          onClick={() => setActiveTab('clinical')}
        >
          <i className="fas fa-heartbeat"></i> Clinical
        </div>
        <div 
          className={`tab ${activeTab === 'operations' ? 'active' : ''}`}
          onClick={() => setActiveTab('operations')}
        >
          <i className="fas fa-clipboard-list"></i> Operations
        </div>
      </div>
      
      {activeTab === 'overview' && (
        <div className="analytics-overview">
          <div className="stats-grid">
            <StatCard 
              icon="fas fa-user-injured"
              color="rgba(26, 115, 232, 0.1)"
              iconColor="var(--primary)"
              title="Total Patients"
              value={analyticsData.overview.totalPatients}
              change="5.2% from last period"
              changeType="positive"
            />
            
            <StatCard 
              icon="fas fa-user-plus"
              color="rgba(0, 200, 83, 0.1)"
              iconColor="var(--secondary)"
              title="New Patients"
              value={analyticsData.overview.newPatients}
              change="12 new this month"
              changeType="positive"
            />
            
            <StatCard 
              icon="fas fa-clock"
              color="rgba(255, 171, 0, 0.1)"
              iconColor="var(--warning)"
              title="Avg. Wait Time"
              value={`${analyticsData.overview.avgWaitTime} min`}
              change="2 min improvement"
              changeType="positive"
            />
            
            <StatCard 
              icon="fas fa-smile"
              color="rgba(156, 39, 176, 0.1)"
              iconColor="var(--purple)"
              title="Satisfaction"
              value={analyticsData.overview.satisfaction}
              change="0.3 increase"
              changeType="positive"
            />
          </div>
          
          <div className="analytics-row">
            <div className="card">
              <div className="card-header">
                <h3>Patient Demographics</h3>
              </div>
              <div className="demographics-chart">
                <canvas id="demographics-chart"></canvas>
              </div>
            </div>
            
            <div className="card">
              <div className="card-header">
                <h3>Department Performance</h3>
                <select 
                  className="form-select"
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                  <option value="all">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>
              <div className="department-performance">
                <table>
                  <thead>
                    <tr>
                      <th>Department</th>
                      <th>Patients</th>
                      <th>Revenue</th>
                      <th>Avg. Cost</th>
                      <th>Utilization</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDepartments.map(dept => (
                      <tr key={dept.id}>
                        <td>{dept.name}</td>
                        <td>{dept.patients}</td>
                        <td>${dept.revenue.toLocaleString()}</td>
                        <td>${Math.round(dept.revenue / dept.patients).toLocaleString()}</td>
                        <td>{(Math.random() * 30 + 70).toFixed(0)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <h3>Patient Volume Trends</h3>
            </div>
            <div className="trend-chart">
              <canvas id="volume-trend-chart"></canvas>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'financial' && (
        <div className="analytics-financial">
          <div className="stats-grid">
            <StatCard 
              icon="fas fa-money-bill-wave"
              color="rgba(0, 200, 83, 0.1)"
              iconColor="var(--secondary)"
              title="Total Revenue"
              value={`$${analyticsData.financial.revenue.toLocaleString()}`}
              change="8.3% increase"
              changeType="positive"
            />
            
            <StatCard 
              icon="fas fa-file-invoice-dollar"
              color="rgba(255, 171, 0, 0.1)"
              iconColor="var(--warning)"
              title="Outstanding"
              value={`$${analyticsData.financial.outstanding.toLocaleString()}`}
              change="12.7% decrease"
              changeType="positive"
            />
            
            <StatCard 
              icon="fas fa-wallet"
              color="rgba(255, 82, 82, 0.1)"
              iconColor="var(--danger)"
              title="Expenses"
              value={`$${analyticsData.financial.expenses.toLocaleString()}`}
              change="4.2% increase"
              changeType="negative"
            />
            
            <StatCard 
              icon="fas fa-percentage"
              color="rgba(156, 39, 176, 0.1)"
              iconColor="var(--purple)"
              title="Collection Rate"
              value={`${analyticsData.financial.collections}%`}
              change="1.5% improvement"
              changeType="positive"
            />
          </div>
          
          <div className="analytics-row">
            <div className="card">
              <div className="card-header">
                <h3>Revenue by Department</h3>
              </div>
              <div className="revenue-chart">
                <canvas id="revenue-chart"></canvas>
              </div>
            </div>
            
            <div className="card">
              <div className="card-header">
                <h3>Expense Breakdown</h3>
              </div>
              <div className="expense-chart">
                <canvas id="expense-chart"></canvas>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <h3>Financial Trends</h3>
            </div>
            <div className="trend-chart">
              <canvas id="financial-trend-chart"></canvas>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'clinical' && (
        <div className="analytics-clinical">
          <div className="stats-grid">
            <StatCard 
              icon="fas fa-procedures"
              color="rgba(255, 82, 82, 0.1)"
              iconColor="var(--danger)"
              title="Readmission Rate"
              value={`${analyticsData.clinical.readmissionRate}%`}
              change="1.2% decrease"
              changeType="positive"
            />
            
            <StatCard 
              icon="fas fa-bed"
              color="rgba(26, 115, 232, 0.1)"
              iconColor="var(--primary)"
              title="Avg. Hospital Stay"
              value={`${analyticsData.clinical.avgHospitalStay} days`}
              change="0.3 day reduction"
              changeType="positive"
            />
            
            <StatCard 
              icon="fas fa-virus"
              color="rgba(255, 171, 0, 0.1)"
              iconColor="var(--warning)"
              title="Infection Rate"
              value={`${analyticsData.clinical.infectionRate}%`}
              change="0.4% improvement"
              changeType="positive"
            />
            
            <StatCard 
              icon="fas fa-heartbeat"
              color="rgba(156, 39, 176, 0.1)"
              iconColor="var(--purple)"
              title="Mortality Rate"
              value={`${analyticsData.clinical.mortalityRate}%`}
              change="0.2% improvement"
              changeType="positive"
            />
          </div>
          
          <div className="analytics-row">
            <div className="card">
              <div className="card-header">
                <h3>Disease Prevalence</h3>
              </div>
              <div className="disease-chart">
                <canvas id="disease-chart"></canvas>
              </div>
            </div>
            
            <div className="card">
              <div className="card-header">
                <h3>Treatment Outcomes</h3>
              </div>
              <div className="outcome-chart">
                <canvas id="outcome-chart"></canvas>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <h3>Quality Metrics</h3>
            </div>
            <div className="quality-metrics">
              <table>
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Current</th>
                    <th>Target</th>
                    <th>Benchmark</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Diabetes Control (HbA1c &lt; 7%)</td>
                    <td>68%</td>
                    <td>75%</td>
                    <td>72%</td>
                    <td className="metric-warning">Needs Improvement</td>
                  </tr>
                  <tr>
                    <td>Hypertension Control (&lt; 140/90)</td>
                    <td>76%</td>
                    <td>80%</td>
                    <td>78%</td>
                    <td className="metric-positive">On Track</td>
                  </tr>
                  <tr>
                    <td>Cancer Screening Rate</td>
                    <td>62%</td>
                    <td>70%</td>
                    <td>65%</td>
                    <td className="metric-warning">Needs Improvement</td>
                  </tr>
                  <tr>
                    <td>Vaccination Rate</td>
                    <td>85%</td>
                    <td>90%</td>
                    <td>88%</td>
                    <td className="metric-positive">On Track</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'operations' && (
        <div className="analytics-operations">
          <div className="stats-grid">
            <StatCard 
              icon="fas fa-user-md"
              color="rgba(26, 115, 232, 0.1)"
              iconColor="var(--primary)"
              title="Physician Utilization"
              value="84%"
              change="3% improvement"
              changeType="positive"
            />
            
            <StatCard 
              icon="fas fa-bed"
              color="rgba(0, 200, 83, 0.1)"
              iconColor="var(--secondary)"
              title="Bed Occupancy"
              value="78%"
              change="Optimal range"
              changeType="positive"
            />
            
            <StatCard 
              icon="fas fa-clock"
              color="rgba(255, 171, 0, 0.1)"
              iconColor="var(--warning)"
              title="Avg. Appointment Time"
              value="22 min"
              change="2 min increase"
              changeType="negative"
            />
            
            <StatCard 
              icon="fas fa-sync-alt"
              color="rgba(156, 39, 176, 0.1)"
              iconColor="var(--purple)"
              title="Patient No-Show Rate"
              value="12%"
              change="1.5% decrease"
              changeType="positive"
            />
          </div>
          
          <div className="analytics-row">
            <div className="card">
              <div className="card-header">
                <h3>Resource Utilization</h3>
              </div>
              <div className="resource-chart">
                <canvas id="resource-chart"></canvas>
              </div>
            </div>
            
            <div className="card">
              <div className="card-header">
                <h3>Staff Productivity</h3>
              </div>
              <div className="productivity-chart">
                <canvas id="productivity-chart"></canvas>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <h3>Operational Efficiency</h3>
            </div>
            <div className="efficiency-metrics">
              <table>
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Avg. Wait Time</th>
                    <th>Patient Throughput</th>
                    <th>Staff to Patient Ratio</th>
                    <th>Cost per Patient</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map(dept => (
                    <tr key={dept.id}>
                      <td>{dept.name}</td>
                      <td>{Math.floor(Math.random() * 10 + 10)} min</td>
                      <td>{Math.floor(Math.random() * 20 + 30)} patients/day</td>
                      <td>1:{Math.floor(Math.random() * 8 + 4)}</td>
                      <td>${Math.floor(Math.random() * 200 + 150)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;