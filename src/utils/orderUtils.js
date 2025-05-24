function mapOrderToDTO(order) {
    const items = order.details.map(detail => ({
      book_id: detail.book.id,
      name: detail.book.name,
      quantity: detail.quantity,
      price: parseFloat(detail.price)
    }));
  
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
    return {
      order_id: order.id,
      voucher_type: order.voucher_type,
      voucher_number: order.voucher_number,
      client: {
        full_name: `${order.client.first_name} ${order.client.last_name}`,
        doc_type: order.client.doc_type,
        doc_number: order.client.doc_number,
        email: order.client.email
      },
      items,
      total: Number(total.toFixed(2))
    };
  }
  
  module.exports = { mapOrderToDTO };