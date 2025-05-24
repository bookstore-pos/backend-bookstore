const express = require('express');
const router = express.Router();

// Aquí irán tus rutas
router.get('/', (req, res) => {
  res.json({ message: 'API Bookstore funcionando 🎉' });
});

module.exports = router;