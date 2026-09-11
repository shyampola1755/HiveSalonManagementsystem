import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { PosService } from './pos.service';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { ScopeGuard } from '../../common/guards/scope.guard';
import { PermissionsGuard, RequirePermissions } from '../../common/guards/permissions.guard';
import { PERMISSION_FLAGS } from '@hive/config';
import type {
  CheckoutPayload,
  RefundPayload,
  VoidInvoicePayload,
  DigitalReceiptPayload,
} from '@hive/types';

@Controller('api/v1/pos')
@UseGuards(TenantGuard, ScopeGuard, PermissionsGuard)
export class PosController {
  constructor(private readonly posService: PosService) {}

  @Get('invoices')
  @RequirePermissions(PERMISSION_FLAGS.BILLING_VIEW)
  async getInvoices(
    @Query('branchId') branchId?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Headers('x-organization-id') orgId: string = 'org_hive_demo'
  ) {
    const invoices = await this.posService.getInvoices(orgId, { branchId, status, search });
    return {
      success: true,
      count: invoices.length,
      data: invoices,
    };
  }

  @Get('invoices/:id')
  @RequirePermissions(PERMISSION_FLAGS.BILLING_VIEW)
  async getInvoiceById(
    @Param('id') id: string,
    @Headers('x-organization-id') orgId: string = 'org_hive_demo'
  ) {
    const invoice = await this.posService.getInvoiceById(orgId, id);
    return {
      success: true,
      data: invoice,
    };
  }

  @Post('checkout')
  @RequirePermissions(PERMISSION_FLAGS.BILLING_CREATE)
  async checkout(
    @Body() payload: CheckoutPayload,
    @Headers('idempotency-key') idempotencyKeyHeader?: string,
    @Headers('x-organization-id') orgId: string = 'org_hive_demo'
  ) {
    const finalPayload = {
      ...payload,
      idempotencyKey: payload.idempotencyKey || idempotencyKeyHeader || null,
    };
    const invoice = await this.posService.checkout(orgId, finalPayload);
    return {
      success: true,
      message: `Payment successful! Invoice #${invoice.invoiceNumber} generated.`,
      data: invoice,
    };
  }

  @Post('invoices/:id/refund')
  @RequirePermissions(PERMISSION_FLAGS.BILLING_REFUND)
  async processRefund(
    @Param('id') id: string,
    @Body() payload: RefundPayload,
    @Headers('x-organization-id') orgId: string = 'org_hive_demo'
  ) {
    const invoice = await this.posService.processRefund(orgId, id, payload);
    return {
      success: true,
      message: `Refund of ₹${payload.amount} processed successfully for invoice #${invoice.invoiceNumber}.`,
      data: invoice,
    };
  }

  @Post('invoices/:id/void')
  @RequirePermissions(PERMISSION_FLAGS.BILLING_VOID)
  async voidInvoice(
    @Param('id') id: string,
    @Body() payload: VoidInvoicePayload,
    @Headers('x-organization-id') orgId: string = 'org_hive_demo'
  ) {
    const invoice = await this.posService.voidInvoice(orgId, id, payload);
    return {
      success: true,
      message: `Invoice #${invoice.invoiceNumber} has been voided.`,
      data: invoice,
    };
  }

  @Post('invoices/:id/receipt')
  @RequirePermissions(PERMISSION_FLAGS.BILLING_VIEW)
  async queueReceipt(
    @Param('id') id: string,
    @Body() payload: DigitalReceiptPayload,
    @Headers('x-organization-id') orgId: string = 'org_hive_demo'
  ) {
    const res = await this.posService.queueReceipt(orgId, id, payload);
    return {
      success: true,
      message: `Digital receipt queued for ${payload.channels.join(', ')}.`,
      data: res,
    };
  }
}
