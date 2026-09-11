export interface PortalGuestProfile {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  avatarUrl?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  birthday?: string;
  anniversary?: string;
  homeBranchId: string;
  homeBranchName: string;
  loyaltyTier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'VIP';
  loyaltyPoints: number;
  walletBalance: number;
  activeMembershipName?: string;
  activeMembershipExpiry?: string;
  totalVisits: number;
}

export interface PortalAuthRequest {
  mobile: string;
  otp?: string;
}

export interface PortalAuthResponse {
  token: string;
  guest: PortalGuestProfile;
  isNewUser: boolean;
}

export interface PortalBranchInfo {
  id: string;
  name: string;
  code: string;
  city: string;
  state: string;
  address: string;
  phone: string;
  openingHours: string;
  rating: number;
  reviewCount: number;
  distanceKm?: number;
  imageUrl?: string;
  amenities: string[];
}

export interface PortalAddOn {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
  description: string;
}

export interface PortalServiceItem {
  id: string;
  name: string;
  category: 'HAIR' | 'SKIN' | 'NAILS' | 'SPA' | 'BEAUTY' | 'MAKEUP' | 'PACKAGES';
  price: number;
  originalPrice?: number;
  durationMinutes: number;
  description: string;
  isPopular?: boolean;
  isNew?: boolean;
  addOns?: PortalAddOn[];
}

export interface PortalStylistProfile {
  id: string;
  name: string;
  role: string;
  rating: number;
  reviewCount: number;
  experienceYears: number;
  specialties: string[];
  avatarUrl?: string;
  bio?: string;
  isMasterStylist?: boolean;
}

export interface PortalTimeSlot {
  time: string; // "10:00 AM"
  startTime: string; // "10:00"
  endTime: string; // "10:45"
  isAvailable: boolean;
  stylistId?: string;
  stylistName?: string;
  surgePriceMultiplier?: number;
}

export interface PortalBookingDraft {
  branchId: string;
  branchName: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  selectedAddOns: PortalAddOn[];
  stylistId: string; // 'ANY' or specific ID
  stylistName: string;
  appointmentDate: string; // YYYY-MM-DD
  timeSlot: string;
  notes?: string;
  
  // Pricing Breakdown
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  couponCode?: string;
  walletDeduction: number;
  loyaltyPointsRedeemed: number;
  loyaltyDiscount: number;
  finalPayable: number;
  paymentMode: 'PAY_AT_VENUE' | 'ONLINE_UPI' | 'ONLINE_CARD' | 'WALLET_ONLY';
}

export interface PortalBookingConfirmation {
  bookingId: string;
  bookingRef: string;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  appointmentDate: string;
  timeSlot: string;
  branchName: string;
  branchAddress: string;
  branchPhone: string;
  serviceName: string;
  stylistName: string;
  durationMinutes: number;
  totalAmount: number;
  paymentStatus: 'PAID' | 'DUE_AT_VENUE' | 'PARTIAL';
  paymentMode: string;
  createdAt: string;
  cancellationAllowedUntil: string;
}

export interface PortalCancellationPolicy {
  freeCancellationHours: number; // e.g. 2 hours prior
  cancellationFeePercent: number; // e.g. 0% if >2h, 20% if <2h
  rescheduleAllowedHours: number;
  terms: string[];
}

export interface PortalAppointmentSummary {
  id: string;
  bookingRef: string;
  branchId: string;
  branchName: string;
  serviceName: string;
  category: string;
  stylistName: string;
  date: string;
  timeSlot: string;
  durationMinutes: number;
  status: 'UPCOMING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  totalAmount: number;
  isPaid: boolean;
  canReschedule: boolean;
  canCancel: boolean;
  feedbackRating?: number;
  feedbackComment?: string;
}

export interface PortalWalletTransaction {
  id: string;
  type: 'TOPUP' | 'DEBIT' | 'CASHBACK' | 'REFUND' | 'BONUS';
  amount: number;
  balanceAfter: number;
  description: string;
  date: string;
  referenceId?: string;
}

export interface PortalWalletSummary {
  balance: number;
  totalCashbackEarned: number;
  promotionalCredits: number;
  transactions: PortalWalletTransaction[];
}

export interface PortalMembershipSummary {
  id: string;
  name: string;
  tier: string;
  status: 'ACTIVE' | 'EXPIRED' | 'PENDING';
  startDate: string;
  expiryDate: string;
  daysRemaining: number;
  discountPercentage: number;
  freeServiceCredits: {
    serviceName: string;
    total: number;
    used: number;
    remaining: number;
  }[];
  perks: string[];
}

export interface PortalPackageSummary {
  id: string;
  name: string;
  totalSessions: number;
  usedSessions: number;
  remainingSessions: number;
  expiryDate: string;
  servicesIncluded: string[];
  purchaseDate: string;
}

export interface PortalLoyaltySummary {
  currentTier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'VIP';
  pointsBalance: number;
  rupeeValue: number; // e.g. 1 point = ₹1
  pointsToNextTier: number;
  nextTierName: string;
  tierMultiplier: string; // e.g. "1.5x on services"
  perks: string[];
  recentActivity: {
    id: string;
    description: string;
    points: number;
    date: string;
    type: 'EARN' | 'REDEEM' | 'BONUS' | 'EXPIRY';
  }[];
}

export interface PortalInvoiceReceipt {
  id: string;
  invoiceNumber: string;
  date: string;
  branchName: string;
  branchGstin: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }[];
  subtotal: number;
  discountAmount: number;
  cgst: number;
  sgst: number;
  totalAmount: number;
  paymentMethod: string;
  receiptUrl?: string;
}

export interface PortalReviewSubmission {
  appointmentId: string;
  overallRating: number;
  cleanlinessRating: number;
  stylistRating: number;
  ambianceRating: number;
  comment: string;
  wouldRecommend: boolean;
}
