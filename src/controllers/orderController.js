const orderService = require('../services/orderService');
const { mapOrderToDTO } = require('../utils/orderUtils');
const { validateOrderId, validatePagination } = require('../validators/orderValidator');

/**
 * GET /api/orders/:id
 * Retorna una orden por ID con detalles y datos del cliente
 */
exports.getOrderById = async (req, res) => {
    const id = req.params.id;
  
    const idValidation = validateOrderId(id);
    if (!idValidation.success) {
      return res.status(400).json({ error: idValidation.message });
    }
  
    try {
      const order = await orderService.getOrderById(id);
      if (!order) {
        return res.status(404).json({ error: 'Orden no encontrada' });
      }
  
      res.status(200).json(mapOrderToDTO(order));
    } catch (error) {
      console.error('Error obteniendo orden:', error);
      res.status(500).json({ error: 'Error interno al obtener orden' });
    }
  };

/**
 * GET /api/orders
 * Lista todas las órdenes con paginación y filtro opcional por doc_number
 */
exports.listOrders = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
  
    const paginationValidation = validatePagination(page, limit);
    if (!paginationValidation.success) {
      return res.status(400).json({ error: paginationValidation.message });
    }
  
    try {
      const orders = await orderService.getAllOrders(skip, limit);
      res.status(200).json(orders.map(mapOrderToDTO));
    } catch (error) {
      console.error('Error listando órdenes:', error);
      res.status(500).json({ error: 'Error interno al obtener órdenes' });
    }
  };