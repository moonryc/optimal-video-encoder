import { useQuery } from '@tanstack/react-query';

export type Settings = Record<string, unknown>;

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3333/api';

const fetchSettings = async (): Promise<Settings> => {
  const response = await fetch(`${API_BASE}/settings`);

  if (!response.ok) {
    throw new Error('Failed to fetch settings');
  }

  return response.json() as Promise<Settings>;
};

export const useSettingsQuery = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: fetchSettings,
  });
};
