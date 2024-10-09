const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: {type: String, required: true},
    specialty: { type: String, required: true },
    availability: { type: Object,required:true },
}, {
    timestamps: true
});

module.exports = mongoose.model('Doctor', doctorSchema);