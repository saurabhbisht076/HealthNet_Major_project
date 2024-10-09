const express = require('express');
const bcrypt = require('bcrypt'); // For password hashing
const jwt = require('jsonwebtoken'); // For creating tokens
const router = express.Router();
const User = require('../models/User');

// Register User (Patient)
router.post('/register', async (req, res) => {
    const { name, email } = req.body;
    
    try {
        const password = generateOneTimePassword();
        const user = new User({ name, email, password });
        await user.save();

        sendOneTimeCredentials(email, password);
        
        res.status(201).json({ message: 'Patient registered successfully' });
    } catch (error) {
        res.status(400).json({ error });
    }
});

// Login User
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create and send token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Helper functions to generate one-time credentials
function generateOneTimePassword() {
    return Math.random().toString(36).slice(-8);
}

function sendOneTimeCredentials(email, password) {
    console.log(`Sent one-time credentials to ${email}: Password - ${password}`);
}

module.exports = router;