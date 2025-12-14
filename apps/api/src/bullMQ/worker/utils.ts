import { JobProgress } from 'bullmq';

export const PROGRESS_UPDATE_DEBOUNCE_MS = 30 * 1000;


export type CustomJobProgress = {
  percentage: number;
  timeRemaining: number;
}

export const isCustomJobProgressGuard = (
  input: JobProgress
): input is CustomJobProgress => {
  if (input === null || typeof input !== 'object') return false;

  const progress = input as Record<string, unknown>;
  return (
    typeof progress.percentage === 'number' &&
    Number.isFinite(progress.percentage) &&
    typeof progress.timeRemaining === 'number' &&
    Number.isFinite(progress.timeRemaining)
  );
};
