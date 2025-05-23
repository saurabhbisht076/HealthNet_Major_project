import mongoose from "mongoose";

const medicalReportSchema = new mongoose.Schema({
  patid: String,
  docid: String,
  reportType: String,
  uploadDate: { type: Date, default: Date.now },
  file: {
    data: Buffer,
    contentType: String,
    originalname: String,
  },
});

// Prevent OverwriteModelError
export default mongoose.models.MedicalReport ||
  mongoose.model("MedicalReport", medicalReportSchema);