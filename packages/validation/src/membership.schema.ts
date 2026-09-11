import { z } from 'zod';

export const MembershipTypeEnum = z.enum([
  'DISCOUNT',
  'PREPAID_CREDIT',
  'SERVICE_PACKAGE',
  'FAMILY_PACKAGE',
  'MONTHLY_PLAN',
  'ANNUAL_PLAN',
]);

export const MembershipStatusEnum = z.enum([
  'ACTIVE',
  'EXPIRED',
  'FROZEN',
  'CANCELLED',
]);

export const WalletLedgerTypeEnum = z.enum([
  'OPENING_BALANCE',
  'TOPUP_CASH',
  'TOPUP_UPI',
  'TOPUP_CARD',
  'DEBIT_POS',
  'PROMOTIONAL_CREDIT',
  'REFUND_CREDIT',
  'EXPIRY_WRITEOFF',
  'ADJUSTMENT',
]);

export const LoyaltyTierCodeEnum = z.enum(['BRONZE', 'SILVER', 'GOLD', 'PLATINUM']);

export const LoyaltyPointsLedgerTypeEnum = z.enum([
  'EARNED_INVOICE',
  'REDEEMED_POS',
  'BONUS_CAMPAIGN',
  'REFERRAL_BONUS',
  'EXPIRY_WRITEOFF',
  'TIER_UPGRADE_BONUS',
  'ADJUSTMENT',
]);

export const FamilyRelationshipEnum = z.enum([
  'SPOUSE',
  'CHILD',
  'PARENT',
  'SIBLING',
  'PARTNER',
  'OTHER',
]);

export const createMembershipPlanSchema = z.object({
  name: z.string().min(2, 'Plan name must be at least 2 characters'),
  code: z.string().min(2, 'Code must be at least 2 characters').toUpperCase(),
  type: MembershipTypeEnum,
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be non-negative'),
  validityDays: z.number().int().min(1, 'Validity must be at least 1 day'),
  discountPercentage: z.number().min(0).max(100, 'Discount must be between 0 and 100%'),
  walletCreditsIncluded: z.number().min(0).default(0),
  loyaltyBonusPoints: z.number().int().min(0).default(0),
  allowFamilySharing: z.boolean().default(false),
  maxFamilyMembers: z.number().int().min(1).default(1),
  eligibleCategories: z.array(z.string()).optional(),
  perks: z.array(z.string()).optional(),
  color: z.string().optional(),
});

export const enrollCustomerMembershipSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  planId: z.string().min(1, 'Plan is required'),
  pricePaid: z.number().min(0).optional(),
  startDate: z.string().optional(),
  validityDays: z.number().int().min(1).optional(),
  notes: z.string().optional(),
  autoRenew: z.boolean().default(false),
});

export const createPackageTemplateSchema = z.object({
  name: z.string().min(2, 'Package name is required'),
  code: z.string().min(2, 'Package code is required').toUpperCase(),
  description: z.string().optional(),
  serviceId: z.string().optional(),
  serviceName: z.string().optional(),
  totalSessions: z.number().int().min(1, 'Total sessions must be at least 1'),
  price: z.number().min(0, 'Price must be non-negative'),
  validityDays: z.number().int().min(1, 'Validity must be at least 1 day'),
  savingsPercentage: z.number().min(0).max(100).default(15),
  allowFamilySharing: z.boolean().default(true),
  color: z.string().optional(),
});

export const purchaseCustomerPackageSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  templateId: z.string().optional(),
  serviceId: z.string().optional(),
  packageName: z.string().min(2, 'Package name is required'),
  packageCode: z.string().optional(),
  totalSessions: z.number().int().min(1, 'Total sessions must be at least 1'),
  totalPrice: z.number().min(0, 'Total price must be non-negative'),
  validityDays: z.number().int().min(1).default(180),
});

export const redeemPackageSessionSchema = z.object({
  packageId: z.string().min(1, 'Package is required'),
  serviceId: z.string().optional(),
  serviceName: z.string().min(1, 'Service name is required'),
  invoiceId: z.string().optional(),
  stylistId: z.string().optional(),
  stylistName: z.string().optional(),
  redeemedByCustomerId: z.string().min(1, 'Redeeming customer is required'),
  redeemedByName: z.string().min(1, 'Customer name is required'),
  isFamilyMemberRedemption: z.boolean().default(false),
  familyMemberId: z.string().optional(),
  familyRelationship: z.string().optional(),
  notes: z.string().optional(),
});

export const retentionWalletTopupSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  amount: z.number().positive('Top-up amount must be greater than 0'),
  paymentMethod: z.enum(['CASH', 'UPI', 'CARD']),
  isPromotional: z.boolean().default(false),
  promoExpiryDays: z.number().int().min(1).optional(),
  reason: z.string().min(2, 'Reason is required'),
  performedByUserId: z.string().optional(),
});

export const walletDebitSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  amount: z.number().positive('Debit amount must be greater than 0'),
  referenceInvoiceId: z.string().optional(),
  reason: z.string().min(2, 'Reason is required'),
  familyMemberId: z.string().optional(),
  familyMemberName: z.string().optional(),
  performedByUserId: z.string().optional(),
});

export const awardLoyaltyPointsSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  points: z.number().int().min(1, 'Points must be at least 1'),
  entryType: LoyaltyPointsLedgerTypeEnum,
  referenceInvoiceId: z.string().optional(),
  referredCustomerId: z.string().optional(),
  notes: z.string().min(2, 'Notes are required'),
  performedByUserId: z.string().optional(),
});

export const createFamilyPlanSchema = z.object({
  primaryCustomerId: z.string().min(1, 'Primary customer is required'),
  planName: z.string().min(2, 'Plan name is required'),
  membershipId: z.string().optional(),
  maxMembers: z.number().int().min(1).max(20).default(5),
  sharedWalletEnabled: z.boolean().default(true),
  sharedPackagesEnabled: z.boolean().default(true),
  sharedDiscountEnabled: z.boolean().default(true),
  members: z
    .array(
      z.object({
        fullName: z.string().min(1, 'Full name is required'),
        phone: z.string().min(10, 'Valid 10-digit phone is required'),
        relationship: FamilyRelationshipEnum,
        memberCustomerId: z.string().optional(),
        spendingLimitMonthly: z.number().min(0).optional(),
        isAuthorizedToDebitWallet: z.boolean().default(true),
        isAuthorizedToUsePackages: z.boolean().default(true),
      })
    )
    .optional(),
});

export const addFamilyMemberSchema = z.object({
  familyPlanId: z.string().min(1, 'Family plan is required'),
  primaryCustomerId: z.string().min(1, 'Primary customer is required'),
  fullName: z.string().min(1, 'Full name is required'),
  phone: z.string().min(10, 'Valid 10-digit phone is required'),
  relationship: FamilyRelationshipEnum,
  memberCustomerId: z.string().optional(),
  spendingLimitMonthly: z.number().min(0).optional(),
  isAuthorizedToDebitWallet: z.boolean().default(true),
  isAuthorizedToUsePackages: z.boolean().default(true),
});

export const sendExpiryAlertSchema = z.object({
  alertId: z.string().min(1, 'Alert ID is required'),
  channel: z.enum(['WHATSAPP', 'SMS', 'EMAIL']),
  customMessage: z.string().optional(),
  renewalDiscount: z.number().min(0).max(100).optional(),
});
