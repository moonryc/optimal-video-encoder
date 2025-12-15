import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { Settings } from './useSettingsQuery';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3333/api';

const updateSettings = async (nextSettings: Settings): Promise<Settings> => {
  const response = await fetch(`${API_BASE}/settings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(nextSettings),
  });

  if (!response.ok) {
    throw new Error('Failed to update settings');
  }

  return response.json() as Promise<Settings>;
};

export const useUpdateSettingsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(['settings'], data);
      void queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
};
