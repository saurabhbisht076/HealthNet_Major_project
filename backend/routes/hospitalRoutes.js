import express from "express";
import Hospital from "../models/Hospital.js";
import auth from "../middlewares/index.js";  // Import auth middleware

const router = express.Router();

// Get hospitals within a given range - Making auth optional for testing
router.get("/hospital_data", async (req, res) => {  // Updated path from hospitals to hospital_data
  try {
    const { lat, lng, range = 50 } = req.query; // Default range = 50km

    // Validate coordinates
    if (!lat || !lng) {
      return res.status(400).json({ message: "Latitude and Longitude are required" });
    }
    
    // Convert string parameters to numbers and validate
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    const parsedRange = parseFloat(range);
    
    if (isNaN(parsedLat) || isNaN(parsedLng) || isNaN(parsedRange)) {
      return res.status(400).json({ message: "Invalid coordinates or range format" });
    }
    
    // MongoDB expects [longitude, latitude] format for geospatial queries
    const hospitals = await Hospital.find({
      location: {
        $geoWithin: {
          $centerSphere: [[parsedLng, parsedLat], parsedRange / 6378.1],
        },
      },
    });

    res.status(200).json(hospitals);
  } catch (error) {
    console.error("❌ Error fetching hospitals:", error);
    res.status(500).json({ message: "Error fetching hospitals" });
  }
});

// If you need to use auth for production, create a separate endpoint
router.get("/hospital_data/secure", auth, async (req, res) => {  // Updated path from hospitals to hospital_data
  try {
    const { lat, lng, range = 50 } = req.query;

    // Validate coordinates
    if (!lat || !lng) {
      return res.status(400).json({ message: "Latitude and Longitude are required" });
    }
    
    // Convert string parameters to numbers and validate
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    const parsedRange = parseFloat(range);
    
    if (isNaN(parsedLat) || isNaN(parsedLng) || isNaN(parsedRange)) {
      return res.status(400).json({ message: "Invalid coordinates or range format" });
    }

    // MongoDB expects [longitude, latitude] format for geospatial queries
    const hospitals = await Hospital.find({
      location: {
        $geoWithin: {
          $centerSphere: [[parsedLng, parsedLat], parsedRange / 6378.1],
        },
      },
    });

    res.status(200).json(hospitals);
  } catch (error) {
    console.error("❌ Error fetching hospitals:", error);
    res.status(500).json({ message: "Error fetching hospitals" });
  }
});

export default router;