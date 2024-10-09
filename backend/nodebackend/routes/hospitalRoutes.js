const express = require('express');
const router = express.Router();
const Hospital = require('../models/Hospital');

// Create a new hospital entry
router.post('/', async (req, res) => {
    const { name, location, facilities } = req.body;

    if (!name || !location) {
        return res.status(400).json({ message: 'Name and location are required' });
    }

    try {
        const hospital = new Hospital({ name, location, facilities });
        await hospital.save();
        res.status(201).json({ message: 'Hospital created successfully', hospital });
    } catch (error) {
        res.status(500).json({ error });
    }
});

// Get all hospitals
router.get('/', async (req, res) => {
    try {
        const hospitals = await Hospital.find();
        res.status(200).json(hospitals);
    } catch (error) {
        res.status(500).json({ error });
    }
});

module.exports = router;