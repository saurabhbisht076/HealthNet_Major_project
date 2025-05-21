import React from "react";
import styles from "./GenerateStats.module.css";

const StatsCard = ({ docName, heading, subheading, icon }) => {
  // This function randomly selects an icon if none is provided
  const getIcon = () => {
    const icons = [
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20V10"></path><path d="M12 20V4"></path><path d="M6 20v-6"></path>
      </svg>,
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path>
      </svg>,
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line>
      </svg>,
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
      </svg>
    ];
    
    const hashCode = str => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
      }
      return Math.abs(hash);
    };
    
    const index = hashCode(heading) % icons.length;
    return icons[index];
  };

  const generateTrendData = () => {
    const isPositive = Math.random() > 0.5;
    const percentage = Math.floor(Math.random() * 30) + 1;
    return {
      isPositive,
      percentage
    };
  };

  const trend = generateTrendData();

  return (
    <div className={styles.card}>
      <div className={styles.iconContainer}>
        {icon || getIcon()}
      </div>
      
      {/* Doc name displayed first with prominent styling */}
      <h2 className={`${styles.heading} ${styles.docName}`}>
        {docName}
      </h2>
      
      {/* Stats information below */}
      <div className={styles.statsInfo}>
        <h3 className={styles.statsHeading}>
          {heading}
        </h3>
        <p className={styles.subheading}>{subheading}</p>
      </div>
      
      <div className={styles.cardFooter}>
        <div className={`${styles.trendIndicator} ${trend.isPositive ? styles.trendUp : styles.trendDown}`}>
          {trend.isPositive ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "4px" }}>
                <line x1="12" y1="19" x2="12" y2="5"></line>
                <polyline points="5 12 12 5 19 12"></polyline>
              </svg>
              {trend.percentage}% 
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "4px" }}>
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="19 12 12 19 5 12"></polyline>
              </svg>
              {trend.percentage}%
            </>
          )}
        </div>
        <span style={{ fontSize: "0.75rem", color: "#718096" }}>vs. last period</span>
      </div>
    </div>
  );
};

export default StatsCard;