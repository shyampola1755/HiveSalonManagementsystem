'use client';

import * as React from 'react';
import {
  PageHeader,
  Button,
  Badge,
  Modal,
  Input,
  Select,
  useToast,
  Card,
  StatCard,
  Tabs,
} from '@hive/ui';
import {
  Package,
  Boxes,
  ClipboardList,
  AlertTriangle,
  Clock,
  Truck,
  ShoppingCart,
  Building2,
  Sparkles,
  Plus,
  RefreshCw,
  Search as SearchIcon,
  CheckCircle2,
  TrendingUp,
  SlidersHorizontal,
  FlaskConical,
  Send,
  Check,
  Zap,
} from 'lucide-react';
import { formatCurrency } from '@hive/utilities';
import type {
  ProductDetail,
  CreateProductDto,
  BranchStockDetail,
  StockLedgerRecord,
  StockAdjustmentPayload,
  ServiceRecipeDetail,
  ServiceConsumptionPayload,
  PurchaseOrderDetail,
  CreatePurchaseOrderDto,
  VendorDetail,
  BranchTransferDetail,
  CreateTransferDto,
  InventoryDashboardKpis,
  LowStockAlertItem,
  ExpiryAlertItem,
  StockMovementType,
  ProductUnit,
} from '@hive/types';

// Mock Branch Options
const branchOptions = [
  { value: 'ALL', label: '🏢 All Branches (Enterprise View)' },
  { value: 'br-jubilee', label: '📍 Jubilee Hills Flagship (HYD)' },
  { value: 'br-banjara', label: '📍 Banjara Hills Spa & Lounge (HYD)' },
  { value: 'br-hitech', label: '📍 Hitech City Express (HYD)' },
  { value: 'br-indiranagar', label: '📍 Indiranagar Sanctuary (BLR)' },
];

const movementTypeBadges: Record<
  StockMovementType,
  { label: string; color: 'default' | 'success' | 'warning' | 'destructive' | 'secondary' }
> = {
  PURCHASE: { label: 'Purchase Inflow', color: 'success' },
  SALE: { label: 'Retail Sale', color: 'default' },
  SERVICE_CONSUMPTION: { label: 'Service Recipe', color: 'secondary' },
  TRANSFER_OUT: { label: 'Transfer Out', color: 'warning' },
  TRANSFER_IN: { label: 'Transfer In', color: 'success' },
  ADJUSTMENT: { label: 'Manual Adj', color: 'default' },
  DAMAGE: { label: 'Damage Write-off', color: 'destructive' },
  EXPIRY: { label: 'Expired Write-off', color: 'destructive' },
  RETURN: { label: 'Vendor Return', color: 'warning' },
  OPENING_STOCK: { label: 'Opening Intake', color: 'secondary' },
};

export interface InventoryPageProps {
  initialTab?: string;
  params?: Promise<Record<string, string | string[] | undefined>>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export function InventoryView({ initialTab = 'dashboard' }: { initialTab?: string }) {
  const toast = useToast();

  // Active Global Filters
  const [selectedBranch, setSelectedBranch] = React.useState<string>('ALL');
  const [activeTab, setActiveTab] = React.useState<string>(initialTab);
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  // Local State
  const [products, setProducts] = React.useState<ProductDetail[]>([]);
  const [branchStocks, setBranchStocks] = React.useState<BranchStockDetail[]>([]);
  const [stockLedger, setStockLedger] = React.useState<StockLedgerRecord[]>([]);
  const [recipes, setRecipes] = React.useState<ServiceRecipeDetail[]>([]);
  const [purchaseOrders, setPurchaseOrders] = React.useState<PurchaseOrderDetail[]>([]);
  const [vendors, setVendors] = React.useState<VendorDetail[]>([]);
  const [transfers, setTransfers] = React.useState<BranchTransferDetail[]>([]);
  const [dashboardKpis, setDashboardKpis] = React.useState<InventoryDashboardKpis | null>(null);
  const [lowStockAlerts, setLowStockAlerts] = React.useState<LowStockAlertItem[]>([]);
  const [expiryAlerts, setExpiryAlerts] = React.useState<ExpiryAlertItem[]>([]);

  const [isAddProductOpen, setIsAddProductOpen] = React.useState(false);

  // Auto-open modal on quick action
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('action') === 'new-product') {
        setIsAddProductOpen(true);
      }

