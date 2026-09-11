import { z } from 'zod';

export const cartItemSchema = z.object({
  id: z.string().min(1),
  itemType: z.enum(['SERVICE', 'PRODUCT', 'MEMBERSHIP', 'PACKAGE', 'ADDON']),
  itemId: z.string().min(1),
  itemName: z.string().min(1),
  itemCode: z.string().optional().nullable(),
  quantity: z.number().int().positive().default(1),
  unitPrice: z.number().min(0),
  discount: z.number().min(0).default(0),
  tax: z.number().min(0).default(0),
  totalPrice: z.number().min(0),
  staffId: z.string().optional().nullable(),
  staffName: z.string().optional().nullable(),
  commissionRate: z.number().min(0).max(100).optional(),
});

export const splitPaymentItemSchema = z.object({
  method: z.enum(['CASH', 'UPI', 'CARD', 'WALLET', 'MEMBERSHIP_CREDIT']),
  amount: z.number().positive('Payment amount must be greater than 0'),
  transactionReference: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const checkoutSchema = z.object({
  customerId: z.string().optional().nullable(),
  customerName: z.string().optional().nullable(),
  customerPhone: z.string().optional().nullable(),
  branchId: z.string().min(1, 'Branch selection is required'),
  appointmentId: z.string().optional().nullable(),
  items: z.array(cartItemSchema).min(1, 'Cart must contain at least 1 item'),
  discountTotal: z.number().min(0).optional().default(0),
  discountType: z.enum(['PERCENTAGE', 'FIXED', 'MEMBERSHIP', 'PROMO']).optional().nullable(),
  discountReason: z.string().optional().nullable(),
  membershipDiscount: z.number().min(0).optional().default(0),
  loyaltyRedeemedPoints: z.number().int().min(0).optional().default(0),
  loyaltyDiscountAmount: z.number().min(0).optional().default(0),
  walletDebitedAmount: z.number().min(0).optional().default(0),
  payments: z.array(splitPaymentItemSchema).min(1, 'At least one payment entry is required'),
  notes: z.string().max(500).optional().nullable(),
  idempotencyKey: z.string().optional().nullable(),
});

export const refundSchema = z.object({
  amount: z.number().positive('Refund amount must be greater than 0'),
  reason: z.string().min(3, 'Refund reason is required'),
  refundMethod: z.enum(['ORIGINAL_PAYMENT', 'CASH', 'WALLET_CREDIT']).optional().default('ORIGINAL_PAYMENT'),
});

export const voidInvoiceSchema = z.object({
  reason: z.string().min(3, 'Void authorization reason is required'),
});

export const digitalReceiptSchema = z.object({
  channels: z.array(z.enum(['WHATSAPP', 'SMS', 'EMAIL'])).min(1),
  recipientPhone: z.string().optional(),
  recipientEmail: z.string().email().optional(),
});
