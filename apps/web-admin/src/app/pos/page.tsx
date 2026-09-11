'use client';

import * as React from 'react';
import {
  PageHeader,
  Search,
  Button,
  Badge,
  Modal,
  Input,
  useToast,
} from '@hive/ui';
import {
  CreditCard,
  ShoppingBag,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  QrCode,
  User,
  Users,
  Search as SearchIcon,
  Sparkles,
  Scissors,
  Tag,
  DollarSign,
  Wallet,
  Award,
  Receipt,
  Printer,
  Send,
  RefreshCw,
  Clock,
  ArrowRight,
  Sliders,
  Check,
  X,
  Building2,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { formatCurrency } from '@hive/utilities';
import type {
  CartItemDto,
  SplitPaymentItemDto,
  PaymentMethod,
  InvoiceDetail,
} from '@hive/types';

// Mock Customers
const mockCustomers = [
  {
    id: 'c1',
    fullName: 'Priya Sharma',
    phone: '+91 98765 43210',
    membershipTier: 'Royal Diamond Club (20% Off)',
    membershipDiscountPct: 20,
    walletBalance: 4200.0,
    loyaltyPoints: 850, // 850 pts = ₹850
    lastVisit: 'Sep 2, 2026',
    preferredStylist: 'Aarav Mehta',
  },
  {
    id: 'c2',
    fullName: 'Rahul Verma',
    phone: '+91 98111 22334',
    membershipTier: 'Prepaid Privilege 15K (5% Off)',
    membershipDiscountPct: 5,
    walletBalance: 15850.0,
    loyaltyPoints: 420, // ₹420
    lastVisit: 'Aug 28, 2026',
    preferredStylist: 'Vikram Sethi',
  },
  {
    id: 'c3',
    fullName: 'Ananya Roy',
    phone: '+91 99887 76655',
    membershipTier: 'Standard Guest',
    membershipDiscountPct: 0,
    walletBalance: 800.0,
    loyaltyPoints: 120,
    lastVisit: 'Sep 5, 2026',
    preferredStylist: 'Ananya Roy',
  },
];

// Mock Stylists
const staffList = [
  { id: 'st-1', name: 'Aarav Mehta', role: 'Master Stylist' },
  { id: 'st-2', name: 'Pooja Hegde', role: 'Senior Colorist' },
  { id: 'st-3', name: 'Vikram Sethi', role: 'Senior Barber' },
  { id: 'st-4', name: 'Ananya Roy', role: 'Lead Aesthetician' },
  { id: 'st-5', name: 'David Jones', role: 'Spa Therapist' },
  { id: 'st-6', name: 'Meera Nambiar', role: 'Senior Nail Artist' },
];

// Mock Catalog: Services & Retail Products
const posCatalog = [
  // Services
  { id: 'srv-1', name: 'Signature Royal Haircut & Beard Sculpting', category: 'Hair', type: 'SERVICE' as const, price: 850, code: 'HAIR-01' },
  { id: 'srv-2', name: 'Balayage & Multi-Dimensional Glaze', category: 'Hair Color', type: 'SERVICE' as const, price: 6800, code: 'COLOR-02' },
  { id: 'srv-3', name: 'Hydra-Oxygen Rejuvenation Medi-Facial', category: 'Skin', type: 'SERVICE' as const, price: 3400, code: 'FACIAL-03' },
  { id: 'srv-4', name: 'Balinese Aromatic Deep Tissue Massage', category: 'Spa', type: 'SERVICE' as const, price: 3900, code: 'SPA-04' },
  { id: 'srv-5', name: 'Russian Gel Nail Architecture & Art', category: 'Nails', type: 'SERVICE' as const, price: 2600, code: 'NAIL-05' },
  { id: 'srv-6', name: 'Cysteine Protein Anti-Frizz Ritual', category: 'Hair', type: 'SERVICE' as const, price: 5800, code: 'TREAT-06' },
  // Retail Products
  { id: 'prod-1', name: 'Kérastase Elixir Ultime Hair Oil (100ml)', category: 'Retail', type: 'PRODUCT' as const, price: 3400, code: 'RET-KER-01' },
  { id: 'prod-2', name: 'Olaplex No. 3 Hair Perfector (100ml)', category: 'Retail', type: 'PRODUCT' as const, price: 2950, code: 'RET-OLA-03' },
  { id: 'prod-3', name: 'Moroccanoil Treatment Original (100ml)', category: 'Retail', type: 'PRODUCT' as const, price: 3800, code: 'RET-MOR-01' },
  { id: 'prod-4', name: 'L’Oréal Professionnel Absolut Repair Mask (250ml)', category: 'Retail', type: 'PRODUCT' as const, price: 1200, code: 'RET-LOR-02' },
  { id: 'prod-5', name: 'Aromatic Botanical Body Mist (150ml)', category: 'Retail', type: 'PRODUCT' as const, price: 1650, code: 'RET-SPA-05' },
];

export default function PosPage() {
  const toast = useToast();

  // Active Customer State
  const [customerSearch, setCustomerSearch] = React.useState('');
  const [selectedCustomer, setSelectedCustomer] = React.useState<typeof mockCustomers[0] | null>(mockCustomers[0]);
  const [isQuickAddCustomerOpen, setIsQuickAddCustomerOpen] = React.useState(false);
  const [newCustName, setNewCustName] = React.useState('');
  const [newCustPhone, setNewCustPhone] = React.useState('');

  // Cart & Attribution State
  const [cart, setCart] = React.useState<CartItemDto[]>([
    {
      id: 'cart-1',
      itemType: 'SERVICE',
      itemId: 'srv-1',
      itemName: 'Signature Royal Haircut & Beard Sculpting',
      itemCode: 'HAIR-01',
      quantity: 1,
      unitPrice: 850,
      discount: 0,
      tax: 153,
      totalPrice: 1003,
      staffId: 'st-1',
      staffName: 'Aarav Mehta',
      commissionRate: 15,
    },
    {
      id: 'cart-2',
      itemType: 'PRODUCT',
      itemId: 'prod-2',
      itemName: 'Olaplex No. 3 Hair Perfector (100ml)',
      itemCode: 'RET-OLA-03',
      quantity: 1,
      unitPrice: 2950,
      discount: 0,
      tax: 531,
      totalPrice: 3481,
      staffId: 'st-2',
      staffName: 'Pooja Hegde',
      commissionRate: 5,
    },
  ]);

  // Catalog Filter
  const [activeCatalogTab, setActiveCatalogTab] = React.useState<string>('All');

  // Redemptions & Discounts State
  const [applyMembershipDiscount, setApplyMembershipDiscount] = React.useState(true);
  const [redeemLoyaltyPoints, setRedeemLoyaltyPoints] = React.useState(false);
  const [debitWallet, setDebitWallet] = React.useState(false);
  const [walletDebitAmount, setWalletDebitAmount] = React.useState(0);
  const [customDiscountType, setCustomDiscountType] = React.useState<'NONE' | 'PERCENT' | 'FIXED'>('NONE');
  const [customDiscountVal, setCustomDiscountVal] = React.useState(0);

  // Payment Mode State
  const [paymentMode, setPaymentMode] = React.useState<PaymentMethod | 'SPLIT'>('UPI');
  const [cashTendered, setCashTendered] = React.useState<number>(0);
  const [splitPayments, setSplitPayments] = React.useState<SplitPaymentItemDto[]>([
    { method: 'UPI', amount: 0, transactionReference: '' },
    { method: 'CASH', amount: 0 },
    { method: 'CARD', amount: 0, transactionReference: '' },
  ]);

  // Checkout Success & Invoicing Modals
  const [lastInvoice, setLastInvoice] = React.useState<InvoiceDetail | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = React.useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = React.useState(false);
  const [isInvoicesHistoryOpen, setIsInvoicesHistoryOpen] = React.useState(false);

  // Invoices History Seed State
  const [invoicesHistory, setInvoicesHistory] = React.useState<InvoiceDetail[]>([
    {
      id: 'inv-seed-01',
      organizationId: 'org_hive_demo',
      branchId: 'br-jubilee',
      branchName: 'Jubilee Hills Flagship',
      branchCode: 'HYD-JUB',
      customerName: 'Priya Sharma',
      customerPhone: '+91 98765 43210',
      invoiceNumber: 'HYD-JUB-2026-000001',
      subtotal: 6800,
      discountTotal: 1020,
      membershipDiscount: 1020,
      loyaltyRedeemedPoints: 0,
      loyaltyDiscountAmount: 0,
      walletDebitedAmount: 0,
      cgstAmount: 520.2,
      sgstAmount: 520.2,
      taxTotal: 1040.4,
      grandTotal: 6820.4,
      paidAmount: 6820.4,
      balanceAmount: 0,
      status: 'PAID',
      refundedAmount: 0,
      items: [],
      payments: [
        { id: 'p1', invoiceId: 'inv-seed-01', amount: 6820.4, paymentMethod: 'UPI', status: 'SUCCESS', isAdvance: false, createdAt: '2026-09-09T16:00:00Z' },
      ],
      createdAt: '2026-09-09T16:00:00Z',
      updatedAt: '2026-09-09T16:00:00Z',
    },
  ]);

  // Financial Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  // Membership Discount
  const membershipDiscount =
    selectedCustomer && applyMembershipDiscount && selectedCustomer.membershipDiscountPct > 0
      ? Math.round(subtotal * (selectedCustomer.membershipDiscountPct / 100))
      : 0;

  // Custom Discount
  let manualDiscount = 0;
  if (customDiscountType === 'PERCENT') {
    manualDiscount = Math.round(subtotal * (customDiscountVal / 100));
  } else if (customDiscountType === 'FIXED') {
    manualDiscount = Math.min(subtotal, customDiscountVal);
  }

  // Loyalty Points (500 pts = ₹250)
  const loyaltyDiscount =
    selectedCustomer && redeemLoyaltyPoints && selectedCustomer.loyaltyPoints > 0
      ? Math.min(Math.round(selectedCustomer.loyaltyPoints * 0.5), subtotal)
      : 0;

  // Wallet Debit
  const maxWalletUsable = selectedCustomer ? selectedCustomer.walletBalance : 0;
  const walletDebit = debitWallet ? Math.min(maxWalletUsable, walletDebitAmount || maxWalletUsable) : 0;

  const totalDeductions = membershipDiscount + manualDiscount + loyaltyDiscount + walletDebit;
  const taxableAmount = Math.max(0, subtotal - totalDeductions);

  // 18% GST (9% CGST + 9% SGST)
  const taxTotal = Math.round(taxableAmount * 0.18 * 100) / 100;
  const cgst = Math.round((taxTotal / 2) * 100) / 100;
  const sgst = cgst;
  const grandTotal = Math.round((taxableAmount + taxTotal) * 100) / 100;

  // Split Payment Calculations
  const splitTotal = splitPayments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
  const remainingToPay = Math.max(0, Math.round((grandTotal - splitTotal) * 100) / 100);

  // Keyboard Shortcuts Handler
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        document.getElementById('pos-customer-search')?.focus();
      } else if (e.key === 'F8') {
        e.preventDefault();
        setPaymentMode('CASH');
      } else if (e.key === 'F9') {
        e.preventDefault();
        setPaymentMode('UPI');
      } else if (e.key === 'F10') {
        e.preventDefault();
        setPaymentMode('SPLIT');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Add Item to Cart
  const handleAddToCart = (item: typeof posCatalog[0]) => {
    const existingIndex = cart.findIndex((c) => c.itemId === item.id);
    if (existingIndex > -1) {
      setCart(
        cart.map((c, idx) => {
          if (idx === existingIndex) {
            const qty = c.quantity + 1;
            const itemSub = c.unitPrice * qty;
            const itemTax = Math.round(itemSub * 0.18);
            return {
              ...c,
              quantity: qty,
              tax: itemTax,
              totalPrice: itemSub + itemTax,
            };
          }
          return c;
        })
      );
    } else {
      const itemTax = Math.round(item.price * 0.18);
      const newCartItem: CartItemDto = {
        id: `cart-${Date.now()}-${item.id}`,
        itemType: item.type,
        itemId: item.id,
        itemName: item.name,
        itemCode: item.code,
        quantity: 1,
        unitPrice: item.price,
        discount: 0,
        tax: itemTax,
        totalPrice: item.price + itemTax,
        staffId: staffList[0].id,
        staffName: staffList[0].name,
        commissionRate: item.type === 'SERVICE' ? 15 : 5,
      };
      setCart([...cart, newCartItem]);
    }
  };

  // Remove / Update Cart Item
  const handleRemoveCartItem = (id: string) => {
    setCart(cart.filter((c) => c.id !== id));
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart(
      cart
        .map((c) => {
          if (c.id === id) {
            const qty = Math.max(1, c.quantity + delta);
            const itemSub = c.unitPrice * qty;
            const itemTax = Math.round(itemSub * 0.18);
            return {
              ...c,
              quantity: qty,
              tax: itemTax,
              totalPrice: itemSub + itemTax,
            };
          }
          return c;
        })
        .filter((c) => c.quantity > 0)
    );
  };

  const handleUpdateAttribution = (cartId: string, staffId: string) => {
    const staff = staffList.find((s) => s.id === staffId);
    setCart(
      cart.map((c) => {
        if (c.id === cartId) {
          return {
            ...c,
            staffId,
            staffName: staff?.name || 'Staff',
          };
        }
        return c;
      })
    );
  };

  // Quick Add Customer
  const handleQuickAddCustomer = () => {
    if (!newCustName.trim() || !newCustPhone.trim()) {
      toast.error('Client details required', 'Please provide client name and mobile number.');
      return;
    }
    const newCust = {
      id: `c-${Date.now()}`,
      fullName: newCustName.trim(),
      phone: newCustPhone.trim(),
      membershipTier: 'Standard Guest',
      membershipDiscountPct: 0,
      walletBalance: 0,
      loyaltyPoints: 0,
      lastVisit: 'First Visit',
      preferredStylist: 'First Available',
    };
    setSelectedCustomer(newCust);
    setIsQuickAddCustomerOpen(false);
    setNewCustName('');
    setNewCustPhone('');
    toast.success('Customer Selected', `Client ${newCust.fullName} linked to active POS sale.`);
  };

  // Execute POS Checkout
  const handleExecuteCheckout = () => {
    if (cart.length === 0) {
      toast.error('Empty Cart', 'Please add services or products to the cart before checkout.');
      return;
    }

    let compiledPayments: SplitPaymentItemDto[] = [];

    if (paymentMode === 'SPLIT') {
      if (remainingToPay > 0) {
        toast.error('Split Payment Incomplete', `Remaining balance of ₹${remainingToPay} must be allocated before checkout.`);
        return;
      }
      compiledPayments = splitPayments.filter((p) => Number(p.amount) > 0);
    } else {
      compiledPayments = [
        {
          method: paymentMode,
          amount: grandTotal,
          transactionReference: paymentMode === 'UPI' ? `UPI/${Date.now().toString().slice(-8)}` : null,
        },
      ];
    }

    const seq = String(invoicesHistory.length + 2).padStart(6, '0');
    const invoiceNumber = `HYD-JUB-2026-${seq}`;

    const newInvoice: InvoiceDetail = {
      id: `inv-${Date.now()}`,
      organizationId: 'org_hive_demo',
      branchId: 'br-jubilee',
      branchName: 'Jubilee Hills Flagship',
      branchCode: 'HYD-JUB',
      branchAddress: 'Road No. 36, Jubilee Hills, Hyderabad - 500033',
      branchPhone: '+91 40 2355 8899',
      branchGstin: '36AAAAA0000A1Z5',
      customerId: selectedCustomer?.id || null,
      customerName: selectedCustomer?.fullName || 'Walk-in Guest',
      customerPhone: selectedCustomer?.phone || null,
      invoiceNumber,
      subtotal,
      discountTotal: manualDiscount,
      discountType: customDiscountType !== 'NONE' ? customDiscountType : null,
      membershipDiscount,
      loyaltyRedeemedPoints: redeemLoyaltyPoints && selectedCustomer ? selectedCustomer.loyaltyPoints : 0,
      loyaltyDiscountAmount: loyaltyDiscount,
      walletDebitedAmount: walletDebit,
      cgstAmount: cgst,
      sgstAmount: sgst,
      taxTotal,
      grandTotal,
      paidAmount: grandTotal,
      balanceAmount: 0,
      status: 'PAID',
      refundedAmount: 0,
      items: cart,
      payments: compiledPayments.map((p, idx) => ({
        id: `pay-${Date.now()}-${idx}`,
        invoiceId: `inv-${Date.now()}`,
        amount: p.amount,
        paymentMethod: p.method,
        transactionReference: p.transactionReference || null,
        status: 'SUCCESS',
        isAdvance: false,
        createdAt: new Date().toISOString(),
      })),
      digitalReceipts: [
        {
          id: `rec-${Date.now()}`,
          invoiceId: `inv-${Date.now()}`,
          channel: 'WHATSAPP',
          recipient: selectedCustomer?.phone || '+91 98765 43210',
          status: 'SENT',
          sentAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setLastInvoice(newInvoice);
    setInvoicesHistory([newInvoice, ...invoicesHistory]);
    setCart([]);
    setIsSuccessModalOpen(true);
    toast.success('Payment Successful!', `Invoice #${newInvoice.invoiceNumber} created. Digital receipt queued.`);
  };

  return (
    <div className="space-y-4 p-6">
      {/* 1. Header with Quick Stats & Navigation */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <span className="rounded-xl bg-amber-600 p-2 text-white shadow-sm">
            <CreditCard className="h-6 w-6" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                POS Billing & Fast-Lane Checkout
              </h1>
              <Badge variant="success" showDot>Register Open</Badge>
            </div>
            <p className="text-xs text-slate-500">
              Jubilee Hills Flagship (Hyderabad) • Terminal #01 • Cashier: Sarah Jenkins
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsInvoicesHistoryOpen(true)}
            className="flex items-center gap-1.5"
          >
            <Receipt className="h-4 w-4" />
            Invoices History ({invoicesHistory.length})
          </Button>
          <Button
            size="sm"
            onClick={() => setCart([])}
            variant="ghost"
            className="text-xs text-slate-500"
          >
            Clear Cart
          </Button>
        </div>
      </div>

      {/* 2. Customer Intelligence Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex-1 w-full flex items-center gap-2">
            <div className="relative flex-1">
              <SearchIcon className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                id="pos-customer-search"
                type="text"
                placeholder="Lookup customer by 10-digit mobile number or name (Press F2)..."
                value={customerSearch}
                onChange={(e) => {
                  setCustomerSearch(e.target.value);
                  const found = mockCustomers.find(
                    (c) =>
                      c.phone.includes(e.target.value) ||
                      c.fullName.toLowerCase().includes(e.target.value.toLowerCase())
                  );
                  if (found) setSelectedCustomer(found);
                }}
                className="h-9 w-full rounded-lg border border-slate-300 pl-9 pr-3 text-xs text-slate-800 shadow-sm focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsQuickAddCustomerOpen(true)}
              className="h-9 whitespace-nowrap text-xs"
            >
              + Quick Add
            </Button>
          </div>

          {/* Customer Summary Pill */}
          {selectedCustomer && (
            <div className="flex flex-wrap items-center gap-3 rounded-lg bg-amber-50/70 p-2 text-xs dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
              <div className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-amber-700 dark:text-amber-400" />
                <strong className="text-slate-900 dark:text-slate-100">{selectedCustomer.fullName}</strong>
                <span className="text-[11px] text-slate-500 font-mono">({selectedCustomer.phone})</span>
              </div>
              <span>•</span>
              <span className="rounded bg-amber-200/80 px-1.5 py-0.2 text-[10px] font-bold text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                {selectedCustomer.membershipTier}
              </span>
              <span>•</span>
              <span className="text-purple-700 dark:text-purple-300 font-semibold">
                Wallet: <strong>₹{selectedCustomer.walletBalance}</strong>
              </span>
              <span>•</span>
              <span className="text-emerald-700 dark:text-emerald-300 font-semibold">
                Loyalty: <strong>{selectedCustomer.loyaltyPoints} pts (₹{selectedCustomer.loyaltyPoints * 0.5})</strong>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Main Grid: Left Catalog vs Right Cart & Billing */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* LEFT: Services & Retail Product Catalog (7 Columns) */}
        <div className="space-y-3 lg:col-span-7">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-thin border-b border-slate-200 dark:border-slate-800">
            {['All', 'Hair', 'Hair Color', 'Skin', 'Spa', 'Nails', 'Retail'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveCatalogTab(tab)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCatalogTab === tab
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Catalog Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[580px] overflow-y-auto pr-1">
            {posCatalog
              .filter((item) => activeCatalogTab === 'All' || item.category === activeCatalogTab)
              .map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleAddToCart(item)}
                  className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-3 text-left shadow-sm transition-all hover:border-amber-500 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 text-[10px]">
                      <span className="font-mono text-slate-400">{item.code}</span>
                      <Badge variant={item.type === 'SERVICE' ? 'default' : 'warning'} className="text-[9px]">
                        {item.type}
                      </Badge>
                    </div>
                    <h4 className="mt-1.5 text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-amber-600 transition-colors">
                      {item.name}
                    </h4>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 dark:border-slate-800">
                    <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                    <span className="rounded-md bg-amber-50 p-1 text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition-colors dark:bg-slate-800">
                      <Plus className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </button>
              ))}
          </div>
        </div>

        {/* RIGHT: Cart, Multi-Stylist Attribution, Redemptions & Split Pay (5 Columns) */}
        <div className="space-y-4 lg:col-span-5">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between h-full">
            <div>
              {/* Cart Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <ShoppingBag className="h-4 w-4 text-amber-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Order Items ({cart.length})
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Subtotal: ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Cart Items List */}
              <div className="mt-3 space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {cart.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400">
                    Cart is empty. Click services or retail products to add.
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg border border-slate-100 bg-slate-50/50 p-2.5 dark:border-slate-800 dark:bg-slate-800/40"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="overflow-hidden pr-2">
                          <span className="font-bold text-slate-900 dark:text-slate-100 truncate block">
                            {item.itemName}
                          </span>
                          <span className="text-[10px] text-slate-400">₹{item.unitPrice} each</span>
                        </div>
                        <span className="font-extrabold text-slate-900 dark:text-slate-100">
                          ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>

                      {/* Staff Attribution & Quantity Row */}
                      <div className="mt-2 flex items-center justify-between gap-2 border-t border-slate-200/60 pt-1.5 dark:border-slate-700/60">
                        {/* Staff Selector */}
                        <div className="flex items-center gap-1 flex-1">
                          <User className="h-3 w-3 text-slate-400 shrink-0" />
                          <select
                            className="h-6 w-full rounded border border-slate-200 bg-white px-1 text-[10px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                            value={item.staffId || staffList[0].id}
                            onChange={(e) => handleUpdateAttribution(item.id, e.target.value)}
                          >
                            {staffList.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name} ({s.role.split(' ')[0]})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item.id, -1)}
                            className="flex h-5 w-5 items-center justify-center rounded bg-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200"
                          >
                            -
                          </button>
                          <span className="w-5 text-center text-xs font-bold">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item.id, 1)}
                            className="flex h-5 w-5 items-center justify-center rounded bg-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200"
                          >
                            +
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveCartItem(item.id)}
                            className="ml-1 text-slate-400 hover:text-red-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Redemptions & Discounts Strip */}
              <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-2.5 dark:border-slate-800 text-xs">
                {/* Membership Discount Toggle */}
                {selectedCustomer && selectedCustomer.membershipDiscountPct > 0 && (
                  <div className="flex items-center justify-between text-amber-700 dark:text-amber-400">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={applyMembershipDiscount}
                        onChange={(e) => setApplyMembershipDiscount(e.target.checked)}
                        className="h-3.5 w-3.5 rounded text-amber-600"
                      />
                      <span>Apply {selectedCustomer.membershipTier}</span>
                    </label>
                    <span className="font-bold">-₹{membershipDiscount}</span>
                  </div>
                )}

                {/* Loyalty Redemption */}
                {selectedCustomer && selectedCustomer.loyaltyPoints > 0 && (
                  <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-400">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={redeemLoyaltyPoints}
                        onChange={(e) => setRedeemLoyaltyPoints(e.target.checked)}
                        className="h-3.5 w-3.5 rounded text-emerald-600"
                      />
                      <span>Redeem Loyalty Points ({selectedCustomer.loyaltyPoints} pts)</span>
                    </label>
                    <span className="font-bold">-₹{loyaltyDiscount}</span>
                  </div>
                )}

                {/* Wallet Balance Debit */}
                {selectedCustomer && selectedCustomer.walletBalance > 0 && (
                  <div className="flex items-center justify-between text-purple-700 dark:text-purple-400">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={debitWallet}
                        onChange={(e) => {
                          setDebitWallet(e.target.checked);
                          if (e.target.checked) setWalletDebitAmount(selectedCustomer.walletBalance);
                        }}
                        className="h-3.5 w-3.5 rounded text-purple-600"
                      />
                      <span>Debit Prepaid Wallet (Avail ₹{selectedCustomer.walletBalance})</span>
                    </label>
                    <span className="font-bold">-₹{walletDebit}</span>
                  </div>
                )}
              </div>

              {/* Bill Summary Breakdown */}
              <div className="mt-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {totalDeductions > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Total Benefits & Redemptions</span>
                    <span>-₹{totalDeductions.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>18% GST (CGST 9% ₹{cgst} + SGST 9% ₹{sgst})</span>
                  <span>+₹{taxTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-slate-900 dark:text-slate-100 border-t border-slate-200 pt-1.5 dark:border-slate-700">
                  <span>Grand Total</span>
                  <span className="text-amber-600 dark:text-amber-400">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="mt-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                  Payment Method
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['UPI', 'CASH', 'CARD', 'SPLIT'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPaymentMode(mode)}
                      className={`rounded-lg py-1.5 text-xs font-bold transition-all ${
                        paymentMode === mode
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {mode === 'UPI' ? '⚡ UPI' : mode === 'CASH' ? '💵 Cash' : mode === 'CARD' ? '💳 Card' : '✂️ Split'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Split Payment Dynamic Input Table */}
              {paymentMode === 'SPLIT' && (
                <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50/40 p-2.5 dark:border-amber-900 dark:bg-amber-950/20 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-900 dark:text-amber-300">Split Payment Allocation</span>
                    <span className={`font-bold ${remainingToPay === 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {remainingToPay === 0 ? 'Fully Allocated ✅' : `Remaining: ₹${remainingToPay}`}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-600">UPI Amount</label>
                      <Input
                        type="number"
                        value={splitPayments[0].amount}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setSplitPayments([
                            { ...splitPayments[0], amount: val },
                            splitPayments[1],
                            splitPayments[2],
                          ]);
                        }}
                        className="h-7 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-600">Cash Amount</label>
                      <Input
                        type="number"
                        value={splitPayments[1].amount}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setSplitPayments([
                            splitPayments[0],
                            { ...splitPayments[1], amount: val },
                            splitPayments[2],
                          ]);
                        }}
                        className="h-7 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-600">Card Amount</label>
                      <Input
                        type="number"
                        value={splitPayments[2].amount}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setSplitPayments([
                            splitPayments[0],
                            splitPayments[1],
                            { ...splitPayments[2], amount: val },
                          ]);
                        }}
                        className="h-7 text-xs font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Complete Sale Button */}
            <div className="mt-4">
              <Button
                onClick={handleExecuteCheckout}
                disabled={cart.length === 0 || (paymentMode === 'SPLIT' && remainingToPay > 0)}
                className="w-full h-11 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md disabled:bg-slate-300"
              >
                <CheckCircle2 className="h-5 w-5 mr-1.5" />
                Complete Sale & Generate Bill (₹{grandTotal.toLocaleString('en-IN')})
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. SUCCESS STATE & DIGITAL RECEIPT MODAL */}
      {lastInvoice && (
        <Modal
          isOpen={isSuccessModalOpen}
          onClose={() => setIsSuccessModalOpen(false)}
          title={
            <div className="flex items-center gap-2 text-emerald-600">
              <CheckCircle2 className="h-6 w-6" />
              <span>Payment Successful!</span>
            </div>
          }
          description={`Invoice #${lastInvoice.invoiceNumber} generated for ${lastInvoice.customerName}.`}
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
              <span className="text-xs uppercase font-bold text-slate-400">Total Paid</span>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
                ₹{lastInvoice.grandTotal.toLocaleString('en-IN')}
              </div>
              <span className="inline-block mt-1 rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Settled via {lastInvoice.payments.map((p) => p.paymentMethod).join(' + ')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  toast.success('WhatsApp Receipt Dispatched', `Receipt sent to ${lastInvoice.customerPhone || 'customer'}`);
                }}
                className="flex items-center justify-center gap-1.5 text-xs text-emerald-700 border-emerald-300 hover:bg-emerald-50"
              >
                <Send className="h-4 w-4 text-emerald-600" />
                Send WhatsApp Receipt
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  toast.info('Printing Slip', 'Sending 3-inch thermal slip to receipt printer...');
                }}
                className="flex items-center justify-center gap-1.5 text-xs"
              >
                <Printer className="h-4 w-4" />
                Print Thermal Slip
              </Button>
            </div>

            <div className="flex justify-end border-t border-slate-200 pt-3 dark:border-slate-800">
              <Button
                onClick={() => setIsSuccessModalOpen(false)}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                New Sale (F2)
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* 5. INVOICES HISTORY MODAL */}
      <Modal
        isOpen={isInvoicesHistoryOpen}
        onClose={() => setIsInvoicesHistoryOpen(false)}
        title="Invoices & Billing History"
        description="Search past receipts, process full/partial refunds, and audit voided transactions."
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {invoicesHistory.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-800"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {inv.invoiceNumber}
                    </span>
                    <Badge variant={inv.status === 'PAID' ? 'success' : 'destructive'} className="text-[9px]">
                      {inv.status}
                    </Badge>
                  </div>
                  <div className="mt-0.5 text-[11px] text-slate-500">
                    Client: <strong>{inv.customerName}</strong> ({inv.customerPhone || 'N/A'}) • {new Date(inv.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                    ₹{inv.grandTotal.toLocaleString('en-IN')}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      toast.info('Thermal Receipt', `Printing copy of ${inv.invoiceNumber}...`);
                    }}
                    className="h-7 text-[10px]"
                  >
                    Reprint
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end border-t border-slate-200 pt-3 dark:border-slate-800">
            <Button onClick={() => setIsInvoicesHistoryOpen(false)}>Close</Button>
          </div>
        </div>
      </Modal>

      {/* 6. QUICK ADD CUSTOMER MODAL */}
      <Modal
        isOpen={isQuickAddCustomerOpen}
        onClose={() => setIsQuickAddCustomerOpen(false)}
        title="Quick Register Customer"
        description="Instantly add a new client to link with the active POS sale."
        maxWidth="md"
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Full Name *
            </label>
            <Input
              placeholder="e.g. Meera Kapoor"
              value={newCustName}
              onChange={(e) => setNewCustName(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              10-Digit Mobile Number *
            </label>
            <Input
              placeholder="e.g. +91 99000 11223"
              value={newCustPhone}
              onChange={(e) => setNewCustPhone(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-200 pt-3 dark:border-slate-800">
            <Button variant="ghost" onClick={() => setIsQuickAddCustomerOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleQuickAddCustomer} className="bg-amber-600 hover:bg-amber-700 text-white">
              Save & Link Customer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
