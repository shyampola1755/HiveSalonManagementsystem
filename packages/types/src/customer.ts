/**
 * Phase 4: Customer CRM & 360° Profile Types
 */

export type CustomerTag =
  | 'VIP'
  | 'New'
  | 'Returning'
  | 'High Value'
  | 'Inactive'
  | 'Birthday'
  | 'Membership'
  | 'Corporate';

export type CustomerSegment =
  | 'all'
  | 'new'
  | 'returning'
  | 'vip'
  | 'high_spender'
  | 'frequent'
  | 'membership'
  | 'inactive';

export type CustomerSource =
  | 'WALK_IN'
  | 'INSTAGRAM'
  | 'GOOGLE'
  | 'REFERRAL'
  | 'WEBSITE'
  | 'CAMPAIGN'
  | 'PHONE_INQUIRY';

export interface HairProfile {
  texture?: 'FINE' | 'MEDIUM' | 'COARSE' | 'EXTRA_COARSE';
  porosity?: 'LOW' | 'NORMAL' | 'HIGH';
  scalpType?: 'NORMAL' | 'OILY' | 'DRY' | 'SENSITIVE' | 'DANDRUFF_PRONE';
  density?: 'LOW' | 'MEDIUM' | 'HIGH';
  curlPattern?: 'STRAIGHT_1A_1C' | 'WAVY_2A_2C' | 'CURLY_3A_3C' | 'COILY_4A_4C';
  hairLength?: 'SHORT' | 'SHOULDER' | 'MID_BACK' | 'LONG' | 'EXTRA_LONG';
  chemicalHistory?: string[]; // e.g. ["Keratin (3m ago)", "Bleach Highlights (6m ago)"]
}

export interface SkinProfile {
  skinType?: 'NORMAL' | 'OILY' | 'DRY' | 'COMBINATION' | 'SENSITIVE';
  undertone?: 'WARM' | 'COOL' | 'NEUTRAL' | 'OLIVE';
  allergies?: string[]; // e.g. ["PPD", "Ammonia", "Fragrance", "Retinol"]
  sensitivities?: string[];
  skinConcerns?: string[]; // e.g. ["Acne", "Hyperpigmentation", "Dehydration", "Fine Lines"]
}

export interface CustomerPreferences {
  beverages?: string[]; // e.g. ["Green Tea (No sugar)", "Espresso", "Sparkling Water"]
  quietAppointment?: boolean;
  pressurePreference?: 'LIGHT' | 'MEDIUM' | 'FIRM' | 'DEEP_TISSUE';
  musicPreference?: string;
  scalpSensitivity?: 'NORMAL' | 'MILD' | 'HIGH';
  customNotes?: string;
}

export interface ColorFormula {
  id: string;
  customerId: string;
  formulaName: string;
  brand: string;
  formulaMix: string;
  developerVolume: string;
  developerRatio: string;
  processingTimeMinutes: number;
  targetHairTone?: string | null;
  stylistNotes?: string | null;
  technicianUserId?: string | null;
  appliedAt: string;
  createdAt: string;
}

export interface PatchTest {
  id: string;
  customerId: string;
  testType: 'HAIR_COLOR_DYE' | 'BLEACH' | 'KERATIN' | 'CHEMICAL_PEEL' | 'LASH_GLUE';
  chemicalOrBrandName: string;
  testedAt: string;
  result: 'PASSED' | 'FAILED' | 'PENDING';
  validUntil?: string | null;
  technicianUserId?: string | null;
  notes?: string | null;
  createdAt: string;
}

export interface CustomerNoteItem {
  id: string;
  customerId: string;
  note: string;
  isPrivate: boolean;
  category: 'GENERAL' | 'TECH_FORMULA' | 'BEHAVIORAL' | 'MEDICAL';
  authorUserId?: string | null;
  authorName?: string | null;
  createdAt: string;
}

export interface WalletTransaction {
  id: string;
  customerId: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT' | 'CASHBACK' | 'REFUND';
  reason: string;
  balanceAfter: number;
  referenceInvoiceId?: string | null;
  createdAt: string;
}

