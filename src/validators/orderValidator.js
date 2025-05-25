/**
 * Valida que el ID de orden sea un entero positivo.
 */
exports.validateOrderId = (id) => {
    const parsedId = parseInt(id);
    if (isNaN(parsedId) || parsedId <= 0) {
      return { success: false, message: 'ID de orden inválido' };
    }
    return { success: true };
  };
  
  /**
   * Valida que los parámetros de paginación sean válidos (números positivos).
   */
  exports.validatePagination = (page, limit) => {
    if (page <= 0 || limit <= 0 || isNaN(page) || isNaN(limit)) {
      return { success: false, message: 'Parámetros de paginación inválidos' };
    }
    return { success: true };
  };