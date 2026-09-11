import { z } from 'zod';

export const MessageTypeEnum = z.enum([
  'APPOINTMENT_CONFIRMATION',
  'APPOINTMENT_REMINDER',
  'APPOINTMENT_CANCELLATION',
  'INVOICE_RECEIPT',
  'PAYMENT_SUCCESS',
  'MEMBERSHIP_EXPIRY',
  'BIRTHDAY_GREETING',
  'ANNIVERSARY_GREETING',
  'REBOOKING_REMINDER',
  'WIN_BACK',
  'MARKETING_PROMOTION',
  'REVIEW_REQUEST',
]);

export const CommunicationChannelEnum = z.enum([
  'WHATSAPP',
  'SMS',
  'EMAIL',
  'OMNICHANNEL',
]);

export const MessageDeliveryStatusEnum = z.enum([
  'QUEUED',
  'SENT',
  'DELIVERED',
  'READ',
  'FAILED',
  'OPTED_OUT',
]);

export const CustomerSegmentTypeEnum = z.enum([
  'ALL',
  'NEW',
  'RETURNING',
  'VIP',
  'INACTIVE',
  'HIGH_VALUE',
  'MEMBERSHIP',
  'FREQUENT',
]);

export const AutomationTriggerEventEnum = z.enum([
  'APPOINTMENT_BOOKED',
  'APPOINTMENT_COMPLETED',
  'PAYMENT_COMPLETED',
  'MEMBERSHIP_EXPIRING',
  'CUSTOMER_INACTIVE_60D',
  'BIRTHDAY',
  'ANNIVERSARY',
]);

export const ComplaintSeverityEnum = z.enum([
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL',
]);

export const ComplaintRootCauseEnum = z.enum([
  'SERVICE_QUALITY',
  'STYLIST_BEHAVIOR',
  'WAIT_TIME',
  'BILLING_DISPUTE',
  'HYGIENE',
  'AMBIENCE',
  'OTHER',
]);

export const ComplaintStatusEnum = z.enum([
  'OPEN',
  'INVESTIGATING',
  'CONTACTED_CLIENT',
  'COMPENSATION_OFFERED',
  'RESOLVED',
  'CLOSED',
]);

export const createCampaignSchema = z.object({
  name: z.string().min(2, 'Campaign name is required'),
  code: z.string().min(2, 'Campaign code is required').toUpperCase(),
  audienceSegment: CustomerSegmentTypeEnum,
  channel: CommunicationChannelEnum,
  messageTemplate: z.string().min(5, 'Message template must be at least 5 characters'),
  discountCode: z.string().optional(),
  discountPercentage: z.number().min(0).max(100).optional(),
  scheduledAt: z.string().optional(),
  branchId: z.string().optional(),
});

export const createAutomationRuleSchema = z.object({
  name: z.string().min(2, 'Workflow name is required'),
  triggerEvent: AutomationTriggerEventEnum,
  channel: CommunicationChannelEnum,
  delayMinutes: z.number().int().min(0).default(0),
  templateBody: z.string().min(5, 'Template body is required'),
  isActive: z.boolean().default(true),
  audienceSegmentFilter: CustomerSegmentTypeEnum.optional().default('ALL'),
  respectConsent: z.boolean().default(true),
});

export const sendMessageSchema = z.object({
  customerId: z.string().optional(),
  recipientName: z.string().min(1, 'Recipient name is required'),
  recipientPhone: z.string().optional(),
  recipientEmail: z.string().email().optional(),
  messageType: MessageTypeEnum,
  channel: CommunicationChannelEnum,
  messageContent: z.string().min(1, 'Message content is required'),
  campaignId: z.string().optional(),
  workflowRuleId: z.string().optional(),
  branchId: z.string().optional(),
});

export const submitReviewSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  appointmentId: z.string().optional(),
  overallRating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
  staffRating: z.number().int().min(1).max(5).optional(),
  serviceRating: z.number().int().min(1).max(5).optional(),
  ambienceRating: z.number().int().min(1).max(5).optional(),
  comment: z.string().optional(),
  stylistName: z.string().optional(),
  serviceName: z.string().optional(),
  source: z.string().default('WHATSAPP_LINK'),
});

export const resolveComplaintSchema = z.object({
  ticketId: z.string().min(1, 'Ticket ID is required'),
  status: ComplaintStatusEnum,
  assignedManagerName: z.string().optional(),
  compensationType: z.string().optional(),
  compensationValue: z.number().min(0).optional(),
  managerNotes: z.string().optional(),
  resolutionSummary: z.string().min(5, 'Resolution summary is required'),
});

export const updateConsentSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  allowMarketingWhatsapp: z.boolean(),
  allowMarketingSms: z.boolean(),
  allowMarketingEmail: z.boolean(),
  allowTransactionalMessages: z.boolean(),
  preferredChannel: CommunicationChannelEnum.optional(),
});
