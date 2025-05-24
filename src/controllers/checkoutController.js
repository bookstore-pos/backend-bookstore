const { validateCheckoutPayload } = require('../validators/checkoutValidator');
const checkoutService = require('../services/checkoutService');
const { formatCheckoutResponse } = require('../utils/checkoutUtils');

/**
 * POST /api/checkout
 * Procesa una orden completa con validación, creación de cliente y detalles, y comprobante externo
 */
exports.processCheckout = async (req, res) => {
  const validation = validateCheckoutPayload(req.body);
  if (!validation.success) {
    return res.status(400).json({ error: validation.message });
  }

  try {
    const result = await checkoutService.processCheckout(req.body);
    const formatted = formatCheckoutResponse(result.order);

    return res.status(201).json({
      message: 'Orden creada con éxito',
      data: formatted
    });

  } catch (error) {
    console.error('Error en el checkout:', error);

    // Error desde la API externa de comprobantes
    if (error.response?.status === 422) {
      return res.status(422).json({
        error: 'La API de comprobantes rechazó la solicitud',
        details: error.response.data
      });
    }

    // Error general interno
    return res.status(500).json({
      error: error.message || 'Error interno al procesar la orden'
    });
  }
};