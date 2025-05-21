import React from 'react';

const AboutUs = () => {
  const styles = {
    aboutContainer: {
      background: 'linear-gradient(135deg, #f8fbfe 0%, #e3f2fd 100%)',
      minHeight: '100vh',
      padding: '4rem 2rem',
      color: '#2d3748'
    },
    h1: {
      color: '#1385d1',
      fontSize: '2.8rem',
      textAlign: 'center',
      marginBottom: '2.5rem',
      textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
      fontWeight: '600',
      textDecoration: 'none',
      letterSpacing: '1px'
    },
    content: {
      maxWidth: '800px',
      margin: '0 auto',
      background: 'white',
      padding: '2.5rem',
      borderRadius: '15px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      lineHeight: '1.8',
      fontSize: '1.1rem'
    },
    paragraph: {
      marginBottom: '1.5rem',
      color: '#4a5568'
    },
    firstParagraph: {
      marginBottom: '1.5rem',
      color: '#2d3748',
      fontWeight: '500',
      fontSize: '1.25rem',
      lineHeight: '1.9'
    },
    highlight: {
      color: '#1385d1',
      fontWeight: '500'
    }
  };

  return (
    <div style={styles.aboutContainer}>
      <h1 style={styles.h1}>About HealthNet</h1>
      <div style={styles.content}>
        <p style={styles.firstParagraph}>
          Welcome to HealthNet — where <span style={styles.highlight}>innovation meets emergency care</span>. We're revolutionizing how people access critical healthcare services when seconds make all the difference.
        </p>
        
        <p style={styles.paragraph}>
          Our exceptional team comprises four visionary developers with a shared mission: transforming emergency healthcare accessibility through cutting-edge technology. Saurabh Bisht and Saurabh Gauni power our robust backend infrastructure, while Vinay Singh Bisht and Saurabh Tamta craft our intuitive, responsive user interface. Together, we're building bridges between patients and life-saving medical assistance.
        </p>
        
        <p style={styles.paragraph}>
          HealthNet harnesses the power of real-time data, precise geolocation services, and sophisticated algorithms to guide you to the optimal medical facility during emergencies. Our platform instantly analyzes your situation and location to recommend the most appropriate healthcare providers — whether you're facing a sudden illness, accident, or any health crisis.
        </p>
        
        <p style={styles.paragraph}>
          We deeply believe that technology holds the key to saving lives in critical moments. Our combined expertise in software development creates a seamless, reliable experience when you need it most. With HealthNet, you're never alone in a medical emergency — you're empowered with the right information at exactly the right time.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;