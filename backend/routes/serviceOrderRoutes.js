const express = require("express");
const router = express.Router();
const { createServiceOrder, getAllOrders } = require("../controllers/serviceOrderController");

router.post("/order", createServiceOrder);       // Client orders a service
router.get("/orders", getAllOrders);             // Staff view all service orders

module.exports = router;
