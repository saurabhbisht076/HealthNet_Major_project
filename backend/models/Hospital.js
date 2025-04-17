
import mongoose from "mongoose";

const HospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: {
    type: { type: String, enum: ["Point"], required: true, default: "Point" },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  // NEW FIELDS FOR RATING SYSTEM
  facilitiesScore: { 
    type: Number, 
    min: 0,
    max: 5,
    default: 4.0  // Default value if not provided
  },
  doctorsAvailability: { 
    type: Number, 
    min: 0,
    max: 1,
    default: 0.8   // 0.8 = 80% availability
  },
  rating: { 
    type: Number, 
    min: 0,
    max: 5,
    default: 4.0 
  }
});
// Create a geospatial index
HospitalSchema.index({ location: "2dsphere" });

const Hospital = mongoose.model("Hospital", HospitalSchema);

export default Hospital;


