const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the schema for the user
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true,
  },
  password: {
    type: String,
    required: true, 
  },
  mobileNumber: {
    type: Number,
    required:true
  },
  role: {
    type: String,
    enum: ['patient', 'provider'], 
    required: true,
  },
  dob: {
    type: String,
  }
}, {
  timestamps: true, 
});

userSchema.methods.isPasswordValid = async function (enteredPassword) {
  try {
    // Compare the entered password with the hashed password in the database
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (err) {
    throw new Error('Error validating password');
  }
};

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});


// Create the User model using the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