      const handleQuickAction = (e: Event) => {
        const customEvent = e as CustomEvent;
        if (customEvent.detail?.id === 'act-add-product') {
          setIsAddProductOpen(true);
        }
      };
      window.addEventListener('hive:quick-action', handleQuickAction);
      return () => window.removeEventListener('hive:quick-action', handleQuickAction);
    }
  }, []);
  const [isAdjustStockOpen, setIsAdjustStockOpen] = React.useState(false);
  const [isCreatePoOpen, setIsCreatePoOpen] = React.useState(false);
  const [isReceivePoOpen, setIsReceivePoOpen] = React.useState(false);
  const [selectedPoToReceive, setSelectedPoToReceive] = React.useState<PurchaseOrderDetail | null>(null);
  const [isCreateTransferOpen, setIsCreateTransferOpen] = React.useState(false);
  const [isSimulateConsumptionOpen, setIsSimulateConsumptionOpen] = React.useState(false);
  const [isAddVendorOpen, setIsAddVendorOpen] = React.useState(false);

  // Form States
  const [selectedProductForAdjustment, setSelectedProductForAdjustment] = React.useState<ProductDetail | null>(null);
  const [adjustmentBranchId, setAdjustmentBranchId] = React.useState('br-jubilee');
  const [adjustmentType, setAdjustmentType] = React.useState<'ADJUSTMENT' | 'DAMAGE' | 'EXPIRY' | 'RETURN'>('ADJUSTMENT');
  const [adjustmentQty, setAdjustmentQty] = React.useState<number>(10);
  const [adjustmentNotes, setAdjustmentNotes] = React.useState<string>('Periodic physical cycle count correction');

  // New Product Form
  const [newProdName, setNewProdName] = React.useState('');
  const [newProdSku, setNewProdSku] = React.useState('');
  const [newProdBrand, setNewProdBrand] = React.useState("L'Oréal Professionnel");
  const [newProdUnit, setNewProdUnit] = React.useState<ProductUnit>('ml');
  const [newProdCost, setNewProdCost] = React.useState(480);
  const [newProdSelling, setNewProdSelling] = React.useState(750);
  const [newProdMinThreshold, setNewProdMinThreshold] = React.useState(10);
  const [newProdIsRetail, setNewProdIsRetail] = React.useState(true);
  const [newProdIsBackbar, setNewProdIsBackbar] = React.useState(true);

  // New PO Form
  const [newPoBranchId, setNewPoBranchId] = React.useState('br-jubilee');
  const [newPoVendorId, setNewPoVendorId] = React.useState('ven-001');
  const [newPoProductId, setNewPoProductId] = React.useState('prod-001');
  const [newPoQty, setNewPoQty] = React.useState(500);
  const [newPoUnitCost, setNewPoUnitCost] = React.useState(8);
  const [newPoNotes, setNewPoNotes] = React.useState('Urgent weekend salon inventory replenishment');

  // New Transfer Form
  const [newTrSourceBranch, setNewTrSourceBranch] = React.useState('br-jubilee');
  const [newTrDestBranch, setNewTrDestBranch] = React.useState('br-hitech');
  const [newTrProductId, setNewTrProductId] = React.useState('prod-001');
  const [newTrQty, setNewTrQty] = React.useState(200);
  const [newTrNotes, setNewTrNotes] = React.useState('Transferring extra backbar inventory to high-demand branch');

  // Consumption Simulator
  const [simBranchId, setSimBranchId] = React.useState('br-jubilee');
  const [simServiceId, setSimServiceId] = React.useState('srv-2');
  const [simStylistName, setSimStylistName] = React.useState('Aarav Mehta (Master Stylist)');

  // Initial Data Fetching from API
  const refreshAllData = React.useCallback(async () => {
    try {
      const branchParam = selectedBranch !== 'ALL' ? `?branchId=${selectedBranch}` : '';

      // Dashboard KPIs
      const resKpis = await fetch(`/api/v1/inventory/dashboard${branchParam}`, {
        headers: { 'x-organization-id': 'org_hive_demo' },
      });
      if (resKpis.ok) {
        const json = await resKpis.json();
        setDashboardKpis(json.data);
      }

      // Products
      const resProds = await fetch('/api/v1/inventory/products', {
        headers: { 'x-organization-id': 'org_hive_demo' },
      });
      if (resProds.ok) {
        const json = await resProds.json();
        setProducts(json.data);
      }

      // Stocks
      const resStocks = await fetch(`/api/v1/inventory/stocks${branchParam}`, {
        headers: { 'x-organization-id': 'org_hive_demo' },
      });
      if (resStocks.ok) {
        const json = await resStocks.json();
        setBranchStocks(json.data);
      }

      // Stock Ledger
      const resLedger = await fetch(`/api/v1/inventory/ledger${branchParam}`, {
        headers: { 'x-organization-id': 'org_hive_demo' },
      });
      if (resLedger.ok) {
        const json = await resLedger.json();
        setStockLedger(json.data);
      }

      // Recipes
      const resRecipes = await fetch('/api/v1/inventory/recipes', {
        headers: { 'x-organization-id': 'org_hive_demo' },
      });
      if (resRecipes.ok) {
        const json = await resRecipes.json();
        setRecipes(json.data);
      }

      // Purchase Orders
      const resPo = await fetch(`/api/v1/inventory/purchase-orders${branchParam}`, {
        headers: { 'x-organization-id': 'org_hive_demo' },
      });
      if (resPo.ok) {
        const json = await resPo.json();
        setPurchaseOrders(json.data);
      }

      // Vendors
      const resVendors = await fetch('/api/v1/inventory/vendors', {
        headers: { 'x-organization-id': 'org_hive_demo' },
      });
      if (resVendors.ok) {
        const json = await resVendors.json();
        setVendors(json.data);
      }

      // Transfers
      const resTransfers = await fetch('/api/v1/inventory/transfers', {
        headers: { 'x-organization-id': 'org_hive_demo' },
      });
      if (resTransfers.ok) {
        const json = await resTransfers.json();
        setTransfers(json.data);
      }

      // Alerts
      const resLow = await fetch(`/api/v1/inventory/alerts/low-stock${branchParam}`, {
        headers: { 'x-organization-id': 'org_hive_demo' },
      });
      if (resLow.ok) {
        const json = await resLow.json();
        setLowStockAlerts(json.data);
      }

      const resExp = await fetch(`/api/v1/inventory/alerts/expiry${branchParam}`, {
        headers: { 'x-organization-id': 'org_hive_demo' },
      });
      if (resExp.ok) {
        const json = await resExp.json();
        setExpiryAlerts(json.data);
      }
    } catch (err) {
      console.error('Failed to load inventory data:', err);
    }
  }, [selectedBranch]);

  React.useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // Handlers
  const handleCreateProduct = async () => {
    if (!newProdName || !newProdSku) {
      toast.error('Please enter product name and SKU.');
      return;
    }

    try {
      const payload: CreateProductDto = {
        name: newProdName,
        sku: newProdSku,
        brand: newProdBrand,
        unit: newProdUnit,
        costPrice: Number(newProdCost),
        sellingPrice: Number(newProdSelling),
        minThreshold: Number(newProdMinThreshold),
        isRetail: newProdIsRetail,
        isBackbar: newProdIsBackbar,
        taxRate: 18,
      };

      const res = await fetch('/api/v1/inventory/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-organization-id': 'org_hive_demo' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to create product');
      }

      toast.success(`Product "${newProdName}" added to catalog.`);
      setIsAddProductOpen(false);
      setNewProdName('');
      setNewProdSku('');
      refreshAllData();
    } catch (err: any) {
      toast.error(err.message || 'Error creating product.');
    }
  };

  const handleAdjustStock = async () => {
    if (!selectedProductForAdjustment) return;

    try {
      const payload: StockAdjustmentPayload = {
        branchId: adjustmentBranchId,
        productId: selectedProductForAdjustment.id,
        movementType: adjustmentType,
        quantityChange: Number(adjustmentQty),
        notes: adjustmentNotes,
        performedByName: 'Sarah Jenkins (Branch Manager)',
      };

      const res = await fetch('/api/v1/inventory/stocks/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-organization-id': 'org_hive_demo' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to adjust stock');
      }

      toast.success(`Stock adjustment recorded in Ledger for "${selectedProductForAdjustment.name}".`);
      setIsAdjustStockOpen(false);
      refreshAllData();
    } catch (err: any) {
      toast.error(err.message || 'Error recording adjustment.');
    }
  };

  const handleSimulateConsumption = async () => {
    try {
      const payload: ServiceConsumptionPayload = {
        branchId: simBranchId,
        serviceId: simServiceId,
        stylistName: simStylistName,
        notes: 'Simulated live service consumption test from Admin Hub.',
      };

      const res = await fetch('/api/v1/inventory/recipes/consume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-organization-id': 'org_hive_demo' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Consumption simulation failed');
      }

      const json = await res.json();
      toast.success(
        `✨ Auto-consumption executed! Deducted ${json.data.consumedItems.length} backbar items totaling ${formatCurrency(json.data.totalCostDeducted)}.`
      );
      setIsSimulateConsumptionOpen(false);
      refreshAllData();
    } catch (err: any) {
      toast.error(err.message || 'Error consuming recipe.');
    }
  };

  const handleCreatePo = async () => {
    try {
      const payload: CreatePurchaseOrderDto = {
        branchId: newPoBranchId,
        vendorId: newPoVendorId,
        notes: newPoNotes,
        items: [
          {
            productId: newPoProductId,
            quantityOrdered: Number(newPoQty),
            unitCost: Number(newPoUnitCost),
            taxRate: 18,
          },
        ],
      };

      const res = await fetch('/api/v1/inventory/purchase-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-organization-id': 'org_hive_demo' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to create purchase order');

      toast.success('Purchase Order created in DRAFT status.');
      setIsCreatePoOpen(false);
      refreshAllData();
    } catch (err: any) {
      toast.error(err.message || 'Error creating purchase order.');
    }
  };

  const handleTransitionPo = async (
    poId: string,
    action: 'submit' | 'approve' | 'receive' | 'cancel'
  ) => {
    try {
      const res = await fetch(`/api/v1/inventory/purchase-orders/${poId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-organization-id': 'org_hive_demo' },
        body: JSON.stringify({ action, actorName: 'Sarah Jenkins (Operations Head)' }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `Failed to ${action} PO`);
      }

      toast.success(`Purchase order successfully updated to ${action.toUpperCase()}.`);
      refreshAllData();
    } catch (err: any) {
      toast.error(err.message || 'Error updating PO status.');
    }
  };

  const handleReceivePo = async () => {
    if (!selectedPoToReceive) return;
    try {
      const res = await fetch(`/api/v1/inventory/purchase-orders/${selectedPoToReceive.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-organization-id': 'org_hive_demo' },
        body: JSON.stringify({
          action: 'receive',
          actorName: 'Priya Sharma (Store In-Charge)',
          receivePayload: {
            receivedByName: 'Priya Sharma',
            receivedItems: selectedPoToReceive.items.map((i) => ({
              productId: i.productId,
              quantityReceived: i.quantityOrdered,
              batchNumber: i.batchNumber || 'BAT-2026-REC',
              expiryDate: i.expiryDate || '2027-09-01',
              unitCost: i.unitCost,
            })),
          },
        }),
      });

      if (!res.ok) throw new Error('Failed to receive PO goods');

      toast.success(`🎉 Goods received for PO ${selectedPoToReceive.poNumber}. Branch inventory updated!`);
      setIsReceivePoOpen(false);
      setSelectedPoToReceive(null);
      refreshAllData();
    } catch (err: any) {
      toast.error(err.message || 'Error receiving PO.');
    }
  };

  const handleCreateTransfer = async () => {
    if (newTrSourceBranch === newTrDestBranch) {
      toast.error('Source and Destination branches must be different.');
      return;
    }

    try {
      const payload: CreateTransferDto = {
        sourceBranchId: newTrSourceBranch,
        destinationBranchId: newTrDestBranch,
        notes: newTrNotes,
        items: [
          {
            productId: newTrProductId,
            quantityRequested: Number(newTrQty),
          },
        ],
      };

      const res = await fetch('/api/v1/inventory/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-organization-id': 'org_hive_demo' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to request transfer');
      }

      toast.success('Branch transfer request submitted.');
      setIsCreateTransferOpen(false);
      refreshAllData();
    } catch (err: any) {
      toast.error(err.message || 'Error submitting transfer.');
    }
  };

  const handleTransitionTransfer = async (
    trId: string,
    action: 'approve' | 'dispatch' | 'receive' | 'cancel'
  ) => {
    try {
      const res = await fetch(`/api/v1/inventory/transfers/${trId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-organization-id': 'org_hive_demo' },
        body: JSON.stringify({ action, actorName: 'Sarah Jenkins (Logistics Lead)' }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || `Failed to ${action} transfer`);
      }

      const actionMsg =
        action === 'dispatch'
          ? 'Transfer DISPATCHED! Deducted from Source branch inventory.'
          : action === 'receive'
          ? 'Transfer RECEIVED! Credited to Destination branch inventory.'
          : `Transfer updated to ${action.toUpperCase()}.`;

      toast.success(actionMsg);
      refreshAllData();
    } catch (err: any) {
      toast.error(err.message || 'Error updating transfer.');
    }
  };

  // Filtered Lists
  const filteredProducts = products.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q)
    );
  });

  const filteredBranchStocks = branchStocks.filter((s) => {
    if (selectedBranch !== 'ALL' && s.branchId !== selectedBranch) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return s.productName.toLowerCase().includes(q) || s.productSku.toLowerCase().includes(q);
  });

  const filteredLedger = stockLedger.filter((l) => {
    if (selectedBranch !== 'ALL' && l.branchId !== selectedBranch) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      l.productName.toLowerCase().includes(q) ||
      l.productSku.toLowerCase().includes(q) ||
      l.movementType.toLowerCase().includes(q) ||
      l.referenceId?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Inventory, Procurement & Stock Ledger"
        description="Phase 8: Enterprise multi-branch stock levels, double-entry ledger, service recipes, and procurement logistics."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {/* Branch Filter Switcher */}
            <div className="w-64">
              <Select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                options={branchOptions}
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={refreshAllData}
              title="Refresh All Inventory Data"
            >
              <RefreshCw className="h-4 w-4 mr-1 text-slate-500" />
              Refresh
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsSimulateConsumptionOpen(true)}
              className="bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800"
            >
              <Zap className="h-4 w-4 mr-1 text-purple-600" />
              Simulate Consumption
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAddProductOpen(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white shadow-sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Product
            </Button>
          </div>
        }
      />

      {/* Tabs Navigation */}
      <Tabs
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={[
          { id: 'dashboard', label: 'Dashboard & Intelligence' },
          { id: 'products', label: `Products Catalog (${products.length})` },
          { id: 'stocks', label: `Branch Stock Matrix (${branchStocks.length})` },
          { id: 'ledger', label: `Stock Ledger (${stockLedger.length})` },
          { id: 'recipes', label: `Service Recipes (${recipes.length})` },
          {
            id: 'alerts',
            label: `Alerts (${lowStockAlerts.length + expiryAlerts.length})`,
          },
          { id: 'procurement', label: `Purchase Orders (${purchaseOrders.length})` },
          { id: 'vendors', label: `Vendors CRM (${vendors.length})` },
          { id: 'transfers', label: `Branch Transfers (${transfers.length})` },
        ]}
      />

      {/* Global Quick Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1 min-w-[280px]">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search across products, SKU, barcodes, vendors, or ledger movements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCreatePoOpen(true)}
            className="text-xs"
          >
            <ShoppingCart className="h-3.5 w-3.5 mr-1 text-slate-500" />
            + New PO
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCreateTransferOpen(true)}
            className="text-xs"
          >
            <Truck className="h-3.5 w-3.5 mr-1 text-slate-500" />
            + Transfer Request
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (products.length > 0) {
                setSelectedProductForAdjustment(products[0]);
                setIsAdjustStockOpen(true);
              }
            }}
            className="text-xs"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 mr-1 text-slate-500" />
            + Adjust Stock
          </Button>
        </div>
      </div>

      {/* TAB 1: DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* KPI Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <StatCard
              title="Total Stock Value"
              value={formatCurrency(dashboardKpis?.totalStockValueCost || 0)}
              changePercentage={12.4}
              icon={<Boxes className="h-4 w-4" />}
              subtitle={`Retail: ${formatCurrency(dashboardKpis?.totalStockValueRetail || 0)}`}
            />

            <StatCard
              title="Low Stock Items"
              value={dashboardKpis?.lowStockItemsCount || 0}
              icon={<AlertTriangle className="h-4 w-4" />}
              subtitle={`${dashboardKpis?.criticalStockItemsCount || 0} Critical, ${dashboardKpis?.outOfStockItemsCount || 0} Out of Stock`}
            />

            <StatCard
              title="Expiry Risk Items"
              value={
                (dashboardKpis?.expiringItemsCount.expired || 0) +
                (dashboardKpis?.expiringItemsCount.expires7Days || 0)
              }
              icon={<Clock className="h-4 w-4" />}
              subtitle={`${dashboardKpis?.expiringItemsCount.expired || 0} Expired, ${dashboardKpis?.expiringItemsCount.expires7Days || 0} in 7d`}
            />

            <StatCard
              title="Procurement Spend"
              value={formatCurrency(dashboardKpis?.totalMonthlyPurchaseValue || 0)}
              icon={<ShoppingCart className="h-4 w-4" />}
              subtitle={`${dashboardKpis?.pendingPurchaseOrdersCount || 0} POs in progress`}
            />

            <StatCard
              title="Transfers in Transit"
              value={formatCurrency(dashboardKpis?.activeTransfersInTransitValue || 0)}
              icon={<Truck className="h-4 w-4" />}
              subtitle={`${dashboardKpis?.activeTransfersCount || 0} active dispatches`}
            />

            <StatCard
              title="Catalog Master SKUs"
              value={dashboardKpis?.totalSkuCount || products.length}
              icon={<Package className="h-4 w-4" />}
              subtitle="Active salon products"
            />
          </div>

          {/* Intelligence Grid: Top Consumed vs Top Sold */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Consumed in Services */}
            <Card className="p-5 border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600">
                    <FlaskConical className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                      Top Consumed in Services (Backbar)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Deducted via automated Service Recipes
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  High Utilization
                </Badge>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-950/50 text-slate-500 border-b border-slate-100 dark:border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3 font-medium">Product & Brand</th>
                      <th className="py-2.5 px-3 font-medium text-right">Consumed Qty</th>
                      <th className="py-2.5 px-3 font-medium text-right">Cost Value</th>
                      <th className="py-2.5 px-3 font-medium text-right">Services</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {dashboardKpis?.topConsumedProducts.map((p) => (
                      <tr key={p.productId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-slate-100">
                          {p.productName}
                          <div className="text-[10px] text-slate-400">{p.brand}</div>
                        </td>
                        <td className="py-2.5 px-3 text-right font-semibold text-purple-600">
                          {p.totalConsumedQty} {p.unit}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-300">
                          {formatCurrency(p.totalConsumedValue)}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-500">
                          {p.servicesCount} sessions
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Top Sold Retail Products */}
            <Card className="p-5 border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                      Top Sold Retail Products (POS)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Client take-home luxury products
                    </p>
                  </div>
                </div>
                <Badge variant="default" className="text-xs bg-emerald-600">
                  Revenue Drivers
                </Badge>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-950/50 text-slate-500 border-b border-slate-100 dark:border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3 font-medium">Product & Brand</th>
                      <th className="py-2.5 px-3 font-medium text-right">Units Sold</th>
                      <th className="py-2.5 px-3 font-medium text-right">Revenue</th>
                      <th className="py-2.5 px-3 font-medium text-right">Invoices</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {dashboardKpis?.topSoldProducts.map((p) => (
                      <tr key={p.productId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-slate-100">
                          {p.productName}
                          <div className="text-[10px] text-slate-400">{p.brand}</div>
                        </td>
                        <td className="py-2.5 px-3 text-right font-semibold text-emerald-600">
                          {p.totalSoldQty} {p.unit}
                        </td>
                        <td className="py-2.5 px-3 text-right font-semibold text-slate-900 dark:text-slate-100">
                          {formatCurrency(p.totalSalesValue)}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-500">
                          {p.invoicesCount} bills
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Recent Stock Movements Stream */}
          <Card className="p-5 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                    Recent Stock Ledger Transactions
                  </h3>
                  <p className="text-xs text-slate-500">
                    Immutable double-entry log of real-time movements
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab('ledger')}
                className="text-xs"
              >
                View Full Ledger →
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950/50 text-slate-500 border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3 font-medium">Timestamp</th>
                    <th className="py-2.5 px-3 font-medium">Branch</th>
                    <th className="py-2.5 px-3 font-medium">Product</th>
                    <th className="py-2.5 px-3 font-medium">Type</th>
                    <th className="py-2.5 px-3 font-medium text-right">Quantity</th>
                    <th className="py-2.5 px-3 font-medium text-right">Balance After</th>
                    <th className="py-2.5 px-3 font-medium">Reference</th>
                    <th className="py-2.5 px-3 font-medium">Actor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredLedger.slice(0, 6).map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                        {new Date(l.createdAt).toLocaleDateString()}{' '}
                        <span className="text-[10px]">
                          {new Date(l.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">
                        {l.branchName}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-medium text-slate-900 dark:text-slate-100">{l.productName}</div>
                        <div className="text-[10px] text-slate-400">{l.productSku}</div>
                      </td>
                      <td className="py-2.5 px-3">
                        <Badge
                          variant={movementTypeBadges[l.movementType]?.color || 'default'}
                          className="text-[10px]"
                        >
                          {movementTypeBadges[l.movementType]?.label || l.movementType}
                        </Badge>
                      </td>
                      <td
                        className={`py-2.5 px-3 text-right font-bold ${
                          l.quantity > 0
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {l.quantity > 0 ? `+${l.quantity}` : l.quantity} {l.productUnit}
                      </td>
                      <td className="py-2.5 px-3 text-right font-semibold text-slate-900 dark:text-slate-100">
                        {l.balanceAfter} {l.productUnit}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                        {l.referenceId || '—'}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                        {l.performedByName || 'System'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: PRODUCTS MASTER CATALOG */}
      {activeTab === 'products' && (
        <Card className="border-slate-200 dark:border-slate-800">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                Master Products Catalog ({filteredProducts.length} items)
              </h3>
              <p className="text-xs text-slate-500">
                Central product database with tax rates, multi-unit formats, and retail/backbar flags
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAddProductOpen(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Product
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/50 text-slate-500 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-medium">Product & Brand</th>
                  <th className="py-3 px-3 font-medium">SKU / Barcode</th>
                  <th className="py-3 px-3 font-medium">Category</th>
                  <th className="py-3 px-3 font-medium">Unit</th>
                  <th className="py-3 px-3 font-medium text-right">Cost Price</th>
                  <th className="py-3 px-3 font-medium text-right">Selling Price</th>
                  <th className="py-3 px-3 font-medium text-right">Total Stock</th>
                  <th className="py-3 px-3 font-medium text-right">Total Value</th>
                  <th className="py-3 px-3 font-medium">Class</th>
                  <th className="py-3 px-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{p.name}</div>
                      <div className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                        {p.brand}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-mono text-[11px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300">
                        {p.sku}
                      </span>
                      {p.barcode && (
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {p.barcode}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                      {p.categoryName || 'General'}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 uppercase text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                        {p.unit}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-slate-600 dark:text-slate-300">
                      {formatCurrency(p.costPrice)}
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-slate-900 dark:text-slate-100">
                      {formatCurrency(p.sellingPrice)}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-slate-100">
                      {p.totalStockOnHand} {p.unit}
                    </td>
                    <td className="py-3 px-3 text-right text-emerald-600 dark:text-emerald-400 font-medium">
                      {formatCurrency(p.totalStockValueCost || 0)}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1">
                        {p.isBackbar && (
                          <Badge variant="secondary" className="text-[9px]">
                            Backbar
                          </Badge>
                        )}
                        {p.isRetail && (
                          <Badge variant="default" className="text-[9px] bg-emerald-600">
                            Retail
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedProductForAdjustment(p);
                          setIsAdjustStockOpen(true);
                        }}
                        className="text-xs text-amber-600 hover:text-amber-700"
                      >
                        Adjust
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 3: BRANCH STOCK MATRIX */}
      {activeTab === 'stocks' && (
        <Card className="border-slate-200 dark:border-slate-800">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                Multi-Branch Stock Matrix ({filteredBranchStocks.length} records)
              </h3>
              <p className="text-xs text-slate-500">
                Real-time on-hand, reserved, available inventory with threshold status
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-emerald-600 text-xs">
                OK Stock
              </Badge>
              <Badge variant="warning" className="text-xs">
                Low Stock
              </Badge>
              <Badge variant="destructive" className="text-xs">
                Critical / Out
              </Badge>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/50 text-slate-500 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-medium">Branch</th>
                  <th className="py-3 px-3 font-medium">Product & Brand</th>
                  <th className="py-3 px-3 font-medium">SKU</th>
                  <th className="py-3 px-3 font-medium text-right">On Hand</th>
                  <th className="py-3 px-3 font-medium text-right">Reserved</th>
                  <th className="py-3 px-3 font-medium text-right">Available</th>
                  <th className="py-3 px-3 font-medium text-right">Min Threshold</th>
                  <th className="py-3 px-3 font-medium">Batch / Expiry</th>
                  <th className="py-3 px-3 font-medium">Status</th>
                  <th className="py-3 px-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredBranchStocks.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      {s.branchName}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{s.productName}</div>
                      <div className="text-[10px] text-slate-400">{s.productBrand}</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                      {s.productSku}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-slate-100">
                      {s.currentStock} {s.productUnit}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-500 font-medium">
                      {s.reservedStock} {s.productUnit}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-amber-600 dark:text-amber-400">
                      {s.availableStock} {s.productUnit}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-500">
                      {s.reorderThreshold} {s.productUnit}
                    </td>
                    <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                      <div className="font-mono text-[10px]">{s.batchNumber || '—'}</div>
                      <div className="text-[10px] text-slate-400">
                        {s.expiryDate ? `Exp: ${s.expiryDate}` : 'No Expiry'}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      {s.stockLevelStatus === 'OUT_OF_STOCK' && (
                        <Badge variant="destructive" className="text-[9px]">
                          Out of Stock
                        </Badge>
                      )}
                      {s.stockLevelStatus === 'CRITICAL' && (
                        <Badge variant="destructive" className="text-[9px] bg-rose-600">
                          Critical
                        </Badge>
                      )}
                      {s.stockLevelStatus === 'LOW_STOCK' && (
                        <Badge variant="warning" className="text-[9px]">
                          Low Stock
                        </Badge>
                      )}
                      {s.stockLevelStatus === 'OK' && (
                        <Badge variant="default" className="text-[9px] bg-emerald-600">
                          Optimal
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const prod = products.find((p) => p.id === s.productId);
                          if (prod) {
                            setSelectedProductForAdjustment(prod);
                            setAdjustmentBranchId(s.branchId);
                            setIsAdjustStockOpen(true);
                          }
                        }}
                        className="text-xs h-7 px-2"
                      >
                        Adjust
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 4: STOCK LEDGER (DOUBLE-ENTRY AUDIT TRAIL) */}
      {activeTab === 'ledger' && (
        <Card className="border-slate-200 dark:border-slate-800">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                Immutable Stock Ledger ({filteredLedger.length} events)
              </h3>
              <p className="text-xs text-slate-500">
                Complete transactional audit trail of all inflows, outflows, recipes, and write-offs
              </p>
            </div>
            <Badge variant="secondary" className="text-xs font-mono">
              Never Silently Modifies
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/50 text-slate-500 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-medium">Timestamp</th>
                  <th className="py-3 px-3 font-medium">Branch</th>
                  <th className="py-3 px-3 font-medium">Product & SKU</th>
                  <th className="py-3 px-3 font-medium">Movement Type</th>
                  <th className="py-3 px-3 font-medium text-right">Before</th>
                  <th className="py-3 px-3 font-medium text-right">Change</th>
                  <th className="py-3 px-3 font-medium text-right">After</th>
                  <th className="py-3 px-3 font-medium text-right">Total Cost</th>
                  <th className="py-3 px-3 font-medium">Reference</th>
                  <th className="py-3 px-3 font-medium">Performed By & Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredLedger.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      <div>{new Date(l.createdAt).toLocaleDateString()}</div>
                      <div className="text-[10px] font-mono">
                        {new Date(l.createdAt).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      {l.branchName}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{l.productName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{l.productSku}</div>
                    </td>
                    <td className="py-3 px-3">
                      <Badge
                        variant={movementTypeBadges[l.movementType]?.color || 'default'}
                        className="text-[10px]"
                      >
                        {movementTypeBadges[l.movementType]?.label || l.movementType}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right text-slate-500 font-medium">
                      {l.balanceBefore} {l.productUnit}
                    </td>
                    <td
                      className={`py-3 px-3 text-right font-extrabold ${
                        l.quantity > 0
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {l.quantity > 0 ? `+${l.quantity}` : l.quantity} {l.productUnit}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-slate-100">
                      {l.balanceAfter} {l.productUnit}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-600 dark:text-slate-300 font-medium">
                      {formatCurrency(l.totalCost)}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {l.referenceId || '—'}
                    </td>
                    <td className="py-3 px-3 max-w-[200px]">
                      <div className="font-medium text-slate-900 dark:text-slate-100 truncate">
                        {l.performedByName}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate" title={l.notes || ''}>
                        {l.notes}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 5: SERVICE RECIPES & BILL OF MATERIALS */}
      {activeTab === 'recipes' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((r) => (
              <Card key={r.id} className="p-5 border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {r.serviceName}
                      </h4>
                      <span className="text-[11px] text-slate-500">{r.categoryName || 'Service'}</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">
                    Active BoM
                  </Badge>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400">{r.description}</p>

                {/* Recipe Ingredients Breakdown */}
                <div className="bg-slate-50 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Formula Consumption:
                  </div>
                  {r.items.map((it) => (
                    <div key={it.id} className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {it.productName}
                        </span>
                        {it.notes && (
                          <span className="text-[10px] text-slate-400 ml-1.5">({it.notes})</span>
                        )}
                      </div>
                      <span className="font-bold text-purple-600 dark:text-purple-400">
                        {it.quantity} {it.unit}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    Est. Cost: <span className="font-bold text-slate-900 dark:text-slate-100">{formatCurrency(r.totalFormulaCost)}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSimServiceId(r.serviceId);
                      setIsSimulateConsumptionOpen(true);
                    }}
                    className="text-xs h-7"
                  >
                    Simulate Auto-Deduct
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: LOW STOCK & EXPIRY ALERTS */}
      {activeTab === 'alerts' && (
        <div className="space-y-6">
          {/* Low Stock Alerts Table */}
          <Card className="border-slate-200 dark:border-slate-800">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-rose-500" />
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                    Low & Critical Stock Alerts ({lowStockAlerts.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Products currently at or below minimum reorder thresholds
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950/50 text-slate-500 border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4 font-medium">Branch</th>
                    <th className="py-3 px-3 font-medium">Product & Brand</th>
                    <th className="py-3 px-3 font-medium text-right">Available</th>
                    <th className="py-3 px-3 font-medium text-right">Threshold</th>
                    <th className="py-3 px-3 font-medium text-right">Deficit</th>
                    <th className="py-3 px-3 font-medium">Alert Level</th>
                    <th className="py-3 px-3 font-medium">Suggested Supplier</th>
                    <th className="py-3 px-3 font-medium text-right">Est. Reorder Cost</th>
                    <th className="py-3 px-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {lowStockAlerts.map((a, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                        {a.branchName}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">{a.productName}</div>
                        <div className="text-[10px] text-slate-400">{a.productSku}</div>
                      </td>
                      <td className="py-3 px-3 text-right font-extrabold text-rose-600">
                        {a.availableStock} {a.unit}
                      </td>
                      <td className="py-3 px-3 text-right text-slate-500 font-medium">
                        {a.reorderThreshold} {a.unit}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-amber-600">
                        +{a.deficitQuantity} {a.unit}
                      </td>
                      <td className="py-3 px-3">
                        {a.status === 'OUT_OF_STOCK' && (
                          <Badge variant="destructive" className="text-[9px]">
                            Out of Stock
                          </Badge>
                        )}
                        {a.status === 'CRITICAL' && (
                          <Badge variant="destructive" className="text-[9px] bg-rose-600">
                            Critical
                          </Badge>
                        )}
                        {a.status === 'LOW_STOCK' && (
                          <Badge variant="warning" className="text-[9px]">
                            Low Stock
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                        {a.suggestedVendorName}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-slate-100">
                        {formatCurrency(a.estimatedReorderCost)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            setNewPoBranchId(a.branchId);
                            setNewPoProductId(a.productId);
                            setNewPoQty(a.deficitQuantity);
                            setIsCreatePoOpen(true);
                          }}
                          className="text-xs bg-amber-600 hover:bg-amber-700 text-white h-7 px-2.5"
                        >
                          + Create PO
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Expiry Risk Alerts Table */}
          <Card className="border-slate-200 dark:border-slate-800">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-500" />
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                    Expiry Bucket Tracker ({expiryAlerts.length} at risk)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Expired, Today, 7-Day and 30-Day expiry exposure across branches
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950/50 text-slate-500 border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4 font-medium">Branch</th>
                    <th className="py-3 px-3 font-medium">Product</th>
                    <th className="py-3 px-3 font-medium">Batch</th>
                    <th className="py-3 px-3 font-medium text-right">Stock</th>
                    <th className="py-3 px-3 font-medium">Expiry Date</th>
                    <th className="py-3 px-3 font-medium">Category</th>
                    <th className="py-3 px-3 font-medium text-right">Value at Risk</th>
                    <th className="py-3 px-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {expiryAlerts.map((e, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                        {e.branchName}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900 dark:text-slate-100">
                        {e.productName}
                      </td>
                      <td className="py-3 px-3 font-mono text-[10px] text-slate-500">
                        {e.batchNumber || '—'}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-slate-100">
                        {e.currentStock} {e.unit}
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300">
                        {e.expiryDate} ({e.daysRemaining < 0 ? `${Math.abs(e.daysRemaining)}d ago` : `in ${e.daysRemaining}d`})
                      </td>
                      <td className="py-3 px-3">
                        {e.category === 'EXPIRED' && (
                          <Badge variant="destructive" className="text-[9px]">
                            Expired
                          </Badge>
                        )}
                        {e.category === 'EXPIRES_TODAY' && (
                          <Badge variant="destructive" className="text-[9px] bg-orange-600">
                            Expires Today
                          </Badge>
                        )}
                        {e.category === 'EXPIRES_7_DAYS' && (
                          <Badge variant="warning" className="text-[9px]">
                            Within 7 Days
                          </Badge>
                        )}
                        {e.category === 'EXPIRES_30_DAYS' && (
                          <Badge variant="secondary" className="text-[9px]">
                            Within 30 Days
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-rose-600">
                        {formatCurrency(e.totalValueAtRisk)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const prod = products.find((p) => p.id === e.productId);
                            if (prod) {
                              setSelectedProductForAdjustment(prod);
                              setAdjustmentBranchId(e.branchId);
                              setAdjustmentType('EXPIRY');
                              setAdjustmentQty(-e.currentStock);
                              setAdjustmentNotes(`Expired product write-off batch ${e.batchNumber}`);
                              setIsAdjustStockOpen(true);
                            }
                          }}
                          className="text-xs h-7 text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-900"
                        >
                          Write-Off
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 7: PURCHASE ORDERS */}
      {activeTab === 'procurement' && (
        <Card className="border-slate-200 dark:border-slate-800">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                Procurement & Purchase Orders ({purchaseOrders.length})
              </h3>
              <p className="text-xs text-slate-500">
                End-to-end purchasing: Draft → Submit → Approve → Receive (with automatic stock increment)
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreatePoOpen(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              New Purchase Order
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/50 text-slate-500 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-medium">PO Number</th>
                  <th className="py-3 px-3 font-medium">Branch</th>
                  <th className="py-3 px-3 font-medium">Vendor</th>
                  <th className="py-3 px-3 font-medium">Order Date</th>
                  <th className="py-3 px-3 font-medium">Status</th>
                  <th className="py-3 px-3 font-medium text-right">Items</th>
                  <th className="py-3 px-3 font-medium text-right">Grand Total</th>
                  <th className="py-3 px-3 font-medium text-right">Workflow Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {purchaseOrders.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-bold font-mono text-slate-900 dark:text-slate-100">
                      {po.poNumber}
                    </td>
                    <td className="py-3 px-3 text-slate-700 dark:text-slate-300 font-medium">
                      {po.branchName}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{po.vendorName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{po.vendorCode}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      {new Date(po.orderDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3">
                      {po.status === 'DRAFT' && <Badge variant="default" className="text-[10px]">Draft</Badge>}
                      {po.status === 'SUBMITTED' && <Badge variant="warning" className="text-[10px]">Submitted</Badge>}
                      {po.status === 'APPROVED' && <Badge variant="secondary" className="text-[10px]">Approved</Badge>}
                      {po.status === 'RECEIVED' && <Badge variant="default" className="text-[10px] bg-emerald-600">Received</Badge>}
                      {po.status === 'CANCELLED' && <Badge variant="destructive" className="text-[10px]">Cancelled</Badge>}
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-slate-700 dark:text-slate-300">
                      {po.items.length} lines
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-slate-100">
                      {formatCurrency(po.grandTotal)}
                    </td>
                    <td className="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                      {po.status === 'DRAFT' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTransitionPo(po.id, 'submit')}
                          className="text-xs h-7 px-2"
                        >
                          Submit
                        </Button>
                      )}
                      {po.status === 'SUBMITTED' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleTransitionPo(po.id, 'approve')}
                          className="text-xs h-7 px-2 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Approve
                        </Button>
                      )}
                      {po.status === 'APPROVED' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            setSelectedPoToReceive(po);
                            setIsReceivePoOpen(true);
                          }}
                          className="text-xs h-7 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                          Receive Goods
                        </Button>
                      )}
                      {po.status === 'RECEIVED' && (
                        <span className="text-[11px] text-emerald-600 font-semibold inline-flex items-center">
                          <Check className="h-3.5 w-3.5 mr-1" /> Stock Updated
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 8: VENDORS CRM */}
      {activeTab === 'vendors' && (
        <Card className="border-slate-200 dark:border-slate-800">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                Supplier & Vendor Master Directory ({vendors.length})
              </h3>
              <p className="text-xs text-slate-500">
                Contact information, GSTIN, payment terms, catalog pricing, and invoice history
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAddVendorOpen(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Vendor
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/50 text-slate-500 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-medium">Vendor Name & Code</th>
                  <th className="py-3 px-3 font-medium">Contact Person</th>
                  <th className="py-3 px-3 font-medium">Phone & Email</th>
                  <th className="py-3 px-3 font-medium">GSTIN</th>
                  <th className="py-3 px-3 font-medium">Payment Terms</th>
                  <th className="py-3 px-3 font-medium text-right">Purchases (₹)</th>
                  <th className="py-3 px-3 font-medium text-right">Unpaid Balance</th>
                  <th className="py-3 px-3 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {vendors.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{v.name}</div>
                      <span className="font-mono text-[10px] text-amber-600 font-semibold">{v.code}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-700 dark:text-slate-300 font-medium">
                      {v.contactPerson || '—'}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                      <div>{v.phone}</div>
                      <div className="text-[10px]">{v.email}</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                      {v.gstin || '—'}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300">
                      {v.paymentTerms}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-slate-100">
                      {formatCurrency(v.totalPurchasesValue)}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-rose-600">
                      {formatCurrency(v.unpaidBalance)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Badge variant="default" className="text-[9px] bg-emerald-600">
                        {v.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 9: BRANCH TRANSFERS */}
      {activeTab === 'transfers' && (
        <Card className="border-slate-200 dark:border-slate-800">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                Inter-Branch Stock Transfers ({transfers.length})
              </h3>
              <p className="text-xs text-slate-500">
                Multi-step logistics: Request → Approve → Dispatch (deducts Branch A) → Receive (credits Branch B)
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateTransferOpen(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              New Transfer Request
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/50 text-slate-500 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-medium">Transfer #</th>
                  <th className="py-3 px-3 font-medium">Source Branch</th>
                  <th className="py-3 px-3 font-medium">Destination Branch</th>
                  <th className="py-3 px-3 font-medium">Status</th>
                  <th className="py-3 px-3 font-medium">Items Transferred</th>
                  <th className="py-3 px-3 font-medium text-right">Total Value</th>
                  <th className="py-3 px-3 font-medium">Tracking</th>
                  <th className="py-3 px-3 font-medium text-right">Logistics Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {transfers.map((tr) => (
                  <tr key={tr.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3 px-4 font-bold font-mono text-slate-900 dark:text-slate-100">
                      {tr.transferNumber}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-900 dark:text-slate-100">
                      {tr.sourceBranchName}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-900 dark:text-slate-100">
                      {tr.destinationBranchName}
                    </td>
                    <td className="py-3 px-3">
                      {tr.status === 'REQUESTED' && <Badge variant="default" className="text-[10px]">Requested</Badge>}
                      {tr.status === 'APPROVED' && <Badge variant="secondary" className="text-[10px]">Approved</Badge>}
                      {tr.status === 'IN_TRANSIT' && <Badge variant="warning" className="text-[10px] bg-amber-500">In Transit</Badge>}
                      {tr.status === 'RECEIVED' && <Badge variant="default" className="text-[10px] bg-emerald-600">Received</Badge>}
                    </td>
                    <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                      {tr.items.map((i) => (
                        <div key={i.id} className="text-[11px]">
                          {i.productName} ({i.quantityRequested} {i.productUnit})
                        </div>
                      ))}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-slate-100">
                      {formatCurrency(tr.totalTransferValue)}
                    </td>
                    <td className="py-3 px-3 text-slate-500 text-[11px]">
                      {tr.trackingNumber || tr.transportMode}
                    </td>
                    <td className="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                      {tr.status === 'REQUESTED' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTransitionTransfer(tr.id, 'approve')}
                          className="text-xs h-7 px-2"
                        >
                          Approve
                        </Button>
                      )}
                      {tr.status === 'APPROVED' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleTransitionTransfer(tr.id, 'dispatch')}
                          className="text-xs h-7 px-2.5 bg-amber-600 hover:bg-amber-700 text-white"
                        >
                          <Send className="h-3 w-3 mr-1" />
                          Dispatch (Deduct Branch A)
                        </Button>
                      )}
                      {tr.status === 'IN_TRANSIT' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleTransitionTransfer(tr.id, 'receive')}
                          className="text-xs h-7 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Receive (Credit Branch B)
                        </Button>
                      )}
                      {tr.status === 'RECEIVED' && (
                        <span className="text-[11px] text-emerald-600 font-semibold inline-flex items-center">
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Completed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* MODAL 1: ADD PRODUCT */}
      {/* --------------------------------------------------------------------- */}
      <Modal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        title="Add Product to Master Catalog"
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Product Name *
            </label>
            <Input
              placeholder="e.g. L'Oréal Majirel Cool Mocha 6.13"
              value={newProdName}
              onChange={(e) => setNewProdName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                SKU Identifier *
              </label>
              <Input
                placeholder="e.g. LOR-MAJ-613"
                value={newProdSku}
                onChange={(e) => setNewProdSku(e.target.value)}
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Brand Name
              </label>
              <Input
                placeholder="e.g. L'Oréal Professionnel"
                value={newProdBrand}
                onChange={(e) => setNewProdBrand(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Unit Format
              </label>
              <Select
                value={newProdUnit}
                onChange={(e) => setNewProdUnit(e.target.value as ProductUnit)}
                options={[
                  { value: 'ml', label: 'ml (Milliliters)' },
                  { value: 'g', label: 'g (Grams)' },
                  { value: 'unit', label: 'unit (Single Unit)' },
                  { value: 'oz', label: 'oz (Ounces)' },
                  { value: 'bottle', label: 'bottle (Bottles)' },
                  { value: 'pcs', label: 'pcs (Pieces)' },
                ]}
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Cost Price (₹)
              </label>
              <Input
                type="number"
                value={newProdCost}
                onChange={(e) => setNewProdCost(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Selling Price (₹)
              </label>
              <Input
                type="number"
                value={newProdSelling}
                onChange={(e) => setNewProdSelling(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Low Stock Reorder Alert Threshold
            </label>
            <Input
              type="number"
              value={newProdMinThreshold}
              onChange={(e) => setNewProdMinThreshold(Number(e.target.value))}
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newProdIsBackbar}
                onChange={(e) => setNewProdIsBackbar(e.target.checked)}
                className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-slate-700 dark:text-slate-300">Available for Backbar Service Recipes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newProdIsRetail}
                onChange={(e) => setNewProdIsRetail(e.target.checked)}
                className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-slate-700 dark:text-slate-300">Available for POS Retail Sale</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setIsAddProductOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleCreateProduct}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Save Product
            </Button>
          </div>
        </div>
      </Modal>

      {/* --------------------------------------------------------------------- */}
      {/* MODAL 2: ADJUST STOCK (LEDGER WRITE) */}
      {/* --------------------------------------------------------------------- */}
      <Modal
        isOpen={isAdjustStockOpen}
        onClose={() => setIsAdjustStockOpen(false)}
        title={`Record Stock Adjustment: ${selectedProductForAdjustment?.name || ''}`}
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-lg text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800">
            ⚠️ <strong>Ledger Guarantee:</strong> Stock is never silently modified. This action creates a permanent double-entry audit record with before/after balances.
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Branch Location
              </label>
              <Select
                value={adjustmentBranchId}
                onChange={(e) => setAdjustmentBranchId(e.target.value)}
                options={branchOptions.filter((b) => b.value !== 'ALL')}
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Adjustment Reason Code
              </label>
              <Select
                value={adjustmentType}
                onChange={(e) => setAdjustmentType(e.target.value as any)}
                options={[
                  { value: 'ADJUSTMENT', label: 'Physical Audit Correction (+/-)' },
                  { value: 'DAMAGE', label: 'Damage / Broken Bottle Write-Off (-)' },
                  { value: 'EXPIRY', label: 'Expired Product Disposal (-)' },
                  { value: 'RETURN', label: 'Supplier Return (-)' },
                ]}
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Quantity Change ({selectedProductForAdjustment?.unit || 'units'})
            </label>
            <Input
              type="number"
              placeholder="+50 or -10"
              value={adjustmentQty}
              onChange={(e) => setAdjustmentQty(Number(e.target.value))}
            />
            <span className="text-[10px] text-slate-400">
              Positive values increase stock; negative values deduct from on-hand stock.
            </span>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Audit Explanation / Authorization Notes *
            </label>
            <Input
              value={adjustmentNotes}
              onChange={(e) => setAdjustmentNotes(e.target.value)}
              placeholder="e.g. End of month physical inventory reconciliation"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setIsAdjustStockOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAdjustStock}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Write to Stock Ledger
            </Button>
          </div>
        </div>
      </Modal>

      {/* --------------------------------------------------------------------- */}
      {/* MODAL 3: SIMULATE SERVICE CONSUMPTION */}
      {/* --------------------------------------------------------------------- */}
      <Modal
        isOpen={isSimulateConsumptionOpen}
        onClose={() => setIsSimulateConsumptionOpen(false)}
        title="Simulate Automatic Service Recipe Consumption"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-lg text-purple-800 dark:text-purple-200 border border-purple-200 dark:border-purple-800">
            ✨ When an appointment or POS checkout completes, Hive Salon automatically looks up the service's Bill of Materials and deducts specified grams/milliliters from the branch's backbar stock.
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Target Branch
            </label>
            <Select
              value={simBranchId}
              onChange={(e) => setSimBranchId(e.target.value)}
              options={branchOptions.filter((b) => b.value !== 'ALL')}
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Service with Linked Recipe
            </label>
            <Select
              value={simServiceId}
              onChange={(e) => setSimServiceId(e.target.value)}
              options={recipes.map((r) => ({
                value: r.serviceId,
                label: `${r.serviceName} (${r.items.map((i) => `${i.quantity}${i.unit} ${i.productName}`).join(' + ')})`,
              }))}
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Stylist / Attending Technician
            </label>
            <Input
              value={simStylistName}
              onChange={(e) => setSimStylistName(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setIsSimulateConsumptionOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSimulateConsumption}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Execute Auto-Consumption
            </Button>
          </div>
        </div>
      </Modal>

      {/* --------------------------------------------------------------------- */}
      {/* MODAL 4: CREATE PURCHASE ORDER */}
      {/* --------------------------------------------------------------------- */}
      <Modal
        isOpen={isCreatePoOpen}
        onClose={() => setIsCreatePoOpen(false)}
        title="Create Purchase Order (Procurement)"
      >
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Receiving Branch
              </label>
              <Select
                value={newPoBranchId}
                onChange={(e) => setNewPoBranchId(e.target.value)}
                options={branchOptions.filter((b) => b.value !== 'ALL')}
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Vendor / Supplier
              </label>
              <Select
                value={newPoVendorId}
                onChange={(e) => setNewPoVendorId(e.target.value)}
                options={vendors.map((v) => ({
                  value: v.id,
                  label: `${v.name} (${v.code})`,
                }))}
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Catalog Product
            </label>
            <Select
              value={newPoProductId}
              onChange={(e) => {
                setNewPoProductId(e.target.value);
                const prod = products.find((p) => p.id === e.target.value);
                if (prod) setNewPoUnitCost(prod.costPrice);
              }}
              options={products.map((p) => ({
                value: p.id,
                label: `${p.name} (${p.sku}) — ${p.brand}`,
              }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Order Quantity
              </label>
              <Input
                type="number"
                value={newPoQty}
                onChange={(e) => setNewPoQty(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Unit Cost (₹)
              </label>
              <Input
                type="number"
                value={newPoUnitCost}
                onChange={(e) => setNewPoUnitCost(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              PO Notes & Delivery Instructions
            </label>
            <Input
              value={newPoNotes}
              onChange={(e) => setNewPoNotes(e.target.value)}
            />
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl flex items-center justify-between border border-slate-100 dark:border-slate-800">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Estimated Total (+18% GST):</span>
            <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
              {formatCurrency(newPoQty * newPoUnitCost * 1.18)}
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setIsCreatePoOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleCreatePo}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Generate Purchase Order
            </Button>
          </div>
        </div>
      </Modal>

      {/* --------------------------------------------------------------------- */}
      {/* MODAL 5: RECEIVE PO GOODS */}
      {/* --------------------------------------------------------------------- */}
      <Modal
        isOpen={isReceivePoOpen}
        onClose={() => setIsReceivePoOpen(false)}
        title={`Receive Goods: ${selectedPoToReceive?.poNumber || ''}`}
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800">
            📦 Confirming receipt will automatically increment <strong>{selectedPoToReceive?.branchName}</strong> inventory and write a <code>PURCHASE</code> entry into the Stock Ledger.
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950/50 text-slate-500 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Product</th>
                  <th className="py-2.5 px-3 text-right">Ordered</th>
                  <th className="py-2.5 px-3 text-right">Receiving Qty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {selectedPoToReceive?.items.map((it) => (
                  <tr key={it.id}>
                    <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-slate-100">
                      {it.productName}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-500">
                      {it.quantityOrdered} {it.productUnit}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-600">
                      {it.quantityOrdered} {it.productUnit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setIsReceivePoOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleReceivePo}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Confirm Goods Receipt & Update Stock
            </Button>
          </div>
        </div>
      </Modal>

      {/* --------------------------------------------------------------------- */}
      {/* MODAL 6: CREATE BRANCH TRANSFER */}
      {/* --------------------------------------------------------------------- */}
      <Modal
        isOpen={isCreateTransferOpen}
        onClose={() => setIsCreateTransferOpen(false)}
        title="Inter-Branch Transfer Request"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-lg text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800">
            🚚 <strong>Transfer Isolation:</strong> Destination branch inventory will update <em>strictly upon confirmed receipt</em>. Dispatching deducts from Source branch only.
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Source Branch (From)
              </label>
              <Select
                value={newTrSourceBranch}
                onChange={(e) => setNewTrSourceBranch(e.target.value)}
                options={branchOptions.filter((b) => b.value !== 'ALL')}
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Destination Branch (To)
              </label>
              <Select
                value={newTrDestBranch}
                onChange={(e) => setNewTrDestBranch(e.target.value)}
                options={branchOptions.filter((b) => b.value !== 'ALL')}
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Product to Transfer
            </label>
            <Select
              value={newTrProductId}
              onChange={(e) => setNewTrProductId(e.target.value)}
              options={products.map((p) => ({
                value: p.id,
                label: `${p.name} (${p.sku})`,
              }))}
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Transfer Quantity
            </label>
            <Input
              type="number"
              value={newTrQty}
              onChange={(e) => setNewTrQty(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Logistics & Transfer Notes
            </label>
            <Input
              value={newTrNotes}
              onChange={(e) => setNewTrNotes(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setIsCreateTransferOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleCreateTransfer}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Submit Transfer Request
            </Button>
          </div>
        </div>
      </Modal>

      {/* --------------------------------------------------------------------- */}
      {/* MODAL 7: ADD VENDOR */}
      {/* --------------------------------------------------------------------- */}
      <Modal
        isOpen={isAddVendorOpen}
        onClose={() => setIsAddVendorOpen(false)}
        title="Add Vendor / Supplier"
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Vendor Name *
            </label>
            <Input
              placeholder="e.g. Schwarzkopf Professional India"
              defaultValue="Schwarzkopf Professional India"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Vendor Code *
              </label>
              <Input placeholder="e.g. VEN-SCH-04" defaultValue="VEN-SCH-04" />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Contact Person
              </label>
              <Input placeholder="e.g. Vikram Batra" defaultValue="Vikram Batra" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Phone
              </label>
              <Input placeholder="+91 98111 55667" defaultValue="+91 98111 55667" />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email
              </label>
              <Input placeholder="orders@schwarzkopf.in" defaultValue="orders@schwarzkopf.in" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                GSTIN
              </label>
              <Input placeholder="27AAACS1234K1Z2" defaultValue="27AAACS1234K1Z2" />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Payment Terms
              </label>
              <Select
                defaultValue="Net 30"
                options={[
                  { value: 'Net 30', label: 'Net 30 Days' },
                  { value: 'Net 15', label: 'Net 15 Days' },
                  { value: 'COD', label: 'Cash on Delivery (COD)' },
                  { value: 'Advance', label: '100% Advance Payment' },
                ]}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setIsAddVendorOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                toast.success('Vendor added successfully.');
                setIsAddVendorOpen(false);
                refreshAllData();
              }}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Save Vendor
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function InventoryPage(props: InventoryPageProps) {
  return <InventoryView initialTab={props?.initialTab ?? 'dashboard'} />;
}

