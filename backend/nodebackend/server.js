const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const morgan = require('morgan'); // For logging HTTP requests

// Import routes
const userRoutes = require('./routes/userRoutes');
const reportRoutes = require('./routes/reportRoutes');
const hospitalRoutes = require('./routes/hospitalRoutes');
const doctorRoutes = require('./routes/doctorRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware setup 
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // Log HTTP requests

// Routes setup 
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/doctors', doctorRoutes);

// Start the server 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});