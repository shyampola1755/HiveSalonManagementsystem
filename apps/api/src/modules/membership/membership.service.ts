import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import type {
  MembershipPlanDto,
  CustomerMembershipDto,
  ServicePackageTemplateDto,
  CustomerPackageDto,
  CustomerPackageRedemptionDto,
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
  CreateMembershipPlanPayload,
  EnrollCustomerMembershipPayload,
  CreatePackageTemplatePayload,
  PurchaseCustomerPackagePayload,
  RedeemPackageSessionPayload,
  WalletTopupPayload,
  WalletDebitPayload,
  AwardLoyaltyPointsPayload,
  CreateFamilyPlanPayload,
  AddFamilyMemberPayload,
  SendExpiryAlertPayload,
} from '@hive/types';

@Injectable()
export class MembershipService {
  // In-memory data stores with enterprise seeds for immediate zero-config demo resilience
  private plansDb = new Map<string, MembershipPlanDto>();
  private customerMembershipsDb = new Map<string, CustomerMembershipDto>();
  private packageTemplatesDb = new Map<string, ServicePackageTemplateDto>();
  private customerPackagesDb = new Map<string, CustomerPackageDto>();
  private customerWalletsDb = new Map<string, CustomerWalletDto>();
  private walletLedgerDb: CustomerWalletLedgerEntryDto[] = [];
  private loyaltyTiersDb: LoyaltyTierDto[] = [];
  private loyaltyAccountsDb = new Map<string, CustomerLoyaltyAccountDto>();
  private loyaltyLedgerDb: LoyaltyPointsLedgerEntryDto[] = [];
  private familyPlansDb = new Map<string, FamilyPlanDto>();
  private familyUsageDb: FamilyMemberUsageRecordDto[] = [];
  private expiryAlertsDb: RetentionExpiryAlertDto[] = [];

  constructor() {
    this.seedInitialData();
  }

