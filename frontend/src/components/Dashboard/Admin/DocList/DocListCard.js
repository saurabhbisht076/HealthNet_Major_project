import React from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import styles from "./DocList.module.css";
import EditIcon from "@mui/icons-material/Edit";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Avatar,
  Box,
  Divider
} from "@mui/material";

export default function DocListCard({ doctor }) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate({
      pathname: "/dashboard/admin/verify-user/addnew",
      search: `?${createSearchParams({ uid: doctor.uid })}`,
    });
  };

  return (
    <Card className={styles.card}>
      <CardContent>
        <Box className={styles.avatarContainer}>
          <Avatar className={styles.avatar}>
            {doctor.fname.charAt(0)}
            {doctor.lname.charAt(0)}
          </Avatar>
          <Typography variant="h5" className={styles.doctorName}>
            {`Dr. ${doctor.fname} ${doctor.lname}`}
          </Typography>
          <Typography className={styles.speciality}>
            <MedicalServicesIcon className={styles.icon} />
            {doctor.speciality}
          </Typography>
        </Box>

        <Divider className={styles.divider} />

        <Box className={styles.detailsContainer}>
          <Typography className={styles.detailText}>
            <strong>Department:</strong> {doctor.department}
          </Typography>
          <Typography className={styles.detailText}>
            <ScheduleIcon className={styles.icon} />
            {doctor.workDays.join(" | ")}
          </Typography>
          <Typography className={styles.detailText}>
            <strong>Timing:</strong> {doctor.time}
          </Typography>
        </Box>

        <Divider className={styles.divider} />

        <CardActions className={styles.actionsContainer}>
          <Button
            variant="contained"
            className={styles.editButton}
            endIcon={<EditIcon />}
            onClick={handleEdit}
          >
            Edit Profile
          </Button>
          <Typography className={styles.feeText}>
            <CurrencyRupeeIcon fontSize="small" />
            {doctor.fee}/-
          </Typography>
        </CardActions>
      </CardContent>
    </Card>
  );
}