const Client = require("../models/Client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register Client
exports.registerClient = async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  try {
    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      return res.status(409).json({ message: "Client already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const client = new Client({ name, email, phone, password: hashedPassword });
    await client.save();

    res.status(201).json({ message: "Client registered successfully" });
  } catch (error) {
    console.error("Client registration error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Login Client
exports.loginClient = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" });
  }

  try {
    const client = await Client.findOne({ email });
    if (!client) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ Include role in token
    const token = jwt.sign(
      { id: client._id, email: client.email, role: "client" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Client login error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all clients (staff only)
exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.status(200).json(clients);
  } catch (error) {
    console.error("Get all clients error:", error);
    res.status(500).json({ message: "Error fetching clients", error });
  }
};
