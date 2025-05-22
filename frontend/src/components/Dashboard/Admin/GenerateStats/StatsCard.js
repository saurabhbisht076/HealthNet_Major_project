import React from "react";
import styles from "./GenerateStats.module.css";

// Import icons directly from react-icons
import { FaUserMd, FaUserCheck, FaUserTie, FaUsers, FaClipboardCheck, FaRupeeSign } from "react-icons/fa";

// Use a slightly darker but still soft color for icons
const iconColor = "#7266d8"
const iconMap = {
  "Most Rated Doctor(s)": <FaUserMd size={26} color={iconColor} />,
  "Verified Staffs": <FaUserTie size={26} color={iconColor} />,
  "Verified Doctors": <FaUserCheck size={26} color={iconColor} />,
  "Registered Patients": <FaUsers size={26} color={iconColor} />,
  "Appointments Fulfilled": <FaClipboardCheck size={26} color={iconColor} />,
  "Total Appointment Fees": <FaRupeeSign size={20} color={iconColor} />
};

const StatsCard = ({
  docName,
  heading,
  subheading,
  type,
  doctors = []
}) => {
  // Pick icon based on subheading or fallback to stats icon
  const getIcon = () => {
    return iconMap[subheading] || <FaUserMd size={28} color={iconColor} />;
  };

  // Generate random trend data (replace with real API data if available)
  const generateTrendData = () => {
    const isPositive = Math.random() > 0.5;
    const percentage = Math.floor(Math.random() * 30) + 1;
    return {
      isPositive,
      percentage
    };
  };

  const trend = generateTrendData();

  // Render list of doctors for "Most Rated Doctor(s)" card
  const renderDoctors = () => {
    if (subheading === "Most Rated Doctor(s)" && doctors && doctors.length > 0) {
      return (
        <div className={styles.doctorsList}>
          {doctors.map((doctor, index) => (
            <div key={index} className={styles.doctorItem}>
              <span className={styles.doctorName}>{doctor.name}</span>
              {doctor.specialty && (
                <span className={styles.doctorSpecialty}>{doctor.specialty}</span>
              )}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`${styles.card} ${subheading === "Most Rated Doctor(s)" ? styles.flexibleCard : ""}`}>
      <div
        className={styles.iconContainer}
        style={{
          position: "absolute",
          top: 28,
          right: 25, // further right, but still inside the card (adjust as needed)
          background: "#f5f4ff",
          borderRadius: "50%",
          padding: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 8px rgba(44,62,80,.04)",
        }}
      >
        {getIcon()}
      </div>
      <div className={styles.cardContent} style={{ paddingRight: 18 }}>
        {docName && (
          <h2 className={`${styles.heading} ${styles.docName}`}>{docName}</h2>
        )}
        <div className={styles.statsInfo}>
          <h3 className={styles.statsHeading}>{heading}</h3>
          <p className={styles.subheading}>{subheading}</p>
        </div>
        {renderDoctors()}
      </div>
      <div className={styles.cardFooter}>
        <div
          className={`${styles.trendIndicator} ${
            trend.isPositive ? styles.trendUp : styles.trendDown
          }`}
        >
          {trend.isPositive ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginRight: "4px" }}
              >
                <line x1="12" y1="19" x2="12" y2="5"></line>
                <polyline points="5 12 12 5 19 12"></polyline>
              </svg>
              {trend.percentage}%
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginRight: "4px" }}
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="19 12 12 19 5 12"></polyline>
              </svg>
              {trend.percentage}%
            </>
          )}
        </div>
        <span style={{ fontSize: "0.75rem", color: "#718096" }}>
          vs. last period
        </span>
      </div>
    </div>
  );
};

export default StatsCard;