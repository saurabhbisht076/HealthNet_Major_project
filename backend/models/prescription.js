import mongoose from "mongoose";
const prescriptionSchema = new mongoose.Schema({
  aptid: String,
  patid: String,
  docid: String,
  patname: String,
  docname: String,
  date: String,
  pdate: String,
  prescribed: {
    type: Boolean,
    default: false,
  },
  file: {
    data: Buffer,              // Actual file data
    contentType: String,       // MIME type (e.g., 'application/pdf')
    originalname: String       // Original file name
  },
});


export default mongoose.model("Prescription", prescriptionSchema);
