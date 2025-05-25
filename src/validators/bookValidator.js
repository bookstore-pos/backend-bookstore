exports.validateBook = (data) => {
    const { isbn, name, stock, price, image } = data;

    if (!isbn || typeof isbn !== 'string' || isbn.length !== 13) {
        return { success: false, message: 'ISBN inválido. Debe tener 13 caracteres.' };
    }

    if (!name || typeof name !== 'string' || name.length < 2) {
        return { success: false, message: 'El nombre del libro es requerido y debe ser válido.' };
    }

    if (typeof stock !== 'number' || stock < 0) {
        return { success: false, message: 'Stock inválido. Debe ser un número mayor o igual a 0.' };
    }

    if (typeof price !== 'number' || price <= 0) {
        return { success: false, message: 'Precio inválido. Debe ser un número mayor a 0.' };
    }

    if (!image || typeof image !== 'string') {
        return { success: false, message: 'URL de imagen inválida.' };
    }

    return { success: true };
};