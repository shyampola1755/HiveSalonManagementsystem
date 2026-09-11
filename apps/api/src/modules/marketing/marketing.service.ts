import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { NotificationDispatcherService } from './providers/notification-dispatcher.service';
import type {
  MarketingCampaignDto,
  CreateCampaignPayload,
  AutomationRuleDto,
  CreateAutomationRulePayload,
  OutboundMessageDto,
  SendMessagePayload,
  CustomerReviewDto,
  SubmitReviewPayload,
  ComplaintTicketDto,
  ResolveComplaintPayload,
  CommunicationPreferenceDto,
  UpdateConsentPayload,
  CustomerSegmentType,
  CustomerSegmentSummaryDto,
} from '@hive/types';

@Injectable()
export class MarketingService {
  private campaignsDb = new Map<string, MarketingCampaignDto>();
  private automationRulesDb = new Map<string, AutomationRuleDto>();
  private outboundMessagesDb: OutboundMessageDto[] = [];
  private reviewsDb = new Map<string, CustomerReviewDto>();
  private complaintTicketsDb = new Map<string, ComplaintTicketDto>();
  private preferencesDb = new Map<string, CommunicationPreferenceDto>();

  constructor(private readonly dispatcher: NotificationDispatcherService) {
    this.seedInitialData();
  }

