import { useCallback, useEffect, useState } from 'react';
import { ApiResponse, ConversionItem, PaginatedResponse } from '@org/models';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3333/api';

const fetchConversionItems = async (): Promise<PaginatedResponse<ConversionItem>> => {
  const response = await axios.get<ApiResponse<PaginatedResponse<ConversionItem>>>(
    `${API_BASE}/conversion-items`,
  );

  if (!response.data.success) {
    throw new Error(response.data.error ?? 'Conversion items request unsuccessful');
  }

  return response.data.data;
};

export const useConversionItemsQuery = () => {
  const [data, setData] = useState<PaginatedResponse<ConversionItem> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const payload = await fetchConversionItems();
      setData(payload);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { data, isLoading, error, refetch };
};
