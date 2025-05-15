import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import styles from "./ViewFeedbacks.module.css";

export default function FeedbackCard(props) {
  return (
    <Card className={`${styles.card} ${props.className || ''}`}>
      <CardContent className={styles.cardContent}>
        <div className={styles.reviewContent}>
          <Typography className={styles.reviewText} variant="h5" component="div">
            {props.feedback.review}
          </Typography>
          <Typography className={styles.userInfo}>
            {`Patient: ${props.feedback.patname}`}
          </Typography>
          <Typography className={styles.userInfo}>
            {`Doctor: ${props.feedback.docname}`}
          </Typography>
          <Typography className={styles.userInfo}>
            {`Appointment: ${props.feedback.date}`}
          </Typography>
        </div>
        <div className={styles.ratingContainer}>
          <Rating 
            name="read-only" 
            value={props.feedback.rating} 
            readOnly 
            className={styles.rating}
          />
        </div>
      </CardContent>
    </Card>
  );
}