
import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";
import axios from "axios";
import styles from "./ViewLocation.module.css";

export default function ViewLocation() {
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState("");
  const [directions, setDirections] = useState(null);
  const [range, setRange] = useState(50); // Default range in km
  const [hospitals, setHospitals] = useState([]);
  const [showNearest, setShowNearest] = useState(false);
  const [sortBy, setSortBy] = useState("weighted"); // Default sorting by weighted score
  const [selectedHospital, setSelectedHospital] = useState(null); // Track selected hospital
  const mapRef = useRef(null);
  const hospitalListRef = useRef(null);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  // Fetch user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        () => {
          setError("Unable to retrieve your location.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  // Fetch hospitals from backend
  useEffect(() => {
    if (!userLocation) return;

    const fetchHospitals = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/hospital_data", {
          params: {
            lat: userLocation.lat,
            lng: userLocation.lng,
            range: range,
          },
        });
        
        console.log("Fetched hospitals:", response.data);
        
        // Calculate distance for each hospital and add weighted score
        const hospitalsWithScores = response.data.map(hospital => {
          const distance = haversineDistance(userLocation, hospital);
          const weightedScore = calculateWeightedScore(hospital, distance);
          return {
            ...hospital,
            distance,
            weightedScore
          };
        });
        
        // Sort hospitals based on selected sorting method
        const sortedHospitals = sortHospitals(hospitalsWithScores, sortBy);
        setHospitals(sortedHospitals);
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      }
    };

    fetchHospitals();
  }, [userLocation, range, sortBy]);

  // Initialize selectedHospital when hospitals are loaded
  useEffect(() => {
    if (hospitals.length > 0 && !selectedHospital) {
      setSelectedHospital(hospitals[0]);
    }
  }, [hospitals, selectedHospital]);

  // Find and show shortest path to selected hospital with smooth transitions
  useEffect(() => {
    if (!userLocation || !isLoaded || !mapRef.current || !selectedHospital) return;

    // Only calculate directions if showNearest is true
    if (!showNearest) {
      setDirections(null);
      return;
    }
    
    const selectedLocation = {
      lat: selectedHospital.location.coordinates[1],
      lng: selectedHospital.location.coordinates[0]
    };

    console.log("Calculating directions to selected hospital:", selectedHospital.name);
    console.log("Hospital location:", selectedLocation);
    console.log("User location:", userLocation);

    // First smoothly zoom to fit the route
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(userLocation);
    bounds.extend(selectedLocation);
    
    // Apply smooth zoom animation
    mapRef.current.panToBounds(bounds);
    setTimeout(() => {
      mapRef.current.fitBounds(bounds, {
        padding: { top: 50, right: 50, bottom: 50, left: 50 }
      });
    }, 300);

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: userLocation,
        destination: selectedLocation,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          console.log("Directions found successfully");
          setDirections(result);
        } else {
          console.error("Directions request failed:", status);
          setDirections(null);
        }
      }
    );
  }, [userLocation, selectedHospital, showNearest, isLoaded]);

  // Calculate weighted score based on criteria
  // facilitiesScore (40%), doctorsAvailability (25%), distance (20%), rating (15%)
  function calculateWeightedScore(hospital, distance) {
    // Normalize distance score (closer is better)
    // Assuming max reasonable distance is 50km
    const maxDistance = 50;
    const normalizedDistance = Math.max(0, 1 - distance / maxDistance);
    
    // Calculate weighted score
    const score = (
      (hospital.facilitiesScore / 5) * 0.4 +  // facilitiesScore (normalized to 0-1 range) * 40%
      hospital.doctorsAvailability * 0.25 +   // doctorsAvailability * 25%
      normalizedDistance * 0.2 +              // normalized distance * 20%
      (hospital.rating / 5) * 0.15            // rating (normalized to 0-1 range) * 15%
    );
    
    return score;
  }

  // Sort hospitals based on selected method
  function sortHospitals(hospitals, method) {
    switch(method) {
      case "distance":
        return [...hospitals].sort((a, b) => a.distance - b.distance);
      case "rating":
        return [...hospitals].sort((a, b) => b.rating - a.rating);
      case "facilities":
        return [...hospitals].sort((a, b) => b.facilitiesScore - a.facilitiesScore);
      case "doctors":
        return [...hospitals].sort((a, b) => b.doctorsAvailability - a.doctorsAvailability);
      case "weighted":
      default:
        return [...hospitals].sort((a, b) => b.weightedScore - a.weightedScore);
    }
  }

  // Utility: Haversine Distance Calculation
  function haversineDistance(coord1, hospital) {
    const toRad = (angle) => (angle * Math.PI) / 180;
    const R = 6371; // Earth's radius in km

    const lat2 = hospital.location.coordinates[1];
    const lng2 = hospital.location.coordinates[0];

    const dLat = toRad(lat2 - coord1.lat);
    const dLng = toRad(lng2 - coord1.lng);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(coord1.lat)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  // Get marker color based on weighted score
  function getMarkerColor(score) {
    if (score >= 0.8) return "green";
    if (score >= 0.6) return "blue";
    if (score >= 0.4) return "orange";
    return "red";
  }

  // Function to handle map load and store the map reference
  const onMapLoad = (map) => {
    mapRef.current = map;
  };

  // Handle range input change
  const handleRangeChange = (e) => {
    // Remove leading zeros and parse as number
    let value = e.target.value.replace(/^0+/, '');
    // If empty, set to 0
    if (value === '') value = '0';
    setRange(Number(value));
  };

  // Handle hospital selection with smooth transition effect
  const handleHospitalSelect = (hospital) => {
    // Set the selected hospital
    setSelectedHospital(hospital);
    
    // Scroll into view the hospital in the list
    if (hospitalListRef.current) {
      const listItems = hospitalListRef.current.querySelectorAll(`.${styles.hospitalItem}`);
      const index = hospitals.findIndex(h => h._id === hospital._id);
      
      if (index >= 0 && listItems[index]) {
        listItems[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
    
    // If we're not showing the nearest route, center the map on the selected hospital
    if (!showNearest && mapRef.current) {
      const selectedLocation = {
        lat: hospital.location.coordinates[1],
        lng: hospital.location.coordinates[0]
      };
      
      mapRef.current.panTo(selectedLocation);
      setTimeout(() => {
        mapRef.current.setZoom(15); // Zoom in slightly
      }, 300);
    }
  };

  // Toggle button for showing best route or all hospitals
  const toggleShowNearest = () => {
    setShowNearest(!showNearest);
    
    // If toggling to show nearest and we have a selected hospital,
    // we need to ensure directions are calculated
    if (!showNearest && selectedHospital && mapRef.current) {
      const selectedLocation = {
        lat: selectedHospital.location.coordinates[1],
        lng: selectedHospital.location.coordinates[0]
      };
      
      // Create bounds to fit both points
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(userLocation);
      bounds.extend(selectedLocation);
      
      // Apply smooth zoom animation
      mapRef.current.panToBounds(bounds);
      setTimeout(() => {
        mapRef.current.fitBounds(bounds, {
          padding: { top: 50, right: 50, bottom: 50, left: 50 }
        });
      }, 300);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.navbar}>
        <h1>View Location</h1>
      </header>
      <div className={styles.controls}>
        <label>
          Range (km):{" "}
          <input
            type="number"
            value={range}
            onChange={handleRangeChange}
            min="0"
            className={styles.rangeInput}
          />
        </label>
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          className={styles.sortSelect}
        >
          <option value="weighted">Sort by Weighted Score</option>
          <option value="distance">Sort by Distance</option>
          <option value="rating">Sort by Rating</option>
          <option value="facilities">Sort by Facilities</option>
          <option value="doctors">Sort by Doctor Availability</option>
        </select>
        <button 
          onClick={toggleShowNearest}
          className={showNearest ? styles.activeButton : ''}
        >
          {showNearest ? "Show All Hospitals" : "Show Best Hospital Route"}
        </button>
      </div>
      <div className={styles.content}>
        {error ? (
          <p className={styles.error}>{error}</p>
        ) : !userLocation ? (
          <p>Fetching your location...</p>
        ) : (
          isLoaded && (
            <div className={styles.mapSection}>
              <GoogleMap
                center={userLocation}
                zoom={12}
                mapContainerClassName={styles.mapContainer}
                options={{
                  fullscreenControl: true,
                  mapTypeControl: true,
                  streetViewControl: true,
                  zoomControl: true,
                }}
                onLoad={onMapLoad}
              >
                {/* User Location Marker */}
                <Marker 
                  position={userLocation} 
                  icon={{
                    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                    scaledSize: isLoaded ? new window.google.maps.Size(40, 40) : null
                  }}
                  title="Your Location"
                />
                
                {/* Hospital Markers - only show if not showing directions */}
                {!showNearest &&
                  hospitals.map((hospital) => (
                    <Marker
                      key={hospital._id}
                      position={{
                        lat: hospital.location.coordinates[1],
                        lng: hospital.location.coordinates[0],
                      }}
                      icon={{
                        url: `http://maps.google.com/mapfiles/ms/icons/${
                          selectedHospital && selectedHospital._id === hospital._id
                            ? "purple" // Highlight selected hospital
                            : getMarkerColor(hospital.weightedScore)
                        }-dot.png`,
                        scaledSize: isLoaded ? new window.google.maps.Size(
                          selectedHospital && selectedHospital._id === hospital._id ? 35 : 30, 
                          selectedHospital && selectedHospital._id === hospital._id ? 35 : 30
                        ) : null
                      }}
                      title={hospital.name}
                      onClick={() => handleHospitalSelect(hospital)}
                    />
                  ))}
                
                {/* Direction renderer for selected hospital route */}
                {directions && <DirectionsRenderer directions={directions} />}
              </GoogleMap>
              
              <div className={styles.hospitalList} ref={hospitalListRef}>
                <h3>Hospitals {sortBy === "weighted" ? "(Sorted by Best Match)" : ""}</h3>
                {selectedHospital && (
                  <div className={styles.bestHospital}>
                    <h4>Best Hospital Based on Your Criteria:</h4>
                    <div className={`${styles.hospitalItem} ${styles.selectedHospital}`}>
                      <div className={styles.hospitalName}>{selectedHospital.name}</div>
                      <div className={styles.hospitalDetails}>
                        <span>Rating: {selectedHospital.rating}/5</span>
                        <span>Facilities: {selectedHospital.facilitiesScore}/5</span>
                        <span>Doctors: {(selectedHospital.doctorsAvailability * 100).toFixed(0)}%</span>
                        <span>Distance: {selectedHospital.distance.toFixed(1)} km</span>
                        <span className={styles.hospitalScore}>
                          Score: {(selectedHospital.weightedScore * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <ul>
                  {hospitals.map((hospital) => (
                    <li 
                      key={hospital._id} 
                      className={`${styles.hospitalItem} ${selectedHospital && selectedHospital._id === hospital._id 
                        ? styles.selectedItem : ''}`}
                      onClick={() => handleHospitalSelect(hospital)}
                    >
                      <div className={styles.hospitalName}>{hospital.name}</div>
                      <div className={styles.hospitalDetails}>
                        <span>Rating: {hospital.rating}/5</span>
                        <span>Facilities: {hospital.facilitiesScore}/5</span>
                        <span>Doctors: {(hospital.doctorsAvailability * 100).toFixed(0)}%</span>
                        <span>Distance: {hospital.distance.toFixed(1)} km</span>
                        <span className={styles.hospitalScore}>
                          Score: {(hospital.weightedScore * 100).toFixed(1)}%
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}











































