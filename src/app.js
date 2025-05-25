const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const routes = require('./routes');
const getRawBody = require('raw-body');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(async (req, res, next) => {
    try {
      if (
        req.headers['content-type'] &&
        req.headers['content-type'].includes('application/json')
      ) {
        const raw = await getRawBody(req);
        req.body = JSON.parse(raw.toString('utf8'));
      }
    } catch (err) {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }
    next();
  });
app.locals.prisma = prisma;
app.use('/api', routes);

app.listen(process.env.PORT || 3000, () => {
  console.log(`🚀 Backend Bookstore escuchando en el puerto ${process.env.PORT || 3000}`);
});