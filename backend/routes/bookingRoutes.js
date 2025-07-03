const express = require("express");
const router = express.Router();

const {
  bookRoom,
  getMyBookings,
  cancelBooking,
  getAllBookings,
} = require("../controllers/bookingController");

const {
  protectClient,
  protectStaff,
} = require("../middleware/authMiddleware");

// 📌 Public or client-access route
router.post("/create", protectClient, bookRoom);

// 📌 Client's own bookings
router.get("/mine", protectClient, getMyBookings);
router.delete("/:id", protectClient, cancelBooking);

// 📌 Staff-only access
router.get("/", protectStaff, getAllBookings);

module.exports = router;
