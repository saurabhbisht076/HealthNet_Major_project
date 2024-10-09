
const express = require('express');
const MedicalReport = require('../models/MedicalReport');
const { create } = require('ipfs-http-client');

const ipfsClient = create({ url: 'https://ipfs.infura.io:5001/api/v0' });
const router = express.Router();

// Upload Medical Report
router.post('/upload', async (req, res) => {
    const { patientId } = req.body;

    try {
        const fileBuffer = req.files.file.data; // Assuming file is sent as FormData

        // Upload file to IPFS
        const result = await ipfsClient.add(fileBuffer);
        
        const reportData = result.path; // Get the IPFS hash
        
        const report = new MedicalReport({ patientId, reportData });
        await report.save();
        
        res.status(201).json({ message: 'Medical report uploaded successfully', report });
    } catch (error) {
        res.status(400).json({ error });
    }
});

// Get Medical Reports for a Patient
router.get('/:patientId', async (req, res) => {
    try {
        const reports = await MedicalReport.find({ patientId: req.params.patientId });
        res.status(200).json(reports);
    } catch (error) {
        res.status(400).json({ error });
    }
});

module.exports = router;

