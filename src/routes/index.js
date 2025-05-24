const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const checkoutController = require('../controllers/checkoutController');

// Ruta básica para prueba
router.get('/', (req, res) => {
  res.json({ message: 'API Bookstore funcionando 🎉' });
});

// Ruta para obtener todos los libros
router.get('/books', bookController.getAllBooks);
router.post('/books', bookController.createBook);

router.post('/checkout', checkoutController.processCheckout);
module.exports = router;