export enum ConversionStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED"
}

export type ConversionItem = {
  id: string;
  progress: number;
  timeRemaining: number;
  path: string;
  duration: number;
  is4k: boolean;
  error?: string | null;
  status: ConversionStatus;
  startedAt?: Date | null;
  erroredAt?: Date | null;
  deletedAt?: Date | null;
  stallCounter: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  searchTerm?: string;
}
