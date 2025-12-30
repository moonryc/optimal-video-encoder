import { useCallback, useState } from 'react';
import axios from 'axios';
import { ApiResponse } from '@org/models';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3333/api';

interface DeleteConversionItemsResult {
  deletedCount: number;
  deletedIds: string[];
}

export const useDeleteConversionItemsMutation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const mutate = useCallback(async (ids: string[]) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.delete<ApiResponse<DeleteConversionItemsResult>>(
        `${API_BASE}/conversion-items`,
        { data: { ids } }
      );

      if (!response.data.success) {
        throw new Error(response.data.error ?? 'Delete failed');
      }

      return response.data.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { mutate, isLoading, error };
};
