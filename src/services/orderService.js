const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllOrders = async (skip = 0, limit = 10) => {
    const [orders, totalItems] = await Promise.all([
      prisma.order.findMany({
        skip,
        take: limit,
        include: {
          client: true,
          details: {
            include: {
              book: true
            }
          }
        }
      }),
      prisma.order.count()
    ]);
  
    const totalPages = Math.ceil(totalItems / limit);
    return { orders, totalItems, totalPages };
  };

exports.getOrderById = async (id) => {
  return prisma.order.findUnique({
    where: { id: parseInt(id) },
    include: {
      client: true,
      details: {
        include: { book: true }
      }
    }
  });
};