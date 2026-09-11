'use client';

import * as React from 'react';
import {
  PageHeader,
  Button,
  Badge,
  Modal,
  Input,
  Select,
  useToast,
} from '@hive/ui';
import {
  Award,
  Crown,
  Sparkles,
  Zap,
  CreditCard,
  Wallet,
  Users,
  Package,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Percent,
  ShieldCheck,
  Send,
  Gift,
  UserPlus,
  UserCheck,
  Tag,
  Receipt,
  Scissors,
  Smartphone,
  ChevronRight,
  Sliders,
  DollarSign,
  Info,
} from 'lucide-react';
import { formatCurrency } from '@hive/utilities';
import type {
  MembershipType,
  MembershipPlanDto,
  CustomerMembershipDto,
  ServicePackageTemplateDto,
  CustomerPackageDto,
  CustomerWalletDto,
  CustomerWalletLedgerEntryDto,
  LoyaltyTierDto,
  CustomerLoyaltyAccountDto,
  LoyaltyPointsLedgerEntryDto,
  FamilyPlanDto,
  FamilyMemberDto,
  FamilyMemberUsageRecordDto,
  RetentionExpiryAlertDto,
  PosCustomerBenefitsDto,
} from '@hive/types';

export interface MembershipsViewProps {
  initialTab?:
    | 'PLANS'
    | 'PACKAGES'
    | 'WALLETS'
    | 'LOYALTY'
    | 'FAMILY'
    | 'POS_EVALUATOR'
    | 'EXPIRY_ALERTS';
}

