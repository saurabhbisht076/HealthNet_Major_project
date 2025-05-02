import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import styles from "./heroSection.module.css";

const HeroSection = ({
  searchQuery,
  setSearchQuery,
  handleSearchSubmit,
  onSignupClick,
  onEmergencyClick,
}) => {
  const [typedText, setTypedText] = useState("");
  const fullText = "Personalized Healthcare Solutions for Everyone";
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setTypedText((prev) => prev + fullText.charAt(index));
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowCursor(false), 2000);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className={styles.hero}>
      <div className={styles.floatingCircles}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className={styles.circle}></div>
        ))}
      </div>
      
      <div className={styles.heroContainer}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            {typedText}
            <span className={`${styles.cursor} ${showCursor ? styles.blink : ''}`}>|</span>
          </h1>

          <p className={styles.heroDescription}>
            Access quality healthcare services, find doctors, manage your
            benefits, and take control of your health journey with HealthNet.
          </p>

          <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
            <div className={styles.searchInputContainer}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search for doctors, services, or information..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className={styles.searchButton}>
                Search
              </button>
            </div>
          </form>

          <div className={styles.heroButtons}>
            <button className={styles.primaryButton} onClick={onSignupClick}>
              Get Started
            </button>

            <button className={styles.emergencyButton} onClick={onEmergencyClick}>
            <Link to="/view-location" className={styles.emergencyButton}>
               <MapPin className={styles.btnIcon} />
                Emergency
            </Link>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;