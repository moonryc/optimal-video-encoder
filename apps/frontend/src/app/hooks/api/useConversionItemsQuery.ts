import { useQuery } from '@tanstack/react-query';
import { ApiResponse, ConversionItem, PaginatedResponse } from '@org/models';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3333/api';

const fetchConversionItems = async (): Promise<PaginatedResponse<ConversionItem>> => {
  const response = await fetch(`${API_BASE}/conversion-items`);

  if (!response.ok) {
    throw new Error('Failed to fetch conversion items');
  }

  const payload = await response.json() as ApiResponse<PaginatedResponse<ConversionItem>>;

  if (!payload.success) {
    throw new Error(payload.error ?? 'Conversion items request unsuccessful');
  }

  return payload.data;
};

export const useConversionItemsQuery = () => {
  return useQuery({
    queryKey: ['conversion-items'],
    queryFn: fetchConversionItems,
  });
};
