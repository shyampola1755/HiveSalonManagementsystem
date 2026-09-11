import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MembershipService } from './membership.service';
import type {
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

@Controller('api/v1/memberships')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  // ---------------------------------------------------------------------------
  // 1. MEMBERSHIP PLANS
  // ---------------------------------------------------------------------------
  @Get('plans')
  getAllPlans() {
    return this.membershipService.getAllPlans();
  }

  @Get('plans/:id')
  getPlanById(@Param('id') id: string) {
    return this.membershipService.getPlanById(id);
  }

  @Post('plans')
  @HttpCode(HttpStatus.CREATED)
  createPlan(@Body() payload: CreateMembershipPlanPayload) {
    return this.membershipService.createPlan(payload);
  }

  // ---------------------------------------------------------------------------
  // 2. CUSTOMER MEMBERSHIPS (SUBSCRIPTIONS)
  // ---------------------------------------------------------------------------
  @Get('subscriptions')
  getAllSubscriptions() {
    return this.membershipService.getAllCustomerMemberships();
  }

  @Get('subscriptions/customer/:customerId')
  getCustomerMembership(@Param('customerId') customerId: string) {
    return this.membershipService.getCustomerMembership(customerId);
  }

  @Post('subscriptions/enroll')
  @HttpCode(HttpStatus.CREATED)
  enrollMembership(@Body() payload: EnrollCustomerMembershipPayload) {
    return this.membershipService.enrollCustomerMembership(payload);
  }

  // ---------------------------------------------------------------------------
  // 3. SERVICE PACKAGES
  // ---------------------------------------------------------------------------
  @Get('packages/templates')
  getPackageTemplates() {
    return this.membershipService.getAllPackageTemplates();
  }

  @Post('packages/templates')
  @HttpCode(HttpStatus.CREATED)
  createPackageTemplate(@Body() payload: CreatePackageTemplatePayload) {
    return this.membershipService.createPackageTemplate(payload);
  }

  @Get('packages/all')
  getAllCustomerPackages() {
    return this.membershipService.getAllCustomerPackages();
  }

  @Get('packages/customer/:customerId')
  getCustomerPackages(@Param('customerId') customerId: string) {
    return this.membershipService.getCustomerPackages(customerId);
  }

  @Post('packages/purchase')
  @HttpCode(HttpStatus.CREATED)
  purchasePackage(@Body() payload: PurchaseCustomerPackagePayload) {
    return this.membershipService.purchaseCustomerPackage(payload);
  }

  @Post('packages/redeem')
  @HttpCode(HttpStatus.OK)
  redeemPackageSession(@Body() payload: RedeemPackageSessionPayload) {
    return this.membershipService.redeemPackageSession(payload);
  }

  // ---------------------------------------------------------------------------
  // 4. CUSTOMER PREPAID WALLET & LEDGER
  // ---------------------------------------------------------------------------
  @Get('wallets/:customerId')
  getCustomerWallet(@Param('customerId') customerId: string) {
    return this.membershipService.getCustomerWallet(customerId);
  }

  @Get('wallets/:customerId/ledger')
  getCustomerWalletLedger(@Param('customerId') customerId: string) {
    return this.membershipService.getWalletLedger(customerId);
  }

  @Get('wallets/ledger/all')
  getAllWalletLedgerEntries() {
    return this.membershipService.getWalletLedger();
  }

  @Post('wallets/topup')
  @HttpCode(HttpStatus.OK)
  topupWallet(@Body() payload: WalletTopupPayload) {
    return this.membershipService.topupWallet(payload);
  }

  @Post('wallets/debit')
  @HttpCode(HttpStatus.OK)
  debitWallet(@Body() payload: WalletDebitPayload) {
    return this.membershipService.debitWallet(payload);
  }

  // ---------------------------------------------------------------------------
  // 5. LOYALTY PROGRAM & TIERS
  // ---------------------------------------------------------------------------
  @Get('loyalty/tiers')
  getLoyaltyTiers() {
    return this.membershipService.getAllLoyaltyTiers();
  }

  @Get('loyalty/customer/:customerId')
  getCustomerLoyaltyAccount(@Param('customerId') customerId: string) {
    return this.membershipService.getCustomerLoyaltyAccount(customerId);
  }

  @Get('loyalty/ledger')
  getLoyaltyLedger(@Query('customerId') customerId?: string) {
    return this.membershipService.getLoyaltyLedger(customerId);
  }

  @Post('loyalty/award')
  @HttpCode(HttpStatus.OK)
  awardLoyaltyPoints(@Body() payload: AwardLoyaltyPointsPayload) {
    return this.membershipService.awardLoyaltyPoints(payload);
  }

  @Post('loyalty/redeem')
  @HttpCode(HttpStatus.OK)
  redeemLoyaltyPoints(
    @Body() body: { customerId: string; pointsToRedeem: number; invoiceId?: string }
  ) {
    return this.membershipService.redeemLoyaltyPoints(
      body.customerId,
      body.pointsToRedeem,
      body.invoiceId
    );
  }

  // ---------------------------------------------------------------------------
  // 6. FAMILY PLANS & SHARED POOLS
  // ---------------------------------------------------------------------------
  @Get('family-plans')
  getAllFamilyPlans() {
    return this.membershipService.getAllFamilyPlans();
  }

  @Get('family-plans/customer/:customerId')
  getFamilyPlanByCustomer(@Param('customerId') customerId: string) {
    return this.membershipService.getFamilyPlanByPrimaryCustomer(customerId);
  }

  @Post('family-plans')
  @HttpCode(HttpStatus.CREATED)
  createFamilyPlan(@Body() payload: CreateFamilyPlanPayload) {
    return this.membershipService.createFamilyPlan(payload);
  }

  @Post('family-plans/add-member')
  @HttpCode(HttpStatus.CREATED)
  addFamilyMember(@Body() payload: AddFamilyMemberPayload) {
    return this.membershipService.addFamilyMember(payload);
  }

  @Get('family-plans/usage')
  getFamilyUsageRecords(@Query('familyPlanId') familyPlanId?: string) {
    return this.membershipService.getFamilyUsageRecords(familyPlanId);
  }

  // ---------------------------------------------------------------------------
  // 7. POS CHECKOUT RETENTION BENEFIT EVALUATOR
  // ---------------------------------------------------------------------------
  @Get('customer/:customerId/pos-benefits')
  evaluatePosBenefits(@Param('customerId') customerId: string) {
    return this.membershipService.evaluatePosBenefits(customerId);
  }

  // ---------------------------------------------------------------------------
  // 8. EXPIRY ALERTS & RENEWALS
  // ---------------------------------------------------------------------------
  @Get('expiry-alerts')
  getExpiryAlerts(@Query('days') days?: string) {
    const daysFilter = days ? parseInt(days, 10) : undefined;
    return this.membershipService.getAllExpiryAlerts(daysFilter);
  }

  @Post('expiry-alerts/send')
  @HttpCode(HttpStatus.OK)
  sendExpiryAlert(@Body() payload: SendExpiryAlertPayload) {
    return this.membershipService.sendExpiryAlert(payload);
  }
}
