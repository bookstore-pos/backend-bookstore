const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllOrders = async (skip = 0, limit = 10) => {
  return prisma.order.findMany({
    skip,
    take: limit,
    orderBy: { id: 'desc' },
    include: {
      client: true,
      details: {
        include: { book: true }
      }
    }
  });
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