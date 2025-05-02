import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: String,
        required: true
    },
    expires: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 18000 // 5 hours in seconds
    }
});

// Index for faster queries
tokenSchema.index({ token: 1, userId: 1 });

export default mongoose.model("Token", tokenSchema);