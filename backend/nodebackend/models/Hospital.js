const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: Object, required: true },
    facilities: [String],
}, {
    timestamps: true
});

module.exports = mongoose.model('Hospital', hospitalSchema);