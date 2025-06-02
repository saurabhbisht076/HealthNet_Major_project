import React, { useEffect, useState } from "react";
import {
  Alert,
  Grid,
  Button,
  Typography,
  Box,
  Paper,
  IconButton
} from "@mui/material";
import Navbar from "../../../Navbar/Navbar";
import PrescriptionCard from "./PrescriptionCard";
import styles from "./Prescriptions.module.css";
import jwt_decode from "jwt-decode";
import api from "../../../../api";
import { useAuth } from "../../../../AuthContext";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
export default function Prescriptions() {
  const { setLoader, setAlert, setAlertMsg } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [unavailableMsg, setUnavailableMsg] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  /* new code */
  const [medicalReports, setMedicalReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  useEffect(() => {
    async function fetchPrescription() {
      try {
        setLoader(true);
        setUnavailableMsg(null);
        const uid = jwt_decode(localStorage.getItem("accessToken")).uid;
        const res = await api.prescriptions({ patid: uid });
        if (res.data.error) {
          setLoader(false);
          setAlertMsg(res.data.errorMsg);
          setAlert(true);
        } else {
          setLoader(false);
          setPrescriptions(res.data);
        }
      } catch (error) {
        setLoader(false);
        setAlertMsg(error?.response?.data?.errorMsg);
        setAlert(true);
        console.log(error);
        if (error.response?.status === 404) {
          setUnavailableMsg("** You have not been prescribed yet **");
        }
      }
    }
    fetchPrescription();
  }, [setLoader, setAlert, setAlertMsg]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
  };

  const simulateUpload = () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulating upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setSelectedFile(null);
            setUploadProgress(0);
            setAlertMsg("Prescription file uploaded successfully!");
            setAlert(true);
            // You would typically refresh prescriptions here
            // fetchPrescription();
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };
  //new code 

  const handleReportSelect = (e) => setSelectedReport(e.target.files[0]);

  const handleReportUpload = async () => {
    if (!selectedReport) return;
    const uid = jwt_decode(localStorage.getItem("accessToken")).uid;
    const formData = new FormData();
    formData.append("file", selectedReport);
    formData.append("patid", uid);
    formData.append("reportType", "General"); // or let user select type
    await api.uploadMedicalReport(formData);
    setSelectedReport(null);
    // Refresh list
    const res = await api.getMedicalReports({ patid: uid });
    if (!res.data.error) setMedicalReports(res.data);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setAlertMsg("Please select a file first");
      setAlert(true);
      return;
    }

    // Here you would typically upload the file to your backend
    // const formData = new FormData();
    // formData.append('prescription', selectedFile);
    // Try to upload the file to your API
    // try {
    //   setLoader(true);
    //   const uid = jwt_decode(localStorage.getItem("accessToken")).uid;
    //   const res = await api.uploadPrescription(formData, uid);
    //   setLoader(false);
    //   if (res.data.success) {
    //     setAlertMsg("Prescription uploaded successfully");
    //     setAlert(true);
    //     setSelectedFile(null);
    //     // Refresh the prescriptions list
    //     fetchPrescription();
    //   }
    // } catch (error) {
    //   setLoader(false);
    //   setAlertMsg(error?.response?.data?.errorMsg || "Failed to upload prescription");
    //   setAlert(true);
    // }

    // For now, let's simulate the upload
    simulateUpload();
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.cardContainer}>
        {/* File Uploader Section */}
        <Paper elevation={3} className={styles.uploadSection}>
          <Typography variant="h5" component="h2" gutterBottom>
            Upload Prescription
          </Typography>

          <Box className={styles.uploadBox}>
            <input
              accept="image/*,.pdf"
              style={{ display: 'none' }}
              id="prescription-file"
              type="file"
              onChange={handleFileSelect}
              disabled={isUploading}
            />
            <label htmlFor="prescription-file">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUploadIcon />}
                className={styles.uploadButton}
                disabled={isUploading}
              >
                Select File
              </Button>
            </label>

            {selectedFile && (
              <Box className={styles.filePreview}>
                <Typography variant="body1" noWrap>
                  {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                </Typography>
                <IconButton
                  color="error"
                  size="small"
                  onClick={handleRemoveFile}
                  disabled={isUploading}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}

            <Button
              variant="contained"
              color="primary"
              startIcon={<FileUploadIcon />}
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className={styles.submitButton}
            >
              {isUploading ? `Uploading ${uploadProgress}%` : "Upload Prescription"}
            </Button>

            {isUploading && (
              <Box className={styles.progressBar}>
                <Box
                  className={styles.progressBarFill}
                  style={{ width: `${uploadProgress}%` }}
                />
              </Box>
            )}
          </Box>
        </Paper>
        {/* Medical Report Upload Section */}

        {/* Medical Report Upload & List Section */}
        <Paper elevation={3} className={styles.uploadSection}>
          <Typography variant="h5" gutterBottom>
            Upload Medical Report
          </Typography>
          <Box className={styles.uploadBox}>
            <input
              accept="image/*,.pdf"
              style={{ display: "none" }}
              id="medical-report-file"
              type="file"
              onChange={handleReportSelect}
            />
            <label htmlFor="medical-report-file">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUploadIcon />}
                className={styles.uploadButton}
              >
                Select Report
              </Button>
            </label>
            {selectedReport && (
              <Box className={styles.filePreview}>
                <Typography variant="body1" noWrap>
                  {selectedReport.name} ({(selectedReport.size / 1024).toFixed(2)} KB)
                </Typography>
                <IconButton color="error" size="small" onClick={() => setSelectedReport(null)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
            <Button
              variant="contained"
              color="primary"
              startIcon={<CloudUploadIcon />}
              onClick={handleReportUpload}
              disabled={!selectedReport}
              className={styles.submitButton}
            >
              Upload Report
            </Button>
          </Box>
        </Paper>

        <Typography variant="h6" gutterBottom>
          Your Medical Reports
        </Typography>
        <Grid container spacing={2}>
          {medicalReports.map((report) => (
            <Grid item xs={12} key={report._id}>
              <Paper className={styles.filePreview}>
                <Typography variant="body2" noWrap>
                  {report.file.originalname}
                </Typography>
                <Button
                  href={`${process.env.REACT_APP_API_URL}/patient/medicalreport/download/${report._id}`}
                  startIcon={<FileDownloadIcon />}
                  variant="outlined"
                >
                  Download
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
        <Typography variant="h5" component="h2" gutterBottom className={styles.sectionTitle}>
          Your Prescriptions
        </Typography>
        <Grid container spacing={3}>
          {prescriptions.map((prescription, index) => (
            <Grid key={index} item xs={12}>
              <PrescriptionCard prescription={prescription} />
            </Grid>
          ))}
        </Grid>

        {/* Existing Prescriptions Section */}
        <Typography variant="h5" component="h2" gutterBottom className={styles.sectionTitle}>
          Your Prescriptions
        </Typography>

        <Grid container spacing={3}>
          {prescriptions.map((prescription, index) => (
            <Grid key={index} item xs={12}>
              <PrescriptionCard prescription={prescription} />
            </Grid>
          ))}
        </Grid>

        {unavailableMsg && (
          <Alert icon={false} severity="error">
            {unavailableMsg}
          </Alert>
        )}
      </div>
    </div>
  );
}