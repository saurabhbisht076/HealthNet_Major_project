import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./QuickAcessSection.module.css";

const QuickAccess = ({ accessCards }) => {
  const scrollContainerRef = useRef(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftScroll(scrollLeft > 0);
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      const currentScroll = scrollContainerRef.current.scrollLeft;
      scrollContainerRef.current.scrollTo({
        left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', checkScrollPosition);
      return () => {
        scrollContainer.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
      };
    }
  }, []);

  return (
    <section className={styles.quickAccess}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>Quick Access</span>
          <h2 className={styles.sectionTitle}>What Can We Help You With Today?</h2>
          <p className={styles.sectionDescription}>
            Explore our services and resources designed to provide you with the best healthcare experience.
          </p>
        </div>

        <div className={styles.cardsContainer}>
          {showLeftScroll && (
            <button onClick={() => scroll('left')} className={`${styles.scrollButton} ${styles.scrollButtonLeft}`}>
              ◀
            </button>
          )}

          <div ref={scrollContainerRef} className={styles.cardsScroll}>
            {accessCards.map((card, index) => (
              <div key={index} className={styles.cardWrapper}>
                <div className={`${styles.card} ${styles[`cardBg${card.bgColor}`]}`}>
                  <div className={styles.cardIcon}>{card.icon}</div>
                  <h3 className={styles.cardTitle}>{card.title}</h3>
                  <p className={styles.cardDescription}>{card.description}</p>
                  <Link to={card.link} className={styles.cardLink}>
                    Learn More →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {showRightScroll && (
            <button onClick={() => scroll('right')} className={`${styles.scrollButton} ${styles.scrollButtonRight}`}>
              ▶
            </button>
          )}
        </div>

        <div className={styles.viewAllContainer}>
          <Link to="#" className={styles.viewAllLink}>
            View All Services →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default QuickAccess;