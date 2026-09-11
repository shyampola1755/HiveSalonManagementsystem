import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import type {
  ProductDetail,
  CreateProductDto,
  UpdateProductDto,
  BranchStockDetail,
  StockLedgerRecord,
  StockAdjustmentPayload,
  ServiceRecipeDetail,
  CreateRecipeDto,
  ServiceConsumptionPayload,
  ConsumptionResultRecord,
  LowStockAlertItem,
  ExpiryAlertItem,
  PurchaseOrderDetail,
  CreatePurchaseOrderDto,
  ReceivePurchaseOrderPayload,
  VendorDetail,
  CreateVendorDto,
  BranchTransferDetail,
  CreateTransferDto,
  InventoryDashboardKpis,
  TopProductConsumed,
  TopProductSold,
  ExpiryAlertCategory,
  StockLevelStatus,
} from '@hive/types';

@Injectable()
export class InventoryService {
  private productsDb = new Map<string, ProductDetail>();
  private branchStocksDb = new Map<string, BranchStockDetail>(); // `${branchId}_${productId}` -> BranchStockDetail
  private stockLedgerDb: StockLedgerRecord[] = [];
  private recipesDb = new Map<string, ServiceRecipeDetail>(); // serviceId -> ServiceRecipeDetail
  private vendorsDb = new Map<string, VendorDetail>();
  private purchaseOrdersDb = new Map<string, PurchaseOrderDetail>();
  private branchTransfersDb = new Map<string, BranchTransferDetail>();

  private branchNames: Record<string, { name: string; code: string }> = {
    'br-jubilee': { name: 'Jubilee Hills Flagship', code: 'HYD-JUB' },
    'br-banjara': { name: 'Banjara Hills Spa & Lounge', code: 'HYD-BAN' },
    'br-hitech': { name: 'Hitech City Express', code: 'HYD-HIT' },
    'br-indiranagar': { name: 'Indiranagar Sanctuary', code: 'BLR-IND' },
  };

  private poSequence = 100;
  private transferSequence = 100;

  constructor() {
    this.seedInitialInventoryData();
  }

