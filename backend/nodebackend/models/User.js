const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['patient', 'doctor', 'hospital'], default: 'patient' },
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);