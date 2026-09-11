import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ICustomer extends Document {
  organizationId: Types.ObjectId;
  fullName: string;
  phone: string;
  email?: string;
  gender: 'FEMALE' | 'MALE' | 'NON_BINARY' | 'UNSPECIFIED';
  birthDate?: Date;
  anniversaryDate?: Date;
  address?: string;
  notes?: string;
  customerSource: string;
  referredByCustomerId?: Types.ObjectId;
  tags: string[];
  loyaltyPoints: number;
  walletBalance: number;
  totalSpent: number;
  totalVisits: number;
  lastVisitAt?: Date;
  preferredBranchId?: Types.ObjectId;
  preferredStylistId?: Types.ObjectId;
  hairProfile?: {
    texture?: string;
    porosity?: string;
    scalpType?: string;
    density?: string;
    curlPattern?: string;
    length?: string;
  };
  skinProfile?: {
    skinType?: string;
    undertone?: string;
    allergies?: string[];
    sensitivities?: string[];
    skinConcerns?: string[];
  };
  preferences?: {
    beverages?: string;
    quietAppointment?: boolean;
    pressurePreference?: string;
    musicPreference?: string;
  };
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    fullName: { type: String, required: true, trim: true, index: true },
    phone: { type: String, required: true, trim: true, index: true },
    email: { type: String, lowercase: true, trim: true },
    gender: { type: String, enum: ['FEMALE', 'MALE', 'NON_BINARY', 'UNSPECIFIED'], default: 'UNSPECIFIED' },
    birthDate: { type: Date },
    anniversaryDate: { type: Date },
    address: { type: String },
    notes: { type: String },
    customerSource: { type: String, default: 'WALK_IN' },
    referredByCustomerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
    tags: [{ type: String }],
    loyaltyPoints: { type: Number, default: 0 },
    walletBalance: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    totalVisits: { type: Number, default: 0 },
    lastVisitAt: { type: Date },
    preferredBranchId: { type: Schema.Types.ObjectId, ref: 'Branch' },
    preferredStylistId: { type: Schema.Types.ObjectId, ref: 'StaffProfile' },
    hairProfile: { type: Schema.Types.Mixed },
    skinProfile: { type: Schema.Types.Mixed },
    preferences: { type: Schema.Types.Mixed },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

CustomerSchema.index({ organizationId: 1, phone: 1 });
CustomerSchema.index({ organizationId: 1, fullName: 'text', phone: 'text', email: 'text' });

export const Customer = mongoose.model<ICustomer>('Customer', CustomerSchema);

// Customer Technical Notes
export interface ICustomerNote extends Document {
  customerId: Types.ObjectId;
  note: string;
  isPrivate: boolean;
  category: 'GENERAL' | 'TECH_FORMULA' | 'BEHAVIORAL' | 'MEDICAL';
  authorUserId?: Types.ObjectId;
  authorName?: string;
  createdAt: Date;
}

const CustomerNoteSchema = new Schema<ICustomerNote>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    note: { type: String, required: true },
    isPrivate: { type: Boolean, default: false },
    category: { type: String, enum: ['GENERAL', 'TECH_FORMULA', 'BEHAVIORAL', 'MEDICAL'], default: 'GENERAL' },
    authorUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    authorName: { type: String },
  },
  { timestamps: true }
);

export const CustomerNote = mongoose.model<ICustomerNote>('CustomerNote', CustomerNoteSchema);

// Customer Hair Color Formula
export interface ICustomerColorFormula extends Document {
  customerId: Types.ObjectId;
  formulaName: string;
  brand: string;
  formulaMix: string;
  developerVolume: string;
  developerRatio: string;
  processingTimeMinutes: number;
  targetHairTone?: string;
  stylistNotes?: string;
  technicianUserId?: Types.ObjectId;
  appliedAt: Date;
  createdAt: Date;
}

const CustomerColorFormulaSchema = new Schema<ICustomerColorFormula>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    formulaName: { type: String, required: true },
    brand: { type: String, required: true },
    formulaMix: { type: String, required: true },
    developerVolume: { type: String, default: '20 Vol (6%)' },
    developerRatio: { type: String, default: '1:1.5' },
    processingTimeMinutes: { type: Number, default: 35 },
    targetHairTone: { type: String },
    stylistNotes: { type: String },
    technicianUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const CustomerColorFormula = mongoose.model<ICustomerColorFormula>('CustomerColorFormula', CustomerColorFormulaSchema);

// Customer Patch Test
export interface ICustomerPatchTest extends Document {
  customerId: Types.ObjectId;
  testType: string;
  chemicalOrBrandName: string;
  testedAt: Date;
  result: 'PASSED' | 'FAILED' | 'PENDING';
  validUntil?: Date;
  technicianUserId?: Types.ObjectId;
  notes?: string;
  createdAt: Date;
}

const CustomerPatchTestSchema = new Schema<ICustomerPatchTest>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    testType: { type: String, required: true },
    chemicalOrBrandName: { type: String, required: true },
    testedAt: { type: Date, default: Date.now },
    result: { type: String, enum: ['PASSED', 'FAILED', 'PENDING'], default: 'PENDING' },
    validUntil: { type: Date },
    technicianUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    notes: { type: String },
  },
  { timestamps: true }
);

export const CustomerPatchTest = mongoose.model<ICustomerPatchTest>('CustomerPatchTest', CustomerPatchTestSchema);

// Customer Wallet & Transactions
export interface ICustomerWalletTransaction extends Document {
  customerId: Types.ObjectId;
  amount: number;
  type: 'CREDIT' | 'DEBIT' | 'CASHBACK' | 'REFUND';
  reason: string;
  balanceAfter: number;
  referenceInvoiceId?: Types.ObjectId;
  createdAt: Date;
}

const CustomerWalletTransactionSchema = new Schema<ICustomerWalletTransaction>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['CREDIT', 'DEBIT', 'CASHBACK', 'REFUND'], required: true },
    reason: { type: String, required: true },
    balanceAfter: { type: Number, required: true },
    referenceInvoiceId: { type: Schema.Types.ObjectId, ref: 'Invoice' },
  },
  { timestamps: true }
);

export const CustomerWalletTransaction = mongoose.model<ICustomerWalletTransaction>('CustomerWalletTransaction', CustomerWalletTransactionSchema);
