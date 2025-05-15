import React from "react";
import { Button, Card, CardContent, Typography } from "@mui/material";
import { Cancel, DoneOutline, Person, Email, Work, Business } from "@mui/icons-material";
import { useNavigate, createSearchParams } from "react-router-dom";
import api from "../../../../api";
import { useAuth } from "../../../../AuthContext";
import styles from "./VerifyUser.module.css";

export default function VerificationCard(props) {
  const { setLoader, setAlert, setAlertMsg } = useAuth();
  const navigate = useNavigate();

  const handleVerify = async () => {
    try {
      setLoader(true);
      const res = await api.verify({ 
        uid: props.user.uid,
        // Add any additional verification data needed by your API
      });
      
      if (res.data.error) {
        setLoader(false);
        setAlertMsg(res.data.errorMsg);
        setAlert(true);
      } else {
        setLoader(false);
        // Call the onVerify callback from props instead of navigating
        if (props.onVerify) {
          props.onVerify(props.user.uid);
        }
        setAlertMsg(res.data.msg || "User verified successfully!");
        setAlert(true);
      }
    } catch (error) {
      setLoader(false);
      setAlertMsg(error?.response?.data?.errorMsg || "An Error Occurred!");
      setAlert(true);
      console.error(error);
    }
  };

  const handleReject = async () => {
    try {
      setLoader(true);
      const res = await api.reject({ data: { uid: props.user.uid } });
      if (res.data.error) {
        setLoader(false);
        setAlertMsg(res.data.errorMsg);
        setAlert(true);
      } else {
        setLoader(false);
        if (props.onReject) {
          props.onReject(props.user.uid);
        }
        setAlertMsg(res.data.msg || "User rejected successfully!");
        setAlert(true);
      }
    } catch (error) {
      setLoader(false);
      setAlertMsg(error?.response?.data?.errorMsg || "An Error Occurred!");
      setAlert(true);
      console.log(error);
    }
  };

  const renderStatusBadge = () => {
    const status = props.user.status || "pending";
    let badgeClass = "";
    let badgeText = "";

    switch (status) {
      case "verified":
        badgeClass = "verifiedBadge";
        badgeText = "Verified";
        break;
      case "rejected":
        badgeClass = "rejectedBadge";
        badgeText = "Rejected";
        break;
      default:
        badgeClass = "pendingBadge";
        badgeText = "Pending";
    }

    return (
      <div className={`${styles.statusBadge} ${styles[badgeClass]}`}>
        {badgeText}
      </div>
    );
  };

  return (
    <Card className={styles.card}>
      <CardContent className={styles.cardContent}>
        <div className={styles.userInfo}>
          {props.showStatus && renderStatusBadge()}
          
          <Typography className={styles.userName}>
            <span className={styles.iconWrapper}>
              <Person fontSize="small" />
            </span>
            {`${props.user.fname} ${props.user.lname}`}
          </Typography>

          <Typography className={styles.userEmail}>
            <span className={styles.iconWrapper}>
              <Email fontSize="small" />
            </span>
            {props.user.email}
          </Typography>

          <Typography className={styles.userPosition}>
            <span className={styles.iconWrapper}>
              <Work fontSize="small" />
            </span>
            {`Position: ${props.user.userType}`}
          </Typography>

          {props.user.department && (
            <Typography className={styles.userDepartment}>
              <span className={styles.iconWrapper}>
                <Business fontSize="small" />
              </span>
              {`Department of ${props.user.department}`}
            </Typography>
          )}
        </div>

        {props.showActions !== false && (
          <div className={styles.cardActions}>
            <Button
              variant="contained"
              className={styles.verifyButton}
              size="small"
              endIcon={<DoneOutline />}
              onClick={handleVerify}
              disabled={props.user.status === "verified"}
            >
              Verify
            </Button>
            <Button
              variant="contained"
              className={styles.rejectButton}
              size="small"
              endIcon={<Cancel />}
              onClick={handleReject}
              disabled={props.user.status === "rejected"}
            >
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}