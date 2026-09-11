import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MarketingService } from './marketing.service';
import type {
  CreateCampaignPayload,
  CreateAutomationRulePayload,
  SendMessagePayload,
  SubmitReviewPayload,
  ResolveComplaintPayload,
  UpdateConsentPayload,
} from '@hive/types';

@Controller('api/v1/marketing')
export class MarketingController {
  constructor(private readonly marketingService: MarketingService) {}

  // ---------------------------------------------------------------------------
  // 1. CAMPAIGNS
  // ---------------------------------------------------------------------------
  @Get('campaigns')
  getAllCampaigns() {
    return this.marketingService.getAllCampaigns();
  }

  @Post('campaigns')
  @HttpCode(HttpStatus.CREATED)
  createCampaign(@Body() payload: CreateCampaignPayload) {
    return this.marketingService.createCampaign(payload);
  }

  @Post('campaigns/:id/launch')
  launchCampaign(@Param('id') id: string) {
    return this.marketingService.launchCampaign(id);
  }

  // ---------------------------------------------------------------------------
  // 2. AUTOMATION RULES
  // ---------------------------------------------------------------------------
  @Get('automations')
  getAllAutomations() {
    return this.marketingService.getAllAutomationRules();
  }

  @Post('automations')
  @HttpCode(HttpStatus.CREATED)
  createAutomationRule(@Body() payload: CreateAutomationRulePayload) {
    return this.marketingService.createAutomationRule(payload);
  }

  @Patch('automations/:id/toggle')
  toggleAutomationRule(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean
  ) {
    return this.marketingService.toggleAutomationRule(id, isActive);
  }

  // ---------------------------------------------------------------------------
  // 3. SEGMENTS
  // ---------------------------------------------------------------------------
  @Get('segments')
  getSegments() {
    return this.marketingService.getCustomerSegments();
  }

  // ---------------------------------------------------------------------------
  // 4. OUTBOUND MESSAGES QUEUE
  // ---------------------------------------------------------------------------
  @Get('messages')
  getMessages(
    @Query('status') status?: string,
    @Query('channel') channel?: string
  ) {
    return this.marketingService.getOutboundMessages(status, channel);
  }

  @Post('messages/send-single')
  @HttpCode(HttpStatus.OK)
  sendDirectMessage(@Body() payload: SendMessagePayload) {
    return this.marketingService.sendDirectMessage(payload);
  }

  // ---------------------------------------------------------------------------
  // 5. REVIEWS & CSAT
  // ---------------------------------------------------------------------------
  @Get('reviews')
  getReviews() {
    return this.marketingService.getAllReviews();
  }

  @Post('reviews')
  @HttpCode(HttpStatus.CREATED)
  submitReview(@Body() payload: SubmitReviewPayload) {
    return this.marketingService.submitReview(payload);
  }

  @Post('reviews/:id/reply')
  postReviewReply(
    @Param('id') id: string,
    @Body('responseText') responseText: string
  ) {
    return this.marketingService.postPublicResponse(id, responseText);
  }

  // ---------------------------------------------------------------------------
  // 6. COMPLAINTS ESCALATION TICKETS
  // ---------------------------------------------------------------------------
  @Get('complaints')
  getComplaintTickets() {
    return this.marketingService.getAllComplaintTickets();
  }

  @Patch('complaints/:id/resolve')
  resolveComplaint(
    @Param('id') id: string,
    @Body() payload: Omit<ResolveComplaintPayload, 'ticketId'>
  ) {
    return this.marketingService.resolveComplaint({
      ...payload,
      ticketId: id,
    });
  }

  // ---------------------------------------------------------------------------
  // 7. CONSENT & PREFERENCES
  // ---------------------------------------------------------------------------
  @Get('consent/:customerId')
  getCustomerConsent(@Param('customerId') customerId: string) {
    return this.marketingService.getCustomerConsent(customerId);
  }

  @Post('consent')
  @HttpCode(HttpStatus.OK)
  updateCustomerConsent(@Body() payload: UpdateConsentPayload) {
    return this.marketingService.updateCustomerConsent(payload);
  }
}
