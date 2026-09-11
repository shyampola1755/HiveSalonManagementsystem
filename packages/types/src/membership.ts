// -----------------------------------------------------------------------------
// HIVE SALON — PHASE 11: RETENTION ENGINE TYPES & DTOs
// Memberships, Packages, Wallets, Loyalty & Family Plans
// -----------------------------------------------------------------------------

export type MembershipType =
  | 'DISCOUNT'
  | 'PREPAID_CREDIT'
  | 'SERVICE_PACKAGE'
  | 'FAMILY_PACKAGE'
  | 'MONTHLY_PLAN'
  | 'ANNUAL_PLAN';

export type MembershipStatus = 'ACTIVE' | 'EXPIRED' | 'FROZEN' | 'CANCELLED';

export interface MembershipPlanDto {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  type: MembershipType;
  description?: string;
  price: number;
  validityDays: number;
  discountPercentage: number;
  walletCreditsIncluded: number;
  loyaltyBonusPoints: number;
  allowFamilySharing: boolean;
  maxFamilyMembers: number;
  eligibleCategories?: string[];
  perks?: string[];
  color?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerMembershipDto {
  id: string;
  organizationId?: string;
  customerId: string;
  customerName?: string;
  customerPhone?: string;
  tierId?: string;
  planId?: string;
  planName?: string;
  planType?: MembershipType;
  membershipCode: string;
  startDate: string;
  expiryDate: string;
  status: MembershipStatus;
  pricePaid: number;
  totalSaved: number;
  usageCount: number;
  walletCreditsGranted: number;
  autoRenew: boolean;
  notes?: string;
  daysRemaining?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ServicePackageTemplateDto {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  description?: string;
  serviceId?: string;
  serviceName?: string;
  totalSessions: number;
  price: number;
  validityDays: number;
  savingsPercentage: number;
  allowFamilySharing: boolean;
  color?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerPackageRedemptionDto {
  id: string;
  packageId: string;
  serviceId?: string;
  serviceName: string;
  invoiceId?: string;
  stylistId?: string;
  stylistName?: string;
  redeemedByCustomerId: string;
  redeemedByName: string;
  isFamilyMemberRedemption: boolean;
  familyMemberId?: string;
  familyRelationship?: string;
  notes?: string;
  redeemedAt: string;
}

export interface CustomerPackageDto {
  id: string;
  organizationId?: string;
  customerId: string;
  customerName?: string;
  customerPhone?: string;
  templateId?: string;
  serviceId?: string;
  packageName: string;
  packageCode?: string;
  totalSessions: number;
  usedSessions: number;
  remainingSessions: number;
  totalPrice: number;
  sessionPrice: number;
  status: 'ACTIVE' | 'COMPLETED' | 'EXPIRED';
  expiresAt?: string;
  daysRemaining?: number;
  purchasedAt: string;
  createdAt: string;
  updatedAt: string;
  redemptions?: CustomerPackageRedemptionDto[];
}

export type WalletLedgerType =
  | 'OPENING_BALANCE'
  | 'TOPUP_CASH'
  | 'TOPUP_UPI'
  | 'TOPUP_CARD'
  | 'DEBIT_POS'
  | 'PROMOTIONAL_CREDIT'
  | 'REFUND_CREDIT'
  | 'EXPIRY_WRITEOFF'
  | 'ADJUSTMENT';

export interface CustomerWalletDto {
  id: string;
  organizationId: string;
  customerId: string;
  customerName?: string;
  customerPhone?: string;
  currentBalance: number;
  promotionalBalance: number;
  nonPromotionalBalance: number;
  totalCredited: number;
  totalDebited: number;
  lastTransactionAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerWalletLedgerEntryDto {
  id: string;
  organizationId: string;
  branchId?: string;
  customerId: string;
  customerName?: string;
  entryType: WalletLedgerType;
  amount: number;
  promotionalAmount: number;
  balanceBefore: number;
  balanceAfter: number;
  referenceInvoiceId?: string;
  performedByUserId?: string;
  performedByName?: string;
  familyMemberId?: string;
  familyMemberName?: string;
  notes: string;
  expiresAt?: string;
  isExpired: boolean;
  createdAt: string;
}

export type LoyaltyTierCode = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';

export interface LoyaltyTierDto {
  id: string;
  organizationId: string;
  tierCode: LoyaltyTierCode;
  tierName: string;
  minSpendRequired: number;
  minVisitsRequired: number;
  pointsPerHundredRupees: number;
  pointRedemptionValueRupees: number;
  discountPerkPercentage: number;
  priorityBooking: boolean;
  color: string;
  icon?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerLoyaltyAccountDto {
  id: string;
  organizationId: string;
  customerId: string;
  customerName?: string;
  customerPhone?: string;
  currentTierId: string;
  tierCode: LoyaltyTierCode;
  tierName: string;
  currentPoints: number;
  lifetimePointsEarned: number;
  lifetimePointsRedeemed: number;
  nextTierProgressPercentage: number;
  nextTierSpendNeeded: number;
  tierJoinedAt: string;
  createdAt: string;
  updatedAt: string;
}

export type LoyaltyPointsLedgerType =
  | 'EARNED_INVOICE'
  | 'REDEEMED_POS'
  | 'BONUS_CAMPAIGN'
  | 'REFERRAL_BONUS'
  | 'EXPIRY_WRITEOFF'
  | 'TIER_UPGRADE_BONUS'
  | 'ADJUSTMENT';

export interface LoyaltyPointsLedgerEntryDto {
  id: string;
  organizationId: string;
  branchId?: string;
  customerId: string;
  customerName?: string;
  entryType: LoyaltyPointsLedgerType;
  points: number;
  pointsBefore: number;
  pointsAfter: number;
  referenceInvoiceId?: string;
  referredCustomerId?: string;
  referredCustomerName?: string;
  notes: string;
  performedByUserId?: string;
  expiresAt?: string;
  createdAt: string;
}

export type FamilyRelationship =
  | 'SPOUSE'
  | 'CHILD'
  | 'PARENT'
  | 'SIBLING'
  | 'PARTNER'
  | 'OTHER';

export interface FamilyMemberDto {
  id: string;
  familyPlanId: string;
  primaryCustomerId: string;
  memberCustomerId?: string;
  fullName: string;
  phone: string;
  relationship: FamilyRelationship;
  spendingLimitMonthly?: number;
  isAuthorizedToDebitWallet: boolean;
  isAuthorizedToUsePackages: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt?: string;
}

export interface FamilyPlanDto {
  id: string;
  organizationId: string;
  primaryCustomerId: string;
  primaryCustomerName?: string;
  primaryCustomerPhone?: string;
  membershipId?: string;
  membershipName?: string;
  planName: string;
  maxMembers: number;
  sharedWalletEnabled: boolean;
  sharedPackagesEnabled: boolean;
  sharedDiscountEnabled: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  members: FamilyMemberDto[];
  totalUsageCount?: number;
  totalAmountShared?: number;
  createdAt: string;
  updatedAt: string;
}

export interface FamilyMemberUsageRecordDto {
  id: string;
  familyPlanId: string;
  familyMemberId: string;
  familyMemberName: string;
  relationship: FamilyRelationship;
  primaryCustomerId: string;
  primaryCustomerName?: string;
  benefitType: 'MEMBERSHIP_DISCOUNT' | 'PACKAGE_SESSION' | 'WALLET_DEBIT';
  invoiceId?: string;
  serviceName: string;
  amountSavedOrSpent: number;
  usedAt: string;
}

export interface RetentionExpiryAlertDto {
  id: string;
  organizationId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  benefitType: 'MEMBERSHIP' | 'PACKAGE' | 'WALLET_PROMO' | 'LOYALTY_POINTS';
  benefitReferenceId: string;
  benefitTitle: string;
  daysUntilExpiry: number;
  expiryDate: string;
  status: 'SCHEDULED' | 'SENT' | 'RENEWED' | 'DISMISSED';
  sentChannel?: 'WHATSAPP' | 'SMS' | 'EMAIL';
  sentAt?: string;
  renewalOfferDiscount?: number;
  createdAt: string;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// POS CHECKOUT BENEFIT EVALUATION DTOs
// -----------------------------------------------------------------------------

export interface PosCustomerBenefitsDto {
  customerId: string;
  customerName: string;
  customerPhone: string;
  hasActiveMembership: boolean;
  membership?: {
    id: string;
    code: string;
    name: string;
    type: MembershipType;
    discountPercentage: number;
    perks: string[];
    expiryDate: string;
    daysRemaining: number;
  };
  availablePackages: Array<{
    id: string;
    packageName: string;
    serviceId?: string;
    totalSessions: number;
    usedSessions: number;
    remainingSessions: number;
    sessionPrice: number;
    expiresAt?: string;
  }>;
  wallet: {
    currentBalance: number;
    promotionalBalance: number;
    nonPromotionalBalance: number;
    usableBalance: number;
  };
  loyalty: {
    currentPoints: number;
    pointValueRupees: number;
    redeemableValueRupees: number;
    tierCode: LoyaltyTierCode;
    tierName: string;
    pointsPerHundredRupees: number;
  };
  familyPlan?: {
    id: string;
    planName: string;
    isSharedPoolActive: boolean;
    primaryCustomerId: string;
    primaryCustomerName: string;
    sharedWalletEnabled: boolean;
    sharedPackagesEnabled: boolean;
    sharedDiscountEnabled: boolean;
    familyMembers: Array<{ id: string; fullName: string; relationship: string }>;
  };
}

// -----------------------------------------------------------------------------
// PAYLOADS
// -----------------------------------------------------------------------------

export interface CreateMembershipPlanPayload {
  name: string;
  code: string;
  type: MembershipType;
  description?: string;
  price: number;
  validityDays: number;
  discountPercentage: number;
  walletCreditsIncluded?: number;
  loyaltyBonusPoints?: number;
  allowFamilySharing?: boolean;
  maxFamilyMembers?: number;
  eligibleCategories?: string[];
  perks?: string[];
  color?: string;
}

export interface EnrollCustomerMembershipPayload {
  customerId: string;
  planId: string;
  pricePaid?: number;
  startDate?: string;
  validityDays?: number;
  notes?: string;
  autoRenew?: boolean;
}

export interface CreatePackageTemplatePayload {
  name: string;
  code: string;
  description?: string;
  serviceId?: string;
  serviceName?: string;
  totalSessions: number;
  price: number;
  validityDays: number;
  savingsPercentage: number;
  allowFamilySharing?: boolean;
  color?: string;
}

export interface PurchaseCustomerPackagePayload {
  customerId: string;
  templateId?: string;
  serviceId?: string;
  packageName: string;
  packageCode?: string;
  totalSessions: number;
  totalPrice: number;
  validityDays?: number;
}

export interface RedeemPackageSessionPayload {
  packageId: string;
  serviceId?: string;
  serviceName: string;
  invoiceId?: string;
  stylistId?: string;
  stylistName?: string;
  redeemedByCustomerId: string;
  redeemedByName: string;
  isFamilyMemberRedemption?: boolean;
  familyMemberId?: string;
  familyRelationship?: string;
  notes?: string;
}

export interface WalletTopupPayload {
  customerId: string;
  amount: number;
  paymentMethod: 'CASH' | 'UPI' | 'CARD';
  isPromotional?: boolean;
  promoExpiryDays?: number;
  reason: string;
  performedByUserId?: string;
}

export interface WalletDebitPayload {
  customerId: string;
  amount: number;
  referenceInvoiceId?: string;
  reason: string;
  familyMemberId?: string;
  familyMemberName?: string;
  performedByUserId?: string;
}

export interface AwardLoyaltyPointsPayload {
  customerId: string;
  points: number;
  entryType: LoyaltyPointsLedgerType;
  referenceInvoiceId?: string;
  referredCustomerId?: string;
  notes: string;
  performedByUserId?: string;
}

export interface CreateFamilyPlanPayload {
  primaryCustomerId: string;
  planName: string;
  membershipId?: string;
  maxMembers?: number;
  sharedWalletEnabled?: boolean;
  sharedPackagesEnabled?: boolean;
  sharedDiscountEnabled?: boolean;
  members?: Array<{
    fullName: string;
    phone: string;
    relationship: FamilyRelationship;
    memberCustomerId?: string;
    spendingLimitMonthly?: number;
    isAuthorizedToDebitWallet?: boolean;
    isAuthorizedToUsePackages?: boolean;
  }>;
}

export interface AddFamilyMemberPayload {
  familyPlanId: string;
  primaryCustomerId: string;
  fullName: string;
  phone: string;
  relationship: FamilyRelationship;
  memberCustomerId?: string;
  spendingLimitMonthly?: number;
  isAuthorizedToDebitWallet?: boolean;
  isAuthorizedToUsePackages?: boolean;
}

export interface SendExpiryAlertPayload {
  alertId: string;
  channel: 'WHATSAPP' | 'SMS' | 'EMAIL';
  customMessage?: string;
  renewalDiscount?: number;
}
