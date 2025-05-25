const bookService = require('../services/bookService');
const { validateBook } = require('../validators/bookValidator');
const { formatBookList, formatBookDTO } = require('../utils/bookUtils');

exports.getAllBooks = async (req, res) => {
  try {
    const books = await bookService.getAllBooks();
    res.status(200).json(formatBookList(books));
  } catch (error) {
    console.error('Error al obtener libros:', error);
    res.status(500).json({ error: 'Error al obtener libros' });
  }
};

exports.createBook = async (req, res) => {
  const validation = validateBook(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.message });
  }

  try {
    const newBook = await bookService.createBook(req.body);
    res.status(201).json(formatBookDTO(newBook));
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'El ISBN ya está registrado' });
    }

    console.error('Error al crear libro:', error);
    res.status(500).json({ error: 'Error interno al crear el libro' });
  }
};

exports.searchBooks = async (req, res) => {
  try {
    const { name, isbn } = req.query;

    if (!name && !isbn) {
      return res.status(400).json({ error: 'Debe proporcionar al menos name o isbn' });
    }

    const books = await bookService.searchBooks({ name, isbn });

    if (!books.length) {
      return res.status(404).json({ error: 'No se encontraron libros.' });
    }

    res.status(200).json(formatBookList(books));
  } catch (error) {
    console.error('Error al buscar libros:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};