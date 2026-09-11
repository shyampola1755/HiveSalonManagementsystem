/**
 * Phase 15: Retail E-Commerce & Omnichannel Sales Domain Types
 */

export type OrderStatus =
  | 'PLACED'
  | 'CONFIRMED'
  | 'PACKED'
  | 'READY_FOR_PICKUP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED';

export type FulfillmentType = 'BRANCH_PICKUP' | 'HOME_DELIVERY';

export type DeliveryProviderId =
  | 'INTERNAL_FLEET'
  | 'DUNZO'
  | 'SHADOWFAX'
  | 'DELHIVERY'
  | 'BLUEDART';

export type PaymentStatus = 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED';

export type RetailPaymentMethod =
  | 'UPI'
  | 'CARD'
  | 'WALLET'
  | 'NETBANKING'
  | 'PAY_ON_PICKUP'
  | 'COD';

export interface RetailProductUsageStep {
  stepNumber: number;
  title: string;
  instruction: string;
  stylistTip?: string;
}

export interface RetailProduct {
  id: string;
  organizationId: string;
  categoryId: string;
  categoryName: string;
  name: string;
  sku: string;
  barcode?: string | null;
  brand: string;
  price: number;
  mrp: number; // Maximum Retail Price (original price before discount)
  discountPercentage: number;
  taxRate: number; // GST (e.g. 18%)
  shortDescription: string;
  description: string;
  benefits: string[]; // Key salon benefits (e.g. "72h Anti-Frizz", "Thermal Shield up to 230°C")
  usageInstructions: RetailProductUsageStep[];
  ingredients?: string[];
  volumeSize: string; // e.g. "250 ml", "100 g", "Set of 3"
  imageUrl: string;
  galleryImages: string[];
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isOrganicOrVegan?: boolean;
  isSulfateFree?: boolean;
  hairOrSkinTarget: string[]; // e.g. ["Color-Treated", "Dry / Damaged", "Curly Hair"]
  recommendedServicePairing?: {
    serviceId: string;
    serviceName: string;
    pairingReason: string;
  };
  
  // Stock Availability per Branch (Strict Never-Oversell)
  totalAvailableStock: number;
  branchStockMatrix: Record<
    string,
    {
      branchId: string;
      branchName: string;
      branchCode: string;
      currentStock: number;
      reservedStock: number;
      availableStock: number;
      inStock: boolean;
    }
  >;
  
  createdAt: string;
  updatedAt: string;
}

export interface RetailCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  imageUrl?: string;
  productCount: number;
}

export interface CartItem {
  productId: string;
  product: RetailProduct;
  quantity: number;
  unitPrice: number;
  mrp: number;
  taxRate: number;
  taxAmount: number;
  totalPrice: number;
  selectedBranchId?: string; // Branch chosen for local stock fulfillment
}

export interface CartSummary {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  mrpTotal: number;
  totalSavings: number;
  taxTotal: number;
  estimatedDeliveryFee: number;
  grandTotal: number;
  appliedCoupon?: {
    code: string;
    discountAmount: number;
    description: string;
  };
  walletCreditsApplied?: number;
  loyaltyPointsRedeemed?: number;
  loyaltyDiscountAmount?: number;
  finalPayable: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface RetailOrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productSku: string;
  productBrand: string;
  productImageUrl: string;
  volumeSize: string;
  quantity: number;
  unitPrice: number;
  mrp: number;
  taxRate: number;
  taxAmount: number;
  totalPrice: number;
}

export interface OrderStatusHistoryItem {
  id: string;
  status: OrderStatus;
  timestamp: string;
  title: string;
  description: string;
  updatedBy?: string;
  location?: string;
}

export interface DeliveryTrackingCheckpoint {
  timestamp: string;
  status: string;
  location: string;
  description: string;
}

export interface RetailOrder {
  id: string;
  orderNumber: string; // e.g. "HIVE-ORD-2026-00892"
  organizationId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  
  // Fulfillment Details
  fulfillmentType: FulfillmentType;
  
