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
  Zoom,
  Fade
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from 'axios';
import styles from "./SignupModel.module.css";
import { useAuth } from "../../AuthContext";
import { useNavigate } from "react-router-dom";

// API base URL - replace with your actual backend URL
const API_URL = "http://localhost:5000/api"; // Adjust this to your backend URL

const userRoles = ["Patient", "Staff", "Doctor", "Admin"];

export default function SignupModal({ onClose }) {
  const { setLoader, setAlert, setAlertMsg, setAlertType } = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState("Patient");
  const [department, setDepartment] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState({});

  // Animation states for fields
  const [animationComplete, setAnimationComplete] = useState(false);

  React.useEffect(() => {
    // Trigger animation after component mounts
    setTimeout(() => setAnimationComplete(true), 300);
  }, []);

  // **🔹 Form Validation**
  const validateForm = () => {
    let tempErrors = {};
    
    if (!fname.trim()) tempErrors.fname = "First name is required!";
    if (!lname.trim()) tempErrors.lname = "Last name is required!";
    if (!email.match(/^\S+@\S+\.\S+$/)) tempErrors.email = "Enter a valid email!";
    if (password.length < 6) tempErrors.password = "Password must be at least 6 characters!";
    
    if (user === "Doctor") {
      if (!department.trim()) tempErrors.department = "Department is required!";
      if (!speciality.trim()) tempErrors.speciality = "Speciality is required!";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // **🔹 Form Submission Handler**
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const postData = {
      userType: user,
      fname,
      lname,
      department,
      speciality,
      email,
      password,
    };

    try {
      setLoader(true);
      setIsLoading(true);
      // Direct axios call instead of using the undefined api object
      const res = await axios.post(`${API_URL}/signup`, postData);

      if (res.data.error) {
        setLoader(false);
        setIsLoading(false);
        setAlertMsg(res.data.errorMsg);
        setAlertType("error");
        setAlert(true);
      } else {
        setLoader(false);
        setIsLoading(false);
        setUser("Patient");
        setDepartment("");
        setSpeciality("");
        setFname("");
        setLname("");
        setEmail("");
        setPassword("");

        setAlertMsg(res.data.msg);
        setAlertType("success");
        setAlert(true);

        onClose(); // Close the modal
        navigate("/signin");
      }
    } catch (error) {
      setLoader(false);
      setIsLoading(false);
      setAlertMsg(error.response?.data?.errorMsg || "An error occurred!");
      setAlertType("error");
      setAlert(true);
      console.error(error);
    }
  };

  // Handle signin link click
  const handleSignInClick = () => {
    onClose(); // Close the modal
    navigate("/signin");
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

            {/* 🔹 User Type Dropdown */}
            <Fade in={animationComplete} timeout={500} style={{ transitionDelay: '200ms' }}>
              <FormControl fullWidth className={styles.formField}>
                <InputLabel>User Type</InputLabel>
                <Select value={user} onChange={(e) => setUser(e.target.value)} label="User Type">
                  {userRoles.map((role) => (
                    <MenuItem key={role} value={role}>{role}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Fade>

            {/* 🔹 Conditional Fields for Doctor */}
            {user === "Doctor" && (
              <Fade in={true} timeout={400}>
                <Box>
                  <TextField
                    name="department"
                    fullWidth
                    className={styles.formField}
                    id="department"
                    label="Department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    error={!!errors.department}
                    helperText={errors.department}
                  />
                  <TextField
                    name="speciality"
                    fullWidth
                    className={styles.formField}
                    id="speciality"
                    label="Speciality"
                    value={speciality}
                    onChange={(e) => setSpeciality(e.target.value)}
                    error={!!errors.speciality}
                    helperText={errors.speciality}
                  />
                </Box>
              </Fade>
            )}

            {/* 🔹 Name Fields */}
            <Fade in={animationComplete} timeout={500} style={{ transitionDelay: '300ms' }}>
              <Box component="div" className={styles.nameContainer}>
                <TextField
                  className={`${styles.nameInput} ${styles.formField}`}
                  name="firstName"
                  fullWidth
                  id="firstName"
                  label="First Name"
                  value={fname}
                  onChange={(e) => setFname(e.target.value)}
                  error={!!errors.fname}
                  helperText={errors.fname}
                />
                <TextField
                  className={`${styles.nameInput} ${styles.formField}`}
                  name="lastName"
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  value={lname}
                  onChange={(e) => setLname(e.target.value)}
                  error={!!errors.lname}
                  helperText={errors.lname}
                />
              </Box>
            </Fade>

            {/* 🔹 Email Field */}
            <Fade in={animationComplete} timeout={500} style={{ transitionDelay: '400ms' }}>
              <TextField
                margin="normal"
                fullWidth
                className={styles.formField}
                id="email"
                type="email"
                label="Email Address"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Fade>

            {/* 🔹 Password Field */}
            <Fade in={animationComplete} timeout={500} style={{ transitionDelay: '500ms' }}>
              <TextField
                margin="normal"
                fullWidth
                className={styles.formField}
                name="password"
                label="Password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!errors.password}
                helperText={errors.password}
              />
            </Fade>

            {/* 🔹 Submit Button */}
            <Fade in={animationComplete} timeout={500} style={{ transitionDelay: '600ms' }}>
              <Button 
                type="submit" 
                fullWidth 
                disabled={isLoading}
                variant="contained" 
                className={styles.submitButton}
              >
                {isLoading ? "Processing..." : "Sign Up"}
              </Button>
            </Fade>

            {/* 🔹 Redirect to Sign In */}
            <Fade in={animationComplete} timeout={500} style={{ transitionDelay: '700ms' }}>
              <Button onClick={handleSignInClick} className={styles.linkBtn}>
                {"Already have an account? Sign In"}
              </Button>
            </Fade>
          </Box>
        </div>
      </div>
    </Fade>
  );
}