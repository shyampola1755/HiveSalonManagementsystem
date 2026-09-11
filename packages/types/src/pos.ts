/**
 * Phase 7: POS, Billing, Payments & Digital Receipts Types
 */

export type PaymentMethod =
  | 'CASH'
  | 'UPI'
  | 'CARD'
  | 'WALLET'
  | 'MEMBERSHIP_CREDIT';

export type InvoiceStatus =
  | 'PAID'
  | 'PARTIALLY_PAID'
  | 'PENDING'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED'
  | 'VOID';

export interface CartItemDto {
  id: string;
  itemType: 'SERVICE' | 'PRODUCT' | 'MEMBERSHIP' | 'PACKAGE' | 'ADDON';
  itemId: string;
  itemName: string;
  itemCode?: string | null;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  totalPrice: number;
  staffId?: string | null;
  staffName?: string | null;
  commissionRate?: number;
}

export interface SplitPaymentItemDto {
  method: PaymentMethod;
  amount: number;
  transactionReference?: string | null;
  notes?: string | null;
}

export interface CheckoutPayload {
  customerId?: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
  branchId: string;
  appointmentId?: string | null;
  items: CartItemDto[];
  discountTotal?: number;
  discountType?: 'PERCENTAGE' | 'FIXED' | 'MEMBERSHIP' | 'PROMO' | null;
  discountReason?: string | null;
  membershipDiscount?: number;
  loyaltyRedeemedPoints?: number;
  loyaltyDiscountAmount?: number;
  walletDebitedAmount?: number;
  payments: SplitPaymentItemDto[];
  notes?: string | null;
  idempotencyKey?: string | null;
}

export interface PaymentRecord {
  id: string;
  invoiceId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionReference?: string | null;
  status: 'SUCCESS' | 'PENDING' | 'REFUNDED' | 'FAILED';
  isAdvance: boolean;
  createdAt: string;
}

export interface RefundRecord {
  id: string;
  invoiceId: string;
  paymentId?: string | null;
  amount: number;
  reason: string;
  refundMethod: string;
  processedBy?: string | null;
  createdAt: string;
}

export interface DigitalReceiptRecord {
  id: string;
  invoiceId: string;
  channel: 'WHATSAPP' | 'SMS' | 'EMAIL';
  recipient: string;
  status: 'QUEUED' | 'SENT' | 'FAILED';
  sentAt?: string | null;
}

export interface InvoiceDetail {
  id: string;
  organizationId: string;
  branchId: string;
  branchName?: string;
  branchCode?: string;
  branchAddress?: string;
  branchPhone?: string;
  branchGstin?: string;
  customerId?: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
  appointmentId?: string | null;
  invoiceNumber: string; // e.g. "HYD-JUB-2026-000001"
  subtotal: number;
  discountTotal: number;
  discountType?: string | null;
  discountReason?: string | null;
  membershipDiscount: number;
  loyaltyRedeemedPoints: number;
  loyaltyDiscountAmount: number;
  walletDebitedAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  taxTotal: number;
  grandTotal: number;
  paidAmount: number;
  balanceAmount: number;
  status: InvoiceStatus;
  idempotencyKey?: string | null;
  voidedAt?: string | null;
  voidReason?: string | null;
  voidedBy?: string | null;
  refundedAmount: number;
  refundReason?: string | null;
  refundedAt?: string | null;
  notes?: string | null;
  items: CartItemDto[];
  payments: PaymentRecord[];
  refunds?: RefundRecord[];
  digitalReceipts?: DigitalReceiptRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface RefundPayload {
  amount: number;
  reason: string;
  refundMethod?: 'ORIGINAL_PAYMENT' | 'CASH' | 'WALLET_CREDIT';
}

export interface VoidInvoicePayload {
  reason: string;
}

export interface DigitalReceiptPayload {
  channels: Array<'WHATSAPP' | 'SMS' | 'EMAIL'>;
  recipientPhone?: string;
  recipientEmail?: string;
}
