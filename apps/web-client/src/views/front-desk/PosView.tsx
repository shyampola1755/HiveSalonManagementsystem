import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { apiClient } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import {
  Search,
  Plus,
  Trash2,
  Percent,
  CreditCard,
  User,
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  X,
  Printer,
  Receipt,
  Wallet,
  Coins,
} from 'lucide-react';

export const PosView: React.FC = () => {
  const location = useLocation();
  const { activeBranchId } = useAuth();
  const { showToast } = useToast();
  const {
    items,
    customer,
    subtotal,
    discountAmount,
    discountType,
    discountValue,
    taxAmount,
    tipAmount,
    grandTotal,
    addItem,
    removeItem,
    updateItemQuantity,
    setCustomer,
    setDiscount,
    setTipAmount,
    clearCart,
  } = useCart();

  const [attachedAppointmentId, setAttachedAppointmentId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'SERVICES' | 'PRODUCTS'>('SERVICES');
  const [categories, setCategories] = useState<any[]>([
    { _id: 'sc-1', name: 'Hair Services' },
    { _id: 'sc-2', name: 'Color & Highlights' },
    { _id: 'sc-3', name: 'Skin & Facial Therapy' },
    { _id: 'sc-4', name: 'Nails & Hands' },
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [catalogItems, setCatalogItems] = useState<any[]>([
    { _id: 's-1', categoryId: 'sc-1', name: 'Precision Director Haircut', durationMinutes: 45, basePrice: 1500, effectivePrice: 1500, taxRate: 18 },
    { _id: 's-2', categoryId: 'sc-2', name: 'French Balayage & Glossing', durationMinutes: 120, basePrice: 6500, effectivePrice: 6500, taxRate: 18 },
    { _id: 's-3', categoryId: 'sc-1', name: 'Kérastase Chronologiste Luxury Ritual', durationMinutes: 60, basePrice: 3500, effectivePrice: 3500, taxRate: 18 },
    { _id: 's-4', categoryId: 'sc-3', name: 'HydraFacial MD Platinum Rejuvenation', durationMinutes: 60, basePrice: 5500, effectivePrice: 5500, taxRate: 18 },
    { _id: 's-5', categoryId: 'sc-4', name: 'Russian Gel Manicure & Nail Art', durationMinutes: 50, basePrice: 2000, effectivePrice: 2000, taxRate: 18 },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [customersList, setCustomersList] = useState<any[]>([]);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [staffList, setStaffList] = useState<any[]>([
    { _id: 'st-1', displayName: 'Vikram Mehta', jobTitle: 'Senior Creative Hair Stylist' },
    { _id: 'st-2', displayName: 'Sara Khan', jobTitle: 'Master Aesthetician' },
    { _id: 'st-3', displayName: 'Rahul Verma', jobTitle: 'Creative Color Director' },
  ]);

  // Pre-load customer & service if navigated from Queue or Dashboard appointment
  useEffect(() => {
    if (location.state?.appointment) {
      const app = location.state.appointment;
      setAttachedAppointmentId(app._id || app.id);
      if (app.customerId || app.customerName) {
        const rawCust = app.customerId;
        const c = typeof rawCust === 'object' && rawCust !== null ? rawCust : { _id: rawCust, fullName: app.customerName, phone: app.customerPhone };
        setCustomer({
          id: c._id || c.id || `c_${Date.now()}`,
          fullName: c.fullName || app.customerName,
          phone: c.phone || app.customerPhone,
          email: c.email,
          walletBalance: c.walletBalance || 0,
          loyaltyPoints: c.loyaltyPoints || 0,
        });
      }
      if (app.serviceName || app.serviceId) {
        const rawSvc = app.serviceId;
        const svcId = typeof rawSvc === 'object' && rawSvc !== null ? rawSvc._id : (rawSvc || 'srv-item');
        const svcName = typeof rawSvc === 'object' && rawSvc !== null ? rawSvc.name : (app.serviceName || 'Salon Service');
        const price = app.totalPrice || (typeof rawSvc === 'object' && rawSvc !== null ? rawSvc.basePrice : 1500);
        addItem({
          itemType: 'SERVICE',
          itemId: svcId,
          name: svcName,
          quantity: 1,
          unitPrice: price,
          taxRate: 18,
          staffId: app.staffId?._id || app.staffId?.id || app.staffId,
          staffName: app.staffName || app.staffId?.displayName,
        });
      }
    }
  }, [location.state]);

  // Checkout Modal State
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'UPI' | 'WALLET' | 'SPLIT'>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedInvoice, setCompletedInvoice] = useState<any>(null);

  // Fetch catalog & staff
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const getArray = (res: any) => {
          if (!res) return [];
          if (Array.isArray(res.data?.data)) return res.data.data;
          if (Array.isArray(res.data)) return res.data;
          if (Array.isArray(res.data?.data?.data)) return res.data.data.data;
          return [];
        };

        if (activeTab === 'SERVICES') {
          const [catRes, svcRes] = await Promise.all([
            apiClient.get('/services/categories'),
            apiClient.get('/services'),
          ]);
          const cats = getArray(catRes);
          const svcs = getArray(svcRes);
          setCategories(cats.length > 0 ? cats : [
            { _id: 'sc-1', name: 'Hair Services' },
            { _id: 'sc-2', name: 'Color & Highlights' },
            { _id: 'sc-3', name: 'Skin & Facial Therapy' },
            { _id: 'sc-4', name: 'Nails & Hands' },
          ]);
          setCatalogItems(svcs.length > 0 ? svcs : [
            { _id: 's-1', categoryId: 'sc-1', name: 'Precision Director Haircut', durationMinutes: 45, basePrice: 1500, effectivePrice: 1500, taxRate: 18 },
            { _id: 's-2', categoryId: 'sc-2', name: 'French Balayage & Glossing', durationMinutes: 120, basePrice: 6500, effectivePrice: 6500, taxRate: 18 },
            { _id: 's-3', categoryId: 'sc-1', name: 'Kérastase Chronologiste Luxury Ritual', durationMinutes: 60, basePrice: 3500, effectivePrice: 3500, taxRate: 18 },
            { _id: 's-4', categoryId: 'sc-3', name: 'HydraFacial MD Platinum Rejuvenation', durationMinutes: 60, basePrice: 5500, effectivePrice: 5500, taxRate: 18 },
            { _id: 's-5', categoryId: 'sc-4', name: 'Russian Gel Manicure & Nail Art', durationMinutes: 50, basePrice: 2000, effectivePrice: 2000, taxRate: 18 },
          ]);
        } else {
          const [catRes, prodRes] = await Promise.all([
            apiClient.get('/inventory/categories'),
            apiClient.get('/inventory/products?isRetail=true'),
          ]);
          const cats = getArray(catRes);
          const prods = getArray(prodRes);
          setCategories(cats.length > 0 ? cats : [
            { _id: 'pc-1', name: 'Haircare & Masks' },
            { _id: 'pc-2', name: 'Color & Developers' },
            { _id: 'pc-3', name: 'Skincare Serums' },
          ]);
          setCatalogItems(prods.length > 0 ? prods : [
            { _id: 'p-1', categoryId: 'pc-1', name: 'Absolut Repair Molecular Leave-in Mask (100ml)', sku: 'LRL-MOL-100', brand: "L'Oréal Professionnel", retailPrice: 1600, currentQuantity: 24, isRetailItem: true },
            { _id: 'p-2', categoryId: 'pc-1', name: 'Kérastase Elixir Ultime L\'Huile Originale (100ml)', sku: 'KER-ELX-100', brand: 'Kérastase Paris', retailPrice: 3800, currentQuantity: 18, isRetailItem: true },
            { _id: 'p-3', categoryId: 'pc-2', name: 'Dia Light Semi-Permanent Gel-Crème 7.11', sku: 'LRL-DIA-711', brand: "L'Oréal Professionnel", retailPrice: 650, currentQuantity: 35, isRetailItem: true },
            { _id: 'p-4', categoryId: 'pc-1', name: 'Olaplex No. 7 Bonding Oil (30ml)', sku: 'OLP-BND-030', brand: 'Olaplex', retailPrice: 2800, currentQuantity: 14, isRetailItem: true },
            { _id: 'p-5', categoryId: 'pc-3', name: 'SkinCeuticals C E Ferulic Antioxidant Serum (30ml)', sku: 'SKC-CEF-030', brand: 'SkinCeuticals', retailPrice: 11000, currentQuantity: 8, isRetailItem: true },
          ]);
        }
        const staffRes = await apiClient.get('/staff');
        setStaffList(getArray(staffRes));
      } catch (err) {
        console.error('Error fetching catalog:', err);
      }
    };
    fetchCatalog();
  }, [activeTab, activeBranchId]);

  // Customer search & initial load
  const handleSearchCustomers = async (query = '') => {
    setCustomerSearch(query);
    try {
      const endpoint = query.trim() ? `/customers?search=${encodeURIComponent(query.trim())}` : '/customers?limit=50';
      const res = await apiClient.get(endpoint);
      const getArray = (r: any) => {
        if (!r) return [];
        if (Array.isArray(r.data?.data)) return r.data.data;
        if (Array.isArray(r.data)) return r.data;
        if (Array.isArray(r.data?.data?.data)) return r.data.data.data;
        return [];
      };
      setCustomersList(getArray(res));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    handleSearchCustomers('');
  }, [activeBranchId]);

  // Filter items by category & search
  const filteredItems = catalogItems.filter((item) => {
    const matchesCategory =
      selectedCategory === 'ALL' ||
      (activeTab === 'SERVICES'
        ? item.categoryId?._id === selectedCategory || item.categoryId === selectedCategory
        : item.categoryId?._id === selectedCategory || item.categoryId === selectedCategory);
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle Checkout submission
  const handleCheckout = async () => {
    if (items.length === 0) {
      showToast('Cart is empty. Please add items to proceed.', 'error');
      return;
    }
    if (!customer) {
      showToast('Please select a customer for billing.', 'error');
      setShowCustomerModal(true);
      return;
    }

    setIsProcessing(true);
    try {
      const payload = {
        customerId: customer.id || (customer as any)._id,
        customerName: customer.fullName,
        customerPhone: customer.phone,
        branchId: activeBranchId,
        appointmentId: attachedAppointmentId || undefined,
        items: items.map((i) => ({
          itemType: i.itemType,
          itemId: i.itemId,
          name: i.name,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          taxRate: i.taxRate,
          staffId: i.staffId,
          staffName: i.staffName,
        })),
        subtotal,
        discountType,
        discountValue,
        discountAmount,
        taxAmount,
        tipAmount,
        totalAmount: grandTotal,
        grandTotal,
        payments: [{ method: paymentMethod, amount: grandTotal }],
      };

      const res = await apiClient.post('/pos/checkout', payload);
      if (res.data.success) {
        setCompletedInvoice(res.data.data);
        setAttachedAppointmentId(null);
        clearCart();
        setShowCheckoutModal(false);
        showToast('Payment successful & Invoice created!', 'success');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Checkout failed', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-[calc(100vh-6.5rem)] flex gap-6">
      {/* Left: Item Catalog & Touch Grid */}
      <div className="flex-1 flex flex-col glass-card p-5 min-w-0">
        {/* Top Controls: Tabs & Search */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                setActiveTab('SERVICES');
                setSelectedCategory('ALL');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'SERVICES' ? 'bg-brand-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              ✂️ Salon Services
            </button>
            <button
              onClick={() => {
                setActiveTab('PRODUCTS');
                setSelectedCategory('ALL');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'PRODUCTS' ? 'bg-brand-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              🧴 Retail Products
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services or products..."
              className="input-field pl-10 text-xs py-2"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 py-3 overflow-x-auto border-b border-slate-800/80">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
              selectedCategory === 'ALL'
                ? 'bg-slate-700 text-white'
                : 'bg-slate-950/60 text-slate-400 hover:text-white'
            }`}
          >
            All Items
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat._id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                selectedCategory === cat._id
                  ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                  : 'bg-slate-950/60 text-slate-400 hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Catalog Items Grid */}
        <div className="flex-1 overflow-y-auto pt-4 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5 pr-1">
          {filteredItems.map((item) => (
            <button
              key={item._id}
              onClick={() =>
                addItem({
                  itemId: item._id,
                  name: item.name,
                  itemType: activeTab === 'SERVICES' ? 'SERVICE' : 'PRODUCT',
                  unitPrice: activeTab === 'SERVICES' ? (item.effectivePrice || item.basePrice) : item.retailPrice,
                  taxRate: item.taxRate || 18,
                  staffId: staffList[0]?._id,
                  staffName: staffList[0]?.displayName,
                })
              }
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-brand-500/50 hover:bg-slate-900 flex flex-col justify-between text-left transition-all active:scale-[0.98] group relative overflow-hidden"
            >
              <div>
                <div className="text-xs font-bold text-slate-200 group-hover:text-brand-300 transition-colors line-clamp-2">
                  {item.name}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                  <span>{activeTab === 'SERVICES' ? `${item.durationMinutes} mins` : item.brand}</span>
                  {activeTab === 'PRODUCTS' && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        (item.currentQuantity ?? 0) > 0
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {(item.currentQuantity ?? 0) > 0 ? `${item.currentQuantity} in stock` : 'Out of stock'}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-2 border-t border-slate-800/60">
                <span className="font-extrabold text-sm text-white">
                  ₹{activeTab === 'SERVICES' ? (item.effectivePrice || item.basePrice) : item.retailPrice}
                </span>
                <span className="p-1.5 rounded-lg bg-brand-500/10 text-brand-400 group-hover:bg-brand-500 group-hover:text-slate-950 transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right: Real-time Cart & Checkout Panel */}
      <div className="w-96 glass-card p-5 flex flex-col justify-between shrink-0">
        <div>
          {/* Customer Selection Banner */}
          <div className="pb-4 border-b border-slate-800">
            {customer ? (
              <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-brand-300">{customer.fullName}</div>
                  <div className="text-[11px] text-slate-400">{customer.phone}</div>
                </div>
                <button
                  onClick={() => setCustomer(null)}
                  className="text-xs text-slate-400 hover:text-rose-400 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowCustomerModal(true)}
                className="w-full py-2.5 px-3 rounded-xl border border-dashed border-slate-700 hover:border-brand-500/50 bg-slate-950/40 text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center justify-center gap-2 transition-colors"
              >
                <User className="w-4 h-4" /> + Attach Customer (Required)
              </button>
            )}
          </div>

          {/* Cart Items List */}
          <div className="py-3 max-h-60 overflow-y-auto space-y-2 pr-1">
            {items.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">Cart is empty. Tap items on left to add.</div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200 line-clamp-1">{item.name}</span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-slate-500 hover:text-rose-400 ml-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-800/40">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                        className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
                      >
                        -
                      </button>
                      <span className="font-bold text-slate-200">{item.quantity}</span>
                      <button
                        onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                        className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-bold text-slate-100">₹{item.quantity * item.unitPrice}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bill Breakdown & Pay Button */}
        <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Subtotal</span>
            <span className="text-slate-200">₹{subtotal.toLocaleString('en-IN')}</span>
          </div>

          <div className="flex justify-between items-center text-slate-400">
            <span>Discount</span>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min="0"
                value={discountValue || ''}
                onChange={(e) => setDiscount(discountType, Number(e.target.value))}
                placeholder="0"
                className="w-16 bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-right text-xs text-brand-400"
              />
              <span className="text-slate-500">₹</span>
            </div>
          </div>

          <div className="flex justify-between text-slate-400">
            <span>GST (18% inclusive)</span>
            <span className="text-slate-200">₹{Math.round(taxAmount).toLocaleString('en-IN')}</span>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-slate-800">
            <span className="text-sm font-bold text-white">Grand Total</span>
            <span className="text-xl font-black text-brand-400">₹{grandTotal.toLocaleString('en-IN')}</span>
          </div>

          <button
            disabled={items.length === 0}
            onClick={() => setShowCheckoutModal(true)}
            className="btn-gold w-full py-3 mt-2 font-extrabold text-sm"
          >
            <CreditCard className="w-4 h-4" /> Collect Payment & Bill
          </button>
        </div>
      </div>

      {/* Attach Customer Modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-card p-6 border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-brand-400" /> Select / Search Customer
              </h3>
              <button onClick={() => setShowCustomerModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative mb-3">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={customerSearch}
                onChange={(e) => handleSearchCustomers(e.target.value)}
                placeholder="Type customer name or mobile..."
                className="input-field pl-10"
              />
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {customersList.map((c) => (
                <div
                  key={c._id}
                  onClick={() => {
                    setCustomer({
                      id: c._id,
                      fullName: c.fullName,
                      phone: c.phone,
                      email: c.email,
                      walletBalance: c.walletBalance,
                      loyaltyPoints: c.loyaltyPoints,
                    });
                    setShowCustomerModal(false);
                  }}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-brand-500/50 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div>
                    <div className="font-bold text-xs text-white">{c.fullName}</div>
                    <div className="text-[11px] text-slate-400">{c.phone}</div>
                  </div>
                  <div className="text-right text-[11px]">
                    <div className="text-emerald-400 font-semibold">Wallet: ₹{c.walletBalance || 0}</div>
                    <div className="text-brand-400">Pts: {c.loyaltyPoints || 0}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Checkout & Split Payment Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-card p-6 border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-brand-400" /> Payment & Receipt Generation
              </h3>
              <button onClick={() => setShowCheckoutModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center mb-5">
              <div className="text-xs text-slate-400">Total Amount to Collect</div>
              <div className="text-3xl font-black text-brand-400 mt-1">₹{grandTotal.toLocaleString('en-IN')}</div>
              <div className="text-xs text-slate-400 mt-1">Customer: {customer?.fullName}</div>
            </div>

            <div className="space-y-3 mb-6">
              <label className="block text-xs font-semibold text-slate-300">Choose Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {(['UPI', 'CASH', 'CARD', 'WALLET', 'SPLIT'] as const).map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                      paymentMethod === method
                        ? 'bg-brand-500 text-slate-950 border-brand-500 shadow-md'
                        : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="btn-gold w-full py-3 font-extrabold text-sm"
            >
              {isProcessing ? 'Processing Transaction...' : 'Confirm Payment & Print Receipt'}
            </button>
          </div>
        </div>
      )}

      {/* Invoice Generated Modal */}
      {completedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-card p-6 border-slate-800 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-white">Invoice Generated</h3>
            <p className="text-xs text-slate-400 mt-1">Invoice #{completedInvoice.invoiceNumber}</p>

            <div className="my-5 p-4 rounded-xl bg-slate-950 border border-slate-800 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Client:</span>
                <span className="text-white font-bold">{completedInvoice.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Paid:</span>
                <span className="text-brand-400 font-bold">₹{completedInvoice.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Mode:</span>
                <span className="text-emerald-400 font-bold">{completedInvoice.payments?.[0]?.method || 'PAID'}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => window.print()}
                className="btn-secondary flex-1 text-xs py-2.5 font-bold"
              >
                <Printer className="w-4 h-4" /> Print Receipt
              </button>
              <button
                onClick={() => setCompletedInvoice(null)}
                className="btn-gold flex-1 text-xs py-2.5 font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
