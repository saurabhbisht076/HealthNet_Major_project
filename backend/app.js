import "./env.js";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import api from "./routes/index.js";
import hospitalRoutes from "./routes/hospitalRoutes.js";
import session from "express-session";
import passport from "passport";
import "./config/passport.js"; // Ensure passport is configured

const app = express();

const { USER_NAME, PASSWORD } = process.env;
const uri = process.env.MONGO_URI;


mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to DB"))
  .catch((err) => console.log(err));

app.use(express.static("public"));

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-auth-token', 'Authorization']
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || "supersecretkey",
  resave: false,
  saveUninitialized: true,
  cookie:{
    secure: false
  }
}));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "public/index.html");
});

// Use both API routers - fixed the commented out api routes
app.use("/api", api);
app.use("/api", hospitalRoutes); // Added hospital routes
const port = process.env.PORT || 5000;

app.listen(port, function () {
  console.log("Server started on port: ", port);
});