// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { Grid, Card, CardContent, Typography } from "@mui/material";

// import styles from "./DashTabs.module.css";

// export default function DashTabs({ tabs }) {
//   const navigate = useNavigate();

//   return (
//     <div className={styles.container}>
//       <Grid className={styles.grid} >
//         {tabs.map((tab, index) => (
//           <Grid key={index} >
//             <Card
//               className={styles.card}
//               onClick={()=> navigate(tab.redirect)}
//             >
//               <CardContent>
//                 <br /> <br />
//                 <Typography >
//                   {tab.title}
//                 </Typography>
//                 <br /> <br />
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//     </div>
//   );
// }



import React from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import styles from "./DashTabs.module.css";

export default function DashTabs({ tabs }) {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <Grid container spacing={3} className={styles.grid}>
        {tabs.map((tab, index) => (
          <Grid item key={index} >
            <Card
              className={styles.card}
              onClick={() => navigate(tab.redirect)}
            >
              {/* Image Section (Top 60%) */}
              <div 
                className={styles.cardImage}
                style={{
                  backgroundImage: `url(${tab.image})`,

                }}
              />
              
              {/* Title and Description Section (Bottom 40%) */}
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