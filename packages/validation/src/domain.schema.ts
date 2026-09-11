import { z } from 'zod';

export const stateSchema = z.object({
  name: z.string().min(2, 'State name is required').max(100),
  code: z.string().min(2, 'State code is required (e.g. TS, MH, KA)').max(10).toUpperCase(),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

export const districtSchema = z.object({
  stateId: z.string().uuid('State is required'),
  name: z.string().min(2, 'District name is required').max(100),
  code: z.string().min(2, 'District code is required').max(20).toUpperCase(),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

export const citySchema = z.object({
  stateId: z.string().uuid('State is required'),
  districtId: z.string().uuid('District is required'),
  name: z.string().min(2, 'City name is required').max(100),
  code: z.string().min(2, 'City code is required').max(20).toUpperCase(),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

export const branchSchema = z.object({
  name: z.string().min(2, 'Branch name is required'),
  code: z.string().min(2, 'Branch code is required (e.g. JH-01)'),
  stateId: z.string().uuid().optional().or(z.literal('')),
  districtId: z.string().uuid().optional().or(z.literal('')),
  cityId: z.string().uuid().optional().or(z.literal('')),
  address: z.string().min(5, 'Address is required'),
  phone: z.string().min(7, 'Contact phone is required'),
  email: z.string().email().optional().or(z.literal('')),
  managerUserId: z.string().uuid().optional().or(z.literal('')),
  openingDate: z.string().optional().or(z.literal('')),
  status: z.enum(['ACTIVE', 'INACTIVE', 'UNDER_RENOVATION']).default('ACTIVE'),
  isMainBranch: z.boolean().default(false),
  taxConfig: z.record(z.any()).optional(),
  invoiceConfig: z.record(z.any()).optional(),
});

export const organizationSettingsSchema = z.object({
  name: z.string().min(2, 'Business name is required'),
  legalName: z.string().max(150).optional(),
  businessType: z.string().min(2),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().min(7).optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  country: z.string().default('India'),
  currency: z.string().default('INR'),
  timezone: z.string().default('Asia/Kolkata'),
  taxSettings: z.object({
    gstin: z.string().optional(),
    taxRatePercentage: z.number().min(0).max(100).default(18),
    enableCompositionScheme: z.boolean().default(false),
  }).optional(),
  businessHours: z.record(z.any()).optional(),
});

export const customerSchema = z.object({
  fullName: z.string().min(2, 'Customer full name is required').max(100),
  phone: z.string().min(7, 'Phone number must have at least 7 digits').max(20),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  gender: z.enum(['FEMALE', 'MALE', 'OTHER', 'UNSPECIFIED']).default('UNSPECIFIED'),
  birthDate: z.string().optional().or(z.literal('')),
  notes: z.string().max(500).optional(),
  preferredBranchId: z.string().uuid().optional().or(z.literal('')),
});

export const serviceSchema = z.object({
  name: z.string().min(2, 'Service name is required').max(100),
  categoryId: z.string().min(1, 'Category is required'),
  durationMinutes: z.number().int().min(5, 'Minimum duration is 5 minutes'),
  bufferMinutes: z.number().int().min(0).default(0),
  basePrice: z.number().min(0, 'Base price cannot be negative'),
  taxRate: z.number().min(0).max(100).default(18),
  description: z.string().max(500).optional(),
  genderTarget: z.enum(['ALL', 'FEMALE', 'MALE']).default('ALL'),
});
