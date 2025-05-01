import React, { useState, useEffect } from "react";
import Header from "../ui/HEADER/header.tsx";
import HeroSection from "../ui/heroSection/heroSection.tsx";
import InfoSection from "../ui/infoSections/infoSection.tsx";
import CTASection from "../ui/CTASection/CTASection.jsx";
import Footer from "../ui/footers/footer.jsx";
import SignupModal from "../SignUp/SignupModel.jsx";
//import InteractiveAmbulance from '../../components/ambulance/InteractiveAmbulance';
import { motion } from "framer-motion";
import styles from "./HomePage.module.css";
const EmergencyModal = ({ onClose }) => (
  <div className={styles.modalOverlay} onClick={onClose}>
    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
      <h2>Emergency Services</h2>
      <p>This is a placeholder for your emergency services interface.</p>
      <button onClick={onClose}>Close</button>
    </div>
  </div>
);

// Interactive background component
const InteractiveBackground = () => {
  return (
    <div className={styles.backgroundAnimation}>
      <div className={styles.bgPattern}></div>
      <motion.div
        className={`${styles.backgroundCircle} ${styles.circle1}`}
        animate={{
          x: [0, 30, -20, 0],
          y: [0, 20, 40, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          repeatType: "loop"
        }}
      />
      <motion.div
        className={`${styles.backgroundCircle} ${styles.circle2}`}
        animate={{
          x: [0, -40, 10, 0],
          y: [0, 30, -20, 0],
          rotate: [0, -3, 6, 0]
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          repeatType: "loop"
        }}
      />
      <motion.div
        className={`${styles.backgroundCircle} ${styles.circle3}`}
        animate={{
          x: [0, 20, -30, 0],
          y: [0, -20, 10, 0],
          rotate: [0, 7, -3, 0]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: "loop"
        }}
      />
    </div>
  );
};

const Homepage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Search query:", searchQuery);
  };

  const openSignupModal = () => setShowSignupModal(true);
  const closeSignupModal = () => setShowSignupModal(false);
  const handleEmergency = () => {
    setShowEmergencyModal(true);
    console.log("Emergency action triggered");
  };

  const infoSections = [
    {
      title: "Find the Right Plan for You and Your Family",
      description: "Discover comprehensive healthcare plans designed to meet your specific needs. Our plans offer a wide range of benefits and coverage options at competitive rates.",
      imageSrc: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      features: [
        "Preventive care coverage",
        "Virtual and in-person visits",
        "Prescription drug coverage",
        "Mental health services",
        "Comprehensive wellness programs"
      ],
      buttonText: "Explore Plans",
      imagePosition: "right",
      bgColor: "white"
    },
    {
      title: "Access Care Anywhere, Anytime",
      description: "Get the care you need, when you need it. Our telehealth services allow you to connect with healthcare professionals from the comfort of your home.",
      imageSrc: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=2080&q=80",
      features: [
        "24/7 access to medical professionals",
        "Secure video consultations",
        "Prescription renewals",
        "Follow-up appointments",
        "Specialist referrals"
      ],
      buttonText: "Learn About Telehealth",
      imagePosition: "left",
      bgColor: "gray"
    },
  ];

  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Interactive animated background */}
      <InteractiveBackground />
      
      {/* Transparent header */}
      <div className={styles.headerWrapper}>
        <Header openSignupModal={openSignupModal} />
      </div>
      
      <main className={styles.mainContent}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <HeroSection
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearchSubmit={handleSearchSubmit}
            onSignupClick={openSignupModal}
            onEmergencyClick={handleEmergency}
          />
        </motion.div>

        {/* Scroll indicator for better UX */}
        <motion.div 
          className={styles.scrollIndicator}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        />

        {infoSections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <InfoSection {...section} />
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
        >
          <CTASection />
        </motion.div>
      </main>

      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Footer />
      </motion.footer>

      {showSignupModal && <SignupModal onClose={closeSignupModal} />}
      {showEmergencyModal && <EmergencyModal onClose={() => setShowEmergencyModal(false)} />}

      <motion.div 
        className={styles.floatingActionButton}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5, type: "spring" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={openSignupModal}
      >
        <span className={styles.plusIcon}>+</span>
        <span className={styles.fabTooltip}>Sign you Up</span>
      </motion.div>
    </motion.div>
  );
};

export default Homepage;