  // ---------------------------------------------------------------------------
  // 1. INITIAL ENTERPRISE SEED DATA
  // ---------------------------------------------------------------------------
  private seedInitialData() {
    // 1. Membership Plans (6 Types)
    const seedPlans: MembershipPlanDto[] = [
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
        eligibleCategories: ['Hair', 'Hair Color', 'Skin', 'Spa', 'Nails'],
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
    ];
    seedPlans.forEach((p) => this.plansDb.set(p.id, p));

    // 2. Service Package Templates
    const seedTemplates: ServicePackageTemplateDto[] = [
      {
        id: 'tmpl-1',
        organizationId: 'org_hive_demo',
        name: '10 Signature Haircuts Pass',
        code: 'PKG-HAIR-10',
        description: '10 Sessions of Royal Haircut & Beard Sculpting (Original ₹8,500 value).',
        serviceId: 'srv-1',
        serviceName: 'Signature Royal Haircut & Beard Sculpting',
        totalSessions: 10,
        price: 4500,
        validityDays: 180,
        savingsPercentage: 47.05,
        allowFamilySharing: true,
        color: '#059669',
        isActive: true,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
      {
        id: 'tmpl-2',
        organizationId: 'org_hive_demo',
        name: '6 Hydra-Oxygen Medi-Facial Pack',
        code: 'PKG-FACIAL-06',
        description: '6 Sessions of Hydra-Oxygen Skin Rejuvenation (Original ₹20,400 value).',
        serviceId: 'srv-3',
        serviceName: 'Hydra-Oxygen Rejuvenation Medi-Facial',
        totalSessions: 6,
        price: 16500,
        validityDays: 240,
        savingsPercentage: 19.11,
        allowFamilySharing: true,
        color: '#0284c7',
        isActive: true,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
      {
        id: 'tmpl-3',
        organizationId: 'org_hive_demo',
        name: '5 Balinese Aromatic Spa Rituals',
        code: 'PKG-SPA-05',
        description: '5 Deep Tissue Massage Sessions (Original ₹19,500 value).',
        serviceId: 'srv-4',
        serviceName: 'Balinese Aromatic Deep Tissue Massage',
        totalSessions: 5,
        price: 15000,
        validityDays: 180,
        savingsPercentage: 23.08,
        allowFamilySharing: false,
        color: '#7c3aed',
        isActive: true,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
    ];
    seedTemplates.forEach((t) => this.packageTemplatesDb.set(t.id, t));

    // 3. Loyalty Tiers (4 Tiers)
    this.loyaltyTiersDb = [
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
        icon: 'Award',
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
        icon: 'Sparkles',
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
        icon: 'Crown',
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
        icon: 'Zap',
        isActive: true,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
    ];

    // 4. Seed Customer 1 (Priya Sharma - Platinum VIP & Diamond Club Member)
    this.customerMembershipsDb.set('cm-1', {
      id: 'cm-1',
      organizationId: 'org_hive_demo',
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
    });

    // Customer 1 Package (6 Hydra Facials)
    this.customerPackagesDb.set('cpkg-1', {
      id: 'cpkg-1',
      organizationId: 'org_hive_demo',
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
          serviceId: 'srv-3',
          serviceName: 'Hydra-Oxygen Rejuvenation Medi-Facial',
          invoiceId: 'inv-001',
          stylistId: 'st-4',
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
          serviceId: 'srv-3',
          serviceName: 'Hydra-Oxygen Rejuvenation Medi-Facial',
          invoiceId: 'inv-002',
          stylistId: 'st-4',
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
          serviceId: 'srv-3',
          serviceName: 'Hydra-Oxygen Rejuvenation Medi-Facial',
          invoiceId: 'inv-003',
          stylistId: 'st-4',
          stylistName: 'Ananya Roy',
          redeemedByCustomerId: 'c1',
          redeemedByName: 'Neha Sharma (Sister)',
          isFamilyMemberRedemption: true,
          familyMemberId: 'fm-2',
          familyRelationship: 'SIBLING',
          notes: 'Shared package session used by sister Neha.',
          redeemedAt: '2026-08-20T16:00:00Z',
        },
      ],
    });

    // Customer 1 Wallet & Double-Entry Ledger
    this.customerWalletsDb.set('c1', {
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

    this.walletLedgerDb.push(
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
      }
    );

    // Customer 1 Loyalty Account
    this.loyaltyAccountsDb.set('c1', {
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

    this.loyaltyLedgerDb.push(
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
      }
    );

    // Customer 1 Family Plan (The Sharma Family Pool)
    const famMembers: FamilyMemberDto[] = [
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
    ];

    this.familyPlansDb.set('fp-1', {
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
      members: famMembers,
      totalUsageCount: 4,
      totalAmountShared: 6850,
      createdAt: '2026-02-01T10:00:00Z',
      updatedAt: '2026-09-02T12:00:00Z',
    });

    this.familyUsageDb.push(
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
      }
    );

    // Expiry Alerts Seed
    this.expiryAlertsDb = [
      {
        id: 'alert-1',
        organizationId: 'org_hive_demo',
        customerId: 'c2',
        customerName: 'Rahul Verma',
        customerPhone: '+91 98111 22334',
        benefitType: 'PACKAGE',
        benefitReferenceId: 'cpkg-seed-2',
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
    ];
  }

  // ---------------------------------------------------------------------------
  // 2. MEMBERSHIP PLANS CRUD & SUBSCRIPTION LIFECYCLE
  // ---------------------------------------------------------------------------
  getAllPlans(): MembershipPlanDto[] {
    return Array.from(this.plansDb.values()).sort((a, b) => (b.isActive ? 1 : 0) - (a.isActive ? 1 : 0));
  }

  getPlanById(id: string): MembershipPlanDto {
    const plan = this.plansDb.get(id);
    if (!plan) throw new NotFoundException(`Membership plan '${id}' not found`);
    return plan;
  }

  createPlan(payload: CreateMembershipPlanPayload): MembershipPlanDto {
    const existing = Array.from(this.plansDb.values()).find((p) => p.code === payload.code);
    if (existing) throw new ConflictException(`Plan code '${payload.code}' already exists`);

    const newPlan: MembershipPlanDto = {
      id: `plan-${Date.now()}`,
      organizationId: 'org_hive_demo',
      name: payload.name,
      code: payload.code.toUpperCase(),
      type: payload.type,
      description: payload.description,
      price: payload.price,
      validityDays: payload.validityDays,
      discountPercentage: payload.discountPercentage,
      walletCreditsIncluded: payload.walletCreditsIncluded || 0,
      loyaltyBonusPoints: payload.loyaltyBonusPoints || 0,
      allowFamilySharing: payload.allowFamilySharing || false,
      maxFamilyMembers: payload.maxFamilyMembers || 1,
      eligibleCategories: payload.eligibleCategories || ['ALL'],
      perks: payload.perks || [],
      color: payload.color || '#d97706',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.plansDb.set(newPlan.id, newPlan);
    return newPlan;
  }

  getAllCustomerMemberships(): CustomerMembershipDto[] {
    return Array.from(this.customerMembershipsDb.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getCustomerMembership(customerId: string): CustomerMembershipDto | null {
    const membs = Array.from(this.customerMembershipsDb.values()).filter(
      (m) => m.customerId === customerId && m.status === 'ACTIVE'
    );
    return membs[0] || null;
  }

  enrollCustomerMembership(payload: EnrollCustomerMembershipPayload): CustomerMembershipDto {
    const plan = this.getPlanById(payload.planId);

    const startDate = payload.startDate ? new Date(payload.startDate) : new Date();
    const validityDays = payload.validityDays || plan.validityDays;
    const expiryDate = new Date(startDate.getTime() + validityDays * 24 * 60 * 60 * 1000);

    const membershipCode = `MEMB-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const newMemb: CustomerMembershipDto = {
      id: `cm-${Date.now()}`,
      organizationId: 'org_hive_demo',
      customerId: payload.customerId,
      customerName: payload.customerId === 'c1' ? 'Priya Sharma' : payload.customerId === 'c2' ? 'Rahul Verma' : 'Customer Account',
      planId: plan.id,
      planName: plan.name,
      planType: plan.type,
      membershipCode,
      startDate: startDate.toISOString(),
      expiryDate: expiryDate.toISOString(),
      status: 'ACTIVE',
      pricePaid: payload.pricePaid !== undefined ? payload.pricePaid : plan.price,
      totalSaved: 0,
      usageCount: 0,
      walletCreditsGranted: plan.walletCreditsIncluded,
      autoRenew: payload.autoRenew || false,
      notes: payload.notes,
      daysRemaining: validityDays,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    this.customerMembershipsDb.set(newMemb.id, newMemb);

    // If plan includes wallet credits, automatically top-up customer wallet!
    if (plan.walletCreditsIncluded > 0) {
      this.topupWallet({
        customerId: payload.customerId,
        amount: plan.walletCreditsIncluded,
        paymentMethod: 'UPI',
        reason: `Wallet credits from ${plan.name} enrollment`,
        isPromotional: false,
      });
    }

    // If plan includes loyalty bonus points, award them!
    if (plan.loyaltyBonusPoints > 0) {
      this.awardLoyaltyPoints({
        customerId: payload.customerId,
        points: plan.loyaltyBonusPoints,
        entryType: 'BONUS_CAMPAIGN',
        notes: `Bonus points for joining ${plan.name}`,
      });
    }

    return newMemb;
  }

  // ---------------------------------------------------------------------------
  // 3. SERVICE PACKAGES & SESSION TRACKING
  // ---------------------------------------------------------------------------
  getAllPackageTemplates(): ServicePackageTemplateDto[] {
    return Array.from(this.packageTemplatesDb.values());
  }

  createPackageTemplate(payload: CreatePackageTemplatePayload): ServicePackageTemplateDto {
    const newTmpl: ServicePackageTemplateDto = {
      id: `tmpl-${Date.now()}`,
      organizationId: 'org_hive_demo',
      name: payload.name,
      code: payload.code.toUpperCase(),
      description: payload.description,
      serviceId: payload.serviceId,
      serviceName: payload.serviceName,
      totalSessions: payload.totalSessions,
      price: payload.price,
      validityDays: payload.validityDays,
      savingsPercentage: payload.savingsPercentage,
      allowFamilySharing: payload.allowFamilySharing ?? true,
      color: payload.color || '#059669',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.packageTemplatesDb.set(newTmpl.id, newTmpl);
    return newTmpl;
  }

  getAllCustomerPackages(): CustomerPackageDto[] {
    return Array.from(this.customerPackagesDb.values());
  }

  getCustomerPackages(customerId: string): CustomerPackageDto[] {
    return Array.from(this.customerPackagesDb.values()).filter((p) => p.customerId === customerId);
  }

  purchaseCustomerPackage(payload: PurchaseCustomerPackagePayload): CustomerPackageDto {
    const validityDays = payload.validityDays || 180;
    const expiresAt = new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000).toISOString();
    const sessionPrice = Math.round(payload.totalPrice / payload.totalSessions);

    const newPkg: CustomerPackageDto = {
      id: `cpkg-${Date.now()}`,
      organizationId: 'org_hive_demo',
      customerId: payload.customerId,
      customerName: payload.customerId === 'c1' ? 'Priya Sharma' : payload.customerId === 'c2' ? 'Rahul Verma' : 'Customer Account',
      templateId: payload.templateId,
      serviceId: payload.serviceId,
      packageName: payload.packageName,
      packageCode: payload.packageCode || `PKG-${Math.floor(1000 + Math.random() * 9000)}`,
      totalSessions: payload.totalSessions,
      usedSessions: 0,
      remainingSessions: payload.totalSessions,
      totalPrice: payload.totalPrice,
      sessionPrice,
      status: 'ACTIVE',
      expiresAt,
      daysRemaining: validityDays,
      purchasedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      redemptions: [],
    };

    this.customerPackagesDb.set(newPkg.id, newPkg);
    return newPkg;
  }

  redeemPackageSession(payload: RedeemPackageSessionPayload): CustomerPackageDto {
    const pkg = this.customerPackagesDb.get(payload.packageId);
    if (!pkg) throw new NotFoundException(`Customer package '${payload.packageId}' not found`);

    if (pkg.remainingSessions <= 0 || pkg.status !== 'ACTIVE') {
      throw new BadRequestException('Package has no remaining sessions or has expired');
    }

    const redemption: CustomerPackageRedemptionDto = {
      id: `red-${Date.now()}`,
      packageId: pkg.id,
      serviceId: payload.serviceId || pkg.serviceId,
      serviceName: payload.serviceName || pkg.packageName,
      invoiceId: payload.invoiceId,
      stylistId: payload.stylistId,
      stylistName: payload.stylistName,
      redeemedByCustomerId: payload.redeemedByCustomerId,
      redeemedByName: payload.redeemedByName,
      isFamilyMemberRedemption: payload.isFamilyMemberRedemption || false,
      familyMemberId: payload.familyMemberId,
      familyRelationship: payload.familyRelationship,
      notes: payload.notes,
      redeemedAt: new Date().toISOString(),
    };

    pkg.usedSessions += 1;
    pkg.remainingSessions -= 1;
    if (pkg.remainingSessions === 0) {
      pkg.status = 'COMPLETED';
    }
    pkg.updatedAt = new Date().toISOString();
    pkg.redemptions = [redemption, ...(pkg.redemptions || [])];

    this.customerPackagesDb.set(pkg.id, pkg);

    // If redeemed by family member, log family usage
    if (payload.isFamilyMemberRedemption && payload.familyMemberId) {
      const familyPlans = Array.from(this.familyPlansDb.values()).filter(
        (f) => f.primaryCustomerId === pkg.customerId
      );
      if (familyPlans.length > 0) {
        this.familyUsageDb.push({
          id: `fu-${Date.now()}`,
          familyPlanId: familyPlans[0].id,
          familyMemberId: payload.familyMemberId,
          familyMemberName: payload.redeemedByName,
          relationship: (payload.familyRelationship as any) || 'OTHER',
          primaryCustomerId: pkg.customerId,
          primaryCustomerName: pkg.customerName,
          benefitType: 'PACKAGE_SESSION',
          invoiceId: payload.invoiceId,
          serviceName: payload.serviceName,
          amountSavedOrSpent: pkg.sessionPrice,
          usedAt: new Date().toISOString(),
        });
      }
    }

    return pkg;
  }

  // ---------------------------------------------------------------------------
  // 4. CUSTOMER PREPAID WALLET & DOUBLE-ENTRY LEDGER
  // ---------------------------------------------------------------------------
  getCustomerWallet(customerId: string): CustomerWalletDto {
    let wallet = this.customerWalletsDb.get(customerId);
    if (!wallet) {
      wallet = {
        id: `cw-${Date.now()}`,
        organizationId: 'org_hive_demo',
        customerId,
        currentBalance: 0,
        promotionalBalance: 0,
        nonPromotionalBalance: 0,
        totalCredited: 0,
        totalDebited: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.customerWalletsDb.set(customerId, wallet);
    }
    return wallet;
  }

  getWalletLedger(customerId?: string): CustomerWalletLedgerEntryDto[] {
    if (customerId) {
      return this.walletLedgerDb.filter((e) => e.customerId === customerId);
    }
    return [...this.walletLedgerDb].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  topupWallet(payload: WalletTopupPayload): { wallet: CustomerWalletDto; entry: CustomerWalletLedgerEntryDto } {
    if (payload.amount <= 0) {
      throw new BadRequestException('Top-up amount must be strictly greater than 0');
    }

    const wallet = this.getCustomerWallet(payload.customerId);
    const balanceBefore = wallet.currentBalance;
    const balanceAfter = balanceBefore + payload.amount;

    const entryType = payload.isPromotional
      ? 'PROMOTIONAL_CREDIT'
      : payload.paymentMethod === 'UPI'
      ? 'TOPUP_UPI'
      : payload.paymentMethod === 'CARD'
      ? 'TOPUP_CARD'
      : 'TOPUP_CASH';

    const expiresAt = payload.isPromotional && payload.promoExpiryDays
      ? new Date(Date.now() + payload.promoExpiryDays * 24 * 60 * 60 * 1000).toISOString()
      : undefined;

    const ledgerEntry: CustomerWalletLedgerEntryDto = {
      id: `wtx-${Date.now()}`,
      organizationId: 'org_hive_demo',
      customerId: payload.customerId,
      customerName: wallet.customerName || (payload.customerId === 'c1' ? 'Priya Sharma' : 'Customer'),
      entryType,
      amount: payload.amount,
      promotionalAmount: payload.isPromotional ? payload.amount : 0,
      balanceBefore,
      balanceAfter,
      notes: payload.reason,
      performedByUserId: payload.performedByUserId,
      expiresAt,
      isExpired: false,
      createdAt: new Date().toISOString(),
    };

    wallet.currentBalance = balanceAfter;
    if (payload.isPromotional) {
      wallet.promotionalBalance += payload.amount;
    } else {
      wallet.nonPromotionalBalance += payload.amount;
    }
    wallet.totalCredited += payload.amount;
    wallet.lastTransactionAt = new Date().toISOString();
    wallet.updatedAt = new Date().toISOString();

    this.customerWalletsDb.set(wallet.customerId, wallet);
    this.walletLedgerDb.unshift(ledgerEntry);

    return { wallet, entry: ledgerEntry };
  }

  debitWallet(payload: WalletDebitPayload): { wallet: CustomerWalletDto; entry: CustomerWalletLedgerEntryDto } {
    if (payload.amount <= 0) {
      throw new BadRequestException('Debit amount must be strictly greater than 0');
    }

    const wallet = this.getCustomerWallet(payload.customerId);

    // CRITICAL INVARIANT: NEVER ALLOW UNAUTHORIZED NEGATIVE BALANCE
    if (payload.amount > wallet.currentBalance) {
      throw new BadRequestException(
        `Insufficient wallet balance. Requested: ₹${payload.amount.toFixed(2)}, Available: ₹${wallet.currentBalance.toFixed(2)}`
      );
    }

    const balanceBefore = wallet.currentBalance;
    const balanceAfter = balanceBefore - payload.amount;

    const ledgerEntry: CustomerWalletLedgerEntryDto = {
      id: `wtx-${Date.now()}`,
      organizationId: 'org_hive_demo',
      customerId: payload.customerId,
      customerName: wallet.customerName || (payload.customerId === 'c1' ? 'Priya Sharma' : 'Customer'),
      entryType: 'DEBIT_POS',
      amount: -payload.amount,
      promotionalAmount: 0,
      balanceBefore,
      balanceAfter,
      referenceInvoiceId: payload.referenceInvoiceId,
      familyMemberId: payload.familyMemberId,
      familyMemberName: payload.familyMemberName,
      notes: payload.reason,
      performedByUserId: payload.performedByUserId,
      isExpired: false,
      createdAt: new Date().toISOString(),
    };

    wallet.currentBalance = balanceAfter;
    // Deduct non-promo first, then promo
    if (wallet.nonPromotionalBalance >= payload.amount) {
      wallet.nonPromotionalBalance -= payload.amount;
    } else {
      const remainder = payload.amount - wallet.nonPromotionalBalance;
      wallet.nonPromotionalBalance = 0;
      wallet.promotionalBalance = Math.max(0, wallet.promotionalBalance - remainder);
    }
    wallet.totalDebited += payload.amount;
    wallet.lastTransactionAt = new Date().toISOString();
    wallet.updatedAt = new Date().toISOString();

    this.customerWalletsDb.set(wallet.customerId, wallet);
    this.walletLedgerDb.unshift(ledgerEntry);

    return { wallet, entry: ledgerEntry };
  }

  // ---------------------------------------------------------------------------
  // 5. LOYALTY PROGRAM & TIERS
  // ---------------------------------------------------------------------------
  getAllLoyaltyTiers(): LoyaltyTierDto[] {
    return this.loyaltyTiersDb;
  }

  getCustomerLoyaltyAccount(customerId: string): CustomerLoyaltyAccountDto {
    let account = this.loyaltyAccountsDb.get(customerId);
    if (!account) {
      account = {
        id: `cla-${Date.now()}`,
        organizationId: 'org_hive_demo',
        customerId,
        currentTierId: 'tier-bronze',
        tierCode: 'BRONZE',
        tierName: 'Bronze Member',
        currentPoints: 0,
        lifetimePointsEarned: 0,
        lifetimePointsRedeemed: 0,
        nextTierProgressPercentage: 0,
        nextTierSpendNeeded: 15000,
        tierJoinedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.loyaltyAccountsDb.set(customerId, account);
    }
    return account;
  }

  getLoyaltyLedger(customerId?: string): LoyaltyPointsLedgerEntryDto[] {
    if (customerId) {
      return this.loyaltyLedgerDb.filter((e) => e.customerId === customerId);
    }
    return [...this.loyaltyLedgerDb].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  awardLoyaltyPoints(payload: AwardLoyaltyPointsPayload): {
    account: CustomerLoyaltyAccountDto;
    entry: LoyaltyPointsLedgerEntryDto;
  } {
    const account = this.getCustomerLoyaltyAccount(payload.customerId);
    const pointsBefore = account.currentPoints;
    const pointsAfter = pointsBefore + payload.points;

    const entry: LoyaltyPointsLedgerEntryDto = {
      id: `loy-${Date.now()}`,
      organizationId: 'org_hive_demo',
      customerId: payload.customerId,
      customerName: account.customerName || 'Customer',
      entryType: payload.entryType,
      points: payload.points,
      pointsBefore,
      pointsAfter,
      referenceInvoiceId: payload.referenceInvoiceId,
      referredCustomerId: payload.referredCustomerId,
      notes: payload.notes,
      performedByUserId: payload.performedByUserId,
      createdAt: new Date().toISOString(),
    };

    account.currentPoints = pointsAfter;
    account.lifetimePointsEarned += payload.points;
    account.updatedAt = new Date().toISOString();

    this.loyaltyAccountsDb.set(account.customerId, account);
    this.loyaltyLedgerDb.unshift(entry);

    return { account, entry };
  }

  redeemLoyaltyPoints(customerId: string, pointsToRedeem: number, invoiceId?: string): {
    account: CustomerLoyaltyAccountDto;
    entry: LoyaltyPointsLedgerEntryDto;
    discountValueRupees: number;
  } {
    const account = this.getCustomerLoyaltyAccount(customerId);
    if (pointsToRedeem > account.currentPoints) {
      throw new BadRequestException(
        `Insufficient points. Requested: ${pointsToRedeem}, Available: ${account.currentPoints}`
      );
    }

    const pointsBefore = account.currentPoints;
    const pointsAfter = pointsBefore - pointsToRedeem;
    const discountValueRupees = pointsToRedeem * 1.0; // 1 pt = ₹1.00

    const entry: LoyaltyPointsLedgerEntryDto = {
      id: `loy-${Date.now()}`,
      organizationId: 'org_hive_demo',
      customerId,
      customerName: account.customerName || 'Customer',
      entryType: 'REDEEMED_POS',
      points: -pointsToRedeem,
      pointsBefore,
      pointsAfter,
      referenceInvoiceId: invoiceId,
      notes: `Redeemed ${pointsToRedeem} points (₹${discountValueRupees.toFixed(2)}) at POS checkout.`,
      createdAt: new Date().toISOString(),
    };

    account.currentPoints = pointsAfter;
    account.lifetimePointsRedeemed += pointsToRedeem;
    account.updatedAt = new Date().toISOString();

    this.loyaltyAccountsDb.set(customerId, account);
    this.loyaltyLedgerDb.unshift(entry);

    return { account, entry, discountValueRupees };
  }

  // ---------------------------------------------------------------------------
  // 6. FAMILY PLANS & SHARED BENEFIT POOLS
  // ---------------------------------------------------------------------------
  getAllFamilyPlans(): FamilyPlanDto[] {
    return Array.from(this.familyPlansDb.values());
  }

  getFamilyPlanByPrimaryCustomer(customerId: string): FamilyPlanDto | null {
    const plans = Array.from(this.familyPlansDb.values()).filter(
      (f) => f.primaryCustomerId === customerId && f.status === 'ACTIVE'
    );
    return plans[0] || null;
  }

  createFamilyPlan(payload: CreateFamilyPlanPayload): FamilyPlanDto {
    const newPlan: FamilyPlanDto = {
      id: `fp-${Date.now()}`,
      organizationId: 'org_hive_demo',
      primaryCustomerId: payload.primaryCustomerId,
      primaryCustomerName: payload.primaryCustomerId === 'c1' ? 'Priya Sharma' : 'Customer Account',
      membershipId: payload.membershipId,
      planName: payload.planName,
      maxMembers: payload.maxMembers || 5,
      sharedWalletEnabled: payload.sharedWalletEnabled ?? true,
      sharedPackagesEnabled: payload.sharedPackagesEnabled ?? true,
      sharedDiscountEnabled: payload.sharedDiscountEnabled ?? true,
      status: 'ACTIVE',
      members: (payload.members || []).map((m, idx) => ({
        id: `fm-${Date.now()}-${idx}`,
        familyPlanId: `fp-${Date.now()}`,
        primaryCustomerId: payload.primaryCustomerId,
        fullName: m.fullName,
        phone: m.phone,
        relationship: m.relationship,
        memberCustomerId: m.memberCustomerId,
        spendingLimitMonthly: m.spendingLimitMonthly,
        isAuthorizedToDebitWallet: m.isAuthorizedToDebitWallet ?? true,
        isAuthorizedToUsePackages: m.isAuthorizedToUsePackages ?? true,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      })),
      totalUsageCount: 0,
      totalAmountShared: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.familyPlansDb.set(newPlan.id, newPlan);
    return newPlan;
  }

  addFamilyMember(payload: AddFamilyMemberPayload): FamilyMemberDto {
    const plan = this.familyPlansDb.get(payload.familyPlanId);
    if (!plan) throw new NotFoundException(`Family plan '${payload.familyPlanId}' not found`);

    if (plan.members.length >= plan.maxMembers) {
      throw new BadRequestException(`Family plan has reached the maximum capacity of ${plan.maxMembers} members.`);
    }

    const newMember: FamilyMemberDto = {
      id: `fm-${Date.now()}`,
      familyPlanId: plan.id,
      primaryCustomerId: plan.primaryCustomerId,
      fullName: payload.fullName,
      phone: payload.phone,
      relationship: payload.relationship,
      memberCustomerId: payload.memberCustomerId,
      spendingLimitMonthly: payload.spendingLimitMonthly,
      isAuthorizedToDebitWallet: payload.isAuthorizedToDebitWallet ?? true,
      isAuthorizedToUsePackages: payload.isAuthorizedToUsePackages ?? true,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };

    plan.members.push(newMember);
    plan.updatedAt = new Date().toISOString();
    this.familyPlansDb.set(plan.id, plan);

    return newMember;
  }

  getFamilyUsageRecords(familyPlanId?: string): FamilyMemberUsageRecordDto[] {
    if (familyPlanId) {
      return this.familyUsageDb.filter((u) => u.familyPlanId === familyPlanId);
    }
    return [...this.familyUsageDb].sort(
      (a, b) => new Date(b.usedAt).getTime() - new Date(a.usedAt).getTime()
    );
  }

  // ---------------------------------------------------------------------------
  // 7. POS CHECKOUT BENEFIT AUTO-EVALUATOR
  // ---------------------------------------------------------------------------
  evaluatePosBenefits(customerId: string): PosCustomerBenefitsDto {
    const membership = this.getCustomerMembership(customerId);
    const packages = this.getCustomerPackages(customerId).filter(
      (p) => p.status === 'ACTIVE' && p.remainingSessions > 0
    );
    const wallet = this.getCustomerWallet(customerId);
    const loyalty = this.getCustomerLoyaltyAccount(customerId);
    const familyPlan = this.getFamilyPlanByPrimaryCustomer(customerId);

    return {
      customerId,
      customerName: wallet.customerName || (customerId === 'c1' ? 'Priya Sharma' : 'Customer Account'),
      customerPhone: wallet.customerPhone || '+91 98765 43210',
      hasActiveMembership: !!membership,
      membership: membership
        ? {
            id: membership.id,
            code: membership.membershipCode,
            name: membership.planName || 'Membership Tier',
            type: membership.planType || 'DISCOUNT',
            discountPercentage: 20, // default or matched
            perks: ['20% off all services', 'Complimentary drink', 'Priority slot booking'],
            expiryDate: membership.expiryDate,
            daysRemaining: membership.daysRemaining || 120,
          }
        : undefined,
      availablePackages: packages.map((p) => ({
        id: p.id,
        packageName: p.packageName,
        serviceId: p.serviceId,
        totalSessions: p.totalSessions,
        usedSessions: p.usedSessions,
        remainingSessions: p.remainingSessions,
        sessionPrice: p.sessionPrice,
        expiresAt: p.expiresAt,
      })),
      wallet: {
        currentBalance: wallet.currentBalance,
        promotionalBalance: wallet.promotionalBalance,
        nonPromotionalBalance: wallet.nonPromotionalBalance,
        usableBalance: wallet.currentBalance,
      },
      loyalty: {
        currentPoints: loyalty.currentPoints,
        pointValueRupees: 1.0,
        redeemableValueRupees: loyalty.currentPoints * 1.0,
        tierCode: loyalty.tierCode,
        tierName: loyalty.tierName,
        pointsPerHundredRupees: loyalty.tierCode === 'PLATINUM' ? 2.0 : loyalty.tierCode === 'GOLD' ? 1.5 : 1.0,
      },
      familyPlan: familyPlan
        ? {
            id: familyPlan.id,
            planName: familyPlan.planName,
            isSharedPoolActive: true,
            primaryCustomerId: familyPlan.primaryCustomerId,
            primaryCustomerName: familyPlan.primaryCustomerName || 'Primary Member',
            sharedWalletEnabled: familyPlan.sharedWalletEnabled,
            sharedPackagesEnabled: familyPlan.sharedPackagesEnabled,
            sharedDiscountEnabled: familyPlan.sharedDiscountEnabled,
            familyMembers: familyPlan.members.map((m) => ({
              id: m.id,
              fullName: m.fullName,
              relationship: m.relationship,
            })),
          }
        : undefined,
    };
  }

  // ---------------------------------------------------------------------------
  // 8. EXPIRY ALERTS & RENEWAL REMINDERS (30/7/1-DAY ENGINE)
  // ---------------------------------------------------------------------------
  getAllExpiryAlerts(daysFilter?: number): RetentionExpiryAlertDto[] {
    if (daysFilter !== undefined) {
      return this.expiryAlertsDb.filter((a) => a.daysUntilExpiry <= daysFilter);
    }
    return [...this.expiryAlertsDb].sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);
  }

  sendExpiryAlert(payload: SendExpiryAlertPayload): RetentionExpiryAlertDto {
    const alert = this.expiryAlertsDb.find((a) => a.id === payload.alertId);
    if (!alert) throw new NotFoundException(`Expiry alert '${payload.alertId}' not found`);

    alert.status = 'SENT';
    alert.sentChannel = payload.channel;
    alert.sentAt = new Date().toISOString();
    if (payload.renewalDiscount) {
      alert.renewalOfferDiscount = payload.renewalDiscount;
    }
    alert.updatedAt = new Date().toISOString();

    return alert;
  }
}
