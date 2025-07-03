const mongoose = require("mongoose");

const serviceOrderSchema = new mongoose.Schema({
  clientName: String,
  roomNumber: String,
  serviceType: String,
  details: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ServiceOrder", serviceOrderSchema);
