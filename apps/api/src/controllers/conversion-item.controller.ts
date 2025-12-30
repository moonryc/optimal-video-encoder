import { type RequestHandler } from 'express';
import { ApiResponse, ConversionItem, PaginatedResponse } from '@org/models';
import { initDataSource } from '../db/data-source';
import { ConversionItem as ConversionItemEntity } from '../db/entities/Conversion-Item.entity';
import { In } from 'typeorm';

interface DeleteConversionItemsResult {
  deletedCount: number;
  deletedIds: string[];
}

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

export const deleteConversionItems: RequestHandler = async (req, res) => {
  try {
    const { ids } = req.body as { ids: string[] };

    if (!Array.isArray(ids) || ids.length === 0) {
      const response: ApiResponse<null> = {
        data: null,
        success: false,
        error: 'Invalid request: ids array is required and must not be empty',
      };
      res.status(400).json(response);
      return;
    }

    const ds = await initDataSource();
    const repo = ds.getRepository(ConversionItemEntity);

    const result = await repo.delete({ id: In(ids) });

    const response: ApiResponse<DeleteConversionItemsResult> = {
      data: {
        deletedCount: result.affected ?? 0,
        deletedIds: ids,
      },
      success: true,
    };
    res.json(response);
  } catch (err: unknown) {
    const response: ApiResponse<null> = {
      data: null,
      success: false,
      error: err instanceof Error ? err.message : 'Failed to delete conversion items',
    };
    res.status(500).json(response);
  }
};
