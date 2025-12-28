import { useCallback, useState } from 'react';
import axios from 'axios';
import { ApiResponse, ConversionItem } from '@org/models';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3333/api';

export const useUploadFileMutation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<unknown>(null);

  const mutate = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post<ApiResponse<ConversionItem>>(
        `${API_BASE}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (evt) => {
            if (!evt.total) {
              return;
            }
            setProgress(Math.round((evt.loaded / evt.total) * 100));
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.error ?? 'Upload failed');
      }

      return response.data.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { mutate, isLoading, progress, error };
};
