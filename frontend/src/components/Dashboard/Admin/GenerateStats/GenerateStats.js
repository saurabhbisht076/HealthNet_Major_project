import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import Navbar from "../../../Navbar/Navbar";
import styles from "./GenerateStats.module.css";
import StatsCard from "./StatsCard";
import api from "../../../../api";
import { useAuth } from "../../../../AuthContext";

export default function GenerateStats() {
  const { setLoader, setAlert, setAlertMsg } = useAuth();
  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoader(true);
        setIsLoading(true);
        const res = await api.generateStats();
        if (res.data.error) {
          setLoader(false);
          setIsLoading(false);
          setAlertMsg(res.data.errorMsg);
          setAlert(true);
        } else {
          setLoader(false);
          setIsLoading(false);
          setStats(res.data);
        }
      } catch (error) {
        setLoader(false);
        setIsLoading(false);
        setAlertMsg(error?.response?.data?.errorMsg);
        setAlert(true);
        console.log(error);
      }
    }
    fetchStats();
  }, [setLoader, setAlert, setAlertMsg]);

  // Render loading state
  const renderLoadingState = () => (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner}></div>
      <p className={styles.loadingText}>Loading statistics...</p>
    </div>
  );

  // Render empty state
  const renderEmptyState = () => (
    <div className={styles.emptyStateContainer}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="40" 
        height="40" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className={styles.emptyStateIcon}
      >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <h3 className={styles.emptyStateHeading}>No Stats Available</h3>
      <p className={styles.emptyStateText}>There are no statistics to display at the moment.</p>
    </div>
  );

  return (
    <div className={styles.container}>
      <Navbar />
      
      <h1 className={styles.pageTitle}>Dashboard Statistics</h1>
      <p className={styles.dashboardInfo}>
        Overview of key performance metrics and analytics.
      </p>
      
      <div className={styles.cardContainer}>
        {isLoading ? (
          renderLoadingState()
        ) : stats.length > 0 ? (
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                <StatsCard heading={stat.heading} subheading={stat.subheading} />
              </Grid>
            ))}
          </Grid>
        ) : (
          renderEmptyState()
        )}
      </div>
    </div>
  );
}