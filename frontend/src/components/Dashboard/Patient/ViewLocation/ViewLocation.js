import React, { useState, useEffect, useRef, useCallback } from "react";
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";
import apiEndpoints from "../../../../api"; // Using your API service instead of direct axios call

import styles from "./ViewLocation.module.css";

export default function ViewLocation() {
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState("");
  const [directions, setDirections] = useState(null);
  const [range, setRange] = useState(50); // Default range in km
  const [hospitals, setHospitals] = useState([]);
  const [showNearest, setShowNearest] = useState(false);
  const [sortBy, setSortBy] = useState("weighted"); // Default sorting by weighted score
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);
  
  // Make sure you have the API key in your .env file
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  // Function to zoom to fit all markers (hospitals + user location)
  const zoomToFitAllMarkers = useCallback((hospitalsArray) => {
    if (!mapRef.current || !userLocation || !window.google || hospitalsArray.length === 0) return;

    try {
      const bounds = new window.google.maps.LatLngBounds();

      // Add user location to bounds
      bounds.extend(userLocation);

      // Add all hospital locations to bounds
      hospitalsArray.forEach(hospital => {
        if (hospital.location && Array.isArray(hospital.location.coordinates) && hospital.location.coordinates.length === 2) {
          const hospitalPos = {
            lat: hospital.location.coordinates[1],
            lng: hospital.location.coordinates[0]
          };
          bounds.extend(hospitalPos);
        }
      });

      // Check if bounds has any points before applying
      if (bounds.isEmpty()) {
        console.warn("No valid locations to fit bounds");
        return;
      }

      // Apply smooth transition
      mapRef.current.panTo(bounds.getCenter());
      setTimeout(() => {
        mapRef.current.fitBounds(bounds, {
          padding: { top: 50, right: 50, bottom: 50, left: 50 }
        });
      }, 200);
    } catch (error) {
      console.error("Error in zoomToFitAllMarkers:", error);
    }
  }, [mapRef, userLocation]);

  // Function to smoothly zoom to fit a route between two points
  const smoothZoomToFitRoute = useCallback((origin, destination) => {
    if (!mapRef.current || !window.google) return;

    try {
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(origin);
      bounds.extend(destination);

      // First pan to the center of the bounds
      mapRef.current.panTo(bounds.getCenter());

      // Then smoothly zoom to fit the bounds
      setTimeout(() => {
        mapRef.current.fitBounds(bounds, {
          padding: { top: 100, right: 100, bottom: 100, left: 100 }
        });
      }, 200);
    } catch (error) {
      console.error("Error in smoothZoomToFitRoute:", error);
    }
  }, [mapRef]);

  // Fetch user's location
  useEffect(() => {
    console.log("Trying to get user location...");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("User location obtained:", position.coords);
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (err) => {
          console.error("Geolocation error:", err);
          setError(`Unable to retrieve your location: ${err.message}`);
        },
        { 
          enableHighAccuracy: true, 
          timeout: 10000, 
          maximumAge: 0 
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  // Fetch hospitals from backend
  useEffect(() => {
    if (!userLocation) {
      console.log("No user location yet, waiting...");
      return;
    }

    const fetchHospitals = async () => {
      try {
        console.log("Fetching hospitals with params:", {
          lat: userLocation.lat,
          lng: userLocation.lng,
          range: range,
        });
        
        // Using the API service instead of direct axios call
        const response = await apiEndpoints.getHospitals({
          lat: userLocation.lat,
          lng: userLocation.lng,
          range: range,
        });

        console.log("Fetched hospitals:", response.data);

        if (!response.data || response.data.length === 0) {
          console.log("No hospitals found in the specified range");
          setHospitals([]);
          return;
        }

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

        // Reset selected hospital when hospitals change
        setSelectedHospital(null);

        // If the map is loaded, adjust the view to show all hospitals
        if (mapRef.current && !showNearest && mapLoaded) {
          zoomToFitAllMarkers(sortedHospitals);
        }
      } catch (error) {
        console.error("Error fetching hospitals:", error);
        setError(`Error fetching hospitals: ${error.message}`);
      }
    };

    fetchHospitals();
  }, [userLocation, range, sortBy, zoomToFitAllMarkers, showNearest, mapRef, mapLoaded]);

  // Calculate directions when a hospital is selected or when showNearest changes
  useEffect(() => {
    if (!userLocation || !isLoaded || !mapRef.current || !window.google) return;

    console.log("Calculating directions, showNearest:", showNearest, "selectedHospital:", selectedHospital ? selectedHospital.name : "none");

    // Clear existing directions if not showing any routes
    if (!showNearest && !selectedHospital) {
      setDirections(null);
      // If we're not showing directions, zoom to fit all markers
      if (hospitals.length > 0) {
        zoomToFitAllMarkers(hospitals);
      }
      return;
    }

    // Determine which hospital to show directions for
    let targetHospital;

    if (selectedHospital) {
      // If a hospital is explicitly selected, use it
      targetHospital = selectedHospital;
    } else if (showNearest && hospitals.length > 0) {
      // If showing nearest and no hospital is selected, use the best match
      const hospitalsInRange = hospitals.filter(h => h.distance <= range);
      if (hospitalsInRange.length === 0) {
        setDirections(null);
        return;
      }
      targetHospital = hospitalsInRange[0];
    } else {
      // No hospital to show directions for
      setDirections(null);
      return;
    }

    // Get hospital location
    const hospitalLocation = {
      lat: targetHospital.location.coordinates[1],
      lng: targetHospital.location.coordinates[0]
    };

    console.log(`Calculating directions to ${targetHospital.name}:`, hospitalLocation);
    console.log("User location:", userLocation);

    // First smoothly zoom to fit the route
    smoothZoomToFitRoute(userLocation, hospitalLocation);

    // Calculate directions
    try {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: userLocation,
          destination: hospitalLocation,
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
    } catch (error) {
      console.error("Error calculating directions:", error);
    }
  }, [userLocation, selectedHospital, showNearest, hospitals, range, isLoaded, smoothZoomToFitRoute, zoomToFitAllMarkers]);

  // Handle hospital selection
  const handleHospitalSelect = (hospital) => {
    console.log("Hospital selected:", hospital.name);
    setSelectedHospital(hospital);
    // Automatically switch to showing route when a hospital is selected
    setShowNearest(true);
  };

  // Toggle between showing all hospitals or best route
  const toggleShowNearest = () => {
    const newShowNearest = !showNearest;
    console.log("Toggling show nearest:", newShowNearest);
    setShowNearest(newShowNearest);

    // Reset selected hospital when toggling off routes
    if (!newShowNearest) {
      setSelectedHospital(null);
    }
  };

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
    switch (method) {
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
    try {
      const toRad = (angle) => (angle * Math.PI) / 180;
      const R = 6371; // Earth's radius in km

      if (!hospital.location || !Array.isArray(hospital.location.coordinates) || hospital.location.coordinates.length !== 2) {
        console.error("Invalid hospital location:", hospital);
        return 99999; // Return a large distance for invalid locations
      }

      const lat2 = hospital.location.coordinates[1];
      const lng2 = hospital.location.coordinates[0];

      if (isNaN(lat2) || isNaN(lng2)) {
        console.error("Invalid coordinates:", lat2, lng2);
        return 99999;
      }

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
    } catch (error) {
      console.error("Error calculating distance:", error);
      return 99999;
    }
  }

  // Create a custom green location marker icon for hospitals
  const hospitalMarkerIcon = isLoaded ? {
    url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="30" height="40">
        <path fill="#2ecc40" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/>
      </svg>
    `),
    scaledSize: new window.google.maps.Size(30, 40),
    anchor: new window.google.maps.Point(15, 40), // Anchor at the bottom tip of the pin
    labelOrigin: new window.google.maps.Point(15, 12), // Position for the label
  } : null;

  // Selected hospital marker icon (slightly larger)
  const selectedHospitalMarkerIcon = isLoaded ? {
    url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="36" height="48">
        <path fill="#2ecc40" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/>
      </svg>
    `),
    scaledSize: new window.google.maps.Size(36, 48),
    anchor: new window.google.maps.Point(18, 48),
    labelOrigin: new window.google.maps.Point(18, 12),
  } : null;

  // Function to handle map load and store the map reference
  const onMapLoad = (map) => {
    console.log("Map loaded");
    mapRef.current = map;
    setMapLoaded(true);
    // Initial zoom to fit all markers if we have user location and hospitals
    if (userLocation && hospitals.length > 0) {
      zoomToFitAllMarkers(hospitals);
    }
  };

  // Handle range input change
  const handleRangeChange = (e) => {
    // Remove leading zeros and parse as number
    let value = e.target.value.replace(/^0+/, '');
    // If empty, set to 0
    if (value === '') value = '0';
    setRange(Number(value));
  };

  // If there's a Google Maps API loading error
  if (loadError) {
    return <div className={styles.error}>Error loading Google Maps: {loadError.message}</div>;
  }

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
          <p>Fetching your location... Please ensure location services are enabled in your browser.</p>
        ) : !isLoaded ? (
          <p>Loading Google Maps...</p>
        ) : (
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
                gestureHandling: "cooperative" // Improves zooming interaction
              }}
              onLoad={onMapLoad}
            >
              {/* User Location Marker */}
              {userLocation && (
                <Marker
                  position={userLocation}
                  icon={{
                    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                    scaledSize: new window.google.maps.Size(40, 40)
                  }}
                  title="Your Location"
                />
              )}

              {/* Hospital Markers - only show if not showing directions */}
              {!showNearest &&
                hospitals.map((hospital, index) => (
                  <Marker
                    key={index}
                    position={{
                      lat: hospital.location.coordinates[1],
                      lng: hospital.location.coordinates[0],
                    }}
                    icon={selectedHospital && selectedHospital._id === hospital._id ?
                      selectedHospitalMarkerIcon : hospitalMarkerIcon}
                    title={hospital.name}
                    onClick={() => handleHospitalSelect(hospital)}
                    options={{
                      optimized: false // To ensure hover tooltips appear properly
                    }}
                  />
                ))}

              {/* Direction renderer for hospital route */}
              {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>

            <div className={styles.hospitalList}>
              <h3>Hospitals {sortBy === "weighted" ? "(Sorted by Best Match)" : ""}</h3>
              
              {hospitals.length === 0 && (
                <p>No hospitals found within the selected range. Try increasing the range.</p>
              )}
              
              {showNearest && hospitals.length > 0 && !selectedHospital && (
                <div className={styles.bestHospital}>
                  <h4>Best Hospital Based on Your Criteria:</h4>
                  <div className={`${styles.hospitalItem} ${styles.bestMatch}`}>
                    <div className={styles.hospitalName}>{hospitals[0].name}</div>
                    <div className={styles.hospitalDetails}>
                      <span>Rating: {hospitals[0].rating}/5</span>
                      <span>Facilities: {hospitals[0].facilitiesScore}/5</span>
                      <span>Doctors: {(hospitals[0].doctorsAvailability * 100).toFixed(0)}%</span>
                      <span>Distance: {hospitals[0].distance.toFixed(1)} km</span>
                      <span className={styles.hospitalScore}>
                        Score: {(hospitals[0].weightedScore * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {showNearest && selectedHospital && (
                <div className={styles.bestHospital}>
                  <h4>Selected Hospital:</h4>
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
                {hospitals.slice(0, 10).map((hospital, index) => (
                  <li
                    key={index}
                    className={`${styles.hospitalItem} ${
                      selectedHospital && selectedHospital._id === hospital._id ? styles.activeHospital : ''
                    }`}
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
        )}
      </div>
    </div>
  );
}