
# 📚 Bookstore POS API

API RESTful para gestionar libros, clientes, órdenes y procesos de checkout en una librería. Esta API está desarrollada con Node.js, Express, PostgreSQL y Prisma ORM.

## 🚀 Características

- Gestión de libros con validaciones y búsqueda por nombre o ISBN.
- Gestión de órdenes con paginación y detalles del cliente.
- Proceso completo de checkout: cliente, orden, detalles y generación de comprobante.
- Validaciones centralizadas y estructura modular.
- Llamado a API externa para generar comprobantes (boleta o factura).
- Control de stock automático al realizar checkout.

---

## 📦 Instalación

```bash
git clone https://github.com/tu-usuario/bookstore-pos.git
cd backend-bookstore
npm install
npx prisma generate
```

### Configuración

Crear un archivo `.env`:

```env
DATABASE_URL=postgresql://usuario:password@localhost:5432/bookstore
```

Levantar el servidor en local:

```bash
npm run offline
```

---

## 🗂️ Endpoints principales

### 📘 Books

| Método | Ruta               | Descripción                     |
|--------|--------------------|---------------------------------|
| GET    | `/api/books`       | Listar todos los libros         |
| POST   | `/api/books`       | Crear un nuevo libro            |

### 📦 Orders

| Método | Ruta                  | Descripción                                 |
|--------|-----------------------|---------------------------------------------|
| GET    | `/api/orders`         | Listar órdenes con paginación               |
| GET    | `/api/orders/:id`     | Obtener una orden específica por ID         |

Parámetros de paginación:

```
GET /api/orders?page=1&limit=10
```

### 💳 Checkout

| Método | Ruta             | Descripción                      |
|--------|------------------|----------------------------------|
| POST   | `/api/checkout`  | Procesa una orden completa       |

---

## 🧪 Validaciones

- ISBN debe tener 13 caracteres.
- Precio y stock deben ser valores numéricos válidos.
- Validación de stock al hacer checkout.
- El cliente es creado solo si no existe previamente.
- Si el ISBN ya existe, se retorna un error `409 Conflict`.

---

## 📄 Comprobante API Externa

Se llama a la siguiente API:

```http
POST https://hiring.pruebasgt.com/api/vouchers
```

### Payload de ejemplo:

```json
{
  "type": "B",
  "client": {
    "type": "D",
    "number": "76543210",
    "name": "Juan Pérez"
  },
  "products": [
    {
      "name": "Cien años de soledad",
      "price": "123.40",
      "quantity": 3
    }
  ]
}
```

---

## 🧱 Estructura del proyecto

```
src/
├── controllers/
│   ├── bookController.js
│   ├── orderController.js
│   └── checkoutController.js
├── services/
│   ├── bookService.js
│   ├── orderService.js
│   └── checkoutService.js
├── validators/
│   ├── bookValidator.js
│   ├── orderValidator.js
│   └── checkoutValidator.js
├── utils/
│   ├── bookUtils.js
│   ├── orderUtils.js
│   └── checkoutUtils.js
├── routes/
│   ├── index.js
│   ├── bookRoutes.js
│   ├── orderRoutes.js
│   └── checkoutRoutes.js
└── app.js
```

---

## 🧠 Tecnologías

- Node.js
- Express
- Prisma ORM
- PostgreSQL
- Axios (API externa)
- Serverless Offline

---

## 📌 Consideraciones

- Solo se permite procesar libros con stock disponible.
- El stock se descuenta automáticamente luego del checkout.
- La API está lista para integrarse con un frontend Angular o React.

