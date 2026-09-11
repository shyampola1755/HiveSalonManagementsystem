import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Headers,
  Req,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { ScopeGuard } from '../../common/guards/scope.guard';
import { PermissionsGuard, RequirePermissions } from '../../common/guards/permissions.guard';
import { PERMISSION_FLAGS } from '@hive/config';
import type { CustomerSegment } from '@hive/types';

@Controller('api/v1/customers')
@UseGuards(TenantGuard, ScopeGuard, PermissionsGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  @RequirePermissions(PERMISSION_FLAGS.CUSTOMERS_VIEW)
  async listCustomers(
    @Query('query') query?: string,
    @Query('segment') segment?: CustomerSegment,
    @Query('branchId') branchId?: string,
    @Headers('x-organization-id') orgId: string = 'org_hive_demo'
  ) {
    const customers = await this.customerService.searchCustomers(query, segment, branchId, orgId);
    return {
      success: true,
      count: customers.length,
      data: customers,
    };
  }

  @Post()
  @RequirePermissions(PERMISSION_FLAGS.CUSTOMERS_CREATE)
  async createCustomer(
    @Body() payload: any,
    @Headers('x-organization-id') orgId: string = 'org_hive_demo'
  ) {
    const customer = await this.customerService.createCustomer(orgId, payload);
    return {
      success: true,
      message: 'Customer profile registered successfully.',
      data: customer,
    };
  }

  @Get(':id')
  @RequirePermissions(PERMISSION_FLAGS.CUSTOMERS_VIEW)
  async getCustomer(
    @Param('id') id: string,
    @Headers('x-organization-id') orgId: string = 'org_hive_demo'
  ) {
    const customer = await this.customerService.getCustomer360(id, orgId);
    return {
      success: true,
      data: customer,
    };
  }

  @Get(':id/360')
  @RequirePermissions(PERMISSION_FLAGS.CUSTOMERS_VIEW)
  async getCustomer360(
    @Param('id') id: string,
    @Headers('x-organization-id') orgId: string = 'org_hive_demo'
  ) {
    const customer = await this.customerService.getCustomer360(id, orgId);
    return {
      success: true,
      data: customer,
    };
  }

  @Put(':id')
  @RequirePermissions(PERMISSION_FLAGS.CUSTOMERS_EDIT)
  async updateCustomer(
    @Param('id') id: string,
    @Body() payload: any,
    @Headers('x-organization-id') orgId: string = 'org_hive_demo'
  ) {
    const updated = await this.customerService.updateCustomer(id, orgId, payload);
    return {
      success: true,
      message: 'Customer profile updated successfully.',
      data: updated,
    };
  }

  @Post(':id/color-formulas')
  @RequirePermissions(PERMISSION_FLAGS.CUSTOMERS_EDIT)
  async addColorFormula(@Param('id') id: string, @Body() payload: any) {
    const formula = await this.customerService.addColorFormula(id, payload);
    return {
      success: true,
      message: 'Hair color formula logged successfully.',
      data: formula,
    };
  }

  @Post(':id/patch-tests')
  @RequirePermissions(PERMISSION_FLAGS.CUSTOMERS_EDIT)
  async recordPatchTest(@Param('id') id: string, @Body() payload: any) {
    const test = await this.customerService.recordPatchTest(id, payload);
    return {
      success: true,
      message: 'Chemical patch test record saved.',
      data: test,
    };
  }

  @Post(':id/notes')
  @RequirePermissions(PERMISSION_FLAGS.CUSTOMERS_EDIT)
  async addNote(@Param('id') id: string, @Body() payload: any) {
    const note = await this.customerService.addNote(id, payload);
    return {
      success: true,
      message: 'Staff internal note added.',
      data: note,
    };
  }

  @Post(':id/wallet/topup')
  @RequirePermissions(PERMISSION_FLAGS.BILLING_CREATE)
  async topupWallet(@Param('id') id: string, @Body() payload: any) {
    const result = await this.customerService.topupWallet(
      id,
      payload.amount,
      payload.paymentMethod,
      payload.reason
    );
    return {
      success: true,
      message: `Prepaid wallet topped up with ₹${Number(payload.amount).toLocaleString('en-IN')}.`,
      data: result,
    };
  }
}
