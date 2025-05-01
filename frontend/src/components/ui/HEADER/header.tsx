import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./header.module.css";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    document.body.style.overflow = isMobileMenuOpen ? "auto" : "hidden";
  };
  
  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <Link to="/" className={styles.logoLink}>
              <span className={styles.logoText}>HealthNet</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className={styles.desktopNav}>
            <div className={styles.navItem}>
              <button className={styles.navButton}>
                Members 
              </button>
              <div className={styles.dropdown}>
                <Link to="#" className={styles.dropdownItem}>Overview</Link>
                <Link to="#" className={styles.dropdownItem}>Services</Link>
                <Link to="#" className={styles.dropdownItem}>Resources</Link>
                <Link to="#" className={styles.dropdownItem}>Support</Link>
              </div>
            </div>
            <div className={styles.navItem}>
              <button className={styles.navButton}>
                Providers 
              </button>
            </div>
            <div className={styles.navItem}>
              <button className={styles.navButton}>
                Employers 
              </button>
            </div>
            <div className={styles.navItem}>
              <button className={styles.navButton}>
                Brokers 
              </button>
            </div>
            <div className={styles.navItem}>
              <button className={styles.navButton}>
                About Us 
              </button>
            </div>
          </nav>

          <div className={styles.headerActions}>
            <button className={styles.searchButton}>
              <span></span>
            </button>
            {/* Removed Sign In button */}
          </div>

          {/* Mobile Menu Button */}
          <div className={styles.mobileActions}>
            <Link to="/view-location" className={styles.emergencyButtonMobile}>
              <span>⚠️</span>
              <span className={styles.srOnly}>Emergency</span>
            </Link>
            <button className={styles.menuButton} onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? 'X' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
        <div className={styles.mobileMenuContent}>
          <nav className={styles.mobileNav}>
            <Link to="#" className={styles.mobileNavItem}>Members</Link>
            <Link to="#" className={styles.mobileNavItem}>Providers</Link>
            <Link to="#" className={styles.mobileNavItem}>Employers</Link>
            <Link to="#" className={styles.mobileNavItem}>Brokers</Link>
            <Link to="#" className={styles.mobileNavItem}>About Us</Link>
          </nav>
          <div className={styles.mobileMenuActions}>
            {/* Removed Sign In button */}
            {/* Removed Get Started button */}
            <button className={styles.mobileSearchButton}>
              <span>🔍</span>
              Search
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;