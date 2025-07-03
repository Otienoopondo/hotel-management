const express = require("express");
const router = express.Router();
const {
  addRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
} = require("../controllers/roomController");

// Add a new room
router.post("/", addRoom);

// Get all rooms
router.get("/", getAllRooms);

// Get a room by ID
router.get("/:id", getRoomById);

// Update room by ID
router.put("/:id", updateRoom);

// Delete room by ID
router.delete("/:id", deleteRoom);

module.exports = router;
