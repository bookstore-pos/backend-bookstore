function validateOrderId(id) {
    const parsed = parseInt(id);
    if (isNaN(parsed)) return { error: 'Invalid order ID' };
    return { value: parsed };
  }
  
  function validatePagination(query) {
    return {
      page: parseInt(query.page) > 0 ? parseInt(query.page) : 1,
      limit: parseInt(query.limit) > 0 ? parseInt(query.limit) : 10
    };
  }
  
  module.exports = { validateOrderId, validatePagination };