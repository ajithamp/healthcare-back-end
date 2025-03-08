require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const jwt = require('jsonwebtoken');
const User = require("./src/model/user");

const app = express();
const port = process.env.PORT || 9000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Check Home route 
app.get('/home', (req, res) => {
  res.json({"Data": "test health Management App"});
});

// Register User 
app.post('/api/register', async (req, res) => {
  const {name, email, password, role, dob, mobileNumber}  = req.body;
  try {
    const newUser = await User.create({name, email, password, role, dob, mobileNumber});
    res.status(201).json({
      success: true,
      message: 'User created successfully!',
    });
  }catch{
    console.error('Error creating user:', err);
    res.status(500).json({
      success: false,
      message: 'Error creating user. Please try again.',
      error: err.message,
    });
  }

});

// Login User 
app.post('/api/login', async(req, res) => {
  const {email, password} = req.body;
  try{
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid Credential");
    }
    const isValidPassword = await user.isPasswordValid(password);
    if (!isValidPassword) {
      throw new Error("Invalid Credential")
    }
    console.log(process.env.JWT_SECRET);
    const token = jwt.sign({ id: user._id, email: user.email} , process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true});

   res.status(200).json({
      success: true,
      message: 'Login successful',
      role: user.role,
      token
    });
  }catch(err) {
    console.log(err);
  }
});

// Logout User 
app.get('/api/logout', async(req, res) => {
  res.clearCookie('token');  // Assuming token is stored in a cookie
  res.status(200).json({
    success: true,
    message: 'Successfully logged out',
  });
})

// Erro Handling
app.use((err, req, res, next) => {
  console.error(err); 
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
