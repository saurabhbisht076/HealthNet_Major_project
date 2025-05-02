import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import auth from "../models/auth.js";
import token from "../models/token.js";

const saltRounds = 10;
const { ACCESS_SECRET, REFRESH_SECRET } = process.env;

// ---------------------> SignUp <-------------------------------

const signup = async (req, res) => {
  try {
      const foundEmail = await auth.findOne({ email: req.body.email });

      if (foundEmail) {
          return res.status(400).json({
              error: true,
              errorMsg: "That email is already registered!",
          });
      }

      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

      // Create the user with automatic verification for admin
      const newUser = await auth.create({
          ...req.body,
          password: hashedPassword,
          verified: req.body.userType === "Admin" // Ensure admin is verified on creation
      });

      return res.status(201).json({ 
          error: false, 
          msg: "Signup Successful!",
          // Return additional info for testing
          userType: newUser.userType,
          verified: newUser.verified
      });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ 
          error: true, 
          errorMsg: "Internal Server Error!",
          details: error.message 
      });
  }
};
// ---------------------> SignIn <-------------------------------

const signin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const foundUser = await auth.findOne({ email: email });

    if (!foundUser) {
      return res
        .status(404)
        .json({ error: true, errorMsg: "Email not registered." });
    }

    if (!foundUser.verified) {
      return res.status(400).json({
        error: true,
        errorMsg:
          "This email is not verified by the Admin. Please login after the verification process is completed.",
      });
    }

    const result = await bcrypt.compare(password, foundUser.password);

    if (result === true) {
      const accessToken = await foundUser.createAccessToken(foundUser);
      const refreshToken = await foundUser.createRefreshToken(foundUser);
      return res.status(201).json({
        error: false,
        userType: foundUser.userType,
        accessToken,
        refreshToken,
      });
    } else {
      return res
        .status(400)
        .json({ error: true, errorMsg: "Incorrect Password!" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

// ---------------------> Refresh Token <-------------------------------
const generateRefreshToken = async (req, res) => {
  try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
          return res.status(403).json({ 
              error: true, 
              errorMsg: "Access denied, token missing!" 
          });
      }

      // Find token in database
      const storedToken = await token.findOne({ token: refreshToken });

      if (!storedToken) {
          return res.status(401).json({ 
              error: true, 
              errorMsg: "Token not found or expired!" 
          });
      }

      // Verify token hasn't expired in database
      if (storedToken.expires <= new Date()) {
          await token.deleteOne({ _id: storedToken._id });
          return res.status(401).json({ 
              error: true, 
              errorMsg: "Token expired!" 
          });
      }

      try {
          // Verify JWT
          const payload = jwt.verify(refreshToken, REFRESH_SECRET);

          // Find user
          const user = await auth.findOne({ uid: payload.uid });
          if (!user) {
              throw new Error("User not found");
          }

          // Generate new access token
          const accessToken = await user.createAccessToken();

          return res.status(200).json({
              error: false,
              accessToken,
              message: "Token refreshed successfully"
          });

      } catch (verifyError) {
          // Clean up invalid token
          await token.deleteOne({ _id: storedToken._id });
          return res.status(401).json({ 
              error: true, 
              errorMsg: "Invalid token!" 
          });
      }
  } catch (error) {
      console.error("Refresh Token Error:", error);
      return res.status(500).json({ 
          error: true, 
          errorMsg: "Internal Server Error!" 
      });
  }
};
// ---------------------> LogOut <-------------------------------

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    await token.findOneAndDelete({ token: refreshToken });
    return res
      .status(200)
      .json({ error: false, msg: "Logged Out successfully!" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

// Exports

export { signup, signin, generateRefreshToken, logout };
