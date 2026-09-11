'use client';

import * as React from 'react';
import {
  CreditCard,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  QrCode,
  User,
  Users,
  Search,
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
  Zap,
  PauseCircle,
  RotateCcw,
  Smartphone,
  Banknote,
  HelpCircle,
} from 'lucide-react';
import {
  Button,
  Badge,
  Modal,
  Input,
  useToast,
} from '@hive/ui';
import { formatCurrency } from '@hive/utilities';

// Customers Database
const mockCustomers = [
  {
    id: 'c1',
    fullName: 'Priya Sharma',
    phone: '+91 98765 43210',
    email: 'priya.sharma@example.com',
    membershipTier: 'Royal Diamond Club (20% Off)',
    membershipDiscountPct: 20,
    walletBalance: 4200.0,
    loyaltyPoints: 850, // ₹850
    lastVisit: 'Sep 2, 2026',
    preferredStylist: 'Priya Sharma',
  },
  {
    id: 'c2',
    fullName: 'Rahul Verma',
    phone: '+91 98111 22334',
    email: 'rahul.verma@example.com',
    membershipTier: 'Prepaid Privilege (10% Off)',
    membershipDiscountPct: 10,
    walletBalance: 12500.0,
    loyaltyPoints: 420,
    lastVisit: 'Aug 28, 2026',
    preferredStylist: 'Rajesh Kumar',
  },
  {
    id: 'c3',
    fullName: 'Dr. Sunita Rao',
    phone: '+91 99887 76655',
    email: 'sunita.rao@example.com',
    membershipTier: 'Platinum VIP (15% Off)',
    membershipDiscountPct: 15,
    walletBalance: 6800.0,
    loyaltyPoints: 1240,
    lastVisit: 'Jul 14, 2026',
    preferredStylist: 'Priya Sharma',
  },
  {
    id: 'c4',
    fullName: 'Ananya Roy',
    phone: '+91 91234 56789',
    email: 'ananya.roy@example.com',
    membershipTier: 'Standard Guest',
    membershipDiscountPct: 0,
    walletBalance: 500.0,
    loyaltyPoints: 150,
    lastVisit: 'Sep 5, 2026',
    preferredStylist: 'Vikram Malhotra',
  },
];

// Active Stylists List
const staffList = [
  { id: 'st-1', name: 'Priya Sharma', role: 'Master Stylist' },
  { id: 'st-2', name: 'Rajesh Kumar', role: 'Senior Colorist' },
  { id: 'st-3', name: 'Ananya Roy', role: 'Principal Aesthetician' },
  { id: 'st-4', name: 'Vikram Malhotra', role: 'Senior Stylist' },
  { id: 'st-5', name: 'Siddharth Sen', role: 'Master Barber' },
  { id: 'st-6', name: 'Meera Nambiar', role: 'Nail Artist & Spa Therapist' },
];

