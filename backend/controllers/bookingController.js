const Booking = require("../models/Booking");

// Book a room
exports.bookRoom = async (req, res) => {
  const { name, checkIn, checkOut, roomType } = req.body;
  const email = req.user.email;

  if (!name || !email || !checkIn || !checkOut || !roomType) {
    return res.status(400).json({ message: "Please provide all booking details" });
  }

  try {
    const newBooking = new Booking({ name, email, checkIn, checkOut, roomType });
    await newBooking.save();
    res.status(201).json({ message: "Room booked successfully", booking: newBooking });
  } catch (error) {
    console.error("Book room error:", error);
    res.status(500).json({ message: "Server error during booking" });
  }
};

// Get bookings for the logged-in user
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ email: req.user.email });
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

// Cancel a booking
exports.cancelBooking = async (req, res) => {
  const bookingId = req.params.id;
  const userEmail = req.user.email;

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.email !== userEmail) {
      return res.status(403).json({ message: "Unauthorized to cancel this booking" });
    }

    await Booking.deleteOne({ _id: bookingId });

    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({ message: "Server error during cancellation" });
  }
};

// ✅ Get all bookings (for staff only)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Get all bookings error:", error);
    res.status(500).json({ message: "Error fetching all bookings" });
  }
};
