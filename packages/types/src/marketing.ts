// -----------------------------------------------------------------------------
// HIVE SALON — PHASE 12: MARKETING AUTOMATION, COMMUNICATION & REVIEWS
// -----------------------------------------------------------------------------

export type MessageType =
  | 'APPOINTMENT_CONFIRMATION'
  | 'APPOINTMENT_REMINDER'
  | 'APPOINTMENT_CANCELLATION'
  | 'INVOICE_RECEIPT'
  | 'PAYMENT_SUCCESS'
  | 'MEMBERSHIP_EXPIRY'
  | 'BIRTHDAY_GREETING'
  | 'ANNIVERSARY_GREETING'
  | 'REBOOKING_REMINDER'
  | 'WIN_BACK'
  | 'MARKETING_PROMOTION'
  | 'REVIEW_REQUEST';

export type CommunicationChannel = 'WHATSAPP' | 'SMS' | 'EMAIL' | 'OMNICHANNEL';

export type MessageDeliveryStatus =
  | 'QUEUED'
  | 'SENT'
  | 'DELIVERED'
  | 'READ'
  | 'FAILED'
  | 'OPTED_OUT';

export type CustomerSegmentType =
  | 'ALL'
  | 'NEW'
  | 'RETURNING'
  | 'VIP'
  | 'INACTIVE'
  | 'HIGH_VALUE'
  | 'MEMBERSHIP'
  | 'FREQUENT';

export type AutomationTriggerEvent =
  | 'APPOINTMENT_BOOKED'
  | 'APPOINTMENT_COMPLETED'
  | 'PAYMENT_COMPLETED'
  | 'MEMBERSHIP_EXPIRING'
  | 'CUSTOMER_INACTIVE_60D'
  | 'BIRTHDAY'
  | 'ANNIVERSARY';

export type ComplaintSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ComplaintRootCause =
  | 'SERVICE_QUALITY'
  | 'STYLIST_BEHAVIOR'
  | 'WAIT_TIME'
  | 'BILLING_DISPUTE'
  | 'HYGIENE'
  | 'AMBIENCE'
  | 'OTHER';

export type ComplaintStatus =
  | 'OPEN'
  | 'INVESTIGATING'
  | 'CONTACTED_CLIENT'
  | 'COMPENSATION_OFFERED'
  | 'RESOLVED'
  | 'CLOSED';

export interface MarketingCampaignDto {
  id: string;
  organizationId: string;
  branchId?: string;
  name: string;
  code: string;
  audienceSegment: CustomerSegmentType;
  channel: CommunicationChannel;
  messageTemplate: string;
  discountCode?: string;
  discountPercentage?: number;
  scheduledAt?: string;
  status: 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'COMPLETED' | 'CANCELLED';
  totalAudience: number;
  totalSent: number;
  totalDelivered: number;
  totalRead: number;
  totalFailed: number;
  totalClicked: number;
  totalConverted: number;
  revenueGenerated: number;
  createdAt: string;
  updatedAt: string;
}

export interface AutomationRuleDto {
  id: string;
  organizationId: string;
  name: string;
  triggerEvent: AutomationTriggerEvent;
  channel: CommunicationChannel;
  delayMinutes: number;
  templateBody: string;
  isActive: boolean;
  audienceSegmentFilter?: CustomerSegmentType;
  respectConsent: boolean;
  totalTriggered: number;
  createdAt: string;
  updatedAt: string;
}

export interface OutboundMessageDto {
  id: string;
  organizationId: string;
  branchId?: string;
  customerId?: string;
  campaignId?: string;
  workflowRuleId?: string;
  messageType: MessageType;
  channel: CommunicationChannel;
  providerName: string;
  providerMessageId?: string;
  recipientPhone?: string;
  recipientEmail?: string;
  recipientName: string;
  messageContent: string;
  status: MessageDeliveryStatus;
  errorMessage?: string;
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  createdAt: string;
}

export interface CustomerReviewDto {
  id: string;
  organizationId?: string;
  customerId: string;
  customerName?: string;
  customerPhone?: string;
  branchId?: string;
  branchName?: string;
  appointmentId?: string;
  overallRating: number;
  staffRating?: number;
  serviceRating?: number;
  ambienceRating?: number;
  comment?: string;
  stylistName?: string;
  serviceName?: string;
  csatScore?: number;
  source: string;
  isEscalated: boolean;
  escalationTicketId?: string;
  isPublic: boolean;
  publicResponse?: string;
  respondedAt?: string;
  createdAt: string;
}

export interface ComplaintTicketDto {
  id: string;
  organizationId: string;
  branchId?: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  reviewId?: string;
  appointmentId?: string;
  severity: ComplaintSeverity;
  rootCauseCategory: ComplaintRootCause;
  complaintDetails: string;
  assignedManagerId?: string;
  assignedManagerName?: string;
  status: ComplaintStatus;
  compensationType?: string;
  compensationValue?: number;
  managerNotes?: string;
  resolutionSummary?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommunicationPreferenceDto {
  id: string;
  organizationId: string;
  customerId: string;
  customerName?: string;
  customerPhone?: string;
  allowMarketingWhatsapp: boolean;
  allowMarketingSms: boolean;
  allowMarketingEmail: boolean;
  allowTransactionalMessages: boolean;
  optedOutAt?: string;
  optOutReason?: string;
  preferredChannel: CommunicationChannel;
  preferredLanguage: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CustomerSegmentSummaryDto {
  segment: CustomerSegmentType;
  title: string;
  description: string;
  totalCustomers: number;
  averageSpend: number;
  color: string;
}

export interface ProviderDeliveryResult {
  success: boolean;
  providerMessageId?: string;
  providerName: string;
  status: MessageDeliveryStatus;
  error?: string;
}

// -----------------------------------------------------------------------------
// PAYLOADS
// -----------------------------------------------------------------------------

export interface CreateCampaignPayload {
  name: string;
  code: string;
  audienceSegment: CustomerSegmentType;
  channel: CommunicationChannel;
  messageTemplate: string;
  discountCode?: string;
  discountPercentage?: number;
  scheduledAt?: string;
  branchId?: string;
}

export interface CreateAutomationRulePayload {
  name: string;
  triggerEvent: AutomationTriggerEvent;
  channel: CommunicationChannel;
  delayMinutes: number;
  templateBody: string;
  isActive?: boolean;
  audienceSegmentFilter?: CustomerSegmentType;
  respectConsent?: boolean;
}

export interface SendMessagePayload {
  customerId?: string;
  recipientName: string;
  recipientPhone?: string;
  recipientEmail?: string;
  messageType: MessageType;
  channel: CommunicationChannel;
  messageContent: string;
  campaignId?: string;
  workflowRuleId?: string;
  branchId?: string;
}

export interface SubmitReviewPayload {
  customerId: string;
  appointmentId?: string;
  overallRating: number;
  staffRating?: number;
  serviceRating?: number;
  ambienceRating?: number;
  comment?: string;
  stylistName?: string;
  serviceName?: string;
  source?: string;
}

export interface ResolveComplaintPayload {
  ticketId: string;
  status: ComplaintStatus;
  assignedManagerName?: string;
  compensationType?: string;
  compensationValue?: number;
  managerNotes?: string;
  resolutionSummary: string;
}

export interface UpdateConsentPayload {
  customerId: string;
  allowMarketingWhatsapp: boolean;
  allowMarketingSms: boolean;
  allowMarketingEmail: boolean;
  allowTransactionalMessages: boolean;
  preferredChannel?: CommunicationChannel;
}
