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
  Megaphone,
  Sparkles,
  Zap,
  Send,
  MessageSquare,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Clock,
  Plus,
  RefreshCw,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Percent,
  ShieldCheck,
  ShieldAlert,
  Star,
  Users,
  Eye,
  MousePointer,
  DollarSign,
  Gift,
  Calendar,
  Layers,
  Activity,
  Smile,
  Frown,
  CheckCircle,
  XCircle,
  Info,
  Radio,
  Sliders,
  Award,
  ChevronRight,
  Receipt,
  UserCheck,
  HelpCircle,
  Smartphone,
} from 'lucide-react';
import { formatCurrency } from '@hive/utilities';
import type {
  MessageType,
  CommunicationChannel,
  MessageDeliveryStatus,
  CustomerSegmentType,
  AutomationTriggerEvent,
  ComplaintSeverity,
  ComplaintRootCause,
  ComplaintStatus,
  MarketingCampaignDto,
  AutomationRuleDto,
  OutboundMessageDto,
  CustomerReviewDto,
  ComplaintTicketDto,
  CommunicationPreferenceDto,
  CustomerSegmentSummaryDto,
  CreateCampaignPayload,
  CreateAutomationRulePayload,
  SendMessagePayload,
  SubmitReviewPayload,
  ResolveComplaintPayload,
  UpdateConsentPayload,
} from '@hive/types';

export interface MarketingViewProps {
  initialTab?:
    | 'CAMPAIGNS'
    | 'AUTOMATIONS'
    | 'SEGMENTS'
    | 'QUEUE'
    | 'REVIEWS'
    | 'COMPLAINTS'
    | 'CONSENT';
}

