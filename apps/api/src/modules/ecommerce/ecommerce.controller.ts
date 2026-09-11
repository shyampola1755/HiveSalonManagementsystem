import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EcommerceService } from './ecommerce.service';
import { DeliveryService } from './delivery/delivery.service';
import {
  CreateRetailOrderDto,
  OrderStatus,
  StockValidationItem,
} from '@hive/types';

@Controller('api/v1/ecommerce')
export class EcommerceController {
  constructor(
    private readonly ecommerceService: EcommerceService,
    private readonly deliveryService: DeliveryService
  ) {}

  // ---------------------------------------------------------------------------
  // 1. PRODUCTS & STOREFRONT
  // ---------------------------------------------------------------------------

  @Get('products')
  async getProducts(
    @Query('categoryId') categoryId?: string,
    @Query('brand') brand?: string,
    @Query('search') search?: string,
    @Query('inStockOnly') inStockOnly?: string,
    @Query('branchId') branchId?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('sortBy') sortBy?: 'featured' | 'bestseller' | 'price_asc' | 'price_desc' | 'rating'
  ) {
    const products = await this.ecommerceService.getAllProducts({
      categoryId,
      brand,
      search,
      inStockOnly: inStockOnly === 'true',
      branchId,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sortBy,
    });

    return {
      success: true,
      count: products.length,
      data: products,
    };
  }

  @Get('products/:id')
  async getProductById(@Param('id') id: string) {
    const product = await this.ecommerceService.getProductById(id);
    return {
      success: true,
      data: product,
    };
  }

  @Get('categories')
  async getCategories() {
    const categories = await this.ecommerceService.getAllCategories();
    return {
      success: true,
      data: categories,
    };
  }

  // ---------------------------------------------------------------------------
  // 2. CART VALIDATION & CHECKOUT
  // ---------------------------------------------------------------------------

  @Post('cart/validate')
  async validateCart(@Body() body: { items: StockValidationItem[] }) {
    const result = await this.ecommerceService.validateStock(body.items || []);
    return {
      success: true,
      data: result,
    };
  }

  @Post('checkout')
  async checkout(@Body() dto: CreateRetailOrderDto) {
    const order = await this.ecommerceService.createOrder(dto);
    return {
      success: true,
      message: `Order #${order.orderNumber} placed successfully!`,
      data: order,
    };
  }

  // ---------------------------------------------------------------------------
  // 3. ORDERS LIFECYCLE
  // ---------------------------------------------------------------------------

  @Get('orders')
  async getOrders(
    @Query('customerId') customerId?: string,
    @Query('status') status?: OrderStatus | 'ALL',
    @Query('fulfillmentType') fulfillmentType?: string,
    @Query('branchId') branchId?: string,
    @Query('search') search?: string
  ) {
    const orders = await this.ecommerceService.getOrders({
      customerId,
      status,
      fulfillmentType,
      branchId,
      search,
    });

    return {
      success: true,
      count: orders.length,
      data: orders,
    };
  }

  @Get('orders/:id')
  async getOrderById(@Param('id') id: string) {
    const order = await this.ecommerceService.getOrderById(id);
    return {
      success: true,
      data: order,
    };
  }

  @Patch('orders/:id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() body: { status: OrderStatus; note?: string; updatedBy?: string }
  ) {
    const updated = await this.ecommerceService.updateOrderStatus(
      id,
      body.status,
      body.note,
      body.updatedBy
    );
    return {
      success: true,
      message: `Order status advanced to ${body.status}`,
      data: updated,
    };
  }

  @Post('orders/:id/verify-pickup')
  async verifyPickupOtp(
    @Param('id') id: string,
    @Body() body: { otp: string; staffName?: string }
  ) {
    const result = await this.ecommerceService.verifyPickupOtp(
      id,
      body.otp,
      body.staffName
    );
    return {
      success: true,
      message: result.message,
      data: result.order,
    };
  }

  // ---------------------------------------------------------------------------
  // 4. DELIVERY PROVIDERS & OMNICHANNEL HISTORY
  // ---------------------------------------------------------------------------

  @Get('delivery/providers')
  async getDeliveryProviders(
    @Query('pincode') pincode = '500033',
    @Query('weightKg') weightKg = '0.5'
  ) {
    const estimates = await this.deliveryService.getAvailableProviders(
      pincode,
      Number(weightKg)
    );
    return {
      success: true,
      data: estimates,
    };
  }

  @Get('customers/:customerId/omnichannel-history')
  async getOmnichannelHistory(@Param('customerId') customerId: string) {
    const history = await this.ecommerceService.getOmnichannelCustomerHistory(customerId);
    return {
      success: true,
      count: history.length,
      data: history,
    };
  }
}
