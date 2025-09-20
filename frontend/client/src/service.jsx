
import axios from 'axios';

// API Base URL - Adjust for production
const API_BASE_URL = 'https://health-backend-1-ka82.onrender.com/api';

// Axios instance with interceptors for auth
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login'; // Redirect to login if unauthorized
    }
    return Promise.reject(error);
  }
);

// HealthcareService class for all API calls
class HealthcareService {
  // Authentication methods
  static async login(username, password) {
    try {
      const response = await api.post('/login', { username, password });
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
      }
      throw new Error('Invalid credentials');
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  }

  static logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // PATIENTS CRUD
  static async fetchPatients(params = {}) {
    try {
      const response = await api.get('/patients', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch patients';
    }
  }

  static async createPatient(patientData) {
    try {
      const response = await api.post('/patients', patientData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to create patient';
    }
  }

  static async fetchPatient(patientId) {
    try {
      const response = await api.get(`/patients/${patientId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch patient';
    }
  }

  static async updatePatient(patientId, patientData) {
    try {
      const response = await api.put(`/patients/${patientId}`, patientData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update patient';
    }
  }

  static async deletePatient(patientId) {
    try {
      const response = await api.delete(`/patients/${patientId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete patient';
    }
  }

  // APPOINTMENTS CRUD
  static async fetchAppointments(params = {}) {
    try {
      const response = await api.get('/appointments', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch appointments';
    }
  }

  static async createAppointment(appointmentData) {
    try {
      const response = await api.post('/appointments', appointmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to create appointment';
    }
  }

  static async fetchAppointment(appointmentId) {
    try {
      const response = await api.get(`/appointments/${appointmentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch appointment';
    }
  }

  static async updateAppointment(appointmentId, appointmentData) {
    try {
      const response = await api.put(`/appointments/${appointmentId}`, appointmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update appointment';
    }
  }

  static async deleteAppointment(appointmentId) {
    try {
      const response = await api.delete(`/appointments/${appointmentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete appointment';
    }
  }

  // PRESCRIPTIONS CRUD
  static async fetchPrescriptions(params = {}) {
    try {
      const response = await api.get('/prescriptions', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch prescriptions';
    }
  }

  static async createPrescription(prescriptionData) {
    try {
      const response = await api.post('/prescriptions', prescriptionData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to create prescription';
    }
  }

  static async fetchPrescription(prescriptionId) {
    try {
      const response = await api.get(`/prescriptions/${prescriptionId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch prescription';
    }
  }

  static async updatePrescription(prescriptionId, prescriptionData) {
    try {
      const response = await api.put(`/prescriptions/${prescriptionId}`, prescriptionData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update prescription';
    }
  }

  static async deletePrescription(prescriptionId) {
    try {
      const response = await api.delete(`/prescriptions/${prescriptionId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete prescription';
    }
  }

  // LAB RESULTS CRUD
  static async fetchLabResults(params = {}) {
    try {
      const response = await api.get('/labresults', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch lab results';
    }
  }

  static async createLabResult(labData) {
    try {
      const response = await api.post('/labresults', labData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to create lab result';
    }
  }

  static async fetchLabResult(labResultId) {
    try {
      const response = await api.get(`/labresults/${labResultId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch lab result';
    }
  }

  static async updateLabResult(labResultId, labData) {
    try {
      const response = await api.put(`/labresults/${labResultId}`, labData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update lab result';
    }
  }

  static async deleteLabResult(labResultId) {
    try {
      const response = await api.delete(`/labresults/${labResultId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete lab result';
    }
  }

  // MEDICAL RECORDS CRUD
  static async fetchMedicalRecords(params = {}) {
    try {
      const response = await api.get('/medical_records', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch medical records';
    }
  }

  static async createMedicalRecord(recordData) {
    try {
      const response = await api.post('/medical_records', recordData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to create medical record';
    }
  }

  static async fetchMedicalRecord(recordId) {
    try {
      const response = await api.get(`/medical_records/${recordId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch medical record';
    }
  }

  static async updateMedicalRecord(recordId, recordData) {
    try {
      const response = await api.put(`/medical_records/${recordId}`, recordData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update medical record';
    }
  }

  static async deleteMedicalRecord(recordId) {
    try {
      const response = await api.delete(`/medical_records/${recordId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete medical record';
    }
  }

  // VITAL SIGNS CRUD
  static async fetchVitalSigns(params = {}) {
    try {
      const response = await api.get('/vital_signs', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch vital signs';
    }
  }

  static async createVitalSign(vitalData) {
    try {
      const response = await api.post('/vital_signs', vitalData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to create vital sign';
    }
  }

  static async fetchVitalSign(vitalId) {
    try {
      const response = await api.get(`/vital_signs/${vitalId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch vital sign';
    }
  }

  static async updateVitalSign(vitalId, vitalData) {
    try {
      const response = await api.put(`/vital_signs/${vitalId}`, vitalData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update vital sign';
    }
  }

  static async deleteVitalSign(vitalId) {
    try {
      const response = await api.delete(`/vital_signs/${vitalId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete vital sign';
    }
  }

  // PROGRAMS CRUD
  static async fetchPrograms(params = {}) {
    try {
      const response = await api.get('/programs', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch programs';
    }
  }

  static async createProgram(programData) {
    try {
      const response = await api.post('/programs', programData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to create program';
    }
  }

  static async fetchProgram(programId) {
    try {
      const response = await api.get(`/programs/${programId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch program';
    }
  }

  static async updateProgram(programId, programData) {
    try {
      const response = await api.put(`/programs/${programId}`, programData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update program';
    }
  }

  static async deleteProgram(programId) {
    try {
      const response = await api.delete(`/programs/${programId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete program';
    }
  }

  static async enrollPatient(programId, patientId) {
    try {
      const response = await api.post(`/programs/${programId}/enroll`, { patient_id: patientId });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to enroll patient';
    }
  }

  static async unenrollPatient(programId, patientId) {
    try {
      const response = await api.delete(`/programs/${programId}/enroll/${patientId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to unenroll patient';
    }
  }

  // MEDICATION INVENTORY CRUD
  static async fetchMedicationInventory(params = {}) {
    try {
      const response = await api.get('/medications/inventory', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch medication inventory';
    }
  }

  static async createMedication(medicationData) {
    try {
      const response = await api.post('/medications', medicationData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to create medication';
    }
  }

  static async fetchMedication(medicationId) {
    try {
      const response = await api.get(`/medications/${medicationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch medication';
    }
  }

  static async updateMedication(medicationId, medicationData) {
    try {
      const response = await api.put(`/medications/${medicationId}`, medicationData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update medication';
    }
  }

  static async deleteMedication(medicationId) {
    try {
      const response = await api.delete(`/medications/${medicationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete medication';
    }
  }

  static async updateMedicationInventory(inventoryData) {
    try {
      const response = await api.post('/medications/inventory', inventoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update medication inventory';
    }
  }

  // PENDING ACTIONS CRUD
  static async fetchPendingActions(params = {}) {
    try {
      const response = await api.get('/pending_actions', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch pending actions';
    }
  }

  static async createPendingAction(actionData) {
    try {
      const response = await api.post('/pending_actions', actionData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to create pending action';
    }
  }

  static async fetchPendingAction(actionId) {
    try {
      const response = await api.get(`/pending_actions/${actionId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch pending action';
    }
  }

  static async updatePendingAction(actionId, actionData) {
    try {
      const response = await api.put(`/pending_actions/${actionId}`, actionData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update pending action';
    }
  }

  static async completePendingAction(actionId) {
    try {
      const response = await api.post(`/pending_actions/${actionId}/complete`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to complete pending action';
    }
  }

  static async deletePendingAction(actionId) {
    try {
      const response = await api.delete(`/pending_actions/${actionId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete pending action';
    }
  }

  // NOTIFICATIONS CRUD
  static async fetchNotifications(params = {}) {
    try {
      const response = await api.get('/notifications', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch notifications';
    }
  }

  static async createNotification(notificationData) {
    try {
      const response = await api.post('/notifications', notificationData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to create notification';
    }
  }

  static async fetchNotification(notificationId) {
    try {
      const response = await api.get(`/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch notification';
    }
  }

  static async updateNotification(notificationId, notificationData) {
    try {
      const response = await api.put(`/notifications/${notificationId}`, notificationData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update notification';
    }
  }

  static async markNotificationRead(notificationId) {
    try {
      const response = await api.post(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to mark notification as read';
    }
  }

  static async deleteNotification(notificationId) {
    try {
      const response = await api.delete(`/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete notification';
    }
  }

  // AUDIT LOGS
  static async fetchAuditLogs(params = {}) {
    try {
      const response = await api.get('/audit_logs', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch audit logs';
    }
  }

  // DOCTORS CRUD (assuming doctors endpoint exists)
  static async fetchDoctors(params = {}) {
    try {
      const response = await api.get('/doctors', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch doctors';
    }
  }

  static async createDoctor(doctorData) {
    try {
      const response = await api.post('/doctors', doctorData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to create doctor';
    }
  }

  static async fetchDoctor(doctorId) {
    try {
      const response = await api.get(`/doctors/${doctorId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch doctor';
    }
  }

  static async updateDoctor(doctorId, doctorData) {
    try {
      const response = await api.put(`/doctors/${doctorId}`, doctorData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update doctor';
    }
  }

  static async deleteDoctor(doctorId) {
    try {
      const response = await api.delete(`/doctors/${doctorId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to delete doctor';
    }
  }

  // DASHBOARD STATS
  static async fetchDashboardStats() {
    try {
      const response = await api.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch dashboard stats';
    }
  }

  // SEARCH
  static async search(query, type = 'all') {
    try {
      const response = await api.get('/search', { params: { q: query, type } });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Search failed';
    }
  }

  // USER PROFILE
  static async fetchUserProfile() {
    try {
      const response = await api.get('/user/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch user profile';
    }
  }

  static async updateUserProfile(profileData) {
    try {
      const response = await api.put('/user/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to update user profile';
    }
  }

  // ANALYTICS
  static async fetchPatientAnalytics(params = {}) {
    try {
      const response = await api.get('/analytics/patient_stats', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to fetch patient analytics';
    }
  }

  // BULK OPERATIONS
  static async bulkCreatePatients(patientDataArray) {
    try {
      const response = await api.post('/patients/bulk', patientDataArray);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to bulk create patients';
    }
  }

  static async bulkDeletePatients(patientIds) {
    try {
      const response = await api.delete('/patients/bulk', { data: { ids: patientIds } });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to bulk delete patients';
    }
  }

  // UTILITY METHODS
  static getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  static isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  static async refreshToken() {
    try {
      const response = await api.post('/auth/refresh');
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        return response.data;
      }
      throw new Error('Token refresh failed');
    } catch (error) {
      this.logout();
      throw error;
    }
  }
}

export default HealthcareService;