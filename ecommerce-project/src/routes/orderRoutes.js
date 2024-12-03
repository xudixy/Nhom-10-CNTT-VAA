const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createOrder,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  createVNPayPayment,
  vnpayCallback,
  verifyVNPayPayment
} = require('../controllers/orderController');

// Routes
router.post('/', protect, createOrder);
router.post('/create-vnpay-payment', protect, createVNPayPayment);
router.post('/verify-vnpay-payment', verifyVNPayPayment);
router.get('/vnpay-callback', vnpayCallback);
router.get('/user-orders', protect, getUserOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, updateOrderStatus);

module.exports = router;