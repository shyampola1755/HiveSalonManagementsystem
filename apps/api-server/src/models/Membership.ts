import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IMembershipTier extends Document {
  organizationId: Types.ObjectId;
  name: string;
  code: string;
  price: number;
  validityDays: number;
  discountPercentage: number;
  freeServicesCount: number;
  perks: string[];
  colorTheme?: string;
  isActive: boolean;
}

const MembershipTierSchema = new Schema<IMembershipTier>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, uppercase: true, trim: true },
    price: { type: Number, required: true },
    validityDays: { type: Number, default: 365 },
    discountPercentage: { type: Number, default: 15 },
    freeServicesCount: { type: Number, default: 2 },
    perks: [{ type: String }],
    colorTheme: { type: String, default: '#f59e0b' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const MembershipTier = mongoose.model<IMembershipTier>('MembershipTier', MembershipTierSchema);

export interface ICustomerMembership extends Document {
  organizationId: Types.ObjectId;
  customerId: Types.ObjectId;
  tierId: Types.ObjectId;
  tierName: string;
  startDate: Date;
  expiryDate: Date;
  pricePaid: number;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  createdAt: Date;
}

const CustomerMembershipSchema = new Schema<ICustomerMembership>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    tierId: { type: Schema.Types.ObjectId, ref: 'MembershipTier', required: true },
    tierName: { type: String, required: true },
    startDate: { type: Date, default: Date.now },
    expiryDate: { type: Date, required: true },
    pricePaid: { type: Number, required: true },
    status: { type: String, enum: ['ACTIVE', 'EXPIRED', 'CANCELLED'], default: 'ACTIVE', index: true },
  },
  { timestamps: true }
);

export const CustomerMembership = mongoose.model<ICustomerMembership>('CustomerMembership', CustomerMembershipSchema);

// Customer Package Model
export interface ICustomerPackageModel extends Document {
  organizationId: Types.ObjectId;
  customerId: Types.ObjectId;
  packageName: string;
  totalSessions: number;
  usedSessions: number;
  remainingSessions: number;
  totalPrice: number;
  status: 'ACTIVE' | 'COMPLETED' | 'EXPIRED';
  expiresAt?: Date;
  purchasedAt: Date;
}

const CustomerPackageModelSchema = new Schema<ICustomerPackageModel>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    packageName: { type: String, required: true },
    totalSessions: { type: Number, required: true },
    usedSessions: { type: Number, default: 0 },
    remainingSessions: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['ACTIVE', 'COMPLETED', 'EXPIRED'], default: 'ACTIVE' },
    expiresAt: { type: Date },
    purchasedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const CustomerPackage = mongoose.model<ICustomerPackageModel>('CustomerPackage', CustomerPackageModelSchema);

// Loyalty Ledger
export interface ILoyaltyPointsLedger extends Document {
  organizationId: Types.ObjectId;
  customerId: Types.ObjectId;
  pointsChange: number;
  pointsAfter: number;
  type: 'EARNED' | 'REDEEMED' | 'BONUS' | 'ADJUSTMENT' | 'EXPIRED';
  reason: string;
  referenceInvoiceId?: Types.ObjectId;
  createdAt: Date;
}

const LoyaltyPointsLedgerSchema = new Schema<ILoyaltyPointsLedger>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    pointsChange: { type: Number, required: true },
    pointsAfter: { type: Number, required: true },
    type: { type: String, enum: ['EARNED', 'REDEEMED', 'BONUS', 'ADJUSTMENT', 'EXPIRED'], required: true },
    reason: { type: String, required: true },
    referenceInvoiceId: { type: Schema.Types.ObjectId, ref: 'Invoice' },
  },
  { timestamps: true }
);

export const LoyaltyPointsLedger = mongoose.model<ILoyaltyPointsLedger>('LoyaltyPointsLedger', LoyaltyPointsLedgerSchema);