export function MarketingView({ initialTab = 'CAMPAIGNS' }: MarketingViewProps) {
  const toast = useToast();

  // Active Tab
  const [activeTab, setActiveTab] = React.useState<
    | 'CAMPAIGNS'
    | 'AUTOMATIONS'
    | 'SEGMENTS'
    | 'QUEUE'
    | 'REVIEWS'
    | 'COMPLAINTS'
    | 'CONSENT'
  >(initialTab);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = React.useState('');
  const [channelFilter, setChannelFilter] = React.useState<'ALL' | CommunicationChannel>('ALL');
  const [statusFilter, setStatusFilter] = React.useState<string>('ALL');

  // ---------------------------------------------------------------------------
  // 1. STATE & SEED DATA
  // ---------------------------------------------------------------------------

  // Campaigns State
  const [campaigns, setCampaigns] = React.useState<MarketingCampaignDto[]>([
    {
      id: 'cmp-1',
      organizationId: 'org_hive_demo',
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
      createdAt: '2026-09-09T09:15:00Z',
      updatedAt: '2026-09-09T09:15:00Z',
    },
  ]);

  // Automations State
  const [automationRules, setAutomationRules] = React.useState<AutomationRuleDto[]>([
    {
      id: 'rule-1',
      organizationId: 'org_hive_demo',
      name: 'Instant Booking Confirmation',
      triggerEvent: 'APPOINTMENT_BOOKED',
      channel: 'WHATSAPP',
      delayMinutes: 0,
      templateBody:
        'Hello {{customerName}}! Your appointment for {{serviceName}} with {{stylistName}} at Hive Salon {{branchName}} on {{appointmentDate}} at {{appointmentTime}} is confirmed. View details: {{bookingLink}}',
      isActive: true,
      audienceSegmentFilter: 'ALL',
      respectConsent: false,
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
        'Hi {{customerName}}, reminder for your salon service tomorrow at {{appointmentTime}} at Hive Salon {{branchName}}. Reply CANCEL if you need to reschedule.',
      isActive: true,
      audienceSegmentFilter: 'ALL',
      respectConsent: false,
      totalTriggered: 1390,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
    {
      id: 'rule-3',
      organizationId: 'org_hive_demo',
      name: 'Digital Tax Invoice & Payment Receipt',
      triggerEvent: 'PAYMENT_COMPLETED',
      channel: 'WHATSAPP',
      delayMinutes: 0,
      templateBody:
        'Thank you for visiting Hive Salon, {{customerName}}! Your payment of {{paymentAmount}} for invoice #{{invoiceNumber}} was successful. Download your GST receipt: {{invoiceLink}}',
      isActive: true,
      audienceSegmentFilter: 'ALL',
      respectConsent: false,
      totalTriggered: 1850,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
    {
      id: 'rule-4',
      organizationId: 'org_hive_demo',
      name: 'Post-Service CSAT Review & Rating Request',
      triggerEvent: 'APPOINTMENT_COMPLETED',
      channel: 'WHATSAPP',
      delayMinutes: 30,
      templateBody:
        'Hi {{customerName}}, how was your styling session with {{stylistName}} today? Please share your 1-minute rating and feedback here: {{reviewLink}}. Your opinion shapes our craft!',
      isActive: true,
      audienceSegmentFilter: 'ALL',
      respectConsent: true,
      totalTriggered: 960,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
    {
      id: 'rule-5',
      organizationId: 'org_hive_demo',
      name: 'Membership 7-Day Pre-Expiry Renewal Alert',
      triggerEvent: 'MEMBERSHIP_EXPIRING',
      channel: 'WHATSAPP',
      delayMinutes: 0,
      templateBody:
        'Dear {{customerName}}, your Hive Salon {{membershipPlan}} expires in 7 days! Renew now to retain your 20% discount perk and receive ₹1,000 bonus wallet credit: {{renewalLink}}',
      isActive: true,
      audienceSegmentFilter: 'MEMBERSHIP',
      respectConsent: true,
      totalTriggered: 48,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
    {
      id: 'rule-6',
      organizationId: 'org_hive_demo',
      name: 'Happy Birthday VIP Pamper Voucher',
      triggerEvent: 'BIRTHDAY',
      channel: 'WHATSAPP',
      delayMinutes: 0,
      templateBody:
        'Happy Birthday {{customerName}}! 🎂 Hive Salon wishes you a sparkling year ahead. Enjoy a complimentary luxury hair spa or express facial on us this birthday week: {{birthdayLink}}',
      isActive: true,
      audienceSegmentFilter: 'ALL',
      respectConsent: true,
      totalTriggered: 112,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
    {
      id: 'rule-7',
      organizationId: 'org_hive_demo',
      name: '60-Day Inactive Client Re-engagement',
      triggerEvent: 'CUSTOMER_INACTIVE_60D',
      channel: 'WHATSAPP',
      delayMinutes: 0,
      templateBody:
        'Hi {{customerName}}, we have not seen you in 60 days! Enjoy ₹500 off your next haircut or spa ritual this weekend. Code: MISSYOU500. Book: {{bookingLink}}',
      isActive: true,
      audienceSegmentFilter: 'INACTIVE',
      respectConsent: true,
      totalTriggered: 74,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    },
  ]);

  // Customer Segments
  const customerSegments: CustomerSegmentSummaryDto[] = [
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
      title: 'First-Time Walk-Ins & Leads',
      description: 'Joined in the last 30 days. Ready for welcome onboarding & rebooking.',
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
      description: 'Entire client database with verified communication consent.',
      totalCustomers: 709,
      averageSpend: 18500,
      color: '#475569',
    },
  ];

  // Outbound Messages Queue
  const [messages, setMessages] = React.useState<OutboundMessageDto[]>([
    {
      id: 'msg-101',
      organizationId: 'org_hive_demo',
      customerId: 'c1',
      messageType: 'APPOINTMENT_CONFIRMATION',
      channel: 'WHATSAPP',
      providerName: 'WHATSAPP_CLOUD_API',
      providerMessageId: 'wamid.HB0912X8A912',
      recipientPhone: '+91 98765 43210',
      recipientName: 'Priya Sharma',
      messageContent:
        'Hello Priya Sharma! Your appointment for Hair Styling with Ananya Sen at Hive Salon Jubilee Hills on 10-Sep-2026 at 02:30 PM is confirmed. View details: https://hive.salon/b/apt-901',
      status: 'READ',
      sentAt: '2026-09-10T10:15:00Z',
      deliveredAt: '2026-09-10T10:15:04Z',
      readAt: '2026-09-10T10:18:22Z',
      createdAt: '2026-09-10T10:15:00Z',
    },
    {
      id: 'msg-102',
      organizationId: 'org_hive_demo',
      customerId: 'c2',
      messageType: 'INVOICE_RECEIPT',
      channel: 'WHATSAPP',
      providerName: 'WHATSAPP_CLOUD_API',
      providerMessageId: 'wamid.HB0912X8A913',
      recipientPhone: '+91 98765 43211',
      recipientName: 'Rahul Verma',
      messageContent:
        'Thank you for visiting Hive Salon, Rahul Verma! Your payment of ₹2,832 for invoice #INV-2026-098 was successful. Download your GST receipt: https://hive.salon/inv/098',
      status: 'DELIVERED',
      sentAt: '2026-09-10T11:30:00Z',
      deliveredAt: '2026-09-10T11:30:05Z',
      createdAt: '2026-09-10T11:30:00Z',
    },
    {
      id: 'msg-103',
      organizationId: 'org_hive_demo',
      customerId: 'c3',
      messageType: 'REVIEW_REQUEST',
      channel: 'WHATSAPP',
      providerName: 'WHATSAPP_CLOUD_API',
      providerMessageId: 'wamid.HB0912X8A914',
      recipientPhone: '+91 98765 43212',
      recipientName: 'Anita Desai',
      messageContent:
        'Hi Anita Desai, how was your styling session with Vikram Malhotra today? Please share your 1-minute rating and feedback here: https://hive.salon/r/c3-rev. Your opinion shapes our craft!',
      status: 'DELIVERED',
      sentAt: '2026-09-10T11:45:00Z',
      deliveredAt: '2026-09-10T11:45:06Z',
      createdAt: '2026-09-10T11:45:00Z',
    },
    {
      id: 'msg-104',
      organizationId: 'org_hive_demo',
      customerId: 'c4',
      messageType: 'MARKETING_PROMOTION',
      channel: 'SMS',
      providerName: 'MSG91_SMS_GATEWAY',
      providerMessageId: 'msg91-tx-99482',
      recipientPhone: '+91 98765 43213',
      recipientName: 'Siddharth Rao',
      messageContent:
        'Hive Salon: Tame frizz this monsoon with Cysteine & Hair Botox rituals @ flat 20% off. Valid this week only. Call 040-23558899 or visit https://hive.salon/b/monsoon',
      status: 'DELIVERED',
      sentAt: '2026-09-10T09:00:00Z',
      deliveredAt: '2026-09-10T09:00:12Z',
      createdAt: '2026-09-10T09:00:00Z',
    },
    {
      id: 'msg-105',
      organizationId: 'org_hive_demo',
      customerId: 'c5',
      messageType: 'WIN_BACK',
      channel: 'EMAIL',
      providerName: 'RESEND_EMAIL_GATEWAY',
      providerMessageId: 'resend_email_88319',
      recipientEmail: 'kavita.m@gmail.com',
      recipientName: 'Kavita Menon',
      messageContent:
        'Dear Kavita, we miss you at Hive Salon! Receive ₹500 complimentary credit on your next facial ritual.',
      status: 'SENT',
      sentAt: '2026-09-10T08:30:00Z',
      createdAt: '2026-09-10T08:30:00Z',
    },
    {
      id: 'msg-106',
      organizationId: 'org_hive_demo',
      customerId: 'c6',
      messageType: 'MARKETING_PROMOTION',
      channel: 'WHATSAPP',
      providerName: 'WHATSAPP_CLOUD_API',
      recipientPhone: '+91 98765 43215',
      recipientName: 'Arjun Kapoor',
      messageContent: 'Exclusive 25% off festive haircut package.',
      status: 'OPTED_OUT',
      errorMessage: 'Blocked: Customer explicitly opted out of WhatsApp Marketing messages.',
      createdAt: '2026-09-10T08:00:00Z',
    },
  ]);

  // Customer Reviews
  const [reviews, setReviews] = React.useState<CustomerReviewDto[]>([
    {
      id: 'rev-1',
      organizationId: 'org_hive_demo',
      customerId: 'c1',
      customerName: 'Priya Sharma',
      customerPhone: '+91 98765 43210',
      branchName: 'Jubilee Hills, Hyderabad',
      appointmentId: 'apt-901',
      overallRating: 5,
      staffRating: 5,
      serviceRating: 5,
      ambienceRating: 5,
      comment:
        'Ananya is an extraordinary stylist! The balayage and blow dry were flawless. The salon ambience is super luxurious.',
      stylistName: 'Ananya Sen',
      serviceName: 'Balayage & Hair Spa Ritual',
      csatScore: 100,
      source: 'WHATSAPP_LINK',
      isEscalated: false,
      isPublic: true,
      publicResponse:
        'Thank you so much Priya! It was an absolute delight crafting your balayage. Looking forward to welcoming you back soon!',
      respondedAt: '2026-09-08T15:00:00Z',
      createdAt: '2026-09-08T14:15:00Z',
    },
    {
      id: 'rev-2',
      organizationId: 'org_hive_demo',
      customerId: 'c3',
      customerName: 'Anita Desai',
      customerPhone: '+91 98765 43212',
      branchName: 'Jubilee Hills, Hyderabad',
      appointmentId: 'apt-902',
      overallRating: 5,
      staffRating: 5,
      serviceRating: 5,
      ambienceRating: 4,
      comment: 'Hydra-Facial was deeply rejuvenating. My skin feels glowing and fresh. Highly recommended!',
      stylistName: 'Meera Patel',
      serviceName: 'Hydra-Facial Signature Glow',
      csatScore: 100,
      source: 'QR_CODE_DESK',
      isEscalated: false,
      isPublic: true,
      createdAt: '2026-09-09T16:30:00Z',
    },
    {
      id: 'rev-3',
      organizationId: 'org_hive_demo',
      customerId: 'c2',
      customerName: 'Rahul Verma',
      customerPhone: '+91 98765 43211',
      branchName: 'Jubilee Hills, Hyderabad',
      appointmentId: 'apt-903',
      overallRating: 2,
      staffRating: 2,
      serviceRating: 2,
      ambienceRating: 3,
      comment:
        'Waited 35 minutes despite booking an appointment. The beard trim felt rushed and uneven on the sideburns.',
      stylistName: 'Vikram Malhotra',
      serviceName: 'Executive Beard Sculpt & Haircut',
      csatScore: 40,
      source: 'WHATSAPP_LINK',
      isEscalated: true,
      escalationTicketId: 'tkt-001',
      isPublic: false,
      createdAt: '2026-09-09T18:45:00Z',
    },
    {
      id: 'rev-4',
      organizationId: 'org_hive_demo',
      customerId: 'c7',
      customerName: 'Rohit Nambiar',
      customerPhone: '+91 98765 43216',
      branchName: 'Jubilee Hills, Hyderabad',
      appointmentId: 'apt-904',
      overallRating: 3,
      staffRating: 4,
      serviceRating: 3,
      ambienceRating: 3,
      comment: 'Haircut was decent, but wash station water was cold and product upsell felt slightly pushy.',
      stylistName: 'Kunal Joshi',
      serviceName: 'Gentlemen Styling & Wash',
      csatScore: 60,
      source: 'SMS_LINK',
      isEscalated: true,
      escalationTicketId: 'tkt-002',
      isPublic: false,
      createdAt: '2026-09-10T10:00:00Z',
    },
  ]);

  // Complaint Escalation Tickets State
  const [complaintTickets, setComplaintTickets] = React.useState<ComplaintTicketDto[]>([
    {
      id: 'tkt-001',
      organizationId: 'org_hive_demo',
      customerId: 'c2',
      customerName: 'Rahul Verma',
      customerPhone: '+91 98765 43211',
      reviewId: 'rev-3',
      appointmentId: 'apt-903',
      severity: 'HIGH',
      rootCauseCategory: 'WAIT_TIME',
      complaintDetails:
        'Client rated 2-Stars: Waited 35 minutes past appointment time; beard trim uneven on sideburns.',
      assignedManagerName: 'Sarah Jenkins (Duty Manager)',
      status: 'OPEN',
      createdAt: '2026-09-09T18:45:00Z',
      updatedAt: '2026-09-09T18:45:00Z',
    },
    {
      id: 'tkt-002',
      organizationId: 'org_hive_demo',
      customerId: 'c7',
      customerName: 'Rohit Nambiar',
      customerPhone: '+91 98765 43216',
      reviewId: 'rev-4',
      appointmentId: 'apt-904',
      severity: 'MEDIUM',
      rootCauseCategory: 'SERVICE_QUALITY',
      complaintDetails: 'Client rated 3-Stars: Cold wash basin water and overly aggressive retail upsell.',
      assignedManagerName: 'Sarah Jenkins (Duty Manager)',
      status: 'INVESTIGATING',
      managerNotes: 'Called stylist Kunal to review soft skills training; checking temperature thermostat on station 3.',
      createdAt: '2026-09-10T10:00:00Z',
      updatedAt: '2026-09-10T10:15:00Z',
    },
    {
      id: 'tkt-000',
      organizationId: 'org_hive_demo',
      customerId: 'c8',
      customerName: 'Sneha Kapoor',
      customerPhone: '+91 98765 43218',
      severity: 'HIGH',
      rootCauseCategory: 'SERVICE_QUALITY',
      complaintDetails: 'Color toner brassy tone dispute on ash blonde appointment.',
      assignedManagerName: 'Sarah Jenkins (Duty Manager)',
      status: 'RESOLVED',
      compensationType: 'COMPLIMENTARY_SERVICE',
      compensationValue: 3500,
      managerNotes: 'Invited client for complimentary toner correction session with Senior Stylist Ananya.',
      resolutionSummary: 'Client delighted after re-toning session. Rated 5-stars on Google Review.',
      resolvedAt: '2026-09-07T16:00:00Z',
      createdAt: '2026-09-05T12:00:00Z',
      updatedAt: '2026-09-07T16:00:00Z',
    },
  ]);

  // Customer Consent / Preferences State
  const [consentPreferences, setConsentPreferences] = React.useState<CommunicationPreferenceDto[]>([
    {
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
    },
    {
      id: 'pref-2',
      organizationId: 'org_hive_demo',
      customerId: 'c2',
      customerName: 'Rahul Verma',
      customerPhone: '+91 98765 43211',
      allowMarketingWhatsapp: true,
      allowMarketingSms: false,
      allowMarketingEmail: true,
      allowTransactionalMessages: true,
      preferredChannel: 'WHATSAPP',
      preferredLanguage: 'en',
      createdAt: '2026-02-10T12:00:00Z',
    },
    {
      id: 'pref-3',
      organizationId: 'org_hive_demo',
      customerId: 'c6',
      customerName: 'Arjun Kapoor',
      customerPhone: '+91 98765 43215',
      allowMarketingWhatsapp: false,
      allowMarketingSms: false,
      allowMarketingEmail: false,
      allowTransactionalMessages: true,
      optedOutAt: '2026-08-01T10:00:00Z',
      optOutReason: 'Customer requested DND for marketing communications.',
      preferredChannel: 'SMS',
      preferredLanguage: 'en',
      createdAt: '2026-03-01T09:00:00Z',
    },
  ]);

  // ---------------------------------------------------------------------------
  // 2. MODAL & DRAWER STATES
  // ---------------------------------------------------------------------------
  const [isNewCampaignModalOpen, setIsNewCampaignModalOpen] = React.useState(false);
  const [newCampaignData, setNewCampaignData] = React.useState<CreateCampaignPayload>({
    name: '',
    code: '',
    audienceSegment: 'VIP',
    channel: 'WHATSAPP',
    messageTemplate:
      'Dear {{customerName}}, enjoy exclusive luxury treatments at Hive Salon {{branchName}}! Use code {{discountCode}} for special savings. Book now: {{bookingLink}}',
    discountCode: 'HIVE20',
    discountPercentage: 20,
    scheduledAt: '',
  });

  const [isNewRuleModalOpen, setIsNewRuleModalOpen] = React.useState(false);
  const [newRuleData, setNewRuleData] = React.useState<CreateAutomationRulePayload>({
    name: '',
    triggerEvent: 'APPOINTMENT_COMPLETED',
    channel: 'WHATSAPP',
    delayMinutes: 30,
    templateBody:
      'Hi {{customerName}}, thank you for choosing Hive Salon {{branchName}}! Please share your feedback: {{reviewLink}}',
    isActive: true,
    audienceSegmentFilter: 'ALL',
    respectConsent: true,
  });

  const [isSendDirectModalOpen, setIsSendDirectModalOpen] = React.useState(false);
  const [sendDirectData, setSendDirectData] = React.useState<SendMessagePayload>({
    recipientName: 'Priya Sharma',
    recipientPhone: '+91 98765 43210',
    recipientEmail: '',
    messageType: 'APPOINTMENT_REMINDER',
    channel: 'WHATSAPP',
    messageContent:
      'Hi Priya Sharma, your upcoming appointment at Hive Salon Jubilee Hills is in 2 hours at 02:30 PM. See you soon!',
    customerId: 'c1',
  });

  const [isSubmitReviewModalOpen, setIsSubmitReviewModalOpen] = React.useState(false);
  const [newReviewData, setNewReviewData] = React.useState<SubmitReviewPayload>({
    customerId: 'c1',
    overallRating: 5,
    staffRating: 5,
    serviceRating: 5,
    ambienceRating: 5,
    comment: '',
    stylistName: 'Ananya Sen',
    serviceName: 'Balayage Styling',
    source: 'WHATSAPP_LINK',
  });

  const [isResolveComplaintModalOpen, setIsResolveComplaintModalOpen] = React.useState(false);
  const [selectedComplaint, setSelectedComplaint] = React.useState<ComplaintTicketDto | null>(null);
  const [complaintResolveData, setComplaintResolveData] = React.useState<ResolveComplaintPayload>({
    ticketId: '',
    status: 'RESOLVED',
    assignedManagerName: 'Sarah Jenkins (Duty Manager)',
    compensationType: 'WALLET_CREDIT',
    compensationValue: 500,
    managerNotes: '',
    resolutionSummary: '',
  });

  const [isReplyReviewModalOpen, setIsReplyReviewModalOpen] = React.useState(false);
  const [selectedReviewForReply, setSelectedReviewForReply] = React.useState<CustomerReviewDto | null>(null);
  const [reviewReplyText, setReviewReplyText] = React.useState('');

  const [isEditConsentModalOpen, setIsEditConsentModalOpen] = React.useState(false);
  const [selectedConsent, setSelectedConsent] = React.useState<CommunicationPreferenceDto | null>(null);

  // ---------------------------------------------------------------------------
  // 3. HANDLERS
  // ---------------------------------------------------------------------------

  const handleCreateCampaign = () => {
    if (!newCampaignData.name || !newCampaignData.code || !newCampaignData.messageTemplate) {
      toast.warning('Please complete all required campaign fields.');
      return;
    }

    const seg = customerSegments.find((s) => s.segment === newCampaignData.audienceSegment);
    const audienceCount = seg ? seg.totalCustomers : 50;

    const newCampaign: MarketingCampaignDto = {
      id: `cmp-${Date.now()}`,
      organizationId: 'org_hive_demo',
      name: newCampaignData.name,
      code: newCampaignData.code.toUpperCase(),
      audienceSegment: newCampaignData.audienceSegment,
      channel: newCampaignData.channel,
      messageTemplate: newCampaignData.messageTemplate,
      discountCode: newCampaignData.discountCode,
      discountPercentage: newCampaignData.discountPercentage,
      scheduledAt: newCampaignData.scheduledAt,
      status: newCampaignData.scheduledAt ? 'SCHEDULED' : 'DRAFT',
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

    setCampaigns([newCampaign, ...campaigns]);
    setIsNewCampaignModalOpen(false);
    toast.success(`Campaign '${newCampaign.name}' created successfully.`);
  };

  const handleLaunchCampaign = (campaignId: string) => {
    const campaign = campaigns.find((c) => c.id === campaignId);
    if (!campaign) return;

    const totalAudience = campaign.totalAudience;
    const delivered = Math.round(totalAudience * 0.96);
    const read = Math.round(totalAudience * 0.78);
    const clicked = Math.round(totalAudience * 0.45);
    const converted = Math.round(totalAudience * 0.28);
    const revenue = converted * 3800;

    const updated = {
      ...campaign,
      status: 'COMPLETED' as const,
      totalSent: totalAudience,
      totalDelivered: delivered,
      totalRead: read,
      totalFailed: totalAudience - delivered,
      totalClicked: clicked,
      totalConverted: converted,
      revenueGenerated: revenue,
      updatedAt: new Date().toISOString(),
    };

    setCampaigns(campaigns.map((c) => (c.id === campaignId ? updated : c)));

    // Add to outbound message log
    const newLog: OutboundMessageDto = {
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
      messageContent: campaign.messageTemplate
        .replace('{{customerName}}', 'Valued Guest')
        .replace('{{branchName}}', 'Jubilee Hills')
        .replace('{{discountCode}}', campaign.discountCode || 'PROMO')
        .replace('{{bookingLink}}', 'https://hive.salon/b/vip'),
      status: 'DELIVERED',
      sentAt: new Date().toISOString(),
      deliveredAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    setMessages([newLog, ...messages]);
    toast.success(`Campaign '${campaign.name}' broadcasted to ${totalAudience} clients!`);
  };

  const handleToggleAutomation = (ruleId: string) => {
    setAutomationRules(
      automationRules.map((rule) => {
        if (rule.id === ruleId) {
          const updatedState = !rule.isActive;
          toast.info(
            `Automation '${rule.name}' is now ${updatedState ? 'ACTIVE' : 'PAUSED'}.`
          );
          return { ...rule, isActive: updatedState, updatedAt: new Date().toISOString() };
        }
        return rule;
      })
    );
  };

  const handleTestTriggerSimulation = (rule: AutomationRuleDto) => {
    const newLog: OutboundMessageDto = {
      id: `msg-${Date.now()}`,
      organizationId: 'org_hive_demo',
      workflowRuleId: rule.id,
      messageType:
        rule.triggerEvent === 'APPOINTMENT_BOOKED'
          ? 'APPOINTMENT_CONFIRMATION'
          : rule.triggerEvent === 'PAYMENT_COMPLETED'
          ? 'INVOICE_RECEIPT'
          : rule.triggerEvent === 'APPOINTMENT_COMPLETED'
          ? 'REVIEW_REQUEST'
          : rule.triggerEvent === 'MEMBERSHIP_EXPIRING'
          ? 'MEMBERSHIP_EXPIRY'
          : rule.triggerEvent === 'BIRTHDAY'
          ? 'BIRTHDAY_GREETING'
          : 'WIN_BACK',
      channel: rule.channel,
      providerName:
        rule.channel === 'WHATSAPP'
          ? 'WHATSAPP_CLOUD_API'
          : rule.channel === 'EMAIL'
          ? 'RESEND_EMAIL_GATEWAY'
          : 'MSG91_SMS_GATEWAY',
      providerMessageId: `wamid.sim_${Date.now()}`,
      recipientPhone: '+91 98765 43210',
      recipientName: 'Priya Sharma (Simulated)',
      messageContent: rule.templateBody
        .replace('{{customerName}}', 'Priya Sharma')
        .replace('{{branchName}}', 'Jubilee Hills')
        .replace('{{serviceName}}', 'Hair Spa Ritual')
        .replace('{{stylistName}}', 'Ananya Sen')
        .replace('{{appointmentDate}}', '10-Sep-2026')
        .replace('{{appointmentTime}}', '03:00 PM')
        .replace('{{paymentAmount}}', '₹3,540')
        .replace('{{invoiceNumber}}', 'INV-2026-104')
        .replace('{{invoiceLink}}', 'https://hive.salon/inv/104')
        .replace('{{reviewLink}}', 'https://hive.salon/r/c1-rev')
        .replace('{{renewalLink}}', 'https://hive.salon/renew/dia')
        .replace('{{birthdayLink}}', 'https://hive.salon/bday/gift')
        .replace('{{bookingLink}}', 'https://hive.salon/b/quick'),
      status: 'DELIVERED',
      sentAt: new Date().toISOString(),
      deliveredAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    setMessages([newLog, ...messages]);
    setAutomationRules(
      automationRules.map((r) =>
        r.id === rule.id ? { ...r, totalTriggered: r.totalTriggered + 1 } : r
      )
    );
    toast.success(`Event '${rule.triggerEvent}' triggered! Dispatch verified via ${rule.channel}.`);
  };

  const handleSendDirectMessage = () => {
    if (!sendDirectData.recipientName || !sendDirectData.messageContent) {
      toast.warning('Recipient name and message content are required.');
      return;
    }

    // Consent Check Simulation
    const isBlocked =
      sendDirectData.customerId === 'c6' &&
      (sendDirectData.messageType === 'MARKETING_PROMOTION' || sendDirectData.messageType === 'WIN_BACK');

    const newMessage: OutboundMessageDto = {
      id: `msg-${Date.now()}`,
      organizationId: 'org_hive_demo',
      customerId: sendDirectData.customerId,
      messageType: sendDirectData.messageType,
      channel: sendDirectData.channel,
      providerName:
        sendDirectData.channel === 'WHATSAPP'
          ? 'WHATSAPP_CLOUD_API'
          : sendDirectData.channel === 'EMAIL'
          ? 'RESEND_EMAIL_GATEWAY'
          : 'MSG91_SMS_GATEWAY',
      providerMessageId: isBlocked ? undefined : `prov-${Date.now()}`,
      recipientPhone: sendDirectData.recipientPhone,
      recipientEmail: sendDirectData.recipientEmail,
      recipientName: sendDirectData.recipientName,
      messageContent: sendDirectData.messageContent,
      status: isBlocked ? 'OPTED_OUT' : 'DELIVERED',
      errorMessage: isBlocked ? 'Blocked: Customer is in DND registry for marketing.' : undefined,
      sentAt: isBlocked ? undefined : new Date().toISOString(),
      deliveredAt: isBlocked ? undefined : new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    setMessages([newMessage, ...messages]);
    setIsSendDirectModalOpen(false);

    if (isBlocked) {
      toast.warning('Message blocked by Customer Consent Guardrail (DND Opt-Out).');
    } else {
      toast.success(`Message sent successfully to ${sendDirectData.recipientName}!`);
    }
  };

  const handleSubmitReview = () => {
    const isLowRating = newReviewData.overallRating <= 3;
    const reviewId = `rev-${Date.now()}`;
    let escalationTicketId: string | undefined = undefined;

    if (isLowRating) {
      escalationTicketId = `tkt-${Date.now()}`;
      const newTicket: ComplaintTicketDto = {
        id: escalationTicketId,
        organizationId: 'org_hive_demo',
        customerId: newReviewData.customerId,
        customerName: newReviewData.customerId === 'c1' ? 'Priya Sharma' : 'Guest Customer',
        customerPhone: '+91 98765 43210',
        reviewId,
        severity: newReviewData.overallRating <= 2 ? 'HIGH' : 'MEDIUM',
        rootCauseCategory: 'SERVICE_QUALITY',
        complaintDetails: newReviewData.comment || 'Low star rating received without specific comment.',
        assignedManagerName: 'Sarah Jenkins (Duty Manager)',
        status: 'OPEN',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setComplaintTickets([newTicket, ...complaintTickets]);
    }

    const reviewRecord: CustomerReviewDto = {
      id: reviewId,
      organizationId: 'org_hive_demo',
      customerId: newReviewData.customerId,
      customerName: newReviewData.customerId === 'c1' ? 'Priya Sharma' : 'Guest Customer',
      customerPhone: '+91 98765 43210',
      overallRating: newReviewData.overallRating,
      staffRating: newReviewData.staffRating || newReviewData.overallRating,
      serviceRating: newReviewData.serviceRating || newReviewData.overallRating,
      ambienceRating: newReviewData.ambienceRating || newReviewData.overallRating,
      comment: newReviewData.comment,
      stylistName: newReviewData.stylistName,
      serviceName: newReviewData.serviceName,
      csatScore: newReviewData.overallRating * 20,
      source: newReviewData.source || 'WHATSAPP_LINK',
      isEscalated: isLowRating,
      escalationTicketId,
      isPublic: !isLowRating,
      createdAt: new Date().toISOString(),
    };

    setReviews([reviewRecord, ...reviews]);
    setIsSubmitReviewModalOpen(false);

    if (isLowRating) {
      toast.warning(
        `Low rating (${newReviewData.overallRating}★) recorded. Escalation Ticket #${escalationTicketId} automatically generated!`
      );
    } else {
      toast.success(`Thank you! 5-star review from ${reviewRecord.customerName} published.`);
    }
  };

  const handleResolveComplaint = () => {
    if (!selectedComplaint) return;

    setComplaintTickets(
      complaintTickets.map((tkt) => {
        if (tkt.id === selectedComplaint.id) {
          return {
            ...tkt,
            status: complaintResolveData.status,
            assignedManagerName: complaintResolveData.assignedManagerName,
            compensationType: complaintResolveData.compensationType,
            compensationValue: complaintResolveData.compensationValue,
            managerNotes: complaintResolveData.managerNotes,
            resolutionSummary: complaintResolveData.resolutionSummary,
            resolvedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        }
        return tkt;
      })
    );

    setIsResolveComplaintModalOpen(false);
    toast.success(`Complaint #${selectedComplaint.id} marked as ${complaintResolveData.status}.`);
  };

  const handlePostReviewReply = () => {
    if (!selectedReviewForReply || !reviewReplyText) {
      toast.warning('Please enter a response message.');
      return;
    }

    setReviews(
      reviews.map((r) => {
        if (r.id === selectedReviewForReply.id) {
          return {
            ...r,
            publicResponse: reviewReplyText,
            respondedAt: new Date().toISOString(),
          };
        }
        return r;
      })
    );

    setIsReplyReviewModalOpen(false);
    setReviewReplyText('');
    toast.success('Public response published successfully.');
  };

  const handleSaveConsent = () => {
    if (!selectedConsent) return;

    setConsentPreferences(
      consentPreferences.map((p) =>
        p.id === selectedConsent.id ? { ...selectedConsent, updatedAt: new Date().toISOString() } : p
      )
    );

    setIsEditConsentModalOpen(false);
    toast.success(`Consent preferences updated for ${selectedConsent.customerName}.`);
  };

  // Helper tag inserter for campaign template
  const handleInsertMergeTag = (tag: string) => {
    setNewCampaignData({
      ...newCampaignData,
      messageTemplate: `${newCampaignData.messageTemplate} {{${tag}}} `,
    });
  };

  // Overall CSAT Score calculation
  const totalReviewsCount = reviews.length;
  const avgOverallRating = totalReviewsCount
    ? (reviews.reduce((acc, r) => acc + r.overallRating, 0) / totalReviewsCount).toFixed(1)
    : '5.0';
  const avgCsatScore = totalReviewsCount
    ? Math.round(reviews.reduce((acc, r) => acc + (r.csatScore || 100), 0) / totalReviewsCount)
    : 100;
  const fiveStarReviewsCount = reviews.filter((r) => r.overallRating === 5).length;
  const escalatedTicketsCount = complaintTickets.filter((t) => t.status === 'OPEN' || t.status === 'INVESTIGATING').length;

  return (
    <div className="space-y-6 pb-16">
      {/* --------------------------------------------------------------------- */}
      {/* TOP HEADER & ENTERPRISE ACTIONS                                       */}
      {/* --------------------------------------------------------------------- */}
      <PageHeader
        title="Marketing Automation, Communication & Reviews"
        description="Phase 12: Decoupled Provider Abstraction (WhatsApp, SMS, Email), 12 Message Types, 7 Event Automations, Dynamic Audiences, CSAT Intelligence, and Low-Rating Escalation Engine."
        badge={
          <Badge variant="default">
            Phase 12 Active
          </Badge>
        }
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSendDirectData({
                  recipientName: 'Priya Sharma',
                  recipientPhone: '+91 98765 43210',
                  recipientEmail: 'priya.sharma@example.com',
                  messageType: 'APPOINTMENT_REMINDER',
                  channel: 'WHATSAPP',
                  messageContent:
                    'Hi Priya Sharma, your styling session with Ananya Sen at Hive Salon Jubilee Hills is scheduled for 02:30 PM. See you soon!',
                  customerId: 'c1',
                });
                setIsSendDirectModalOpen(true);
              }}
            >
              <Send className="mr-2 h-4 w-4 text-emerald-600" />
              Direct Message Dispatch
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setNewReviewData({
                  customerId: 'c1',
                  overallRating: 5,
                  staffRating: 5,
                  serviceRating: 5,
                  ambienceRating: 5,
                  comment: 'Exceptional haircut and head massage!',
                  stylistName: 'Ananya Sen',
                  serviceName: 'Signature Haircut & Spa',
                  source: 'WHATSAPP_LINK',
                });
                setIsSubmitReviewModalOpen(true);
              }}
            >
              <Star className="mr-2 h-4 w-4 text-amber-500 fill-amber-500" />
              Simulate CSAT Feedback
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setNewCampaignData({
                  name: '',
                  code: `CMP-${Date.now().toString().slice(-4)}`,
                  audienceSegment: 'VIP',
                  channel: 'WHATSAPP',
                  messageTemplate:
                    'Dear {{customerName}}, celebrate festive beauty with Hive Salon {{branchName}}! Enjoy 20% off with code {{discountCode}}. Book: {{bookingLink}}',
                  discountCode: 'FESTIVE20',
                  discountPercentage: 20,
                  scheduledAt: '',
                });
                setIsNewCampaignModalOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Campaign Broadcast
            </Button>
          </div>
        }
      />

      {/* --------------------------------------------------------------------- */}
      {/* 4 HIGH-LEVEL KPI METRIC CARDS                                         */}
      {/* --------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              CSAT Score & Rating
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600">
              <Star className="h-5 w-5 fill-amber-500" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">
                {avgOverallRating}★
              </span>
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                {avgCsatScore}% CSAT
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {fiveStarReviewsCount} of {totalReviewsCount} reviews are 5-Stars
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Campaign Revenue
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(
                  campaigns.reduce((acc, c) => acc + (c.revenueGenerated || 0), 0)
                )}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Generated across {campaigns.filter((c) => c.status === 'COMPLETED').length} completed campaigns
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active Automations
            </span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600">
              <Zap className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">
                {automationRules.filter((r) => r.isActive).length} / {automationRules.length}
              </span>
              <span className="text-xs font-semibold text-purple-600 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded-full">
                7 Triggers
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {automationRules.reduce((acc, r) => acc + r.totalTriggered, 0)} total automated dispatches
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Escalation Tickets (≤3★)
            </span>
            <div
              className={`p-2 rounded-xl ${
                escalatedTicketsCount > 0
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 animate-pulse'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-400'
              }`}
            >
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">
                {escalatedTicketsCount}
              </span>
              <span className="text-xs font-medium text-rose-600 dark:text-rose-400">
                Pending Manager Action
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Zero-drop complaint resolution protocol
            </p>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* 7 PRIMARY WORKFLOW NAVIGATION TABS                                    */}
      {/* --------------------------------------------------------------------- */}
      <div className="flex overflow-x-auto no-scrollbar border-b border-slate-200 dark:border-slate-800 gap-2">
        <button
          onClick={() => setActiveTab('CAMPAIGNS')}
          className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'CAMPAIGNS'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Megaphone className="h-4 w-4" />
          Marketing Campaigns ({campaigns.length})
        </button>

        <button
          onClick={() => setActiveTab('AUTOMATIONS')}
          className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'AUTOMATIONS'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Zap className="h-4 w-4" />
          Automation Workflows ({automationRules.length})
        </button>

        <button
          onClick={() => setActiveTab('SEGMENTS')}
          className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'SEGMENTS'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Users className="h-4 w-4" />
          Audience Segments (7)
        </button>

        <button
          onClick={() => setActiveTab('QUEUE')}
          className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'QUEUE'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Send className="h-4 w-4" />
          Outbound Message Queue ({messages.length})
        </button>

        <button
          onClick={() => setActiveTab('REVIEWS')}
          className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'REVIEWS'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Star className="h-4 w-4 fill-current" />
          Reviews & CSAT Hub ({reviews.length})
        </button>

        <button
          onClick={() => setActiveTab('COMPLAINTS')}
          className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'COMPLAINTS'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="h-4 w-4" />
          Escalations & Complaints ({complaintTickets.length})
          {escalatedTicketsCount > 0 && (
            <span className="ml-1 px-1.5 py-0.2 text-xs rounded-full bg-rose-500 text-white font-bold">
              {escalatedTicketsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('CONSENT')}
          className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'CONSENT'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          Providers & Consent Registry
        </button>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* TAB 1: MARKETING CAMPAIGNS                                            */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'CAMPAIGNS' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Broadcast & Scheduled Campaigns
              </h2>
              <p className="text-sm text-slate-500">
                Create targeted omnichannel promotions with dynamic discount codes and track conversion ROI.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="DRAFT">Drafts</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns
              .filter((c) => statusFilter === 'ALL' || c.status === statusFilter)
              .map((campaign) => (
                <div
                  key={campaign.id}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-all hover:shadow-md"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={
                          campaign.channel === 'WHATSAPP'
                            ? 'success'
                            : campaign.channel === 'SMS'
                            ? 'info'
                            : 'secondary'
                        }
                      >
                        {campaign.channel === 'WHATSAPP' && <Smartphone className="h-3 w-3 mr-1" />}
                        {campaign.channel === 'SMS' && <MessageSquare className="h-3 w-3 mr-1" />}
                        {campaign.channel === 'EMAIL' && <Mail className="h-3 w-3 mr-1" />}
                        {campaign.channel}
                      </Badge>
                      <Badge
                        variant={
                          campaign.status === 'COMPLETED'
                            ? 'success'
                            : campaign.status === 'SCHEDULED'
                            ? 'warning'
                            : 'secondary'
                        }
                      >
                        {campaign.status}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {campaign.name}
                      </h3>
                      <p className="text-xs font-mono text-slate-500 mt-0.5">
                        Code: {campaign.code} • Audience: {campaign.audienceSegment}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans line-clamp-3">
                      "{campaign.messageTemplate}"
                    </div>

                    {campaign.discountCode && (
                      <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-medium">
                        <span>Promo Code: <strong className="font-mono">{campaign.discountCode}</strong></span>
                        <span>{campaign.discountPercentage}% OFF</span>
                      </div>
                    )}

                    {/* Funnel Metrics for Completed Campaigns */}
                    {campaign.status === 'COMPLETED' ? (
                      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>Delivery Funnel</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {campaign.totalDelivered} / {campaign.totalAudience} Delivered
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80">
                            <span className="text-slate-400 block text-[10px] uppercase">Read Rate</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              {Math.round((campaign.totalRead / (campaign.totalDelivered || 1)) * 100)}%
                            </span>
                          </div>
                          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80">
                            <span className="text-slate-400 block text-[10px] uppercase">Clicks</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              {campaign.totalClicked}
                            </span>
                          </div>
                          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                            <span className="block text-[10px] uppercase font-semibold">Bookings</span>
                            <span className="font-bold">
                              {campaign.totalConverted} ({formatCurrency(campaign.revenueGenerated)})
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span>Target Audience:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {campaign.totalAudience} Opted-In Clients
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                    {campaign.status !== 'COMPLETED' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleLaunchCampaign(campaign.id)}
                      >
                        <Send className="mr-1.5 h-3.5 w-3.5" />
                        Launch Broadcast
                      </Button>
                    )}
                    {campaign.status === 'COMPLETED' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLaunchCampaign(campaign.id)}
                      >
                        <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                        Re-Blast Campaign
                      </Button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 2: AUTOMATION WORKFLOWS                                           */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'AUTOMATIONS' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Automated Trigger Rules (7 Triggers)
              </h2>
              <p className="text-sm text-slate-500">
                Real-time event triggers deliver transactional alerts, review requests, and lifecycle re-engagement.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setNewRuleData({
                  name: '',
                  triggerEvent: 'APPOINTMENT_BOOKED',
                  channel: 'WHATSAPP',
                  delayMinutes: 0,
                  templateBody:
                    'Hello {{customerName}}, your booking at Hive Salon {{branchName}} is confirmed! Link: {{bookingLink}}',
                  isActive: true,
                  audienceSegmentFilter: 'ALL',
                  respectConsent: true,
                });
                setIsNewRuleModalOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Custom Workflow
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {automationRules.map((rule) => (
              <div
                key={rule.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono">
                        {rule.triggerEvent}
                      </span>
                      <Badge variant={rule.channel === 'WHATSAPP' ? 'success' : 'info'}>
                        {rule.channel}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-500">
                        {rule.isActive ? 'Active' : 'Disabled'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleAutomation(rule.id)}
                        className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${
                          rule.isActive ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                            rule.isActive ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {rule.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Delay: {rule.delayMinutes === 0 ? 'Instant (0m)' : `${rule.delayMinutes} mins`} • Respects Consent: {rule.respectConsent ? 'Yes (Strict)' : 'No (Transactional)'}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-sans leading-relaxed">
                    "{rule.templateBody}"
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <span>Total Dispatches: <strong className="text-slate-800 dark:text-slate-200 font-mono">{rule.totalTriggered}</strong></span>
                    <span>Audience Filter: <strong>{rule.audienceSegmentFilter || 'ALL'}</strong></span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTestTriggerSimulation(rule)}
                  >
                    <Zap className="mr-1.5 h-3.5 w-3.5 text-amber-500" />
                    Simulate Trigger Event
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 3: AUDIENCE SEGMENTS                                              */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'SEGMENTS' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Dynamic Customer Segmentation Hub
            </h2>
            <p className="text-sm text-slate-500">
              Targeted segment builder analyzing recency, frequency, lifetime value (LTV), and membership tiers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {customerSegments.map((segment) => (
              <div
                key={segment.segment}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-all hover:border-indigo-200"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className="px-3 py-1 text-xs font-bold rounded-full text-white uppercase tracking-wider"
                      style={{ backgroundColor: segment.color }}
                    >
                      {segment.segment}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      Avg: {formatCurrency(segment.averageSpend)}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {segment.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {segment.description}
                  </p>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Segment Size:</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {segment.totalCustomers} Opted-In Clients
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-center"
                    onClick={() => {
                      setNewCampaignData({
                        name: `${segment.segment} Exclusive Privilege Offer`,
                        code: `CMP-${segment.segment}-${Date.now().toString().slice(-3)}`,
                        audienceSegment: segment.segment,
                        channel: 'WHATSAPP',
                        messageTemplate: `Dear {{customerName}}, as our valued ${segment.segment} guest, enjoy special savings at Hive Salon {{branchName}}! Code: {{discountCode}}. Book: {{bookingLink}}`,
                        discountCode: `${segment.segment}SAVE`,
                        discountPercentage: 20,
                        scheduledAt: '',
                      });
                      setIsNewCampaignModalOpen(true);
                    }}
                  >
                    <Megaphone className="mr-1.5 h-3.5 w-3.5 text-indigo-600" />
                    Quick Campaign Blast
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 4: OUTBOUND MESSAGE QUEUE                                         */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'QUEUE' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Outbound Message Dispatch Ledger
              </h2>
              <p className="text-sm text-slate-500">
                Live delivery status tracking across WhatsApp Cloud API, MSG91 SMS, and Resend Email.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value as any)}
              >
                <option value="ALL">All Channels</option>
                <option value="WHATSAPP">WhatsApp</option>
                <option value="SMS">SMS</option>
                <option value="EMAIL">Email</option>
              </select>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/70 text-xs uppercase font-semibold text-slate-500 tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Recipient & Channel</th>
                    <th className="px-5 py-3.5">Message Type</th>
                    <th className="px-5 py-3.5">Provider & Message Content</th>
                    <th className="px-5 py-3.5">Delivery Status</th>
                    <th className="px-5 py-3.5 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {messages
                    .filter((m) => channelFilter === 'ALL' || m.channel === channelFilter)
                    .map((msg) => (
                      <tr key={msg.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-5 py-4">
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {msg.recipientName}
                          </div>
                          <div className="text-xs text-slate-500 font-mono mt-0.5 flex items-center gap-1.5">
                            {msg.channel === 'WHATSAPP' && <Smartphone className="h-3 w-3 text-emerald-600" />}
                            {msg.channel === 'SMS' && <MessageSquare className="h-3 w-3 text-sky-600" />}
                            {msg.channel === 'EMAIL' && <Mail className="h-3 w-3 text-purple-600" />}
                            {msg.recipientPhone || msg.recipientEmail}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <Badge variant="info">
                            {msg.messageType}
                          </Badge>
                        </td>
                        <td className="px-5 py-4 max-w-md">
                          <span className="text-[11px] font-mono text-slate-400 block mb-0.5">
                            Provider: {msg.providerName}
                          </span>
                          <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2">
                            {msg.messageContent}
                          </p>
                          {msg.errorMessage && (
                            <span className="text-xs text-rose-600 font-medium block mt-1">
                              {msg.errorMessage}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <Badge
                            variant={
                              msg.status === 'READ' || msg.status === 'DELIVERED'
                                ? 'success'
                                : msg.status === 'SENT' || msg.status === 'QUEUED'
                                ? 'warning'
                                : msg.status === 'OPTED_OUT'
                                ? 'secondary'
                                : 'destructive'
                            }
                          >
                            {msg.status === 'READ' && <Eye className="h-3 w-3 mr-1" />}
                            {msg.status === 'DELIVERED' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {msg.status === 'OPTED_OUT' && <ShieldAlert className="h-3 w-3 mr-1" />}
                            {msg.status}
                          </Badge>
                        </td>
                        <td className="px-5 py-4 text-right text-xs text-slate-500 font-mono">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 5: REVIEWS & CSAT HUB                                             */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'REVIEWS' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Customer Reviews & CSAT Intelligence
              </h2>
              <p className="text-sm text-slate-500">
                Collect 5-star multi-dimensional feedback across Stylists, Services, and Ambience with instant manager replies.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setNewReviewData({
                  customerId: 'c1',
                  overallRating: 5,
                  staffRating: 5,
                  serviceRating: 5,
                  ambienceRating: 5,
                  comment: 'Best salon experience in Hyderabad!',
                  stylistName: 'Ananya Sen',
                  serviceName: 'Balayage & Hair Spa',
                  source: 'WHATSAPP_LINK',
                });
                setIsSubmitReviewModalOpen(true);
              }}
            >
              <Star className="mr-2 h-4 w-4 text-amber-500 fill-amber-500" />
              Simulate Customer Review
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`h-4 w-4 ${
                            s <= rev.overallRating ? 'fill-amber-500 text-amber-500' : 'text-slate-200 dark:text-slate-700'
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-sm font-bold text-slate-800 dark:text-white">
                        {rev.overallRating}.0
                      </span>
                    </div>
                    {rev.isEscalated ? (
                      <Badge variant="destructive">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Escalated to Manager
                      </Badge>
                    ) : (
                      <Badge variant="success">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Public 5★ Review
                      </Badge>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {rev.customerName}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Stylist: <strong className="text-slate-700 dark:text-slate-300">{rev.stylistName}</strong> • Service: {rev.serviceName}
                    </p>
                  </div>

                  {rev.comment && (
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-sans italic leading-relaxed">
                      "{rev.comment}"
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2 text-center text-xs py-1 text-slate-500">
                    <div>Staff: <strong className="text-slate-700 dark:text-slate-300">{rev.staffRating}★</strong></div>
                    <div>Service: <strong className="text-slate-700 dark:text-slate-300">{rev.serviceRating}★</strong></div>
                    <div>Ambience: <strong className="text-slate-700 dark:text-slate-300">{rev.ambienceRating}★</strong></div>
                  </div>

                  {rev.publicResponse && (
                    <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-200">
                      <span className="font-semibold block mb-0.5">Manager Response:</span>
                      {rev.publicResponse}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Source: {rev.source}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedReviewForReply(rev);
                      setReviewReplyText(rev.publicResponse || '');
                      setIsReplyReviewModalOpen(true);
                    }}
                  >
                    <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
                    {rev.publicResponse ? 'Edit Reply' : 'Reply as Manager'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 6: LOW-RATING COMPLAINT ESCALATION BOARD                          */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'COMPLAINTS' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                Zero-Drop Escalation Protocol Active
              </h3>
              <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
                Any customer rating of ≤3 stars immediately triggers a high-priority complaint ticket assigned to the Branch Manager on duty. Negative reviews are withheld from public listings until client resolution is verified.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {complaintTickets.map((tkt) => (
              <div
                key={tkt.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-500">
                      Ticket #{tkt.id}
                    </span>
                    <Badge
                      variant={
                        tkt.status === 'RESOLVED' || tkt.status === 'CLOSED'
                          ? 'success'
                          : tkt.status === 'INVESTIGATING'
                          ? 'warning'
                          : 'destructive'
                      }
                    >
                      {tkt.status}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {tkt.customerName}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">{tkt.customerPhone}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 text-[11px] font-bold rounded ${
                        tkt.severity === 'HIGH'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {tkt.severity} SEVERITY
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      Cause: {tkt.rootCauseCategory}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 font-sans leading-relaxed">
                    {tkt.complaintDetails}
                  </div>

                  {tkt.managerNotes && (
                    <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400">
                      <strong>Manager Notes:</strong> {tkt.managerNotes}
                    </div>
                  )}

                  {tkt.resolutionSummary && (
                    <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-xs text-emerald-800 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900">
                      <strong>Resolution:</strong> {tkt.resolutionSummary} (
                      {tkt.compensationType}: {formatCurrency(tkt.compensationValue || 0)})
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
                  {tkt.status !== 'RESOLVED' && tkt.status !== 'CLOSED' ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setSelectedComplaint(tkt);
                        setComplaintResolveData({
                          ticketId: tkt.id,
                          status: 'RESOLVED',
                          assignedManagerName: 'Sarah Jenkins (Duty Manager)',
                          compensationType: 'WALLET_CREDIT',
                          compensationValue: 500,
                          managerNotes: tkt.managerNotes || '',
                          resolutionSummary: '',
                        });
                        setIsResolveComplaintModalOpen(true);
                      }}
                    >
                      <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                      Resolve & Compensate
                    </Button>
                  ) : (
                    <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" /> Resolved by Manager
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 7: PROVIDER ABSTRACTION & CONSENT REGISTRY                        */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'CONSENT' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Provider Abstraction & Customer DND Consent Engine
            </h2>
            <p className="text-sm text-slate-500">
              Strict communication preferences prevent unsolicited marketing while ensuring guaranteed transactional delivery.
            </p>
          </div>

          {/* Provider Adapters Health Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-emerald-600" />
                  <span className="font-bold text-slate-900 dark:text-white">WhatsApp Cloud API</span>
                </div>
                <Badge variant="success">ONLINE</Badge>
              </div>
              <p className="text-xs text-slate-500">
                Official Meta Business Platform Gateway. Direct template syncing, read receipts, and interactive quick replies.
              </p>
              <div className="text-xs text-slate-400 font-mono">
                Latency: 180ms • Uptime: 99.98%
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-sky-600" />
                  <span className="font-bold text-slate-900 dark:text-white">MSG91 SMS Gateway</span>
                </div>
                <Badge variant="success">ONLINE</Badge>
              </div>
              <p className="text-xs text-slate-500">
                Telecom regulatory DLT Principal Entity approved. 100% transactional delivery rate across Indian operators.
              </p>
              <div className="text-xs text-slate-400 font-mono">
                DLT ID: 17011593829 • Delivery: 99.1%
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-purple-600" />
                  <span className="font-bold text-slate-900 dark:text-white">Resend Email Gateway</span>
                </div>
                <Badge variant="success">ONLINE</Badge>
              </div>
              <p className="text-xs text-slate-500">
                DKIM & SPF verified enterprise email engine for invoices, receipts, and membership statements.
              </p>
              <div className="text-xs text-slate-400 font-mono">
                Sender: receipts@hive.salon • Bounce: 0.1%
              </div>
            </div>
          </div>

          {/* Consent Preferences Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white">
                Customer Consent & DND Opt-Out Registry
              </h3>
              <span className="text-xs text-slate-500">
                Guardrail checks execute before external provider API calls
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/70 text-xs uppercase font-semibold text-slate-500 tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Customer</th>
                    <th className="px-5 py-3.5">WhatsApp Mkt</th>
                    <th className="px-5 py-3.5">SMS Mkt</th>
                    <th className="px-5 py-3.5">Email Mkt</th>
                    <th className="px-5 py-3.5">Transactional</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {consentPreferences.map((pref) => (
                    <tr key={pref.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {pref.customerName}
                        </div>
                        <div className="text-xs text-slate-500 font-mono">{pref.customerPhone}</div>
                        {pref.optOutReason && (
                          <span className="text-[11px] text-rose-500 block mt-0.5">
                            {pref.optOutReason}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={pref.allowMarketingWhatsapp ? 'success' : 'destructive'}>
                          {pref.allowMarketingWhatsapp ? 'Allowed' : 'Opted-Out'}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={pref.allowMarketingSms ? 'success' : 'destructive'}>
                          {pref.allowMarketingSms ? 'Allowed' : 'Opted-Out'}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={pref.allowMarketingEmail ? 'success' : 'destructive'}>
                          {pref.allowMarketingEmail ? 'Allowed' : 'Opted-Out'}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant="success">
                          Guaranteed
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedConsent(pref);
                            setIsEditConsentModalOpen(true);
                          }}
                        >
                          <Sliders className="mr-1 h-3 w-3" />
                          Update Consent
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

      {/* --------------------------------------------------------------------- */}
      {/* MODAL 1: CREATE NEW CAMPAIGN BROADCAST                                */}
      {/* --------------------------------------------------------------------- */}
      <Modal
        isOpen={isNewCampaignModalOpen}
        onClose={() => setIsNewCampaignModalOpen(false)}
        title="Create Marketing Campaign Broadcast"
        description="Broadcast tailored promotional offers to customer segments with merge tag substitution."
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Campaign Name *
            </label>
            <Input
              placeholder="e.g. Festive Diwali Radiant Glow Flash Sale"
              value={newCampaignData.name}
              onChange={(e) => setNewCampaignData({ ...newCampaignData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Campaign Code *
              </label>
              <Input
                placeholder="CMP-DIWALI-2026"
                value={newCampaignData.code}
                onChange={(e) => setNewCampaignData({ ...newCampaignData, code: e.target.value.toUpperCase() })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Audience Segment *
              </label>
              <select
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                value={newCampaignData.audienceSegment}
                onChange={(e) => setNewCampaignData({ ...newCampaignData, audienceSegment: e.target.value as any })}
              >
                <option value="VIP">VIP & High Value (120 Clients)</option>
                <option value="RETURNING">Returning Regulars (240 Clients)</option>
                <option value="MEMBERSHIP">Membership Pass Holders (142 Clients)</option>
                <option value="INACTIVE">Inactive (60+ Days) (65 Clients)</option>
                <option value="NEW">New Walk-Ins & Leads (54 Clients)</option>
                <option value="FREQUENT">Bi-Weekly Regulars (88 Clients)</option>
                <option value="ALL">All Opted-In Clients (709 Clients)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Channel
              </label>
              <select
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                value={newCampaignData.channel}
                onChange={(e) => setNewCampaignData({ ...newCampaignData, channel: e.target.value as any })}
              >
                <option value="WHATSAPP">WhatsApp Cloud</option>
                <option value="SMS">SMS Gateway</option>
                <option value="EMAIL">Email</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Promo Code
              </label>
              <Input
                placeholder="DIWALI25"
                value={newCampaignData.discountCode || ''}
                onChange={(e) => setNewCampaignData({ ...newCampaignData, discountCode: e.target.value.toUpperCase() })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Discount %
              </label>
              <Input
                type="number"
                placeholder="25"
                value={newCampaignData.discountPercentage?.toString() || '20'}
                onChange={(e) => setNewCampaignData({ ...newCampaignData, discountPercentage: Number(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Message Body Template *
              </label>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-400">Insert tag:</span>
                <button
                  type="button"
                  onClick={() => handleInsertMergeTag('customerName')}
                  className="px-1.5 py-0.5 text-[10px] bg-slate-100 dark:bg-slate-800 rounded text-slate-600 hover:text-indigo-600"
                >
                  +name
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertMergeTag('discountCode')}
                  className="px-1.5 py-0.5 text-[10px] bg-slate-100 dark:bg-slate-800 rounded text-slate-600 hover:text-indigo-600"
                >
                  +code
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertMergeTag('bookingLink')}
                  className="px-1.5 py-0.5 text-[10px] bg-slate-100 dark:bg-slate-800 rounded text-slate-600 hover:text-indigo-600"
                >
                  +link
                </button>
              </div>
            </div>
            <textarea
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white h-24"
              value={newCampaignData.messageTemplate}
              onChange={(e) => setNewCampaignData({ ...newCampaignData, messageTemplate: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" onClick={() => setIsNewCampaignModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateCampaign}>
              Save Campaign Broadcast
            </Button>
          </div>
        </div>
      </Modal>

      {/* --------------------------------------------------------------------- */}
      {/* MODAL 2: ADD AUTOMATION WORKFLOW RULE                                 */}
      {/* --------------------------------------------------------------------- */}
      <Modal
        isOpen={isNewRuleModalOpen}
        onClose={() => setIsNewRuleModalOpen(false)}
        title="Add Automation Workflow Rule"
        description="Configure event triggers with delay offsets and templated notification payloads."
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Workflow Name *
            </label>
            <Input
              placeholder="e.g. VIP Birthday Pamper Alert"
              value={newRuleData.name}
              onChange={(e) => setNewRuleData({ ...newRuleData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Trigger Event *
              </label>
              <select
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                value={newRuleData.triggerEvent}
                onChange={(e) => setNewRuleData({ ...newRuleData, triggerEvent: e.target.value as any })}
              >
                <option value="APPOINTMENT_BOOKED">APPOINTMENT_BOOKED</option>
                <option value="APPOINTMENT_COMPLETED">APPOINTMENT_COMPLETED</option>
                <option value="PAYMENT_COMPLETED">PAYMENT_COMPLETED</option>
                <option value="MEMBERSHIP_EXPIRING">MEMBERSHIP_EXPIRING</option>
                <option value="CUSTOMER_INACTIVE_60D">CUSTOMER_INACTIVE_60D</option>
                <option value="BIRTHDAY">BIRTHDAY</option>
                <option value="ANNIVERSARY">ANNIVERSARY</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Channel *
              </label>
              <select
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                value={newRuleData.channel}
                onChange={(e) => setNewRuleData({ ...newRuleData, channel: e.target.value as any })}
              >
                <option value="WHATSAPP">WhatsApp Cloud API</option>
                <option value="SMS">MSG91 SMS Gateway</option>
                <option value="EMAIL">Resend Email</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Delay Offset (Minutes)
              </label>
              <Input
                type="number"
                placeholder="30"
                value={newRuleData.delayMinutes.toString()}
                onChange={(e) => setNewRuleData({ ...newRuleData, delayMinutes: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Audience Filter
              </label>
              <select
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                value={newRuleData.audienceSegmentFilter || 'ALL'}
                onChange={(e) => setNewRuleData({ ...newRuleData, audienceSegmentFilter: e.target.value as any })}
              >
                <option value="ALL">All Clients</option>
                <option value="VIP">VIP Clients Only</option>
                <option value="MEMBERSHIP">Membership Holders Only</option>
                <option value="INACTIVE">Inactive Clients Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Template Body
            </label>
            <textarea
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white h-20"
              value={newRuleData.templateBody}
              onChange={(e) => setNewRuleData({ ...newRuleData, templateBody: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" onClick={() => setIsNewRuleModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (!newRuleData.name || !newRuleData.templateBody) {
                  toast.warning('Please enter rule name and template body.');
                  return;
                }
                const newRule: AutomationRuleDto = {
                  id: `rule-${Date.now()}`,
                  organizationId: 'org_hive_demo',
                  name: newRuleData.name,
                  triggerEvent: newRuleData.triggerEvent,
                  channel: newRuleData.channel,
                  delayMinutes: newRuleData.delayMinutes,
                  templateBody: newRuleData.templateBody,
                  isActive: true,
                  audienceSegmentFilter: newRuleData.audienceSegmentFilter || 'ALL',
                  respectConsent: newRuleData.respectConsent ?? true,
                  totalTriggered: 0,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                };
                setAutomationRules([...automationRules, newRule]);
                setIsNewRuleModalOpen(false);
                toast.success(`Workflow '${newRule.name}' added.`);
              }}
            >
              Save Workflow Rule
            </Button>
          </div>
        </div>
      </Modal>

      {/* --------------------------------------------------------------------- */}
      {/* MODAL 3: DIRECT MESSAGE DISPATCH                                      */}
      {/* --------------------------------------------------------------------- */}
      <Modal
        isOpen={isSendDirectModalOpen}
        onClose={() => setIsSendDirectModalOpen(false)}
        title="Direct Single Message Dispatch"
        description="Dispatch single transactional or promotional message with real-time consent verification."
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Recipient Name *
              </label>
              <Input
                placeholder="Priya Sharma"
                value={sendDirectData.recipientName}
                onChange={(e) => setSendDirectData({ ...sendDirectData, recipientName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Recipient Mobile / Email *
              </label>
              <Input
                placeholder="+91 98765 43210"
                value={sendDirectData.recipientPhone || ''}
                onChange={(e) => setSendDirectData({ ...sendDirectData, recipientPhone: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Channel
              </label>
              <select
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                value={sendDirectData.channel}
                onChange={(e) => setSendDirectData({ ...sendDirectData, channel: e.target.value as any })}
              >
                <option value="WHATSAPP">WhatsApp Cloud</option>
                <option value="SMS">MSG91 SMS</option>
                <option value="EMAIL">Resend Email</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Message Type
              </label>
              <select
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                value={sendDirectData.messageType}
                onChange={(e) => setSendDirectData({ ...sendDirectData, messageType: e.target.value as any })}
              >
                <option value="APPOINTMENT_CONFIRMATION">Appointment Confirmation</option>
                <option value="APPOINTMENT_REMINDER">Appointment Reminder</option>
                <option value="INVOICE_RECEIPT">Invoice Receipt</option>
                <option value="PAYMENT_SUCCESS">Payment Success</option>
                <option value="REVIEW_REQUEST">Review Request</option>
                <option value="MEMBERSHIP_EXPIRY">Membership Expiry</option>
                <option value="MARKETING_PROMOTION">Marketing Promotion</option>
                <option value="WIN_BACK">Win-Back Offer</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Message Content *
            </label>
            <textarea
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white h-24"
              value={sendDirectData.messageContent}
              onChange={(e) => setSendDirectData({ ...sendDirectData, messageContent: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" onClick={() => setIsSendDirectModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSendDirectMessage}>
              <Send className="mr-1.5 h-3.5 w-3.5" />
              Dispatch Message
            </Button>
          </div>
        </div>
      </Modal>

      {/* --------------------------------------------------------------------- */}
      {/* MODAL 4: SIMULATE CSAT REVIEW SUBMISSION                              */}
      {/* --------------------------------------------------------------------- */}
      <Modal
        isOpen={isSubmitReviewModalOpen}
        onClose={() => setIsSubmitReviewModalOpen(false)}
        title="Simulate Customer CSAT Feedback"
        description="Submit guest rating (1-5★). Ratings ≤3★ automatically trigger high-priority manager escalation."
      >
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Overall Star Rating:
            </span>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewReviewData({ ...newReviewData, overallRating: star })}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= newReviewData.overallRating
                        ? 'fill-amber-500 text-amber-500'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}
                  />
                </button>
              ))}
              <span className="font-bold text-lg text-slate-900 dark:text-white ml-2">
                {newReviewData.overallRating}★
              </span>
            </div>
          </div>

          {newReviewData.overallRating <= 3 && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>
                <strong>Escalation Notice:</strong> Rating of {newReviewData.overallRating}★ will automatically create a Complaint Ticket for Duty Manager review.
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Stylist Name
              </label>
              <Input
                value={newReviewData.stylistName || 'Ananya Sen'}
                onChange={(e) => setNewReviewData({ ...newReviewData, stylistName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Service Name
              </label>
              <Input
                value={newReviewData.serviceName || 'Balayage & Styling'}
                onChange={(e) => setNewReviewData({ ...newReviewData, serviceName: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Guest Feedback & Comments
            </label>
            <textarea
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white h-20"
              placeholder="Share thoughts on service quality, wait time, or ambience..."
              value={newReviewData.comment || ''}
              onChange={(e) => setNewReviewData({ ...newReviewData, comment: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" onClick={() => setIsSubmitReviewModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmitReview}>
              Submit CSAT Review
            </Button>
          </div>
        </div>
      </Modal>

      {/* --------------------------------------------------------------------- */}
      {/* MODAL 5: RESOLVE COMPLAINT ESCALATION TICKET                          */}
      {/* --------------------------------------------------------------------- */}
      <Modal
        isOpen={isResolveComplaintModalOpen}
        onClose={() => setIsResolveComplaintModalOpen(false)}
        title={`Resolve Complaint Ticket #${selectedComplaint?.id}`}
        description={`Manage grievance for ${selectedComplaint?.customerName} (${selectedComplaint?.customerPhone})`}
      >
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300">
            <span className="font-semibold block text-slate-900 dark:text-white mb-0.5">
              Reported Issue:
            </span>
            {selectedComplaint?.complaintDetails}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Resolution Status *
              </label>
              <select
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                value={complaintResolveData.status}
                onChange={(e) => setComplaintResolveData({ ...complaintResolveData, status: e.target.value as any })}
              >
                <option value="INVESTIGATING">INVESTIGATING</option>
                <option value="CONTACTED_CLIENT">CONTACTED_CLIENT</option>
                <option value="COMPENSATION_OFFERED">COMPENSATION_OFFERED</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Duty Manager
              </label>
              <Input
                value={complaintResolveData.assignedManagerName || 'Sarah Jenkins'}
                onChange={(e) => setComplaintResolveData({ ...complaintResolveData, assignedManagerName: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Compensation Type
              </label>
              <select
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                value={complaintResolveData.compensationType || 'WALLET_CREDIT'}
                onChange={(e) => setComplaintResolveData({ ...complaintResolveData, compensationType: e.target.value })}
              >
                <option value="WALLET_CREDIT">Prepaid Wallet Credit (₹)</option>
                <option value="COMPLIMENTARY_SERVICE">Complimentary Service Voucher</option>
                <option value="PARTIAL_REFUND">Partial Invoice Refund</option>
                <option value="FULL_REFUND">Full Refund</option>
                <option value="APOLOGY_NOTE">Formal Manager Apology Only</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Compensation Value (₹)
              </label>
              <Input
                type="number"
                placeholder="500"
                value={complaintResolveData.compensationValue?.toString() || '500'}
                onChange={(e) => setComplaintResolveData({ ...complaintResolveData, compensationValue: Number(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Resolution Summary *
            </label>
            <textarea
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white h-20"
              placeholder="e.g. Spoke with client, credited ₹500 to wallet, and scheduled a complimentary re-touching."
              value={complaintResolveData.resolutionSummary}
              onChange={(e) => setComplaintResolveData({ ...complaintResolveData, resolutionSummary: e.target.value })}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" onClick={() => setIsResolveComplaintModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleResolveComplaint}>
              Save & Resolve Complaint
            </Button>
          </div>
        </div>
      </Modal>

      {/* --------------------------------------------------------------------- */}
      {/* MODAL 6: REPLY TO CUSTOMER REVIEW                                     */}
      {/* --------------------------------------------------------------------- */}
      <Modal
        isOpen={isReplyReviewModalOpen}
        onClose={() => setIsReplyReviewModalOpen(false)}
        title="Public Response to Customer Review"
        description={`Respond as Salon Manager to ${selectedReviewForReply?.customerName}'s ${selectedReviewForReply?.overallRating}★ review.`}
      >
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 italic">
            "{selectedReviewForReply?.comment || 'No review comment provided.'}"
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Manager Response Message *
            </label>
            <textarea
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white h-24"
              placeholder="Thank you for visiting Hive Salon..."
              value={reviewReplyText}
              onChange={(e) => setReviewReplyText(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" onClick={() => setIsReplyReviewModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handlePostReviewReply}>
              Publish Public Response
            </Button>
          </div>
        </div>
      </Modal>

      {/* --------------------------------------------------------------------- */}
      {/* MODAL 7: EDIT CUSTOMER CONSENT / PREFERENCES                          */}
      {/* --------------------------------------------------------------------- */}
      <Modal
        isOpen={isEditConsentModalOpen}
        onClose={() => setIsEditConsentModalOpen(false)}
        title="Edit Communication & DND Preferences"
        description={`Update marketing opt-ins for ${selectedConsent?.customerName} (${selectedConsent?.customerPhone})`}
      >
        {selectedConsent && (
          <div className="space-y-4">
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 cursor-pointer">
                <div>
                  <span className="font-semibold text-sm text-slate-800 dark:text-slate-200 block">
                    WhatsApp Marketing
                  </span>
                  <span className="text-xs text-slate-500">
                    Receive festive promotions, flash discounts, and birthday vouchers.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={selectedConsent.allowMarketingWhatsapp}
                  onChange={(e) =>
                    setSelectedConsent({
                      ...selectedConsent,
                      allowMarketingWhatsapp: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 cursor-pointer">
                <div>
                  <span className="font-semibold text-sm text-slate-800 dark:text-slate-200 block">
                    SMS Marketing
                  </span>
                  <span className="text-xs text-slate-500">
                    Receive promotional SMS broadcasts and event alerts.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={selectedConsent.allowMarketingSms}
                  onChange={(e) =>
                    setSelectedConsent({
                      ...selectedConsent,
                      allowMarketingSms: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 cursor-pointer">
                <div>
                  <span className="font-semibold text-sm text-slate-800 dark:text-slate-200 block">
                    Email Marketing
                  </span>
                  <span className="text-xs text-slate-500">
                    Receive monthly style magazines, trends, and seasonal vouchers.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={selectedConsent.allowMarketingEmail}
                  onChange={(e) =>
                    setSelectedConsent({
                      ...selectedConsent,
                      allowMarketingEmail: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
                />
              </label>

              <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-700 dark:text-indigo-300">
                <ShieldCheck className="h-4 w-4 inline mr-1 text-indigo-600" />
                <strong>Guaranteed Delivery:</strong> Transactional notices (Booking Confirmations, OTPs, Payment Receipts) always deliver regardless of marketing opt-out status.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" onClick={() => setIsEditConsentModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveConsent}>
                Save Preferences
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default function MarketingPage() {
  return <MarketingView initialTab="CAMPAIGNS" />;
}

