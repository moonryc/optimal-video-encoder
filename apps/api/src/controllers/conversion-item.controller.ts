import { type RequestHandler } from 'express';
import { ApiResponse, ConversionItem, PaginatedResponse } from '@org/models';
import { initDataSource } from '../db/data-source';
import { ConversionItem as ConversionItemEntity } from '../db/entities/Conversion-Item.entity';

export const getConversionItems: RequestHandler = async (_req, res) => {
  try {
    const ds = await initDataSource();
    const repo = ds.getRepository(ConversionItemEntity);
    const [items, total] = await repo.findAndCount({
      order: { createdAt: 'DESC' },
    });

    const response: ApiResponse<PaginatedResponse<ConversionItem>> = {
      data: {
        items,
        total,
        page: 0,
        pageSize: items.length,
        totalPages: total === 0 ? 0 : 1,
      },
      success: true,
    };
    res.json(response);
  } catch (err: unknown) {
    const response: ApiResponse<PaginatedResponse<ConversionItem>> = {
      data: {
        items: [],
        total: 0,
        page: 0,
        pageSize: 0,
        totalPages: 0,
      },
      success: false,
      error: err instanceof Error ? err.message : 'Failed to load conversion items',
    };
    res.status(500).json(response);
  }
};
