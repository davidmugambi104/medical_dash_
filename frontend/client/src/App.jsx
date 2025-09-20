import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import { Chart, registerables } from 'chart.js';
import moment from 'moment';
import axios from 'axios';

// Register Chart.js components
Chart.register(...registerables);

// API Service Layer - Enhanced with retry logic and better error handling
const API_BASE_URL = 'https://health-backend-1-ka82.onrender.com/api';

// Enhanced Axios instance with better interceptors
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token with retry mechanism
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

// Enhanced response interceptor with better error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
        const { token, refreshToken: newRefreshToken } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', newRefreshToken);
        
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
        originalRequest.headers.Authorization = `Bearer ${token}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response);
      throw new Error('Server is unavailable. Please try again later.');
    }
    
    return Promise.reject(error);
  }
);

// Enhanced HealthcareService class with better error handling and retry logic
class HealthcareService {
  static async requestWithRetry(requestFunc, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await requestFunc();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
      }
    }
  }

  // Authentication methods
  static async login(username, password) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.post('/auth/login', { username, password });
        if (response.data.success) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          return response.data;
        }
        throw new Error('Invalid credentials');
      } catch (error) {
        throw error.response?.data?.message || 'Login failed';
      }
    });
  }

  static async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  // Enhanced CRUD operations with better error handling
  // PATIENTS CRUD
  static async fetchPatients(params = {}) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.get('/patients', { params });
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch patients';
      }
    });
  }

  static async createPatient(patientData) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.post('/patients', patientData);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to create patient';
      }
    });
  }

  static async fetchPatient(patientId) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.get(`/patients/${patientId}`);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch patient';
      }
    });
  }

  static async updatePatient(patientId, patientData) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.put(`/patients/${patientId}`, patientData);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to update patient';
      }
    });
  }

  static async deletePatient(patientId) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.delete(`/patients/${patientId}`);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to delete patient';
      }
    });
  }

  // APPOINTMENTS CRUD
  static async fetchAppointments(params = {}) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.get('/appointments', { params });
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch appointments';
      }
    });
  }

  static async createAppointment(appointmentData) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.post('/appointments', appointmentData);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to create appointment';
      }
    });
  }

  static async fetchAppointment(appointmentId) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.get(`/appointments/${appointmentId}`);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch appointment';
      }
    });
  }

  static async updateAppointment(appointmentId, appointmentData) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.put(`/appointments/${appointmentId}`, appointmentData);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to update appointment';
      }
    });
  }

  static async deleteAppointment(appointmentId) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.delete(`/appointments/${appointmentId}`);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to delete appointment';
      }
    });
  }

  // PRESCRIPTIONS CRUD
  static async fetchPrescriptions(params = {}) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.get('/prescriptions', { params });
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch prescriptions';
      }
    });
  }

  static async createPrescription(prescriptionData) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.post('/prescriptions', prescriptionData);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to create prescription';
      }
    });
  }

  static async fetchPrescription(prescriptionId) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.get(`/prescriptions/${prescriptionId}`);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch prescription';
      }
    });
  }

  static async updatePrescription(prescriptionId, prescriptionData) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.put(`/prescriptions/${prescriptionId}`, prescriptionData);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to update prescription';
      }
    });
  }

  static async deletePrescription(prescriptionId) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.delete(`/prescriptions/${prescriptionId}`);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to delete prescription';
      }
    });
  }

  // LAB RESULTS CRUD
  static async fetchLabResults(params = {}) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.get('/labresults', { params });
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch lab results';
      }
    });
  }

  static async createLabResult(labData) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.post('/labresults', labData);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to create lab result';
      }
    });
  }

  static async fetchLabResult(labResultId) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.get(`/labresults/${labResultId}`);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch lab result';
      }
    });
  }

  static async updateLabResult(labResultId, labData) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.put(`/labresults/${labResultId}`, labData);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to update lab result';
      }
    });
  }

  static async deleteLabResult(labResultId) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.delete(`/labresults/${labResultId}`);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to delete lab result';
      }
    });
  }

  // MEDICAL RECORDS CRUD
  static async fetchMedicalRecords(params = {}) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.get('/medical_records', { params });
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch medical records';
      }
    });
  }

  static async createMedicalRecord(recordData) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.post('/medical_records', recordData);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to create medical record';
      }
    });
  }

  static async fetchMedicalRecord(recordId) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.get(`/medical_records/${recordId}`);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch medical record';
      }
    });
  }

  static async updateMedicalRecord(recordId, recordData) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.put(`/medical_records/${recordId}`, recordData);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to update medical record';
      }
    });
  }

  static async deleteMedicalRecord(recordId) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.delete(`/medical_records/${recordId}`);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to delete medical record';
      }
    });
  }

  // VITAL SIGNS CRUD
  static async fetchVitalSigns(params = {}) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.get('/vital_signs', { params });
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch vital signs';
      }
    });
  }

  static async createVitalSign(vitalData) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.post('/vital_signs', vitalData);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to create vital sign';
      }
    });
  }

  static async fetchVitalSign(vitalId) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.get(`/vital_signs/${vitalId}`);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch vital sign';
      }
    });
  }

  static async updateVitalSign(vitalId, vitalData) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.put(`/vital_signs/${vitalId}`, vitalData);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to update vital sign';
      }
    });
  }

  static async deleteVitalSign(vitalId) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.delete(`/vital_signs/${vitalId}`);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to delete vital sign';
      }
    });
  }

  // PROGRAMS CRUD
  static async fetchPrograms(params = {}) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.get('/programs', { params });
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch programs';
      }
    });
  }

  static async createProgram(programData) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.post('/programs', programData);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to create program';
      }
    });
  }

  static async fetchProgram(programId) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.get(`/programs/${programId}`);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch program';
      }
    });
  }

  static async updateProgram(programId, programData) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.put(`/programs/${programId}`, programData);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to update program';
      }
    });
  }

  static async deleteProgram(programId) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.delete(`/programs/${programId}`);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to delete program';
      }
    });
  }

  static async enrollPatient(programId, patientId) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.post(`/programs/${programId}/enroll`, { patient_id: patientId });
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to enroll patient';
      }
    });
  }

  static async unenrollPatient(programId, patientId) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.delete(`/programs/${programId}/enroll/${patientId}`);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to unenroll patient';
      }
    });
  }

  // MEDICATION INVENTORY CRUD
  static async fetchMedicationInventory(params = {}) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.get('/medications/inventory', { params });
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch medication inventory';
      }
    });
  }

  static async createMedication(medicationData) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.post('/medications', medicationData);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to create medication';
      }
    });
  }

  static async fetchMedication(medicationId) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.get(`/medications/${medicationId}`);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch medication';
      }
    });
  }

  static async updateMedication(medicationId, medicationData) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.put(`/medications/${medicationId}`, medicationData);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to update medication';
      }
    });
  }

  static async deleteMedication(medicationId) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.delete(`/medications/${medicationId}`);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to delete medication';
      }
    });
  }

  static async updateMedicationInventory(inventoryData) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.post('/medications/inventory', inventoryData);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to update medication inventory';
      }
    });
  }

  // PENDING ACTIONS CRUD
  static async fetchPendingActions(params = {}) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.get('/pending_actions', { params });
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch pending actions';
      }
    });
  }

  static async createPendingAction(actionData) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.post('/pending_actions', actionData);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to create pending action';
      }
    });
  }

  static async fetchPendingAction(actionId) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.get(`/pending_actions/${actionId}`);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch pending action';
      }
    });
  }

  static async updatePendingAction(actionId, actionData) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.put(`/pending_actions/${actionId}`, actionData);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to update pending action';
      }
    });
  }

  static async completePendingAction(actionId) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.post(`/pending_actions/${actionId}/complete`);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to complete pending action';
      }
    });
  }

  static async deletePendingAction(actionId) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.delete(`/pending_actions/${actionId}`);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to delete pending action';
      }
    });
  }

  // NOTIFICATIONS CRUD
  static async fetchNotifications(params = {}) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.get('/notifications', { params });
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch notifications';
      }
    });
  }

  static async createNotification(notificationData) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.post('/notifications', notificationData);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to create notification';
      }
    });
  }

  static async fetchNotification(notificationId) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.get(`/notifications/${notificationId}`);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch notification';
      }
    });
  }

  static async updateNotification(notificationId, notificationData) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.put(`/notifications/${notificationId}`, notificationData);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to update notification';
      }
    });
  }

  static async markNotificationRead(notificationId) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.post(`/notifications/${notificationId}/read`);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to mark notification as read';
      }
    });
  }

  static async deleteNotification(notificationId) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.delete(`/notifications/${notificationId}`);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to delete notification';
      }
    });
  }

  // AUDIT LOGS
  static async fetchAuditLogs(params = {}) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.get('/audit_logs', { params });
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch audit logs';
      }
    });
  }

  // DOCTORS CRUD
  static async fetchDoctors(params = {}) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.get('/doctors', { params });
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch doctors';
      }
    });
  }

  static async createDoctor(doctorData) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.post('/doctors', doctorData);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to create doctor';
      }
    });
  }

  static async fetchDoctor(doctorId) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.get(`/doctors/${doctorId}`);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch doctor';
      }
    });
  }

  static async updateDoctor(doctorId, doctorData) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.put(`/doctors/${doctorId}`, doctorData);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to update doctor';
      }
    });
  }

  static async deleteDoctor(doctorId) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.delete(`/doctors/${doctorId}`);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to delete doctor';
      }
    });
  }

  // DASHBOARD STATS
  static async fetchDashboardStats() {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.get('/dashboard/stats');
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch dashboard stats';
      }
    });
  }

  // SEARCH
  static async search(query, type = 'all') {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.get('/search', { params: { q: query, type } });
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Search failed';
      }
    });
  }

  // USER PROFILE
  static async fetchUserProfile() {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.get('/user/profile');
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch user profile';
      }
    });
  }

  static async updateUserProfile(profileData) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.put('/user/profile', profileData);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to update user profile';
      }
    });
  }

  // ANALYTICS
  static async fetchPatientAnalytics(params = {}) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.get('/analytics/patient_stats', { params });
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch patient analytics';
      }
    });
  }

  // BULK OPERATIONS
  static async bulkCreatePatients(patientDataArray) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.post('/patients/bulk', patientDataArray);
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to bulk create patients';
      }
    });
  }

  static async bulkDeletePatients(patientIds) {
    return this.requestWithRetry(async () => {
      try {
        const response = await api.delete('/patients/bulk', { data: { ids: patientIds } });
        return response.data;
      } catch (error) {
        throw error.response?.data?.message || 'Failed to bulk delete patients';
      }
    });
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
      const refreshToken = localStorage.getItem('refreshToken');
      const response = await api.post('/auth/refresh', { refreshToken });
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        return response.data;
      }
      throw new Error('Token refresh failed');
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  // Real-time data methods
  static subscribeToUpdates(callback, channels = ['all']) {
    // In a real implementation, this would set up WebSocket connections
    // For now, we'll simulate with setInterval
    const intervalId = setInterval(async () => {
      try {
        const updates = await this.fetchDashboardStats();
        callback(updates);
      } catch (error) {
        console.error('Failed to fetch updates:', error);
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(intervalId);
  }

  // File upload methods
  static async uploadFile(file, category) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    try {
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'File upload failed';
    }
  }

  // Export methods
  static async exportData(type, format = 'csv', params = {}) {
    try {
      const response = await api.get(`/export/${type}`, {
        params: { ...params, format },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Export failed';
    }
  }
}

// Enhanced App component with real-time updates and better state management
function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [doctor, setDoctor] = useState('1');
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [realTimeData, setRealTimeData] = useState(null);

  // Enhanced mock data with more realistic structure
  const mockData = {
    patient_stats: {
      total: 3,
      todays_appointments: 2,
      pending_prescriptions: 0,
      critical_labs: 1,
      high_blood_sugar: 4 
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

  // Initialize data with better error handling
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch real data in production - using mocks for demonstration
        const [patientsData, appointmentsData, dashboardStats] = await Promise.all([
          HealthcareService.fetchPatients().catch(() => []),
          HealthcareService.fetchAppointments().catch(() => []),
          HealthcareService.fetchDashboardStats().catch(() => mockData)
        ]);
        
        setPatients(patientsData);
        setAppointments(appointmentsData);
        setRealTimeData(dashboardStats);
        
        // Initialize notifications with real data
        setNotifications([
          { id: 3, message: "Lab results ready for review.", time: "Just now", read: false, type: "lab" },
          { id: 2, message: "New prescription available.", time: "Just now", read: false, type: "prescription" },
          { id: 1, message: "Upcoming appointment scheduled.", time: "Just now", read: false, type: "appointment" }
        ]);
      } catch (error) {
        console.error("Failed to load data:", error);
        setError("Failed to load data. Please check your connection and try again.");
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

    // Set up real-time updates
    const unsubscribe = HealthcareService.subscribeToUpdates((updates) => {
      setRealTimeData(updates);
    });

    return () => unsubscribe();
  }, []);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
  }, [darkMode]);

  // Calculate unread notifications
  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Toggle notification panel
  const toggleNotifications = useCallback(() => {
    setShowNotifications(prev => !prev);
  }, []);

  // Mark notification as read
  const markAsRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? {...n, read: true} : n
    ));
  }, []);

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  // Navigate to page
  const navigateTo = useCallback((page) => {
    setCurrentPage(page);
    setShowNotifications(false);
  }, []);

  // Handle new patient creation
  const handleAddPatient = async (patientData) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await HealthcareService.createPatient(patientData);
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
      setError("Failed to add patient. Please try again.");
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
    
    if (error) {
      return (
        <div className="error-screen">
          <i className="fas fa-exclamation-triangle"></i>
          <span>{error}</span>
          <button onClick={() => window.location.reload()} className="btn">
            Retry
          </button>
        </div>
      );
    }
    
    switch(currentPage) {
      case 'dashboard': return <DashboardPage data={realTimeData || mockData} appointments={appointments} />;
      case 'patients': return <PatientsPage patients={patients} onAddPatient={handleAddPatient} />;
      case 'doctors': return <DoctorsPage doctors={mockData.doctors} />;
      case 'settings': return <SettingsPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
      case 'appointments': return <AppointmentsPage appointments={appointments} doctors={mockData.doctors} />;
      case 'pharmacy': return <PharmacyPage />;
      case 'records': return <RecordsPage patients={patients} />;
      case 'programs': return <ProgramsPage />;
      case 'analytics': return <AnalyticsPage />;
      default: return <DashboardPage data={realTimeData || mockData} appointments={appointments} />;
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

// Enhanced Sidebar Component
const Sidebar = React.memo(({ currentPage, navigateTo, unreadAppointments, unreadPharmacy }) => {
  const [collapsed, setCollapsed] = useState(false);
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <i className="fas fa-heartbeat"></i>
          </div>
          {!collapsed && (
            <div className="system-name">
              <span>MediCare</span>
              <span>Dashboard</span>
            </div>
          )}
        </div>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <i className={`fas ${collapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
        </button>
      </div>

      <div className="sidebar-nav">
        <NavItem 
          icon="fas fa-home"
          label="Dashboard"
          active={currentPage === 'dashboard'}
          onClick={() => navigateTo('dashboard')}
          collapsed={collapsed}
        />

        <NavItem 
          icon="fas fa-user-injured"
          label="Patients"
          active={currentPage === 'patients'}
          onClick={() => navigateTo('patients')}
          collapsed={collapsed}
        />

        <NavItem 
          icon="fas fa-stethoscope"
          label="Doctors"
          active={currentPage === 'doctors'}
          onClick={() => navigateTo('doctors')}
          collapsed={collapsed}
        />

        <NavItem 
          icon="fas fa-calendar-check"
          label="Appointments"
          active={currentPage === 'appointments'}
          onClick={() => navigateTo('appointments')}
          badge={unreadAppointments}
          collapsed={collapsed}
        />

        <NavItem 
          icon="fas fa-pills"
          label="Pharmacy"
          active={currentPage === 'pharmacy'}
          onClick={() => navigateTo('pharmacy')}
          badge={unreadPharmacy}
          collapsed={collapsed}
        />

        <NavItem 
          icon="fas fa-file-medical"
          label="Medical Records"
          active={currentPage === 'records'}
          onClick={() => navigateTo('records')}
          collapsed={collapsed}
        />

        <NavItem 
          icon="fas fa-heartbeat"
          label="Health Programs"
          active={currentPage === 'programs'}
          onClick={() => navigateTo('programs')}
          collapsed={collapsed}
        />

        <NavItem 
          icon="fas fa-chart-line"
          label="Analytics"
          active={currentPage === 'analytics'}
          onClick={() => navigateTo('analytics')}
          collapsed={collapsed}
        />
      </div>

      <div className="sidebar-footer">
        <NavItem 
          icon="fas fa-cog"
          label="Settings"
          active={false}
          onClick={() => navigateTo('settings')}
          collapsed={collapsed}
        />
        
        {!collapsed && (
          <div className="sidebar-user">
            <div className="user-avatar">DR</div>
            <div className="user-info">
              <div className="user-name">Dr. Smith</div>
              <div className="user-role">Administrator</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

// NavItem component for sidebar
const NavItem = ({ icon, label, active, onClick, badge, collapsed }) => (
  <div 
    className={`nav-item ${active ? 'active' : ''} ${collapsed ? 'collapsed' : ''}`}
    onClick={onClick}
  >
    <i className={icon}></i>
    {!collapsed && (
      <>
        <span>{label}</span>
        {badge > 0 && <div className="nav-badge">{badge}</div>}
      </>
    )}
    {collapsed && badge > 0 && <div className="nav-badge collapsed-badge">{badge}</div>}
  </div>
);

// Enhanced Topbar Component
const Topbar = React.memo(({ 
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
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    try {
      const results = await HealthcareService.search(searchTerm);
      setSearchResults(results);
      setShowSearchResults(true);
      
      // Add notification for demo
      setNotifications(prev => [
        { id: Date.now(), message: `Search executed for "${searchTerm}"`, time: "Just now", read: false, type: "search" },
        ...prev
      ]);
    } catch (error) {
      console.error("Search failed:", error);
    }
    setSearchTerm('');
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    if (!value.trim()) {
      setShowSearchResults(false);
    }
  };

  return (
    <div className="topbar">
      <form className="search-bar" onSubmit={handleSearch}>
        <i className="fas fa-search"></i>
        <input 
          type="text" 
          placeholder="Search patients, records, appointments..." 
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
        {showSearchResults && searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.slice(0, 5).map(result => (
              <div key={result.id} className="search-result-item">
                <i className={`fas fa-${result.type === 'patient' ? 'user' : result.type === 'appointment' ? 'calendar' : 'file-medical'}`}></i>
                <div className="search-result-content">
                  <div className="search-result-title">{result.name}</div>
                  <div className="search-result-type">{result.type}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </form>
      
      <div className="user-actions">
        <QuickActions />
        
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
            <NotificationPanel 
              notifications={notifications}
              markAsRead={markAsRead}
              clearNotifications={clearNotifications}
            />
          )}
        </div>
        
        <UserProfile 
          doctor={doctor}
          setDoctor={setDoctor}
          doctors={doctors}
        />
      </div>
    </div>
  );
});

// Quick Actions Component
const QuickActions = () => {
  const actions = [
    { icon: 'fas fa-plus', label: 'New Patient', action: () => console.log('New Patient') },
    { icon: 'fas fa-calendar-plus', label: 'New Appointment', action: () => console.log('New Appointment') },
    { icon: 'fas fa-prescription', label: 'New Prescription', action: () => console.log('New Prescription') },
    { icon: 'fas fa-vial', label: 'New Lab Result', action: () => console.log('New Lab Result') },
  ];

  return (
    <div className="quick-actions">
      {actions.map((action, index) => (
        <button key={index} className="quick-action-btn" onClick={action.action}>
          <i className={action.icon}></i>
        </button>
      ))}
    </div>
  );
};

// Notification Panel Component
const NotificationPanel = ({ notifications, markAsRead, clearNotifications }) => (
  <div className="notification-panel">
    <div className="notification-header">
      <div className="notification-title">Notifications</div>
      <div className="clear-notifications" onClick={clearNotifications}>
        Clear All
      </div>
    </div>
    <ul className="notification-list">
      {notifications.length > 0 ? (
        notifications.map(notification => (
          <NotificationItem 
            key={notification.id}
            notification={notification}
            markAsRead={markAsRead}
          />
        ))
      ) : (
        <li className="no-notifications">
          <i className="fas fa-check-circle"></i>
          <span>No notifications</span>
        </li>
      )}
    </ul>
  </div>
);

// Notification Item Component
const NotificationItem = ({ notification, markAsRead }) => (
  <li 
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
);

// User Profile Component
const UserProfile = ({ doctor, setDoctor, doctors }) => (
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
);

// Enhanced Dashboard Page with real-time data
const DashboardPage = ({ data, appointments }) => {
  const healthChartRef = useRef(null);
  const doughnutChartRef = useRef(null);
  const appointmentChartRef = useRef(null);
  const [healthMetrics, setHealthMetrics] = useState(data.health_metrics);
  const [chartInstances, setChartInstances] = useState({});

  
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
      if (!doughnutChartRef.current) return;

      // ✅ Destroy existing chart if present
      if (chartInstances.doughnutChart) {
        chartInstances.doughnutChart.destroy();
      }

      const ctx = doughnutChartRef.current.getContext('2d');
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

      // Save reference
      setChartInstances(prev => ({ ...prev, doughnutChart: chart }));

      // Cleanup
      return () => {
        if (chart) {
          chart.destroy();
        }
      };
    }, [appointments]);  // ✅ Rebuild chart if data changes


 // Appointment stats chart
useEffect(() => {
  if (!appointmentChartRef.current) return;

  if (chartInstances.appointmentChart) {
    chartInstances.appointmentChart.destroy();
  }

  const ctx = appointmentChartRef.current.getContext('2d');
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

  setChartInstances(prev => ({ ...prev, appointmentChart: chart }));

  return () => {
    if (chart) {
      chart.destroy();
    }
  };
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
            {data && data.doctors && Array.isArray(data.doctors) &&
              data.doctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  name={doctor.name}
                  specialty={doctor.specialty}
                  patients={doctor.patients}
                  rating={doctor.rating}
                />
              ))
            }
          </div>

          </div>
        </div>
        
        {/* Right Column */}
        <div>
          {/* Health Metrics Card */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">Patient Health Metrics</div>
              <div className="card-action">Details</div>
            </div>
            
            <div className="health-metrics">
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
            </div>
            
            <div className="chart-container">
              <canvas ref={healthChartRef} id="health-chart"></canvas>
            </div>
          </div>
          
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

// Enhanced Patients Page with full CRUD functionality
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
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  
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
  
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          patient.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          patient.contact.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  const sortedPatients = filteredPatients.sort((a, b) => {
    const modifier = sortDirection === 'asc' ? 1 : -1;
    if (a[sortField] < b[sortField]) return -1 * modifier;
    if (a[sortField] > b[sortField]) return 1 * modifier;
    return 0;
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
        {sortedPatients.length > 0 ? (
          sortedPatients.map(patient => (
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
        
        {Array.isArray(conditions) && conditions.length > 0 && (
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
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    specialty: 'Cardiology',
    contact: '',
    phone: ''
  });
  
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = specialtyFilter === 'all' || doctor.specialty === specialtyFilter;
    return matchesSearch && matchesSpecialty;
  });
  
  // Get unique specialties for filter
  const specialties = [...new Set(doctors.map(d => d.specialty))];
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDoctor(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddDoctor = () => {
    // In a real app, this would call an API
    console.log('Adding doctor:', newDoctor);
    setShowDoctorForm(false);
    setNewDoctor({
      name: '',
      specialty: 'Cardiology',
      contact: '',
      phone: ''
    });
  };
  
  return (
    <div className="doctors-page">
      <div className="page-header">
        <div className="page-title">
          <i className="fas fa-stethoscope"></i>
          <span>Doctors Management</span>
        </div>
        <button className="btn" onClick={() => setShowDoctorForm(true)}>
          <i className="fas fa-plus"></i> Add Doctor
        </button>
      </div>
      
      {showDoctorForm && (
        <div className="card">
          <div className="card-header">
            <h3>Add New Doctor</h3>
          </div>
          <div className="card-body">
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={newDoctor.name} 
                  onChange={handleInputChange}
                  placeholder="Dr. John Doe"
                  required
                />
              </div>
              <div className="form-group">
                <label>Specialty</label>
                <select 
                  name="specialty" 
                  value={newDoctor.specialty} 
                  onChange={handleInputChange}
                  required
                >
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Surgery">Surgery</option>
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  name="contact" 
                  value={newDoctor.contact} 
                  onChange={handleInputChange}
                  placeholder="doctor@example.com"
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={newDoctor.phone} 
                  onChange={handleInputChange}
                  placeholder="(555) 123-4567"
                  required
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button className="btn" onClick={() => setShowDoctorForm(false)}>
                Cancel
              </button>
              <button className="save-btn" onClick={handleAddDoctor}>
                Add Doctor
              </button>
            </div>
          </div>
        </div>
      )}
      
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
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    patient: '',
    doctor: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    reason: '',
    duration: 30
  });
  
  const filteredAppointments = appointments.filter(appointment => {
    const matchesDoctor = doctorFilter === 'all' || appointment.doctor === doctors.find(d => d.id === doctorFilter)?.name;
    return matchesDoctor;
  });
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddAppointment = () => {
    // In a real app, this would call an API
    console.log('Adding appointment:', newAppointment);
    setShowAppointmentForm(false);
    setNewAppointment({
      patient: '',
      doctor: '',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      reason: '',
      duration: 30
    });
  };
  
  return (
    <div className="appointments-page">
      <div className="page-header">
        <div className="page-title">
          <i className="fas fa-calendar-check"></i>
          <span>Appointments Management</span>
        </div>
        <button className="btn" onClick={() => setShowAppointmentForm(true)}>
          <i className="fas fa-plus"></i> New Appointment
        </button>
      </div>
      
      {showAppointmentForm && (
        <div className="card">
          <div className="card-header">
            <h3>Schedule New Appointment</h3>
          </div>
          <div className="card-body">
            <div className="form-row">
              <div className="form-group">
                <label>Patient</label>
                <input 
                  type="text" 
                  name="patient" 
                  value={newAppointment.patient} 
                  onChange={handleInputChange}
                  placeholder="Patient Name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Doctor</label>
                <select 
                  name="doctor" 
                  value={newAppointment.doctor} 
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Doctor</option>
                  {doctors.map(doctor => (
                    <option key={doctor.id} value={doctor.name}>{doctor.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Date</label>
                <input 
                  type="date" 
                  name="date" 
                  value={newAppointment.date} 
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input 
                  type="time" 
                  name="time" 
                  value={newAppointment.time} 
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Duration (minutes)</label>
                <input 
                  type="number" 
                  name="duration" 
                  value={newAppointment.duration} 
                  onChange={handleInputChange}
                  min="15"
                  max="120"
                  step="15"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Reason for Visit</label>
              <textarea 
                name="reason" 
                value={newAppointment.reason} 
                onChange={handleInputChange}
                placeholder="Reason for appointment..."
                rows="3"
                required
              />
            </div>
            
            <div className="form-actions">
              <button className="btn" onClick={() => setShowAppointmentForm(false)}>
                Cancel
              </button>
              <button className="save-btn" onClick={handleAddAppointment}>
                Schedule Appointment
              </button>
            </div>
          </div>
        </div>
      )}
      
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

// Pharmacy Management Page
const PharmacyPage = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [inventory, setInventory] = useState([]);
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
  
  useEffect(() => {
    // Simulate fetching data
    const fetchData = async () => {
      try {
        const [prescriptionsData, inventoryData] = await Promise.all([
          HealthcareService.fetchPrescriptions(),
          HealthcareService.fetchMedicationInventory()
        ]);
        setPrescriptions(prescriptionsData);
        setInventory(inventoryData);
      } catch (error) {
        console.error('Failed to fetch pharmacy data:', error);
      }
    };
    
    fetchData();
  }, []);
  
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
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [newRecord, setNewRecord] = useState({
    type: 'Visit Note',
    date: new Date().toISOString().split('T')[0],
    provider: '',
    diagnosis: '',
    notes: ''
  });

  const [showRecordForm, setShowRecordForm] = useState(false);

  // Fetch medical records from API when selectedPatient changes
  useEffect(() => {
    if (!selectedPatient) {
      setMedicalRecords([]);
      return;
    }
    setIsLoading(true);
    HealthcareService.fetchMedicalRecords({ patient_id: selectedPatient.id })
      .then(data => setMedicalRecords(data))
      .catch(() => setMedicalRecords([]))
      .finally(() => setIsLoading(false));
  }, [selectedPatient]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecord(prev => ({ ...prev, [name]: value }));
  };

  const handleAddRecord = async () => {
    if (selectedPatient && newRecord.type) {
      setIsLoading(true);
      try {
        const recordData = {
          ...newRecord,
          patient_id: selectedPatient.id
        };
        const result = await HealthcareService.createMedicalRecord(recordData);
        setMedicalRecords(prev => [result, ...prev]);
        setNewRecord({
          type: 'Visit Note',
          date: new Date().toISOString().split('T')[0],
          provider: '',
          diagnosis: '',
          notes: ''
        });
        setShowRecordForm(false);
      } catch {
        // handle error (could show notification)
      } finally {
        setIsLoading(false);
      }
    }
  };

  const patientRecords = medicalRecords;

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
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Record"}
                </button>
              </div>
            </div>
          )}

          {selectedPatient && (
            <div className="records-list">
              {isLoading ? (
                <div className="loading-screen">
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Loading records...</span>
                </div>
              ) : patientRecords.length > 0 ? (
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
  const [programs, setPrograms] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [activeTab, setActiveTab] = useState('programs');
  const [newProgram, setNewProgram] = useState({
    name: '',
    description: '',
    type: 'Chronic Disease',
    status: 'upcoming',
    startDate: new Date().toISOString().split('T')[0]
  });
  const [showProgramForm, setShowProgramForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch programs and enrollments from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [programsData, enrollmentsData] = await Promise.all([
          HealthcareService.fetchPrograms(),
          HealthcareService.fetchPendingActions({ type: 'enrollment' }) // Assuming enrollments are pending actions
        ]);
        setPrograms(programsData);
        setEnrollments(enrollmentsData);
      } catch (error) {
        setPrograms([]);
        setEnrollments([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProgram(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProgram = async () => {
    if (newProgram.name) {
      setIsLoading(true);
      try {
        const created = await HealthcareService.createProgram(newProgram);
        setPrograms(prev => [created, ...prev]);
        setNewProgram({
          name: '',
          description: '',
          type: 'Chronic Disease',
          status: 'upcoming',
          startDate: new Date().toISOString().split('T')[0]
        });
        setShowProgramForm(false);
      } catch {
        // handle error
      } finally {
        setIsLoading(false);
      }
    }
  };

  const updateEnrollmentStatus = async (id, status) => {
    setIsLoading(true);
    try {
      await HealthcareService.updatePendingAction(id, { status });
      setEnrollments(enrollments.map(enrollment =>
        enrollment.id === id ? { ...enrollment, status } : enrollment
      ));
    } catch {
      // handle error
    } finally {
      setIsLoading(false);
    }
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
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Program"}
        </button>
      </div>
    </div>
  </div>
  
)}

{isLoading && (
  <div className="loading-screen">
    <i className="fas fa-spinner fa-spin"></i>
    <span>Loading programs...</span>
  </div>
)}

{!isLoading && activeTab === 'programs' && (
  <div className="programs-grid">
    {programs.length > 0 ? programs.map(program => (
      <div key={program.id} className={`program-card status-${program.status}`}>
        <div className="program-header">
          <div className="program-name">{program.name}</div>
          <div className="program-status">{program.status}</div>
        </div>
        <div className="program-type">{program.type}</div>
        <div className="program-stats">
          <div className="stat">
            <i className="fas fa-users"></i>
            {program.participants || 0} Participants
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
    )) : (
      <div className="no-results">
        <i className="fas fa-heartbeat"></i>
        <h3>No programs found</h3>
        <p>Add a new program to get started.</p>
      </div>
    )}
  </div>
)}

{!isLoading && activeTab === 'participants' && (
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

      {enrollments.length > 0 ? enrollments.map(enrollment => (
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
                style={{ width: `${enrollment.progress || 0}%` }}
              ></div>
            </div>
            <div className="progress-text">{enrollment.progress || 0}%</div>
          </div>
          <div className={`participant-status status-${enrollment.status}`}>
            {enrollment.status}
          </div>
          <div className="participant-actions">
            {enrollment.status === 'active' && (
              <button
                className="btn-icon success"
                onClick={() => updateEnrollmentStatus(enrollment.id, 'completed')}
                disabled={isLoading}
              >
                <i className="fas fa-check"></i> Complete
              </button>
            )}
            <button className="btn-icon">
              <i className="fas fa-chart-line"></i> Progress
            </button>
          </div>
        </div>
      )) : (
        <div className="no-results">
          <i className="fas fa-users"></i>
          <h3>No participants found</h3>
          <p>Enroll patients to programs to see them here.</p>
        </div>
      )}
    </div>
  </div>
)}


{!isLoading && activeTab === 'reports' && (
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
                <td>{program.participants || 0}</td>
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
              value={`$${analyticsData.finoutstanding.toLocaleString()}`}
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

// Enhanced CSS Styles
const styles = `
/* Base Styles */
:root {
  --primary: #1976d2;
  --secondary: #388e3c;
  --danger: #d32f2f;
  --warning: #f57c00;
  --info: #0288d1;
  --light: #f5f5f5;
  --dark: #263238;
  --gray: #757575;
  --purple: #7b1fa2;
  --background: #ffffff;
  --surface: #ffffff;
  --on-background: #212121;
  --on-surface: #212121;
  --border: #e0e0e0;
  --success: #43a047;
}

.dark-mode {
  --background: #121212;
  --surface: #1e1e1e;
  --on-background: #ffffff;
  --on-surface: #ffffff;
  --border: #424242;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--background);
  color: var(--on-background);
  transition: all 0.3s ease;
}

.app {
  display: flex;
  min-height: 100vh;
  background-color: var(--background);
}

/* Sidebar Styles */
.sidebar {
  width: 280px;
  background: var(--surface);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.system-name {
  display: flex;
  flex-direction: column;
}

.system-name span:first-child {
  font-weight: 700;
  font-size: 18px;
  color: var(--on-surface);
}

.system-name span:last-child {
  font-size: 12px;
  color: var(--gray);
}

.sidebar-toggle {
  background: none;
  border: none;
  color: var(--gray);
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.sidebar-toggle:hover {
  background: var(--border);
  color: var(--on-surface);
}

.sidebar-nav {
  flex: 1;
  padding: 20px 0;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 24px;
  color: var(--gray);
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
}

.nav-item:hover {
  background: rgba(0, 0, 0, 0.04);
  color: var(--primary);
}

.nav-item.active {
  background: linear-gradient(90deg, rgba(25, 118, 210, 0.1), transparent);
  color: var(--primary);
  border-right: 3px solid var(--primary);
}

.nav-item i {
  width: 24px;
  margin-right: 16px;
  font-size: 18px;
}

.nav-item.collapsed i {
  margin-right: 0;
}

.nav-item.collapsed span {
  display: none;
}

.nav-badge {
  background: var(--danger);
  color: white;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: 11px;
  margin-left: auto;
}

.collapsed-badge {
  position: absolute;
  top: 8px;
  right: 8px;
}

.sidebar-footer {
  border-top: 1px solid var(--border);
  padding: 20px;
}

.sidebar-user {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 8px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 16px;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  font-size: 14px;
  color: var(--on-surface);
}

.user-role {
  font-size: 12px;
  color: var(--gray);
}

/* Main Content Styles */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.topbar {
  height: 70px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.search-bar {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--background);
  border-radius: 8px;
  padding: 8px 16px;
  width: 400px;
  border: 1px solid var(--border);
}

.search-bar i {
  color: var(--gray);
  margin-right: 12px;
}

.search-bar input {
  border: none;
  background: none;
  outline: none;
  flex: 1;
  color: var(--on-background);
  font-size: 14px;
}

.search-bar input::placeholder {
  color: var(--gray);
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  margin-top: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
}

.search-result-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.search-result-item:hover {
  background: rgba(0, 0, 0, 0.04);
}

.search-result-item i {
  margin-right: 12px;
  color: var(--primary);
}

.search-result-content {
  flex: 1;
}

.search-result-title {
  font-weight: 500;
  color: var(--on-surface);
  margin-bottom: 2px;
}

.search-result-type {
  font-size: 12px;
  color: var(--gray);
  text-transform: capitalize;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.quick-actions {
  display: flex;
  gap: 8px;
}

.quick-action-btn {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--background);
  color: var(--gray);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quick-action-btn:hover {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.notification-icon {
  position: relative;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.notification-icon:hover {
  background: rgba(0, 0, 0, 0.04);
}

.notification-icon i {
  font-size: 18px;
  color: var(--gray);
}

.badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: var(--danger);
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
}

.notification-panel {
  position: absolute;
  top: 100%;
  right: 0;
  width: 380px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  margin-top: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 400px;
  overflow: hidden;
}

.notification-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid var(--border);
}

.notification-title {
  font-weight: 600;
  color: var(--on-surface);
}

.clear-notifications {
  color: var(--primary);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.clear-notifications:hover {
  text-decoration: underline;
}

.notification-list {
  list-style: none;
  max-height: 300px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  padding: 16px;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  transition: background 0.2s ease;
}

.notification-item:hover {
  background: rgba(0, 0, 0, 0.04);
}

.notification-item.unread {
  background: rgba(25, 118, 210, 0.05);
}

.notification-item.appointment {
  border-left: 3px solid var(--info);
}

.notification-item.lab {
  border-left: 3px solid var(--warning);
}

.notification-item.prescription {
  border-left: 3px solid var(--success);
}

.notification-item.alert {
  border-left: 3px solid var(--danger);
}

.notification-item.system {
  border-left: 3px solid var(--gray);
}

.notification-item.error {
  border-left: 3px solid var(--danger);
}

.notification-item.success {
  border-left: 3px solid var(--success);
}

.notification-icon {
  margin-right: 12px;
  font-size: 18px;
  color: var(--gray);
}

.notification-content {
  flex: 1;
}

.notification-message {
  color: var(--on-surface);
  margin-bottom: 4px;
  line-height: 1.4;
}

.notification-time {
  font-size: 12px;
  color: var(--gray);
}

.no-notifications {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: var(--gray);
  text-align: center;
}

.no-notifications i {
  font-size: 32px;
  margin-bottom: 12px;
  color: var(--success);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.user-profile:hover {
  background: rgba(0, 0, 0, 0.04);
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 16px;
}

.doctor-selector {
  margin-right: 8px;
}

.doctor-dropdown {
  border: none;
  background: none;
  color: var(--on-surface);
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  outline: none;
}

.content-area {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background: var(--background);
}

/* Page Styles */
.page-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.page-title i {
  font-size: 24px;
  color: var(--primary);
}

.page-title span {
  font-size: 24px;
  font-weight: 600;
  color: var(--on-surface);
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn:hover {
  background: #1565c0;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn:active {
  transform: translateY(0);
}

.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--gray);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-icon:hover {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.btn-icon.success:hover {
  background: var(--success);
  border-color: var(--success);
}

.btn-icon.danger:hover {
  background: var(--danger);
  border-color: var(--danger);
}

.save-btn {
  background: var(--success);
}

.save-btn:hover {
  background: #388e3c;
}

/* Card Styles */
.card {
  background: var(--surface);
  border-radius: 12px;
  border: 1px solid var(--border);
  margin-bottom: 24px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.2s ease;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--on-surface);
}

.card-action {
  color: var(--primary);
  font-weight: 500;
  cursor: pointer;
}

.card-action:hover {
  text-decoration: underline;
}

.card-body {
  padding: 24px;
}

/* Dashboard Styles */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.stat-card {
  background: var(--surface);
  border-radius: 12px;
  border: 1px solid var(--border);
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.stat-info {
  flex: 1;
}

.stat-title {
  font-size: 14px;
  color: var(--gray);
  margin-bottom: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--on-surface);
  margin-bottom: 4px;
}

.stat-change {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
}

.change-positive {
  color: var(--success);
}

.change-negative {
  color: var(--danger);
}

.dashboard-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

@media (max-width: 1200px) {
  .dashboard-row {
    grid-template-columns: 1fr;
  }
}

.appointment-list {
  list-style: none;
}

.appointment-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--border);
  transition: background 0.2s ease;
}

.appointment-item:last-child {
  border-bottom: none;
}

.appointment-item:hover {
  background: rgba(0, 0, 0, 0.02);
}

.appointment-time {
  min-width: 80px;
  font-weight: 600;
  color: var(--on-surface);
}

.appointment-info {
  flex: 1;
  margin: 0 16px;
}

.appointment-title {
  font-weight: 600;
  color: var(--on-surface);
  margin-bottom: 4px;
}

.appointment-meta {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: var(--gray);
  margin-bottom: 4px;
}

.appointment-reason {
  font-size: 14px;
  color: var(--gray);
}

.appointment-status {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-scheduled {
  background: rgba(0, 200, 83, 0.1);
  color: var(--success);
}

.status-urgent {
  background: rgba(255, 82, 82, 0.1);
  color: var(--danger);
}

.status-confirmed {
  background: rgba(26, 115, 232, 0.1);
  color: var(--primary);
}

.status-pending {
  background: rgba(255, 171, 0, 0.1);
  color: var(--warning);
}

.doctor-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.doctor-card {
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  transition: transform 0.2s ease;
}

.doctor-card:hover {
  transform: translateY(-2px);
}

.doctor-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  margin: 0 auto 12px;
}

.doctor-name {
  font-weight: 600;
  color: var(--on-surface);
  margin-bottom: 4px;
}

.doctor-specialty {
  font-size: 14px;
  color: var(--gray);
  margin-bottom: 12px;
}

.doctor-stats {
  display: flex;
  justify-content: space-around;
  font-size: 13px;
  color: var(--gray);
}

.health-metrics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.metric-card {
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  position: relative;
}

.metric-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--on-surface);
  margin-bottom: 4px;
}

.metric-trend {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 14px;
}

.metric-trend.up {
  color: var(--success);
}

.metric-trend.down {
  color: var(--danger);
}

.metric-trend.neutral {
  color: var(--gray);
}

.metric-label {
  font-size: 13px;
  color: var(--gray);
}

.chart-container {
  height: 250px;
  position: relative;
  margin-top: 16px;
}

.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.resource-card {
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 16px;
  text-align: center;
}

.resource-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.resource-name {
  font-weight: 600;
  color: var(--on-surface);
  margin-bottom: 4px;
}

.resource-stats {
  font-size: 14px;
  color: var(--gray);
  margin-bottom: 12px;
}

.progress-container {
  margin-top: 12px;
}

.progress-bar {
  height: 8px;
  background: var(--border);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-bar > div {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: var(--gray);
}

/* Patients Page Styles */
.patient-form {
  margin-bottom: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-weight: 500;
  color: var(--on-surface);
  margin-bottom: 8px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--background);
  color: var(--on-background);
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary);
}

.conditions-input {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.conditions-input input {
  flex: 1;
}

.conditions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.condition-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(25, 118, 210, 0.1);
  color: var(--primary);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.condition-tag button {
  background: none;
  border: none;
  color: var(--primary);
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.patient-filters {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.patient-filters input {
  flex: 1;
  min-width: 200px;
}

.form-select {
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--background);
  color: var(--on-background);
  font-size: 14px;
  cursor: pointer;
}

.patients-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.patient-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.patient-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.patient-header {
  display: flex;
  align-items: center;
  padding: 20px;
  background: var(--background);
  border-bottom: 1px solid var(--border);
}

.patient-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  margin-right: 16px;
}

.patient-info {
  flex: 1;
}

.patient-name {
  font-weight: 600;
  color: var(--on-surface);
  margin-bottom: 2px;
}

.patient-id {
  font-size: 13px;
  color: var(--gray);
  margin-bottom: 4px;
}

.patient-status {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-active {
  background: rgba(0, 200, 83, 0.1);
  color: var(--success);
}

.status-inactive {
  background: rgba(255, 171, 0, 0.1);
  color: var(--warning);
}

.patient-details {
  padding: 20px;
}

.detail-row {
  display: flex;
  margin-bottom: 12px;
}

.detail-label {
  min-width: 100px;
  font-weight: 500;
  color: var(--on-surface);
}

.detail-value {
  flex: 1;
  color: var(--gray);
}

.conditions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
}

.action-btn {
  flex: 1;
  text-align: center;
  padding: 8px 12px;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--gray);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.no-results {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  color: var(--gray);
}

.no-results i {
  font-size: 48px;
  margin-bottom: 16px;
  color: var(--primary);
}

.no-results h3 {
  font-size: 20px;
  margin-bottom: 8px;
  color: var(--on-surface);
}

/* Doctors Page Styles */
.doctor-profile-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.doctor-profile-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.doctor-header {
  display: flex;
  align-items: center;
  padding: 24px;
  background: var(--background);
  border-bottom: 1px solid var(--border);
}

.doctor-avatar-lg {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 20px;
  margin-right: 20px;
}

.doctor-info {
  flex: 1;
}

.doctor-name-lg {
  font-size: 18px;
  font-weight: 600;
  color: var(--on-surface);
  margin-bottom: 4px;
}

.doctor-specialty-lg {
  font-size: 14px;
  color: var(--gray);
  margin-bottom: 8px;
}

.doctor-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-absent {
  background: rgba(255, 171, 0, 0.1);
  color: var(--warning);
}

.doctor-details {
  padding: 24px;
}

/* Settings Page Styles */
.settings-group {
  margin-bottom: 32px;
}

.settings-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--on-surface);
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid var(--border);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-label {
  font-weight: 500;
  color: var(--on-surface);
  margin-bottom: 4px;
}

.setting-description {
  font-size: 14px;
  color: var(--gray);
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--border);
  transition: .4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--primary);
}

input:checked + .slider:before {
  transform: translateX(26px);
}

/* Appointments Page Styles */
.appointment-filters {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.appointments-list {
  overflow: hidden;
}

.appointment-header {
  display: grid;
  grid-template-columns: 100px 1fr 1fr 1fr 100px 120px;
  gap: 16px;
  padding: 16px 24px;
  background: var(--background);
  border-bottom: 1px solid var(--border);
  font-weight: 600;
  color: var(--on-surface);
}

.appointment-row {
  display: grid;
  grid-template-columns: 100px 1fr 1fr 1fr 100px 120px;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid var(--border);
  align-items: center;
  transition: background 0.2s ease;
}

.appointment-row:hover {
  background: rgba(0, 0, 0, 0.02);
}

.appointment-row:last-child {
  border-bottom: none;
}

.appointment-actions {
  display: flex;
  gap: 8px;
}

/* Pharmacy Page Styles */
.pharmacy-dashboard {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

@media (max-width: 1200px) {
  .pharmacy-dashboard {
    grid-template-columns: 1fr;
  }
}

.prescription-list {
  overflow: hidden;
}

.prescription-header {
  display: grid;
  grid-template-columns: 100px 1fr 1fr 100px 100px 120px;
  gap: 16px;
  padding: 16px;
  background: var(--background);
  border-bottom: 1px solid var(--border);
  font-weight: 600;
  color: var(--on-surface);
}

.prescription-item {
  display: grid;
  grid-template-columns: 100px 1fr 1fr 100px 100px 120px;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid var(--border);
  align-items: center;
  transition: background 0.2s ease;
}

.prescription-item:hover {
  background: rgba(0, 0, 0, 0.02);
}

.prescription-item:last-child {
  border-bottom: none;
}

.inventory-alert {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(255, 171, 0, 0.1);
  border-left: 4px solid var(--warning);
  margin: 0 24px 16px;
  border-radius: 4px;
}

.inventory-alert i {
  color: var(--warning);
}

.inventory-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  padding: 0 24px 24px;
}

.inventory-item {
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  transition: all 0.2s ease;
}

.inventory-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.inventory-item.low-stock {
  border-color: var(--warning);
  background: rgba(255, 171, 0, 0.05);
}

.inventory-name {
  font-weight: 600;
  color: var(--on-surface);
  margin-bottom: 12px;
}

.inventory-stock {
  margin-bottom: 8px;
}

.stock-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--on-surface);
}

.stock-label {
  font-size: 13px;
  color: var(--gray);
}

.inventory-threshold {
  font-size: 13px;
  color: var(--gray);
  margin-bottom: 4px;
}

.inventory-last-order {
  font-size: 13px;
  color: var(--gray);
  margin-bottom: 12px;
}

/* Records Page Styles */
.records-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 24px;
}

@media (max-width: 1200px) {
  .records-container {
    grid-template-columns: 1fr;
  }
}

.patient-selector {
  max-height: 400px;
  overflow-y: auto;
}

.patient-selector-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  transition: background 0.2s ease;
}

.patient-selector-item:hover {
  background: rgba(0, 0, 0, 0.02);
}

.patient-selector-item.selected {
  background: rgba(25, 118, 210, 0.1);
  border-right: 3px solid var(--primary);
}

.record-form {
  padding: 24px;
  border-bottom: 1px solid var(--border);
}

.records-list {
  max-height: 600px;
  overflow-y: auto;
}

.record-item {
  padding: 24px;
  border-bottom: 1px solid var(--border);
}

.record-item:last-child {
  border-bottom: none;
}

.record-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.record-type {
  font-weight: 600;
  color: var(--on-surface);
}

.record-date {
  color: var(--gray);
  font-size: 14px;
}

.record-provider {
  font-weight: 500;
  color: var(--on-surface);
  margin-bottom: 8px;
}

.record-diagnosis {
  color: var(--primary);
  font-weight: 500;
  margin-bottom: 8px;
}

.record-test {
  color: var(--warning);
  font-weight: 500;
  margin-bottom: 12px;
}

.record-notes {
  color: var(--gray);
  line-height: 1.6;
  margin-bottom: 16px;
}

.no-records {
  text-align: center;
  padding: 60px 20px;
  color: var(--gray);
}

.no-records i {
  font-size: 48px;
  margin-bottom: 16px;
  color: var(--primary);
}

.no-records h4 {
  font-size: 18px;
  margin-bottom: 8px;
  color: var(--on-surface);
}

/* Programs Page Styles */
.tabs {
  display: flex;
  border-bottom: 1px solid var(--border);
  margin-bottom: 24px;
}

.tab {
  padding: 12px 24px;
  cursor: pointer;
  color: var(--gray);
  font-weight: 500;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
}

.tab:hover {
  color: var(--primary);
}

.tab.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
}

.tab i {
  margin-right: 8px;
}

.programs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.program-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  transition: all 0.2s ease;
}

.program-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.program-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.program-name {
  font-weight: 600;
  color: var(--on-surface);
  font-size: 18px;
}

.program-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.program-type {
  color: var(--primary);
  font-weight: 500;
  margin-bottom: 12px;
}

.program-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--gray);
}

.program-description {
  color: var(--gray);
  line-height: 1.6;
  margin-bottom: 20px;
}

.program-actions {
  display: flex;
  gap: 12px;
}

.participants-list {
  overflow: hidden;
}

.participant-header {
  display: grid;
  grid-template-columns: 1fr 1fr 100px 120px 100px 120px;
  gap: 16px;
  padding: 16px;
  background: var(--background);
  border-bottom: 1px solid var(--border);
  font-weight: 600;
  color: var(--on-surface);
}

.participant-item {
  display: grid;
  grid-template-columns: 1fr 1fr 100px 120px 100px 120px;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid var(--border);
  align-items: center;
  transition: background 0.2s ease;
}

.participant-item:hover {
  background: rgba(0, 0, 0, 0.02);
}

.participant-item:last-child {
  border-bottom: none;
}

.participant-progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: var(--border);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--primary);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: var(--gray);
  min-width: 30px;
}

.program-analytics {
  padding: 24px;
}

.analytics-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.program-comparison {
  margin-top: 32px;
}

.program-comparison h4 {
  font-size: 18px;
  font-weight: 600;
  color: var(--on-surface);
  margin-bottom: 16px;
}

.program-comparison table {
  width: 100%;
  border-collapse: collapse;
}

.program-comparison th,
.program-comparison td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid var(--border);
}

.program-comparison th {
  font-weight: 600;
  color: var(--on-surface);
  background: var(--background);
}

.program-comparison tr:hover {
  background: rgba(0, 0, 0, 0.02);
}

.metric-positive {
  color: var(--success);
  font-weight: 600;
}

.metric-warning {
  color: var(--warning);
  font-weight: 600;
}

/* Analytics Page Styles */
.analytics-overview,
.analytics-financial,
.analytics-clinical,
.analytics-operations {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.date-filter {
  display: flex;
  align-items: center;
  gap: 8px;
}

.demographics-chart,
.revenue-chart,
.expense-chart,
.disease-chart,
.outcome-chart,
.resource-chart,
.productivity-chart,
.trend-chart {
  height: 300px;
  position: relative;
  padding: 16px;
}

.department-performance,
.quality-metrics,
.efficiency-metrics {
  overflow-x: auto;
}

.department-performance table,
.quality-metrics table,
.efficiency-metrics table {
  width: 100%;
  border-collapse: collapse;
}

.department-performance th,
.department-performance td,
.quality-metrics th,
.quality-metrics td,
.efficiency-metrics th,
.efficiency-metrics td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid var(--border);
}

.department-performance th,
.quality-metrics th,
.efficiency-metrics th {
  font-weight: 600;
  color: var(--on-surface);
  background: var(--background);
}

.department-performance tr:hover,
.quality-metrics tr:hover,
.efficiency-metrics tr:hover {
  background: rgba(0, 0, 0, 0.02);
}

/* Loading and Error States */
.loading-screen,
.error-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.loading-screen i,
.error-screen i {
  font-size: 48px;
  margin-bottom: 16px;
}

.loading-screen i {
  color: var(--primary);
  animation: spin 1s linear infinite;
}

.error-screen i {
  color: var(--danger);
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .app {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    height: auto;
  }
  
  .sidebar.collapsed {
    width: 100%;
  }
  
  .sidebar-nav {
    display: flex;
    overflow-x: auto;
    padding: 10px;
  }
  
  .nav-item {
    flex-direction: column;
    padding: 10px;
    min-width: 80px;
    text-align: center;
  }
  
  .nav-item i {
    margin-right: 0;
    margin-bottom: 6px;
  }
  
  .nav-badge {
    position: absolute;
    top: 5px;
    right: 5px;
  }
  
  .topbar {
    flex-direction: column;
    height: auto;
    padding: 16px;
  }
  
  .search-bar {
    width: 100%;
    margin-bottom: 16px;
  }
  
  .user-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .dashboard-row {
    grid-template-columns: 1fr;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .patient-filters,
  .appointment-filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .patients-grid {
    grid-template-columns: 1fr;
  }
  
  .doctor-grid {
    grid-template-columns: 1fr;
  }
  
  .appointment-header,
  .appointment-row,
  .prescription-header,
  .prescription-item,
  .participant-header,
  .participant-item {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .pharmacy-dashboard {
    grid-template-columns: 1fr;
  }
  
  .records-container {
    grid-template-columns: 1fr;
  }
  
  .tabs {
    overflow-x: auto;
  }
  
  .tab {
    white-space: nowrap;
  }
}

/* Print Styles */
@media print {
  .sidebar,
  .topbar,
  .btn,
  .card-action,
  .action-buttons,
  .notification-icon,
  .user-profile {
    display: none !important;
  }
  
  .main-content {
    margin: 0;
    padding: 0;
  }
  
  .card {
    border: none;
    box-shadow: none;
    page-break-inside: avoid;
  }
  
  .content-area {
    padding: 0;
  }
}
`;

// Add styles to the document
const styleSheet = document.createElement('style');
styleSheet.innerHTML = styles;
document.head.appendChild(styleSheet);

export default App;