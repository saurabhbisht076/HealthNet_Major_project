import React, { useState } from "react";
import Header from "../ui/HEADER/header.tsx";
import HeroSection from "../ui/heroSection/heroSection.tsx";
import QuickAccess from "../ui/quickAccessSection/QuickAccessSection.jsx";
import InfoSection from "../ui/infoSections/infoSection.tsx";
import CTASection from "../ui/CTASection/CTASection.jsx";
import Footer from "../ui/footers/footer.jsx";
import styles from "./HomePage.module.css";

const Homepage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Search query:", searchQuery);
  };

  // Define the accessCards array
  const accessCards = [
    {
      icon: "👤",
      title: "Member Services",
      description: "Access your benefits, find forms, and manage your account.",
      link: "#",
      bgColor: "primary-600",
    },
    {
      icon: "❤️",
      title: "Wellness Programs",
      description: "Discover resources to help you live a healthier lifestyle.",
      link: "#",
      bgColor: "primary-500",
    },
    {
      icon: "🏥",
      title: "Find Care",
      description: "Search for doctors, hospitals, and healthcare facilities.",
      link: "#",
      bgColor: "primary-700",
    },
    {
      icon: "📅",
      title: "Appointments",
      description: "Schedule, view, or cancel your upcoming appointments.",
      link: "#",
      bgColor: "primary-600",
    },
    {
      icon: "📋",
      title: "Claims & Coverage",
      description: "Review your claims status and coverage details.",
      link: "#",
      bgColor: "primary-500",
    },
    {
      icon: "💊",
      title: "Pharmacy Services",
      description: "Refill prescriptions and find in-network pharmacies.",
      link: "#",
      bgColor: "primary-700",
    },
  ];

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
    {
      title: "Wellness Programs that Work",
      description: "Take control of your health with our comprehensive wellness programs. We offer personalized guidance and resources to help you achieve your health goals.",
      imageSrc: "https://images.unsplash.com/photo-1521804106135-dfb8c68c2655?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      features: [
        "Health risk assessments",
        "Nutrition and fitness coaching",
        "Chronic condition management",
        "Stress reduction programs",
        "Incentives and rewards"
      ],
      buttonText: "Get Started",
      imagePosition: "right",
      bgColor: "white"
    }
  ];

  return (
    <div className={styles.container}>
      <Header />
      <main>
        <HeroSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearchSubmit={handleSearchSubmit}
        />
        {/* Pass accessCards as a prop to QuickAccess */}
        <QuickAccess accessCards={accessCards} />
        {infoSections.map((section, index) => (
          <InfoSection key={index} {...section} />
        ))}
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Homepage;