  // ---------------------------------------------------------------------------
  // 1. SEED DATA INITIALIZATION
  // ---------------------------------------------------------------------------
  private seedInitialInventoryData() {
    const orgId = 'org_hive_demo';
    const now = new Date();

    // 1. Seed Products
    const products: ProductDetail[] = [
      {
        id: 'prod-001',
        organizationId: orgId,
        categoryId: 'cat-color',
        categoryName: 'Hair Color & Lighteners',
        name: "L'Oréal Majirel Cool Mocha 6.13",
        sku: 'LOR-MAJ-613',
        barcode: '890123456001',
        brand: "L'Oréal Professionnel",
        costPrice: 480,
        sellingPrice: 750,
        retailPrice: 750,
        taxRate: 18,
        minThreshold: 10,
        isRetail: false,
        isBackbar: true,
        unit: 'ml',
        batchNumber: 'BAT-2026-09A',
        expiryDate: new Date(now.getTime() + 180 * 86400000).toISOString().split('T')[0],
        status: 'ACTIVE',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        id: 'prod-002',
        organizationId: orgId,
        categoryId: 'cat-color',
        categoryName: 'Hair Color & Lighteners',
        name: "L'Oréal Oxydant Cream 20 Vol (6%) Developer",
        sku: 'LOR-OXY-20V',
        barcode: '890123456002',
        brand: "L'Oréal Professionnel",
        costPrice: 380,
        sellingPrice: 550,
        retailPrice: 550,
        taxRate: 18,
        minThreshold: 15,
        isRetail: false,
        isBackbar: true,
        unit: 'ml',
        batchNumber: 'BAT-2026-08B',
        expiryDate: new Date(now.getTime() + 240 * 86400000).toISOString().split('T')[0],
        status: 'ACTIVE',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        id: 'prod-003',
        organizationId: orgId,
        categoryId: 'cat-treatment',
        categoryName: 'Hair Treatments',
        name: 'Olaplex No. 1 Bond Multiplier Professional',
        sku: 'OLA-BOND-N1',
        barcode: '890123456003',
        brand: 'Olaplex',
        costPrice: 3200,
        sellingPrice: 4800,
        retailPrice: 4800,
        taxRate: 18,
        minThreshold: 4,
        isRetail: false,
        isBackbar: true,
        unit: 'ml',
        batchNumber: 'BAT-OLA-441',
        expiryDate: new Date(now.getTime() + 365 * 86400000).toISOString().split('T')[0],
        status: 'ACTIVE',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        id: 'prod-004',
        organizationId: orgId,
        categoryId: 'cat-retail',
        categoryName: 'Hair Care & Retail',
        name: 'Kérastase Elixir Ultime L’Huile Original Hair Oil 100ml',
        sku: 'KER-ELX-100',
        barcode: '890123456004',
        brand: 'Kérastase',
        costPrice: 2400,
        sellingPrice: 3900,
        retailPrice: 3900,
        taxRate: 18,
        minThreshold: 8,
        isRetail: true,
        isBackbar: false,
        unit: 'bottle',
        batchNumber: 'BAT-KER-902',
        expiryDate: new Date(now.getTime() + 450 * 86400000).toISOString().split('T')[0],
        status: 'ACTIVE',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        id: 'prod-005',
        organizationId: orgId,
        categoryId: 'cat-skin',
        categoryName: 'Skin & Aesthetics',
        name: 'Dermalogica Active Moist Hydrating Face Cream',
        sku: 'DER-ACT-MST',
        barcode: '890123456005',
        brand: 'Dermalogica',
        costPrice: 1650,
        sellingPrice: 2850,
        retailPrice: 2850,
        taxRate: 18,
        minThreshold: 6,
        isRetail: true,
        isBackbar: true,
        unit: 'ml',
        batchNumber: 'BAT-DER-119',
        expiryDate: new Date(now.getTime() + 5 * 86400000).toISOString().split('T')[0], // Expires in 5 days (Alert test!)
        status: 'ACTIVE',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        id: 'prod-006',
        organizationId: orgId,
        categoryId: 'cat-spa',
        categoryName: 'Spa & Body Care',
        name: 'Aromatherapy Lavender & Eucalyptus Massage Oil',
        sku: 'SPA-LAV-OIL',
        barcode: '890123456006',
        brand: 'Hive Sanctuary Spa',
        costPrice: 550,
        sellingPrice: 1100,
        retailPrice: 1100,
        taxRate: 18,
        minThreshold: 12,
        isRetail: true,
        isBackbar: true,
        unit: 'ml',
        batchNumber: 'BAT-SPA-080',
        expiryDate: new Date(now.getTime() - 2 * 86400000).toISOString().split('T')[0], // Expired 2 days ago (Alert test!)
        status: 'ACTIVE',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        id: 'prod-007',
        organizationId: orgId,
        categoryId: 'cat-nails',
        categoryName: 'Nail Studio',
        name: 'OPI GelColor Big Apple Red Lacquer 15ml',
        sku: 'OPI-GEL-BAR',
        barcode: '890123456007',
        brand: 'OPI Professional',
        costPrice: 720,
        sellingPrice: 1250,
        retailPrice: 1250,
        taxRate: 18,
        minThreshold: 5,
        isRetail: true,
        isBackbar: true,
        unit: 'bottle',
        batchNumber: 'BAT-OPI-334',
        expiryDate: new Date(now.getTime() + 300 * 86400000).toISOString().split('T')[0],
        status: 'ACTIVE',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        id: 'prod-008',
        organizationId: orgId,
        categoryId: 'cat-color',
        categoryName: 'Hair Color & Lighteners',
        name: 'Wella Blondor Multi Blonde Dust-Free Lightening Powder 800g',
        sku: 'WEL-BLD-800',
        barcode: '890123456008',
        brand: 'Wella Professionals',
        costPrice: 2100,
        sellingPrice: 3200,
        retailPrice: 3200,
        taxRate: 18,
        minThreshold: 4,
        isRetail: false,
        isBackbar: true,
        unit: 'g',
        batchNumber: 'BAT-WEL-511',
        expiryDate: new Date(now.getTime() + 18 * 86400000).toISOString().split('T')[0], // Expires in 18 days
        status: 'ACTIVE',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
    ];

    products.forEach((p) => this.productsDb.set(p.id, p));

    // 2. Seed Vendors
    const vendors: VendorDetail[] = [
      {
        id: 'ven-001',
        organizationId: orgId,
        name: "L'Oréal India Enterprise Distribution",
        code: 'VEN-LOR-01',
        contactPerson: 'Rajesh Khanna',
        phone: '+91 98200 11223',
        email: 'orders@loreal-distribution.in',
        address: 'Plot 45, MIDC Industrial Area, Andheri East',
        city: 'Mumbai',
        gstin: '27AAACL1234F1Z1',
        paymentTerms: 'Net 30',
        status: 'ACTIVE',
        totalPurchasesCount: 14,
        totalPurchasesValue: 485000,
        unpaidBalance: 42500,
        products: [
          {
            id: 'vp-1',
            vendorId: 'ven-001',
            productId: 'prod-001',
            productName: "L'Oréal Majirel Cool Mocha 6.13",
            productSku: 'LOR-MAJ-613',
            vendorSku: 'LOR-DIST-613',
            unitPrice: 480,
            leadTimeDays: 2,
            isPreferred: true,
          },
          {
            id: 'vp-2',
            vendorId: 'ven-001',
            productId: 'prod-002',
            productName: "L'Oréal Oxydant Cream 20 Vol (6%) Developer",
            productSku: 'LOR-OXY-20V',
            vendorSku: 'LOR-DIST-OXY20',
            unitPrice: 380,
            leadTimeDays: 2,
            isPreferred: true,
          },
        ],
        invoices: [
          {
            id: 'vi-1',
            organizationId: orgId,
            vendorId: 'ven-001',
            vendorName: "L'Oréal India Enterprise Distribution",
            purchaseOrderId: 'po-001',
            poNumber: 'PO-HYD-2026-0001',
            invoiceNumber: 'INV-LOR-99812',
            invoiceDate: new Date(now.getTime() - 10 * 86400000).toISOString(),
            dueDate: new Date(now.getTime() + 20 * 86400000).toISOString(),
            amount: 42500,
            paidAmount: 0,
            balanceAmount: 42500,
            status: 'UNPAID',
            createdAt: now.toISOString(),
          },
        ],
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        id: 'ven-002',
        organizationId: orgId,
        name: 'Wella Professional Care Supplies',
        code: 'VEN-WEL-02',
        contactPerson: 'Sunita Menon',
        phone: '+91 98450 33445',
        email: 'sales@wellaindia.com',
        address: 'B-12 Brigade Towers, MG Road',
        city: 'Bengaluru',
        gstin: '29AAACW5678G1Z3',
        paymentTerms: 'Net 15',
        status: 'ACTIVE',
        totalPurchasesCount: 8,
        totalPurchasesValue: 210000,
        unpaidBalance: 0,
        products: [
          {
            id: 'vp-3',
            vendorId: 'ven-002',
            productId: 'prod-008',
            productName: 'Wella Blondor Multi Blonde Dust-Free Lightening Powder 800g',
            productSku: 'WEL-BLD-800',
            vendorSku: 'WEL-BLD-01',
            unitPrice: 2100,
            leadTimeDays: 3,
            isPreferred: true,
          },
        ],
        invoices: [],
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        id: 'ven-003',
        organizationId: orgId,
        name: 'Dermalogica Aesthetics Direct',
        code: 'VEN-DER-03',
        contactPerson: 'Amitabh Sen',
        phone: '+91 99100 88776',
        email: 'procurement@dermalogica.in',
        address: 'Sector 44, Institutional Area',
        city: 'Gurugram',
        gstin: '06AAACD9900H1Z8',
        paymentTerms: 'Net 30',
        status: 'ACTIVE',
        totalPurchasesCount: 6,
        totalPurchasesValue: 180000,
        unpaidBalance: 18500,
        products: [
          {
            id: 'vp-4',
            vendorId: 'ven-003',
            productId: 'prod-005',
            productName: 'Dermalogica Active Moist Hydrating Face Cream',
            productSku: 'DER-ACT-MST',
            vendorSku: 'DERM-MOIST-50',
            unitPrice: 1650,
            leadTimeDays: 4,
            isPreferred: true,
          },
        ],
        invoices: [
          {
            id: 'vi-2',
            organizationId: orgId,
            vendorId: 'ven-003',
            vendorName: 'Dermalogica Aesthetics Direct',
            purchaseOrderId: 'po-003',
            poNumber: 'PO-BLR-2026-0003',
            invoiceNumber: 'INV-DER-4412',
            invoiceDate: new Date(now.getTime() - 25 * 86400000).toISOString(),
            dueDate: new Date(now.getTime() + 5 * 86400000).toISOString(),
            amount: 18500,
            paidAmount: 0,
            balanceAmount: 18500,
            status: 'UNPAID',
            createdAt: now.toISOString(),
          },
        ],
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
    ];

    vendors.forEach((v) => this.vendorsDb.set(v.id, v));

    // 3. Seed Branch Stocks & Stock Ledger Entries
    const branches = ['br-jubilee', 'br-banjara', 'br-hitech', 'br-indiranagar'];
    const stockQuantities: Record<string, Record<string, { current: number; reserved: number; min: number }>> = {
      'br-jubilee': {
        'prod-001': { current: 1800, reserved: 200, min: 500 }, // 1800 ml (30 tubes)
        'prod-002': { current: 3500, reserved: 300, min: 1000 }, // 3500 ml
        'prod-003': { current: 450, reserved: 50, min: 200 }, // 450 ml
        'prod-004': { current: 14, reserved: 2, min: 6 }, // 14 bottles
        'prod-005': { current: 150, reserved: 30, min: 200 }, // Low Stock! (150 <= 200)
        'prod-006': { current: 400, reserved: 0, min: 300 }, // Expired item!
        'prod-007': { current: 2, reserved: 0, min: 5 }, // Critical stock! (2 <= 5)
        'prod-008': { current: 0, reserved: 0, min: 800 }, // Out of stock!
      },
      'br-banjara': {
        'prod-001': { current: 950, reserved: 100, min: 400 },
        'prod-002': { current: 2200, reserved: 200, min: 800 },
        'prod-003': { current: 300, reserved: 20, min: 150 },
        'prod-004': { current: 8, reserved: 1, min: 5 },
        'prod-005': { current: 350, reserved: 20, min: 150 },
        'prod-006': { current: 800, reserved: 50, min: 250 },
        'prod-007': { current: 6, reserved: 1, min: 4 },
        'prod-008': { current: 1200, reserved: 100, min: 500 },
      },
      'br-hitech': {
        'prod-001': { current: 300, reserved: 50, min: 400 }, // Low stock
        'prod-002': { current: 1100, reserved: 100, min: 600 },
        'prod-003': { current: 150, reserved: 0, min: 100 },
        'prod-004': { current: 3, reserved: 0, min: 4 }, // Low stock
        'prod-005': { current: 100, reserved: 10, min: 150 }, // Low stock
        'prod-006': { current: 250, reserved: 20, min: 200 },
        'prod-007': { current: 4, reserved: 0, min: 3 },
        'prod-008': { current: 400, reserved: 50, min: 400 },
      },
      'br-indiranagar': {
        'prod-001': { current: 1200, reserved: 150, min: 450 },
        'prod-002': { current: 2800, reserved: 250, min: 900 },
        'prod-003': { current: 350, reserved: 40, min: 180 },
        'prod-004': { current: 10, reserved: 2, min: 5 },
        'prod-005': { current: 280, reserved: 30, min: 150 },
        'prod-006': { current: 600, reserved: 40, min: 250 },
        'prod-007': { current: 8, reserved: 1, min: 4 },
        'prod-008': { current: 1600, reserved: 200, min: 600 },
      },
    };

    branches.forEach((bId) => {
      const bInfo = this.branchNames[bId];
      products.forEach((prod) => {
        const entry = stockQuantities[bId]?.[prod.id] || { current: 10, reserved: 0, min: 5 };
        const available = Math.max(0, entry.current - entry.reserved);
        const stockStatus = this.calculateStockStatus(available, entry.min);
        const expiryStatus = this.calculateExpiryStatus(prod.expiryDate);
        const daysRemaining = prod.expiryDate
          ? Math.ceil((new Date(prod.expiryDate).getTime() - now.getTime()) / 86400000)
          : null;

        const stockId = `${bId}_${prod.id}`;
        const stockDetail: BranchStockDetail = {
          id: stockId,
          branchId: bId,
          branchName: bInfo.name,
          branchCode: bInfo.code,
          productId: prod.id,
          productName: prod.name,
          productSku: prod.sku,
          productBrand: prod.brand,
          productUnit: prod.unit,
          currentStock: entry.current,
          reservedStock: entry.reserved,
          availableStock: available,
          reorderThreshold: entry.min,
          batchNumber: prod.batchNumber,
          expiryDate: prod.expiryDate,
          lastCostPrice: prod.costPrice,
          stockLevelStatus: stockStatus,
          expiryStatus: expiryStatus,
          daysUntilExpiry: daysRemaining,
          updatedAt: now.toISOString(),
        };

        this.branchStocksDb.set(stockId, stockDetail);

        // Initial Opening Stock ledger record
        this.stockLedgerDb.push({
          id: `ledger-seed-${bId}-${prod.id}`,
          organizationId: orgId,
          branchId: bId,
          branchName: bInfo.name,
          productId: prod.id,
          productName: prod.name,
          productSku: prod.sku,
          productUnit: prod.unit,
          batchNumber: prod.batchNumber,
          movementType: 'OPENING_STOCK',
          quantity: entry.current,
          balanceBefore: 0,
          balanceAfter: entry.current,
          unitCost: prod.costPrice,
          totalCost: entry.current * prod.costPrice,
          referenceType: 'OPENING_STOCK_AUDIT',
          referenceId: 'AUDIT-INIT-2026',
          notes: 'Initial enterprise stock intake verification.',
          performedByName: 'System Setup Engine',
          createdAt: new Date(now.getTime() - 15 * 86400000).toISOString(),
        });
      });
    });

    // 4. Seed Service Recipes
    const recipes: ServiceRecipeDetail[] = [
      {
        id: 'rec-001',
        organizationId: orgId,
        serviceId: 'srv-2',
        serviceName: 'Balayage & Multi-Dimensional Glaze',
        categoryName: 'Hair Color',
        name: 'Signature Mocha Balayage Formula',
        description: 'Standard backbar consumption for balayage with Olaplex bond protection.',
        isActive: true,
        items: [
          {
            id: 'ri-1',
            recipeId: 'rec-001',
            productId: 'prod-001',
            productName: "L'Oréal Majirel Cool Mocha 6.13",
            productSku: 'LOR-MAJ-613',
            productBrand: "L'Oréal Professionnel",
            quantity: 60,
            unit: 'ml',
            notes: 'Primary Color Cream',
            isOptional: false,
            costPerUnit: 480 / 60, // ₹8/ml
            totalItemCost: 480,
          },
          {
            id: 'ri-2',
            recipeId: 'rec-001',
            productId: 'prod-002',
            productName: "L'Oréal Oxydant Cream 20 Vol (6%) Developer",
            productSku: 'LOR-OXY-20V',
            productBrand: "L'Oréal Professionnel",
            quantity: 60,
            unit: 'ml',
            notes: 'Developer 1:1 Mixing Ratio',
            isOptional: false,
            costPerUnit: 380 / 1000, // ₹0.38/ml
            totalItemCost: 22.8,
          },
          {
            id: 'ri-3',
            recipeId: 'rec-001',
            productId: 'prod-003',
            productName: 'Olaplex No. 1 Bond Multiplier Professional',
            productSku: 'OLA-BOND-N1',
            productBrand: 'Olaplex',
            quantity: 15,
            unit: 'ml',
            notes: 'Bond Protection Shield',
            isOptional: false,
            costPerUnit: 3200 / 525, // ~₹6.1/ml
            totalItemCost: 91.5,
          },
        ],
        totalFormulaCost: 594.3,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        id: 'rec-002',
        organizationId: orgId,
        serviceId: 'srv-facial-1',
        serviceName: 'Hydra-Dew Glow Facial & Extraction',
        categoryName: 'Facial & Skin',
        name: 'Active Moist Deep Hydration Formula',
        description: 'Clinical grade facial hydration and barrier reinforcement.',
        isActive: true,
        items: [
          {
            id: 'ri-4',
            recipeId: 'rec-002',
            productId: 'prod-005',
            productName: 'Dermalogica Active Moist Hydrating Face Cream',
            productSku: 'DER-ACT-MST',
            productBrand: 'Dermalogica',
            quantity: 15,
            unit: 'ml',
            notes: 'Facial Emulsion Layering',
            isOptional: false,
            costPerUnit: 1650 / 100, // ₹16.5/ml
            totalItemCost: 247.5,
          },
        ],
        totalFormulaCost: 247.5,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        id: 'rec-003',
        organizationId: orgId,
        serviceId: 'srv-spa-1',
        serviceName: 'Swedish Aromatherapy Full Body Massage 60m',
        categoryName: 'Spa & Wellness',
        name: 'Aroma Relaxation Oil Blend',
        description: 'Standard 40ml warming massage oil formulation.',
        isActive: true,
        items: [
          {
            id: 'ri-5',
            recipeId: 'rec-003',
            productId: 'prod-006',
            productName: 'Aromatherapy Lavender & Eucalyptus Massage Oil',
            productSku: 'SPA-LAV-OIL',
            productBrand: 'Hive Sanctuary Spa',
            quantity: 40,
            unit: 'ml',
            notes: 'Heated oil application',
            isOptional: false,
            costPerUnit: 550 / 500, // ₹1.1/ml
            totalItemCost: 44,
          },
        ],
        totalFormulaCost: 44,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
    ];

    recipes.forEach((r) => this.recipesDb.set(r.serviceId, r));

    // 5. Seed Purchase Orders
    const po1: PurchaseOrderDetail = {
      id: 'po-001',
      organizationId: orgId,
      branchId: 'br-jubilee',
      branchName: 'Jubilee Hills Flagship',
      vendorId: 'ven-001',
      vendorName: "L'Oréal India Enterprise Distribution",
      vendorCode: 'VEN-LOR-01',
      poNumber: 'PO-HYD-2026-0001',
      status: 'RECEIVED',
      orderDate: new Date(now.getTime() - 10 * 86400000).toISOString(),
      expectedDeliveryDate: new Date(now.getTime() - 8 * 86400000).toISOString(),
      receivedDate: new Date(now.getTime() - 7 * 86400000).toISOString(),
      subtotal: 36000,
      taxTotal: 6480,
      shippingCost: 0,
      grandTotal: 42480,
      notes: 'Monthly bulk restock for hair color stations.',
      approvedByName: 'Sarah Jenkins (Branch Manager)',
      approvedAt: new Date(now.getTime() - 9 * 86400000).toISOString(),
      receivedByName: 'Priya Sharma (Store In-Charge)',
      items: [
        {
          id: 'poi-1',
          purchaseOrderId: 'po-001',
          productId: 'prod-001',
          productName: "L'Oréal Majirel Cool Mocha 6.13",
          productSku: 'LOR-MAJ-613',
          productUnit: 'ml',
          quantityOrdered: 1200,
          quantityReceived: 1200,
          unitCost: 480 / 60,
          taxRate: 18,
          taxAmount: 1728,
          totalAmount: 11328,
          batchNumber: 'BAT-2026-09A',
          expiryDate: new Date(now.getTime() + 180 * 86400000).toISOString().split('T')[0],
        },
        {
          id: 'poi-2',
          purchaseOrderId: 'po-001',
          productId: 'prod-002',
          productName: "L'Oréal Oxydant Cream 20 Vol (6%) Developer",
          productSku: 'LOR-OXY-20V',
          productUnit: 'ml',
          quantityOrdered: 3000,
          quantityReceived: 3000,
          unitCost: 380 / 1000,
          taxRate: 18,
          taxAmount: 205.2,
          totalAmount: 1345.2,
          batchNumber: 'BAT-2026-08B',
          expiryDate: new Date(now.getTime() + 240 * 86400000).toISOString().split('T')[0],
        },
      ],
      createdAt: new Date(now.getTime() - 10 * 86400000).toISOString(),
      updatedAt: new Date(now.getTime() - 7 * 86400000).toISOString(),
    };

    const po2: PurchaseOrderDetail = {
      id: 'po-002',
      organizationId: orgId,
      branchId: 'br-banjara',
      branchName: 'Banjara Hills Spa & Lounge',
      vendorId: 'ven-002',
      vendorName: 'Wella Professional Care Supplies',
      vendorCode: 'VEN-WEL-02',
      poNumber: 'PO-HYD-2026-0002',
      status: 'SUBMITTED',
      orderDate: new Date(now.getTime() - 2 * 86400000).toISOString(),
      expectedDeliveryDate: new Date(now.getTime() + 2 * 86400000).toISOString(),
      subtotal: 16800,
      taxTotal: 3024,
      shippingCost: 250,
      grandTotal: 20074,
      notes: 'Urgent lightener restock for upcoming festive weddings.',
      items: [
        {
          id: 'poi-3',
          purchaseOrderId: 'po-002',
          productId: 'prod-008',
          productName: 'Wella Blondor Multi Blonde Dust-Free Lightening Powder 800g',
          productSku: 'WEL-BLD-800',
          productUnit: 'g',
          quantityOrdered: 6400, // 8 tins
          quantityReceived: 0,
          unitCost: 2100 / 800,
          taxRate: 18,
          taxAmount: 3024,
          totalAmount: 19824,
          batchNumber: 'BAT-WEL-511',
          expiryDate: new Date(now.getTime() + 300 * 86400000).toISOString().split('T')[0],
        },
      ],
      createdAt: new Date(now.getTime() - 2 * 86400000).toISOString(),
      updatedAt: new Date(now.getTime() - 2 * 86400000).toISOString(),
    };

    this.purchaseOrdersDb.set(po1.id, po1);
    this.purchaseOrdersDb.set(po2.id, po2);

    // 6. Seed Branch Transfers
    const tr1: BranchTransferDetail = {
      id: 'tr-001',
      organizationId: orgId,
      transferNumber: 'TR-2026-0001',
      sourceBranchId: 'br-jubilee',
      sourceBranchName: 'Jubilee Hills Flagship',
      destinationBranchId: 'br-hitech',
      destinationBranchName: 'Hitech City Express',
      status: 'IN_TRANSIT',
      requestedByName: 'Vikram Sethi (Hitech Manager)',
      requestedAt: new Date(now.getTime() - 1 * 86400000).toISOString(),
      approvedByName: 'Sarah Jenkins (Operations Head)',
      approvedAt: new Date(now.getTime() - 12 * 3600000).toISOString(),
      dispatchedByName: 'Priya Sharma (Dispatcher)',
      dispatchedAt: new Date(now.getTime() - 4 * 3600000).toISOString(),
      trackingNumber: 'HIVE-EXP-4412',
      transportMode: 'Internal Salon Courier Van #2',
      notes: 'Emergency transfer for weekend appointments at Hitech City.',
      items: [
        {
          id: 'tri-1',
          transferId: 'tr-001',
          productId: 'prod-001',
          productName: "L'Oréal Majirel Cool Mocha 6.13",
          productSku: 'LOR-MAJ-613',
          productUnit: 'ml',
          quantityRequested: 300,
          quantityDispatched: 300,
          quantityReceived: 0,
          unitCost: 8,
          batchNumber: 'BAT-2026-09A',
        },
        {
          id: 'tri-2',
          transferId: 'tr-001',
          productId: 'prod-004',
          productName: 'Kérastase Elixir Ultime L’Huile Original Hair Oil 100ml',
          productSku: 'KER-ELX-100',
          productUnit: 'bottle',
          quantityRequested: 4,
          quantityDispatched: 4,
          quantityReceived: 0,
          unitCost: 2400,
          batchNumber: 'BAT-KER-902',
        },
      ],
      totalItemsCount: 2,
      totalTransferValue: 12000,
      createdAt: new Date(now.getTime() - 1 * 86400000).toISOString(),
      updatedAt: new Date(now.getTime() - 4 * 3600000).toISOString(),
    };

    this.branchTransfersDb.set(tr1.id, tr1);
  }

  // ---------------------------------------------------------------------------
  // 2. HELPER STATUS CALCULATORS
  // ---------------------------------------------------------------------------
  private calculateStockStatus(available: number, threshold: number): StockLevelStatus {
    if (available <= 0) return 'OUT_OF_STOCK';
    if (available <= threshold * 0.5 || available <= 2) return 'CRITICAL';
    if (available <= threshold) return 'LOW_STOCK';
    return 'OK';
  }

  private calculateExpiryStatus(expiryDate?: string | null): ExpiryAlertCategory {
    if (!expiryDate) return 'GOOD';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exp = new Date(expiryDate);
    exp.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((exp.getTime() - today.getTime()) / 86400000);

    if (diffDays < 0) return 'EXPIRED';
    if (diffDays === 0) return 'EXPIRES_TODAY';
    if (diffDays <= 7) return 'EXPIRES_7_DAYS';
    if (diffDays <= 30) return 'EXPIRES_30_DAYS';
    return 'GOOD';
  }

  // ---------------------------------------------------------------------------
  // 3. PRODUCTS MANAGEMENT
  // ---------------------------------------------------------------------------
  async getAllProducts(filters?: {
    categoryId?: string;
    brand?: string;
    search?: string;
    status?: string;
  }): Promise<ProductDetail[]> {
    let list = Array.from(this.productsDb.values());

    if (filters?.categoryId) {
      list = list.filter((p) => p.categoryId === filters.categoryId);
    }
    if (filters?.brand) {
      list = list.filter((p) => p.brand?.toLowerCase() === filters.brand?.toLowerCase());
    }
    if (filters?.status) {
      list = list.filter((p) => p.status === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.barcode?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q)
      );
    }

    // Enrich with aggregated stock across branches
    return list.map((p) => {
      let totalQty = 0;
      let totalCostVal = 0;
      let totalRetailVal = 0;

      for (const stock of this.branchStocksDb.values()) {
        if (stock.productId === p.id) {
          totalQty += stock.currentStock;
          totalCostVal += stock.currentStock * p.costPrice;
          totalRetailVal += stock.currentStock * p.sellingPrice;
        }
      }

      return {
        ...p,
        totalStockOnHand: totalQty,
        totalStockValueCost: Math.round(totalCostVal * 100) / 100,
        totalStockValueRetail: Math.round(totalRetailVal * 100) / 100,
      };
    });
  }

  async getProductById(id: string): Promise<ProductDetail> {
    const prod = this.productsDb.get(id);
    if (!prod) throw new NotFoundException(`Product ${id} not found.`);
    return prod;
  }

  async createProduct(dto: CreateProductDto, orgId = 'org_hive_demo'): Promise<ProductDetail> {
    // Check SKU uniqueness
    for (const p of this.productsDb.values()) {
      if (p.sku.toLowerCase() === dto.sku.toLowerCase()) {
        throw new ConflictException(`SKU "${dto.sku}" is already assigned to ${p.name}.`);
      }
    }

    const now = new Date().toISOString();
    const id = `prod-${Date.now()}`;
    const newProd: ProductDetail = {
      id,
      organizationId: orgId,
      categoryId: dto.categoryId || null,
      name: dto.name,
      sku: dto.sku.toUpperCase(),
      barcode: dto.barcode || null,
      brand: dto.brand || 'Hive Professional',
      costPrice: dto.costPrice,
      sellingPrice: dto.sellingPrice,
      retailPrice: dto.retailPrice || dto.sellingPrice,
      taxRate: dto.taxRate ?? 18,
      minThreshold: dto.minThreshold ?? 5,
      isRetail: dto.isRetail ?? true,
      isBackbar: dto.isBackbar ?? true,
      unit: dto.unit || 'pcs',
      batchNumber: dto.batchNumber || `BAT-${new Date().getFullYear()}-01`,
      expiryDate: dto.expiryDate || null,
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
    };

    this.productsDb.set(id, newProd);

    // Initialize 0 stock across all branches
    for (const [bId, bInfo] of Object.entries(this.branchNames)) {
      const stockId = `${bId}_${id}`;
      const stockDetail: BranchStockDetail = {
        id: stockId,
        branchId: bId,
        branchName: bInfo.name,
        branchCode: bInfo.code,
        productId: id,
        productName: newProd.name,
        productSku: newProd.sku,
        productBrand: newProd.brand,
        productUnit: newProd.unit,
        currentStock: 0,
        reservedStock: 0,
        availableStock: 0,
        reorderThreshold: newProd.minThreshold,
        batchNumber: newProd.batchNumber,
        expiryDate: newProd.expiryDate,
        lastCostPrice: newProd.costPrice,
        stockLevelStatus: 'OUT_OF_STOCK',
        expiryStatus: this.calculateExpiryStatus(newProd.expiryDate),
        updatedAt: now,
      };
      this.branchStocksDb.set(stockId, stockDetail);
    }

    return newProd;
  }

  async updateProduct(id: string, dto: UpdateProductDto): Promise<ProductDetail> {
    const existing = await this.getProductById(id);
    const updated: ProductDetail = {
      ...existing,
      ...dto,
      updatedAt: new Date().toISOString(),
    };
    this.productsDb.set(id, updated);
    return updated;
  }

  // ---------------------------------------------------------------------------
  // 4. BRANCH STOCKS MATRIX & DIRECT ADJUSTMENTS
  // ---------------------------------------------------------------------------
  async getBranchStocks(branchId?: string, search?: string): Promise<BranchStockDetail[]> {
    let list = Array.from(this.branchStocksDb.values());

    if (branchId) {
      list = list.filter((s) => s.branchId === branchId);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.productName.toLowerCase().includes(q) ||
          s.productSku.toLowerCase().includes(q) ||
          s.branchName.toLowerCase().includes(q)
      );
    }

    // Refresh dynamic alert statuses
    return list.map((s) => {
      const available = Math.max(0, s.currentStock - s.reservedStock);
      const stockStatus = this.calculateStockStatus(available, s.reorderThreshold);
      const expiryStatus = this.calculateExpiryStatus(s.expiryDate);
      const daysRemaining = s.expiryDate
        ? Math.ceil((new Date(s.expiryDate).getTime() - Date.now()) / 86400000)
        : null;

      return {
        ...s,
        availableStock: available,
        stockLevelStatus: stockStatus,
        expiryStatus,
        daysUntilExpiry: daysRemaining,
      };
    });
  }

  // ---------------------------------------------------------------------------
  // 5. DOUBLE-ENTRY STOCK LEDGER ENGINE (Never Silently Modify Stock)
  // ---------------------------------------------------------------------------
  async recordLedgerMovement(
    orgId: string,
    branchId: string,
    productId: string,
    movementType: StockLedgerRecord['movementType'],
    quantityChange: number, // Signed (+ or -)
    options?: {
      batchNumber?: string;
      unitCost?: number;
      referenceType?: string;
      referenceId?: string;
      notes?: string;
      performedByUserId?: string;
      performedByName?: string;
    }
  ): Promise<{ stock: BranchStockDetail; ledgerRecord: StockLedgerRecord }> {
    const stockKey = `${branchId}_${productId}`;
    let stock = this.branchStocksDb.get(stockKey);
    const prod = this.productsDb.get(productId);
    const branchInfo = this.branchNames[branchId] || { name: 'Unknown Branch', code: 'BR' };

    if (!prod) throw new NotFoundException(`Product ${productId} not found.`);

    if (!stock) {
      stock = {
        id: stockKey,
        branchId,
        branchName: branchInfo.name,
        branchCode: branchInfo.code,
        productId,
        productName: prod.name,
        productSku: prod.sku,
        productBrand: prod.brand,
        productUnit: prod.unit,
        currentStock: 0,
        reservedStock: 0,
        availableStock: 0,
        reorderThreshold: prod.minThreshold,
        batchNumber: options?.batchNumber || prod.batchNumber,
        expiryDate: prod.expiryDate,
        lastCostPrice: options?.unitCost || prod.costPrice,
        stockLevelStatus: 'OUT_OF_STOCK',
        expiryStatus: this.calculateExpiryStatus(prod.expiryDate),
        updatedAt: new Date().toISOString(),
      };
    }

    const balanceBefore = stock.currentStock;
    const balanceAfter = Math.max(0, balanceBefore + quantityChange);
    const unitCost = options?.unitCost ?? prod.costPrice;
    const totalCost = Math.abs(quantityChange) * unitCost;
    const now = new Date().toISOString();

    // Update Stock record
    stock.currentStock = balanceAfter;
    stock.availableStock = Math.max(0, balanceAfter - stock.reservedStock);
    stock.stockLevelStatus = this.calculateStockStatus(stock.availableStock, stock.reorderThreshold);
    if (options?.batchNumber) stock.batchNumber = options.batchNumber;
    if (options?.unitCost) stock.lastCostPrice = options.unitCost;
    stock.updatedAt = now;

    this.branchStocksDb.set(stockKey, stock);

    // Create Immutable Ledger Record
    const ledgerRecord: StockLedgerRecord = {
      id: `ledger-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      organizationId: orgId,
      branchId,
      branchName: branchInfo.name,
      productId,
      productName: prod.name,
      productSku: prod.sku,
      productUnit: prod.unit,
      batchNumber: options?.batchNumber || stock.batchNumber,
      movementType,
      quantity: quantityChange,
      balanceBefore,
      balanceAfter,
      unitCost,
      totalCost,
      referenceType: options?.referenceType || 'MANUAL_ADJUSTMENT',
      referenceId: options?.referenceId || null,
      notes: options?.notes || 'Stock ledger movement recorded.',
      performedByUserId: options?.performedByUserId || null,
      performedByName: options?.performedByName || 'Staff Member',
      createdAt: now,
    };

    this.stockLedgerDb.unshift(ledgerRecord);

    return { stock, ledgerRecord };
  }

  async adjustStock(payload: StockAdjustmentPayload, orgId = 'org_hive_demo') {
    return this.recordLedgerMovement(
      orgId,
      payload.branchId,
      payload.productId,
      payload.movementType,
      payload.quantityChange,
      {
        batchNumber: payload.batchNumber,
        unitCost: payload.unitCost,
        referenceType: 'MANUAL_ADJUSTMENT',
        referenceId: payload.referenceId || `ADJ-${Date.now()}`,
        notes: payload.notes,
        performedByName: payload.performedByName || 'Manager Authorizer',
      }
    );
  }

  async getStockLedger(filters?: {
    branchId?: string;
    productId?: string;
    movementType?: string;
    search?: string;
  }): Promise<StockLedgerRecord[]> {
    let list = [...this.stockLedgerDb];

    if (filters?.branchId) {
      list = list.filter((l) => l.branchId === filters.branchId);
    }
    if (filters?.productId) {
      list = list.filter((l) => l.productId === filters.productId);
    }
    if (filters?.movementType) {
      list = list.filter((l) => l.movementType === filters.movementType);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (l) =>
          l.productName.toLowerCase().includes(q) ||
          l.productSku.toLowerCase().includes(q) ||
          l.referenceId?.toLowerCase().includes(q) ||
          l.performedByName?.toLowerCase().includes(q) ||
          l.notes?.toLowerCase().includes(q)
      );
    }

    return list;
  }

  // ---------------------------------------------------------------------------
  // 6. SERVICE RECIPES & AUTOMATIC CONSUMPTION
  // ---------------------------------------------------------------------------
  async getAllRecipes(): Promise<ServiceRecipeDetail[]> {
    return Array.from(this.recipesDb.values());
  }

  async getRecipeByServiceId(serviceId: string): Promise<ServiceRecipeDetail | null> {
    return this.recipesDb.get(serviceId) || null;
  }

  async createOrUpdateRecipe(dto: CreateRecipeDto, orgId = 'org_hive_demo'): Promise<ServiceRecipeDetail> {
    const now = new Date().toISOString();
    let totalCost = 0;

    const items = dto.items.map((it, idx) => {
      const prod = this.productsDb.get(it.productId);
      const costPerUnit = prod ? (prod.costPrice / (prod.unit === 'ml' ? 60 : 1)) : 10;
      const totalItemCost = Math.round(it.quantity * costPerUnit * 100) / 100;
      totalCost += totalItemCost;

      return {
        id: `ri-${Date.now()}-${idx}`,
        recipeId: `rec-${dto.serviceId}`,
        productId: it.productId,
        productName: prod?.name || 'Catalog Product',
        productSku: prod?.sku || 'SKU',
        productBrand: prod?.brand,
        quantity: it.quantity,
        unit: it.unit,
        notes: it.notes || null,
        isOptional: it.isOptional ?? false,
        costPerUnit: Math.round(costPerUnit * 100) / 100,
        totalItemCost,
      };
    });

    const recipe: ServiceRecipeDetail = {
      id: `rec-${dto.serviceId}`,
      organizationId: orgId,
      serviceId: dto.serviceId,
      serviceName: dto.name,
      name: dto.name,
      description: dto.description || null,
      isActive: dto.isActive ?? true,
      items,
      totalFormulaCost: Math.round(totalCost * 100) / 100,
      createdAt: now,
      updatedAt: now,
    };

    this.recipesDb.set(dto.serviceId, recipe);
    return recipe;
  }

  async consumeServiceRecipe(payload: ServiceConsumptionPayload, orgId = 'org_hive_demo'): Promise<ConsumptionResultRecord> {
    const recipe = this.recipesDb.get(payload.serviceId);
    if (!recipe) {
      throw new NotFoundException(`No service recipe / Bill of Materials found for service "${payload.serviceId}".`);
    }

    const consumedItems: ConsumptionResultRecord['consumedItems'] = [];
    let totalCostDeducted = 0;
    const now = new Date().toISOString();

    for (const item of recipe.items) {
      // Check if user supplied override for this ingredient
      const override = payload.overrides?.find((o) => o.productId === item.productId);
      const qtyToDeduct = override ? override.quantityUsed : item.quantity;

      const { stock, ledgerRecord } = await this.recordLedgerMovement(
        orgId,
        payload.branchId,
        item.productId,
        'SERVICE_CONSUMPTION',
        -qtyToDeduct, // Deducting from backbar
        {
          batchNumber: override?.batchNumber || undefined,
          referenceType: payload.invoiceId ? 'INVOICE' : payload.appointmentId ? 'APPOINTMENT' : 'SERVICE_CONSUMPTION',
          referenceId: payload.invoiceId || payload.appointmentId || `SRV-${payload.serviceId}`,
          notes: payload.notes || `Auto-consumed for service "${recipe.serviceName}" performed by ${payload.stylistName || 'Stylist'}.`,
          performedByName: payload.stylistName || 'Stylist Technician',
        }
      );

      totalCostDeducted += ledgerRecord.totalCost;
      consumedItems.push({
        productId: item.productId,
        productName: item.productName,
        quantityDeducted: qtyToDeduct,
        unit: item.unit,
        balanceBefore: ledgerRecord.balanceBefore,
        balanceAfter: ledgerRecord.balanceAfter,
        ledgerEntryId: ledgerRecord.id,
      });
    }

    return {
      serviceId: payload.serviceId,
      serviceName: recipe.serviceName,
      branchId: payload.branchId,
      consumedItems,
      totalCostDeducted: Math.round(totalCostDeducted * 100) / 100,
      consumedAt: now,
    };
  }

  // ---------------------------------------------------------------------------
  // 7. LOW STOCK & EXPIRY ALERTS
  // ---------------------------------------------------------------------------
  async getLowStockAlerts(branchId?: string): Promise<LowStockAlertItem[]> {
    let list = Array.from(this.branchStocksDb.values());
    if (branchId) list = list.filter((s) => s.branchId === branchId);

    const alerts: LowStockAlertItem[] = [];

    for (const s of list) {
      const available = Math.max(0, s.currentStock - s.reservedStock);
      const status = this.calculateStockStatus(available, s.reorderThreshold);

      if (status !== 'OK') {
        const prod = this.productsDb.get(s.productId);
        const deficit = Math.max(0, s.reorderThreshold * 2 - available);
        const unitCost = prod?.costPrice || 100;

        alerts.push({
          branchId: s.branchId,
          branchName: s.branchName,
          productId: s.productId,
          productName: s.productName,
          productSku: s.productSku,
          productBrand: s.productBrand,
          unit: s.productUnit,
          currentStock: s.currentStock,
          availableStock: available,
          reorderThreshold: s.reorderThreshold,
          deficitQuantity: deficit,
          status,
          suggestedVendorId: 'ven-001',
          suggestedVendorName: "L'Oréal India Enterprise Distribution",
          estimatedReorderCost: Math.round(deficit * unitCost * 100) / 100,
        });
      }
    }

    return alerts.sort((a, b) => (a.status === 'OUT_OF_STOCK' ? -1 : 1));
  }

  async getExpiryAlerts(branchId?: string): Promise<ExpiryAlertItem[]> {
    let list = Array.from(this.branchStocksDb.values());
    if (branchId) list = list.filter((s) => s.branchId === branchId);

    const alerts: ExpiryAlertItem[] = [];
    const now = Date.now();

    for (const s of list) {
      if (!s.expiryDate || s.currentStock <= 0) continue;

      const expStatus = this.calculateExpiryStatus(s.expiryDate);
      if (expStatus !== 'GOOD') {
        const prod = this.productsDb.get(s.productId);
        const daysRemaining = Math.ceil((new Date(s.expiryDate).getTime() - now) / 86400000);
        const valueAtRisk = s.currentStock * (prod?.costPrice || 0);

        alerts.push({
          branchId: s.branchId,
          branchName: s.branchName,
          productId: s.productId,
          productName: s.productName,
          productSku: s.productSku,
          productBrand: s.productBrand,
          batchNumber: s.batchNumber,
          currentStock: s.currentStock,
          unit: s.productUnit,
          expiryDate: s.expiryDate,
          daysRemaining,
          category: expStatus,
          totalValueAtRisk: Math.round(valueAtRisk * 100) / 100,
        });
      }
    }

    return alerts.sort((a, b) => a.daysRemaining - b.daysRemaining);
  }

  // ---------------------------------------------------------------------------
  // 8. PURCHASE ORDERS & PROCUREMENT WORKFLOW
  // ---------------------------------------------------------------------------
  async getAllPurchaseOrders(filters?: { branchId?: string; status?: string }): Promise<PurchaseOrderDetail[]> {
    let list = Array.from(this.purchaseOrdersDb.values());
    if (filters?.branchId) list = list.filter((po) => po.branchId === filters.branchId);
    if (filters?.status) list = list.filter((po) => po.status === filters.status);
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createPurchaseOrder(dto: CreatePurchaseOrderDto, orgId = 'org_hive_demo'): Promise<PurchaseOrderDetail> {
    const vendor = this.vendorsDb.get(dto.vendorId);
    if (!vendor) throw new NotFoundException(`Vendor ${dto.vendorId} not found.`);
    const branchInfo = this.branchNames[dto.branchId] || { name: 'Main Branch', code: 'BR' };

    this.poSequence++;
    const poNumber = `PO-${branchInfo.code.replace('HYD-', '')}-2026-00${this.poSequence}`;
    const now = new Date().toISOString();
    const id = `po-${Date.now()}`;

    let subtotal = 0;
    let taxTotal = 0;

    const items = dto.items.map((it, idx) => {
      const prod = this.productsDb.get(it.productId);
      const taxRate = it.taxRate ?? 18;
      const lineSubtotal = it.quantityOrdered * it.unitCost;
      const lineTax = (lineSubtotal * taxRate) / 100;
      const lineTotal = lineSubtotal + lineTax;

      subtotal += lineSubtotal;
      taxTotal += lineTax;

      return {
        id: `poi-${Date.now()}-${idx}`,
        purchaseOrderId: id,
        productId: it.productId,
        productName: prod?.name || 'Product',
        productSku: prod?.sku || 'SKU',
        productUnit: prod?.unit || 'pcs',
        quantityOrdered: it.quantityOrdered,
        quantityReceived: 0,
        unitCost: it.unitCost,
        taxRate,
        taxAmount: Math.round(lineTax * 100) / 100,
        totalAmount: Math.round(lineTotal * 100) / 100,
        batchNumber: it.batchNumber || null,
        expiryDate: it.expiryDate || null,
      };
    });

    const shipping = dto.shippingCost ?? 0;
    const grandTotal = Math.round((subtotal + taxTotal + shipping) * 100) / 100;

    const newPo: PurchaseOrderDetail = {
      id,
      organizationId: orgId,
      branchId: dto.branchId,
      branchName: branchInfo.name,
      vendorId: dto.vendorId,
      vendorName: vendor.name,
      vendorCode: vendor.code,
      poNumber,
      status: 'DRAFT',
      orderDate: now,
      expectedDeliveryDate: dto.expectedDeliveryDate || null,
      subtotal: Math.round(subtotal * 100) / 100,
      taxTotal: Math.round(taxTotal * 100) / 100,
      shippingCost: shipping,
      grandTotal,
      notes: dto.notes || null,
      items,
      createdAt: now,
      updatedAt: now,
    };

    this.purchaseOrdersDb.set(id, newPo);
    return newPo;
  }

  async transitionPoStatus(
    poId: string,
    action: 'submit' | 'approve' | 'receive' | 'cancel',
    payload?: ReceivePurchaseOrderPayload,
    actorName = 'Authorized Manager',
    orgId = 'org_hive_demo'
  ): Promise<PurchaseOrderDetail> {
    const po = this.purchaseOrdersDb.get(poId);
    if (!po) throw new NotFoundException(`Purchase Order ${poId} not found.`);

    const now = new Date().toISOString();

    if (action === 'submit') {
      po.status = 'SUBMITTED';
      po.updatedAt = now;
    } else if (action === 'approve') {
      po.status = 'APPROVED';
      po.approvedByName = actorName;
      po.approvedAt = now;
      po.updatedAt = now;
    } else if (action === 'cancel') {
      po.status = 'CANCELLED';
      po.updatedAt = now;
    } else if (action === 'receive') {
      if (po.status !== 'APPROVED' && po.status !== 'SUBMITTED') {
        throw new BadRequestException(`Cannot receive PO in status "${po.status}". Must be APPROVED or SUBMITTED.`);
      }

      // Process automatic inventory reception & ledger writes
      const itemsToReceive = payload?.receivedItems || po.items.map((i) => ({
        productId: i.productId,
        quantityReceived: i.quantityOrdered,
        batchNumber: i.batchNumber || undefined,
        expiryDate: i.expiryDate || undefined,
        unitCost: i.unitCost,
      }));

      for (const recItem of itemsToReceive) {
        const poItem = po.items.find((i) => i.productId === recItem.productId);
        if (poItem) {
          poItem.quantityReceived = recItem.quantityReceived;
          if (recItem.batchNumber) poItem.batchNumber = recItem.batchNumber;
          if (recItem.expiryDate) poItem.expiryDate = recItem.expiryDate;
        }

        // Increment branch stock via immutable Stock Ledger
        await this.recordLedgerMovement(
          orgId,
          po.branchId,
          recItem.productId,
          'PURCHASE',
          recItem.quantityReceived,
          {
            batchNumber: recItem.batchNumber || poItem?.batchNumber || undefined,
            unitCost: recItem.unitCost ?? poItem?.unitCost,
            referenceType: 'PURCHASE_ORDER',
            referenceId: po.poNumber,
            notes: `Goods received against PO ${po.poNumber} from vendor ${po.vendorName}.`,
            performedByName: payload?.receivedByName || actorName,
          }
        );
      }

      po.status = 'RECEIVED';
      po.receivedDate = payload?.receivedDate || now;
      po.receivedByName = payload?.receivedByName || actorName;
      po.updatedAt = now;
    }

    this.purchaseOrdersDb.set(poId, po);
    return po;
  }

  // ---------------------------------------------------------------------------
  // 9. VENDORS MANAGEMENT
  // ---------------------------------------------------------------------------
  async getAllVendors(): Promise<VendorDetail[]> {
    return Array.from(this.vendorsDb.values());
  }

  async createVendor(dto: CreateVendorDto, orgId = 'org_hive_demo'): Promise<VendorDetail> {
    const now = new Date().toISOString();
    const id = `ven-${Date.now()}`;

    const newVendor: VendorDetail = {
      id,
      organizationId: orgId,
      name: dto.name,
      code: dto.code.toUpperCase(),
      contactPerson: dto.contactPerson || null,
      phone: dto.phone || null,
      email: dto.email || null,
      address: dto.address || null,
      city: dto.city || null,
      gstin: dto.gstin || null,
      paymentTerms: dto.paymentTerms || 'Net 30',
      bankDetails: dto.bankDetails || null,
      status: 'ACTIVE',
      notes: dto.notes || null,
      totalPurchasesCount: 0,
      totalPurchasesValue: 0,
      unpaidBalance: 0,
      products: [],
      invoices: [],
      createdAt: now,
      updatedAt: now,
    };

    this.vendorsDb.set(id, newVendor);
    return newVendor;
  }

  // ---------------------------------------------------------------------------
  // 10. BRANCH TRANSFERS WORKFLOW & LOGISTICS
  // ---------------------------------------------------------------------------
  async getAllTransfers(): Promise<BranchTransferDetail[]> {
    return Array.from(this.branchTransfersDb.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createTransfer(dto: CreateTransferDto, actorName = 'Branch In-Charge', orgId = 'org_hive_demo'): Promise<BranchTransferDetail> {
    if (dto.sourceBranchId === dto.destinationBranchId) {
      throw new BadRequestException('Source and Destination branches must be distinct.');
    }

    const sourceBranch = this.branchNames[dto.sourceBranchId] || { name: 'Source Branch', code: 'SRC' };
    const destBranch = this.branchNames[dto.destinationBranchId] || { name: 'Dest Branch', code: 'DST' };

    this.transferSequence++;
    const transferNumber = `TR-2026-00${this.transferSequence}`;
    const id = `tr-${Date.now()}`;
    const now = new Date().toISOString();

    let totalVal = 0;
    const items = dto.items.map((it, idx) => {
      const prod = this.productsDb.get(it.productId);
      const unitCost = prod?.costPrice || 500;
      totalVal += it.quantityRequested * unitCost;

      return {
        id: `tri-${Date.now()}-${idx}`,
        transferId: id,
        productId: it.productId,
        productName: prod?.name || 'Product',
        productSku: prod?.sku || 'SKU',
        productUnit: prod?.unit || 'pcs',
        quantityRequested: it.quantityRequested,
        quantityDispatched: 0,
        quantityReceived: 0,
        batchNumber: prod?.batchNumber || null,
        unitCost,
      };
    });

    const newTransfer: BranchTransferDetail = {
      id,
      organizationId: orgId,
      transferNumber,
      sourceBranchId: dto.sourceBranchId,
      sourceBranchName: sourceBranch.name,
      destinationBranchId: dto.destinationBranchId,
      destinationBranchName: destBranch.name,
      status: 'REQUESTED',
      requestedByName: actorName,
      requestedAt: now,
      transportMode: dto.transportMode || 'Internal Salon Van Delivery',
      notes: dto.notes || null,
      items,
      totalItemsCount: items.length,
      totalTransferValue: Math.round(totalVal * 100) / 100,
      createdAt: now,
      updatedAt: now,
    };

    this.branchTransfersDb.set(id, newTransfer);
    return newTransfer;
  }

  async transitionTransferStatus(
    transferId: string,
    action: 'approve' | 'dispatch' | 'receive' | 'cancel',
    actorName = 'Authorized Manager',
    orgId = 'org_hive_demo'
  ): Promise<BranchTransferDetail> {
    const tr = this.branchTransfersDb.get(transferId);
    if (!tr) throw new NotFoundException(`Transfer ${transferId} not found.`);

    const now = new Date().toISOString();

    if (action === 'approve') {
      tr.status = 'APPROVED';
      tr.approvedByName = actorName;
      tr.approvedAt = now;
      tr.updatedAt = now;
    } else if (action === 'dispatch') {
      if (tr.status !== 'APPROVED' && tr.status !== 'REQUESTED') {
        throw new BadRequestException(`Cannot dispatch transfer in status "${tr.status}".`);
      }

      // Deduct from Source Branch stock immediately with TRANSFER_OUT
      for (const item of tr.items) {
        item.quantityDispatched = item.quantityRequested;
        await this.recordLedgerMovement(
          orgId,
          tr.sourceBranchId,
          item.productId,
          'TRANSFER_OUT',
          -item.quantityDispatched,
          {
            batchNumber: item.batchNumber || undefined,
            unitCost: item.unitCost,
            referenceType: 'TRANSFER',
            referenceId: tr.transferNumber,
            notes: `Dispatched transfer ${tr.transferNumber} to ${tr.destinationBranchName}.`,
            performedByName: actorName,
          }
        );
      }

      tr.status = 'IN_TRANSIT';
      tr.dispatchedByName = actorName;
      tr.dispatchedAt = now;
      tr.updatedAt = now;
    } else if (action === 'receive') {
      if (tr.status !== 'IN_TRANSIT' && tr.status !== 'DISPATCHED') {
        throw new BadRequestException('Transfer must be IN_TRANSIT before destination branch can receive.');
      }

      // Increment Destination Branch stock ONLY AFTER receipt!
      for (const item of tr.items) {
        item.quantityReceived = item.quantityDispatched || item.quantityRequested;
        await this.recordLedgerMovement(
          orgId,
          tr.destinationBranchId,
          item.productId,
          'TRANSFER_IN',
          item.quantityReceived,
          {
            batchNumber: item.batchNumber || undefined,
            unitCost: item.unitCost,
            referenceType: 'TRANSFER',
            referenceId: tr.transferNumber,
            notes: `Received transfer ${tr.transferNumber} dispatched from ${tr.sourceBranchName}.`,
            performedByName: actorName,
          }
        );
      }

      tr.status = 'RECEIVED';
      tr.receivedByName = actorName;
      tr.receivedAt = now;
      tr.updatedAt = now;
    } else if (action === 'cancel') {
      tr.status = 'CANCELLED';
      tr.updatedAt = now;
    }

    this.branchTransfersDb.set(transferId, tr);
    return tr;
  }

  // ---------------------------------------------------------------------------
  // 11. INVENTORY DASHBOARD KPIS & AGGREGATES
  // ---------------------------------------------------------------------------
  async getDashboardKpis(branchId?: string): Promise<InventoryDashboardKpis> {
    let stocks = Array.from(this.branchStocksDb.values());
    if (branchId) stocks = stocks.filter((s) => s.branchId === branchId);

    let totalCostVal = 0;
    let totalRetailVal = 0;
    let lowCount = 0;
    let criticalCount = 0;
    let outCount = 0;

    stocks.forEach((s) => {
      const prod = this.productsDb.get(s.productId);
      const cost = prod?.costPrice || 0;
      const retail = prod?.sellingPrice || 0;

      totalCostVal += s.currentStock * cost;
      totalRetailVal += s.currentStock * retail;

      const available = Math.max(0, s.currentStock - s.reservedStock);
      const status = this.calculateStockStatus(available, s.reorderThreshold);

      if (status === 'OUT_OF_STOCK') outCount++;
      else if (status === 'CRITICAL') criticalCount++;
      else if (status === 'LOW_STOCK') lowCount++;
    });

    // Expiry aggregates
    const expAlerts = await this.getExpiryAlerts(branchId);
    let expired = 0;
    let expiresToday = 0;
    let expires7Days = 0;
    let expires30Days = 0;
    let totalAtRiskValue = 0;

    expAlerts.forEach((a) => {
      totalAtRiskValue += a.totalValueAtRisk;
      if (a.category === 'EXPIRED') expired++;
      else if (a.category === 'EXPIRES_TODAY') expiresToday++;
      else if (a.category === 'EXPIRES_7_DAYS') expires7Days++;
      else if (a.category === 'EXPIRES_30_DAYS') expires30Days++;
    });

    // Procurement stats
    let totalMonthlyPurchaseValue = 0;
    let pendingPoCount = 0;
    for (const po of this.purchaseOrdersDb.values()) {
      if (!branchId || po.branchId === branchId) {
        if (po.status === 'RECEIVED') totalMonthlyPurchaseValue += po.grandTotal;
        if (po.status === 'DRAFT' || po.status === 'SUBMITTED' || po.status === 'APPROVED') {
          pendingPoCount++;
        }
      }
    }

    // Transfer stats
    let activeTransfersValue = 0;
    let activeTransfersCount = 0;
    for (const tr of this.branchTransfersDb.values()) {
      if (tr.status === 'IN_TRANSIT' || tr.status === 'DISPATCHED' || tr.status === 'APPROVED') {
        if (!branchId || tr.sourceBranchId === branchId || tr.destinationBranchId === branchId) {
          activeTransfersCount++;
          activeTransfersValue += tr.totalTransferValue;
        }
      }
    }

    // Top Consumed Products
    const topConsumed: TopProductConsumed[] = [
      {
        productId: 'prod-001',
        productName: "L'Oréal Majirel Cool Mocha 6.13",
        productSku: 'LOR-MAJ-613',
        brand: "L'Oréal Professionnel",
        totalConsumedQty: 840,
        unit: 'ml',
        totalConsumedValue: 6720,
        servicesCount: 14,
      },
      {
        productId: 'prod-002',
        productName: "L'Oréal Oxydant Cream 20 Vol (6%) Developer",
        productSku: 'LOR-OXY-20V',
        brand: "L'Oréal Professionnel",
        totalConsumedQty: 840,
        unit: 'ml',
        totalConsumedValue: 319.2,
        servicesCount: 14,
      },
      {
        productId: 'prod-003',
        productName: 'Olaplex No. 1 Bond Multiplier Professional',
        productSku: 'OLA-BOND-N1',
        brand: 'Olaplex',
        totalConsumedQty: 210,
        unit: 'ml',
        totalConsumedValue: 1281,
        servicesCount: 14,
      },
      {
        productId: 'prod-005',
        productName: 'Dermalogica Active Moist Hydrating Face Cream',
        productSku: 'DER-ACT-MST',
        brand: 'Dermalogica',
        totalConsumedQty: 180,
        unit: 'ml',
        totalConsumedValue: 2970,
        servicesCount: 12,
      },
    ];

    // Top Sold Products
    const topSold: TopProductSold[] = [
      {
        productId: 'prod-004',
        productName: 'Kérastase Elixir Ultime L’Huile Original Hair Oil 100ml',
        productSku: 'KER-ELX-100',
        brand: 'Kérastase',
        totalSoldQty: 28,
        unit: 'bottle',
        totalSalesValue: 109200,
        invoicesCount: 26,
      },
      {
        productId: 'prod-005',
        productName: 'Dermalogica Active Moist Hydrating Face Cream',
        productSku: 'DER-ACT-MST',
        brand: 'Dermalogica',
        totalSoldQty: 18,
        unit: 'ml',
        totalSalesValue: 51300,
        invoicesCount: 18,
      },
      {
        productId: 'prod-007',
        productName: 'OPI GelColor Big Apple Red Lacquer 15ml',
        productSku: 'OPI-GEL-BAR',
        brand: 'OPI Professional',
        totalSoldQty: 12,
        unit: 'bottle',
        totalSalesValue: 15000,
        invoicesCount: 12,
      },
    ];

    return {
      totalStockValueCost: Math.round(totalCostVal * 100) / 100,
      totalStockValueRetail: Math.round(totalRetailVal * 100) / 100,
      totalSkuCount: this.productsDb.size,
      lowStockItemsCount: lowCount,
      criticalStockItemsCount: criticalCount,
      outOfStockItemsCount: outCount,
      expiringItemsCount: {
        expired,
        expiresToday,
        expires7Days,
        expires30Days,
        totalAtRiskValue: Math.round(totalAtRiskValue * 100) / 100,
      },
      totalMonthlyPurchaseValue: Math.round(totalMonthlyPurchaseValue * 100) / 100,
      pendingPurchaseOrdersCount: pendingPoCount,
      activeTransfersInTransitValue: Math.round(activeTransfersValue * 100) / 100,
      activeTransfersCount: activeTransfersCount,
      topConsumedProducts: topConsumed,
      topSoldProducts: topSold,
    };
  }
}
