import React, { useState } from "react";
import { 
    Box, 
    Avatar, 
    Typography, 
    TextField, 
    Button,
    CircularProgress // Add this for loading state
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import styles from "./SignUp.module.css";
import SelectInput from "../SelectInput/SelectInput";
import api from "../../api";
import { useAuth } from "../../AuthContext";

const options = ["Patient", "Staff", "Doctor", "Admin"];

// Email validation regex
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
// Password validation regex (min 8 chars, 1 uppercase, 1 lowercase, 1 number)
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

export default function SignUp() {
    const { setLoader, setAlert, setAlertMsg, setAlertType } = useAuth();
    const navigate = useNavigate();
    
    // Form states
    const [user, setUser] = useState("Patient");
    const [department, setDepartment] = useState("");
    const [speciality, setSpeciality] = useState("");
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    // Validation states
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Validation function
    const validateForm = () => {
        const newErrors = {};

        // First Name validation
        if (fname.trim().length < 2) {
            newErrors.fname = "First name must be at least 2 characters";
        }

        // Last Name validation
        if (lname.trim().length < 2) {
            newErrors.lname = "Last name must be at least 2 characters";
        }

        // Email validation
        if (!EMAIL_REGEX.test(email)) {
            newErrors.email = "Please enter a valid email address";
        }

        // Password validation
        if (!PASSWORD_REGEX.test(password)) {
            newErrors.password = 
                "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number";
        }

        // Doctor specific validations
        if (user === "Doctor") {
            if (department.trim().length < 2) {
                newErrors.department = "Department is required";
            }
            if (speciality.trim().length < 2) {
                newErrors.speciality = "Speciality is required";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Prevent double submission
        if (isSubmitting) return;

        // Validate form
        if (!validateForm()) {
            setAlertMsg("Please fix the errors in the form");
            setAlertType("error");
            setAlert(true);
            return;
        }

        setIsSubmitting(true);
        setLoader(true);

        // Prepare the data
        const postData = {
            userType: user,
            fname: fname.trim(),
            lname: lname.trim(),
            ...(user === "Doctor" && { 
                department: department.trim(), 
                speciality: speciality.trim() 
            }),
            email: email.trim().toLowerCase(),
            password,
        };

        try {
            console.log('Submitting signup form...', {
                ...postData,
                password: '[REDACTED]'
            });

            const response = await api.signup(postData);
            
            if (response.data.error) {
                setAlertMsg(response.data.errorMsg);
                setAlertType("error");
                setAlert(true);
            } else {
                // Reset form
                setUser("Patient");
                setDepartment("");
                setSpeciality("");
                setFname("");
                setLname("");
                setEmail("");
                setPassword("");

                setAlertMsg(response.data.msg || "Signup Successful!");
                setAlertType("success");
                setAlert(true);

                // Navigate after showing success message
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
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <Box
                component="form"
                className={styles.form}
                noValidate
                onSubmit={handleSubmit}
            >
                <Avatar
                    alt="auth logo"
                    src="/authimg.png"
                    sx={{ width: 100, height: 100 }}
                />
                <Typography component="h1" variant="h5">
                    Sign Up
                </Typography>

                {/* User Type Field */}
                <SelectInput
                    label="User Type"
                    value={user}
                    setValue={setUser}
                    options={options}
                />

                {user === "Doctor" && (
                    <TextField
                        name="department"
                        required
                        fullWidth
                        id="department"
                        label="Department"
                        sx={{ marginBottom: "10px" }}
                        value={department}
                        onChange={(event) => setDepartment(event.target.value)}
                        error={!!errors.department}
                        helperText={errors.department}
                    />
                )}

                {user === "Doctor" && (
                    <TextField
                        name="speciality"
                        required
                        fullWidth
                        id="speciality"
                        label="Speciality"
                        sx={{ marginBottom: "10px" }}
                        value={speciality}
                        onChange={(event) => setSpeciality(event.target.value)}
                        error={!!errors.speciality}
                        helperText={errors.speciality}
                    />
                )}

                {/* Name Fields */}
                <Box component="div" className={styles.nameContainer}>
                    <TextField
                        className={styles.nameInput}
                        autoComplete="given-name"
                        name="firstName"
                        required
                        fullWidth
                        id="firstName"
                        label="First Name"
                        value={fname}
                        autoFocus
                        onChange={(event) => setFname(event.target.value)}
                        error={!!errors.fname}
                        helperText={errors.fname}
                    />
                    <TextField
                        className={styles.nameInput}
                        autoComplete="family-name"
                        name="LastName"
                        required
                        fullWidth
                        id="LastName"
                        label="Last Name"
                        value={lname}
                        onChange={(event) => setLname(event.target.value)}
                        error={!!errors.lname}
                        helperText={errors.lname}
                    />
                </Box>

                {/* Email Field */}
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    type="email"
                    label="Email Address"
                    name="email"
                    value={email}
                    autoComplete="email"
                    onChange={(event) => setEmail(event.target.value)}
                    error={!!errors.email}
                    helperText={errors.email}
                />

                {/* Password Field */}
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    error={!!errors.password}
                    helperText={errors.password}
                />

                {/* Submit Button */}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        "Sign Up"
                    )}
                </Button>

                <Link to="/signin" className={styles.linkBtn}>
                    {"Already have an account? Sign In"}
                </Link>
            </Box>
        </div>
    );
}