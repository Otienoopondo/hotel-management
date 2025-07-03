const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin } = require('../controllers/adminController');

// Route: POST /api/admin/signup
router.post('/signup', registerAdmin);

// Route: POST /api/admin/login
router.post('/login', loginAdmin);

module.exports = router;
