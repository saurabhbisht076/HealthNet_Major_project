const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

// Create a new doctor entry
router.post('/', async (req, res) => {
    const { name, specialty } = req.body;

    if (!name || !specialty) {
        return res.status(400).json({ message: 'Name and specialty are required' });
    }

    try {
        const doctor = new Doctor({ name, specialty });
        await doctor.save();
        res.status(201).json({ message: 'Doctor created successfully', doctor });
    } catch (error) {
        res.status(500).json({ error });
    }
});

// Get all doctors
router.get('/', async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ error });
    }
});

module.exports = router;