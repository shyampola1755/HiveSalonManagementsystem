import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IInvoiceItem {
  itemType: 'SERVICE' | 'PRODUCT' | 'PACKAGE' | 'MEMBERSHIP';
  itemId: Types.ObjectId;
  name: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  staffId?: Types.ObjectId;
  staffName?: string;
  commissionAmount?: number;
}

export interface IPaymentRecord {
  method: 'CASH' | 'CARD' | 'UPI' | 'WALLET' | 'LOYALTY_POINTS' | 'SPLIT';
  amount: number;
  transactionRef?: string;
  paidAt: Date;
}

export interface IInvoice extends Document {
  organizationId: Types.ObjectId;
  branchId: Types.ObjectId;
  invoiceNumber: string;
  appointmentId?: Types.ObjectId;
  customerId: Types.ObjectId;
  customerName: string;
  customerPhone: string;
  cashierUserId: Types.ObjectId;
  cashierName: string;
  items: IInvoiceItem[];
  subtotal: number;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  discountAmount: number;
  couponCode?: string;
  taxAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  tipAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  paymentStatus: 'PAID' | 'PARTIAL' | 'UNPAID' | 'REFUNDED' | 'VOID';
  payments: IPaymentRecord[];
  notes?: string;
  refundReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceSchema = new Schema<IInvoice>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
    invoiceNumber: { type: String, required: true },
    appointmentId: { type: Schema.Types.ObjectId, ref: 'Appointment' },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    cashierUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    cashierName: { type: String, required: true },
    items: [
      {
        itemType: { type: String, enum: ['SERVICE', 'PRODUCT', 'PACKAGE', 'MEMBERSHIP'], required: true },
        itemId: { type: Schema.Types.ObjectId, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, default: 1 },
        unitPrice: { type: Number, required: true },
        discountAmount: { type: Number, default: 0 },
        taxRate: { type: Number, default: 18 },
        taxAmount: { type: Number, default: 0 },
        totalAmount: { type: Number, required: true },
        staffId: { type: Schema.Types.ObjectId, ref: 'StaffProfile' },
        staffName: { type: String },
        commissionAmount: { type: Number, default: 0 },
      },
    ],
    subtotal: { type: Number, required: true },
    discountType: { type: String, enum: ['PERCENTAGE', 'FIXED'], default: 'FIXED' },
    discountValue: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    couponCode: { type: String },
    taxAmount: { type: Number, default: 0 },
    cgstAmount: { type: Number, default: 0 },
    sgstAmount: { type: Number, default: 0 },
    tipAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    balanceAmount: { type: Number, default: 0 },
    paymentStatus: {
      type: String,
      enum: ['PAID', 'PARTIAL', 'UNPAID', 'REFUNDED', 'VOID'],
      default: 'PAID',
      index: true,
    },
    payments: [
      {
        method: { type: String, enum: ['CASH', 'CARD', 'UPI', 'WALLET', 'LOYALTY_POINTS', 'SPLIT'], required: true },
        amount: { type: Number, required: true },
        transactionRef: { type: String },
        paidAt: { type: Date, default: Date.now },
      },
    ],
    notes: { type: String },
    refundReason: { type: String },
  },
  { timestamps: true }
);

InvoiceSchema.index({ organizationId: 1, invoiceNumber: 1 }, { unique: true });
InvoiceSchema.index({ branchId: 1, createdAt: -1 });

export const Invoice = mongoose.model<IInvoice>('Invoice', InvoiceSchema);
