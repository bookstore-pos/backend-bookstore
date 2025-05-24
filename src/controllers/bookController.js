const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * GET /books
 * Lista todos los libros o realiza una búsqueda por nombre o ISBN
 */
exports.getAllBooks = async (req, res) => {
    const { search } = req.query;

    try {
        let books;

        if (search) {
            books = await prisma.book.findMany({
                where: {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { isbn: { contains: search, mode: 'insensitive' } }
                    ]
                }
            });
        } else {
            books = await prisma.book.findMany();
        }

        res.status(200).json(books);
    } catch (error) {
        console.error('Error al obtener libros:', error);
        res.status(500).json({ error: 'Error al obtener libros' });
    }
};

/**
 * POST /books
 * Crea un nuevo libro con validaciones avanzadas
 */
exports.createBook = async (req, res) => {
    const { isbn, name, stock, price, image } = req.body;

    // Validación de ISBN
    if (!isbn || typeof isbn !== 'string' || isbn.length !== 13 || !/^\d{13}$/.test(isbn)) {
        return res.status(400).json({ error: 'El ISBN debe ser un string numérico de 13 dígitos' });
    }

    // Validación de nombre
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
        return res.status(400).json({ error: 'El nombre del libro debe tener al menos 2 caracteres' });
    }

    // Validación de stock
    if (
        stock === undefined ||
        stock === null ||
        typeof stock !== 'number' ||
        !Number.isInteger(stock) ||
        stock < 0
    ) {
        return res.status(400).json({ error: 'Stock debe ser un número entero mayor o igual a 0' });
    }

    // Validación de precio
    if (
        price === undefined ||
        price === null ||
        typeof price !== 'number' ||
        isNaN(price) ||
        price <= 0
    ) {
        return res.status(400).json({ error: 'El precio debe ser un número mayor a 0' });
    }

    // Validación de imagen (debe ser URL y terminar en .png, .jpg, .jpeg, etc.)
    if (
        !image ||
        typeof image !== 'string' ||
        !/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(image)
    ) {
        return res.status(400).json({ error: 'La imagen debe ser una URL válida que termine en .jpg, .png, .jpeg, etc.' });
    }

    try {
        const newBook = await prisma.book.create({
            data: { isbn, name: name.trim(), stock, price, image }
        });

        res.status(201).json(newBook);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // ISBN duplicado
            if (error.code === 'P2002') {
                return res.status(409).json({ error: 'El ISBN ya está registrado' });
            }
        }

        console.error('Error al crear libro:', error);
        res.status(500).json({ error: 'Error interno al crear libro' });
    }
};