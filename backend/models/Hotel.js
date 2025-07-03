const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Hotel', hotelSchema);
