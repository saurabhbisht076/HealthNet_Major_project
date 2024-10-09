const mongoose = require('mongoose');

const medicalReportSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reportData: { type: String, required: true }, // This could be a URL or path to the file
    uploadDate: { type: Date, default: Date.now },
}, {
    timestamps: true
});

module.exports = mongoose.model('MedicalReport', medicalReportSchema);