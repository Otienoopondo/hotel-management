const Staff = require("../models/Staff");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register new staff
exports.registerStaff = async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  try {
    const existing = await Staff.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Staff already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const staff = new Staff({ name, email, phone, password: hashed });
    await staff.save();

    res.status(201).json({ message: "Staff registered successfully" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error", err });
  }
};

// Login staff
exports.loginStaff = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const staff = await Staff.findOne({ email });
    if (!staff) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        phone: staff.phone,
        role: "staff",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", err });
  }
};

// ✅ Get all staff
exports.getAllStaff = async (req, res) => {
  try {
    const staffList = await Staff.find().sort({ createdAt: -1 });
    res.status(200).json(staffList);
  } catch (err) {
    console.error("Error fetching staff:", err);
    res.status(500).json({ message: "Error fetching staff", err });
  }
};

// ✅ Update staff by ID
exports.updateStaff = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, password } = req.body;

  try {
    const updateFields = { name, email, phone };
    if (password) {
      updateFields.password = await bcrypt.hash(password, 10);
    }

    const updated = await Staff.findByIdAndUpdate(id, updateFields, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.status(200).json({ message: "Staff updated successfully", staff: updated });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Error updating staff", err });
  }
};

// ✅ Delete staff by ID
exports.deleteStaff = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Staff.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.status(200).json({ message: "Staff deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Error deleting staff", err });
  }
};
