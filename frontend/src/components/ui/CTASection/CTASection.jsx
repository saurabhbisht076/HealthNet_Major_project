import React, { useEffect, useState } from "react";
import styles from "./CTASection.module.css";
import apiEndpoints from "../../../api";

const StarRating = ({ rating }) => {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={`full-${i}`} className={styles.star} viewBox="0 0 24 24">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className={styles.star} viewBox="0 0 24 24">
          <path d="M12 15.4V6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/>
          <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4z" opacity="0.3"/>
        </svg>
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className={styles.star} viewBox="0 0 24 24">
          <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z" opacity="0.3"/>
        </svg>
      );
    }

    return stars;
  };

  return (
    <div className={styles.ratingContainer} aria-label={`Rating: ${rating} out of 5`}>
      <div className={styles.starWrapper}>{renderStars()}</div>
      <span className={styles.ratingText}>({rating}/5)</span>
    </div>
  );
};

const FeedbackCard = ({ feedback }) => {
  return (
    <div className={styles.feedbackCard}>
      <div className={styles.feedbackHeader}>
        <img 
          src={feedback.image} 
          alt={`${feedback.title}'s profile`} 
          className={styles.profileImage}
        />
        <h3 className={styles.patientName}>{feedback.title}</h3>
      </div>
      <div className={styles.feedbackContent}>
        <div className={styles.reviewText}>"{feedback.review}"</div>
        <StarRating rating={feedback.rating} />
      </div>
    </div>
  );
};

const CTASection = ({
  docId = "8ibJ5278rTRtchdAsqvm7",
  title = "What Our Patients Say",
  cardHeight = "300px"
}) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiEndpoints.docFeedbacks({ docid: docId });
        
        if (!response.data.error && response.data.length > 0) {
          const validFeedbacks = response.data.filter(
            item => item.rating > 0 && item.review?.trim()
          );

          const mappedFeedbacks = validFeedbacks.map((item) => ({
            image: item.profileImage || "/dimage.jpg",
            title: item.patname,
            review: item.review,
            rating: item.rating,
          }));

          setFeedbacks(mappedFeedbacks);
        } else {
          setFeedbacks([]);
        }
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
        setError("Failed to load patient feedbacks");
      } finally {
        setLoading(false);
      }
    };

    if (docId) fetchFeedbacks();
  }, [docId]);

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? feedbacks.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === feedbacks.length - 1 ? 0 : prevIndex + 1
    );
  };

  const visibleFeedbacks = () => {
    if (feedbacks.length === 0) return [];
    
    const result = [];
    // Display 3 cards on desktop, 1 on mobile
    const displayCount = window.innerWidth > 768 ? 3 : 1;
    
    for (let i = 0; i < displayCount; i++) {
      const index = (currentIndex + i) % feedbacks.length;
      result.push(feedbacks[index]);
    }
    
    return result;
  };

  return (
    <section className={styles.ctaSection}>
      <div className={styles.container}>
        <h2 className={styles.sliderTitle}>{title}</h2>
        
        {loading && (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Loading patient feedback...</p>
          </div>
        )}

        {error && (
          <div className={styles.errorState}>
            <svg className={styles.errorIcon} viewBox="0 0 24 24">
              <path d="M11 15h2v2h-2zm0-8h2v6h-2zm1-5C6.47 2 2 6.5 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2zm0 18a8 8 0 0 1-8-8 8 8 0 0 1 8-8 8 8 0 0 1 8 8 8 8 0 0 1-8 8z"/>
            </svg>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && feedbacks.length > 0 && (
          <div className={styles.sliderContainer}>
            <button 
              className={`${styles.navButton} ${styles.prevButton}`}
              onClick={goToPrev}
              aria-label="Previous feedback"
            >
              <svg viewBox="0 0 24 24" className={styles.navIcon}>
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
              </svg>
            </button>
            
            <div className={styles.cardContainer} style={{height: cardHeight}}>
              {visibleFeedbacks().map((feedback, index) => (
                <FeedbackCard key={index} feedback={feedback} />
              ))}
            </div>
            
            <button 
              className={`${styles.navButton} ${styles.nextButton}`}
              onClick={goToNext}
              aria-label="Next feedback"
            >
              <svg viewBox="0 0 24 24" className={styles.navIcon}>
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
              </svg>
            </button>
          </div>
        )}

        {!loading && !error && feedbacks.length === 0 && (
          <div className={styles.emptyState}>
            <svg className={styles.emptyIcon} viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
              <path d="M12 15l1.57-3.43L17 10l-3.43-1.57L12 5l-1.57 3.43L7 10l3.43 1.57z"/>
            </svg>
            <p>No patient feedback available</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CTASection;