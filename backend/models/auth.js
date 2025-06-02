import mongoose from "mongoose";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import Token from "./token.js";
const { ACCESS_SECRET, REFRESH_SECRET } = process.env;

const authSchema = new mongoose.Schema({
  userType: String,
  fname: String,
  lname: String,
  department: {
      type: String,
      required: function () {
          return this.userType === "Doctor";
      },
  },
  speciality: {
      type: String,
      required: function () {
          return this.userType === "Doctor";
      },
  },
  workDays: [String],
  time: String,
  fee: Number,
  email: {
      type: String,
      required: true,
  },
  password: {
      type: String,
      required: false,// Password is not required for OAuth users
  },
  verified: {
      type: Boolean,
      default: function () {
          // Auto-verify admin users
          return this.userType === "Admin" || this.userType === "Patient";
      },
  },
  uid: {
      type: String,
      required: true,
      default: () => nanoid(),
  },
  //new fields for oauth
googleId:{
    type: String,
    unique: true,
    sparse: true, // Allows for unique values while permitting nulls
},
provider: {
    type: String,
    defaule: "local",
},
});
authSchema.methods = {
    // Create Access Token Instance Method
    createAccessToken: async function() {
        try {
            const payload = {
                userType: this.userType,
                uid: this.uid,
                name: `${this.fname} ${this.lname}`,
            };
            return jwt.sign(payload, ACCESS_SECRET, { 
                expiresIn: "15m",
                jwtid: nanoid() // Add a unique token ID
            });
        } catch (error) {
            console.error("Access Token Creation Error:", error);
            throw error;
        }
    },

    // Create Refresh Token Instance Method
    createRefreshToken: async function() {
        try {
            const payload = {
                userType: this.userType,
                uid: this.uid,
                name: `${this.fname} ${this.lname}`,
            };
            
            const refreshToken = jwt.sign(payload, REFRESH_SECRET, {
                expiresIn: "5h",
                jwtid: nanoid() // Add a unique token ID
            });

            // Store token with expiration
            await Token.create({
                token: refreshToken,
                userId: this.uid,
                expires: new Date(Date.now() + 5 * 60 * 60 * 1000) // 5 hours from now
            });

            return refreshToken;
        } catch (error) {
            console.error("Refresh Token Creation Error:", error);
            throw error;
        }
    }
};

export default mongoose.model("Auth", authSchema);