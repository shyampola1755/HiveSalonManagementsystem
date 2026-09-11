import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { ScopeGuard } from '../../common/guards/scope.guard';
import { PermissionsGuard, RequirePermissions } from '../../common/guards/permissions.guard';
import { PERMISSION_FLAGS } from '@hive/config';
import type {
  CreateProductDto,
  UpdateProductDto,
  StockAdjustmentPayload,
  CreateRecipeDto,
  ServiceConsumptionPayload,
  CreatePurchaseOrderDto,
  ReceivePurchaseOrderPayload,
  CreateVendorDto,
  CreateTransferDto,
} from '@hive/types';

@Controller('api/v1/inventory')
@UseGuards(TenantGuard, ScopeGuard, PermissionsGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // ---------------------------------------------------------------------------
  // 1. DASHBOARD KPIS
  // ---------------------------------------------------------------------------
  @Get('dashboard')
  @RequirePermissions(PERMISSION_FLAGS.INVENTORY_VIEW)
  async getDashboardKpis(@Query('branchId') branchId?: string) {
    const kpis = await this.inventoryService.getDashboardKpis(branchId);
    return {
      success: true,
      data: kpis,
    };
  }

  // ---------------------------------------------------------------------------
  // 2. PRODUCTS
  // ---------------------------------------------------------------------------
  @Get('products')
  @RequirePermissions(PERMISSION_FLAGS.INVENTORY_VIEW)
  async getProducts(
    @Query('categoryId') categoryId?: string,
    @Query('brand') brand?: string,
    @Query('search') search?: string,
    @Query('status') status?: string
  ) {
    const products = await this.inventoryService.getAllProducts({
      categoryId,
      brand,
      search,
      status,
    });
    return {
      success: true,
      count: products.length,
      data: products,
    };
  }

  @Get('products/:id')
  @RequirePermissions(PERMISSION_FLAGS.INVENTORY_VIEW)
  async getProductById(@Param('id') id: string) {
    const product = await this.inventoryService.getProductById(id);
    return {
      success: true,
      data: product,
    };
  }

  @Post('products')
  @RequirePermissions(PERMISSION_FLAGS.INVENTORY_MANAGE)
  async createProduct(
    @Body() dto: CreateProductDto,
    @Headers('x-organization-id') orgId: string = 'org_hive_demo'
  ) {
    const product = await this.inventoryService.createProduct(dto, orgId);
    return {
      success: true,
      message: `Product "${product.name}" created successfully.`,
      data: product,
    };
  }

  @Put('products/:id')
  @RequirePermissions(PERMISSION_FLAGS.INVENTORY_MANAGE)
  async updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    const product = await this.inventoryService.updateProduct(id, dto);
    return {
      success: true,
      message: `Product "${product.name}" updated successfully.`,
      data: product,
    };
  }

  // ---------------------------------------------------------------------------
  // 3. BRANCH STOCKS & ADJUSTMENTS
  // ---------------------------------------------------------------------------
  @Get('stocks')
  @RequirePermissions(PERMISSION_FLAGS.INVENTORY_VIEW)
  async getBranchStocks(
    @Query('branchId') branchId?: string,
    @Query('search') search?: string
  ) {
    const stocks = await this.inventoryService.getBranchStocks(branchId, search);
    return {
      success: true,
      count: stocks.length,
      data: stocks,
    };
  }

  @Post('stocks/adjust')
  @RequirePermissions(PERMISSION_FLAGS.INVENTORY_MANAGE)
  async adjustStock(
    @Body() payload: StockAdjustmentPayload,
    @Headers('x-organization-id') orgId: string = 'org_hive_demo'
  ) {
    const result = await this.inventoryService.adjustStock(payload, orgId);
    return {
      success: true,
      message: `Stock adjustment recorded: ${result.ledgerRecord.movementType} (${result.ledgerRecord.quantity > 0 ? '+' : ''}${result.ledgerRecord.quantity} ${result.ledgerRecord.productUnit}).`,
      data: result,
    };
  }

  // ---------------------------------------------------------------------------
  // 4. STOCK LEDGER (IMMUTABLE AUDIT TRAIL)
  // ---------------------------------------------------------------------------
  @Get('ledger')
  @RequirePermissions(PERMISSION_FLAGS.INVENTORY_VIEW)
  async getStockLedger(
    @Query('branchId') branchId?: string,
    @Query('productId') productId?: string,
    @Query('movementType') movementType?: string,
    @Query('search') search?: string
  ) {
    const ledger = await this.inventoryService.getStockLedger({
      branchId,
      productId,
      movementType,
      search,
    });
    return {
      success: true,
      count: ledger.length,
      data: ledger,
    };
  }

  // ---------------------------------------------------------------------------
  // 5. SERVICE RECIPES & AUTO-CONSUMPTION
  // ---------------------------------------------------------------------------
  @Get('recipes')
  @RequirePermissions(PERMISSION_FLAGS.INVENTORY_VIEW)
  async getRecipes() {
    const recipes = await this.inventoryService.getAllRecipes();
    return {
      success: true,
      count: recipes.length,
      data: recipes,
    };
  }

  @Get('recipes/:serviceId')
  @RequirePermissions(PERMISSION_FLAGS.INVENTORY_VIEW)
  async getRecipeByServiceId(@Param('serviceId') serviceId: string) {
    const recipe = await this.inventoryService.getRecipeByServiceId(serviceId);
    return {
      success: true,
      data: recipe,
    };
  }

  @Post('recipes')
  @RequirePermissions(PERMISSION_FLAGS.INVENTORY_MANAGE)
  async createOrUpdateRecipe(
    @Body() dto: CreateRecipeDto,
    @Headers('x-organization-id') orgId: string = 'org_hive_demo'
  ) {
    const recipe = await this.inventoryService.createOrUpdateRecipe(dto, orgId);
    return {
      success: true,
      message: `Recipe for "${recipe.serviceName}" saved with ${recipe.items.length} ingredients.`,
      data: recipe,
    };
  }

  @Post('recipes/consume')
  @RequirePermissions(PERMISSION_FLAGS.INVENTORY_MANAGE)
  async consumeRecipe(
    @Body() payload: ServiceConsumptionPayload,
    @Headers('x-organization-id') orgId: string = 'org_hive_demo'
  ) {
    const result = await this.inventoryService.consumeServiceRecipe(payload, orgId);
    return {
      success: true,
      message: `Successfully deducted backbar consumption for "${result.serviceName}".`,
      data: result,
    };
  }

  // ---------------------------------------------------------------------------
  // 6. LOW STOCK & EXPIRY ALERTS
  // ---------------------------------------------------------------------------
  @Get('alerts/low-stock')
  @RequirePermissions(PERMISSION_FLAGS.INVENTORY_VIEW)
  async getLowStockAlerts(@Query('branchId') branchId?: string) {
    const alerts = await this.inventoryService.getLowStockAlerts(branchId);
    return {
      success: true,
      count: alerts.length,
      data: alerts,
    };
  }

  @Get('alerts/expiry')
  @RequirePermissions(PERMISSION_FLAGS.INVENTORY_VIEW)
  async getExpiryAlerts(@Query('branchId') branchId?: string) {
    const alerts = await this.inventoryService.getExpiryAlerts(branchId);
    return {
      success: true,
      count: alerts.length,
      data: alerts,
    };
  }

  // ---------------------------------------------------------------------------
  // 7. PURCHASE ORDERS
  // ---------------------------------------------------------------------------
  @Get('purchase-orders')
  @RequirePermissions(PERMISSION_FLAGS.INVENTORY_VIEW)
  async getPurchaseOrders(
    @Query('branchId') branchId?: string,
    @Query('status') status?: string
  ) {
    const orders = await this.inventoryService.getAllPurchaseOrders({ branchId, status });
    return {
      success: true,
      count: orders.length,
      data: orders,
    };
  }

  @Post('purchase-orders')
  @RequirePermissions(PERMISSION_FLAGS.INVENTORY_MANAGE)
  async createPurchaseOrder(
    @Body() dto: CreatePurchaseOrderDto,
    @Headers('x-organization-id') orgId: string = 'org_hive_demo'
  ) {
    const po = await this.inventoryService.createPurchaseOrder(dto, orgId);
    return {
      success: true,
      message: `Purchase Order "${po.poNumber}" created in DRAFT status.`,
      data: po,
    };
  }

  @Patch('purchase-orders/:id/status')
  @RequirePermissions(PERMISSION_FLAGS.INVENTORY_MANAGE)
  async transitionPoStatus(
    @Param('id') id: string,
    @Body('action') action: 'submit' | 'approve' | 'receive' | 'cancel',
    @Body('receivePayload') receivePayload?: ReceivePurchaseOrderPayload,
    @Body('actorName') actorName: string = 'Operations Manager',
    @Headers('x-organization-id') orgId: string = 'org_hive_demo'
  ) {
    const po = await this.inventoryService.transitionPoStatus(
      id,
      action,
      receivePayload,
      actorName,
      orgId
    );
    return {
      success: true,
      message: `Purchase Order "${po.poNumber}" transitioned to ${po.status}.`,
      data: po,
    };
  }

  // ---------------------------------------------------------------------------
  // 8. VENDORS
  // ---------------------------------------------------------------------------
  @Get('vendors')
  @RequirePermissions(PERMISSION_FLAGS.INVENTORY_VIEW)
  async getVendors() {
    const vendors = await this.inventoryService.getAllVendors();
    return {
      success: true,
      count: vendors.length,
      data: vendors,
    };
  }

  @Post('vendors')
  @RequirePermissions(PERMISSION_FLAGS.INVENTORY_MANAGE)
  async createVendor(
    @Body() dto: CreateVendorDto,
    @Headers('x-organization-id') orgId: string = 'org_hive_demo'
  ) {
    const vendor = await this.inventoryService.createVendor(dto, orgId);
    return {
      success: true,
      message: `Vendor "${vendor.name}" (${vendor.code}) added successfully.`,
      data: vendor,
    };
  }

  // ---------------------------------------------------------------------------
  // 9. BRANCH TRANSFERS
  // ---------------------------------------------------------------------------
  @Get('transfers')
  @RequirePermissions(PERMISSION_FLAGS.INVENTORY_VIEW)
  async getTransfers() {
    const transfers = await this.inventoryService.getAllTransfers();
    return {
      success: true,
      count: transfers.length,
      data: transfers,
    };
  }

  @Post('transfers')
  @RequirePermissions(PERMISSION_FLAGS.INVENTORY_MANAGE)
  async createTransfer(
    @Body() dto: CreateTransferDto,
    @Body('actorName') actorName: string = 'Branch In-Charge',
    @Headers('x-organization-id') orgId: string = 'org_hive_demo'
  ) {
    const transfer = await this.inventoryService.createTransfer(dto, actorName, orgId);
    return {
      success: true,
      message: `Transfer request "${transfer.transferNumber}" submitted for approval.`,
      data: transfer,
    };
  }

  @Patch('transfers/:id/status')
  @RequirePermissions(PERMISSION_FLAGS.INVENTORY_MANAGE)
  async transitionTransferStatus(
    @Param('id') id: string,
    @Body('action') action: 'approve' | 'dispatch' | 'receive' | 'cancel',
    @Body('actorName') actorName: string = 'Authorized Manager',
    @Headers('x-organization-id') orgId: string = 'org_hive_demo'
  ) {
    const transfer = await this.inventoryService.transitionTransferStatus(
      id,
      action,
      actorName,
      orgId
    );
    return {
      success: true,
      message: `Transfer "${transfer.transferNumber}" transitioned to ${transfer.status}.`,
      data: transfer,
    };
  }
}
