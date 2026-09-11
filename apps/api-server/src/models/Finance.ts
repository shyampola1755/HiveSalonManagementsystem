import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IExpense extends Document {
  organizationId: Types.ObjectId;
  branchId: Types.ObjectId;
  title: string;
  category: 'RENT' | 'UTILITIES' | 'SALARY' | 'MARKETING' | 'SUPPLIES' | 'MAINTENANCE' | 'OTHER';
  amount: number;
  expenseDate: Date;
  paidVia: 'CASH' | 'BANK_TRANSFER' | 'UPI' | 'CREDIT_CARD';
  vendorName?: string;
  receiptUrl?: string;
  notes?: string;
  recordedByUserId: Types.ObjectId;
  createdAt: Date;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['RENT', 'UTILITIES', 'SALARY', 'MARKETING', 'SUPPLIES', 'MAINTENANCE', 'OTHER'],
      default: 'OTHER',
    },
    amount: { type: Number, required: true },
    expenseDate: { type: Date, required: true },
    paidVia: { type: String, enum: ['CASH', 'BANK_TRANSFER', 'UPI', 'CREDIT_CARD'], default: 'BANK_TRANSFER' },
    vendorName: { type: String },
    receiptUrl: { type: String },
    notes: { type: String },
    recordedByUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Expense = mongoose.model<IExpense>('Expense', ExpenseSchema);

export interface ICommissionPlan extends Document {
  organizationId: Types.ObjectId;
  name: string;
  tierType: 'PERCENTAGE' | 'SLAB' | 'FIXED';
  serviceRate: number;
  productRate: number;
  isActive: boolean;
}

const CommissionPlanSchema = new Schema<ICommissionPlan>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    name: { type: String, required: true, trim: true },
    tierType: { type: String, enum: ['PERCENTAGE', 'SLAB', 'FIXED'], default: 'PERCENTAGE' },
    serviceRate: { type: Number, default: 15 },
    productRate: { type: Number, default: 10 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const CommissionPlan = mongoose.model<ICommissionPlan>('CommissionPlan', CommissionPlanSchema);

export interface IMarketingCampaign extends Document {
  organizationId: Types.ObjectId;
  name: string;
  type: 'SMS' | 'WHATSAPP' | 'EMAIL';
  targetAudience: 'ALL' | 'VIP' | 'INACTIVE_30_DAYS' | 'BIRTHDAY_MONTH';
  messageTemplate: string;
  scheduledAt?: Date;
  status: 'DRAFT' | 'SCHEDULED' | 'SENT';
  sentCount: number;
  deliveredCount: number;
  createdAt: Date;
}

const MarketingCampaignSchema = new Schema<IMarketingCampaign>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ['SMS', 'WHATSAPP', 'EMAIL'], default: 'WHATSAPP' },
    targetAudience: { type: String, enum: ['ALL', 'VIP', 'INACTIVE_30_DAYS', 'BIRTHDAY_MONTH'], default: 'ALL' },
    messageTemplate: { type: String, required: true },
    scheduledAt: { type: Date },
    status: { type: String, enum: ['DRAFT', 'SCHEDULED', 'SENT'], default: 'DRAFT' },
    sentCount: { type: Number, default: 0 },
    deliveredCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const MarketingCampaign = mongoose.model<IMarketingCampaign>('MarketingCampaign', MarketingCampaignSchema);

export interface IAuditLog extends Document {
  organizationId: Types.ObjectId;
  branchId?: Types.ObjectId;
  userId?: Types.ObjectId;
  userName?: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: Schema.Types.Mixed;
  ipAddress?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String },
    action: { type: String, required: true },
    entityType: { type: String, required: true },
    entityId: { type: String },
    details: { type: Schema.Types.Mixed },
    ipAddress: { type: String },
  },
  { timestamps: true }
);

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
