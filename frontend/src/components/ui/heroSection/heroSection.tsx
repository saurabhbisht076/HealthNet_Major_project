import React from "react";
import { Link } from "react-router-dom";
import styles from "./heroSection.module.css";

const HeroSection = ({ searchQuery, setSearchQuery, handleSearchSubmit }) => {
  return (
    <section className={styles.hero}>
      <div className={styles.heroGradient}></div>
      <div className={styles.heroShape1}></div>
      <div className={styles.heroShape2}></div>

      <div className={styles.heroContainer}>
        <div className={styles.heroContent}>
          <span className={styles.heroBadge}>Your Health, Our Priority</span>
          <h1 className={styles.heroTitle}>Personalized Healthcare Solutions for Everyone</h1>
          <p className={styles.heroDescription}>
            Access quality healthcare services, find doctors, manage your benefits, and take control of your health journey with HealthNet.
          </p>

          {/* Search Form */}
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
            <Link to="/find-doctor" className={styles.primaryButton}>
              Find a Doctor
            </Link>
            <Link to="/health-plans" className={styles.outlineButton}>
              View Health Plans
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;