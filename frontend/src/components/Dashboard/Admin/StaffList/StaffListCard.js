import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate, createSearchParams } from "react-router-dom";

import styles from "./StaffList.module.css";

export default function StaffListCard(props) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate({
      pathname: "/dashboard/admin/verify-user/addnew",
      search: `?${createSearchParams({
        uid: props.staff.uid,
      })}`,
    });
  };

  const getInitials = (fname, lname) => {
    return `${fname?.charAt(0) || ""}${lname?.charAt(0) || ""}`;
  };

  return (
    <Card className={styles.card}>
      <CardContent className={styles.cardContent}>
        {/* Header Section with Avatar and Basic Info */}
        <div className={styles.avatarSection}>
          <div className={styles.avatarCircle}>
            {getInitials(props.staff.fname, props.staff.lname)}
          </div>
          <div className={styles.headerInfo}>
            <Typography className={styles.staffName}>
              {`${props.staff.fname} ${props.staff.lname}`}
            </Typography>
            
          </div>
        </div>

        <div className={styles.infoRow}>
  <span className={styles.infoLabel}>Schedule:</span>
  <span className={styles.infoValue}>
    {props.staff.workDays && props.staff.workDays.length > 0 
      ? props.staff.workDays.join(" | ") 
      : <span>Not available</span>}
  </span>
</div>

<div className={styles.infoRow}>
  <span className={styles.infoLabel}>Timing:</span>
  <span className={styles.infoValue}>
    {props.staff.time ? props.staff.time : <span>Not available</span>}
  </span>
</div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Email:</span>
          <span className={styles.infoValue}>
            {props.staff.email}
          </span>
        </div>

        {/* Work Days Tags (if you want to keep them) */}
        {props.staff.workDays && props.staff.workDays.length > 0 && (
          <div className={styles.workDaysContainer}>
            {props.staff.workDays.map((day, index) => (
              <span key={index} className={styles.workDayTag}>
                {day}
              </span>
            ))}
          </div>
        )}
      </CardContent>

      <CardActions className={styles.cardActions}>
        <Button
          variant="contained"
          className={styles.editButton}
          size="medium"
          endIcon={<EditIcon />}
          onClick={handleEdit}
        >
          Edit Profile
        </Button>
      </CardActions>
    </Card>
  );
};