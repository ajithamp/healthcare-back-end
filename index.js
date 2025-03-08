require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const patientRoutes = require('./src/routes/patient');

const app = express();
const port = process.env.PORT || 9000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/patient', patientRoutes);

// Home route
app.get('/', (req, res) => {
  res.send('Server connected');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
