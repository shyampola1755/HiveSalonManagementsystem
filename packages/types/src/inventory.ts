/**
 * Phase 8: Inventory, Procurement, Stock Ledger & Service Consumption Types
 */

export type ProductUnit = 'ml' | 'g' | 'unit' | 'oz' | 'bottle' | 'pcs';

export type StockMovementType =
  | 'PURCHASE'
  | 'SALE'
  | 'SERVICE_CONSUMPTION'
  | 'TRANSFER_OUT'
  | 'TRANSFER_IN'
  | 'ADJUSTMENT'
  | 'DAMAGE'
  | 'EXPIRY'
  | 'RETURN'
  | 'OPENING_STOCK';

export type StockLevelStatus = 'OK' | 'LOW_STOCK' | 'CRITICAL' | 'OUT_OF_STOCK';

export type ExpiryAlertCategory =
  | 'EXPIRED'
  | 'EXPIRES_TODAY'
  | 'EXPIRES_7_DAYS'
  | 'EXPIRES_30_DAYS'
  | 'GOOD';

export type PurchaseOrderStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'APPROVED'
  | 'RECEIVED'
  | 'CANCELLED'
  | 'REJECTED';

export type BranchTransferStatus =
  | 'REQUESTED'
  | 'APPROVED'
  | 'DISPATCHED'
  | 'IN_TRANSIT'
  | 'RECEIVED'
  | 'CANCELLED'
  | 'REJECTED';

export type VendorInvoiceStatus = 'UNPAID' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE';

// -----------------------------------------------------------------------------
// 1. PRODUCTS & CATEGORIES
// -----------------------------------------------------------------------------

