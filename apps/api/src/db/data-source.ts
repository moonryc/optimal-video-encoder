import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { ConversionItem } from './entities/Conversion-Item.entity';
import { CONFIG } from '../config';
import pluralize from "pluralize";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";


class NamingStrategy extends SnakeNamingStrategy {
  override tableName(className: string, customName: string): string {
    return super.tableName(pluralize(className), customName);
  }
}


export const AppDataSource = new DataSource({
  type: 'postgres',
  host: CONFIG.postgresConfig.host,
  port: CONFIG.postgresConfig.port,
  username: CONFIG.postgresConfig.username,
  password: CONFIG.postgresConfig.password,
  database: CONFIG.postgresConfig.database,
  entities: [ConversionItem],
  namingStrategy: new NamingStrategy(),
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
