import React from "react";
import { Link } from "react-router-dom";
import styles from "./CTASection.module.css";

const CTASection = () => { // Renamed from CallToAction to CTASection
  return (
    <section className={styles.ctaSection}>
      <div className={styles.container}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Ready to Experience Better Healthcare?</h2>
          <p className={styles.ctaDescription}>
            Join thousands of members who trust HealthNet for their healthcare needs. Sign up today and take the first step towards a healthier future.
          </p>
          <div className={styles.ctaButtons}>
            <Link to="/signup" className={styles.ctaPrimaryButton}>
              Become a Member
            </Link>
            <Link to="/contact-sales" className={styles.ctaSecondaryButton}>
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection; // Ensure the export matches the component name