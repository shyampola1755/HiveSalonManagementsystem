import { z } from 'zod';

export const productUnitSchema = z.enum(['ml', 'g', 'unit', 'oz', 'bottle', 'pcs']);

export const stockMovementTypeSchema = z.enum([
  'PURCHASE',
  'SALE',
  'SERVICE_CONSUMPTION',
  'TRANSFER_OUT',
  'TRANSFER_IN',
  'ADJUSTMENT',
  'DAMAGE',
  'EXPIRY',
  'RETURN',
  'OPENING_STOCK',
]);

export const createProductSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  sku: z.string().min(2, 'SKU is required'),
  barcode: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  brand: z.string().optional().nullable(),
  costPrice: z.number().min(0, 'Cost price cannot be negative'),
  sellingPrice: z.number().min(0, 'Selling price cannot be negative'),
  retailPrice: z.number().min(0, 'Retail price cannot be negative').optional(),
  taxRate: z.number().min(0).max(100).default(18.0),
  minThreshold: z.number().int().min(0).default(5),
  isRetail: z.boolean().default(true),
  isBackbar: z.boolean().default(true),
  unit: z.string().min(1, 'Unit of measurement is required').default('pcs'),
  batchNumber: z.string().optional().nullable(),
  expiryDate: z.string().optional().nullable(),
});

export const updateProductSchema = createProductSchema.partial().extend({
  status: z.enum(['ACTIVE', 'INACTIVE', 'DISCONTINUED']).optional(),
});

export const stockAdjustmentSchema = z.object({
  branchId: z.string().min(1, 'Branch selection is required'),
  productId: z.string().min(1, 'Product selection is required'),
  movementType: z.enum(['ADJUSTMENT', 'DAMAGE', 'EXPIRY', 'RETURN', 'OPENING_STOCK']),
  quantityChange: z.number().refine((val) => val !== 0, 'Quantity change cannot be zero'),
  batchNumber: z.string().optional(),
  unitCost: z.number().min(0).optional(),
  referenceId: z.string().optional(),
  notes: z.string().min(3, 'Audit explanation is required'),
  performedByName: z.string().optional(),
});

export const createRecipeItemSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  quantity: z.number().positive('Quantity must be greater than zero'),
  unit: z.string().min(1, 'Unit is required').default('ml'),
  notes: z.string().optional().nullable(),
  isOptional: z.boolean().default(false),
});

export const createRecipeSchema = z.object({
  serviceId: z.string().min(1, 'Service is required'),
  name: z.string().min(2, 'Recipe name is required'),
  description: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  items: z.array(createRecipeItemSchema).min(1, 'Recipe must contain at least 1 product'),
});

export const serviceConsumptionSchema = z.object({
  branchId: z.string().min(1, 'Branch is required'),
  serviceId: z.string().min(1, 'Service is required'),
  appointmentId: z.string().optional().nullable(),
  invoiceId: z.string().optional().nullable(),
  stylistId: z.string().optional().nullable(),
  stylistName: z.string().optional().nullable(),
  overrides: z
    .array(
      z.object({
        productId: z.string(),
        quantityUsed: z.number().positive(),
        unit: z.string(),
        batchNumber: z.string().optional(),
      })
    )
    .optional(),
  notes: z.string().optional().nullable(),
});

export const purchaseOrderItemSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  quantityOrdered: z.number().positive('Quantity must be greater than zero'),
  unitCost: z.number().min(0, 'Unit cost cannot be negative'),
  taxRate: z.number().min(0).max(100).default(18.0),
  batchNumber: z.string().optional().nullable(),
  expiryDate: z.string().optional().nullable(),
});

export const createPurchaseOrderSchema = z.object({
  branchId: z.string().min(1, 'Branch is required'),
  vendorId: z.string().min(1, 'Vendor is required'),
  expectedDeliveryDate: z.string().optional().nullable(),
  shippingCost: z.number().min(0).default(0),
  notes: z.string().optional().nullable(),
  items: z.array(purchaseOrderItemSchema).min(1, 'Purchase order must have at least 1 item'),
});

export const receivePurchaseOrderSchema = z.object({
  receivedDate: z.string().optional(),
  receivedByName: z.string().optional(),
  notes: z.string().optional(),
  receivedItems: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantityReceived: z.number().positive(),
        batchNumber: z.string().optional(),
        expiryDate: z.string().optional(),
        unitCost: z.number().min(0).optional(),
      })
    )
    .min(1, 'Must receive at least one item'),
});

export const createVendorSchema = z.object({
  name: z.string().min(2, 'Vendor name is required'),
  code: z.string().min(2, 'Vendor code is required'),
  contactPerson: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().email('Invalid email address').optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  gstin: z.string().optional().nullable(),
  paymentTerms: z.string().default('Net 30'),
  bankDetails: z.record(z.any()).optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const branchTransferItemSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  quantityRequested: z.number().positive('Requested quantity must be greater than zero'),
});

export const createBranchTransferSchema = z.object({
  sourceBranchId: z.string().min(1, 'Source branch is required'),
  destinationBranchId: z.string().min(1, 'Destination branch is required'),
  transportMode: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  items: z.array(branchTransferItemSchema).min(1, 'Transfer must include at least 1 item'),
});
