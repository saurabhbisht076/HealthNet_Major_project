// Last updated: 2025-05-16 10:58:44 UTC by virusvinay

import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import Navbar from "../../../Navbar/Navbar";
import DocListCard from "./DocListCard";
import styles from "./DocList.module.css";
import api from "../../../../api";
import { departments } from "../../Doctor/doctorDepartments";
import { useAuth } from "../../../../AuthContext";
import SearchIcon from '@mui/icons-material/Search';

export default function DocList() {
  const { setLoader, setAlert, setAlertMsg } = useAuth();
  const [department, setDepartment] = useState("All Departments");
  const [searchQuery, setSearchQuery] = useState("");
  const [docs, setDocs] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [fontsLoaded, setFontsLoaded] = useState(true); // Changed to true by default

  useEffect(() => {
    // Add a class to body when component mounts
    document.body.classList.add('fonts-loaded');
    
    // Check if fonts are actually loaded
    document.fonts.ready.then(() => {
      setFontsLoaded(true);
      document.documentElement.classList.add('fonts-loaded');
    });

    // Cleanup function to remove class when component unmounts
    return () => {
      document.body.classList.remove('fonts-loaded');
      document.documentElement.classList.remove('fonts-loaded');
    };
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
    let filteredDocs = [...docs];
    
    if (department !== "All Departments") {
      filteredDocs = filteredDocs.filter((doc) => doc.department === department);
    }
    
    if (searchQuery) {
      filteredDocs = filteredDocs.filter((doc) => 
        `${doc.fname} ${doc.lname}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.speciality.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setDoctors(filteredDocs);
  }, [department, docs, searchQuery]);

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.searchContainer}>
        <div className={styles.filterBox}>
          <select 
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className={styles.departmentSelect}
          >
            <option value="All Departments">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        <div className={styles.searchBox}>
          <SearchIcon className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search doctors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
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
              sm={6} 
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