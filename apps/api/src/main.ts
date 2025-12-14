import express from 'express';
import { ProductsService } from '@org/api-products';
import { ApiResponse, Product, ProductFilter, PaginatedResponse } from '@org/models';
import { initDataSource } from './db/data-source';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3333;

const app = express();
const productsService = new ProductsService();

// Middleware
app.use(express.json());

// CORS configuration for React app
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});


const start = async () => {
  try {
    await initDataSource();
    app.listen(port, host, () => {
      console.log(`[ ready ] http://${host}:${port}`);
    });
  } catch (error) {
    console.error('Failed to initialize database connection', error);
    process.exit(1);
  }
};

void start();
