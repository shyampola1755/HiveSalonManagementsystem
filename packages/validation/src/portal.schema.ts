import { z } from 'zod';

export const portalOtpRequestSchema = z.object({
  mobile: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
});

export const portalOtpVerifySchema = z.object({
  mobile: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

export const portalBookingSchema = z.object({
  branchId: z.string().min(1, 'Please select a salon branch'),
  serviceId: z.string().min(1, 'Please select a service'),
  stylistId: z.string().min(1, 'Please select a stylist'),
  appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  timeSlot: z.string().min(1, 'Please select a time slot'),
  notes: z.string().max(300, 'Notes cannot exceed 300 characters').optional(),
  paymentMode: z.enum(['PAY_AT_VENUE', 'ONLINE_UPI', 'ONLINE_CARD', 'WALLET_ONLY']),
  walletDeduction: z.number().min(0).default(0),
  loyaltyPointsRedeemed: z.number().min(0).default(0),
  couponCode: z.string().optional(),
});

export const portalRescheduleSchema = z.object({
  appointmentId: z.string().min(1, 'Appointment ID required'),
  newDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  newTimeSlot: z.string().min(1, 'Please select a time slot'),
  reason: z.string().max(200).optional(),
});

export const portalCancelSchema = z.object({
  appointmentId: z.string().min(1, 'Appointment ID required'),
  reason: z.string().min(5, 'Please provide a cancellation reason (minimum 5 characters)'),
  agreeToPolicy: z.literal(true, {
    errorMap: () => ({ message: 'You must acknowledge the cancellation policy' }),
  }),
});

export const portalWalletRechargeSchema = z.object({
  amount: z.number().min(100, 'Minimum recharge is ₹100').max(50000, 'Maximum recharge is ₹50,000'),
  paymentMethod: z.enum(['UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'NET_BANKING']),
  promoCode: z.string().optional(),
});

export const portalReviewSchema = z.object({
  appointmentId: z.string().min(1, 'Appointment ID required'),
  overallRating: z.number().min(1).max(5),
  cleanlinessRating: z.number().min(1).max(5),
  stylistRating: z.number().min(1).max(5),
  ambianceRating: z.number().min(1).max(5),
  comment: z.string().max(500, 'Comment cannot exceed 500 characters').optional(),
  wouldRecommend: z.boolean().default(true),
});
