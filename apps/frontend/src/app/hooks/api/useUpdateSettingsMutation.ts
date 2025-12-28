import axios from 'axios';
import { useCallback, useState } from 'react';

import type { Settings } from './useSettingsQuery';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3333/api';

const updateSettings = async (nextSettings: Settings): Promise<Settings> => {
  const response = await axios.post<Settings>(`${API_BASE}/settings`, nextSettings);
  return response.data;
};

export const useUpdateSettingsMutation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const mutate = useCallback(async (nextSettings: Settings) => {
    setIsLoading(true);
    setError(null);

    try {
      return await updateSettings(nextSettings);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { mutate, isLoading, error };
};