  // For Branch Pickup
  pickupBranchId?: string | null;
  pickupBranchName?: string | null;
  pickupBranchAddress?: string | null;
  pickupBranchPhone?: string | null;
  pickupDate?: string | null; // e.g. "2026-09-12"
  pickupSlot?: string | null; // e.g. "11:00 AM – 02:00 PM"
  pickupOtp?: string | null; // 4-digit verification code e.g. "4921"
  pickupQrCodeUrl?: string | null;
  readyForPickupAt?: string | null;
  collectedAt?: string | null;
  verifiedByStaffId?: string | null;
  verifiedByStaffName?: string | null;
  
  // For Home Delivery
  shippingAddress?: ShippingAddress | null;
  deliveryProvider?: DeliveryProviderId | null;
  deliveryProviderName?: string | null;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
  estimatedDeliveryDate?: string | null;
  dispatchedAt?: string | null;
  deliveredAt?: string | null;
  deliveryCheckpoints?: DeliveryTrackingCheckpoint[];
  
  // Financial Breakdown
  items: RetailOrderItem[];
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  couponCode?: string | null;
  couponDiscount?: number;
  loyaltyPointsRedeemed?: number;
  loyaltyDiscountAmount?: number;
  walletDebitedAmount?: number;
  deliveryFee: number;
  grandTotal: number;
  finalPaidAmount: number;
  
  // Payment
  paymentStatus: PaymentStatus;
  paymentMethod: RetailPaymentMethod;
  transactionReference?: string | null;
  
  // Status Lifecycle
  status: OrderStatus;
  statusHistory: OrderStatusHistoryItem[];
  
  notes?: string | null;
  packingSlipGeneratedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRetailOrderDto {
  organizationId?: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  fulfillmentType: FulfillmentType;
  pickupBranchId?: string;
  pickupDate?: string;
  pickupSlot?: string;
  shippingAddress?: ShippingAddress;
  deliveryProviderId?: DeliveryProviderId;
  items: Array<{
    productId: string;
    quantity: number;
    selectedBranchId?: string;
  }>;
  couponCode?: string;
  walletDeductionAmount?: number;
  loyaltyPointsToRedeem?: number;
  paymentMethod: RetailPaymentMethod;
  notes?: string;
}

export interface DeliveryProviderEstimate {
  providerId: DeliveryProviderId;
  providerName: string;
  serviceLevel: 'SAME_DAY' | 'EXPRESS_24H' | 'STANDARD_SURFACE' | 'PRIORITY_AIR';
  estimatedDays: string;
  shippingFee: number;
  isAvailable: boolean;
  description: string;
  cutoffTimeNotice?: string;
}

export interface DeliveryShipmentPayload {
  orderId: string;
  providerId: DeliveryProviderId;
  pickupBranchId: string;
  shippingAddress: ShippingAddress;
  weightKg: number;
  packageDimensions?: { lengthCm: number; widthCm: number; heightCm: number };
}

export interface DeliveryShipmentResult {
  success: boolean;
  trackingNumber: string;
  carrier: DeliveryProviderId;
  carrierName: string;
  trackingUrl: string;
  labelPdfUrl: string;
  estimatedDelivery: string;
}

export interface StockValidationItem {
  productId: string;
  requestedQuantity: number;
  branchId: string;
}

export interface StockValidationResult {
  isValid: boolean;
  oversoldItems: Array<{
    productId: string;
    productName: string;
    branchId: string;
    branchName: string;
    requestedQuantity: number;
    availableStock: number;
  }>;
}

export interface OmnichannelCustomerTimelineEvent {
  id: string;
  customerId: string;
  channel: 'SALON_SERVICE' | 'POS_PURCHASE' | 'ONLINE_ORDER';
  eventType: string;
  title: string;
  description: string;
  referenceId?: string;
  amount?: number;
  status?: string;
  branchName?: string;
  itemsSummary?: string;
  occurredAt: string;
}
