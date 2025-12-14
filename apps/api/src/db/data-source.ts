import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { ConversionItem } from './entities/Conversion-Item.entity';
import { CONFIG } from '../config';



export const AppDataSource = new DataSource({
  type: 'postgres',
  host: CONFIG.postgresConfig.host,
  port: CONFIG.postgresConfig.port,
  username: CONFIG.postgresConfig.username,
  password: CONFIG.postgresConfig.password,
  database: CONFIG.postgresConfig.database,
  entities: [ConversionItem],
  migrations: ['apps/api/src/db/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: false,
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
