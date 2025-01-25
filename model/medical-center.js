const mongoose = require('mongoose');

// Define the schema for a city with medical centers
const CitySchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
    unique: true, // Ensures no duplicate city entries
    trim: true, // Removes unnecessary spaces
  },
  medicalCenters: [
    {
      name: {
        type: String,
        required: true, // Medical center name is required
        trim: true,
      },
      address: {
        street: {
          type: String,
          required: true,
        },
        state: {
          type: String,
          required: true,
        },
        zipcode: {
          type: String,
          required: true,
        },
      },
      contact: {
        phone: {
          type: String,
          required: true,
          match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"], // Regex validation
        },
        email: {
          type: String,
          required: true,
          match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            "Please enter a valid email address",
          ],
        },
      },
      bedAvailability: {
        type: Number,
        required: true,
        min: 0, // Beds cannot be negative
      },
    },
  ],
}, { 
  timestamps: true // Automatically add 'createdAt' and 'updatedAt'
});

// Create and export the City model
const City = mongoose.model('City', CitySchema);

module.exports = City;
