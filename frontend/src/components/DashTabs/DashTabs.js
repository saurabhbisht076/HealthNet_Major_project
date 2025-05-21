import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import styles from "./DashTabs.module.css";

export default function DashTabs({ tabs }) {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={`${styles.container} ${mounted ? styles.mounted : ''}`}>
      <Grid container spacing={3} className={styles.grid}>
        {tabs.map((tab, index) => (
          <Grid item xs={12} sm={6} md={4} key={index} 
                className={`${styles.gridItem} ${mounted ? styles.visible : ''}`}>
            <Card
              className={styles.card}
              onClick={() => navigate(tab.redirect)}
            >
              <div 
                className={styles.cardImage}
                style={{
                  backgroundImage: `url(${tab.image})`,
                }}
              />
              <CardContent className={styles.cardContent}>
                <Typography variant="h6" className={styles.cardTitle}>
                  {tab.title}
                </Typography>
                {tab.description && (
                  <Typography 
                    variant="body2" 
                    className={styles.cardDescription}
                  >
                    {tab.description}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}