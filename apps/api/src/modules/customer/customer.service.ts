import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import type {
  Customer360,
  CustomerSegment,
  ColorFormula,
  PatchTest,
  CustomerNoteItem,
  WalletTransaction,
  CustomerTimelineItem,
  CustomerPackageItem,
  CustomerReviewItem,
} from '@hive/types';

@Injectable()
export class CustomerService {
  // In-memory / initial seed customers for immediate demo & offline resilience
  private customersDb: Map<string, any> = new Map([
    [
      'c1',
      {
        id: 'c1',
        organizationId: 'org_hive_demo',
        fullName: 'Priya Sharma',
        phone: '+91 98765 43210',
        email: 'priya.sharma@example.com',
        gender: 'FEMALE',
        birthDate: '1992-06-15',
        address: 'Plot 42, Road No. 36, Jubilee Hills, Hyderabad',
        notes: 'Prefers mild organic shampoos. Always books weekend morning slots.',
        customerSource: 'INSTAGRAM',
        referredByCustomerId: null,
        tags: ['VIP', 'Returning', 'High Value'],
        loyaltyPoints: 850,
        walletBalance: 4200.0,
        totalSpent: 48500.0,
        totalVisits: 14,
        lastVisitAt: '2026-09-02T11:30:00Z',
        nextAppointmentAt: '2026-09-12T14:30:00Z',
        preferredBranchId: 'b1',
        preferredBranchName: 'Jubilee Hills Flagship',
        preferredStylistId: 's1',
        preferredStylistName: 'Ananya Reddy',
        membershipStatus: 'ACTIVE',
        activeMembershipTier: 'Diamond Elite',
        activeMembershipExpiry: '2027-03-31',

        hairProfile: {
          texture: 'FINE',
          porosity: 'NORMAL',
          scalpType: 'SENSITIVE',
          density: 'HIGH',
          curlPattern: 'WAVY_2A_2C',
          hairLength: 'MID_BACK',
          chemicalHistory: [
            'Balayage Lightening (L\'Oréal Blonde Studio, June 2026)',
            'Olaplex No. 1 & 2 Treatment (August 2026)',
          ],
        },

        skinProfile: {
          skinType: 'COMBINATION',
          undertone: 'WARM',
          allergies: ['Ammonia (Mild scalp irritation)', 'Strong synthetic perfumes'],
          sensitivities: ['High Heat blow-dryers near scalp'],
          skinConcerns: ['Dehydration after travel', 'Occasional t-zone shine'],
        },

        preferences: {
          beverages: ['Warm Green Tea (No sugar)', 'San Pellegrino'],
          quietAppointment: false,
          pressurePreference: 'FIRM',
          musicPreference: 'Ambient Lounge / Lo-Fi',
          scalpSensitivity: 'HIGH',
          customNotes: 'Always provide silk cape if available.',
        },

        colorFormulas: [
          {
            id: 'cf-1',
            customerId: 'c1',
            formulaName: 'Sun-Kissed Caramel Balayage Gloss',
            brand: 'L\'Oréal Professionnel Dia Richesse',
            formulaMix: '7.13 (35g) + 8.3 (15g) + 9.01 (10g) + Diactivateur 9 Vol (90g)',
            developerVolume: '9 Vol (2.7%)',
            developerRatio: '1:1.5',
            processingTimeMinutes: 25,
            targetHairTone: 'Caramel Toffee Glow (Level 8)',
            stylistNotes: 'Applied at shampoo basin on damp hair for 20m. Toned out brassy undertones perfectly.',
            appliedAt: '2026-08-15T10:45:00Z',
            createdAt: '2026-08-15T10:45:00Z',
          },
          {
            id: 'cf-2',
            customerId: 'c1',
            formulaName: 'Root Shadow & Neutralizing Gloss',
            brand: 'Wella Professionals Illumina Color',
            formulaMix: '6/16 (20g) + 7/81 (20g) + Pastel Developer (80g)',
            developerVolume: '6 Vol (1.9%)',
            developerRatio: '1:2',
            processingTimeMinutes: 20,
            targetHairTone: 'Cool Ashy Blonde Transition',
            stylistNotes: 'Maintained natural depth at root 2 inches.',
            appliedAt: '2026-06-10T14:15:00Z',
            createdAt: '2026-06-10T14:15:00Z',
          },
        ],

        patchTests: [
          {
            id: 'pt-1',
            customerId: 'c1',
            testType: 'HAIR_COLOR_DYE',
            chemicalOrBrandName: 'L\'Oréal Majirel PPD 48h Patch Test',
            testedAt: '2026-08-12T11:00:00Z',
            result: 'PASSED',
            validUntil: '2027-02-12T00:00:00Z',
            technicianUserId: 's1',
            notes: 'Applied behind left ear. Zero redness, swelling or itchiness reported after 48 hours.',
            createdAt: '2026-08-12T11:00:00Z',
          },
          {
            id: 'pt-2',
            customerId: 'c1',
            testType: 'CHEMICAL_PEEL',
            chemicalOrBrandName: 'DermaQuest Glycolic 30% Acid Sensitivity Check',
            testedAt: '2026-05-20T16:00:00Z',
            result: 'PASSED',
            validUntil: '2026-11-20T00:00:00Z',
            technicianUserId: 's2',
            notes: 'Forearm patch clear after 24 hours.',
            createdAt: '2026-05-20T16:00:00Z',
          },
        ],

        staffNotes: [
          {
            id: 'cn-1',
            customerId: 'c1',
            note: 'Client is preparing for sister\'s wedding in November. Wants to maintain length while brightening face-framing pieces.',
            isPrivate: false,
            category: 'TECH_FORMULA',
            authorUserId: 's1',
            authorName: 'Ananya Reddy (Senior Stylist)',
            createdAt: '2026-08-15T12:00:00Z',
          },
          {
            id: 'cn-2',
            customerId: 'c1',
            note: 'VIP Tier guest. Manager discount approved at 15% for retail Olaplex purchases.',
            isPrivate: true,
            category: 'GENERAL',
            authorUserId: 'u1',
            authorName: 'Sarah Jenkins (Branch Manager)',
            createdAt: '2026-07-01T09:30:00Z',
          },
        ],

        walletTransactions: [
          {
            id: 'wt-1',
            customerId: 'c1',
            amount: 5000.0,
            type: 'CREDIT',
            reason: 'Festive Wallet Recharge via UPI',
            balanceAfter: 5000.0,
            createdAt: '2026-08-10T15:20:00Z',
          },
          {
            id: 'wt-2',
            customerId: 'c1',
            amount: 800.0,
            type: 'DEBIT',
            reason: 'Partial settlement on Invoice #HIVE-HYD-0391',
            balanceAfter: 4200.0,
            referenceInvoiceId: 'inv-391',
            createdAt: '2026-08-15T12:30:00Z',
          },
        ],

        timelineEvents: [
          {
            id: 'te-1',
            customerId: 'c1',
            eventType: 'APPOINTMENT_BOOKED',
            title: 'Upcoming Appointment Scheduled',
            description: 'Booked Balayage Refresh & Moroccan Blowdry with Ananya Reddy on Sep 12 at 02:30 PM.',
            occurredAt: '2026-09-08T10:15:00Z',
          },
          {
            id: 'te-2',
            customerId: 'c1',
            eventType: 'REVIEW_SUBMITTED',
            title: '5-Star Review Received',
            description: '"Ananya is a color genius! My balayage has never looked shinier and healthier."',
            metadata: { rating: 5, csat: 100 },
            occurredAt: '2026-08-16T18:00:00Z',
          },
          {
            id: 'te-3',
            customerId: 'c1',
            eventType: 'INVOICE_GENERATED',
            title: 'Invoice Settled — ₹4,850.00',
            description: 'Invoice #HIVE-HYD-0391 paid via Wallet + UPI (18% GST included).',
            occurredAt: '2026-08-15T12:30:00Z',
          },
          {
            id: 'te-4',
            customerId: 'c1',
            eventType: 'FORMULA_APPLIED',
            title: 'Color Formula Logged',
            description: 'Sun-Kissed Caramel Balayage Gloss (L\'Oréal Dia Richesse 7.13 + 8.3).',
            occurredAt: '2026-08-15T10:45:00Z',
          },
          {
            id: 'te-5',
            customerId: 'c1',
            eventType: 'MEMBERSHIP_PURCHASED',
            title: 'Diamond Elite Membership Activated',
            description: 'Purchased 1-year Diamond tier membership with 15% service perks & priority booking.',
            occurredAt: '2026-04-01T11:00:00Z',
          },
        ],

        packages: [
          {
            id: 'pkg-1',
            customerId: 'c1',
            packageName: 'Hydra-Infusion Facial & Glow Pack (6 Sessions)',
            totalSessions: 6,
            usedSessions: 4,
            totalPrice: 18000.0,
            status: 'ACTIVE',
            expiresAt: '2026-12-31',
            createdAt: '2026-03-15T10:00:00Z',
          },
        ],

        reviews: [
          {
            id: 'rev-1',
            customerId: 'c1',
            rating: 5,
            comment: 'Ananya is phenomenal. The hospitality at Jubilee Hills is unmatched.',
            stylistName: 'Ananya Reddy',
            serviceName: 'Balayage & Gloss',
            csatScore: 100,
            createdAt: '2026-08-16T18:00:00Z',
          },
        ],

        appointments: [
          {
            id: 'apt-1',
            date: '2026-09-12',
            time: '02:30 PM',
            service: 'Balayage & Moroccan Blowdry',
            stylist: 'Ananya Reddy',
            branch: 'Jubilee Hills Flagship',
            status: 'CONFIRMED',
            price: 4500.0,
          },
          {
            id: 'apt-2',
            date: '2026-08-15',
            time: '10:00 AM',
            service: 'Balayage Gloss & Hair Spa',
            stylist: 'Ananya Reddy',
            branch: 'Jubilee Hills Flagship',
            status: 'COMPLETED',
            price: 4850.0,
          },
        ],

        invoices: [
          {
            id: 'inv-391',
            invoiceNumber: 'HIVE-HYD-0391',
            date: '2026-08-15',
            total: 4850.0,
            gst: 739.83,
            status: 'PAID',
            paymentMethod: 'UPI + Wallet',
          },
        ],

        servicesSummary: [
          { serviceName: 'Balayage & Highlighting', category: 'Hair Artistry', timesBooked: 6, lastDate: '2026-08-15' },
          { serviceName: 'Moroccan Blowdry Finish', category: 'Hair Styling', timesBooked: 8, lastDate: '2026-08-15' },
          { serviceName: 'Hydra-Infusion Facial', category: 'Aesthetics & Skin', timesBooked: 4, lastDate: '2026-07-20' },
        ],

        marketingLogs: [
          { id: 'm-1', channel: 'WHATSAPP', campaignName: 'Exclusive Monsoon Hair Spa Offer', sentAt: '2026-08-01T10:00:00Z', status: 'CLICKED' },
          { id: 'm-2', channel: 'SMS', campaignName: 'Appointment Reminder for Sep 12', sentAt: '2026-09-08T10:15:00Z', status: 'DELIVERED' },
        ],

        createdAt: '2025-11-10T14:30:00Z',
        updatedAt: '2026-09-08T10:15:00Z',
      },
    ],
    [
      'c2',
      {
        id: 'c2',
        organizationId: 'org_hive_demo',
        fullName: 'Vikram Mehta',
        phone: '+91 98111 22334',
        email: 'vikram.mehta@example.com',
        gender: 'MALE',
        birthDate: '1988-11-24',
        address: 'Banjara Hills, Road No. 12, Hyderabad',
        notes: 'Executive client. Likes quick 30-minute grooming cuts.',
        customerSource: 'WALK_IN',
        tags: ['Returning', 'Corporate'],
        loyaltyPoints: 340,
        walletBalance: 1500.0,
        totalSpent: 16400.0,
        totalVisits: 9,
        lastVisitAt: '2026-08-28T16:00:00Z',
        nextAppointmentAt: null,
        preferredBranchId: 'b1',
        preferredBranchName: 'Jubilee Hills Flagship',
        preferredStylistId: 's3',
        preferredStylistName: 'Rahul Varma',
        membershipStatus: 'ACTIVE',
        activeMembershipTier: 'Gold Care',
        activeMembershipExpiry: '2027-01-15',
        colorFormulas: [],
        patchTests: [],
        staffNotes: [],
        walletTransactions: [],
        timelineEvents: [],
        packages: [],
        reviews: [],
        appointments: [],
        invoices: [],
        createdAt: '2026-01-15T11:00:00Z',
        updatedAt: '2026-08-28T16:00:00Z',
      },
    ],
    [
      'c3',
      {
        id: 'c3',
        organizationId: 'org_hive_demo',
        fullName: 'Sneha Kapoor',
        phone: '+91 97000 88991',
        email: 'sneha.kapoor@example.com',
        gender: 'FEMALE',
        birthDate: '1995-03-18',
        address: 'Hitech City, Hyderabad',
        notes: 'Bridal inquiry. Interested in full pre-bridal skincare package.',
        customerSource: 'REFERRAL',
        tags: ['New', 'VIP'],
        loyaltyPoints: 120,
        walletBalance: 0.0,
        totalSpent: 3800.0,
        totalVisits: 1,
        lastVisitAt: '2026-09-05T15:00:00Z',
        nextAppointmentAt: '2026-09-14T11:00:00Z',
        preferredBranchId: 'b1',
        preferredBranchName: 'Jubilee Hills Flagship',
        preferredStylistId: 's2',
        preferredStylistName: 'Kavita Nair',
        membershipStatus: 'NONE',
        colorFormulas: [],
        patchTests: [],
        staffNotes: [],
        walletTransactions: [],
        timelineEvents: [],
        packages: [],
        reviews: [],
        appointments: [],
        invoices: [],
        createdAt: '2026-09-05T14:30:00Z',
        updatedAt: '2026-09-05T15:00:00Z',
      },
    ],
  ]);

