const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const prisma = new PrismaClient();

exports.processCheckout = async ({ client, voucher_type, cart }) => {
  // 1. Buscar o crear cliente
  const existingClient = await prisma.client.findUnique({
    where: { doc_number: client.doc_number }
  });

  const savedClient = existingClient || await prisma.client.create({
    data: client
  });

  // 2. Validar stock
  for (const item of cart) {
    const book = await prisma.book.findUnique({ where: { id: item.book_id } });
    if (!book) throw new Error(`Libro con ID ${item.book_id} no existe`);
    if (book.stock < item.quantity) {
      throw new Error(`Stock insuficiente para "${book.name}"`);
    }
  }

  // 3. Crear orden
  const order = await prisma.order.create({
    data: {
      client_id: savedClient.id,
      voucher_type
    }
  });

  // 4. Crear detalles
  const details = await Promise.all(cart.map(async item => {
    const book = await prisma.book.findUnique({ where: { id: item.book_id } });
    return prisma.detail.create({
      data: {
        order_id: order.id,
        book_id: book.id,
        price: book.price,
        quantity: item.quantity
      }
    });
  }));

  // 5. Actualizar stock
  await Promise.all(cart.map(item =>
    prisma.book.update({
      where: { id: item.book_id },
      data: { stock: { decrement: item.quantity } }
    })
  ));

  // 6. Llamar a API externa
  const payload = {
    type: voucher_type,
    client: {
      type: client.doc_type,
      number: client.doc_number,
      name: `${client.first_name} ${client.last_name}`
    },
    products: await Promise.all(cart.map(async item => {
      const book = await prisma.book.findUnique({ where: { id: item.book_id } });
      return {
        name: book.name,
        price: book.price.toFixed(2),
        quantity: item.quantity
      };
    }))
  };

  const response = await axios.post('https://hiring.pruebasgt.com/api/vouchers', payload);
  const { number, pdf } = response.data.data;

  // 7. Actualizar orden con datos del comprobante
  const updatedOrder = await prisma.order.update({
    where: { id: order.id },
    data: {
      voucher_number: number,
      voucher_pdf: pdf
    },
    include: {
      client: true,
      details: { include: { book: true } }
    }
  });

  return {
    order: updatedOrder,
    client: savedClient,
    details
  };
};