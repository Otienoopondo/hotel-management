const Hotel = require('../models/Hotel');

// Add a new hotel
exports.addHotel = async (req, res) => {
  const { name, price, description, image } = req.body;

  if (!name || !price || !description || !image) {
    return res.status(400).json({ message: 'Please provide all hotel details' });
  }

  try {
    const newHotel = new Hotel({ name, price, description, image });
    await newHotel.save();
    res.status(201).json({ message: 'Hotel added successfully', hotel: newHotel });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all hotels
exports.getHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.status(200).json(hotels);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching hotels', error: err.message });
  }
};

// Update a hotel
exports.updateHotel = async (req, res) => {
  const { id } = req.params;
  const { name, price, description, image } = req.body;

  try {
    const hotel = await Hotel.findByIdAndUpdate(
      id,
      { name, price, description, image },
      { new: true }
    );

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    res.status(200).json({ message: 'Hotel updated successfully', hotel });
  } catch (err) {
    res.status(500).json({ message: 'Error updating hotel', error: err.message });
  }
};

// Delete a hotel
exports.deleteHotel = async (req, res) => {
  const { id } = req.params;

  try {
    const hotel = await Hotel.findByIdAndDelete(id);

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    res.status(200).json({ message: 'Hotel deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting hotel', error: err.message });
  }
};
