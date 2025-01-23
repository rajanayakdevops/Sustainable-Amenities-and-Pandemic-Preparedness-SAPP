const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  aadhaar: { type: String, required: true },
  userid: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstLogin: {type: Boolean, default: true, select:false},
  isFormFilled: {type: Boolean, default: false, select:false},
  riskCategory: { type: Number, enum: [1, 2, 3], default: 1 },
});

// Create and export the User model
const User = mongoose.model('UserPersonalInfo', userSchema);

module.exports = User;
