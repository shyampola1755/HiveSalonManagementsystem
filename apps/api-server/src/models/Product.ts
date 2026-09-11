import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IProductCategory extends Document {
  organizationId: Types.ObjectId;
  name: string;
  description?: string;
  isActive: boolean;
}

const ProductCategorySchema = new Schema<IProductCategory>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ProductCategorySchema.index({ organizationId: 1, name: 1 }, { unique: true });

export const ProductCategory = mongoose.model<IProductCategory>('ProductCategory', ProductCategorySchema);

export interface IVendor extends Document {
  organizationId: Types.ObjectId;
  name: string;
  contactPerson?: string;
  phone: string;
  email?: string;
  address?: string;
  gstNumber?: string;
  isActive: boolean;
}

const VendorSchema = new Schema<IVendor>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    name: { type: String, required: true, trim: true },
    contactPerson: { type: String },
    phone: { type: String, required: true },
    email: { type: String },
    address: { type: String },
    gstNumber: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Vendor = mongoose.model<IVendor>('Vendor', VendorSchema);

export interface IProduct extends Document {
  organizationId: Types.ObjectId;
  categoryId: Types.ObjectId;
  vendorId?: Types.ObjectId;
  name: string;
  sku: string;
  barcode?: string;
  brand: string;
  unit: string; // "ml", "g", "pcs", "bottle"
  costPrice: number;
  retailPrice: number;
  taxRate: number;
  isRetailItem: boolean;
  isProfessionalUse: boolean;
  minStockThreshold: number;
  stockLevels: Array<{
    branchId: Types.ObjectId;
    quantity: number;
  }>;
  status: 'ACTIVE' | 'DISCONTINUED';
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'ProductCategory', required: true, index: true },
    vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor' },
    name: { type: String, required: true, trim: true, index: true },
    sku: { type: String, required: true, trim: true },
    barcode: { type: String, trim: true },
    brand: { type: String, required: true, trim: true },
    unit: { type: String, default: 'pcs' },
    costPrice: { type: Number, required: true },
    retailPrice: { type: Number, required: true },
    taxRate: { type: Number, default: 18 },
    isRetailItem: { type: Boolean, default: true },
    isProfessionalUse: { type: Boolean, default: true },
    minStockThreshold: { type: Number, default: 5 },
    stockLevels: [
      {
        branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
        quantity: { type: Number, default: 0 },
      },
    ],
    status: { type: String, enum: ['ACTIVE', 'DISCONTINUED'], default: 'ACTIVE' },
  },
  { timestamps: true }
);

ProductSchema.index({ organizationId: 1, sku: 1 }, { unique: true });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);

// Stock Ledger Entry (audit log of inventory movement)
export interface IStockLedgerEntry extends Document {
  organizationId: Types.ObjectId;
  branchId: Types.ObjectId;
  productId: Types.ObjectId;
  movementType: 'PURCHASE' | 'SALE' | 'SERVICE_CONSUMPTION' | 'TRANSFER_IN' | 'TRANSFER_OUT' | 'ADJUSTMENT' | 'DAMAGE';
  quantityChange: number;
  quantityAfter: number;
  referenceId?: string; // InvoiceId, PurchaseOrderId, TransferId
  notes?: string;
  performedByUserId: Types.ObjectId;
  createdAt: Date;
}

const StockLedgerEntrySchema = new Schema<IStockLedgerEntry>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    movementType: {
      type: String,
      enum: ['PURCHASE', 'SALE', 'SERVICE_CONSUMPTION', 'TRANSFER_IN', 'TRANSFER_OUT', 'ADJUSTMENT', 'DAMAGE'],
      required: true,
    },
    quantityChange: { type: Number, required: true },
    quantityAfter: { type: Number, required: true },
    referenceId: { type: String },
    notes: { type: String },
    performedByUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const StockLedgerEntry = mongoose.model<IStockLedgerEntry>('StockLedgerEntry', StockLedgerEntrySchema);
