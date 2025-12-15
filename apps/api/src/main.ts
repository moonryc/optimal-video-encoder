import 'reflect-metadata';
import express from 'express';
import routes from './routes';
import { initDataSource } from './db/data-source';
import transcoder from './bullMQ/transcoder';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3333;

const app = express();

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

// API routes
app.use('/api', routes);

const start = async () => {
  try {
    const ds =await initDataSource();
    app.listen(port, host, () => {
      console.log(`[ ready ] http://${host}:${port}`);
    });
    void transcoder({ds})
  } catch (error) {
    console.error('Failed to initialize database connection', error);
    process.exit(1);
  }
};

void start();