// POS Catalog Items
const posCatalog = [
  // Hair Services
  {
    id: 'srv-1',
    name: 'Artisan Balayage & Olaplex Glaze',
    category: 'HAIR_COLOR',
    type: 'SERVICE' as const,
    price: 4000,
    duration: '150 min',
    imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=300&q=80',
    popular: true,
  },
  {
    id: 'srv-2',
    name: 'Brazilian Keratin Smoothing Complex',
    category: 'TREATMENTS',
    type: 'SERVICE' as const,
    price: 5000,
    duration: '180 min',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&q=80',
    popular: true,
  },
  {
    id: 'srv-3',
    name: 'Executive Precision Haircut & Beard Grooming',
    category: 'CUTS',
    type: 'SERVICE' as const,
    price: 1200,
    duration: '45 min',
    imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300&q=80',
    popular: true,
  },
  {
    id: 'srv-4',
    name: 'Hydra-Facial Oxygen Luxe Glow',
    category: 'FACIALS',
    type: 'SERVICE' as const,
    price: 3500,
    duration: '60 min',
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=300&q=80',
    popular: true,
  },
  {
    id: 'srv-5',
    name: 'Signature Japanese Head Spa & Scalp Detox',
    category: 'TREATMENTS',
    type: 'SERVICE' as const,
    price: 2200,
    duration: '50 min',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=300&q=80',
    popular: false,
  },
  {
    id: 'srv-6',
    name: 'Luxury Gel Manicure & Pedicure Spa',
    category: 'NAILS',
    type: 'SERVICE' as const,
    price: 1800,
    duration: '75 min',
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=300&q=80',
    popular: false,
  },
  // Retail Products
  {
    id: 'prod-1',
    name: 'Olaplex No. 3 Hair Perfector (100ml)',
    sku: 'OLP-003',
    category: 'RETAIL',
    type: 'PRODUCT' as const,
    price: 2150,
    stock: 14,
    imageUrl: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=300&q=80',
    popular: true,
  },
  {
    id: 'prod-2',
    name: 'Moroccanoil Original Treatment Argan Oil (100ml)',
    sku: 'MRC-100',
    category: 'RETAIL',
    type: 'PRODUCT' as const,
    price: 3330,
    stock: 9,
    imageUrl: 'https://images.unsplash.com/photo-1608248597359-00f0c0ca9f4c?w=300&q=80',
    popular: true,
  },
  {
    id: 'prod-3',
    name: 'Kérastase Chronologiste Regenerating Scrub (200ml)',
    sku: 'KRS-200',
    category: 'RETAIL',
    type: 'PRODUCT' as const,
    price: 3800,
    stock: 7,
    imageUrl: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=300&q=80',
    popular: false,
  },
  {
    id: 'prod-4',
    name: 'Dyson Supersonic Professional Hair Dryer',
    sku: 'DYS-PRO',
    category: 'RETAIL',
    type: 'PRODUCT' as const,
    price: 34900,
    stock: 2,
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&q=80',
    popular: false,
  },
];

interface CartItem {
  id: string;
  catalogId: string;
  name: string;
  type: 'SERVICE' | 'PRODUCT';
  price: number;
  quantity: number;
  staffId: string;
  staffName: string;
  discountPct: number;
  imageUrl?: string;
}

