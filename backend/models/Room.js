const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  hotelName: {
    type: String,
    required: true,
  },
  roomNumber: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  pricePerNight: {
    type: Number,
    required: true,
  },
  amenities: [String],
  isAvailable: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Room", roomSchema);
