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
    loyaltyPoints: 850,
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
  {
    id: 'srv-1',
    name: 'Artisan Balayage & Olaplex Glaze',
    category: 'HAIR_COLOR',
    type: 'SERVICE' as const,
    price: 4000,
    duration: '150 min',
    popular: true,
  },
  {
    id: 'srv-2',
    name: 'Brazilian Keratin Smoothing Complex',
    category: 'TREATMENTS',
    type: 'SERVICE' as const,
    price: 5000,
    duration: '180 min',
    popular: true,
  },
  {
    id: 'srv-3',
    name: 'Executive Precision Haircut & Beard Grooming',
    category: 'CUTS',
    type: 'SERVICE' as const,
    price: 1200,
    duration: '45 min',
    popular: true,
  },
  {
    id: 'srv-4',
    name: 'Hydra-Facial Oxygen Luxe Glow',
    category: 'FACIALS',
    type: 'SERVICE' as const,
    price: 3500,
    duration: '60 min',
    popular: true,
  },
  {
    id: 'srv-5',
    name: 'Signature Japanese Head Spa & Scalp Detox',
    category: 'TREATMENTS',
    type: 'SERVICE' as const,
    price: 2200,
    duration: '50 min',
    popular: false,
  },
  {
    id: 'srv-6',
    name: 'Luxury Gel Manicure & Pedicure Spa',
    category: 'NAILS',
    type: 'SERVICE' as const,
    price: 1800,
    duration: '75 min',
    popular: false,
  },
  {
    id: 'prod-1',
    name: 'Olaplex No. 3 Hair Perfector (100ml)',
    sku: 'OLP-003',
    category: 'RETAIL',
    type: 'PRODUCT' as const,
    price: 2150,
    stock: 14,
    popular: true,
  },
  {
    id: 'prod-2',
    name: 'Moroccanoil Original Treatment (100ml)',
    sku: 'MRC-100',
    category: 'RETAIL',
    type: 'PRODUCT' as const,
    price: 3330,
    stock: 9,
    popular: true,
  },
  {
    id: 'prod-3',
    name: 'Kérastase Chronologiste Regenerating Scrub',
    sku: 'KRS-200',
    category: 'RETAIL',
    type: 'PRODUCT' as const,
    price: 3800,
    stock: 7,
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
}

