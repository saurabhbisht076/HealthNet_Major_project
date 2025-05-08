import axios from "axios";

const serverUrl = process.env.REACT_APP_SERVER || "http://localhost:5000";
const baseUrl = `${serverUrl}/api`;

// Create axios instance with base configuration
const api = axios.create({
    baseURL: baseUrl,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor
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

// Response interceptor
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
    signup: (body) => api.post("/auth/signup", body),
    signin: (body) => api.post("/auth/signin", body),
    refreshToken: (body) => api.post("/auth/refresh", body),
    logout: (body) => api.delete("/auth/logout", { data: body }),
    unverified: () => api.get("/users/unverified"),
    findUser: (body) => api.post("/users/finduser", body),
    verify: (body) => api.post("/users/unverified/verify", body),
    reject: (body) => api.delete("/users/unverified/reject", { data: body }),
    docList: () => api.get("/users/doctors"),
    staffList: () => api.get("/users/staffs"),
    getFeedbacks: () => api.get("/users/feedbacks"),
    generateStats: () => api.get("/generate/stats"),
    bookAppointment: (body) => api.post("/appointment/book", body),
    duePayment: (body) => api.post("/appointment/duepayment", body),
    makePayment: (body) => api.post("/appointment/duepayment/makepayment", body),
    myAppointments: (body) => api.post("/patient/appointments", body),
    cancelAppointment: (body) => api.post("/appointment/cancel", body),
    prescriptions: (body) => api.post("/patient/prescriptions", body),
    writeFeedback: (body) => api.post("/patient/appointments/feedbacks/write", body),
    deleteFeedback: (body) => api.post("/patient/appointments/feedbacks/delete", body),
    docAppointments: (body) => api.post("/doctor/appointments", body),
    uploadPrescription: (body) => api.post("/doctor/prescription/upload", body),
    docFeedbacks: (body) => api.post("/doctor/appointments/feedbacks", body),
    findPatient: (body) => api.post("/staff/find/patient", body),
};

export default apiEndpoints;