  /**
   * Fast multi-field customer search supporting:
   * - Normalized 10-digit mobile number
   * - Full name (case-insensitive)
   * - Email address
   * - Invoice number
   * - Membership tier ID / status
   */
  async searchCustomers(
    query?: string,
    segment: CustomerSegment = 'all',
    branchId?: string,
    organizationId: string = 'org_hive_demo'
  ) {
    const list = Array.from(this.customersDb.values()).filter(
      (c) => c.organizationId === organizationId
    );

    const cleanQuery = (query || '').trim().toLowerCase();
    const numericQuery = cleanQuery.replace(/\D/g, '');

    return list.filter((c) => {
      // Branch filter if provided
      if (branchId && c.preferredBranchId && c.preferredBranchId !== branchId) {
        return false;
      }

      // Segment filter
      if (segment !== 'all') {
        if (segment === 'new' && c.totalVisits > 1) return false;
        if (segment === 'returning' && c.totalVisits <= 1) return false;
        if (segment === 'vip' && !c.tags?.includes('VIP')) return false;
        if (segment === 'high_spender' && Number(c.totalSpent) < 25000) return false;
        if (segment === 'frequent' && c.totalVisits < 5) return false;
        if (segment === 'membership' && c.membershipStatus !== 'ACTIVE') return false;
      }

      // Search Query Match
      if (!cleanQuery) return true;

      // 1. Mobile lookup (Fast exact or partial numeric match)
      if (numericQuery.length >= 3 && c.phone.replace(/\D/g, '').includes(numericQuery)) {
        return true;
      }

      // 2. Name match
      if (c.fullName.toLowerCase().includes(cleanQuery)) {
        return true;
      }

      // 3. Email match
      if (c.email && c.email.toLowerCase().includes(cleanQuery)) {
        return true;
      }

      // 4. Invoice match
      if (c.invoices?.some((inv: any) => inv.invoiceNumber?.toLowerCase().includes(cleanQuery))) {
        return true;
      }

      // 5. Membership match
      if (c.activeMembershipTier?.toLowerCase().includes(cleanQuery)) {
        return true;
      }

      return false;
    });
  }

