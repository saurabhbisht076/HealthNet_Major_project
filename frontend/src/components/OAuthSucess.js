import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function OAuthSuccess() {
  const { setUserType } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const userType = params.get("userType");

    if (accessToken && refreshToken && userType) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      setUserType(userType);
      navigate(`/dashboard/${userType}`);
    } else {
      navigate("/signin");
    }
  }, [location, setUserType, navigate]);

  return null;
}