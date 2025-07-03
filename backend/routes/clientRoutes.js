const express = require("express");
const router = express.Router();

const {
  registerClient,
  loginClient,
  getAllClients,
} = require("../controllers/clientController");

const { protectStaff } = require("../middleware/authMiddleware");

router.post("/signup", registerClient);
router.post("/login", loginClient);
router.get("/", protectStaff, getAllClients); // ✅ Only staff can access

module.exports = router;