export type TimelineEventType =
  | 'APPOINTMENT_BOOKED'
  | 'APPOINTMENT_COMPLETED'
  | 'INVOICE_GENERATED'
  | 'PAYMENT_RECEIVED'
  | 'MEMBERSHIP_PURCHASED'
  | 'REVIEW_SUBMITTED'
  | 'MARKETING_SENT'
  | 'FORMULA_APPLIED'
  | 'PATCH_TEST_RECORDED'
  | 'ONLINE_ORDER_PLACED'
  | 'ONLINE_ORDER_CONFIRMED'
  | 'ONLINE_ORDER_PACKED'
  | 'ONLINE_ORDER_READY_PICKUP'
  | 'ONLINE_ORDER_OUT_FOR_DELIVERY'
  | 'ONLINE_ORDER_DELIVERED'
  | 'ONLINE_ORDER_CANCELLED'
  | 'ONLINE_ORDER_RETURNED'
  | 'POS_RETAIL_PURCHASE';

export type OmnichannelChannelType = 'SALON_SERVICE' | 'POS_PURCHASE' | 'ONLINE_ORDER';

export interface CustomerTimelineItem {
  id: string;
  customerId: string;
  eventType: TimelineEventType;
  title: string;
  description: string;
  metadata?: Record<string, any> | null;
  channel?: OmnichannelChannelType;
  referenceId?: string;
  occurredAt: string;
}

export interface CustomerPackageItem {
  id: string;
  customerId: string;
  packageName: string;
  totalSessions: number;
  usedSessions: number;
  totalPrice: number;
  status: 'ACTIVE' | 'COMPLETED' | 'EXPIRED';
  expiresAt?: string | null;
  createdAt: string;
}

export interface CustomerReviewItem {
  id: string;
  customerId: string;
  rating: number;
  comment?: string | null;
  stylistName?: string | null;
  serviceName?: string | null;
  csatScore?: number | null;
  createdAt: string;
}

export interface OmnichannelSpendMetrics {
  salonServiceSpend: number;
  posRetailSpend: number;
  onlineEcommerceSpend: number;
  totalOrdersCount: number;
}

export interface Customer360 {
  id: string;
  organizationId: string;
  fullName: string;
  phone: string;
  email?: string | null;
  gender?: string | null;
  birthDate?: string | null;
  address?: string | null;
  notes?: string | null;
  customerSource?: CustomerSource | string | null;
  referredByCustomerId?: string | null;
  tags: CustomerTag[] | string[];
  loyaltyPoints: number;
  walletBalance: number;
  totalSpent: number;
  totalVisits: number;
  lastVisitAt?: string | null;
  nextAppointmentAt?: string | null;
  preferredBranchId?: string | null;
  preferredBranchName?: string | null;
  preferredStylistId?: string | null;
  preferredStylistName?: string | null;
  membershipStatus?: 'NONE' | 'ACTIVE' | 'EXPIRED';
  activeMembershipTier?: string | null;
  activeMembershipExpiry?: string | null;

  // Omnichannel Metrics (Services + POS + Online)
  omnichannelMetrics?: OmnichannelSpendMetrics;

  // Salon-Specific Profiles
  hairProfile?: HairProfile | null;
  skinProfile?: SkinProfile | null;
  preferences?: CustomerPreferences | null;

  // 12-Tab Sub-Collections + E-Commerce Orders
  colorFormulas: ColorFormula[];
  patchTests: PatchTest[];
  staffNotes: CustomerNoteItem[];
  walletTransactions: WalletTransaction[];
  timelineEvents: CustomerTimelineItem[];
  packages: CustomerPackageItem[];
  reviews: CustomerReviewItem[];
  appointments: any[];
  invoices: any[];
  onlineOrders?: any[];
  servicesSummary?: {
    serviceName: string;
    category: string;
    timesBooked: number;
    lastDate: string;
  }[];
  marketingLogs?: {
    id: string;
    channel: 'SMS' | 'WHATSAPP' | 'EMAIL';
    campaignName: string;
    sentAt: string;
    status: 'DELIVERED' | 'CLICKED' | 'FAILED';
  }[];

  createdAt: string;
  updatedAt: string;
}

