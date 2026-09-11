import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IServiceCategory extends Document {
  organizationId: Types.ObjectId;
  name: string;
  slug?: string;
  description?: string;
  icon?: string;
  color?: string;
  sortOrder: number;
  isActive: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceCategorySchema = new Schema<IServiceCategory>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, lowercase: true, trim: true },
    description: { type: String },
    icon: { type: String, default: 'Scissors' },
    color: { type: String, default: '#f59e0b' },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

ServiceCategorySchema.index({ organizationId: 1, name: 1 }, { unique: true });

export const ServiceCategory = mongoose.model<IServiceCategory>('ServiceCategory', ServiceCategorySchema);

export interface IServiceAddon {
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
  isActive: boolean;
}

export interface IServiceRecipeItem {
  productId: Types.ObjectId;
  productName: string;
  quantity: number;
  unit: string;
  costPerUnit: number;
}

export interface IService extends Document {
  organizationId: Types.ObjectId;
  categoryId: Types.ObjectId;
  name: string;
  customerDescription?: string;
  internalNotes?: string;
  durationMinutes: number;
  bufferMinutes: number;
  basePrice: number;
  taxRate: number;
  imageUrl?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  genderTarget: 'ALL' | 'FEMALE' | 'MALE' | 'KIDS';
  onlineBookingEnabled: boolean;
  addons: IServiceAddon[];
  recipe: IServiceRecipeItem[];
  branchPricing: Array<{
    branchId: Types.ObjectId;
    price: number;
    durationMinutes?: number;
    isAvailable: boolean;
  }>;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'ServiceCategory', required: true, index: true },
    name: { type: String, required: true, trim: true, index: true },
    customerDescription: { type: String },
    internalNotes: { type: String },
    durationMinutes: { type: Number, default: 30 },
    bufferMinutes: { type: Number, default: 10 },
    basePrice: { type: Number, required: true },
    taxRate: { type: Number, default: 18.0 },
    imageUrl: { type: String },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE', 'DRAFT'], default: 'ACTIVE', index: true },
    genderTarget: { type: String, enum: ['ALL', 'FEMALE', 'MALE', 'KIDS'], default: 'ALL' },
    onlineBookingEnabled: { type: Boolean, default: true },
    addons: [
      {
        name: { type: String, required: true },
        description: { type: String },
        durationMinutes: { type: Number, default: 15 },
        price: { type: Number, required: true },
        isActive: { type: Boolean, default: true },
      },
    ],
    recipe: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product' },
        productName: { type: String, required: true },
        quantity: { type: Number, required: true },
        unit: { type: String, required: true },
        costPerUnit: { type: Number, default: 0 },
      },
    ],
    branchPricing: [
      {
        branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true },
        price: { type: Number, required: true },
        durationMinutes: { type: Number },
        isAvailable: { type: Boolean, default: true },
      },
    ],
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

ServiceSchema.index({ organizationId: 1, name: 'text' });

export const Service = mongoose.model<IService>('Service', ServiceSchema);
