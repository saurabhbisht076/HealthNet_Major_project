import React, { useEffect, useState } from "react";
import { 
  Alert, 
  Grid, 
  Tabs, 
  Tab, 
  Box, 
  InputBase,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  IconButton,
  Typography,
  Divider
} from "@mui/material";
import { 
  Search, 
  FilterList,
  PendingActions,
  HowToReg,
  Block,
  Refresh,
  SentimentDissatisfied
} from "@mui/icons-material";
import Navbar from "../../../Navbar/Navbar";
import styles from "./VerifyUser.module.css";
import VerificationCard from "./VerificationCard";
import api from "../../../../api";
import { useAuth } from "../../../../AuthContext";

// Created/Updated by: virusvinay
// Last updated: 2025-05-14 14:38:06 UTC

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`user-tabpanel-${index}`}
      aria-labelledby={`user-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default function VerifyUser() {
  const { setLoader, setAlert, setAlertMsg } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [unavailableMsg, setUnavailableMsg] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [departments, setDepartments] = useState([]);
  const [userTypes, setUserTypes] = useState([]);

  useEffect(() => {
    if (document.fonts) {
      document.fonts.ready
        .then(() => {
          setFontsLoaded(true);
          document.documentElement.classList.add("fonts-loaded");
        })
        .catch(() => {
          setTimeout(() => {
            setFontsLoaded(true);
            document.documentElement.classList.add("fonts-loaded");
          }, 500);
        });
    } else {
      setTimeout(() => {
        setFontsLoaded(true);
        document.documentElement.classList.add("fonts-loaded");
      }, 500);
    }
  }, []);

  const filterUsers = (allUsers, tab, query, type, department) => {
    let filtered = [...allUsers];
    
    // Filter by tab (status)
    switch(tab) {
      case 1: // Pending
        filtered = filtered.filter(user => user.status === "pending");
        break;
      case 2: // Verified
        filtered = filtered.filter(user => user.status === "verified");
        break;
      case 3: // Rejected
        filtered = filtered.filter(user => user.status === "rejected");
        break;
      default: // All Users (tab === 0)
        break;
    }
    
    // Filter by search query
    if (query) {
      const lowercaseQuery = query.toLowerCase();
      filtered = filtered.filter(
        user =>
          user.fname?.toLowerCase().includes(lowercaseQuery) ||
          user.lname?.toLowerCase().includes(lowercaseQuery) ||
          user.email?.toLowerCase().includes(lowercaseQuery) ||
          user.userType?.toLowerCase().includes(lowercaseQuery) ||
          user.department?.toLowerCase().includes(lowercaseQuery)
      );
    }
    
    // Filter by user type
    if (type && type !== "all") {
      filtered = filtered.filter(user => user.userType === type);
    }
    
    // Filter by department
    if (department && department !== "all") {
      filtered = filtered.filter(user => user.department === department);
    }
    
    setFilteredUsers(filtered);
  };

  const fetchAllUsers = async () => {
    try {
      setLoader(true);
      const res = await api.unverified();
      
      if (res.data.error) {
        setLoader(false);
        setAlertMsg(res.data.errorMsg);
        setAlert(true);
      } else {
        setLoader(false);
        
        // Ensure each user has a status property
        const userData = res.data.map(user => ({
          ...user,
          status: user.status || "pending" // Default to pending if no status
        }));
        
        setUsers(userData);
        
        const uniqueDepartments = [...new Set(userData
          .filter(user => user.department)
          .map(user => user.department))];
        setDepartments(uniqueDepartments);
        
        const uniqueUserTypes = [...new Set(userData
          .filter(user => user.userType)
          .map(user => user.userType))];
        setUserTypes(uniqueUserTypes);
        
        filterUsers(userData, tabValue, searchQuery, filterType, filterDepartment);
      }
    } catch (error) {
      setLoader(false);
      setAlertMsg(error?.response?.data?.errorMsg || "An Error Occurred!");
      setAlert(true);
      console.error(error);
      if (error.response?.status === 404) {
        setUnavailableMsg("No users available.");
      }
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(() => {
    filterUsers(users, tabValue, searchQuery, filterType, filterDepartment);
  }, [tabValue]);

  const handleUserVerify = async (uid) => {
    try {
      setLoader(true);
      const res = await api.verify({ uid });
      
      if (res.data.error) {
        setLoader(false);
        setAlertMsg(res.data.errorMsg);
        setAlert(true);
      } else {
        setUsers(prevUsers => {
          const updatedUsers = prevUsers.map(user => 
            user.uid === uid ? { ...user, status: "verified" } : user
          );
          filterUsers(updatedUsers, tabValue, searchQuery, filterType, filterDepartment);
          return updatedUsers;
        });
        
        setLoader(false);
        setAlertMsg(res.data.msg || "User verified successfully!");
        setAlert(true);
      }
    } catch (error) {
      setLoader(false);
      setAlertMsg(error?.response?.data?.errorMsg || "An Error Occurred!");
      setAlert(true);
      console.error(error);
    }
  };

  const handleUserReject = async (uid) => {
    try {
      setLoader(true);
      const res = await api.reject({ uid });
      
      if (res.data.error) {
        setLoader(false);
        setAlertMsg(res.data.errorMsg);
        setAlert(true);
      } else {
        setUsers(prevUsers => {
          const updatedUsers = prevUsers.map(user => 
            user.uid === uid ? { ...user, status: "rejected" } : user
          );
          filterUsers(updatedUsers, tabValue, searchQuery, filterType, filterDepartment);
          return updatedUsers;
        });
        
        setLoader(false);
        setAlertMsg(res.data.msg || "User rejected successfully!");
        setAlert(true);
      }
    } catch (error) {
      setLoader(false);
      setAlertMsg(error?.response?.data?.errorMsg || "An Error Occurred!");
      setAlert(true);
      console.error(error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSearchChange = (event) => {
    const newQuery = event.target.value;
    setSearchQuery(newQuery);
    filterUsers(users, tabValue, newQuery, filterType, filterDepartment);
  };

  const handleTypeFilterChange = (event) => {
    const newType = event.target.value;
    setFilterType(newType);
    filterUsers(users, tabValue, searchQuery, newType, filterDepartment);
  };

  const handleDepartmentFilterChange = (event) => {
    const newDepartment = event.target.value;
    setFilterDepartment(newDepartment);
    filterUsers(users, tabValue, searchQuery, filterType, newDepartment);
  };

  const handleRefresh = () => {
    fetchAllUsers();
  };

  const containerClassName = `${styles.container} ${fontsLoaded ? styles.fontsLoaded : ''}`;

  return (
    <div className={containerClassName}>
      <Navbar />
      <div className={styles.cardContainer}>
        <Box className={styles.tabsContainer}>
          <Box sx={{ display: 'flex', alignItems: 'center', padding: '0 16px' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              className={styles.tabList}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ flexGrow: 1 }}
            >
              <Tab 
                icon={<FilterList />} 
                iconPosition="start"
                label="All Users" 
                className={styles.tabItem}
              />
              <Tab 
                icon={<PendingActions />} 
                iconPosition="start"
                label="Pending" 
                className={styles.tabItem}
              />
              <Tab 
                icon={<HowToReg />} 
                iconPosition="start"
                label="Verified" 
                className={styles.tabItem}
              />
              <Tab 
                icon={<Block />} 
                iconPosition="start"
                label="Rejected" 
                className={styles.tabItem}
              />
            </Tabs>
            <IconButton 
              onClick={handleRefresh}
              className={styles.refreshButton}
              size="small"
            >
              <Refresh />
            </IconButton>
          </Box>
          
          <Divider />
          
          <Box className={styles.tabsContent}>
            <div className={styles.searchBar}>
              <Search color="action" sx={{ mr: 1 }} />
              <InputBase
                placeholder="Search users..."
                value={searchQuery}
                onChange={handleSearchChange}
                fullWidth
              />
            </div>
            
            <div className={styles.filterControls}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel id="user-type-filter-label">Position</InputLabel>
                <Select
                  labelId="user-type-filter-label"
                  value={filterType}
                  label="Position"
                  onChange={handleTypeFilterChange}
                >
                  <MenuItem value="all">All Positions</MenuItem>
                  {userTypes.map((type, index) => (
                    <MenuItem key={index} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel id="department-filter-label">Department</InputLabel>
                <Select
                  labelId="department-filter-label"
                  value={filterDepartment}
                  label="Department"
                  onChange={handleDepartmentFilterChange}
                >
                  <MenuItem value="all">All Departments</MenuItem>
                  {departments.map((dept, index) => (
                    <MenuItem key={index} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Typography color="text.secondary" sx={{ ml: 'auto' }}>
                {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
              </Typography>
            </div>
          
            {[0, 1, 2, 3].map((tabIndex) => (
              <TabPanel key={tabIndex} value={tabValue} index={tabIndex}>
                <Grid container spacing={3}>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                      <Grid key={index} item xs={12} sm={6} md={4}>
                        <VerificationCard 
                          user={user} 
                          showStatus={true} 
                          onVerify={handleUserVerify}
                          onReject={handleUserReject}
                          showActions={tabIndex <= 1 && user.status === "pending"}
                        />
                      </Grid>
                    ))
                  ) : (
                    <Box className={styles.emptyState}>
                      <SentimentDissatisfied className={styles.emptyStateIcon} />
                      <Typography variant="body1">
                        {tabIndex === 0 && "No users found with the current filters"}
                        {tabIndex === 1 && "No pending users found"}
                        {tabIndex === 2 && "No verified users found"}
                        {tabIndex === 3 && "No rejected users found"}
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </TabPanel>
            ))}
          </Box>
        </Box>
        
        {unavailableMsg && (
          <Alert icon={false} severity="error">
            {unavailableMsg}
          </Alert>
        )}
      </div>
    </div>
  );
}