import mongoose, { Document, Schema } from 'mongoose';

export interface IOrganization extends Document {
  name: string;
  legalName?: string;
  code: string;
  businessType: 'SALON' | 'SPA' | 'AESTHETIC_CLINIC' | 'CHAIN';
  logoUrl?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  country: string;
  currency: string;
  timezone: string;
  taxSettings?: {
    gstEnabled: boolean;
    defaultGSTRate: number;
    gstinNumber?: string;
    taxInclusivePrices: boolean;
  };
  businessHours?: Record<string, { open: string; close: string; isOpen: boolean }>;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  isSetupComplete: boolean;
  setupStep: number;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema = new Schema<IOrganization>(
  {
    name: { type: String, required: true, trim: true },
    legalName: { type: String, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    businessType: { type: String, enum: ['SALON', 'SPA', 'AESTHETIC_CLINIC', 'CHAIN'], default: 'SALON' },
    logoUrl: { type: String },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    website: { type: String, trim: true },
    address: { type: String },
    country: { type: String, default: 'India' },
    currency: { type: String, default: 'INR' },
    timezone: { type: String, default: 'Asia/Kolkata' },
    taxSettings: {
      gstEnabled: { type: Boolean, default: true },
      defaultGSTRate: { type: Number, default: 18 },
      gstinNumber: { type: String },
      taxInclusivePrices: { type: Boolean, default: true },
    },
    businessHours: { type: Schema.Types.Mixed },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'], default: 'ACTIVE' },
    isSetupComplete: { type: Boolean, default: true },
    setupStep: { type: Number, default: 5 },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

OrganizationSchema.index({ code: 1, status: 1 });

export const Organization = mongoose.model<IOrganization>('Organization', OrganizationSchema);