export default function StandaloneWebPosPage() {
  const toast = useToast();

  // Branch & Register State
  const [activeBranch, setActiveBranch] = React.useState('Jubilee Hills Flagship (JH-01)');
  const [activeCashier] = React.useState('Sarah Jenkins (Lead Receptionist)');

  // Customer Selection State
  const [selectedCustomer, setSelectedCustomer] = React.useState<any>(mockCustomers[0]);
  const [isCustomerSearchOpen, setIsCustomerSearchOpen] = React.useState(false);
  const [customerQuery, setCustomerQuery] = React.useState('');

  // Catalog Filtering State
  const [activeCategory, setActiveCategory] = React.useState<string>('ALL');
  const [searchFilter, setSearchFilter] = React.useState<string>('');

  // Cart State
  const [cart, setCart] = React.useState<CartItem[]>([
    {
      id: 'item-1',
      catalogId: 'srv-1',
      name: 'Artisan Balayage & Olaplex Glaze',
      type: 'SERVICE',
      price: 4000,
      quantity: 1,
      staffId: 'st-1',
      staffName: 'Priya Sharma',
      discountPct: 0,
      imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=300&q=80',
    },
    {
      id: 'item-2',
      catalogId: 'prod-1',
      name: 'Olaplex No. 3 Hair Perfector (100ml)',
      type: 'PRODUCT',
      price: 2150,
      quantity: 1,
      staffId: 'st-1',
      staffName: 'Priya Sharma',
      discountPct: 0,
      imageUrl: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=300&q=80',
    },
  ]);

  // Payment & Redemption Options
  const [applyMembershipDiscount, setApplyMembershipDiscount] = React.useState(true);
  const [redeemLoyalty, setRedeemLoyalty] = React.useState(false);
  const [useWallet, setUseWallet] = React.useState(false);
  const [manualDiscountPct, setManualDiscountPct] = React.useState(0);

  // Modals State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = React.useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState<'UPI' | 'CARD' | 'CASH' | 'SPLIT'>('UPI');
  const [cashTendered, setCashTendered] = React.useState<number>(0);
  const [isSuccessReceiptOpen, setIsSuccessReceiptOpen] = React.useState(false);
  const [completedInvoice, setCompletedInvoice] = React.useState<any>(null);
  const [isDrawerModalOpen, setIsDrawerModalOpen] = React.useState(false);

  // Cart Calculations
  const grossSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Discounts
  const membershipSavings =
    applyMembershipDiscount && selectedCustomer?.membershipDiscountPct
      ? Math.round((grossSubtotal * selectedCustomer.membershipDiscountPct) / 100)
      : 0;

  const manualSavings = manualDiscountPct > 0 ? Math.round((grossSubtotal * manualDiscountPct) / 100) : 0;
  const loyaltySavings = redeemLoyalty && selectedCustomer?.loyaltyPoints ? Math.min(selectedCustomer.loyaltyPoints, grossSubtotal) : 0;

  const totalDiscount = membershipSavings + manualSavings + loyaltySavings;
  const taxableAmount = Math.max(0, grossSubtotal - totalDiscount);

  // 18% GST (9% CGST + 9% SGST)
  const gstRate = 0.18;
  const cgstAmount = Math.round((taxableAmount * 0.09) * 100) / 100;
  const sgstAmount = Math.round((taxableAmount * 0.09) * 100) / 100;
  const totalTax = cgstAmount + sgstAmount;

  let grandTotal = Math.round(taxableAmount + totalTax);

  // Wallet Deduction
  const walletDeduction = useWallet && selectedCustomer?.walletBalance ? Math.min(selectedCustomer.walletBalance, grandTotal) : 0;
  const payableBalance = Math.max(0, grandTotal - walletDeduction);

  // Add Item to Cart
  const handleAddToCart = (item: (typeof posCatalog)[0]) => {
    const existingIndex = cart.findIndex((c) => c.catalogId === item.id);
    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      setCart(updated);
    } else {
      setCart([
        ...cart,
        {
          id: `cart-${Date.now()}-${item.id}`,
          catalogId: item.id,
          name: item.name,
          type: item.type,
          price: item.price,
          quantity: 1,
          staffId: staffList[0].id,
          staffName: staffList[0].name,
          discountPct: 0,
          imageUrl: item.imageUrl,
        },
      ]);
    }
    toast.success(`Added ${item.name} to checkout cart.`);
  };

  const handleUpdateQuantity = (cartId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === cartId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleUpdateStylist = (cartId: string, staffId: string) => {
    const staff = staffList.find((s) => s.id === staffId);
    if (!staff) return;
    setCart((prev) =>
      prev.map((item) => (item.id === cartId ? { ...item, staffId: staff.id, staffName: staff.name } : item))
    );
    toast.info(`Attributed line item to ${staff.name}`);
  };

  const handleRemoveItem = (cartId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartId));
  };

  // Launch Payment Modal
  const handleInitiatePayment = (method: 'UPI' | 'CARD' | 'CASH' | 'SPLIT') => {
    if (cart.length === 0) {
      toast.warning('Cart is empty. Please add items to proceed with billing.');
      return;
    }
    setSelectedPaymentMethod(method);
    setCashTendered(payableBalance);
    setIsPaymentModalOpen(true);
  };

  // Finalize Invoice Payment
  const handleCompleteTransaction = () => {
    const invoiceNum = `INV-${Date.now().toString().slice(-6)}`;
    const invoiceRecord = {
      invoiceNumber: invoiceNum,
      customerName: selectedCustomer.fullName,
      customerPhone: selectedCustomer.phone,
      branchName: activeBranch,
      cashier: activeCashier,
      items: [...cart],
      grossSubtotal,
      totalDiscount,
      membershipSavings,
      loyaltySavings,
      walletDeduction,
      cgstAmount,
      sgstAmount,
      totalTax,
      grandTotal,
      payableBalance,
      paymentMethod: selectedPaymentMethod,
      timestamp: new Date().toLocaleString('en-IN'),
    };

    setCompletedInvoice(invoiceRecord);
    setIsPaymentModalOpen(false);
    setIsSuccessReceiptOpen(true);
    toast.success(`Payment of ${formatCurrency(payableBalance)} received via ${selectedPaymentMethod}! Invoice ${invoiceNum} generated.`);
  };

  const handleStartNewSale = () => {
    setCart([]);
    setIsSuccessReceiptOpen(false);
    setUseWallet(false);
    setRedeemLoyalty(false);
    setManualDiscountPct(0);
    toast.info('New POS billing session initialized.');
  };

  const filteredCatalog = posCatalog.filter((item) => {
    const matchesCategory =
      activeCategory === 'ALL' ||
      (activeCategory === 'POPULAR' && item.popular) ||
      (activeCategory === 'HAIR_COLOR' && item.category === 'HAIR_COLOR') ||
      (activeCategory === 'TREATMENTS' && item.category === 'TREATMENTS') ||
      (activeCategory === 'CUTS' && item.category === 'CUTS') ||
      (activeCategory === 'FACIALS' && item.category === 'FACIALS') ||
      (activeCategory === 'NAILS' && item.category === 'NAILS') ||
      (activeCategory === 'RETAIL' && item.category === 'RETAIL');

    const matchesSearch =
      !searchFilter ||
      item.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (item.sku && item.sku.toLowerCase().includes(searchFilter.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      {/* =======================================================================
          TOP FAST-LANE REGISTER STATUS BAR
      ======================================================================== */}
      <header className="h-14 shrink-0 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-b border-slate-800 px-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-md">
              POS
            </span>
            <div>
              <span className="font-black text-sm text-white tracking-tight block">Hive Fast-Lane POS</span>
              <span className="text-[10px] text-slate-400 font-mono">Register #01 • Front-Desk</span>
            </div>
          </div>

          <div className="h-5 w-px bg-slate-800 hidden sm:block" />

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-300">
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={activeBranch}
              onChange={(e) => {
                setActiveBranch(e.target.value);
                toast.success(`Register switched to ${e.target.value}`);
              }}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-amber-300 font-semibold focus:outline-none"
            >
              <option value="Jubilee Hills Flagship (JH-01)">Jubilee Hills Flagship (JH-01)</option>
              <option value="Banjara Hills Spa (BH-02)">Banjara Hills Spa (BH-02)</option>
              <option value="Hitech City Express (HC-03)">Hitech City Express (HC-03)</option>
              <option value="Indiranagar Sanctuary (IN-01)">Indiranagar Sanctuary (IN-01)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Cashier: <strong className="text-slate-200">Sarah Jenkins</strong></span>
          </div>

          <button
            onClick={() => setIsDrawerModalOpen(true)}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Banknote className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Cash Drawer</span>
          </button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleStartNewSale}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            className="text-xs"
          >
            Clear
          </Button>
        </div>
      </header>

      {/* =======================================================================
          MAIN 2-PANE REGISTER LAYOUT
      ======================================================================== */}
      <div className="flex-1 grid grid-cols-12 overflow-hidden">
        {/* ---------------------------------------------------------------------
            LEFT 7-COLUMN TOUCHSCREEN CATALOG PANE
        ---------------------------------------------------------------------- */}
        <div className="col-span-12 lg:col-span-7 flex flex-col border-r border-slate-800 bg-slate-950/80 overflow-hidden">
          {/* Search Bar & Fast Category Tabs */}
          <div className="p-3 bg-slate-900/60 border-b border-slate-800 space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Scan barcode, SKU, or search treatments (e.g. 'Balayage', 'Keratin', 'Olaplex')..."
                className="pl-9 h-10 text-xs bg-slate-950 border-slate-800 rounded-xl focus:border-amber-400 text-white"
              />
            </div>

            {/* Category Navigation Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {[
                { id: 'ALL', label: 'All Items' },
                { id: 'POPULAR', label: '🔥 Favorites' },
                { id: 'HAIR_COLOR', label: '💇 Hair Color' },
                { id: 'TREATMENTS', label: '✨ Treatments' },
                { id: 'CUTS', label: '✂️ Cuts' },
                { id: 'FACIALS', label: '💆 Skin Glow' },
                { id: 'NAILS', label: '💅 Nails & Spa' },
                { id: 'RETAIL', label: '🛍️ Retail Products' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? 'bg-amber-500 text-slate-950 shadow-md scale-[1.02]'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Touchscreen Product & Service Grid */}
          <div className="flex-1 p-3 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2.5 content-start">
            {filteredCatalog.map((item) => (
              <button
                key={item.id}
                onClick={() => handleAddToCart(item)}
                className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 text-left transition-all active:scale-[0.98] flex flex-col justify-between space-y-2 group shadow-sm hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-1.5">
                  <span className="text-[10px] font-mono uppercase font-bold text-amber-400">
                    {item.type === 'SERVICE' ? 'Service' : 'Retail SKU'}
                  </span>
                  {item.type === 'SERVICE' && (
                    <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {item.duration}
                    </span>
                  )}
                  {item.type === 'PRODUCT' && (
                    <Badge variant={(item.stock ?? 0) <= 5 ? 'destructive' : 'outline'} className="text-[9px] px-1.5 py-0">
                      Stock: {item.stock}
                    </Badge>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
                    {item.name}
                  </h3>
                  {item.sku && <span className="text-[10px] text-slate-500 font-mono block mt-0.5">SKU: {item.sku}</span>}
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                  <span className="text-sm font-black text-amber-300 font-mono">
                    {formatCurrency(item.price)}
                  </span>
                  <div className="w-6 h-6 rounded-lg bg-amber-500/15 text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 flex items-center justify-center transition-all">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ---------------------------------------------------------------------
            RIGHT 5-COLUMN LIVE REGISTER CART & CHECKOUT
        ---------------------------------------------------------------------- */}
        <div className="col-span-12 lg:col-span-5 flex flex-col bg-slate-900/40 overflow-hidden">
          {/* 1. Customer Selector Card */}
          <div className="p-3 bg-slate-950 border-b border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-amber-400" />
                Active Guest Profile
              </span>
              <button
                onClick={() => setIsCustomerSearchOpen(true)}
                className="text-[11px] font-semibold text-amber-400 hover:text-amber-300"
              >
                Change Guest →
              </button>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{selectedCustomer.fullName}</span>
                  <Badge variant="warning" className="text-[9px]">
                    {selectedCustomer.membershipTier}
                  </Badge>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">{selectedCustomer.phone}</span>
              </div>
              <div className="text-right text-[11px] font-mono">
                <span className="text-slate-400 block">Wallet: <strong className="text-emerald-400">{formatCurrency(selectedCustomer.walletBalance)}</strong></span>
                <span className="text-slate-400 block">Points: <strong className="text-amber-400">{selectedCustomer.loyaltyPoints} pts</strong></span>
              </div>
            </div>
          </div>

          {/* 2. Cart Items Table / List */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <ShoppingBag className="w-12 h-12 mb-2 opacity-30 text-amber-400" />
                <span className="text-xs font-bold text-slate-300">Checkout Cart is Empty</span>
                <p className="text-[11px] text-slate-500 max-w-xs mt-0.5">
                  Tap treatments or retail products on the left catalog pane to begin billing.
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white">{item.name}</span>
                        <Badge variant="outline" className="text-[9px]">
                          {item.type}
                        </Badge>
                      </div>
                      <span className="text-xs font-mono text-amber-300 mt-0.5 block font-bold">
                        {formatCurrency(item.price)} each
                      </span>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quantity Stepper & Stylist Attribution */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-850">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400 font-semibold">Stylist:</span>
                      <select
                        value={item.staffId}
                        onChange={(e) => handleUpdateStylist(item.id, e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-0.5 text-[11px] text-slate-200 focus:outline-none"
                      >
                        {staffList.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} ({s.role.split(' ')[0]})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-slate-900 rounded-xl border border-slate-800 p-0.5">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, -1)}
                          className="w-6 h-6 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-300 flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center font-mono font-bold text-white text-xs">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, 1)}
                          className="w-6 h-6 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-300 flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-mono font-bold text-white text-xs w-16 text-right">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 3. Auto Discounts & Redemptions Drawer */}
          {cart.length > 0 && (
            <div className="p-3 bg-slate-950 border-t border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-semibold uppercase text-[10px] tracking-wider text-slate-400">
                  Benefits & Redemptions
                </span>
                <div className="flex items-center gap-3">
                  {selectedCustomer.membershipDiscountPct > 0 && (
                    <label className="flex items-center gap-1.5 cursor-pointer text-amber-300">
                      <input
                        type="checkbox"
                        checked={applyMembershipDiscount}
                        onChange={(e) => setApplyMembershipDiscount(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-400"
                      />
                      <span>VIP {selectedCustomer.membershipDiscountPct}% Off</span>
                    </label>
                  )}

                  {selectedCustomer.loyaltyPoints > 0 && (
                    <label className="flex items-center gap-1.5 cursor-pointer text-amber-300">
                      <input
                        type="checkbox"
                        checked={redeemLoyalty}
                        onChange={(e) => setRedeemLoyalty(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-400"
                      />
                      <span>Redeem {selectedCustomer.loyaltyPoints} Pts</span>
                    </label>
                  )}

                  {selectedCustomer.walletBalance > 0 && (
                    <label className="flex items-center gap-1.5 cursor-pointer text-emerald-300">
                      <input
                        type="checkbox"
                        checked={useWallet}
                        onChange={(e) => setUseWallet(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-400"
                      />
                      <span>Debit Wallet</span>
                    </label>
                  )}
                </div>
              </div>

              {/* 4. Financial Calculation Summary */}
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal ({cart.reduce((a, b) => a + b.quantity, 0)} items)</span>
                  <span>{formatCurrency(grossSubtotal)}</span>
                </div>

                {totalDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Total Benefits & VIP Discounts</span>
                    <span>-{formatCurrency(totalDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-400">
                  <span>18% GST (9% CGST + 9% SGST)</span>
                  <span>+{formatCurrency(totalTax)}</span>
                </div>

                {walletDeduction > 0 && (
                  <div className="flex justify-between text-sky-400 font-semibold">
                    <span>Prepaid Wallet Debit</span>
                    <span>-{formatCurrency(walletDeduction)}</span>
                  </div>
                )}

                <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-800">
                  <span>Payable Amount:</span>
                  <span className="text-amber-400 text-lg">{formatCurrency(payableBalance)}</span>
                </div>
              </div>

              {/* 5. Big Touch Checkout Tender Buttons */}
              <div className="grid grid-cols-4 gap-2 pt-1">
                <button
                  onClick={() => handleInitiatePayment('UPI')}
                  className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 hover:from-purple-500/30 border border-purple-500/40 text-purple-300 flex flex-col items-center justify-center gap-1 transition-all active:scale-95 shadow-md group"
                >
                  <QrCode className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-xs">UPI QR</span>
                </button>

                <button
                  onClick={() => handleInitiatePayment('CARD')}
                  className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 hover:from-blue-500/30 border border-blue-500/40 text-blue-300 flex flex-col items-center justify-center gap-1 transition-all active:scale-95 shadow-md group"
                >
                  <CreditCard className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-xs">Card Swipe</span>
                </button>

                <button
                  onClick={() => handleInitiatePayment('CASH')}
                  className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 hover:from-emerald-500/30 border border-emerald-500/40 text-emerald-300 flex flex-col items-center justify-center gap-1 transition-all active:scale-95 shadow-md group"
                >
                  <Banknote className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-xs">Cash</span>
                </button>

                <button
                  onClick={() => handleInitiatePayment('SPLIT')}
                  className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 hover:from-amber-500/30 border border-amber-500/40 text-amber-300 flex flex-col items-center justify-center gap-1 transition-all active:scale-95 shadow-md group"
                >
                  <Sliders className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-xs">Split</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =======================================================================
          MODAL 1: PAYMENT COMPLETION DIALOG
      ======================================================================== */}
      {isPaymentModalOpen && (
        <Modal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          title={`Complete Payment: ${formatCurrency(payableBalance)}`}
          maxWidth="md"
        >
          <div className="space-y-5 text-center text-xs">
            {selectedPaymentMethod === 'UPI' && (
              <div className="space-y-3">
                <div className="w-48 h-48 bg-white p-3 rounded-2xl mx-auto flex flex-col items-center justify-center shadow-2xl border-4 border-purple-500/40">
                  <QrCode className="w-36 h-36 text-slate-900" />
                  <span className="text-[10px] font-mono text-slate-600 font-bold">UPI Dynamic BharatQR</span>
                </div>
                <p className="text-slate-300 text-xs">
                  Ask {selectedCustomer.fullName} to scan with Google Pay, PhonePe, or Paytm.
                </p>
                <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono">
                  Amount: <strong>{formatCurrency(payableBalance)}</strong> • Ref: HIVE-UPI-{Date.now().toString().slice(-4)}
                </div>
              </div>
            )}

            {selectedPaymentMethod === 'CARD' && (
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-blue-500/20 text-blue-400 border border-blue-500/40 flex items-center justify-center mx-auto shadow-xl">
                  <CreditCard className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-white">Swipe or Tap Card on Terminal</h3>
                <p className="text-slate-400 text-xs">
                  Awaiting authorization from Pine Labs / EDC machine for {formatCurrency(payableBalance)}.
                </p>
                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-mono">
                  Terminal ID: HIVE-POS-EDC-01 • Status: Ready for Card
                </div>
              </div>
            )}

            {selectedPaymentMethod === 'CASH' && (
              <div className="space-y-3 text-left">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Cash Received (₹)</label>
                  <Input
                    type="number"
                    value={cashTendered}
                    onChange={(e) => setCashTendered(parseFloat(e.target.value) || 0)}
                    className="text-base font-mono font-bold text-amber-300 bg-slate-950"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 font-mono text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Payable:</span>
                    <span>{formatCurrency(payableBalance)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-bold text-sm pt-1 border-t border-slate-850">
                    <span>Change Due to Customer:</span>
                    <span>{formatCurrency(Math.max(0, cashTendered - payableBalance))}</span>
                  </div>
                </div>
              </div>
            )}

            {selectedPaymentMethod === 'SPLIT' && (
              <div className="space-y-3 text-left">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">UPI (₹)</label>
                    <Input defaultValue={Math.round(payableBalance / 2)} className="h-9 text-xs" />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Card (₹)</label>
                    <Input defaultValue={payableBalance - Math.round(payableBalance / 2)} className="h-9 text-xs" />
                  </div>
                </div>
                <p className="text-[11px] text-emerald-400 text-center font-semibold">
                  ✓ Split total equals {formatCurrency(payableBalance)}
                </p>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setIsPaymentModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" className="flex-1 font-bold" onClick={handleCompleteTransaction}>
                Confirm & Generate Invoice
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* =======================================================================
          MODAL 2: SUCCESS RECEIPT & PRINTABLE GST TAX INVOICE
      ======================================================================== */}
      {isSuccessReceiptOpen && completedInvoice && (
        <Modal
          isOpen={isSuccessReceiptOpen}
          onClose={() => setIsSuccessReceiptOpen(false)}
          title={`Invoice Settled: ${completedInvoice.invoiceNumber}`}
          maxWidth="lg"
        >
          <div className="space-y-5">
            {/* Printable Luxury Thermal Slip */}
            <div className="bg-white text-slate-950 p-6 rounded-2xl font-sans text-xs space-y-4 border border-slate-300 text-left">
              <div className="text-center border-b pb-3 space-y-0.5">
                <h2 className="text-lg font-black tracking-tight text-slate-900">HIVE SALON & SPA</h2>
                <p className="text-[11px] text-slate-600">{completedInvoice.branchName}</p>
                <p className="text-[10px] text-slate-500 font-mono">GSTIN: 36AAAAH9982K1Z5 • FSSAI/Tax Approved</p>
              </div>

              <div className="flex justify-between text-[11px] border-b pb-2">
                <div>
                  <span>Invoice: <strong className="font-mono">{completedInvoice.invoiceNumber}</strong></span><br />
                  <span>Date: {completedInvoice.timestamp}</span>
                </div>
                <div className="text-right">
                  <span>Guest: <strong>{completedInvoice.customerName}</strong></span><br />
                  <span className="font-mono">{completedInvoice.customerPhone}</span>
                </div>
              </div>

              {/* Items */}
              <div className="divide-y text-[11px]">
                {completedInvoice.items.map((it: any, idx: number) => (
                  <div key={idx} className="py-1.5 flex justify-between">
                    <div>
                      <span className="font-semibold text-slate-900">{it.name}</span>
                      <span className="text-[10px] text-slate-500 block">By: {it.staffName} • Qty: {it.quantity}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900">{formatCurrency(it.price * it.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t pt-2 space-y-1 font-mono text-[11px] text-slate-700">
                <div className="flex justify-between">
                  <span>Subtotal (Excl. GST)</span>
                  <span>{formatCurrency(completedInvoice.grossSubtotal)}</span>
                </div>
                {completedInvoice.totalDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>VIP & Loyalty Savings</span>
                    <span>-{formatCurrency(completedInvoice.totalDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>CGST (9%) + SGST (9%)</span>
                  <span>{formatCurrency(completedInvoice.totalTax)}</span>
                </div>
                {completedInvoice.walletDeduction > 0 && (
                  <div className="flex justify-between text-blue-700 font-bold">
                    <span>Prepaid Wallet Debit</span>
                    <span>-{formatCurrency(completedInvoice.walletDeduction)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black text-slate-950 pt-1.5 border-t border-slate-300">
                  <span>TOTAL PAID ({completedInvoice.paymentMethod})</span>
                  <span>{formatCurrency(completedInvoice.payableBalance)}</span>
                </div>
              </div>

              <div className="text-center pt-2 border-t text-[10px] text-slate-500">
                Thank you for visiting Hive Salon! WhatsApp receipt dispatched to {completedInvoice.customerPhone}.
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Send className="w-4 h-4 text-emerald-400" />}
                onClick={() => toast.success(`Receipt sent to ${completedInvoice.customerPhone} via WhatsApp Cloud API.`)}
              >
                Resend WhatsApp
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Printer className="w-4 h-4" />}
                  onClick={() => window.print()}
                >
                  Print Thermal Slip
                </Button>
                <Button variant="primary" size="sm" onClick={handleStartNewSale}>
                  Start Next Sale
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* =======================================================================
          MODAL 3: CUSTOMER SELECTION SEARCH
      ======================================================================== */}
      {isCustomerSearchOpen && (
        <Modal
          isOpen={isCustomerSearchOpen}
          onClose={() => setIsCustomerSearchOpen(false)}
          title="Select Guest Profile"
          maxWidth="md"
        >
          <div className="space-y-3 text-left">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                value={customerQuery}
                onChange={(e) => setCustomerQuery(e.target.value)}
                placeholder="Search by phone number or name..."
                className="pl-9 h-10 text-xs bg-slate-950"
              />
            </div>

            <div className="divide-y divide-slate-800 rounded-xl border border-slate-800 overflow-hidden max-h-64 overflow-y-auto">
              {mockCustomers
                .filter(
                  (c) =>
                    !customerQuery ||
                    c.fullName.toLowerCase().includes(customerQuery.toLowerCase()) ||
                    c.phone.includes(customerQuery)
                )
                .map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCustomer(c);
                      setIsCustomerSearchOpen(false);
                      toast.success(`Switched active guest to ${c.fullName}`);
                    }}
                    className="w-full p-3 bg-slate-950 hover:bg-slate-900 flex items-center justify-between text-left transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{c.fullName}</span>
                        <Badge variant="warning" className="text-[9px]">
                          {c.membershipTier}
                        </Badge>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">{c.phone}</span>
                    </div>
                    <div className="text-right text-[11px] font-mono">
                      <span className="text-emerald-400 block">Wallet: {formatCurrency(c.walletBalance)}</span>
                      <span className="text-amber-400 block">{c.loyaltyPoints} Pts</span>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </Modal>
      )}

      {/* =======================================================================
          MODAL 4: CASH DRAWER FLOAT & SUMMARY
      ======================================================================== */}
      {isDrawerModalOpen && (
        <Modal
          isOpen={isDrawerModalOpen}
          onClose={() => setIsDrawerModalOpen(false)}
          title="Cash Drawer & Shift Balance"
          maxWidth="md"
        >
          <div className="space-y-4 text-left text-xs">
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center justify-between">
              <div>
                <span className="font-bold block">Current Drawer Balance</span>
                <span className="text-[11px] text-emerald-400">Opening Float + Cash Collected</span>
              </div>
              <span className="text-xl font-black font-mono">₹14,850</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Opening Cash Float (09:00 AM)</span>
                <span>₹5,000.00</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Total Cash Sales Today</span>
                <span>+₹9,850.00</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>UPI Collections Batch</span>
                <span>₹24,800.00</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Card EDC Batch</span>
                <span>₹32,450.00</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setIsDrawerModalOpen(false)}>
                Close
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => {
                  setIsDrawerModalOpen(false);
                  toast.success('Cash Drawer popped open.');
                }}
              >
                Pop Drawer Trigger
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