export interface ProductCategoryDetail {
  id: string;
  organizationId: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductDetail {
  id: string;
  organizationId: string;
  categoryId?: string | null;
  categoryName?: string | null;
  name: string;
  sku: string;
  barcode?: string | null;
  brand?: string | null;
  costPrice: number;
  sellingPrice: number;
  retailPrice: number;
  taxRate: number;
  minThreshold: number;
  isRetail: boolean;
  isBackbar: boolean;
  unit: ProductUnit | string;
  batchNumber?: string | null;
  expiryDate?: string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED';
  totalStockOnHand?: number;
  totalStockValueCost?: number;
  totalStockValueRetail?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  sku: string;
  barcode?: string;
  categoryId?: string;
  brand?: string;
  costPrice: number;
  sellingPrice: number;
  retailPrice?: number;
  taxRate?: number;
  minThreshold?: number;
  isRetail?: boolean;
  isBackbar?: boolean;
  unit: ProductUnit | string;
  batchNumber?: string;
  expiryDate?: string;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {
  status?: 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED';
}

// -----------------------------------------------------------------------------
// 2. BRANCH INVENTORY & STOCK MATRIX
// -----------------------------------------------------------------------------

export interface BranchStockDetail {
  id: string;
  branchId: string;
  branchName: string;
  branchCode: string;
  productId: string;
  productName: string;
  productSku: string;
  productBrand?: string | null;
  productUnit: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  reorderThreshold: number;
  batchNumber?: string | null;
  expiryDate?: string | null;
  lastCostPrice?: number | null;
  stockLevelStatus: StockLevelStatus;
  expiryStatus: ExpiryAlertCategory;
  daysUntilExpiry?: number | null;
  updatedAt: string;
}

// -----------------------------------------------------------------------------
// 3. STOCK LEDGER (DOUBLE-ENTRY AUDIT TRAIL)
// -----------------------------------------------------------------------------

export interface StockLedgerRecord {
  id: string;
  organizationId: string;
  branchId: string;
  branchName: string;
  productId: string;
  productName: string;
  productSku: string;
  productUnit: string;
  batchNumber?: string | null;
  movementType: StockMovementType;
  quantity: number; // Signed (+ or -)
  balanceBefore: number;
  balanceAfter: number;
  unitCost: number;
  totalCost: number;
  referenceType?: string | null; // PURCHASE_ORDER, INVOICE, APPOINTMENT, TRANSFER, MANUAL_ADJUSTMENT, DAMAGE_WRITE_OFF, EXPIRY_AUDIT
  referenceId?: string | null; // e.g. PO-001, HYD-JUB-2026-000001, APT-001, TR-001
  notes?: string | null;
  performedByUserId?: string | null;
  performedByName?: string | null;
  createdAt: string;
}

export interface StockAdjustmentPayload {
  branchId: string;
  productId: string;
  movementType: 'ADJUSTMENT' | 'DAMAGE' | 'EXPIRY' | 'RETURN' | 'OPENING_STOCK';
  quantityChange: number; // Positive or negative
  batchNumber?: string;
  unitCost?: number;
  referenceId?: string;
  notes: string;
  performedByName?: string;
}

// -----------------------------------------------------------------------------
// 4. SERVICE RECIPES & AUTO-CONSUMPTION
// -----------------------------------------------------------------------------

export interface ServiceRecipeItemDetail {
  id: string;
  recipeId: string;
  productId: string;
  productName: string;
  productSku: string;
  productBrand?: string | null;
  quantity: number; // e.g. 60.00
  unit: ProductUnit | string; // e.g. ml
  notes?: string | null;
  isOptional: boolean;
  costPerUnit?: number;
  totalItemCost?: number;
}

export interface ServiceRecipeDetail {
  id: string;
  organizationId: string;
  serviceId: string;
  serviceName: string;
  categoryName?: string | null;
  name: string;
  description?: string | null;
  isActive: boolean;
  items: ServiceRecipeItemDetail[];
  totalFormulaCost: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRecipeItemDto {
  productId: string;
  quantity: number;
  unit: ProductUnit | string;
  notes?: string;
  isOptional?: boolean;
}

export interface CreateRecipeDto {
  serviceId: string;
  name: string;
  description?: string;
  isActive?: boolean;
  items: CreateRecipeItemDto[];
}

export interface ServiceConsumptionPayload {
  branchId: string;
  serviceId: string;
  appointmentId?: string;
  invoiceId?: string;
  stylistId?: string;
  stylistName?: string;
  overrides?: Array<{
    productId: string;
    quantityUsed: number;
    unit: string;
    batchNumber?: string;
  }>;
  notes?: string;
}

export interface ConsumptionResultRecord {
  serviceId: string;
  serviceName: string;
  branchId: string;
  consumedItems: Array<{
    productId: string;
    productName: string;
    quantityDeducted: number;
    unit: string;
    balanceBefore: number;
    balanceAfter: number;
    ledgerEntryId: string;
  }>;
  totalCostDeducted: number;
  consumedAt: string;
}

// -----------------------------------------------------------------------------
// 5. LOW STOCK & EXPIRY ALERTS
// -----------------------------------------------------------------------------

export interface LowStockAlertItem {
  branchId: string;
  branchName: string;
  productId: string;
  productName: string;
  productSku: string;
  productBrand?: string | null;
  unit: string;
  currentStock: number;
  availableStock: number;
  reorderThreshold: number;
  deficitQuantity: number;
  status: 'LOW_STOCK' | 'CRITICAL' | 'OUT_OF_STOCK';
  suggestedVendorId?: string | null;
  suggestedVendorName?: string | null;
  estimatedReorderCost: number;
}

export interface ExpiryAlertItem {
  branchId: string;
  branchName: string;
  productId: string;
  productName: string;
  productSku: string;
  productBrand?: string | null;
  batchNumber?: string | null;
  currentStock: number;
  unit: string;
  expiryDate: string;
  daysRemaining: number;
  category: ExpiryAlertCategory;
  totalValueAtRisk: number;
}

// -----------------------------------------------------------------------------
// 6. PURCHASE ORDERS & PROCUREMENT
// -----------------------------------------------------------------------------

export interface PurchaseOrderItemDetail {
  id: string;
  purchaseOrderId: string;
  productId: string;
  productName: string;
  productSku: string;
  productUnit: string;
  quantityOrdered: number;
  quantityReceived: number;
  unitCost: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  batchNumber?: string | null;
  expiryDate?: string | null;
}

export interface PurchaseOrderDetail {
  id: string;
  organizationId: string;
  branchId: string;
  branchName: string;
  vendorId: string;
  vendorName: string;
  vendorCode: string;
  poNumber: string; // e.g. PO-HYD-2026-0001
  status: PurchaseOrderStatus;
  orderDate: string;
  expectedDeliveryDate?: string | null;
  receivedDate?: string | null;
  subtotal: number;
  taxTotal: number;
  shippingCost: number;
  grandTotal: number;
  notes?: string | null;
  approvedByUserId?: string | null;
  approvedByName?: string | null;
  approvedAt?: string | null;
  receivedByUserId?: string | null;
  receivedByName?: string | null;
  items: PurchaseOrderItemDetail[];
  invoicesCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePurchaseOrderDto {
  branchId: string;
  vendorId: string;
  expectedDeliveryDate?: string;
  shippingCost?: number;
  notes?: string;
  items: Array<{
    productId: string;
    quantityOrdered: number;
    unitCost: number;
    taxRate?: number;
    batchNumber?: string;
    expiryDate?: string;
  }>;
}

export interface ReceivePurchaseOrderPayload {
  receivedDate?: string;
  receivedByName?: string;
  notes?: string;
  receivedItems: Array<{
    productId: string;
    quantityReceived: number;
    batchNumber?: string;
    expiryDate?: string;
    unitCost?: number;
  }>;
}

// -----------------------------------------------------------------------------
// 7. VENDORS & SUPPLIER CRM
// -----------------------------------------------------------------------------

export interface VendorProductDetail {
  id: string;
  vendorId: string;
  productId: string;
  productName: string;
  productSku: string;
  vendorSku?: string | null;
  unitPrice: number;
  leadTimeDays: number;
  isPreferred: boolean;
}

export interface VendorInvoiceDetail {
  id: string;
  organizationId: string;
  vendorId: string;
  vendorName: string;
  purchaseOrderId?: string | null;
  poNumber?: string | null;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate?: string | null;
  amount: number;
  paidAmount: number;
  balanceAmount: number;
  status: VendorInvoiceStatus;
  paymentMode?: string | null;
  paidAt?: string | null;
  createdAt: string;
}

export interface VendorDetail {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  contactPerson?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  gstin?: string | null;
  paymentTerms: string; // Net 30, Net 15, COD, Advance
  bankDetails?: Record<string, any> | null;
  status: 'ACTIVE' | 'INACTIVE';
  notes?: string | null;
  totalPurchasesCount: number;
  totalPurchasesValue: number;
  unpaidBalance: number;
  products: VendorProductDetail[];
  invoices: VendorInvoiceDetail[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateVendorDto {
  name: string;
  code: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  gstin?: string;
  paymentTerms?: string;
  bankDetails?: Record<string, any>;
  notes?: string;
}

// -----------------------------------------------------------------------------
// 8. INTER-BRANCH TRANSFERS
// -----------------------------------------------------------------------------

export interface BranchTransferItemDetail {
  id: string;
  transferId: string;
  productId: string;
  productName: string;
  productSku: string;
  productUnit: string;
  quantityRequested: number;
  quantityDispatched: number;
  quantityReceived: number;
  batchNumber?: string | null;
  unitCost: number;
}

export interface BranchTransferDetail {
  id: string;
  organizationId: string;
  transferNumber: string; // TR-2026-0001
  sourceBranchId: string;
  sourceBranchName: string;
  destinationBranchId: string;
  destinationBranchName: string;
  status: BranchTransferStatus;
  requestedByUserId?: string | null;
  requestedByName?: string | null;
  requestedAt: string;
  approvedByUserId?: string | null;
  approvedByName?: string | null;
  approvedAt?: string | null;
  dispatchedByUserId?: string | null;
  dispatchedByName?: string | null;
  dispatchedAt?: string | null;
  receivedByUserId?: string | null;
  receivedByName?: string | null;
  receivedAt?: string | null;
  trackingNumber?: string | null;
  transportMode?: string | null;
  notes?: string | null;
  items: BranchTransferItemDetail[];
  totalItemsCount: number;
  totalTransferValue: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransferDto {
  sourceBranchId: string;
  destinationBranchId: string;
  transportMode?: string;
  notes?: string;
  items: Array<{
    productId: string;
    quantityRequested: number;
  }>;
}

// -----------------------------------------------------------------------------
// 9. INVENTORY DASHBOARD KPIS & ANALYTICS
// -----------------------------------------------------------------------------

export interface TopProductConsumed {
  productId: string;
  productName: string;
  productSku: string;
  brand?: string | null;
  totalConsumedQty: number;
  unit: string;
  totalConsumedValue: number;
  servicesCount: number;
}

export interface TopProductSold {
  productId: string;
  productName: string;
  productSku: string;
  brand?: string | null;
  totalSoldQty: number;
  unit: string;
  totalSalesValue: number;
  invoicesCount: number;
}

export interface InventoryDashboardKpis {
  totalStockValueCost: number;
  totalStockValueRetail: number;
  totalSkuCount: number;
  lowStockItemsCount: number;
  criticalStockItemsCount: number;
  outOfStockItemsCount: number;
  expiringItemsCount: {
    expired: number;
    expiresToday: number;
    expires7Days: number;
    expires30Days: number;
    totalAtRiskValue: number;
  };
  totalMonthlyPurchaseValue: number;
  pendingPurchaseOrdersCount: number;
  activeTransfersInTransitValue: number;
  activeTransfersCount: number;
  topConsumedProducts: TopProductConsumed[];
  topSoldProducts: TopProductSold[];
}
