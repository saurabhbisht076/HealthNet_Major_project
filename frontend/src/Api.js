import axios from 'axios';

// Set up the base URL from environment variable
const API_URL =   "https://localhost:5000/api"

// User Registration
export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/users/register`, userData);
        return response.data;
    } catch (error) {
        throw error.response.data; // Throw error to be handled in the component
    }
};

// User Login
export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/users/login`, credentials);
        return response.data;
    } catch (error) {
        throw error.response.data; // Throw error to be handled in the component
    }
};

// Get Medical Reports for a Patient
export const getMedicalReports = async (patientId) => {
    try {
        const response = await axios.get(`${API_URL}/reports/${patientId}`);
        return response.data;
    } catch (error) {
        throw error.response.data; // Throw error to be handled in the component
    }
};

// Upload Medical Report
export const uploadMedicalReport = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/reports/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data; // Throw error to be handled in the component
    }
};

// Get All Hospitals
export const getHospitals = async () => {
    try {
        const response = await axios.get(`${API_URL}/hospitals`);
        return response.data;
    } catch (error) {
        throw error.response.data; // Throw error to be handled in the component
    }
};

// Get All Doctors
export const getDoctors = async () => {
    try {
        const response = await axios.get(`${API_URL}/doctors`);
        return response.data;
    } catch (error) {
        throw error.response.data; // Throw error to be handled in the component
    }
};