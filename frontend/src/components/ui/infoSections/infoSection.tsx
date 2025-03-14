import React from "react";
import { Link } from "react-router-dom";
import styles from "./infoSection.module.css";

const InfoSection = ({ title, description, features, buttonText, imageSrc, imagePosition, bgColor }) => {
  return (
    <section className={`${styles.infoSection} ${bgColor === 'gray' ? styles.infoSectionGray : ''}`}>
      <div className={styles.container}>
        <div className={`${styles.infoSectionGrid} ${imagePosition === 'left' ? styles.infoSectionReverse : ''}`}>
          <div className={styles.infoSectionContent}>
            <h2 className={styles.infoSectionTitle}>{title}</h2>
            <p className={styles.infoSectionDescription}>{description}</p>
            {features && (
              <ul className={styles.featuresList}>
                {features.map((feature, idx) => (
                  <li key={idx} className={styles.featureItem}>
                    <span className={styles.featureCheck}>✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            )}
            {buttonText && (
              <Link to="#" className={styles.infoSectionButton}>
                {buttonText} →
              </Link>
            )}
          </div>
          <div className={styles.infoSectionImageContainer}>
            <img src={imageSrc} alt={title} className={styles.infoSectionImage} />
            <div className={styles.accentCircle1}></div>
            <div className={styles.accentCircle2}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;