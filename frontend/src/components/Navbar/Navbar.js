import React from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Logout } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { useAuth } from "../../AuthContext";
import api from "../../api";
import styles from "./Navbar.module.css";
import FavoriteIcon from '@mui/icons-material/Favorite';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const userName = token ? jwt_decode(token)?.name : null;
  const { setUserType, setLoader, setAlert, setAlertMsg } = useAuth();

  const handleLogOut = async () => {
    try {
      setLoader(true);
      const refreshToken = localStorage.getItem("refreshToken");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      await api.logout({ data: { refreshToken } });
      setLoader(false);
      setUserType(null);
      navigate("/");
    } catch (error) {
      setLoader(false);
      setAlertMsg(error?.response?.data?.error || "An Error Occurred!");
      setAlert(true);
      console.error(error);
    }
  };

  return (
    <div className={styles.appBar}>
      <div className={styles.logoContainer}>
        <FavoriteIcon className={styles.heartIcon} />
        <span className={styles.logoText}>HealthNet</span>
      </div>
      
      <div className={styles.userControls}>
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>VS</div>
          <span className={styles.userName}>{userName || "Vinay Singh"}</span>
        </div>
        <Tooltip title="Exit">
          <IconButton 
            onClick={handleLogOut} 
            className={styles.exitButton}
          >
            <span className={styles.exitText}>Exit</span>
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
}