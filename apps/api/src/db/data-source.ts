import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { ConversionItem } from './entities/Conversion-Item.entity';

const {
  DB_HOST = 'localhost',
  DB_PORT = '5432',
  DB_USER = 'app',
  DB_PASSWORD = 'app',
  DB_NAME = 'optimal_video_encoder',
  DB_SSL = 'false',
} = process.env;

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: [ConversionItem],
  migrations: ['apps/api/src/db/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: false,
  ssl: DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

let cachedDataSource: DataSource | null = null;

export const initDataSource = async (): Promise<DataSource> => {
  if (cachedDataSource?.isInitialized) {
    return cachedDataSource;
  }

  cachedDataSource = AppDataSource;

  if (!cachedDataSource.isInitialized) {
    await cachedDataSource.initialize();
  }

  return cachedDataSource;
};
