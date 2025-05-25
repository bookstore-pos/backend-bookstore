function formatBookDTO(book) {
    return {
      id: book.id,
      isbn: book.isbn,
      name: book.name,
      stock: book.stock,
      price: Number(book.price).toFixed(2),
      image: book.image
    };
  }
  
  function formatBookList(books) {
    return books.map(formatBookDTO);
  }
  
  module.exports = {
    formatBookDTO,
    formatBookList
  };