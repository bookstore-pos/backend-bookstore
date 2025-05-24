const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/', orderController.listOrders);         // GET /api/orders
router.get('/:id', orderController.getOrderById);    // GET /api/orders/:id

module.exports = router;