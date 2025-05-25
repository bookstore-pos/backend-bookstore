/**
 * Formatea una orden con cliente y detalles, ocultando campos internos
 */
function formatCheckoutResponse(order) {
    return {
      id: order.id,
      voucher_type: order.voucher_type,
      voucher_number: order.voucher_number,
      voucher_pdf: order.voucher_pdf,
      client: {
        full_name: `${order.client.first_name} ${order.client.last_name}`,
        doc_type: order.client.doc_type,
        doc_number: order.client.doc_number,
        phone: order.client.phone,
        email: order.client.email
      },
      details: order.details.map(detail => ({
        book_id: detail.book.id,
        title: detail.book.name,
        quantity: detail.quantity,
        price: Number(detail.price).toFixed(2),
        subtotal: (Number(detail.price) * detail.quantity).toFixed(2)
      }))
    };
  }
  
  module.exports = {
    formatCheckoutResponse
  };