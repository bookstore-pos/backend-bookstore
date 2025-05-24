function mapOrderToDTO(order) {
    return {
      id: order.id,
      voucher_type: order.voucher_type,
      voucher_number: order.voucher_number || null,
      voucher_pdf: order.voucher_pdf || null,
      client: {
        doc_type: order.client.doc_type,
        doc_number: order.client.doc_number,
        full_name: `${order.client.first_name} ${order.client.last_name}`,
        phone: order.client.phone,
        email: order.client.email
      },
      details: order.details.map(detail => ({
        book_id: detail.book.id,
        title: detail.book.name,
        price: Number(detail.price).toFixed(2),
        quantity: detail.quantity,
        subtotal: (Number(detail.price) * detail.quantity).toFixed(2)
      }))
    };
  }
  
  module.exports = {
    mapOrderToDTO
  };