// Last updated: 2025-05-16 10:49:47 UTC by virusvinay

import React from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import styles from "./DocList.module.css";
import EditIcon from "@mui/icons-material/Edit";
import { Card, CardContent, Typography, Button, Avatar } from "@mui/material";

export default function DocListCard({ doctor }) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate({
      pathname: "/dashboard/admin/verify-user/addnew",
      search: `?${createSearchParams({ uid: doctor.uid })}`,
    });
  };

  const getInitials = (fname, lname) => {
    return `${fname.charAt(0)}${lname.charAt(0)}`.toUpperCase();
  };

  // Check if schedule/timing is unavailable
  const isUnavailable = (value) => {
    return !value || value === "Not available";
  };

  return (
    <Card className={styles.card}>
      <CardContent className={styles.cardContent}>
        <div className={styles.avatarSection}>
          <Avatar className={styles.avatar}>
            {getInitials(doctor.fname, doctor.lname)}
          </Avatar>
          <div className={styles.nameContainer}>
            <Typography variant="h6" className={styles.doctorName}>
              Dr. {doctor.fname} {doctor.lname}
            </Typography>
            <Typography className={styles.speciality}>
              {doctor.speciality}
            </Typography>
          </div>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoRow}>
            <Typography className={styles.label}>Department:</Typography>
            <Typography className={styles.value}>{doctor.department}</Typography>
          </div>
          <div className={styles.infoRow}>
            <Typography className={styles.label}>Schedule:</Typography>
            <Typography 
              className={`${styles.value} ${isUnavailable(doctor.workDays?.join(" | ")) ? styles.unavailable : ""}`}
            >
              {doctor.workDays?.join(" | ") || "Not available"}
            </Typography>
          </div>
          <div className={styles.infoRow}>
            <Typography className={styles.label}>Timing:</Typography>
            <Typography 
              className={`${styles.value} ${isUnavailable(doctor.time) ? styles.unavailable : ""}`}
            >
              {doctor.time || "Not available"}
            </Typography>
          </div>
        </div>

        <div className={styles.footer}>
          <Button
            variant="contained"
            className={styles.editButton}
            onClick={handleEdit}
            startIcon={<EditIcon />}
          >
            Edit Profile
          </Button>
          <Typography className={styles.fee}>
            {doctor.fee ? `₹${doctor.fee.toLocaleString('en-IN')}` : 
              <span className={styles.unavailable}>Unavailable</span>
            }
            <span className={styles.feeLabel}>Fee per visit</span>
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
}