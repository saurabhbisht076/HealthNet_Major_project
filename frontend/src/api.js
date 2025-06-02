import axios from "axios";

const serverUrl = process.env.REACT_APP_SERVER || "http://localhost:5000";
const baseUrl = `${serverUrl}/api`;

// Create axios instance with base configuration (no global Content-Type header)
const api = axios.create({
    baseURL: baseUrl,
    timeout: 5000
});

// Request interceptor for auth token
api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            config.headers["x-auth-token"] = accessToken;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");
                const response = await axios.post(`${baseUrl}/auth/refresh`, { 
                    refreshToken 
                });

                if (response.data.accessToken) {
                    localStorage.setItem("accessToken", response.data.accessToken);
                    api.defaults.headers.common["x-auth-token"] = response.data.accessToken;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                window.location.href = "/signin";
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

// API endpoints
const apiEndpoints = {
    getHospitals: (params) => api.get("/hospital_data", { params }),
    signup: (body) => api.post("/auth/signup", body, { headers: { "Content-Type": "application/json" } }),
    signin: (body) => api.post("/auth/signin", body, { headers: { "Content-Type": "application/json" } }),
    refreshToken: (body) => api.post("/auth/refresh", body, { headers: { "Content-Type": "application/json" } }),
    logout: (body) => api.delete("/auth/logout", { data: body, headers: { "Content-Type": "application/json" } }),
    unverified: () => api.get("/users/unverified"),
    findUser: (body) => api.post("/users/finduser", body, { headers: { "Content-Type": "application/json" } }),
    verify: (body) => api.post("/users/unverified/verify", body, { headers: { "Content-Type": "application/json" } }),
    reject: (body) => api.delete("/users/unverified/reject", { data: body, headers: { "Content-Type": "application/json" } }),
    docList: () => api.get("/users/doctors"),
    staffList: () => api.get("/users/staffs"),
    getFeedbacks: () => api.get("/users/feedbacks"),
    generateStats: () => api.get("/generate/stats"),
    bookAppointment: (body) => api.post("/appointment/book", body, { headers: { "Content-Type": "application/json" } }),
    duePayment: (body) => api.post("/appointment/duepayment", body, { headers: { "Content-Type": "application/json" } }),
    makePayment: (body) => api.post("/appointment/duepayment/makepayment", body, { headers: { "Content-Type": "application/json" } }),
    myAppointments: (body) => api.post("/patient/appointments", body, { headers: { "Content-Type": "application/json" } }),
    cancelAppointment: (body) => api.post("/appointment/cancel", body, { headers: { "Content-Type": "application/json" } }),
    prescriptions: (body) => api.post("/patient/prescriptions", body, { headers: { "Content-Type": "application/json" } }),
    writeFeedback: (body) => api.post("/patient/appointments/feedbacks/write", body, { headers: { "Content-Type": "application/json" } }),
    deleteFeedback: (body) => api.post("/patient/appointments/feedbacks/delete", body, { headers: { "Content-Type": "application/json" } }),
    docAppointments: (body) => api.post("/doctor/appointments", body, { headers: { "Content-Type": "application/json" } }),
    // For file upload, do NOT set Content-Type, let browser handle it
    uploadPrescription: (formData) => api.post("/doctor/prescription/upload", formData),
    docFeedbacks: (body) => api.post("/doctor/appointments/feedbacks", body, { headers: { "Content-Type": "application/json" } }),
    findPatient: (body) => api.post("/staff/find/patient", body, { headers: { "Content-Type": "application/json" } }),
    uploadMedicalReport: (formData) => api.post("/patient/medicalreport/upload", formData),
    getMedicalReports: (body) => api.post("/patient/medicalreport/list", body, { headers: { "Content-Type": "application/json" } })
};

export default apiEndpoints;