  /**
   * Fetch complete 360° Profile aggregate for a single customer
   */
  async getCustomer360(customerId: string, organizationId: string = 'org_hive_demo'): Promise<Customer360> {
    const customer = this.customersDb.get(customerId);
    if (!customer || customer.organizationId !== organizationId) {
      throw new NotFoundException(`Customer with ID "${customerId}" not found.`);
    }
    return customer;
  }

  /**
   * Create a new customer record with initial timeline event
   */
  async createCustomer(organizationId: string, payload: any) {
    const id = `c_${Date.now()}`;
    const newCustomer: Customer360 = {
      id,
      organizationId,
      fullName: payload.fullName,
      phone: payload.phone,
      email: payload.email || null,
      gender: payload.gender || 'UNSPECIFIED',
      birthDate: payload.birthDate || null,
      address: payload.address || null,
      notes: payload.notes || null,
      customerSource: payload.customerSource || 'WALK_IN',
      referredByCustomerId: payload.referredByCustomerId || null,
      tags: payload.tags?.length ? payload.tags : ['New'],
      loyaltyPoints: 50, // Initial welcome bonus points
      walletBalance: 0.0,
      totalSpent: 0.0,
      totalVisits: 0,
      lastVisitAt: null,
      nextAppointmentAt: null,
      preferredBranchId: payload.preferredBranchId || 'b1',
      preferredBranchName: 'Jubilee Hills Flagship',
      preferredStylistId: payload.preferredStylistId || null,
      preferredStylistName: null,
      membershipStatus: 'NONE',
      hairProfile: null,
      skinProfile: null,
      preferences: null,
      colorFormulas: [],
      patchTests: [],
      staffNotes: [],
      walletTransactions: [],
      timelineEvents: [
        {
          id: `te_${Date.now()}`,
          customerId: id,
          eventType: 'APPOINTMENT_BOOKED',
          title: 'Client Profile Created',
          description: `Customer account registered via ${payload.customerSource || 'Reception'}.`,
          occurredAt: new Date().toISOString(),
        },
      ],
      packages: [],
      reviews: [],
      appointments: [],
      invoices: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.customersDb.set(id, newCustomer);
    return newCustomer;
  }

  /**
   * Update customer profiles, hair/skin cards, or tags
   */
  async updateCustomer(customerId: string, organizationId: string, payload: any) {
    const customer = await this.getCustomer360(customerId, organizationId);
    const updated = {
      ...customer,
      ...payload,
      updatedAt: new Date().toISOString(),
    };
    this.customersDb.set(customerId, updated);
    return updated;
  }

  /**
   * Record a new hair color formula
   */
  async addColorFormula(customerId: string, formula: Partial<ColorFormula>) {
    const customer = await this.getCustomer360(customerId);
    const formulaItem: ColorFormula = {
      id: `cf_${Date.now()}`,
      customerId,
      formulaName: formula.formulaName || 'Custom Formulation',
      brand: formula.brand || 'L\'Oréal Professionnel',
      formulaMix: formula.formulaMix || '',
      developerVolume: formula.developerVolume || '20 Vol',
      developerRatio: formula.developerRatio || '1:1.5',
      processingTimeMinutes: formula.processingTimeMinutes || 35,
      targetHairTone: formula.targetHairTone || null,
      stylistNotes: formula.stylistNotes || null,
      technicianUserId: formula.technicianUserId || 'stylist_curr',
      appliedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    customer.colorFormulas.unshift(formulaItem);
    customer.timelineEvents.unshift({
      id: `te_${Date.now()}`,
      customerId,
      eventType: 'FORMULA_APPLIED',
      title: `Color Formula: ${formulaItem.formulaName}`,
      description: `${formulaItem.brand} (${formulaItem.formulaMix}) with ${formulaItem.developerVolume}.`,
      occurredAt: new Date().toISOString(),
    });

    this.customersDb.set(customerId, customer);
    return formulaItem;
  }

  /**
   * Record a chemical patch test result
   */
  async recordPatchTest(customerId: string, test: Partial<PatchTest>) {
    const customer = await this.getCustomer360(customerId);
    const patchItem: PatchTest = {
      id: `pt_${Date.now()}`,
      customerId,
      testType: test.testType || 'HAIR_COLOR_DYE',
      chemicalOrBrandName: test.chemicalOrBrandName || 'Standard Chemical Test',
      testedAt: new Date().toISOString(),
      result: test.result || 'PASSED',
      validUntil: test.validUntil || new Date(Date.now() + 180 * 86400000).toISOString(),
      technicianUserId: test.technicianUserId || 'tech_curr',
      notes: test.notes || null,
      createdAt: new Date().toISOString(),
    };

    customer.patchTests.unshift(patchItem);
    customer.timelineEvents.unshift({
      id: `te_${Date.now()}`,
      customerId,
      eventType: 'PATCH_TEST_RECORDED',
      title: `Patch Test: ${patchItem.chemicalOrBrandName}`,
      description: `Result: ${patchItem.result} • Valid until ${new Date(patchItem.validUntil!).toLocaleDateString()}.`,
      occurredAt: new Date().toISOString(),
    });

    this.customersDb.set(customerId, customer);
    return patchItem;
  }

  /**
   * Add a staff internal note
   */
  async addNote(customerId: string, note: Partial<CustomerNoteItem>) {
    const customer = await this.getCustomer360(customerId);
    const noteItem: CustomerNoteItem = {
      id: `cn_${Date.now()}`,
      customerId,
      note: note.note || '',
      isPrivate: note.isPrivate || false,
      category: note.category || 'GENERAL',
      authorUserId: note.authorUserId || 'user_curr',
      authorName: note.authorName || 'Reception Desk',
      createdAt: new Date().toISOString(),
    };

    customer.staffNotes.unshift(noteItem);
    this.customersDb.set(customerId, customer);
    return noteItem;
  }

  /**
   * Top-up prepaid wallet balance
   */
  async topupWallet(customerId: string, amount: number, paymentMethod: string = 'UPI', reason: string = 'Recharge') {
    const customer = await this.getCustomer360(customerId);
    const numAmount = Number(amount);
    const newBalance = Number(customer.walletBalance) + numAmount;
    customer.walletBalance = newBalance;

    const tx: WalletTransaction = {
      id: `wt_${Date.now()}`,
      customerId,
      amount: numAmount,
      type: 'CREDIT',
      reason: `${reason} via ${paymentMethod}`,
      balanceAfter: newBalance,
      createdAt: new Date().toISOString(),
    };

    customer.walletTransactions.unshift(tx);
    customer.timelineEvents.unshift({
      id: `te_${Date.now()}`,
      customerId,
      eventType: 'PAYMENT_RECEIVED',
      title: `Wallet Recharged — ₹${numAmount.toLocaleString('en-IN')}`,
      description: `Prepaid wallet credited via ${paymentMethod}. New balance: ₹${newBalance.toLocaleString('en-IN')}.`,
      occurredAt: new Date().toISOString(),
    });

    this.customersDb.set(customerId, customer);
    return { balance: newBalance, transaction: tx };
  }
}
