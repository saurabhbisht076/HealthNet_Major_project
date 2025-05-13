import { Link} from "react-router-dom";
import React, { useState, useEffect } from "react";
import { 
    Box, 
    Avatar, 
    Typography, 
    TextField, 
    Button, 
    MenuItem, 
    FormControl, 
    InputLabel, 
    Select,
    IconButton,
    Zoom,
    Fade,
    CircularProgress // Added for loading state
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from 'axios';
import styles from "./SignupModel.module.css";
import { useAuth } from "../../AuthContext";
import { useNavigate } from "react-router-dom";

// API Configuration
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

const userRoles = ["Patient", "Staff", "Doctor", "Admin"];

// Email validation regex
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export default function SignupModal({ onClose }) {
    const { setLoader, setAlert, setAlertMsg, setAlertType } = useAuth();
    const navigate = useNavigate();

    // Form states
    const [formData, setFormData] = useState({
        user: "Patient",
        department: "",
        speciality: "",
        fname: "",
        lname: "",
        email: "",
        password: ""
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [animationComplete, setAnimationComplete] = useState(false);

    useEffect(() => {
        setTimeout(() => setAnimationComplete(true), 300);
    }, []);

    // Handle form input changes
    const handleInputChange = (field) => (event) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: null
            }));
        }
    };

    // Form validation
    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.fname.trim()) newErrors.fname = "First name is required";
        if (!formData.lname.trim()) newErrors.lname = "Last name is required";
        if (!EMAIL_REGEX.test(formData.email)) newErrors.email = "Enter a valid email";
        if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
        
        if (formData.user === "Doctor") {
            if (!formData.department.trim()) newErrors.department = "Department is required";
            if (!formData.speciality.trim()) newErrors.speciality = "Speciality is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Form submission handler
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) return;

        const postData = {
            userType: formData.user,
            fname: formData.fname.trim(),
            lname: formData.lname.trim(),
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
            ...(formData.user === "Doctor" && {
                department: formData.department.trim(),
                speciality: formData.speciality.trim()
            })
        };

        try {
            setIsLoading(true);
            setLoader(true);

            // Using the correct endpoint /auth/signup
            const response = await axiosInstance.post('/auth/signup', postData);

            if (response.data.error) {
                setAlertMsg(response.data.errorMsg);
                setAlertType("error");
                setAlert(true);
            } else {
                setAlertMsg(response.data.msg || "Signup Successful!");
                setAlertType("success");
                setAlert(true);

                // Reset form
                setFormData({
                    user: "Patient",
                    department: "",
                    speciality: "",
                    fname: "",
                    lname: "",
                    email: "",
                    password: ""
                });

                onClose(); // Close the modal
                setTimeout(() => {
                    navigate("/signin");
                }, 1500);
            }
        } catch (error) {
            console.error("Signup error:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });

            // Handle specific error cases
            if (error.response?.status === 409) {
                setAlertMsg("This email is already registered");
            } else {
                setAlertMsg(error.response?.data?.errorMsg || "An error occurred during signup!");
            }
            setAlertType("error");
            setAlert(true);
        } finally {
            setLoader(false);
            setIsLoading(false);
        }
    };

    return (
        <Fade in={true} timeout={300}>
            <div className={styles.modalOverlay}>
                <div className={styles.modalContent}>
                    <IconButton 
                        className={styles.closeButton}
                        onClick={onClose}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                    
                    <Box component="form" className={styles.form} onSubmit={handleSubmit}>
                        <Box className={styles.formHeader}>
                            <Zoom in={true} style={{ transitionDelay: '150ms' }}>
                                <Avatar 
                                    className={styles.avatar} 
                                    sx={{ width: 80, height: 80, bgcolor: '#e6f0fd' }}
                                >
                                    <FavoriteIcon color="error" sx={{ fontSize: 40 }} />
                                </Avatar>
                            </Zoom>
                            <Typography className={styles.title} component="h1" variant="h5">
                                Sign Up
                            </Typography>
                        </Box>

                        {/* User Type Dropdown */}
                        <Fade in={animationComplete} timeout={500} style={{ transitionDelay: '200ms' }}>
                            <FormControl fullWidth className={styles.formField}>
                                <InputLabel>User Type</InputLabel>
                                <Select
                                    value={formData.user}
                                    onChange={handleInputChange('user')}
                                    label="User Type"
                                >
                                    {userRoles.map((role) => (
                                        <MenuItem key={role} value={role}>{role}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Fade>

                        {/* Doctor Fields */}
                        {formData.user === "Doctor" && (
                            <Fade in={true} timeout={400}>
                                <Box>
                                    <TextField
                                        name="department"
                                        fullWidth
                                        className={styles.formField}
                                        label="Department"
                                        value={formData.department}
                                        onChange={handleInputChange('department')}
                                        error={!!errors.department}
                                        helperText={errors.department}
                                    />
                                    <TextField
                                        name="speciality"
                                        fullWidth
                                        className={styles.formField}
                                        label="Speciality"
                                        value={formData.speciality}
                                        onChange={handleInputChange('speciality')}
                                        error={!!errors.speciality}
                                        helperText={errors.speciality}
                                    />
                                </Box>
                            </Fade>
                        )}

                        {/* Name Fields */}
                        <Fade in={animationComplete} timeout={500} style={{ transitionDelay: '300ms' }}>
                            <Box className={styles.nameContainer}>
                                <TextField
                                    className={`${styles.nameInput} ${styles.formField}`}
                                    name="firstName"
                                    required
                                    label="First Name"
                                    value={formData.fname}
                                    onChange={handleInputChange('fname')}
                                    error={!!errors.fname}
                                    helperText={errors.fname}
                                />
                                <TextField
                                    className={`${styles.nameInput} ${styles.formField}`}
                                    name="lastName"
                                    required
                                    label="Last Name"
                                    value={formData.lname}
                                    onChange={handleInputChange('lname')}
                                    error={!!errors.lname}
                                    helperText={errors.lname}
                                />
                            </Box>
                        </Fade>

                        {/* Email Field */}
                        <Fade in={animationComplete} timeout={500} style={{ transitionDelay: '400ms' }}>
                            <TextField
                                required
                                fullWidth
                                className={styles.formField}
                                type="email"
                                label="Email Address"
                                value={formData.email}
                                onChange={handleInputChange('email')}
                                error={!!errors.email}
                                helperText={errors.email}
                            />
                        </Fade>

                        {/* Password Field */}
                        <Fade in={animationComplete} timeout={500} style={{ transitionDelay: '500ms' }}>
                            <TextField
                                required
                                fullWidth
                                className={styles.formField}
                                type="password"
                                label="Password"
                                value={formData.password}
                                onChange={handleInputChange('password')}
                                error={!!errors.password}
                                helperText={errors.password}
                            />
                        </Fade>

                        {/* Submit Button */}
                        <Fade in={animationComplete} timeout={500} style={{ transitionDelay: '600ms' }}>
                            <Button 
                                type="submit" 
                                fullWidth 
                                variant="contained" 
                                className={styles.submitButton}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    "Sign Up"
                                )}
                            </Button>
                        </Fade>

                        {/* Sign In Link */}
                        <Fade in={animationComplete} timeout={500} style={{ transitionDelay: '700ms' }}>
                            <Link 
                                to="/signin" 
                                className={styles.linkBtn}
                                onClick={onClose} // Close modal when clicking the link
                            >
                                <Button className={styles.linkBtn}>
                                    Already have an account? Sign In
                                </Button>
                            </Link>
                        </Fade>
                    </Box>
                </div>
            </div>
        </Fade>
    );
  }