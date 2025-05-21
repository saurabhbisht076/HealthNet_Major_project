import React, { useEffect, useState } from "react";
import { Alert, Grid } from "@mui/material";
import Navbar from "../../../Navbar/Navbar";
import styles from "./ViewFeedbacks.module.css";
import FeedbackCard from "./FeedbackCard";
import api from "../../../../api";
import { useAuth } from "../../../../AuthContext";

export default function ViewFeedbacks() {
  const { setLoader, setAlert, setAlertMsg } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [unavailableMsg, setUnavailableMsg] = useState(null);

  useEffect(() => {
    async function fetchFeedbacks() {
      try {
        setLoader(true);
        setUnavailableMsg(null);
        const res = await api.getFeedbacks();
        if (res.data.error) {
          setLoader(false);
          setAlertMsg(res.data.errorMsg);
          setAlert(true);
        } else {
          setLoader(false);
          setFeedbacks(res.data);
        }
      } catch (error) {
        setLoader(false);
        setAlertMsg(error?.response?.data?.errorMsg);
        setAlert(true);
        console.log(error);
        if (error.response.status === 404) {
          setUnavailableMsg(
            "Feedbacks given by the patients will appear here."
          );
        }
      }
    }
    fetchFeedbacks();
  }, [setLoader, setAlert, setAlertMsg]);

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.cardContainer}>
        <Grid container className={styles.gridContainer}>
          {feedbacks.map((feedback, index) => (
            <Grid 
              key={index} 
              item 
              className={styles.gridItem}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={styles.cardWrapper}>
                <FeedbackCard 
                  feedback={feedback} 
                  className={styles.card}
                />
              </div>
            </Grid>
          ))}
        </Grid>
        {unavailableMsg && (
          <Alert icon={false} severity="error" className={styles.alert}>
            {unavailableMsg}
          </Alert>
        )}
      </div>
    </div>
  );
}