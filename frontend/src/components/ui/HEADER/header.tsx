import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./header.module.css";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Clean up body style when component unmounts
  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

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
              <Link to="/about" className={styles.navButton}>
                About Us
              </Link>
            </div>
          </nav>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
        <div className={styles.mobileMenuContent}>
          <nav className={styles.mobileNav}>
            <Link 
              to="#" 
              className={styles.mobileNavItem}
              onClick={toggleMobileMenu}
            >
              Members
            </Link>
            <Link 
              to="/about" 
              className={styles.mobileNavItem}
              onClick={toggleMobileMenu}
            >
              About Us
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;