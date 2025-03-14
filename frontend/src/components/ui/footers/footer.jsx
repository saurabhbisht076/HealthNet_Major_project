import React from "react";
import { Link } from "react-router-dom";
import styles from "./footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerTop}>
          <div className={styles.footerLogo}>
            <span className={styles.footerLogoText}>HealthNet</span>
            <p className={styles.footerTagline}>Your Health, Our Priority</p>
          </div>
          <div className={styles.footerNavContainer}>
            <div className={styles.footerNavColumn}>
              <h3 className={styles.footerNavTitle}>Members</h3>
              <ul className={styles.footerNavList}>
                <li><Link to="/find-doctor">Find a Doctor</Link></li>
                <li><Link to="/health-plans">Health Plans</Link></li>
                <li><Link to="/wellness-resources">Wellness Resources</Link></li>
                <li><Link to="/member-portal">Member Portal</Link></li>
              </ul>
            </div>
            <div className={styles.footerNavColumn}>
              <h3 className={styles.footerNavTitle}>Providers</h3>
              <ul className={styles.footerNavList}>
                <li><Link to="/provider-portal">Provider Portal</Link></li>
                <li><Link to="/clinical-resources">Clinical Resources</Link></li>
                <li><Link to="/credentialing">Credentialing</Link></li>
                <li><Link to="/provider-directory">Provider Directory</Link></li>
              </ul>
            </div>
            <div className={styles.footerNavColumn}>
              <h3 className={styles.footerNavTitle}>About Us</h3>
              <ul className={styles.footerNavList}>
                <li><Link to="/our-mission">Our Mission</Link></li>
                <li><Link to="/leadership">Leadership</Link></li>
                <li><Link to="/careers">Careers</Link></li>
                <li><Link to="/news-events">News & Events</Link></li>
              </ul>
            </div>
            <div className={styles.footerNavColumn}>
              <h3 className={styles.footerNavTitle}>Support</h3>
              <ul className={styles.footerNavList}>
                <li><Link to="/contact-us">Contact Us</Link></li>
                <li><Link to="/faqs">FAQs</Link></li>
                <li><Link to="/resources">Resources</Link></li>
                <li><Link to="/emergency-services">Emergency Services</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} HealthNet. All rights reserved.
          </p>
          <div className={styles.footerLinks}>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-of-service">Terms of Service</Link>
            <Link to="/accessibility">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;