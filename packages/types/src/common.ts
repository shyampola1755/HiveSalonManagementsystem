/**
 * Universal Common & API Types
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  meta?: PaginationMeta | null;
  error?: ApiError | null;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  fieldErrors?: Record<string, string>;
  details?: unknown;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DateRange {
  from: string | Date;
  to?: string | Date;
}

export interface SelectOption<T = string> {
  label: string;
  value: T;
  description?: string;
  disabled?: boolean;
  icon?: string;
}

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: string | number;
  disabled?: boolean;
  children?: NavItem[];
  requiredPermissions?: string[];
}
