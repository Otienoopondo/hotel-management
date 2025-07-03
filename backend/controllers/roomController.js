const Room = require("../models/Room");

// Add a room
exports.addRoom = async (req, res) => {
  try {
    const newRoom = new Room(req.body);
    const saved = await newRoom.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: "Error adding room", error });
  }
};

// Get all rooms
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching rooms", error });
  }
};

// Get a room by ID
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: "Error fetching room", error });
  }
};

// Update room
exports.updateRoom = async (req, res) => {
  try {
    const updated = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Room not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: "Error updating room", error });
  }
};

// Delete room
exports.deleteRoom = async (req, res) => {
  try {
    const deleted = await Room.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Room not found" });
    res.status(200).json({ message: "Room deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting room", error });
  }
};
