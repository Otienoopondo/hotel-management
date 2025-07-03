const ServiceOrder = require("../models/ServiceOrder");

exports.createServiceOrder = async (req, res) => {
  try {
    const { clientName, roomNumber, serviceType, details } = req.body;
    const newOrder = new ServiceOrder({ clientName, roomNumber, serviceType, details });
    await newOrder.save();
    res.status(201).json({ message: "Order created", order: newOrder });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await ServiceOrder.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders", error: err.message });
  }
};
