const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllBooks = async () => {
  return prisma.book.findMany();
};

exports.createBook = async (data) => {
  return prisma.book.create({ data });
};
exports.searchBooks = async ({ name, isbn }) => {
  const filters = [];

  if (name) {
    filters.push({
      name: {
        contains: name,
        mode: 'insensitive'
      }
    });
  }

  if (isbn) {
    filters.push({
      isbn: {
        contains: isbn,
        mode: 'insensitive'
      }
    });
  }

  return await prisma.book.findMany({
    where: {
      AND: filters
    }
  });
};