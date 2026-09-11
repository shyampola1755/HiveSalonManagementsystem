import { z } from 'zod';

export const businessProfileSetupSchema = z.object({
  businessName: z.string().min(2, 'Business name must have at least 2 characters').max(100),
  businessType: z.enum(['SALON', 'SPA', 'AESTHETIC_CLINIC', 'WELLNESS_CENTER', 'CHAIN']),
  currency: z.string().length(3, 'Currency must be a 3-letter ISO code (e.g. USD, INR)'),
  timezone: z.string().min(2, 'Timezone is required'),
  taxNumber: z.string().max(50).optional(),
  phone: z.string().min(7, 'Please enter a valid business phone number'),
  email: z.string().email('Please enter a valid business email address'),
});

export const locationSetupSchema = z.object({
  branchName: z.string().min(2, 'Branch name is required'),
  branchCode: z.string().min(2, 'Branch code is required (e.g. DOWNTOWN-01)'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().min(2, 'Country is required'),
  phone: z.string().min(7, 'Branch contact phone is required'),
  operatingHours: z.object({
    open: z.string().default('09:00'),
    close: z.string().default('20:00'),
    isOpenEveryday: z.boolean().default(true),
  }),
});

export const serviceItemSchema = z.object({
  name: z.string().min(2, 'Service name is required'),
  duration: z.number().int().min(5, 'Duration must be at least 5 minutes'),
  price: z.number().min(0, 'Price must be 0 or positive'),
});

export const serviceSetupSchema = z.object({
  categories: z.array(
    z.object({
      name: z.string().min(2, 'Category name is required'),
      services: z.array(serviceItemSchema).min(1, 'Add at least one service to this category'),
    })
  ).min(1, 'Please configure at least one service category'),
});

export const staffMemberSchema = z.object({
  fullName: z.string().min(2, 'Staff member name is required'),
  role: z.string().min(2, 'Staff role is required'),
  email: z.string().email('Valid email is required for staff login'),
  phone: z.string().optional(),
});

export const staffSetupSchema = z.object({
  staffMembers: z.array(staffMemberSchema).min(1, 'Please add at least one staff member or administrator'),
});

export const productItemSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  sku: z.string().min(2, 'SKU code is required'),
  costPrice: z.number().min(0),
  retailPrice: z.number().min(0),
  initialStock: z.number().int().min(0),
});

export const productSetupSchema = z.object({
  products: z.array(productItemSchema),
});

export const paymentSetupSchema = z.object({
  acceptedMethods: z.array(z.string()).min(1, 'Select at least one accepted payment method'),
  taxRatePercentage: z.number().min(0).max(100).default(0),
  invoicePrefix: z.string().min(1).max(10).default('INV-'),
});

export const completeSetupPayloadSchema = z.object({
  business: businessProfileSetupSchema,
  location: locationSetupSchema,
  services: serviceSetupSchema,
  staff: staffSetupSchema,
  products: productSetupSchema,
  payments: paymentSetupSchema,
});
