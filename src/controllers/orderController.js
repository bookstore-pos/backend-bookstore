const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { mapOrderToDTO } = require('../utils/orderUtils');
const { validateOrderId, validatePagination } = require('../validators/orderValidator');

/**
 * GET /api/orders/:id
 * Retorna una orden por ID con detalles y datos del cliente
 */
exports.getOrderById = async (req, res) => {
  const { value: orderId, error } = validateOrderId(req.params.id);

  if (error) {
    return res.status(400).json({ error: 'Invalid order ID format. It must be a number.' });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        client: true,
        details: {
          include: { book: true }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    return res.status(200).json(mapOrderToDTO(order));
  } catch (err) {
    console.error('Error fetching order:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * GET /api/orders
 * Lista todas las órdenes con paginación y filtro opcional por doc_number
 */
exports.listOrders = async (req, res) => {
  const { page, limit } = validatePagination(req.query);
  const skip = (page - 1) * limit;
  const { doc_number } = req.query;

  try {
    const where = doc_number
      ? { client: { doc_number: { contains: doc_number } } }
      : {};

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          client: true,
          details: { include: { book: true } }
        },
        skip,
        take: limit,
        orderBy: { id: 'desc' }
      }),
      prisma.order.count({ where })
    ]);

    const results = orders.map(mapOrderToDTO);

    return res.status(200).json({
      page,
      total,
      total_pages: Math.ceil(total / limit),
      results
    });
  } catch (err) {
    console.error('Error listing orders:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};