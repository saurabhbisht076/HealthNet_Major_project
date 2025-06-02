import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
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
  Fade,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import axios from "axios";
import styles from "./SignupModel.module.css";
import { useAuth } from "../../AuthContext";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: { "Content-Type": "application/json" }
});

const userRoles = ["Patient", "Staff", "Doctor", "Admin"];
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export default function SignupModal({ onClose }) {
  const { setLoader, setAlert, setAlertMsg, setAlertType } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    user: "Patient",
    department: "",
    speciality: "",
    fname: "",
    lname: "",
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [googleDialogOpen, setGoogleDialogOpen] = useState(false);

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value
    }));
    setErrors((prev) => ({
      ...prev,
      [field]: null
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const { fname, lname, email, password, department, speciality, user } = formData;

    if (!fname.trim()) newErrors.fname = "First name is required";
    if (!lname.trim()) newErrors.lname = "Last name is required";
    if (!EMAIL_REGEX.test(email)) newErrors.email = "Enter a valid email";
    if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

    if (user === "Doctor") {
      if (!department.trim()) newErrors.department = "Department is required";
      if (!speciality.trim()) newErrors.speciality = "Speciality is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      const { data } = await axiosInstance.post("/auth/signup", postData);

      if (data.error) {
        setAlertMsg(data.errorMsg || "Signup failed.");
        setAlertType("error");
        setAlert(true);
      } else {
        setAlertMsg(data.msg || "Signup successful!");
        setAlertType("success");
        setAlert(true);
        setFormData({
          user: "Patient",
          department: "",
          speciality: "",
          fname: "",
          lname: "",
          email: "",
          password: ""
        });
        onClose();
        setTimeout(() => navigate("/signin"), 1500);
      }
    } catch (err) {
      setAlertMsg(err.response?.data?.errorMsg || "Server error during signup.");
      setAlertType("error");
      setAlert(true);
    } finally {
      setLoader(false);
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = (role) => {
    setGoogleDialogOpen(false);
    window.location.href = `${API_URL}/auth/google?role=${role}`;
  };

  return (
    <Fade in={true} timeout={300}>
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <IconButton className={styles.closeButton} onClick={onClose}>
            <CloseIcon />
          </IconButton>

          <Box component="form" onSubmit={handleSubmit} className={styles.form}>
            <Box className={styles.formHeader}>
              <Avatar sx={{ width: 80, height: 80, bgcolor: "#e6f0fd" }}>
                <FavoriteIcon color="error" sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h5" className={styles.title}>
                Sign Up
              </Typography>
            </Box>

            <FormControl fullWidth className={styles.formField}>
              <InputLabel>User Type</InputLabel>
              <Select
                value={formData.user}
                onChange={handleInputChange("user")}
                label="User Type"
              >
                {userRoles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {formData.user === "Doctor" && (
              <>
                <TextField
                  fullWidth
                  className={styles.formField}
                  label="Department"
                  value={formData.department}
                  onChange={handleInputChange("department")}
                  error={!!errors.department}
                  helperText={errors.department}
                />
                <TextField
                  fullWidth
                  className={styles.formField}
                  label="Speciality"
                  value={formData.speciality}
                  onChange={handleInputChange("speciality")}
                  error={!!errors.speciality}
                  helperText={errors.speciality}
                />
              </>
            )}

            <Box className={styles.nameContainer}>
              <TextField
                className={`${styles.nameInput} ${styles.formField}`}
                label="First Name"
                value={formData.fname}
                onChange={handleInputChange("fname")}
                error={!!errors.fname}
                helperText={errors.fname}
                autoComplete="given-name"
              />
              <TextField
                className={`${styles.nameInput} ${styles.formField}`}
                label="Last Name"
                value={formData.lname}
                onChange={handleInputChange("lname")}
                error={!!errors.lname}
                helperText={errors.lname}
                autoComplete="family-name"
              />
            </Box>

            <TextField
              fullWidth
              className={styles.formField}
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleInputChange("email")}
              error={!!errors.email}
              helperText={errors.email}
              autoComplete="email"
            />

            <TextField
              fullWidth
              className={styles.formField}
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleInputChange("password")}
              error={!!errors.password}
              helperText={errors.password}
              autoComplete="new-password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
            </Button>

            <Link to="/signin" className={styles.linkBtn} onClick={onClose}>
              <Button className={styles.linkBtn}>
                Already have an account? Sign In
              </Button>
            </Link>

            <Button
              fullWidth
              variant="outlined"
              sx={{
                mt: 2,
                backgroundColor: "#fff",
                color: "rgba(0,0,0,0.54)",
                textTransform: "none",
                fontSize: 16,
                fontWeight: 500,
                borderColor: "#ccc",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                  borderColor: "#bbb"
                }
              }}
              startIcon={
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="google"
                  style={{ width: 20 }}
                />
              }
              onClick={() => setGoogleDialogOpen(true)}
            >
              Sign up with Google
            </Button>

            <Dialog open={googleDialogOpen} onClose={() => setGoogleDialogOpen(false)}>
              <DialogTitle>Select your role</DialogTitle>
              <DialogContent>Please choose how you want to sign up:</DialogContent>
              <DialogActions>
                {userRoles.map((role) => (
                  <Button key={role} onClick={() => handleGoogleSignUp(role)}>
                    {role}
                  </Button>
                ))}
              </DialogActions>
            </Dialog>
          </Box>
        </div>
      </div>
    </Fade>
  );
}
