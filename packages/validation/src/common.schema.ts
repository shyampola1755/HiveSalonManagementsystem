import { z } from 'zod';

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const dateRangeSchema = z.object({
  from: z.string().datetime().or(z.date()),
  to: z.string().datetime().or(z.date()).optional(),
});

export const searchGlobalQuerySchema = z.object({
  query: z.string().min(1, 'Search query cannot be empty').max(100),
  branchId: z.string().uuid().optional(),
  category: z.enum(['CUSTOMER', 'APPOINTMENT', 'INVOICE', 'PRODUCT', 'STAFF', 'BRANCH', 'MEMBERSHIP', 'NAVIGATION']).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});
