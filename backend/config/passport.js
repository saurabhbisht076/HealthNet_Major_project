// backend/config/passport.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/auth.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL ,
      passReqToCallback: true,
    },
    async (req,accessToken, refreshToken, profile, done) => {
      try {
        let existingUser = await User.findOne({ googleId: profile.id });
        if (!existingUser) {
            const userType = req.session.oauthRole || "Patient"; // Default to Patient if no role is set
            const fname = profile.name?.givenName || profile.displayName.split(" ")[0] || "";
            const lname = profile.name?.familyName || profile.displayName?.split(" ").slice(1).join(" ") || "";
          existingUser = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            provider: "google",
            userType: userType, // Default user type, can be changed later
            password: "google-oauth", // No password for OAuth users
            department: userType === "Doctor" ? (req.session.department || "General") : undefined,
            speciality: userType === "Doctor" ? (req.session.speciality || "General") : undefined,
            department: userType === "Admin" ? (req.session.department || "General") : undefined,
            speciality: userType === "Admin" ? (req.session.speciality || "General") : undefined,
            department: userType === "Staff" ? (req.session.department || "General") : undefined,
            speciality: userType === "Staff" ? (req.session.speciality || "General") : undefined,
          });
        }
       else if (!existingUser.userType) {
      // If userType is missing, set it (optional: you may want to prompt user)
      const userType = req.session.oauthRole || "Patient";
      existingUser.userType = userType;
      await existingUser.save();
       }
        return done(null, existingUser);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Serialize & Deserialize
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => done(null, user));
});
