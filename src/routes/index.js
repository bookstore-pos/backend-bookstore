const express = require('express');
const router = express.Router();

const bookRoutes = require('./bookRoutes');
const checkoutRoutes = require('./checkoutRoutes');
const orderRoutes = require('./orderRoutes');

// Ruta básica para prueba
router.get('/', (req, res) => {
  res.json({ message: 'API Bookstore funcionando 🎉' });
});

router.use('/books', bookRoutes);
router.use('/checkout', checkoutRoutes);
router.use('/orders', orderRoutes);

module.exports = router;