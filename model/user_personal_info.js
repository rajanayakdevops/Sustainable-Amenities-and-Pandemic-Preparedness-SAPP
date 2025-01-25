const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },  // Make phone number unique
  email: { type: String, required: true, unique: true },  // Make email unique
  aadhaar: { type: String, required: true },
  userid: { type: String, required: true, unique: true },  // Make user ID unique
  password: { type: String, required: true, unique: true },  // Make password unique
  firstLogin: { type: Boolean, default: true, select: false },
  isFormFilled: { type: Boolean, default: false, select: false },
  riskCategory: { type: Number, enum: [1, 2, 3], default: 1 },
  city: { type: String, required: true },  // Add city field
  state: { type: String, required: true },  // Add state field
});

// Create and export the User model
const User = mongoose.model('UserPersonalInfo', userSchema);

module.exports = User;
