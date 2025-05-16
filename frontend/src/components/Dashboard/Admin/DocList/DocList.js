import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import Navbar from "../../../Navbar/Navbar";
import DocListCard from "./DocListCard";
import SelectInput from "../../../SelectInput/SelectInput";
import styles from "./DocList.module.css";
import api from "../../../../api";
import { departments } from "../../Doctor/doctorDepartments";
import { useAuth } from "../../../../AuthContext";

export default function DocList() {
  const { setLoader, setAlert, setAlertMsg } = useAuth();
  const [department, setDepartment] = useState("All Departments");
  const [docs, setDocs] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Add font loading detection
  useEffect(() => {
    document.fonts.ready.then(() => {
      setFontsLoaded(true);
      document.documentElement.classList.add('fonts-loaded');
    });
  }, []);

  useEffect(() => {
    async function fetchDocs() {
      try {
        setLoader(true);
        const res = await api.docList();
        if (res.data.error) {
          setLoader(false);
          setAlertMsg(res.data.errorMsg);
          setAlert(true);
        } else {
          setLoader(false);
          setDocs(res.data);
        }
      } catch (error) {
        setLoader(false);
        setAlertMsg(error?.response?.data?.errorMsg || "An Error Occurred!");
        setAlert(true);
        console.error(error);
      }
    }

    fetchDocs();
  }, [setLoader, setAlert, setAlertMsg]);

  useEffect(() => {
    if (department === "All Departments") {
      setDoctors(docs);
    } else {
      const filteredData = docs.filter((doc) => doc.department === department);
      setDoctors(filteredData);
    }
  }, [department, docs]);

  return (
    <div className={`${styles.container} ${fontsLoaded ? styles.fontsLoaded : ''}`}>
      <Navbar />
      <div className={styles.filterContainer}>
        <SelectInput
          label=""
          value={department}
          setValue={setDepartment}
          options={departments}
        />
      </div>
      <div className={styles.cardContainer}>
        <Grid 
          container 
          spacing={2}
          sx={{
            padding: { xs: '0 16px', sm: '0 24px' },
            margin: '0 auto',
            maxWidth: '1200px',
            width: 'calc(100% - 32px)'
          }}
        >
          {doctors.map((doctor, index) => (
            <Grid 
              key={doctor.uid || index}
              item 
              xs={12} 
              md={6} 
              lg={4}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                padding: '4px !important'
              }}
            >
              <DocListCard doctor={doctor} />
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
}