  // ---------------------------------------------------------------------------
  // 1. INITIAL ENTERPRISE SEED DATA
  // ---------------------------------------------------------------------------
  private seedInitialData() {
    // 1. Marketing Campaigns
    const seedCampaigns: MarketingCampaignDto[] = [
      {
        id: 'cmp-1',
        organizationId: 'org_hive_demo',
        branchId: 'b1',
        name: 'Festive Diwali Radiant Glow Flash Sale',
        code: 'CMP-DIWALI-2026',
        audienceSegment: 'VIP',
        channel: 'WHATSAPP',
        messageTemplate:
          'Dear {{customerName}}, celebrate Diwali with radiant luxury! Enjoy exclusive 25% off all Kérastase hair rituals and Hydra-Facials at Hive Salon {{branchName}}. Use code {{discountCode}} at checkout. Book now: {{bookingLink}}',
        discountCode: 'DIWALI25',
        discountPercentage: 25,
        status: 'COMPLETED',
        totalAudience: 120,
        totalSent: 120,
        totalDelivered: 118,
        totalRead: 94,
        totalFailed: 2,
        totalClicked: 68,
        totalConverted: 42,
        revenueGenerated: 285400,
        createdAt: '2026-08-25T10:00:00Z',
        updatedAt: '2026-08-26T18:00:00Z',
      },
      {
        id: 'cmp-2',
        organizationId: 'org_hive_demo',
        name: '60-Day Inactive Client Win-Back',
        code: 'CMP-WINBACK-Q3',
        audienceSegment: 'INACTIVE',
        channel: 'WHATSAPP',
        messageTemplate:
          'Hi {{customerName}}, we miss your presence at Hive Salon! To welcome you back, here is a complimentary ₹500 wallet credit on your next appointment. Code: {{discountCode}}. Reserve your slot: {{bookingLink}}',
        discountCode: 'MISSYOU500',
        discountPercentage: 15,
        status: 'SCHEDULED',
        scheduledAt: '2026-09-15T11:00:00Z',
        totalAudience: 65,
        totalSent: 0,
        totalDelivered: 0,
        totalRead: 0,
        totalFailed: 0,
        totalClicked: 0,
        totalConverted: 0,
        revenueGenerated: 0,
        createdAt: '2026-09-08T14:30:00Z',
        updatedAt: '2026-09-08T14:30:00Z',
      },
      {
        id: 'cmp-3',
        organizationId: 'org_hive_demo',
        name: 'Monsoon Hair Botox & Keratin Treat',
        code: 'CMP-MONSOON-03',
        audienceSegment: 'RETURNING',
        channel: 'SMS',
        messageTemplate:
          'Hive Salon: Tame frizz this monsoon with Cysteine & Hair Botox rituals @ flat 20% off. Valid this week only. Call 040-23558899 or visit {{bookingLink}}',
        discountCode: 'MONSOON20',
        discountPercentage: 20,
        status: 'DRAFT',
        totalAudience: 240,
        totalSent: 0,
        totalDelivered: 0,
        totalRead: 0,
        totalFailed: 0,
        totalClicked: 0,
        totalConverted: 0,
        revenueGenerated: 0,
        createdAt: '2026-09-09T09:00:00Z',
        updatedAt: '2026-09-09T09:00:00Z',
      },
    ];
    seedCampaigns.forEach((c) => this.campaignsDb.set(c.id, c));

    // 2. Automation Workflow Rules (7 Triggers)
    const seedRules: AutomationRuleDto[] = [
      {
        id: 'rule-1',
        organizationId: 'org_hive_demo',
        name: 'Instant Booking Confirmation',
        triggerEvent: 'APPOINTMENT_BOOKED',
        channel: 'WHATSAPP',
        delayMinutes: 0,
        templateBody:
          'Hello {{customerName}}! Your appointment at Hive Salon {{branchName}} is confirmed for {{appointmentTime}} with {{stylistName}}. Services: {{serviceName}}. Manage booking: {{manageLink}}',
        isActive: true,
        respectConsent: true,
        totalTriggered: 1420,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
      {
        id: 'rule-2',
        organizationId: 'org_hive_demo',
        name: '24-Hour Pre-Appointment Reminder',
        triggerEvent: 'APPOINTMENT_BOOKED',
        channel: 'WHATSAPP',
        delayMinutes: 1440,
        templateBody:
          'Reminder: Your salon appointment is tomorrow at {{appointmentTime}} at Hive {{branchName}}. Reply 1 to Confirm or 2 to Reschedule.',
        isActive: true,
        respectConsent: true,
        totalTriggered: 1180,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
      {
        id: 'rule-3',
        organizationId: 'org_hive_demo',
        name: 'Post-Visit CSAT Review Request',
        triggerEvent: 'APPOINTMENT_COMPLETED',
        channel: 'WHATSAPP',
        delayMinutes: 60,
        templateBody:
          'Thank you for visiting Hive Salon today, {{customerName}}! How was your experience with {{stylistName}}? Please rate us: {{ratingLink}}',
        isActive: true,
        respectConsent: true,
        totalTriggered: 940,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
      {
        id: 'rule-4',
        organizationId: 'org_hive_demo',
        name: 'Instant GST Digital Receipt & Wallet Statement',
        triggerEvent: 'PAYMENT_COMPLETED',
        channel: 'WHATSAPP',
        delayMinutes: 0,
        templateBody:
          'Payment received! Invoice #{{invoiceNumber}} for ₹{{invoiceAmount}}. View GST receipt: {{receiptLink}}. Your remaining wallet balance: ₹{{walletBalance}}.',
        isActive: true,
        respectConsent: false, // Transactional receipt always sent
        totalTriggered: 890,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
      {
        id: 'rule-5',
        organizationId: 'org_hive_demo',
        name: '7-Day Pre-Expiry Membership Reminder',
        triggerEvent: 'MEMBERSHIP_EXPIRING',
        channel: 'WHATSAPP',
        delayMinutes: 0,
        templateBody:
          'Dear {{customerName}}, your {{membershipPlan}} expires in 7 days on {{expiryDate}}. Renew today to retain your 20% discount & bonus credits: {{renewLink}}',
        isActive: true,
        respectConsent: true,
        totalTriggered: 165,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
      {
        id: 'rule-6',
        organizationId: 'org_hive_demo',
        name: 'Birthday Special Glamour Treat',
        triggerEvent: 'BIRTHDAY',
        channel: 'WHATSAPP',
        delayMinutes: 0,
        templateBody:
          'Happy Birthday {{customerName}}! 🎂 Hive Salon invites you for a complimentary Birthday Styling Blowout or 20% off all treatments this week. Code: {{discountCode}}',
        isActive: true,
        respectConsent: true,
        totalTriggered: 310,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
      {
        id: 'rule-7',
        organizationId: 'org_hive_demo',
        name: 'Anniversary Spa Rejuvenation Gift',
        triggerEvent: 'ANNIVERSARY',
        channel: 'EMAIL',
        delayMinutes: 0,
        templateBody:
          'Happy Anniversary from Hive Salon! Celebrate with a complimentary Couple Foot Reflexology with any signature facial. Book your romantic pamper session today: {{bookingLink}}',
        isActive: true,
        respectConsent: true,
        totalTriggered: 140,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
    ];
    seedRules.forEach((r) => this.automationRulesDb.set(r.id, r));

    // 3. Outbound Message Queue Logs
    this.outboundMessagesDb = [
      {
        id: 'msg-1',
        organizationId: 'org_hive_demo',
        customerId: 'c1',
        messageType: 'APPOINTMENT_CONFIRMATION',
        channel: 'WHATSAPP',
        providerName: 'WHATSAPP_CLOUD_API',
        providerMessageId: 'wamid.HBgM17258901',
        recipientPhone: '+91 98765 43210',
        recipientName: 'Priya Sharma',
        messageContent:
          'Hello Priya Sharma! Your appointment at Hive Jubilee Hills is confirmed for Sep 12, 2:30 PM with Ananya Reddy. Balayage & Glaze.',
        status: 'READ',
        sentAt: '2026-09-09T10:00:00Z',
        deliveredAt: '2026-09-09T10:00:04Z',
        readAt: '2026-09-09T10:02:15Z',
        createdAt: '2026-09-09T10:00:00Z',
      },
      {
        id: 'msg-2',
        organizationId: 'org_hive_demo',
        customerId: 'c2',
        messageType: 'MEMBERSHIP_EXPIRY',
        channel: 'WHATSAPP',
        providerName: 'WHATSAPP_CLOUD_API',
        providerMessageId: 'wamid.HBgM17258902',
        recipientPhone: '+91 98111 22334',
        recipientName: 'Rahul Verma',
        messageContent:
          'Dear Rahul Verma, your 10 Haircuts Pass has 2 sessions remaining and expires on Sep 17. Renew today with 15% discount.',
        status: 'DELIVERED',
        sentAt: '2026-09-09T14:30:00Z',
        deliveredAt: '2026-09-09T14:30:08Z',
        createdAt: '2026-09-09T14:30:00Z',
      },
      {
        id: 'msg-3',
        organizationId: 'org_hive_demo',
        customerId: 'c3',
        messageType: 'REVIEW_REQUEST',
        channel: 'SMS',
        providerName: 'MSG91_SMS_GATEWAY',
        providerMessageId: 'msg91_89124_01',
        recipientPhone: '+91 99887 76655',
        recipientName: 'Ananya Roy',
        messageContent:
          'Hi Ananya, thank you for visiting Hive Salon! How was your experience? Rate us: https://hive.salon/r/c3',
        status: 'DELIVERED',
        sentAt: '2026-09-08T18:00:00Z',
        deliveredAt: '2026-09-08T18:00:12Z',
        createdAt: '2026-09-08T18:00:00Z',
      },
    ];

    // 4. Customer Reviews & Low-Rating Escalations
    const seedReviews: CustomerReviewDto[] = [
      {
        id: 'rev-1',
        organizationId: 'org_hive_demo',
        customerId: 'c1',
        customerName: 'Priya Sharma',
        customerPhone: '+91 98765 43210',
        branchId: 'b1',
        branchName: 'Jubilee Hills Flagship',
        appointmentId: 'apt-001',
        overallRating: 5,
        staffRating: 5,
        serviceRating: 5,
        ambienceRating: 5,
        comment:
          'Exceptional Balayage service by Aarav Mehta! The shade matching and Olaplex treatment left my hair super soft. Loved the complimentary green tea.',
        stylistName: 'Aarav Mehta',
        serviceName: 'Balayage & Multi-Dimensional Glaze',
        csatScore: 100,
        source: 'WHATSAPP_LINK',
        isEscalated: false,
        isPublic: true,
        publicResponse:
          'Thank you so much Priya! We are thrilled you loved the caramel balayage glow. Looking forward to your next visit!',
        respondedAt: '2026-08-16T11:00:00Z',
        createdAt: '2026-08-15T18:00:00Z',
      },
      {
        id: 'rev-2',
        organizationId: 'org_hive_demo',
        customerId: 'c4',
        customerName: 'Karan Singhania',
        customerPhone: '+91 98450 11223',
        branchId: 'b1',
        branchName: 'Jubilee Hills Flagship',
        appointmentId: 'apt-042',
        overallRating: 2, // LOW RATING -> ESCALATED!
        staffRating: 3,
        serviceRating: 2,
        ambienceRating: 4,
        comment:
          'Had to wait 35 minutes past my booked slot despite having a confirmed weekend appointment. The haircut was rushed and lacked attention to detail on the beard trim.',
        stylistName: 'Vikram Sethi',
        serviceName: 'Signature Royal Haircut & Beard Sculpting',
        csatScore: 40,
        source: 'WHATSAPP_LINK',
        isEscalated: true,
        escalationTicketId: 'tkt-001',
        isPublic: false,
        createdAt: '2026-09-05T16:30:00Z',
      },
      {
        id: 'rev-3',
        organizationId: 'org_hive_demo',
        customerId: 'c2',
        customerName: 'Rahul Verma',
        customerPhone: '+91 98111 22334',
        branchId: 'b1',
        branchName: 'Jubilee Hills Flagship',
        appointmentId: 'apt-019',
        overallRating: 4,
        staffRating: 4,
        serviceRating: 4,
        ambienceRating: 5,
        comment: 'Great haircut as always. Quick service and very clean salon floor.',
        stylistName: 'Aarav Mehta',
        serviceName: 'Royal Haircut',
        csatScore: 80,
        source: 'SMS_LINK',
        isEscalated: false,
        isPublic: true,
        createdAt: '2026-09-01T12:00:00Z',
      },
    ];
    seedReviews.forEach((r) => this.reviewsDb.set(r.id, r));

    // 5. Complaint Escalation Ticket (For 2-Star Review)
    this.complaintTicketsDb.set('tkt-001', {
      id: 'tkt-001',
      organizationId: 'org_hive_demo',
      branchId: 'b1',
      customerId: 'c4',
      customerName: 'Karan Singhania',
      customerPhone: '+91 98450 11223',
      reviewId: 'rev-2',
      appointmentId: 'apt-042',
      severity: 'HIGH',
      rootCauseCategory: 'WAIT_TIME',
      complaintDetails:
        'Customer waited 35 minutes for booked appointment. Stylist was overbooked on prior keratin service. Customer dissatisfied with rushed beard trim.',
      assignedManagerId: 'mgr-1',
      assignedManagerName: 'Sarah Jenkins (Branch Manager)',
      status: 'CONTACTED_CLIENT',
      compensationType: 'WALLET_CREDIT',
      compensationValue: 850.0,
      managerNotes:
        'Spoke with Karan over phone. Apologized for the queue delay. Realigned Saturday buffer times with receptionist.',
      resolutionSummary:
        'Offered 100% refund as ₹850 wallet credit plus priority VIP slot for next visit. Client agreed to return.',
      createdAt: '2026-09-05T16:35:00Z',
      updatedAt: '2026-09-06T10:00:00Z',
    });

    // 6. Communication Consent Preferences
    this.preferencesDb.set('c1', {
      id: 'pref-1',
      organizationId: 'org_hive_demo',
      customerId: 'c1',
      customerName: 'Priya Sharma',
      customerPhone: '+91 98765 43210',
      allowMarketingWhatsapp: true,
      allowMarketingSms: true,
      allowMarketingEmail: true,
      allowTransactionalMessages: true,
      preferredChannel: 'WHATSAPP',
      preferredLanguage: 'en',
      createdAt: '2026-01-15T10:00:00Z',
    });
  }

  // ---------------------------------------------------------------------------
  // 2. CUSTOMER SEGMENTS & AUDIENCE SIZING
  // ---------------------------------------------------------------------------
  getCustomerSegments(): CustomerSegmentSummaryDto[] {
    return [
      {
        segment: 'VIP',
        title: 'VIP & High Value Spenders',
        description: 'Top spenders (> ₹25,000) or Diamond Club members with high lifetime value.',
        totalCustomers: 120,
        averageSpend: 48500,
        color: '#d97706',
      },
      {
        segment: 'RETURNING',
        title: 'Regular Returning Guests',
        description: 'Visited 2–4 times in the past 60 days with consistent service preferences.',
        totalCustomers: 240,
        averageSpend: 14200,
        color: '#0284c7',
      },
      {
        segment: 'MEMBERSHIP',
        title: 'Active Membership Pass Holders',
        description: 'Currently enrolled in annual or monthly plans with active benefits.',
        totalCustomers: 142,
        averageSpend: 28000,
        color: '#7c3aed',
      },
      {
        segment: 'INACTIVE',
        title: 'Lapsed Clients (60+ Days No Visit)',
        description: 'Haven’t booked in over 60 days. Prime target for win-back campaigns.',
        totalCustomers: 65,
        averageSpend: 6200,
        color: '#e11d48',
      },
      {
        segment: 'NEW',
        title: 'First-Time Walk-Ins & Online Bookings',
        description: 'Joined in the last 30 days. Ready for welcome onboarding & rebooking sequence.',
        totalCustomers: 54,
        averageSpend: 2800,
        color: '#059669',
      },
      {
        segment: 'FREQUENT',
        title: 'Bi-Weekly Frequent Regulars',
        description: 'Clients booking haircuts, grooming or blowouts at least twice a month.',
        totalCustomers: 88,
        averageSpend: 22400,
        color: '#db2777',
      },
      {
        segment: 'ALL',
        title: 'All Opted-In Active Customers',
        description: 'Entire client database with verified consent.',
        totalCustomers: 709,
        averageSpend: 18500,
        color: '#475569',
      },
    ];
  }

  // ---------------------------------------------------------------------------
  // 3. CAMPAIGNS (BROADCAST & SCHEDULED)
  // ---------------------------------------------------------------------------
  getAllCampaigns(): MarketingCampaignDto[] {
    return Array.from(this.campaignsDb.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  createCampaign(payload: CreateCampaignPayload): MarketingCampaignDto {
    const existing = Array.from(this.campaignsDb.values()).find((c) => c.code === payload.code);
    if (existing) throw new ConflictException(`Campaign code '${payload.code}' already exists`);

    const segmentInfo = this.getCustomerSegments().find((s) => s.segment === payload.audienceSegment);
    const audienceCount = segmentInfo ? segmentInfo.totalCustomers : 50;

    const newCampaign: MarketingCampaignDto = {
      id: `cmp-${Date.now()}`,
      organizationId: 'org_hive_demo',
      branchId: payload.branchId,
      name: payload.name,
      code: payload.code.toUpperCase(),
      audienceSegment: payload.audienceSegment,
      channel: payload.channel,
      messageTemplate: payload.messageTemplate,
      discountCode: payload.discountCode,
      discountPercentage: payload.discountPercentage,
      scheduledAt: payload.scheduledAt,
      status: payload.scheduledAt ? 'SCHEDULED' : 'DRAFT',
      totalAudience: audienceCount,
      totalSent: 0,
      totalDelivered: 0,
      totalRead: 0,
      totalFailed: 0,
      totalClicked: 0,
      totalConverted: 0,
      revenueGenerated: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.campaignsDb.set(newCampaign.id, newCampaign);
    return newCampaign;
  }

  async launchCampaign(campaignId: string): Promise<MarketingCampaignDto> {
    const campaign = this.campaignsDb.get(campaignId);
    if (!campaign) throw new NotFoundException(`Campaign '${campaignId}' not found`);

    campaign.status = 'SENDING';
    const totalAudience = campaign.totalAudience;

    // Simulate batch dispatch through dispatcher with consent checks
    let delivered = Math.round(totalAudience * 0.96);
    let read = Math.round(totalAudience * 0.78);
    let clicked = Math.round(totalAudience * 0.45);
    let converted = Math.round(totalAudience * 0.28);
    let revenue = converted * 3800; // average ticket size

    campaign.totalSent = totalAudience;
    campaign.totalDelivered = delivered;
    campaign.totalRead = read;
    campaign.totalFailed = totalAudience - delivered;
    campaign.totalClicked = clicked;
    campaign.totalConverted = converted;
    campaign.revenueGenerated = revenue;
    campaign.status = 'COMPLETED';
    campaign.updatedAt = new Date().toISOString();

    // Log sample outbound message
    this.outboundMessagesDb.unshift({
      id: `msg-${Date.now()}`,
      organizationId: 'org_hive_demo',
      campaignId: campaign.id,
      messageType: 'MARKETING_PROMOTION',
      channel: campaign.channel,
      providerName:
        campaign.channel === 'WHATSAPP'
          ? 'WHATSAPP_CLOUD_API'
          : campaign.channel === 'EMAIL'
          ? 'RESEND_EMAIL_GATEWAY'
          : 'MSG91_SMS_GATEWAY',
      recipientPhone: '+91 98765 43210',
      recipientName: `Audience (${campaign.audienceSegment})`,
      messageContent: campaign.messageTemplate.replace('{{discountCode}}', campaign.discountCode || 'PROMO'),
      status: 'DELIVERED',
      sentAt: new Date().toISOString(),
      deliveredAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });

    this.campaignsDb.set(campaign.id, campaign);
    return campaign;
  }

  // ---------------------------------------------------------------------------
  // 4. AUTOMATION WORKFLOW RULES
  // ---------------------------------------------------------------------------
  getAllAutomationRules(): AutomationRuleDto[] {
    return Array.from(this.automationRulesDb.values());
  }

  createAutomationRule(payload: CreateAutomationRulePayload): AutomationRuleDto {
    const newRule: AutomationRuleDto = {
      id: `rule-${Date.now()}`,
      organizationId: 'org_hive_demo',
      name: payload.name,
      triggerEvent: payload.triggerEvent,
      channel: payload.channel,
      delayMinutes: payload.delayMinutes || 0,
      templateBody: payload.templateBody,
      isActive: payload.isActive ?? true,
      audienceSegmentFilter: payload.audienceSegmentFilter || 'ALL',
      respectConsent: payload.respectConsent ?? true,
      totalTriggered: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.automationRulesDb.set(newRule.id, newRule);
    return newRule;
  }

  toggleAutomationRule(ruleId: string, isActive: boolean): AutomationRuleDto {
    const rule = this.automationRulesDb.get(ruleId);
    if (!rule) throw new NotFoundException(`Workflow rule '${ruleId}' not found`);

    rule.isActive = isActive;
    rule.updatedAt = new Date().toISOString();
    this.automationRulesDb.set(rule.id, rule);
    return rule;
  }

  // ---------------------------------------------------------------------------
  // 5. OUTBOUND MESSAGE QUEUE & DISPATCH
  // ---------------------------------------------------------------------------
  getOutboundMessages(status?: string, channel?: string): OutboundMessageDto[] {
    let list = [...this.outboundMessagesDb];
    if (status && status !== 'ALL') {
      list = list.filter((m) => m.status === status);
    }
    if (channel && channel !== 'ALL') {
      list = list.filter((m) => m.channel === channel);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async sendDirectMessage(payload: SendMessagePayload): Promise<OutboundMessageDto> {
    const consent = payload.customerId ? this.preferencesDb.get(payload.customerId) : undefined;
    const isMarketing = payload.messageType === 'MARKETING_PROMOTION' || payload.messageType === 'WIN_BACK';

    const deliveryResult = await this.dispatcher.dispatchMessage(
      payload.channel,
      {
        recipientName: payload.recipientName,
        recipientPhone: payload.recipientPhone,
        recipientEmail: payload.recipientEmail,
        content: payload.messageContent,
        messageType: payload.messageType,
      },
      consent,
      isMarketing
    );

    const messageRecord: OutboundMessageDto = {
      id: `msg-${Date.now()}`,
      organizationId: 'org_hive_demo',
      branchId: payload.branchId,
      customerId: payload.customerId,
      campaignId: payload.campaignId,
      workflowRuleId: payload.workflowRuleId,
      messageType: payload.messageType,
      channel: payload.channel,
      providerName: deliveryResult.providerName,
      providerMessageId: deliveryResult.providerMessageId,
      recipientPhone: payload.recipientPhone,
      recipientEmail: payload.recipientEmail,
      recipientName: payload.recipientName,
      messageContent: payload.messageContent,
      status: deliveryResult.status,
      errorMessage: deliveryResult.error,
      sentAt: deliveryResult.success ? new Date().toISOString() : undefined,
      deliveredAt: deliveryResult.success ? new Date().toISOString() : undefined,
      createdAt: new Date().toISOString(),
    };

    this.outboundMessagesDb.unshift(messageRecord);
    return messageRecord;
  }

  // ---------------------------------------------------------------------------
  // 6. REVIEWS & LOW RATING ESCALATION ENGINE
  // ---------------------------------------------------------------------------
  getAllReviews(): CustomerReviewDto[] {
    return Array.from(this.reviewsDb.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  submitReview(payload: SubmitReviewPayload): { review: CustomerReviewDto; escalatedTicket?: ComplaintTicketDto } {
    const reviewId = `rev-${Date.now()}`;
    const isLowRating = payload.overallRating <= 3;

    let escalationTicketId: string | undefined = undefined;
    let escalatedTicket: ComplaintTicketDto | undefined = undefined;

    // AUTO-TRIGGER LOW RATING ESCALATION TICKET IF RATING <= 3
    if (isLowRating) {
      escalationTicketId = `tkt-${Date.now()}`;
      escalatedTicket = {
        id: escalationTicketId,
        organizationId: 'org_hive_demo',
        customerId: payload.customerId,
        customerName: payload.customerId === 'c1' ? 'Priya Sharma' : payload.customerId === 'c2' ? 'Rahul Verma' : 'Customer Account',
        customerPhone: '+91 98765 43210',
        reviewId,
        appointmentId: payload.appointmentId,
        severity: payload.overallRating <= 2 ? 'HIGH' : 'MEDIUM',
        rootCauseCategory: 'SERVICE_QUALITY',
        complaintDetails: payload.comment || 'Low star rating received without specific comment.',
        assignedManagerName: 'Branch Manager on Duty',
        status: 'OPEN',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.complaintTicketsDb.set(escalatedTicket.id, escalatedTicket);
    }

    const newReview: CustomerReviewDto = {
      id: reviewId,
      organizationId: 'org_hive_demo',
      customerId: payload.customerId,
      customerName: payload.customerId === 'c1' ? 'Priya Sharma' : payload.customerId === 'c2' ? 'Rahul Verma' : 'Guest Customer',
      customerPhone: '+91 98765 43210',
      appointmentId: payload.appointmentId,
      overallRating: payload.overallRating,
      staffRating: payload.staffRating || payload.overallRating,
      serviceRating: payload.serviceRating || payload.overallRating,
      ambienceRating: payload.ambienceRating || payload.overallRating,
      comment: payload.comment,
      stylistName: payload.stylistName || 'Assigned Stylist',
      serviceName: payload.serviceName || 'Salon Service',
      csatScore: payload.overallRating * 20,
      source: payload.source || 'WHATSAPP_LINK',
      isEscalated: isLowRating,
      escalationTicketId,
      isPublic: !isLowRating,
      createdAt: new Date().toISOString(),
    };

    this.reviewsDb.set(newReview.id, newReview);
    return { review: newReview, escalatedTicket };
  }

  postPublicResponse(reviewId: string, responseText: string): CustomerReviewDto {
    const review = this.reviewsDb.get(reviewId);
    if (!review) throw new NotFoundException(`Review '${reviewId}' not found`);

    review.publicResponse = responseText;
    review.respondedAt = new Date().toISOString();
    this.reviewsDb.set(review.id, review);
    return review;
  }

  // ---------------------------------------------------------------------------
  // 7. COMPLAINT ESCALATION TICKETS & RESOLUTION
  // ---------------------------------------------------------------------------
  getAllComplaintTickets(): ComplaintTicketDto[] {
    return Array.from(this.complaintTicketsDb.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  resolveComplaint(payload: ResolveComplaintPayload): ComplaintTicketDto {
    const ticket = this.complaintTicketsDb.get(payload.ticketId);
    if (!ticket) throw new NotFoundException(`Complaint ticket '${payload.ticketId}' not found`);

    ticket.status = payload.status;
    ticket.resolutionSummary = payload.resolutionSummary;
    if (payload.assignedManagerName) ticket.assignedManagerName = payload.assignedManagerName;
    if (payload.compensationType) ticket.compensationType = payload.compensationType;
    if (payload.compensationValue !== undefined) ticket.compensationValue = payload.compensationValue;
    if (payload.managerNotes) ticket.managerNotes = payload.managerNotes;

    if (payload.status === 'RESOLVED' || payload.status === 'CLOSED') {
      ticket.resolvedAt = new Date().toISOString();
    }
    ticket.updatedAt = new Date().toISOString();

    this.complaintTicketsDb.set(ticket.id, ticket);
    return ticket;
  }

  // ---------------------------------------------------------------------------
  // 8. CUSTOMER CONSENT & PREFERENCES
  // ---------------------------------------------------------------------------
  getCustomerConsent(customerId: string): CommunicationPreferenceDto {
    let pref = this.preferencesDb.get(customerId);
    if (!pref) {
      pref = {
        id: `pref-${Date.now()}`,
        organizationId: 'org_hive_demo',
        customerId,
        customerName: customerId === 'c1' ? 'Priya Sharma' : 'Customer',
        customerPhone: '+91 98765 43210',
        allowMarketingWhatsapp: true,
        allowMarketingSms: true,
        allowMarketingEmail: true,
        allowTransactionalMessages: true,
        preferredChannel: 'WHATSAPP',
        preferredLanguage: 'en',
        createdAt: new Date().toISOString(),
      };
      this.preferencesDb.set(customerId, pref);
    }
    return pref;
  }

  updateCustomerConsent(payload: UpdateConsentPayload): CommunicationPreferenceDto {
    const pref = this.getCustomerConsent(payload.customerId);
    pref.allowMarketingWhatsapp = payload.allowMarketingWhatsapp;
    pref.allowMarketingSms = payload.allowMarketingSms;
    pref.allowMarketingEmail = payload.allowMarketingEmail;
    pref.allowTransactionalMessages = payload.allowTransactionalMessages;
    if (payload.preferredChannel) pref.preferredChannel = payload.preferredChannel;
    pref.updatedAt = new Date().toISOString();

    this.preferencesDb.set(pref.customerId, pref);
    return pref;
  }
}
