const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const prisma = new PrismaClient();

/**
 * Valida la estructura del body recibido en /checkout
 */
function validateCheckoutInput(client, voucher_type, cart) {
  if (!client || !voucher_type || !cart) return 'Faltan datos requeridos (cliente, carrito, tipo de comprobante)';

  const { doc_type, doc_number, first_name, last_name, phone, email } = client;
  if (!['D', 'R', 'X'].includes(doc_type)) return 'Tipo de documento inválido';
  if (!doc_number || doc_number.length < 8) return 'Número de documento inválido';
  if (!first_name || !last_name || !phone || !email) return 'Datos del cliente incompletos';
  if (!['B', 'F'].includes(voucher_type)) return 'Tipo de comprobante inválido';
  if (!Array.isArray(cart) || cart.length === 0) return 'El carrito no puede estar vacío';

  return null;
}

exports.processCheckout = async (req, res) => {
  const { client, voucher_type, cart } = req.body;

  const validationError = validateCheckoutInput(client, voucher_type, cart);
  if (validationError) return res.status(400).json({ error: validationError });

  const { doc_type, doc_number, first_name, last_name, phone, email } = client;

  try {
    // 1. Buscar o crear cliente
    const savedClient =
      await prisma.client.upsert({
        where: { doc_number },
        update: {},
        create: {
          doc_type,
          doc_number,
          first_name,
          last_name,
          phone,
          email
        }
      });

    // 2. Obtener todos los libros necesarios de una vez
    const bookIds = cart.map(item => item.book_id);
    const books = await prisma.book.findMany({ where: { id: { in: bookIds } } });
    const bookMap = new Map(books.map(book => [book.id, book]));

    // 3. Validar existencia y stock
    for (const item of cart) {
      const book = bookMap.get(item.book_id);
      if (!book) return res.status(404).json({ error: `Libro con ID ${item.book_id} no existe` });
      if (book.stock < item.quantity) {
        return res.status(400).json({
          error: `Stock insuficiente para el libro "${book.name}" (disponible: ${book.stock}, solicitado: ${item.quantity})`
        });
      }
    }

    // 4. Crear orden
    const order = await prisma.order.create({
      data: { client_id: savedClient.id, voucher_type }
    });

    // 5. Crear detalles y restar stock en paralelo
    const detailPromises = cart.map(item => {
      const book = bookMap.get(item.book_id);
      return prisma.detail.create({
        data: {
          order_id: order.id,
          book_id: book.id,
          price: book.price,
          quantity: item.quantity
        }
      });
    });

    const stockUpdatePromises = cart.map(item => {
      return prisma.book.update({
        where: { id: item.book_id },
        data: {
          stock: { decrement: item.quantity }
        }
      });
    });

    const [details] = await Promise.all([
      Promise.all(detailPromises),
      Promise.all(stockUpdatePromises)
    ]);

    // 6. Preparar payload y consumir API externa
    const voucherPayload = {
      type: voucher_type,
      client: {
        type: doc_type,
        number: doc_number,
        name: `${first_name} ${last_name}`
      },
      products: cart.map(item => {
        const book = bookMap.get(item.book_id);
        return {
          name: book.name,
          price: book.price.toFixed(2),
          quantity: item.quantity
        };
      })
    };

    try {
      const response = await axios.post('https://hiring.pruebasgt.com/api/vouchers', voucherPayload);
      const { number, pdf } = response.data.data;

      const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
          voucher_number: number,
          voucher_pdf: pdf
        }
      });

      return res.status(201).json({
        message: 'Orden creada con éxito',
        order: updatedOrder,
        client: savedClient,
        details
      });

    } catch (error) {
      console.error('Error desde la API de comprobantes:', error.response?.data || error.message);
      return res.status(422).json({ error: 'La API de comprobantes rechazó la solicitud', details: error.response?.data });
    }

  } catch (error) {
    console.error('Error en el checkout:', error);
    return res.status(500).json({ error: 'Error procesando la orden' });
  }
};