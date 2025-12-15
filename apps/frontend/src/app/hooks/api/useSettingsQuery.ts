import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

export type Settings = Record<string, unknown>;

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3333/api';

const fetchSettings = async (): Promise<Settings> => {
  const response = await axios.get<Settings>(`${API_BASE}/settings`);
  return response.data;
};

export const useSettingsQuery = () => {
  const [data, setData] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = await fetchSettings();
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
