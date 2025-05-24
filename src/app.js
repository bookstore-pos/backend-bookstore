const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const routes = require('./routes');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.locals.prisma = prisma;
app.use('/api', routes);

module.exports.handler = serverless(app);