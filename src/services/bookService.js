const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllBooks = async () => {
  return prisma.book.findMany();
};

exports.createBook = async (data) => {
  return prisma.book.create({ data });
};