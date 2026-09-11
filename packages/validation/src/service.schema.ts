import { z } from 'zod';

export const serviceCategorySchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Category name must be at least 2 characters.' })
    .max(50, { message: 'Category name cannot exceed 50 characters.' }),
  description: z.string().max(255).optional().or(z.literal('')),
  icon: z.string().optional(),
  color: z.string().optional(),
  sortOrder: z.coerce.number().default(0),
});

export const serviceAddonSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Add-on name must be at least 2 characters.' })
    .max(100, { message: 'Add-on name cannot exceed 100 characters.' }),
  description: z.string().max(255).optional().or(z.literal('')),
  durationMinutes: z.coerce.number().min(0).max(180).default(15),
  price: z.coerce.number().min(0, { message: 'Price cannot be negative.' }),
  isActive: z.boolean().default(true),
});

export const branchPricingSchema = z.object({
  branchId: z.string().min(1, { message: 'Branch ID is required.' }),
  price: z.coerce.number().min(0, { message: 'Price cannot be negative.' }),
  durationMinutes: z.coerce.number().optional(),
  isAvailable: z.boolean().default(true),
});

export const createServiceSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Service name must be at least 2 characters.' })
    .max(120, { message: 'Service name cannot exceed 120 characters.' }),
  categoryId: z.string().min(1, { message: 'Please select a service category.' }),
  customerDescription: z.string().max(1000).optional().or(z.literal('')),
  internalNotes: z.string().max(1000).optional().or(z.literal('')),
  durationMinutes: z.coerce
    .number()
    .min(5, { message: 'Minimum duration is 5 minutes.' })
    .max(480, { message: 'Duration cannot exceed 8 hours.' }),
  bufferMinutes: z.coerce.number().min(0).max(60).default(10),
  basePrice: z.coerce.number().min(0, { message: 'Base price cannot be negative.' }),
  taxRate: z.coerce.number().min(0).max(100).default(18.0),
  imageUrl: z.string().url().optional().or(z.literal('')),
  status: z.enum(['ACTIVE', 'INACTIVE', 'DRAFT']).default('ACTIVE'),
  genderTarget: z.enum(['ALL', 'FEMALE', 'MALE', 'KIDS']).default('ALL'),
  onlineBookingEnabled: z.boolean().default(true),
});

export const updateServiceSchema = createServiceSchema.partial();

export const serviceWizardSchema = createServiceSchema.extend({
  branchPricings: z.array(branchPricingSchema).optional().default([]),
  staffIds: z.array(z.string()).optional().default([]),
  availableBranchIds: z.array(z.string()).optional().default([]),
  addons: z.array(serviceAddonSchema).optional().default([]),
});
