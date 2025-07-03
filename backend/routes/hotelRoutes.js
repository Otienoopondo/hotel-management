const express = require("express");
const router = express.Router();

const {
  addHotel,
  getHotels,
  updateHotel,
  deleteHotel
} = require("../controllers/hotelController");

// These paths now match what frontend expects
router.post("/", addHotel); // Matches POST /api/hotels
router.get("/", getHotels); // Matches GET /api/hotels
router.put("/:id", updateHotel); // Matches PUT /api/hotels/:id
router.delete("/:id", deleteHotel); // Matches DELETE /api/hotels/:id

module.exports = router;
