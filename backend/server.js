const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS Configuration for frontend (Next.js typically at port 3000)
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// Middleware for parsing JSON
app.use(express.json());

// ✅ Routes
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/staff', require('./routes/staffRoutes'));
app.use('/api/hotels', require('./routes/hotelRoutes'));
app.use('/api/rooms', require('./routes/roomRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/client', require('./routes/clientRoutes'));
app.use('/api/services', require('./routes/serviceOrderRoutes')); // ✅ New service orders route

// Health check route
app.get('/', (req, res) => {
  res.send('✅ API is running...');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
