import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IBranch extends Document {
  organizationId: Types.ObjectId;
  stateId?: Types.ObjectId;
  districtId?: Types.ObjectId;
  cityId?: Types.ObjectId;
  name: string;
  code: string;
  address: string;
  phone: string;
  email?: string;
  managerUserId?: Types.ObjectId;
  operatingHours?: Record<string, { open: string; close: string; isOpen: boolean }>;
  openingDate?: Date;
  status: 'ACTIVE' | 'INACTIVE' | 'RENOVATING';
  isActive: boolean;
  isMainBranch: boolean;
  logoUrl?: string;
  taxConfig?: {
    gstNumber?: string;
    taxRate?: number;
  };
  invoiceConfig?: {
    prefix: string;
    nextNumber: number;
    footerNote?: string;
  };
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BranchSchema = new Schema<IBranch>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    stateId: { type: Schema.Types.ObjectId, ref: 'State' },
    districtId: { type: Schema.Types.ObjectId, ref: 'District' },
    cityId: { type: Schema.Types.ObjectId, ref: 'City', index: true },
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, uppercase: true, trim: true },
    address: { type: String, required: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    managerUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    operatingHours: { type: Schema.Types.Mixed },
    openingDate: { type: Date },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE', 'RENOVATING'], default: 'ACTIVE' },
    isActive: { type: Boolean, default: true, index: true },
    isMainBranch: { type: Boolean, default: false },
    logoUrl: { type: String },
    taxConfig: {
      gstNumber: { type: String },
      taxRate: { type: Number, default: 18 },
    },
    invoiceConfig: {
      prefix: { type: String, default: 'INV' },
      nextNumber: { type: Number, default: 1001 },
      footerNote: { type: String, default: 'Thank you for choosing Hive Salon!' },
    },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

BranchSchema.index({ organizationId: 1, code: 1 }, { unique: true });

export const Branch = mongoose.model<IBranch>('Branch', BranchSchema);
