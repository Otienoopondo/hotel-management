// backend/models/Staff.js
const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
}, { timestamps: true });

module.exports = mongoose.model('Staff', staffSchema);