export default function FrontDeskPosPage() {
  const toast = useToast();

  // Active Context
  const [activeBranch] = React.useState('Jubilee Hills Flagship (JH-01)');
  const [activeCashier] = React.useState('Sarah Jenkins');

  // Customer State
  const [selectedCustomer, setSelectedCustomer] = React.useState<any>(mockCustomers[0]);
  const [isCustomerSearchOpen, setIsCustomerSearchOpen] = React.useState(false);
  const [customerQuery, setCustomerQuery] = React.useState('');

  // Catalog State
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
    },
  ]);

  // Benefit Redemptions
  const [applyMembershipDiscount, setApplyMembershipDiscount] = React.useState(true);
  const [redeemLoyalty, setRedeemLoyalty] = React.useState(false);
  const [useWallet, setUseWallet] = React.useState(false);

  // Modals State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = React.useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState<'UPI' | 'CARD' | 'CASH' | 'SPLIT' | 'WALLET'>('UPI');
  const [cashTendered, setCashTendered] = React.useState<number>(0);
  const [isSuccessReceiptOpen, setIsSuccessReceiptOpen] = React.useState(false);
  const [completedInvoice, setCompletedInvoice] = React.useState<any>(null);

  // Cart Financials
  const grossSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const membershipSavings =
    applyMembershipDiscount && selectedCustomer?.membershipDiscountPct
      ? Math.round((grossSubtotal * selectedCustomer.membershipDiscountPct) / 100)
      : 0;

  const loyaltySavings = redeemLoyalty && selectedCustomer?.loyaltyPoints ? Math.min(selectedCustomer.loyaltyPoints, grossSubtotal) : 0;
  const totalDiscount = membershipSavings + loyaltySavings;
  const taxableAmount = Math.max(0, grossSubtotal - totalDiscount);

  // 18% GST (9% CGST + 9% SGST)
  const cgstAmount = Math.round((taxableAmount * 0.09) * 100) / 100;
  const sgstAmount = Math.round((taxableAmount * 0.09) * 100) / 100;
  const totalTax = cgstAmount + sgstAmount;
  const grandTotal = Math.round(taxableAmount + totalTax);

  // Wallet Deduction
  const walletDeduction = useWallet && selectedCustomer?.walletBalance ? Math.min(selectedCustomer.walletBalance, grandTotal) : 0;
  const payableBalance = Math.max(0, grandTotal - walletDeduction);

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
    toast.info(`Attributed to ${staff.name}`);
  };

  const handleRemoveItem = (cartId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartId));
  };

  const handleInitiatePayment = (method: 'UPI' | 'CARD' | 'CASH' | 'SPLIT' | 'WALLET') => {
    if (cart.length === 0) {
      toast.warning('Cart is empty. Please add items to proceed with billing.');
      return;
    }
    setSelectedPaymentMethod(method);
    setCashTendered(payableBalance);
    setIsPaymentModalOpen(true);
  };

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
    toast.success(`Payment received! Invoice ${invoiceNum} generated.`);
  };

  const handleStartNewSale = () => {
    setCart([]);
    setIsSuccessReceiptOpen(false);
    setUseWallet(false);
    setRedeemLoyalty(false);
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
    <div className="flex flex-col h-[calc(100vh-8rem)] w-full rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden font-sans select-none text-left">
      {/* 2-Pane POS Interface */}
      <div className="flex-1 grid grid-cols-12 overflow-hidden">
        {/* Left 7-Col: Touch Catalog Grid */}
        <div className="col-span-12 lg:col-span-7 flex flex-col border-r border-slate-200 bg-slate-50/50 overflow-hidden">
          {/* Search & Category Tabs */}
          <div className="p-3 bg-white border-b border-slate-200 space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Scan barcode, SKU, or search treatments..."
                className="pl-9 h-10 text-xs bg-slate-50 border-slate-200"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {[
                { id: 'ALL', label: 'All Items' },
                { id: 'POPULAR', label: '🔥 Favorites' },
                { id: 'HAIR_COLOR', label: '💇 Hair Color' },
                { id: 'TREATMENTS', label: '✨ Treatments' },
                { id: 'CUTS', label: '✂️ Cuts' },
                { id: 'FACIALS', label: '💆 Facials' },
                { id: 'RETAIL', label: '🛍️ Retail' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Catalog Grid */}
          <div className="flex-1 p-3 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2.5 content-start">
            {filteredCatalog.map((item) => (
              <button
                key={item.id}
                onClick={() => handleAddToCart(item)}
                className="p-3 rounded-2xl bg-white hover:bg-amber-50/50 border border-slate-200 hover:border-amber-400 text-left transition-all active:scale-[0.98] flex flex-col justify-between space-y-2 group shadow-xs"
              >
                <div className="flex items-start justify-between gap-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-amber-700">
                    {item.type}
                  </span>
                  {item.duration && (
                    <span className="text-[10px] text-slate-500">{item.duration}</span>
                  )}
                  {item.stock !== undefined && (
                    <Badge variant={item.stock <= 5 ? 'destructive' : 'outline'} className="text-[9px] px-1 py-0">
                      Stock: {item.stock}
                    </Badge>
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-2">
                    {item.name}
                  </h4>
                  {item.sku && <span className="text-[10px] text-slate-400 font-mono">SKU: {item.sku}</span>}
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <span className="text-sm font-black text-amber-700 font-mono">
                    {formatCurrency(item.price)}
                  </span>
                  <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-700 group-hover:bg-amber-500 group-hover:text-slate-950 flex items-center justify-center transition-all">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right 5-Col: Live Cart & Bill */}
        <div className="col-span-12 lg:col-span-5 flex flex-col bg-slate-50/60 overflow-hidden">
          {/* Active Guest Profile Banner */}
          <div className="p-3 bg-white border-b border-slate-200 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">{selectedCustomer.fullName}</span>
                <Badge variant="warning" className="text-[9px]">
                  {selectedCustomer.membershipTier.split('(')[0]}
                </Badge>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">{selectedCustomer.phone}</span>
            </div>

            <button
              onClick={() => setIsCustomerSearchOpen(true)}
              className="text-[11px] font-semibold text-amber-700 hover:text-amber-600"
            >
              Change Guest →
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <ShoppingBag className="w-10 h-10 mb-2 opacity-40 text-amber-500" />
                <span className="text-xs font-bold text-slate-700">Checkout Cart Empty</span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Tap treatments or products on the left catalog to add to bill.
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-white border border-slate-200 text-xs space-y-2 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">{item.name}</span>
                        <Badge variant="outline" className="text-[9px]">
                          {item.type}
                        </Badge>
                      </div>
                      <span className="text-xs font-mono text-amber-700 font-bold block mt-0.5">
                        {formatCurrency(item.price)} each
                      </span>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-500">Stylist:</span>
                      <select
                        value={item.staffId}
                        onChange={(e) => handleUpdateStylist(item.id, e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-0.5 text-[11px] text-slate-800 focus:outline-none"
                      >
                        {staffList.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-slate-100 rounded-xl border border-slate-200 p-0.5">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, -1)}
                          className="w-6 h-6 rounded-lg bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center shadow-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center font-mono font-bold text-slate-900 text-xs">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, 1)}
                          className="w-6 h-6 rounded-lg bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center shadow-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-mono font-bold text-slate-900 text-xs w-16 text-right">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Benefits & Financial Breakdown */}
          {cart.length > 0 && (
            <div className="p-3 bg-white border-t border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold uppercase text-[10px] text-slate-500">Guest Benefits</span>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer text-amber-800 font-semibold">
                    <input
                      type="checkbox"
                      checked={applyMembershipDiscount}
                      onChange={(e) => setApplyMembershipDiscount(e.target.checked)}
                      className="rounded border-slate-300 bg-white text-amber-500"
                    />
                    <span>VIP 20% Off</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-emerald-800 font-semibold">
                    <input
                      type="checkbox"
                      checked={useWallet}
                      onChange={(e) => setUseWallet(e.target.checked)}
                      className="rounded border-slate-300 bg-white text-emerald-500"
                    />
                    <span>Debit Wallet</span>
                  </label>
                </div>
              </div>

              {/* Financial Calculation */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 font-mono text-[11px]">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>{formatCurrency(grossSubtotal)}</span>
                </div>
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>VIP Benefits</span>
                    <span>-{formatCurrency(totalDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>18% GST (9% CGST + 9% SGST)</span>
                  <span>+{formatCurrency(totalTax)}</span>
                </div>
                {walletDeduction > 0 && (
                  <div className="flex justify-between text-sky-700 font-semibold">
                    <span>Wallet Debit</span>
                    <span>-{formatCurrency(walletDeduction)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>Payable:</span>
                  <span className="text-amber-700 text-lg">{formatCurrency(payableBalance)}</span>
                </div>
              </div>

              {/* Payment Tender Buttons */}
              <div className="grid grid-cols-4 gap-2 pt-1">
                <button
                  onClick={() => handleInitiatePayment('UPI')}
                  className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-800 font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all active:scale-95 shadow-xs"
                >
                  <QrCode className="w-4 h-4 text-purple-700" />
                  <span>UPI QR</span>
                </button>

                <button
                  onClick={() => handleInitiatePayment('CARD')}
                  className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all active:scale-95 shadow-xs"
                >
                  <CreditCard className="w-4 h-4 text-blue-700" />
                  <span>Card</span>
                </button>

                <button
                  onClick={() => handleInitiatePayment('CASH')}
                  className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all active:scale-95 shadow-xs"
                >
                  <Banknote className="w-4 h-4 text-emerald-700" />
                  <span>Cash</span>
                </button>

                <button
                  onClick={() => handleInitiatePayment('SPLIT')}
                  className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all active:scale-95 shadow-xs"
                >
                  <Sliders className="w-4 h-4 text-amber-700" />
                  <span>Split</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Completion Modal */}
      {isPaymentModalOpen && (
        <Modal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          title={`Take Payment: ${formatCurrency(payableBalance)}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-center text-xs">
            {selectedPaymentMethod === 'UPI' && (
              <div className="space-y-3">
                <div className="w-44 h-44 bg-white p-3 rounded-2xl mx-auto flex flex-col items-center justify-center shadow-xl border-4 border-purple-500/40">
                  <QrCode className="w-32 h-32 text-slate-900" />
                  <span className="text-[10px] font-mono text-slate-600 font-bold">UPI BharatQR</span>
                </div>
                <p className="text-slate-600">Scan via Google Pay, PhonePe, or Paytm.</p>
              </div>
            )}

            {selectedPaymentMethod === 'CASH' && (
              <div className="space-y-3 text-left">
                <Input
                  label="Cash Tendered (₹)"
                  type="number"
                  value={cashTendered}
                  onChange={(e) => setCashTendered(parseFloat(e.target.value) || 0)}
                  className="text-base font-mono font-bold text-amber-700"
                />
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 font-mono text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Payable:</span>
                    <span>{formatCurrency(payableBalance)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-bold pt-1 border-t border-slate-200">
                    <span>Change Due:</span>
                    <span>{formatCurrency(Math.max(0, cashTendered - payableBalance))}</span>
                  </div>
                </div>
              </div>
            )}

            {selectedPaymentMethod === 'CARD' && (
              <div className="space-y-2 py-4">
                <CreditCard className="w-10 h-10 text-blue-600 mx-auto" />
                <h4 className="text-sm font-bold text-slate-900">Tap or Swipe Card on EDC Machine</h4>
                <p className="text-slate-500">Awaiting authorization for {formatCurrency(payableBalance)}.</p>
              </div>
            )}

            {selectedPaymentMethod === 'SPLIT' && (
              <div className="space-y-2 text-left">
                <div className="grid grid-cols-2 gap-2">
                  <Input label="UPI Portion (₹)" defaultValue={Math.round(payableBalance / 2)} />
                  <Input label="Cash Portion (₹)" defaultValue={payableBalance - Math.round(payableBalance / 2)} />
                </div>
                <span className="text-emerald-700 font-bold text-center block">✓ Split balanced</span>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setIsPaymentModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" className="flex-1 font-bold shadow-xs" onClick={handleCompleteTransaction}>
                Confirm & Generate Invoice
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Invoice Settled & Thermal Slip Receipt Modal */}
      {isSuccessReceiptOpen && completedInvoice && (
        <Modal
          isOpen={isSuccessReceiptOpen}
          onClose={() => setIsSuccessReceiptOpen(false)}
          title={`Invoice Settled: ${completedInvoice.invoiceNumber}`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="bg-white text-slate-950 p-6 rounded-2xl font-sans text-xs space-y-3 border border-slate-300 text-left">
              <div className="text-center border-b pb-2">
                <h2 className="text-base font-black text-slate-900">HIVE SALON & SPA</h2>
                <p className="text-[11px] text-slate-600">{completedInvoice.branchName}</p>
                <p className="text-[10px] text-slate-500 font-mono">GSTIN: 36AAAAH9982K1Z5</p>
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

              <div className="divide-y text-[11px]">
                {completedInvoice.items.map((it: any, idx: number) => (
                  <div key={idx} className="py-1 flex justify-between">
                    <span>{it.name} (x{it.quantity})</span>
                    <span className="font-mono font-bold">{formatCurrency(it.price * it.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-2 space-y-1 font-mono text-[11px] text-slate-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(completedInvoice.grossSubtotal)}</span>
                </div>
                {completedInvoice.totalDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>VIP Discounts</span>
                    <span>-{formatCurrency(completedInvoice.totalDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>18% GST</span>
                  <span>{formatCurrency(completedInvoice.totalTax)}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-950 pt-1 border-t border-slate-300">
                  <span>TOTAL PAID ({completedInvoice.paymentMethod})</span>
                  <span>{formatCurrency(completedInvoice.payableBalance)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Send className="w-4 h-4 text-emerald-600" />}
                onClick={() => toast.success(`Receipt sent via WhatsApp to ${completedInvoice.customerPhone}`)}
              >
                Send WhatsApp Receipt
              </Button>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" leftIcon={<Printer className="w-4 h-4" />} onClick={() => window.print()}>
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

      {/* Customer Switcher Modal */}
      {isCustomerSearchOpen && (
        <Modal
          isOpen={isCustomerSearchOpen}
          onClose={() => setIsCustomerSearchOpen(false)}
          title="Select Guest Profile"
          maxWidth="md"
        >
          <div className="space-y-3 text-left">
            <Input
              value={customerQuery}
              onChange={(e) => setCustomerQuery(e.target.value)}
              placeholder="Search by phone number or name..."
              className="h-10 text-xs"
            />
            <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 overflow-hidden max-h-60 overflow-y-auto">
              {mockCustomers.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedCustomer(c);
                    setIsCustomerSearchOpen(false);
                    toast.success(`Switched active guest to ${c.fullName}`);
                  }}
                  className="w-full p-3 bg-white hover:bg-slate-50 flex items-center justify-between text-left transition-colors"
                >
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">{c.fullName}</span>
                    <span className="text-[11px] text-slate-500 font-mono">{c.phone}</span>
                  </div>
                  <Badge variant="warning" className="text-[9px]">
                    {c.membershipTier.split('(')[0]}
                  </Badge>
                </button>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
