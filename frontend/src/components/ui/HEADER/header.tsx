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
                Members <span className={styles.navArrow}>▼</span>
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
                Providers <span className={styles.navArrow}>▼</span>
              </button>
            </div>
            <div className={styles.navItem}>
              <button className={styles.navButton}>
                Employers <span className={styles.navArrow}>▼</span>
              </button>
            </div>
            <div className={styles.navItem}>
              <button className={styles.navButton}>
                Brokers <span className={styles.navArrow}>▼</span>
              </button>
            </div>
            <div className={styles.navItem}>
              <button className={styles.navButton}>
                About Us <span className={styles.navArrow}>▼</span>
              </button>
            </div>
          </nav>

          <div className={styles.headerActions}>
            <Link to="/view-location" className={styles.emergencyButton}>
              <span className={styles.emergencyIcon}>⚠️</span>
              Emergency
            </Link>
            <button className={styles.searchButton}>
              <span>🔍</span>
            </button>
            <Link to="/signin" className={styles.signInButton}>
              <span>👤</span>
              Sign In
            </Link>
            <Link to="/signup" className={styles.getStartedButton}>
              Get Started
            </Link>
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
            <Link to="/signin" className={styles.mobileSignInButton}>
              <span>👤</span>
              Sign In
            </Link>
            <Link to="/signup" className={styles.mobileGetStartedButton}>
              Get Started
            </Link>
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