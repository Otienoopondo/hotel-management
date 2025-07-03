// backend/routes/staffRoutes.js
const express = require('express');
const router = express.Router();
const {
  registerStaff,
  loginStaff,
  getAllStaff,
  updateStaff,
  deleteStaff
} = require('../controllers/staffController');

// ✅ Matches frontend route: POST /api/staff/signup
router.post('/signup', registerStaff);

// ✅ Login route
router.post('/login', loginStaff);

// ✅ Admin operations
router.get('/', getAllStaff);          // Fetch all staff
router.put('/:id', updateStaff);       // Update staff by ID
router.delete('/:id', deleteStaff);    // Delete staff by ID

module.exports = router;
