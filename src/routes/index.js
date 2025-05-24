const express = require('express');
const router = express.Router();
const bookRoutes = require('./bookRoutes');
const checkoutController = require('../controllers/checkoutController');
const orderRoutes = require('./orderRoutes');

// Ruta básica para prueba
router.get('/', (req, res) => {
  res.json({ message: 'API Bookstore funcionando 🎉' });
});

router.use('/books', bookRoutes);

router.post('/checkout', checkoutController.processCheckout);

router.use('/orders', orderRoutes);

module.exports = router;