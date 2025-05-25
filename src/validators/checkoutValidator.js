exports.validateCheckoutPayload = ({ client, voucher_type, cart }) => {
    if (!client || !voucher_type || !Array.isArray(cart)) {
      return { success: false, message: 'Faltan datos requeridos (cliente, carrito o tipo de comprobante)' };
    }
  
    const { doc_type, doc_number, first_name, last_name, phone, email } = client;
  
    if (!['D', 'R', 'X'].includes(doc_type)) {
      return { success: false, message: 'Tipo de documento inválido' };
    }
  
    if (!doc_number || doc_number.length < 8) {
      return { success: false, message: 'Número de documento inválido' };
    }
  
    if (!first_name || !last_name || !email || !phone) {
      return { success: false, message: 'Datos del cliente incompletos' };
    }
  
    if (!['B', 'F'].includes(voucher_type)) {
      return { success: false, message: 'Tipo de comprobante inválido' };
    }
  
    if (cart.length === 0 || cart.some(item => !item.book_id || item.quantity <= 0)) {
      return { success: false, message: 'El carrito es inválido o tiene elementos incompletos' };
    }
  
    return { success: true };
  };