export function MembershipsView({ initialTab = 'PLANS' }: MembershipsViewProps) {
  const toast = useToast();

  // Active Tab
  const [activeTab, setActiveTab] = React.useState<
    | 'PLANS'
    | 'PACKAGES'
    | 'WALLETS'
    | 'LOYALTY'
    | 'FAMILY'
    | 'POS_EVALUATOR'
    | 'EXPIRY_ALERTS'
  >(initialTab);

  // Customer Filter / Search State
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'ALL' | 'ACTIVE' | 'EXPIRED' | 'FROZEN'>('ALL');

  // ---------------------------------------------------------------------------
  // 1. STATE & SEED DATA
  // ---------------------------------------------------------------------------
  // Plans State
  const [plans, setPlans] = React.useState<MembershipPlanDto[]>([
    {
      id: 'plan-1',
      organizationId: 'org_hive_demo',
      name: 'Royal Diamond Club',
      code: 'ROYAL-DIA-01',
      type: 'DISCOUNT',
      description: 'Exclusive 20% discount on all salon styling, coloring, and spa therapies for 365 days.',
      price: 12000,
      validityDays: 365,
      discountPercentage: 20,
      walletCreditsIncluded: 0,
      loyaltyBonusPoints: 500,
      allowFamilySharing: false,
      maxFamilyMembers: 1,
      perks: [
        '20% off all service appointments',
        'Complimentary luxury beverage upgrade',
        'Priority weekend slot booking',
        'Free Olaplex additive on hair coloring',
      ],
      color: '#d97706',
      isActive: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
    {
      id: 'plan-2',
      organizationId: 'org_hive_demo',
      name: 'Prepaid Privilege 15K',
      code: 'PREPAID-15K',
      type: 'PREPAID_CREDIT',
      description: 'Pay ₹15,000 upfront and receive ₹18,000 in customer wallet credits (20% bonus value).',
      price: 15000,
      validityDays: 365,
      discountPercentage: 5,
      walletCreditsIncluded: 18000,
      loyaltyBonusPoints: 300,
      allowFamilySharing: true,
      maxFamilyMembers: 3,
      perks: [
        '₹18,000 usable wallet balance',
        '5% extra discount on retail products',
        'Shareable with up to 3 family members',
      ],
      color: '#0284c7',
      isActive: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
    {
      id: 'plan-3',
      organizationId: 'org_hive_demo',
      name: '10 Signature Haircuts Pass',
      code: 'PKG-HAIR-10',
      type: 'SERVICE_PACKAGE',
      description: '10 Master Stylist Haircut & Beard Sculpting sessions at 45% savings vs walk-in menu.',
      price: 4500,
      validityDays: 180,
      discountPercentage: 0,
      walletCreditsIncluded: 0,
      loyaltyBonusPoints: 100,
      allowFamilySharing: true,
      maxFamilyMembers: 2,
      perks: [
        '10 Master Haircut & Beard Grooming Sessions',
        'Valid for 180 days across all branches',
        'Includes scalp scrub and styling finish',
      ],
      color: '#059669',
      isActive: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
    {
      id: 'plan-4',
      organizationId: 'org_hive_demo',
      name: 'The Family Elite Wellness Pool',
      code: 'FAM-ELITE-01',
      type: 'FAMILY_PACKAGE',
      description: 'Unified family membership with 15% discount across services, ₹5,000 shared wallet, and shared package pooling.',
      price: 24999,
      validityDays: 365,
      discountPercentage: 15,
      walletCreditsIncluded: 5000,
      loyaltyBonusPoints: 1000,
      allowFamilySharing: true,
      maxFamilyMembers: 5,
      perks: [
        'Up to 5 family members on unified profile',
        '15% discount on all family appointments',
        '₹5,000 preloaded shared family wallet',
        '4 Complimentary express scalp massages per year',
      ],
      color: '#7c3aed',
      isActive: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
    {
      id: 'plan-5',
      organizationId: 'org_hive_demo',
      name: 'Hair & Blowout Monthly Pass',
      code: 'MONTH-BLOW-01',
      type: 'MONTHLY_PLAN',
      description: '4 Signature Blowouts & 15% discount on hair treatments every month.',
      price: 1999,
      validityDays: 30,
      discountPercentage: 15,
      walletCreditsIncluded: 0,
      loyaltyBonusPoints: 50,
      allowFamilySharing: false,
      maxFamilyMembers: 1,
      perks: [
        '4 Glamour Blowout Sessions per month',
        '15% off Kérastase & Olaplex treatments',
        'Auto-renews monthly',
      ],
      color: '#db2777',
      isActive: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
    {
      id: 'plan-6',
      organizationId: 'org_hive_demo',
      name: 'Centurion Annual Prestige',
      code: 'ANNUAL-CENT-01',
      type: 'ANNUAL_PLAN',
      description: 'The pinnacle luxury membership: 25% off all services, ₹10,000 wallet credits, and VIP concierge.',
      price: 35000,
      validityDays: 365,
      discountPercentage: 25,
      walletCreditsIncluded: 10000,
      loyaltyBonusPoints: 2000,
      allowFamilySharing: true,
      maxFamilyMembers: 4,
      perks: [
        '25% off all salon, clinical skincare & spa services',
        '₹10,000 credited to wallet immediately',
        '2,000 Bonus Loyalty Points',
        'Complimentary styling on birthdays & anniversaries',
      ],
      color: '#1e293b',
      isActive: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
  ]);

  // Subscriptions State
  const [subscriptions, setSubscriptions] = React.useState<CustomerMembershipDto[]>([
    {
      id: 'cm-1',
      customerId: 'c1',
      customerName: 'Priya Sharma',
      customerPhone: '+91 98765 43210',
      planId: 'plan-1',
      planName: 'Royal Diamond Club',
      planType: 'DISCOUNT',
      membershipCode: 'MEMB-2026-00891',
      startDate: '2026-01-15T00:00:00Z',
      expiryDate: '2027-01-15T23:59:59Z',
      status: 'ACTIVE',
      pricePaid: 12000,
      totalSaved: 4850,
      usageCount: 8,
      walletCreditsGranted: 0,
      autoRenew: true,
      notes: 'VIP customer enrolled via Jubilee Hills branch.',
      daysRemaining: 127,
      isActive: true,
      createdAt: '2026-01-15T10:00:00Z',
    },
    {
      id: 'cm-2',
      customerId: 'c2',
      customerName: 'Rahul Verma',
      customerPhone: '+91 98111 22334',
      planId: 'plan-2',
      planName: 'Prepaid Privilege 15K',
      planType: 'PREPAID_CREDIT',
      membershipCode: 'MEMB-2026-00412',
      startDate: '2026-03-01T00:00:00Z',
      expiryDate: '2027-03-01T23:59:59Z',
      status: 'ACTIVE',
      pricePaid: 15000,
      totalSaved: 2200,
      usageCount: 5,
      walletCreditsGranted: 18000,
      autoRenew: false,
      notes: 'Family pool shared with wife Neha.',
      daysRemaining: 172,
      isActive: true,
      createdAt: '2026-03-01T12:00:00Z',
    },
  ]);

  // Packages State
  const [customerPackages, setCustomerPackages] = React.useState<CustomerPackageDto[]>([
    {
      id: 'cpkg-1',
      customerId: 'c1',
      customerName: 'Priya Sharma',
      customerPhone: '+91 98765 43210',
      templateId: 'tmpl-2',
      serviceId: 'srv-3',
      packageName: '6 Hydra-Oxygen Medi-Facial Pack',
      packageCode: 'PKG-FACIAL-06',
      totalSessions: 6,
      usedSessions: 3,
      remainingSessions: 3,
      totalPrice: 16500,
      sessionPrice: 2750,
      status: 'ACTIVE',
      expiresAt: '2026-12-31T23:59:59Z',
      daysRemaining: 112,
      purchasedAt: '2026-06-01T11:00:00Z',
      createdAt: '2026-06-01T11:00:00Z',
      updatedAt: '2026-08-20T16:00:00Z',
      redemptions: [
        {
          id: 'red-1',
          packageId: 'cpkg-1',
          serviceName: 'Hydra-Oxygen Rejuvenation Medi-Facial',
          stylistName: 'Ananya Roy',
          redeemedByCustomerId: 'c1',
          redeemedByName: 'Priya Sharma',
          isFamilyMemberRedemption: false,
          notes: 'Session 1 performed with glycolic prep.',
          redeemedAt: '2026-06-15T14:00:00Z',
        },
        {
          id: 'red-2',
          packageId: 'cpkg-1',
          serviceName: 'Hydra-Oxygen Rejuvenation Medi-Facial',
          stylistName: 'Ananya Roy',
          redeemedByCustomerId: 'c1',
          redeemedByName: 'Priya Sharma',
          isFamilyMemberRedemption: false,
          notes: 'Session 2 post-vacation hydration.',
          redeemedAt: '2026-07-20T11:30:00Z',
        },
        {
          id: 'red-3',
          packageId: 'cpkg-1',
          serviceName: 'Hydra-Oxygen Rejuvenation Medi-Facial',
          stylistName: 'Ananya Roy',
          redeemedByCustomerId: 'c1',
          redeemedByName: 'Neha Sharma (Sister)',
          isFamilyMemberRedemption: true,
          familyRelationship: 'SIBLING',
          notes: 'Shared package session used by sister Neha.',
          redeemedAt: '2026-08-20T16:00:00Z',
        },
      ],
    },
    {
      id: 'cpkg-2',
      customerId: 'c2',
      customerName: 'Rahul Verma',
      customerPhone: '+91 98111 22334',
      templateId: 'tmpl-1',
      serviceId: 'srv-1',
      packageName: '10 Signature Haircuts Pass',
      packageCode: 'PKG-HAIR-10',
      totalSessions: 10,
      usedSessions: 8,
      remainingSessions: 2,
      totalPrice: 4500,
      sessionPrice: 450,
      status: 'ACTIVE',
      expiresAt: '2026-09-17T23:59:59Z',
      daysRemaining: 7,
      purchasedAt: '2026-03-20T10:00:00Z',
      createdAt: '2026-03-20T10:00:00Z',
      updatedAt: '2026-09-02T14:00:00Z',
      redemptions: [],
    },
  ]);

  // Wallet State (Priya Sharma Selected)
  const [activeWallet, setActiveWallet] = React.useState<CustomerWalletDto>({
    id: 'cw-1',
    organizationId: 'org_hive_demo',
    customerId: 'c1',
    customerName: 'Priya Sharma',
    customerPhone: '+91 98765 43210',
    currentBalance: 4200.0,
    promotionalBalance: 500.0,
    nonPromotionalBalance: 3700.0,
    totalCredited: 12000.0,
    totalDebited: 7800.0,
    lastTransactionAt: '2026-09-02T12:00:00Z',
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-09-02T12:00:00Z',
  });

  const [walletLedger, setWalletLedger] = React.useState<CustomerWalletLedgerEntryDto[]>([
    {
      id: 'wtx-4',
      organizationId: 'org_hive_demo',
      customerId: 'c1',
      customerName: 'Priya Sharma',
      entryType: 'DEBIT_POS',
      amount: -3300.0,
      promotionalAmount: 0,
      balanceBefore: 7500.0,
      balanceAfter: 4200.0,
      referenceInvoiceId: 'HYD-JUB-2026-000001',
      notes: 'Partial payment applied at checkout for Balayage service.',
      isExpired: false,
      createdAt: '2026-09-02T12:00:00Z',
    },
    {
      id: 'wtx-3',
      organizationId: 'org_hive_demo',
      customerId: 'c1',
      customerName: 'Priya Sharma',
      entryType: 'PROMOTIONAL_CREDIT',
      amount: 500.0,
      promotionalAmount: 500.0,
      balanceBefore: 7000.0,
      balanceAfter: 7500.0,
      notes: 'Festive Anniversary Bonus Credits (Valid for 60 days).',
      expiresAt: '2026-10-31T23:59:59Z',
      isExpired: false,
      createdAt: '2026-08-30T10:00:00Z',
    },
    {
      id: 'wtx-2',
      organizationId: 'org_hive_demo',
      customerId: 'c1',
      customerName: 'Priya Sharma',
      entryType: 'TOPUP_UPI',
      amount: 5000.0,
      promotionalAmount: 0,
      balanceBefore: 2000.0,
      balanceAfter: 7000.0,
      referenceInvoiceId: 'TOPUP-UPI-98124',
      notes: 'Prepaid wallet recharge via Google Pay UPI.',
      isExpired: false,
      createdAt: '2026-04-10T15:30:00Z',
    },
    {
      id: 'wtx-1',
      organizationId: 'org_hive_demo',
      customerId: 'c1',
      customerName: 'Priya Sharma',
      entryType: 'OPENING_BALANCE',
      amount: 2000.0,
      promotionalAmount: 0,
      balanceBefore: 0.0,
      balanceAfter: 2000.0,
      notes: 'Opening balance migration from legacy system.',
      isExpired: false,
      createdAt: '2026-01-15T10:00:00Z',
    },
  ]);

  // Loyalty Program State
  const loyaltyTiers: LoyaltyTierDto[] = [
    {
      id: 'tier-bronze',
      organizationId: 'org_hive_demo',
      tierCode: 'BRONZE',
      tierName: 'Bronze Member',
      minSpendRequired: 0,
      minVisitsRequired: 0,
      pointsPerHundredRupees: 1.0,
      pointRedemptionValueRupees: 1.0,
      discountPerkPercentage: 0,
      priorityBooking: false,
      color: '#b45309',
      isActive: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
    {
      id: 'tier-silver',
      organizationId: 'org_hive_demo',
      tierCode: 'SILVER',
      tierName: 'Silver Elite',
      minSpendRequired: 15000,
      minVisitsRequired: 4,
      pointsPerHundredRupees: 1.25,
      pointRedemptionValueRupees: 1.0,
      discountPerkPercentage: 5,
      priorityBooking: false,
      color: '#64748b',
      isActive: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
    {
      id: 'tier-gold',
      organizationId: 'org_hive_demo',
      tierCode: 'GOLD',
      tierName: 'Gold Prestige',
      minSpendRequired: 40000,
      minVisitsRequired: 10,
      pointsPerHundredRupees: 1.5,
      pointRedemptionValueRupees: 1.0,
      discountPerkPercentage: 10,
      priorityBooking: true,
      color: '#d97706',
      isActive: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
    {
      id: 'tier-platinum',
      organizationId: 'org_hive_demo',
      tierCode: 'PLATINUM',
      tierName: 'Platinum VIP',
      minSpendRequired: 100000,
      minVisitsRequired: 20,
      pointsPerHundredRupees: 2.0,
      pointRedemptionValueRupees: 1.0,
      discountPerkPercentage: 15,
      priorityBooking: true,
      color: '#475569',
      isActive: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
  ];

  const [activeLoyalty, setActiveLoyalty] = React.useState<CustomerLoyaltyAccountDto>({
    id: 'cla-1',
    organizationId: 'org_hive_demo',
    customerId: 'c1',
    customerName: 'Priya Sharma',
    customerPhone: '+91 98765 43210',
    currentTierId: 'tier-gold',
    tierCode: 'GOLD',
    tierName: 'Gold Prestige',
    currentPoints: 850,
    lifetimePointsEarned: 1450,
    lifetimePointsRedeemed: 600,
    nextTierProgressPercentage: 48.5,
    nextTierSpendNeeded: 51500,
    tierJoinedAt: '2026-03-01T00:00:00Z',
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-09-02T12:00:00Z',
  });

  const [loyaltyLedger, setLoyaltyLedger] = React.useState<LoyaltyPointsLedgerEntryDto[]>([
    {
      id: 'loy-3',
      organizationId: 'org_hive_demo',
      customerId: 'c1',
      customerName: 'Priya Sharma',
      entryType: 'EARNED_INVOICE',
      points: 100,
      pointsBefore: 750,
      pointsAfter: 850,
      referenceInvoiceId: 'HYD-JUB-2026-000001',
      notes: 'Points earned on Invoice HYD-JUB-2026-000001 (1.5x Gold Tier Multiplier).',
      createdAt: '2026-09-02T12:00:00Z',
    },
    {
      id: 'loy-2',
      organizationId: 'org_hive_demo',
      customerId: 'c1',
      customerName: 'Priya Sharma',
      entryType: 'REFERRAL_BONUS',
      points: 250,
      pointsBefore: 500,
      pointsAfter: 750,
      referredCustomerId: 'c2',
      referredCustomerName: 'Rahul Verma',
      notes: 'Referral reward for introducing Rahul Verma.',
      createdAt: '2026-04-12T16:00:00Z',
    },
    {
      id: 'loy-1',
      organizationId: 'org_hive_demo',
      customerId: 'c1',
      customerName: 'Priya Sharma',
      entryType: 'BONUS_CAMPAIGN',
      points: 500,
      pointsBefore: 0,
      pointsAfter: 500,
      notes: 'Royal Diamond Membership onboarding bonus points.',
      createdAt: '2026-01-15T10:00:00Z',
    },
  ]);

  // Family Plans State
  const [familyPlans, setFamilyPlans] = React.useState<FamilyPlanDto[]>([
    {
      id: 'fp-1',
      organizationId: 'org_hive_demo',
      primaryCustomerId: 'c1',
      primaryCustomerName: 'Priya Sharma',
      primaryCustomerPhone: '+91 98765 43210',
      membershipId: 'cm-1',
      membershipName: 'Royal Diamond Club',
      planName: 'The Sharma Family Wellness Pool',
      maxMembers: 5,
      sharedWalletEnabled: true,
      sharedPackagesEnabled: true,
      sharedDiscountEnabled: true,
      status: 'ACTIVE',
      members: [
        {
          id: 'fm-1',
          familyPlanId: 'fp-1',
          primaryCustomerId: 'c1',
          memberCustomerId: 'c2',
          fullName: 'Rahul Verma',
          phone: '+91 98111 22334',
          relationship: 'SPOUSE',
          spendingLimitMonthly: 10000,
          isAuthorizedToDebitWallet: true,
          isAuthorizedToUsePackages: true,
          status: 'ACTIVE',
          createdAt: '2026-02-01T10:00:00Z',
        },
        {
          id: 'fm-2',
          familyPlanId: 'fp-1',
          primaryCustomerId: 'c1',
          fullName: 'Neha Sharma',
          phone: '+91 97654 32109',
          relationship: 'SIBLING',
          spendingLimitMonthly: 5000,
          isAuthorizedToDebitWallet: true,
          isAuthorizedToUsePackages: true,
          status: 'ACTIVE',
          createdAt: '2026-02-01T10:00:00Z',
        },
        {
          id: 'fm-3',
          familyPlanId: 'fp-1',
          primaryCustomerId: 'c1',
          fullName: 'Aarav Sharma',
          phone: '+91 98765 00001',
          relationship: 'CHILD',
          spendingLimitMonthly: 2500,
          isAuthorizedToDebitWallet: false,
          isAuthorizedToUsePackages: true,
          status: 'ACTIVE',
          createdAt: '2026-02-01T10:00:00Z',
        },
      ],
      totalUsageCount: 4,
      totalAmountShared: 6850,
      createdAt: '2026-02-01T10:00:00Z',
      updatedAt: '2026-09-02T12:00:00Z',
    },
  ]);

  const [familyUsageRecords, setFamilyUsageRecords] = React.useState<FamilyMemberUsageRecordDto[]>([
    {
      id: 'fu-1',
      familyPlanId: 'fp-1',
      familyMemberId: 'fm-2',
      familyMemberName: 'Neha Sharma',
      relationship: 'SIBLING',
      primaryCustomerId: 'c1',
      primaryCustomerName: 'Priya Sharma',
      benefitType: 'PACKAGE_SESSION',
      invoiceId: 'inv-003',
      serviceName: 'Hydra-Oxygen Rejuvenation Medi-Facial',
      amountSavedOrSpent: 3400,
      usedAt: '2026-08-20T16:00:00Z',
    },
    {
      id: 'fu-2',
      familyPlanId: 'fp-1',
      familyMemberId: 'fm-1',
      familyMemberName: 'Rahul Verma',
      relationship: 'SPOUSE',
      primaryCustomerId: 'c1',
      primaryCustomerName: 'Priya Sharma',
      benefitType: 'MEMBERSHIP_DISCOUNT',
      invoiceId: 'inv-004',
      serviceName: 'Signature Royal Haircut',
      amountSavedOrSpent: 170,
      usedAt: '2026-08-28T14:15:00Z',
    },
  ]);

  // Expiry Alerts State
  const [expiryAlerts, setExpiryAlerts] = React.useState<RetentionExpiryAlertDto[]>([
    {
      id: 'alert-1',
      organizationId: 'org_hive_demo',
      customerId: 'c2',
      customerName: 'Rahul Verma',
      customerPhone: '+91 98111 22334',
      benefitType: 'PACKAGE',
      benefitReferenceId: 'cpkg-2',
      benefitTitle: '10 Haircuts Pass (2 sessions remaining)',
      daysUntilExpiry: 7,
      expiryDate: '2026-09-17T23:59:59Z',
      status: 'SCHEDULED',
      renewalOfferDiscount: 15,
      createdAt: '2026-09-03T00:00:00Z',
      updatedAt: '2026-09-03T00:00:00Z',
    },
    {
      id: 'alert-2',
      organizationId: 'org_hive_demo',
      customerId: 'c3',
      customerName: 'Ananya Roy',
      customerPhone: '+91 99887 76655',
      benefitType: 'WALLET_PROMO',
      benefitReferenceId: 'wtx-promo-3',
      benefitTitle: 'Festive Promo Wallet Credits (₹800.00)',
      daysUntilExpiry: 1,
      expiryDate: '2026-09-11T23:59:59Z',
      status: 'SCHEDULED',
      renewalOfferDiscount: 10,
      createdAt: '2026-09-09T00:00:00Z',
      updatedAt: '2026-09-09T00:00:00Z',
    },
    {
      id: 'alert-3',
      organizationId: 'org_hive_demo',
      customerId: 'c1',
      customerName: 'Priya Sharma',
      customerPhone: '+91 98765 43210',
      benefitType: 'LOYALTY_POINTS',
      benefitReferenceId: 'cla-1',
      benefitTitle: '500 Q3 Bonus Loyalty Points',
      daysUntilExpiry: 30,
      expiryDate: '2026-10-10T23:59:59Z',
      status: 'SCHEDULED',
      createdAt: '2026-09-10T00:00:00Z',
      updatedAt: '2026-09-10T00:00:00Z',
    },
  ]);

  // ---------------------------------------------------------------------------
  // 2. MODALS STATE
  // ---------------------------------------------------------------------------
  const [isNewPlanModalOpen, setIsNewPlanModalOpen] = React.useState(false);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = React.useState(false);
  const [isTopupModalOpen, setIsTopupModalOpen] = React.useState(false);
  const [isDebitModalOpen, setIsDebitModalOpen] = React.useState(false);
  const [isRedeemSessionModalOpen, setIsRedeemSessionModalOpen] = React.useState(false);
  const [isAddFamilyMemberModalOpen, setIsAddFamilyMemberModalOpen] = React.useState(false);
  const [isAwardPointsModalOpen, setIsAwardPointsModalOpen] = React.useState(false);
  const [isSendAlertModalOpen, setIsSendAlertModalOpen] = React.useState(false);

  // Form State for Top-up
  const [topupAmount, setTopupAmount] = React.useState<number>(5000);
  const [topupMethod, setTopupMethod] = React.useState<'UPI' | 'CASH' | 'CARD'>('UPI');
  const [topupReason, setTopupReason] = React.useState('Prepaid Wallet Recharge');
  const [isPromotionalTopup, setIsPromotionalTopup] = React.useState(false);
  const [promoExpiryDays, setPromoExpiryDays] = React.useState<number>(60);

  // Form State for Debit
  const [debitAmount, setDebitAmount] = React.useState<number>(1000);
  const [debitReason, setDebitReason] = React.useState('POS Service Payment');

  // Selected Item References
  const [selectedPackageForRedeem, setSelectedPackageForRedeem] = React.useState<CustomerPackageDto | null>(null);
  const [selectedAlertForSend, setSelectedAlertForSend] = React.useState<RetentionExpiryAlertDto | null>(null);
  const [alertChannel, setAlertChannel] = React.useState<'WHATSAPP' | 'SMS' | 'EMAIL'>('WHATSAPP');

  // ---------------------------------------------------------------------------
  // 3. POS BENEFIT EVALUATOR STATE
  // ---------------------------------------------------------------------------
  const [posCustomer, setPosCustomer] = React.useState<'c1' | 'c2' | 'c3'>('c1');
  const [selectedCartServices, setSelectedCartServices] = React.useState<Array<{ id: string; name: string; price: number }>>([
    { id: 'srv-2', name: 'Balayage & Multi-Dimensional Glaze', price: 6800 },
    { id: 'srv-3', name: 'Hydra-Oxygen Rejuvenation Medi-Facial', price: 3400 },
    { id: 'srv-1', name: 'Signature Royal Haircut & Beard Sculpting', price: 850 },
  ]);
  const [applyMembershipInPos, setApplyMembershipInPos] = React.useState(true);
  const [applyPackageInPos, setApplyPackageInPos] = React.useState(true);
  const [applyWalletInPos, setApplyWalletInPos] = React.useState(true);
  const [applyLoyaltyInPos, setApplyLoyaltyInPos] = React.useState(true);

  // POS Recalculation
  const posSubtotal = selectedCartServices.reduce((sum, item) => sum + item.price, 0);

  // 1. Package Session Offset (Hydra-Facial covered if package available)
  const isHydraCoveredByPackage =
    posCustomer === 'c1' && applyPackageInPos && selectedCartServices.some((s) => s.id === 'srv-3');
  const packageCoverageAmount = isHydraCoveredByPackage ? 3400 : 0;

  // 2. Membership Discount (20% on remaining services)
  const nonCoveredAmount = Math.max(0, posSubtotal - packageCoverageAmount);
  const posMembershipDiscount =
    posCustomer === 'c1' && applyMembershipInPos ? Math.round(nonCoveredAmount * 0.2) : 0;

  // 3. Loyalty Discount (850 pts = ₹850)
  const posLoyaltyDiscount =
    posCustomer === 'c1' && applyLoyaltyInPos
      ? Math.min(850, Math.max(0, nonCoveredAmount - posMembershipDiscount))
      : 0;

  // 4. Wallet Debit Available
  const amountBeforeWallet = Math.max(
    0,
    nonCoveredAmount - posMembershipDiscount - posLoyaltyDiscount
  );
  const posWalletDeduction =
    applyWalletInPos && posCustomer === 'c1' ? Math.min(activeWallet.currentBalance, amountBeforeWallet) : 0;

  // 5. Taxes & Net Payable
  const posTaxableAmount = Math.max(0, amountBeforeWallet - posWalletDeduction);
  const posGst = Math.round(posTaxableAmount * 0.18 * 100) / 100;
  const posNetPayable = Math.round((posTaxableAmount + posGst) * 100) / 100;

  // ---------------------------------------------------------------------------
  // 4. HANDLERS
  // ---------------------------------------------------------------------------
  const handleTopupWallet = (e: React.FormEvent) => {
    e.preventDefault();
    if (topupAmount <= 0) {
      toast.warning('Top-up amount must be strictly positive');
      return;
    }

    const newBalance = activeWallet.currentBalance + topupAmount;
    const newEntry: CustomerWalletLedgerEntryDto = {
      id: `wtx-${Date.now()}`,
      organizationId: 'org_hive_demo',
      customerId: 'c1',
      customerName: 'Priya Sharma',
      entryType: isPromotionalTopup
        ? 'PROMOTIONAL_CREDIT'
        : topupMethod === 'UPI'
        ? 'TOPUP_UPI'
        : topupMethod === 'CARD'
        ? 'TOPUP_CARD'
        : 'TOPUP_CASH',
      amount: topupAmount,
      promotionalAmount: isPromotionalTopup ? topupAmount : 0,
      balanceBefore: activeWallet.currentBalance,
      balanceAfter: newBalance,
      notes: isPromotionalTopup
        ? `${topupReason} (Valid for ${promoExpiryDays} days)`
        : topupReason,
      expiresAt: isPromotionalTopup
        ? new Date(Date.now() + promoExpiryDays * 24 * 60 * 60 * 1000).toISOString()
        : undefined,
      isExpired: false,
      createdAt: new Date().toISOString(),
    };

    setActiveWallet({
      ...activeWallet,
      currentBalance: newBalance,
      promotionalBalance: isPromotionalTopup
        ? activeWallet.promotionalBalance + topupAmount
        : activeWallet.promotionalBalance,
      nonPromotionalBalance: !isPromotionalTopup
        ? activeWallet.nonPromotionalBalance + topupAmount
        : activeWallet.nonPromotionalBalance,
      totalCredited: activeWallet.totalCredited + topupAmount,
      lastTransactionAt: new Date().toISOString(),
    });

    setWalletLedger([newEntry, ...walletLedger]);
    setIsTopupModalOpen(false);
    toast.success(`₹${topupAmount.toLocaleString('en-IN')} successfully credited to wallet.`);
  };

  const handleDebitWallet = (e: React.FormEvent) => {
    e.preventDefault();
    if (debitAmount <= 0) {
      toast.warning('Debit amount must be strictly positive');
      return;
    }

    // STRICT INVARIANT CHECK
    if (debitAmount > activeWallet.currentBalance) {
      toast.warning(
        `Insufficient balance! Available: ₹${activeWallet.currentBalance.toLocaleString('en-IN')}, Requested: ₹${debitAmount.toLocaleString('en-IN')}`
      );
      return;
    }

    const newBalance = activeWallet.currentBalance - debitAmount;
    const newEntry: CustomerWalletLedgerEntryDto = {
      id: `wtx-${Date.now()}`,
      organizationId: 'org_hive_demo',
      customerId: 'c1',
      customerName: 'Priya Sharma',
      entryType: 'DEBIT_POS',
      amount: -debitAmount,
      promotionalAmount: 0,
      balanceBefore: activeWallet.currentBalance,
      balanceAfter: newBalance,
      notes: debitReason,
      isExpired: false,
      createdAt: new Date().toISOString(),
    };

    setActiveWallet({
      ...activeWallet,
      currentBalance: newBalance,
      nonPromotionalBalance: Math.max(0, activeWallet.nonPromotionalBalance - debitAmount),
      totalDebited: activeWallet.totalDebited + debitAmount,
      lastTransactionAt: new Date().toISOString(),
    });

    setWalletLedger([newEntry, ...walletLedger]);
    setIsDebitModalOpen(false);
    toast.success(`₹${debitAmount.toLocaleString('en-IN')} debited. Double-entry ledger updated.`);
  };

  const handleRedeemPackageSession = () => {
    if (!selectedPackageForRedeem || selectedPackageForRedeem.remainingSessions <= 0) {
      toast.warning('Package has no available remaining sessions');
      return;
    }

    const updated = customerPackages.map((pkg) => {
      if (pkg.id === selectedPackageForRedeem.id) {
        const newUsed = pkg.usedSessions + 1;
        const newRemaining = pkg.remainingSessions - 1;
        return {
          ...pkg,
          usedSessions: newUsed,
          remainingSessions: newRemaining,
          status: newRemaining === 0 ? ('COMPLETED' as const) : ('ACTIVE' as const),
          redemptions: [
            {
              id: `red-${Date.now()}`,
              packageId: pkg.id,
              serviceName: pkg.packageName,
              stylistName: 'Aarav Mehta',
              redeemedByCustomerId: pkg.customerId,
              redeemedByName: pkg.customerName || 'Customer',
              isFamilyMemberRedemption: false,
              notes: 'Redeemed session via Retention Manager.',
              redeemedAt: new Date().toISOString(),
            },
            ...(pkg.redemptions || []),
          ],
        };
      }
      return pkg;
    });

    setCustomerPackages(updated);
    setIsRedeemSessionModalOpen(false);
    toast.success('Package session successfully redeemed and logged.');
  };

  const handleSendExpiryAlert = () => {
    if (!selectedAlertForSend) return;

    const updated = expiryAlerts.map((a) => {
      if (a.id === selectedAlertForSend.id) {
        return {
          ...a,
          status: 'SENT' as const,
          sentChannel: alertChannel,
          sentAt: new Date().toISOString(),
        };
      }
      return a;
    });

    setExpiryAlerts(updated);
    setIsSendAlertModalOpen(false);
    toast.success(
      `Renewal notification dispatched to ${selectedAlertForSend.customerName} via ${alertChannel}.`
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Memberships, Packages & Retention"
        description="Comprehensive customer retention engine: 6 membership plan archetypes, multi-session packages, customer wallets with zero-negative double-entry ledger, 4-tier loyalty program, shared family pools, POS benefit auto-evaluator, and 30/7/1-day pre-expiry alerts."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                toast.info('Retention data synced across all branch nodes.');
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync Ledgers
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsNewPlanModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Membership Plan
            </Button>
          </div>
        }
      />

      {/* Top Retention Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-neutral-500">Active Subscribers</div>
            <div className="text-xl font-bold text-neutral-900 dark:text-white">142 Members</div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              +18 this month (86% retention)
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-neutral-500">Prepaid Wallet Float</div>
            <div className="text-xl font-bold text-neutral-900 dark:text-white">₹4,82,500</div>
            <div className="text-[11px] text-neutral-500">100% Non-negative ledger verified</div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-neutral-500">Packages in Circulation</div>
            <div className="text-xl font-bold text-neutral-900 dark:text-white">88 Active Packs</div>
            <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">412 Unused Sessions</div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-neutral-500">Loyalty Points Liability</div>
            <div className="text-xl font-bold text-neutral-900 dark:text-white">48,200 Pts</div>
            <div className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">₹48,200 Redeemable</div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-neutral-500">Expiring Soon (30d)</div>
            <div className="text-xl font-bold text-neutral-900 dark:text-white">
              {expiryAlerts.length} Alerts
            </div>
            <div className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
              30/7/1-day reminder queue active
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between overflow-x-auto">
        <div className="flex gap-2">
          {[
            { id: 'PLANS', label: 'Membership Plans (6 Types)', icon: Crown },
            { id: 'PACKAGES', label: 'Service Packages', icon: Package, badge: customerPackages.length },
            { id: 'WALLETS', label: 'Customer Wallets & Ledger', icon: Wallet },
            { id: 'LOYALTY', label: 'Loyalty Tiers & Points', icon: Award },
            { id: 'FAMILY', label: 'Family Plans & Shared Pool', icon: Users, badge: familyPlans.length },
            { id: 'POS_EVALUATOR', label: 'POS Benefit Evaluator', icon: Receipt },
            { id: 'EXPIRY_ALERTS', label: 'Expiry Alerts (30/7/1-Day)', icon: Clock, badge: expiryAlerts.length },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20'
                    : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
                {t.badge !== undefined && (
                  <span className="px-1.5 py-0.5 rounded-full text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                    {t.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: MEMBERSHIP PLANS & SUBSCRIBERS */}
      {/* ===================================================================== */}
      {activeTab === 'PLANS' && (
        <div className="space-y-6">
          {/* Plans Grid */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                Configured Membership Plan Archetypes
              </h2>
              <p className="text-xs text-neutral-500">
                Covers all 6 required enterprise retention types: Discount, Prepaid Credit, Service Package, Family Pool, Monthly, and Annual.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEnrollModalOpen(true)}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Enroll Customer in Plan
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {plans.map((p) => {
              const typeBadgeColor =
                p.type === 'DISCOUNT'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                  : p.type === 'PREPAID_CREDIT'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                  : p.type === 'SERVICE_PACKAGE'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                  : p.type === 'FAMILY_PACKAGE'
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
                  : p.type === 'MONTHLY_PLAN'
                  ? 'bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300'
                  : 'bg-slate-800 text-slate-100';

              return (
                <div
                  key={p.id}
                  className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between hover:border-amber-400/50 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${typeBadgeColor}`}>
                        {p.type.replace('_', ' ')}
                      </span>
                      <span className="text-xs font-mono font-bold text-neutral-400">
                        {p.code}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                        {p.name}
                      </h3>
                      <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                        {p.description}
                      </p>
                    </div>

                    <div className="py-2 border-y border-neutral-100 dark:border-neutral-800/60 flex items-baseline justify-between">
                      <div>
                        <span className="text-2xl font-black text-neutral-900 dark:text-white">
                          ₹{p.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-neutral-400 ml-1">
                          / {p.validityDays} days
                        </span>
                      </div>
                      {p.discountPercentage > 0 && (
                        <div className="text-right">
                          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                            {p.discountPercentage}% OFF
                          </span>
                          <div className="text-[10px] text-neutral-400">Services</div>
                        </div>
                      )}
                    </div>

                    {/* Perks List */}
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                        Included Benefits & Perks
                      </div>
                      {p.perks?.slice(0, 3).map((perk, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-xs text-neutral-700 dark:text-neutral-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                          <span>{perk}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                    <span className="text-neutral-500">
                      {p.allowFamilySharing ? `Family Share (Up to ${p.maxFamilyMembers})` : 'Individual Member'}
                    </span>
                    <button
                      onClick={() => {
                        setIsEnrollModalOpen(true);
                      }}
                      className="text-amber-600 dark:text-amber-400 font-semibold hover:underline flex items-center gap-1"
                    >
                      Enroll Client <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Subscriptions Table */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  Active Subscriber Directory & Lifecycle Tracking
                </h3>
                <p className="text-xs text-neutral-500">
                  Real-time status, start/expiry dates, cumulative savings, and auto-renewal states.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Search customer or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 text-xs"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-semibold">
                    <th className="py-2.5 px-3">Membership Code</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Plan Enrolled</th>
                    <th className="py-2.5 px-3">Price Paid</th>
                    <th className="py-2.5 px-3">Start & Expiry</th>
                    <th className="py-2.5 px-3">Days Left</th>
                    <th className="py-2.5 px-3">Total Saved</th>
                    <th className="py-2.5 px-3">Usage</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                  {subscriptions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                      <td className="py-3 px-3 font-mono font-bold text-neutral-900 dark:text-white">
                        {sub.membershipCode}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-neutral-900 dark:text-white">
                          {sub.customerName}
                        </div>
                        <div className="text-[11px] text-neutral-400">{sub.customerPhone}</div>
                      </td>
                      <td className="py-3 px-3 font-medium text-neutral-800 dark:text-neutral-200">
                        {sub.planName}
                      </td>
                      <td className="py-3 px-3 font-bold text-neutral-900 dark:text-white">
                        ₹{sub.pricePaid.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-neutral-600 dark:text-neutral-400">
                        <div>Start: {new Date(sub.startDate).toLocaleDateString()}</div>
                        <div className="text-[11px] text-neutral-400">
                          Exp: {new Date(sub.expiryDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded font-bold text-[11px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                          {sub.daysRemaining} days left
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-emerald-600 dark:text-emerald-400">
                        ₹{sub.totalSaved.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-neutral-600 dark:text-neutral-400 font-medium">
                        {sub.usageCount} visits
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                          {sub.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            toast.success(`Sent renewal offer to ${sub.customerName}`);
                          }}
                        >
                          Send Renewal
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: SERVICE PACKAGES (MULTI-SESSION) */}
      {/* ===================================================================== */}
      {activeTab === 'PACKAGES' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                Multi-Session Service Packages & Session Ledger
              </h2>
              <p className="text-xs text-neutral-500">
                Track Total Purchased, Used, and Remaining sessions with full stylist attribution and family member sharing.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                toast.info('Open Package Purchase Modal');
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Sell New Package Pass
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {customerPackages.map((pkg) => {
              const usagePercent = Math.round((pkg.usedSessions / pkg.totalSessions) * 100);
              return (
                <div
                  key={pkg.id}
                  className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                        {pkg.packageCode}
                      </span>
                      <h3 className="text-base font-bold text-neutral-900 dark:text-white mt-1">
                        {pkg.packageName}
                      </h3>
                      <div className="text-xs text-neutral-500">
                        Customer: <span className="font-semibold text-neutral-800 dark:text-neutral-200">{pkg.customerName}</span> ({pkg.customerPhone})
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black text-neutral-900 dark:text-white">
                        ₹{pkg.totalPrice.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        ₹{pkg.sessionPrice} / session
                      </div>
                    </div>
                  </div>

                  {/* Visual Session Counter */}
                  <div className="bg-neutral-50 dark:bg-neutral-800/40 p-4 rounded-lg space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-neutral-600 dark:text-neutral-400">
                        Sessions Progress: {pkg.usedSessions} / {pkg.totalSessions} Used
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        {pkg.remainingSessions} Remaining
                      </span>
                    </div>

                    <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full transition-all duration-500"
                        style={{ width: `${usagePercent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1">
                      <span>Purchased: {new Date(pkg.purchasedAt).toLocaleDateString()}</span>
                      <span className="font-medium text-amber-600 dark:text-amber-400">
                        Expires in {pkg.daysRemaining} days ({new Date(pkg.expiresAt || '').toLocaleDateString()})
                      </span>
                    </div>
                  </div>

                  {/* Past Redemptions Ledger */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                      Recent Session Redemptions Ledger
                    </div>
                    {pkg.redemptions && pkg.redemptions.length > 0 ? (
                      <div className="space-y-1.5">
                        {pkg.redemptions.map((red) => (
                          <div
                            key={red.id}
                            className="text-xs p-2.5 rounded-md bg-white dark:bg-neutral-800/80 border border-neutral-100 dark:border-neutral-700 flex items-center justify-between"
                          >
                            <div>
                              <div className="font-semibold text-neutral-900 dark:text-white">
                                {red.redeemedByName} {red.isFamilyMemberRedemption && '(Family Member)'}
                              </div>
                              <div className="text-[11px] text-neutral-500">
                                Stylist: {red.stylistName || 'Master Stylist'} • {new Date(red.redeemedAt).toLocaleDateString()}
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                              REDEEMED
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-neutral-400 italic py-2 text-center">
                        No sessions redeemed yet. Full balance available.
                      </div>
                    )}
                  </div>

                  {/* Action */}
                  <div className="pt-2 flex items-center justify-end">
                    <Button
                      variant="primary"
                      size="sm"
                      disabled={pkg.remainingSessions <= 0}
                      onClick={() => {
                        setSelectedPackageForRedeem(pkg);
                        setIsRedeemSessionModalOpen(true);
                      }}
                    >
                      <Scissors className="w-3.5 h-3.5 mr-1.5" />
                      Redeem 1 Session
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: CUSTOMER PREPAID WALLET & DOUBLE-ENTRY LEDGER */}
      {/* ===================================================================== */}
      {activeTab === 'WALLETS' && (
        <div className="space-y-6">
          {/* Customer Wallet Summary Card */}
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-neutral-950">
                    PREPAID WALLET PASS
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">
                    ID: {activeWallet.customerId}
                  </span>
                </div>
                <h2 className="text-2xl font-black">{activeWallet.customerName}</h2>
                <div className="text-xs text-neutral-300 flex items-center gap-4">
                  <span>Phone: {activeWallet.customerPhone}</span>
                  <span>•</span>
                  <span>Zero-Negative Ledger Verified</span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="bg-neutral-800/80 border border-neutral-700 p-4 rounded-xl text-right min-w-[200px]">
                  <div className="text-xs text-neutral-400 font-medium">Available Usable Balance</div>
                  <div className="text-3xl font-black text-amber-400 mt-1">
                    ₹{activeWallet.currentBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-1">
                    Non-Promo: ₹{activeWallet.nonPromotionalBalance} | Promo: ₹{activeWallet.promotionalBalance}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setIsTopupModalOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-1.5" />
                    Top-Up Balance
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsDebitModalOpen(true)}
                  >
                    <CreditCard className="w-4 h-4 mr-1.5" />
                    Debit at POS
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Double-Entry Ledger Table */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  Double-Entry Wallet Transaction Ledger (Immutable Audit Trail)
                </h3>
                <p className="text-xs text-neutral-500">
                  Every top-up, promotional credit, POS debit, and refund produces an immutable ledger record with balanceBefore and balanceAfter.
                </p>
              </div>
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Ledger Integrity Verified
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-semibold">
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Notes & Reason</th>
                    <th className="py-2.5 px-3 text-right">Balance Before</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                    <th className="py-2.5 px-3 text-right">Balance After</th>
                    <th className="py-2.5 px-3 text-center">Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-mono">
                  {walletLedger.map((tx) => {
                    const isCredit = tx.amount > 0;
                    const typeBadge =
                      tx.entryType === 'PROMOTIONAL_CREDIT'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
                        : tx.entryType === 'DEBIT_POS'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
                        : tx.entryType === 'REFUND_CREDIT'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300';

                    return (
                      <tr key={tx.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 font-sans">
                        <td className="py-3 px-3 text-neutral-500 text-[11px]">
                          {new Date(tx.createdAt).toLocaleString()}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${typeBadge}`}>
                            {tx.entryType.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-neutral-800 dark:text-neutral-200 font-medium">
                          {tx.notes}
                          {tx.expiresAt && (
                            <span className="block text-[10px] text-amber-600 dark:text-amber-400">
                              Expires: {new Date(tx.expiresAt).toLocaleDateString()}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-neutral-500">
                          ₹{tx.balanceBefore.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td
                          className={`py-3 px-3 text-right font-mono font-bold ${
                            isCredit
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {isCredit ? `+₹${tx.amount.toFixed(2)}` : `-₹${Math.abs(tx.amount).toFixed(2)}`}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-neutral-900 dark:text-white">
                          ₹{tx.balanceAfter.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-3 text-center text-neutral-400 text-[11px] font-mono">
                          {tx.referenceInvoiceId || 'DIRECT_TOPUP'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 4: LOYALTY PROGRAM & TIERS */}
      {/* ===================================================================== */}
      {activeTab === 'LOYALTY' && (
        <div className="space-y-6">
          {/* Tiers Showcase */}
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              Loyalty Tiers Matrix & Multipliers
            </h2>
            <p className="text-xs text-neutral-500">
              Customers automatically graduate across tiers based on lifetime spend and visit frequency. Points are redeemable at ₹1.00 per point at POS checkout.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {loyaltyTiers.map((tier) => (
              <div
                key={tier.id}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-sm relative overflow-hidden space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-bold px-2.5 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: tier.color }}
                  >
                    {tier.tierName}
                  </span>
                  <Award className="w-5 h-5 text-neutral-400" />
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-neutral-500">Spend Qualification</div>
                  <div className="text-base font-bold text-neutral-900 dark:text-white">
                    ₹{tier.minSpendRequired.toLocaleString('en-IN')}
                    {tier.minVisitsRequired > 0 && ` or ${tier.minVisitsRequired} visits`}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Earning Rate:</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      {tier.pointsPerHundredRupees} pts / ₹100
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Redemption:</span>
                    <span className="font-bold text-neutral-900 dark:text-white">1 pt = ₹1.00</span>
                  </div>
                  {tier.discountPerkPercentage > 0 && (
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Birthday Discount:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {tier.discountPerkPercentage}% OFF
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Active Customer Loyalty Progress Card */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                  {activeLoyalty.tierName}
                </span>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mt-1">
                  {activeLoyalty.customerName} ({activeLoyalty.customerPhone})
                </h3>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-xs text-neutral-500">Current Points Balance</div>
                  <div className="text-2xl font-black text-amber-500">
                    {activeLoyalty.currentPoints} Pts
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    = ₹{activeLoyalty.currentPoints.toFixed(2)} at Checkout
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsAwardPointsModalOpen(true)}
                >
                  <Gift className="w-4 h-4 mr-1.5" />
                  Grant Bonus / Referral Points
                </Button>
              </div>
            </div>

            {/* Progress to Next Tier */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                  Progress to Platinum VIP (₹1,00,000 Milestone)
                </span>
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {activeLoyalty.nextTierProgressPercentage}% Complete (₹{activeLoyalty.nextTierSpendNeeded.toLocaleString('en-IN')} to go)
                </span>
              </div>
              <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{ width: `${activeLoyalty.nextTierProgressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Points Ledger */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Loyalty Points History & Referral Credits
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-semibold">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Notes</th>
                    <th className="py-2.5 px-3 text-right">Points Before</th>
                    <th className="py-2.5 px-3 text-right">Points Granted</th>
                    <th className="py-2.5 px-3 text-right">Points After</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-mono">
                  {loyaltyLedger.map((e) => (
                    <tr key={e.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 font-sans">
                      <td className="py-2.5 px-3 text-neutral-500 text-[11px]">
                        {new Date(e.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                          {e.entryType.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-neutral-800 dark:text-neutral-200 font-medium">
                        {e.notes}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-neutral-500">
                        {e.pointsBefore}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        +{e.points} pts
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-neutral-900 dark:text-white">
                        {e.pointsAfter}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 5: FAMILY PLANS & SHARED POOLS */}
      {/* ===================================================================== */}
      {activeTab === 'FAMILY' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                Family Plans & Shared Benefit Pools
              </h2>
              <p className="text-xs text-neutral-500">
                Primary customers share discount perks, multi-session packages, and prepaid wallets with authorized family members while tracking individual usage attribution.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAddFamilyMemberModalOpen(true)}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Family Member
            </Button>
          </div>

          {familyPlans.map((fp) => (
            <div
              key={fp.id}
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm space-y-5"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">
                    SHARED POOL ACTIVE ({fp.members.length} / {fp.maxMembers} Members)
                  </span>
                  <h3 className="text-lg font-black text-neutral-900 dark:text-white mt-1">
                    {fp.planName}
                  </h3>
                  <div className="text-xs text-neutral-500">
                    Primary Account Owner: <span className="font-bold text-neutral-800 dark:text-neutral-200">{fp.primaryCustomerName}</span> ({fp.primaryCustomerPhone})
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 font-semibold">
                    ✓ Shared 20% Discount
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 font-semibold">
                    ✓ Shared Hydra-Facial Pack
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 font-semibold">
                    ✓ Shared Wallet (₹4,200)
                  </span>
                </div>
              </div>

              {/* Family Members Grid */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Linked Family Members & Authorization Controls
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {fp.members.map((member) => (
                    <div
                      key={member.id}
                      className="p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-neutral-900 dark:text-white">
                          {member.fullName}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300">
                          {member.relationship}
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-500">{member.phone}</div>

                      <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700/60 space-y-1 text-[11px]">
                        <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                          <span>Wallet Debit:</span>
                          <span className={member.isAuthorizedToDebitWallet ? 'text-emerald-600 font-bold' : 'text-neutral-400'}>
                            {member.isAuthorizedToDebitWallet ? 'Authorized (₹' + member.spendingLimitMonthly + '/mo)' : 'Restricted'}
                          </span>
                        </div>
                        <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                          <span>Package Access:</span>
                          <span className={member.isAuthorizedToUsePackages ? 'text-emerald-600 font-bold' : 'text-neutral-400'}>
                            {member.isAuthorizedToUsePackages ? 'Authorized' : 'Restricted'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Family Usage Attribution Log */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Per-Person Family Benefit Usage Audit Log
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-semibold">
                        <th className="py-2 px-3">Date</th>
                        <th className="py-2 px-3">Family Member</th>
                        <th className="py-2 px-3">Relationship</th>
                        <th className="py-2 px-3">Benefit Type</th>
                        <th className="py-2 px-3">Service Availed</th>
                        <th className="py-2 px-3 text-right">Value Availed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                      {familyUsageRecords.map((fu) => (
                        <tr key={fu.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                          <td className="py-2.5 px-3 text-neutral-500 text-[11px]">
                            {new Date(fu.usedAt).toLocaleDateString()}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-neutral-900 dark:text-white">
                            {fu.familyMemberName}
                          </td>
                          <td className="py-2.5 px-3 text-neutral-500">
                            {fu.relationship}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400">
                              {fu.benefitType.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-neutral-800 dark:text-neutral-200">
                            {fu.serviceName}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                            ₹{fu.amountSavedOrSpent.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 6: POS CHECKOUT BENEFIT EVALUATOR & SIMULATOR */}
      {/* ===================================================================== */}
      {activeTab === 'POS_EVALUATOR' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              POS Checkout Retention Benefit Evaluator
            </h2>
            <p className="text-xs text-neutral-500">
              Simulate checkout at the POS front desk. When a customer is selected, the retention engine automatically evaluates their active membership discount, available multi-session packages, wallet credits, and loyalty points.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left: Customer & Cart Simulation Controls */}
            <div className="space-y-4">
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-sm space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  1. Select Customer Account
                </h3>
                <div className="space-y-2">
                  {[
                    { id: 'c1', name: 'Priya Sharma (Diamond Club VIP)', tier: 'Diamond Club + 6-Facial Pack + ₹4.2k Wallet' },
                    { id: 'c2', name: 'Rahul Verma (Gold Member)', tier: 'Prepaid 15k + 10 Haircuts Pass' },
                    { id: 'c3', name: 'Ananya Roy (Walk-In Guest)', tier: 'Standard Guest (No active membership)' },
                  ].map((cust) => (
                    <button
                      key={cust.id}
                      onClick={() => setPosCustomer(cust.id as any)}
                      className={`w-full text-left p-3 rounded-lg border transition-all text-xs ${
                        posCustomer === cust.id
                          ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 font-semibold text-neutral-900 dark:text-white'
                          : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'
                      }`}
                    >
                      <div className="font-bold">{cust.name}</div>
                      <div className="text-[11px] text-neutral-500 mt-0.5">{cust.tier}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-sm space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  2. Cart Line Items for Billing
                </h3>
                <div className="space-y-2">
                  {selectedCartServices.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs p-2 rounded bg-neutral-50 dark:bg-neutral-800/50"
                    >
                      <span className="font-medium text-neutral-800 dark:text-neutral-200 truncate pr-2">
                        {item.name}
                      </span>
                      <span className="font-bold text-neutral-900 dark:text-white shrink-0">
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex justify-between text-xs font-bold">
                    <span>Menu Subtotal:</span>
                    <span>₹{posSubtotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle: Auto-Detected Retention Benefits */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Auto-Detected Retention Benefits
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                  AUTO-EVALUATED
                </span>
              </div>

              {posCustomer === 'c1' ? (
                <div className="space-y-3">
                  {/* Benefit 1: Package Session Offset */}
                  <label className="flex items-start gap-3 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={applyPackageInPos}
                      onChange={(e) => setApplyPackageInPos(e.target.checked)}
                      className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-emerald-900 dark:text-emerald-300">
                        Redeem 1 Session from 6 Hydra-Facial Pack
                      </div>
                      <div className="text-neutral-600 dark:text-neutral-400 mt-0.5">
                        Matches cart service "Hydra-Oxygen Medi-Facial". Reduces item cost from ₹3,400 to ₹0.00!
                      </div>
                    </div>
                  </label>

                  {/* Benefit 2: Membership Discount */}
                  <label className="flex items-start gap-3 p-3 rounded-lg border border-amber-200 dark:border-amber-800/60 bg-amber-50/40 dark:bg-amber-950/20 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={applyMembershipInPos}
                      onChange={(e) => setApplyMembershipInPos(e.target.checked)}
                      className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-amber-900 dark:text-amber-300">
                        Royal Diamond Club 20% Membership Discount
                      </div>
                      <div className="text-neutral-600 dark:text-neutral-400 mt-0.5">
                        Applies 20% discount on Balayage & Haircut (Saves ₹{posMembershipDiscount}).
                      </div>
                    </div>
                  </label>

                  {/* Benefit 3: Loyalty Points */}
                  <label className="flex items-start gap-3 p-3 rounded-lg border border-purple-200 dark:border-purple-800/60 bg-purple-50/40 dark:bg-purple-950/20 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={applyLoyaltyInPos}
                      onChange={(e) => setApplyLoyaltyInPos(e.target.checked)}
                      className="mt-0.5 rounded text-purple-600 focus:ring-purple-500"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-purple-900 dark:text-purple-300">
                        Redeem 850 Gold Loyalty Points (₹850.00 Value)
                      </div>
                      <div className="text-neutral-600 dark:text-neutral-400 mt-0.5">
                        Direct ₹1.00/point deduction applied against remaining balance.
                      </div>
                    </div>
                  </label>

                  {/* Benefit 4: Wallet Debit */}
                  <label className="flex items-start gap-3 p-3 rounded-lg border border-blue-200 dark:border-blue-800/60 bg-blue-50/40 dark:bg-blue-950/20 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={applyWalletInPos}
                      onChange={(e) => setApplyWalletInPos(e.target.checked)}
                      className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-blue-900 dark:text-blue-300">
                        Debit Prepaid Wallet Balance (₹{posWalletDeduction.toFixed(2)})
                      </div>
                      <div className="text-neutral-600 dark:text-neutral-400 mt-0.5">
                        Available: ₹{activeWallet.currentBalance.toFixed(2)} (Non-negative check passed).
                      </div>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-neutral-400 border border-dashed rounded-lg">
                  No active retention membership or packages found for this customer.
                </div>
              )}
            </div>

            {/* Right: Recalculated Final Bill Summary */}
            <div className="bg-neutral-900 text-white rounded-xl p-5 shadow-lg space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
                  Recalculated Checkout Invoice
                </h3>
                <div className="space-y-2 mt-4 text-xs">
                  <div className="flex justify-between text-neutral-400">
                    <span>Menu Price Subtotal:</span>
                    <span>₹{posSubtotal.toLocaleString('en-IN')}</span>
                  </div>

                  {packageCoverageAmount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-medium">
                      <span>Package Session (Facial):</span>
                      <span>-₹{packageCoverageAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {posMembershipDiscount > 0 && (
                    <div className="flex justify-between text-amber-400 font-medium">
                      <span>Membership 20% Discount:</span>
                      <span>-₹{posMembershipDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {posLoyaltyDiscount > 0 && (
                    <div className="flex justify-between text-purple-400 font-medium">
                      <span>Loyalty Points (850 pts):</span>
                      <span>-₹{posLoyaltyDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {posWalletDeduction > 0 && (
                    <div className="flex justify-between text-blue-400 font-medium">
                      <span>Wallet Credit Applied:</span>
                      <span>-₹{posWalletDeduction.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-neutral-800 flex justify-between text-neutral-400">
                    <span>Taxable Value:</span>
                    <span>₹{posTaxableAmount.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between text-neutral-400 text-[11px]">
                    <span>GST (CGST 9% + SGST 9%):</span>
                    <span>₹{posGst.toFixed(2)}</span>
                  </div>

                  <div className="pt-3 border-t border-neutral-800 flex justify-between text-base font-black text-white">
                    <span>Final Net Payable:</span>
                    <span className="text-amber-400">₹{posNetPayable.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  variant="primary"
                  className="w-full justify-center"
                  onClick={() => {
                    toast.success(
                      `Checkout simulated! Total customer savings: ₹${(posSubtotal - posNetPayable).toFixed(2)}`
                    );
                  }}
                >
                  <Receipt className="w-4 h-4 mr-2" />
                  Apply & Generate POS Invoice
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 7: EXPIRY ALERTS (30/7/1-DAY ENGINE) */}
      {/* ===================================================================== */}
      {activeTab === 'EXPIRY_ALERTS' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                Automated 30/7/1-Day Expiry & Renewal Alerts
              </h2>
              <p className="text-xs text-neutral-500">
                Proactively notifies customers before their membership, package sessions, promo credits, or loyalty points expire.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500 font-medium">Auto-dispatch:</span>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                ENABLED (WhatsApp + SMS)
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-semibold">
                    <th className="py-2.5 px-3">Stage / Urgency</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Benefit Expiring</th>
                    <th className="py-2.5 px-3">Expiry Date</th>
                    <th className="py-2.5 px-3">Renewal Offer</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                  {expiryAlerts.map((alert) => {
                    const urgencyBadge =
                      alert.daysUntilExpiry <= 1
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
                        : alert.daysUntilExpiry <= 7
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300';

                    return (
                      <tr key={alert.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                        <td className="py-3 px-3">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${urgencyBadge}`}>
                            {alert.daysUntilExpiry === 1 ? '1 DAY (TOMORROW)' : `${alert.daysUntilExpiry} DAYS BEFORE`}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-neutral-900 dark:text-white">
                            {alert.customerName}
                          </div>
                          <div className="text-[11px] text-neutral-400">{alert.customerPhone}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-medium text-neutral-900 dark:text-white">
                            {alert.benefitTitle}
                          </div>
                          <div className="text-[10px] text-neutral-400 uppercase tracking-wider">
                            Type: {alert.benefitType}
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono font-medium text-neutral-700 dark:text-neutral-300">
                          {new Date(alert.expiryDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-3 font-semibold text-emerald-600 dark:text-emerald-400">
                          {alert.renewalOfferDiscount ? `${alert.renewalOfferDiscount}% Off Renewal` : 'Standard Renewal'}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              alert.status === 'SENT'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                                : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                            }`}
                          >
                            {alert.status} {alert.sentChannel && `via ${alert.sentChannel}`}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedAlertForSend(alert);
                              setIsSendAlertModalOpen(true);
                            }}
                          >
                            <Send className="w-3.5 h-3.5 mr-1" />
                            Send Renewal Alert
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 1: WALLET TOP-UP MODAL */}
      {/* ===================================================================== */}
      <Modal
        isOpen={isTopupModalOpen}
        onClose={() => setIsTopupModalOpen(false)}
        title="Top-Up Customer Prepaid Wallet"
      >
        <form onSubmit={handleTopupWallet} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Top-Up Amount (INR ₹)
            </label>
            <Input
              type="number"
              min="1"
              value={topupAmount}
              onChange={(e) => setTopupAmount(parseFloat(e.target.value) || 0)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['UPI', 'CARD', 'CASH'].map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setTopupMethod(m as any)}
                  className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                    topupMethod === m
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-600'
                      : 'border-neutral-200 dark:border-neutral-700'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Transaction Reason / Notes
            </label>
            <Input
              value={topupReason}
              onChange={(e) => setTopupReason(e.target.value)}
              required
            />
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 pt-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isPromotionalTopup}
              onChange={(e) => setIsPromotionalTopup(e.target.checked)}
              className="rounded text-amber-600"
            />
            Mark as Promotional Bonus Credit (With Expiry Timestamp)
          </label>

          {isPromotionalTopup && (
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Validity (Days until auto-expiry write-off)
              </label>
              <Input
                type="number"
                min="1"
                value={promoExpiryDays}
                onChange={(e) => setPromoExpiryDays(parseInt(e.target.value, 10) || 30)}
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsTopupModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Confirm Wallet Credit
            </Button>
          </div>
        </form>
      </Modal>

      {/* ===================================================================== */}
      {/* MODAL 2: WALLET DEBIT MODAL */}
      {/* ===================================================================== */}
      <Modal
        isOpen={isDebitModalOpen}
        onClose={() => setIsDebitModalOpen(false)}
        title="Debit Customer Wallet (POS Deduction)"
      >
        <form onSubmit={handleDebitWallet} className="space-y-4">
          <div className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-xs flex justify-between">
            <span className="text-neutral-500">Available Usable Balance:</span>
            <span className="font-bold text-neutral-900 dark:text-white">
              ₹{activeWallet.currentBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Debit Amount (INR ₹)
            </label>
            <Input
              type="number"
              min="1"
              max={activeWallet.currentBalance}
              value={debitAmount}
              onChange={(e) => setDebitAmount(parseFloat(e.target.value) || 0)}
              required
            />
            {debitAmount > activeWallet.currentBalance && (
              <span className="text-[11px] text-rose-600 font-semibold mt-1 block">
                Cannot exceed available balance of ₹{activeWallet.currentBalance.toFixed(2)}
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Deduction Reason
            </label>
            <Input
              value={debitReason}
              onChange={(e) => setDebitReason(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsDebitModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={debitAmount > activeWallet.currentBalance || debitAmount <= 0}
            >
              Confirm POS Debit
            </Button>
          </div>
        </form>
      </Modal>

      {/* ===================================================================== */}
      {/* MODAL 3: REDEEM PACKAGE SESSION */}
      {/* ===================================================================== */}
      <Modal
        isOpen={isRedeemSessionModalOpen}
        onClose={() => setIsRedeemSessionModalOpen(false)}
        title="Redeem Package Service Session"
      >
        <div className="space-y-4 text-xs">
          {selectedPackageForRedeem && (
            <div className="p-3.5 rounded-lg bg-neutral-50 dark:bg-neutral-800 space-y-1">
              <div className="font-bold text-neutral-900 dark:text-white text-sm">
                {selectedPackageForRedeem.packageName}
              </div>
              <div className="text-neutral-500">
                Customer: {selectedPackageForRedeem.customerName}
              </div>
              <div className="text-emerald-600 font-bold">
                Available Sessions: {selectedPackageForRedeem.remainingSessions}
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Attending Stylist
            </label>
            <select className="w-full p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs">
              <option>Aarav Mehta (Master Stylist)</option>
              <option>Pooja Hegde (Senior Colorist)</option>
              <option>Ananya Roy (Lead Aesthetician)</option>
              <option>Vikram Sethi (Senior Barber)</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <Button variant="outline" size="sm" onClick={() => setIsRedeemSessionModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleRedeemPackageSession}>
              Confirm Session Redemption
            </Button>
          </div>
        </div>
      </Modal>

      {/* ===================================================================== */}
      {/* MODAL 4: SEND EXPIRY ALERT */}
      {/* ===================================================================== */}
      <Modal
        isOpen={isSendAlertModalOpen}
        onClose={() => setIsSendAlertModalOpen(false)}
        title="Dispatch Pre-Expiry Renewal Alert"
      >
        <div className="space-y-4 text-xs">
          {selectedAlertForSend && (
            <div className="p-3.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 space-y-1">
              <div className="font-bold text-neutral-900 dark:text-white">
                Recipient: {selectedAlertForSend.customerName} ({selectedAlertForSend.customerPhone})
              </div>
              <div className="text-neutral-600 dark:text-neutral-300">
                Subject: {selectedAlertForSend.benefitTitle} expires in {selectedAlertForSend.daysUntilExpiry} days
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Delivery Channel
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['WHATSAPP', 'SMS', 'EMAIL'].map((ch) => (
                <button
                  key={ch}
                  onClick={() => setAlertChannel(ch as any)}
                  className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                    alertChannel === ch
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-600'
                      : 'border-neutral-200 dark:border-neutral-700'
                  }`}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 italic">
            "Dear {selectedAlertForSend?.customerName}, your {selectedAlertForSend?.benefitTitle} will expire on {selectedAlertForSend ? new Date(selectedAlertForSend.expiryDate).toLocaleDateString() : ''}. Renew today to lock in an exclusive 15% renewal discount. Visit Hive Salon Jubilee Hills or reply YES."
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <Button variant="outline" size="sm" onClick={() => setIsSendAlertModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSendExpiryAlert}>
              <Send className="w-3.5 h-3.5 mr-1.5" />
              Dispatch Notification
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function MembershipsPage() {
  return <MembershipsView initialTab="PLANS" />;
}

