import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import {
  Scissors,
  Calendar,
  Clock,
  Sparkles,
  TrendingUp,
  User,
  FlaskConical,
  Award,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  Receipt,
  Check,
  CreditCard,
} from 'lucide-react';

export const StylistView: React.FC = () => {
  const { user, activeBranchId } = useAuth();
  const [queueAppointments, setQueueAppointments] = useState<any[]>([]);
  const [allAppointments, setAllAppointments] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'today' | 'formulas' | 'earnings'>('today');
  const [chairFilter, setChairFilter] = useState<'all' | 'queue' | 'completed'>('all');
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const bParam = activeBranchId ? `?branchId=${encodeURIComponent(activeBranchId)}` : '';
      const [queueRes, allApptsRes, invRes] = await Promise.all([
        apiClient.get(`/appointments/queue${bParam}`),
        apiClient.get(`/appointments${bParam}`),
        apiClient.get(`/pos/invoices${bParam}`),
      ]);

      if (queueRes.data?.success) {
        setQueueAppointments(queueRes.data.data || []);
      }
      if (allApptsRes.data?.success) {
        setAllAppointments(allApptsRes.data.data || []);
      }
      if (invRes.data?.success) {
        setInvoices(invRes.data.data || []);
      }
    } catch (e) {
      console.error('Stylist station fetch error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Re-fetch on focus, cross-tab storage changes, and polling so POS checkout updates immediately
    const handleFocus = () => fetchData();
    const handleStorage = () => fetchData();

    window.addEventListener('focus', handleFocus);
    window.addEventListener('storage', handleStorage);
    const interval = setInterval(fetchData, 4000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, [activeBranchId]);

  // Stylist matching helper: strictly match Vikram Mehta or logged-in stylist
  const isMyStylistItem = (staffName: any, staffId: any) => {
    const myName = (user?.fullName || 'Vikram Mehta').toLowerCase();
    const sName = String(staffName || '').toLowerCase().trim();
    const sId = String(staffId?._id || staffId?.id || staffId || '').toLowerCase().trim();
    const myId = String(user?.id || (user as any)?._id || 'st-1').toLowerCase();

    if (sId && (sId === myId || sId === 'st-1' || sId === 'user_stylist_01')) return true;
    if (sName && (sName.includes('vikram') || myName.includes(sName))) return true;

    return false;
  };

  const d = new Date();
  const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const isTodayDate = (dateVal: any) => {
    if (!dateVal) return true;
    const s = typeof dateVal === 'string' ? dateVal.split('T')[0] : '';
    return !s || s === todayStr;
  };

  // Filter active queue appointments for this stylist
  const myQueue = queueAppointments.filter((a: any) =>
    isMyStylistItem(a.staffName || a.staffId?.displayName, a.staffId) && isTodayDate(a.appointmentDate)
  );

  // Filter completed appointments for this stylist
  const myCompletedAppts = allAppointments.filter(
    (a: any) =>
      a.status === 'COMPLETED' &&
      isMyStylistItem(a.staffName || a.staffId?.displayName, a.staffId) &&
      isTodayDate(a.appointmentDate || a.completedAt)
  );

  // Build unified completed services & billed items list
  const completedList: any[] = [];
  const usedInvoiceIds = new Set<string>();

  // 1. Completed appointments
  myCompletedAppts.forEach((app: any) => {
    const custName = app.customerName || (typeof app.customerId === 'object' ? app.customerId?.fullName : 'Client');
    const appInvId = app.invoiceId ? String(app.invoiceId) : '';
    const appId = String(app._id || app.id || '');
    const appSvc = String(app.serviceName || (typeof app.serviceId === 'object' ? app.serviceId?.name : '')).trim().toLowerCase();

    // Priority 1: Match by explicit Invoice ID or Appointment ID
    let linkedInvoice = invoices.find((inv: any) => {
      const invIdStr = String(inv._id || inv.id || '');
      if (usedInvoiceIds.has(invIdStr)) return false;

      const matchInvId = appInvId && (invIdStr === appInvId || inv.invoiceNumber === appInvId);
      const matchAppId = inv.appointmentId && String(inv.appointmentId) === appId;
      return matchInvId || matchAppId;
    });

    // Priority 2: Match by Customer Name AND exact Service Name
    if (!linkedInvoice && appSvc) {
      linkedInvoice = invoices.find((inv: any) => {
        const invIdStr = String(inv._id || inv.id || '');
        if (usedInvoiceIds.has(invIdStr)) return false;
        if (!isTodayDate(inv.createdAt)) return false;

        const invCust = String(inv.customerName || '').trim().toLowerCase();
        if (!invCust || invCust !== custName.trim().toLowerCase()) return false;

        const matchesService = (inv.items || []).some(
          (it: any) => String(it.name || '').trim().toLowerCase() === appSvc
        );
        return matchesService;
      });
    }

    // Priority 3: Match unclaimed invoice for this customer today ONLY IF appointment has NO invoiceId set
    if (!linkedInvoice && !appInvId) {
      linkedInvoice = invoices.find((inv: any) => {
        const invIdStr = String(inv._id || inv.id || '');
        if (usedInvoiceIds.has(invIdStr)) return false;
        if (!isTodayDate(inv.createdAt)) return false;

        const invCust = String(inv.customerName || '').trim().toLowerCase();
        return invCust && invCust === custName.trim().toLowerCase();
      });
    }

    if (linkedInvoice) {
      usedInvoiceIds.add(String(linkedInvoice._id || linkedInvoice.id || ''));
    }

    let svcName = app.serviceName || (typeof app.serviceId === 'object' ? app.serviceId?.name : 'Hair Service');
    let price = Number(app.totalPrice) || 1500;
    let cut = Math.round(price * 0.2);
    let totalWithTax = Math.round(price * 1.18);
    let invoiceNumber = app.invoiceId || 'INV-PAID';
    let paymentMethod = app.invoiceId ? 'POS Billed' : 'Completed';
    let receiptNote = 'Payment collected at POS • Commission cut credited to your earnings';

    if (linkedInvoice) {
      invoiceNumber = linkedInvoice.invoiceNumber || linkedInvoice._id || invoiceNumber;
      paymentMethod = linkedInvoice.payments?.[0]?.method || 'POS Billed';
      totalWithTax = Number(linkedInvoice.totalAmount) || totalWithTax;

      // Prioritize service item from the invoice
      const invoiceItems = linkedInvoice.items || [];
      const serviceItem = invoiceItems.find((it: any) => it.itemType !== 'PRODUCT') || invoiceItems[0];

      if (serviceItem) {
        svcName = serviceItem.name || svcName;
        price = Number(serviceItem.unitPrice) * (Number(serviceItem.quantity) || 1) || Number(linkedInvoice.subtotal) || price;
        cut = serviceItem.commissionAmount !== undefined ? Number(serviceItem.commissionAmount) : Math.round(price * 0.2);
      } else if (linkedInvoice.subtotal) {
        price = Number(linkedInvoice.subtotal);
        cut = Math.round(price * 0.2);
      }

      receiptNote = `Tax Invoice #${invoiceNumber} • ₹${totalWithTax.toLocaleString('en-IN')} collected at POS • Commission cut credited`;
    }

    completedList.push({
      id: app._id || app.id,
      clientName: custName,
      serviceName: svcName,
      startTime: app.startTime || '13:00',
      durationMinutes: app.durationMinutes || 45,
      amount: price,
      totalWithTax,
      cut,
      status: 'COMPLETED',
      paymentMethod,
      invoiceNumber,
      receiptNote,
      completedAt: app.completedAt || (linkedInvoice?.createdAt ? new Date(linkedInvoice.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'Today'),
      type: 'SERVICE',
    });
  });

  // 2. POS Invoices generated today attributed to this stylist
  invoices.forEach((inv: any) => {
    if (!isTodayDate(inv.createdAt)) return;
    const invIdStr = String(inv._id || inv.id || '');
    if (usedInvoiceIds.has(invIdStr)) return; // Already linked to an appointment!

    (inv.items || []).forEach((item: any, idx: number) => {
      if (!isMyStylistItem(item.staffName, item.staffId)) return;

      const custName = inv.customerName || 'Client';

      // Do NOT include if customer is currently in chair in active queue
      const isCurrentlyInQueue = myQueue.some(
        (q) => (q.customerName || '').toLowerCase() === custName.toLowerCase()
      );
      if (isCurrentlyInQueue) return;

      const itemAmount = Number(item.unitPrice) * (Number(item.quantity) || 1);
      const itemCut =
        item.commissionAmount !== undefined
          ? Number(item.commissionAmount)
          : Math.round(itemAmount * (item.itemType === 'PRODUCT' ? 0.1 : 0.2));
      const totalWithTax = Number(inv.totalAmount) || Math.round(itemAmount * 1.18);
      const invNum = inv.invoiceNumber || inv._id;

      completedList.push({
        id: `inv_item_${inv._id}_${idx}`,
        clientName: custName,
        serviceName: item.name || 'Salon Service',
        startTime: inv.createdAt
          ? new Date(inv.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
          : 'Today',
        durationMinutes: 45,
        amount: itemAmount,
        totalWithTax,
        cut: itemCut,
        status: 'COMPLETED',
        paymentMethod: inv.payments?.[0]?.method || 'POS Paid',
        invoiceNumber: invNum,
        receiptNote: `Tax Invoice #${invNum} • ₹${totalWithTax.toLocaleString('en-IN')} collected at POS • Commission cut credited`,
        completedAt: inv.createdAt || 'Today',
        type: item.itemType || 'SERVICE',
      });
    });
  });

  // Calculations
  const completedRevenue = completedList.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const completedCommissions = completedList.reduce((sum, item) => sum + (Number(item.cut) || 0), 0);

  const inServiceCount = myQueue.filter((a) => a.status === 'IN_SERVICE').length;
  const scheduledCount = myQueue.filter((a) => a.status !== 'IN_SERVICE').length;
  const totalClientsToday = myQueue.length + completedList.length;

  const todayCommissionsTotal = 1660 + completedCommissions;
  const monthlyRevenueTotal = 98400 + completedRevenue;
  const targetPct = Math.min(100, Math.round((monthlyRevenueTotal / 150000) * 1000) / 10);

  // Filtered Chair list
  const filteredChairList =
    chairFilter === 'queue'
      ? myQueue
      : chairFilter === 'completed'
      ? completedList
      : [...myQueue, ...completedList];

  const myFormulas = [
    {
      clientName: 'Rhea Kapoor',
      service: 'Warm Honey Balayage Gloss',
      brand: "L'Oréal Professionnel Dia Light",
      mix: '8.34 (30g) + 9.02 (15g) + Clear (10g)',
      developer: '6 Vol (1.8%) • Ratio 1:1.5',
      time: '20 mins processing',
      notes: 'Very porous ends. Do not exceed 20 mins. Rinse with Metal Detox shampoo.',
      date: 'Today, 11:15 AM',
    },
    {
      clientName: 'Pooja Hegde',
      service: 'Cool Mocha Brunette Gloss',
      brand: 'Wella Professionals Illumina',
      mix: '6/16 (40g) + 7/81 (20g)',
      developer: '1.9% Pastel Developer',
      time: '15 mins processing',
      notes: 'Tone on towel-dried hair after pre-lightening.',
      date: '3 days ago',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stylist Header */}
      <div className="glass-card p-6 bg-gradient-to-r from-amber-50/70 via-rose-50/50 to-purple-50/40 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs text-rose-600 font-bold uppercase tracking-wider mb-1">
            <Scissors className="w-4 h-4" /> Stylist Station & Chair Dashboard
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            Welcome back, {user?.fullName || 'Vikram Mehta (Senior Creative Stylist)'} 💇‍♂️
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Senior Creative Hair Stylist • Chair #03 (Banjara Hills Flagship)
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('today')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'today' ? 'bg-brand-500 text-slate-950 font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Chair Schedule
          </button>
          <button
            onClick={() => setActiveTab('formulas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'formulas' ? 'bg-brand-500 text-slate-950 font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Hair Formulas
          </button>
          <button
            onClick={() => setActiveTab('earnings')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'earnings' ? 'bg-brand-500 text-slate-950 font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Commissions
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>MY CLIENTS TODAY</span>
            <User className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalClientsToday} Clients</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            {inServiceCount > 0
              ? `${inServiceCount} currently in service`
              : `${completedList.length} completed today • ${scheduledCount} scheduled`}
          </div>
        </div>

        <div className="glass-card p-5 border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>TODAY'S COMMISSIONS</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">
            ₹{todayCommissionsTotal.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            {completedCommissions > 0
              ? `20% tier • +₹${completedCommissions.toLocaleString('en-IN')} earned from ${completedList.length} completed`
              : '20% commission tier rate'}
          </div>
        </div>

        <div className="glass-card p-5 border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>MONTHLY TARGET PROGRESS</span>
            <TrendingUp className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            ₹{monthlyRevenueTotal.toLocaleString('en-IN')} / 1.5L
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-sky-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${targetPct}%` }}
            ></div>
          </div>
        </div>

        <div className="glass-card p-5 border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>CLIENT RATING</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">4.95 ⭐</div>
          <div className="text-[11px] text-amber-600 font-medium mt-1">Based on 64 reviews</div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'today' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chair Appointments */}
          <div className="lg:col-span-2 glass-card p-6 border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-600" /> Today's Chair Queue & Appointments
              </h3>
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
                <button
                  onClick={() => setChairFilter('all')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    chairFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  All ({totalClientsToday})
                </button>
                <button
                  onClick={() => setChairFilter('queue')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    chairFilter === 'queue'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  In Chair & Queue ({myQueue.length})
                </button>
                <button
                  onClick={() => setChairFilter('completed')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                    chairFilter === 'completed'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-emerald-700 hover:text-emerald-900'
                  }`}
                >
                  Completed ({completedList.length})
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {filteredChairList.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No appointments match the selected filter.
                </div>
              ) : (
                filteredChairList.map((app) => {
                  const isCompleted = app.status === 'COMPLETED';
                  const isInService = app.status === 'IN_SERVICE';
                  const custName = app.customerName || app.clientName;
                  const svcName = app.serviceName;
                  const price = Number(app.amount ?? app.totalPrice) || 1500;
                  const cut = isCompleted ? (app.cut ?? Math.round(price * 0.2)) : Math.round(price * 0.2);
                  const totalWithTax = app.totalWithTax || Math.round(price * 1.18);

                  return (
                    <div
                      key={app._id || app.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                        isCompleted
                          ? 'bg-gradient-to-r from-emerald-50/70 via-emerald-50/40 to-white border-emerald-300 shadow-xs'
                          : isInService
                          ? 'bg-brand-500/10 border-brand-300 shadow-sm'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-12 h-12 rounded-2xl border flex flex-col items-center justify-center font-bold shadow-sm shrink-0 ${
                              isCompleted
                                ? 'bg-emerald-500 text-white border-emerald-600'
                                : 'bg-white border-slate-200 text-brand-600'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-6 h-6" />
                            ) : (
                              <>
                                <span className="text-xs">{app.startTime}</span>
                                <span className="text-[10px] text-slate-400">
                                  {app.durationMinutes || 45}m
                                </span>
                              </>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-extrabold text-base text-slate-900">{custName}</span>
                              <span
                                className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase flex items-center gap-1 ${
                                  isCompleted
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : isInService
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse'
                                    : 'bg-slate-200 text-slate-700'
                                }`}
                              >
                                {isCompleted ? (
                                  <>
                                    <Check className="w-3 h-3" /> COMPLETED & BILLED
                                  </>
                                ) : (
                                  app.status.replace('_', ' ')
                                )}
                              </span>
                              {app.startTime && (
                                <span className="text-[10px] text-slate-600 bg-white/90 px-2 py-0.5 rounded-md border border-slate-200 font-semibold flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-slate-400" /> Slot: {app.startTime}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-brand-600 font-semibold mt-0.5">{svcName}</div>
                            {isCompleted ? (
                              <div className="text-[11px] text-emerald-700 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 mt-2 flex items-center gap-1.5 font-medium">
                                <Receipt className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>{app.receiptNote || 'Payment collected at POS • Commission cut credited to your earnings'}</span>
                              </div>
                            ) : app.notes ? (
                              <div className="text-[11px] text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200 mt-2">
                                📝 {app.notes}
                              </div>
                            ) : null}
                          </div>
                        </div>

                        <div className="text-right sm:self-center">
                          <div className="text-base font-black text-slate-900">
                            ₹{price.toLocaleString('en-IN')}
                            {isCompleted && totalWithTax && totalWithTax !== price && (
                              <span className="block text-[10px] text-emerald-700 font-bold">
                                (₹{totalWithTax.toLocaleString('en-IN')} incl. GST)
                              </span>
                            )}
                          </div>
                          <div
                            className={`text-xs font-bold mt-0.5 ${
                              isCompleted ? 'text-emerald-700' : 'text-emerald-600'
                            }`}
                          >
                            {isCompleted ? (
                              <span className="flex items-center gap-1 justify-end">
                                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Cut earned: ₹{cut} (PAID ✓)
                              </span>
                            ) : (
                              `Your cut: ₹${cut}`
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Chair Quick Actions & Color Mixer */}
          <div className="space-y-6">
            <div className="glass-card p-6 border-slate-200 bg-white shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-purple-600" /> Active Client Color Formula
              </h3>
              <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-purple-900">Rhea Kapoor</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-semibold border border-purple-200">
                    Dia Light
                  </span>
                </div>
                <div className="text-xs text-slate-800 font-mono bg-white p-2.5 rounded-lg border border-purple-100">
                  8.34 (30g) + 9.02 (15g) + Clear (10g)
                </div>
                <div className="text-[11px] text-slate-600">
                  Developer: <span className="text-slate-900 font-semibold">6 Vol (1.8%)</span> • Ratio:{' '}
                  <span className="text-slate-900 font-semibold">1:1.5</span>
                </div>
                <div className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded border border-amber-200">
                  ⚠️ High porous ends. Keep under 20 mins.
                </div>
              </div>
            </div>

            <div className="glass-card p-6 border-slate-200 bg-white shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Station Protocols</h3>
              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex items-center gap-2 text-emerald-600 font-medium">
                  <CheckCircle2 className="w-4 h-4" /> Sanitize tools between clients
                </div>
                <div className="flex items-center gap-2 text-emerald-600 font-medium">
                  <CheckCircle2 className="w-4 h-4" /> Log color dispensary weight
                </div>
                <div className="flex items-center gap-2 text-emerald-600 font-medium">
                  <CheckCircle2 className="w-4 h-4" /> Record patch test for new formulas
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'formulas' && (
        <div className="glass-card p-6 border-slate-200 bg-white shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-brand-600" /> Saved Client Formulations & Dispensary Log
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myFormulas.map((f, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900">{f.clientName}</h4>
                  <span className="text-[10px] text-slate-500">{f.date}</span>
                </div>
                <div className="text-xs text-brand-600 font-semibold">{f.service}</div>
                <div className="text-xs font-mono bg-white p-2.5 rounded-lg border border-slate-200 text-slate-800">
                  {f.mix}
                </div>
                <div className="text-xs text-slate-600">
                  Brand: <span className="text-slate-900 font-medium">{f.brand}</span> | {f.developer}
                </div>
                <div className="text-[11px] text-slate-500 italic">"{f.notes}"</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'earnings' && (
        <div className="glass-card p-6 border-slate-200 bg-white shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" /> Monthly Commission & Payout Breakdown
            </h3>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full border border-emerald-200 w-fit">
              Live Settled Earnings
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500">Service Revenue Delivered</div>
              <div className="text-xl font-bold text-slate-900 mt-1">
                ₹{(98400 + completedRevenue).toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-emerald-600 font-medium">
                Base Commission: ₹{(19680 + Math.round(completedRevenue * 0.2)).toLocaleString('en-IN')} (20%)
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500">Retail Products Upsold</div>
              <div className="text-xl font-bold text-slate-900 mt-1">₹14,500</div>
              <div className="text-[10px] text-emerald-600 font-medium">Retail Commission: ₹1,450 (10%)</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500">Client Tips Collected</div>
              <div className="text-xl font-bold text-emerald-600 mt-1">₹3,200</div>
              <div className="text-[10px] text-slate-400">Direct 100% Payout</div>
            </div>
          </div>

          {/* Real-time Completed Services & Commission Payout Ledger */}
          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-brand-600" /> Today's Completed Services & Commission Ledger
            </h4>
            {completedList.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-400">
                No services completed yet today. As soon as you complete a client in chair and payment is collected at POS, your commission credit will reflect here in real-time.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                      <th className="p-3">Client</th>
                      <th className="p-3">Service / Item</th>
                      <th className="p-3">Amount Collected</th>
                      <th className="p-3">Commission Rate</th>
                      <th className="p-3 text-emerald-700 font-extrabold">Your Cut</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                      {completedList.map((item, idx) => (
                        <tr key={idx} className="hover:bg-amber-50/30 transition-colors">
                          <td className="p-3 font-bold text-slate-900">
                            <div>{item.clientName}</div>
                            {item.startTime && (
                              <span className="text-[10px] text-slate-400 font-normal">
                                Slot: {item.startTime}
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-slate-600 font-medium">{item.serviceName}</td>
                        <td className="p-3 font-bold text-slate-900">
                          ₹{item.amount.toLocaleString('en-IN')}
                          {item.totalWithTax && item.totalWithTax !== item.amount && (
                            <span className="block text-[10px] text-slate-400 font-normal">
                              (₹{item.totalWithTax.toLocaleString('en-IN')} incl. GST)
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-slate-500">20% Tier</td>
                        <td className="p-3 font-extrabold text-emerald-600 text-sm">
                          ₹{item.cut.toLocaleString('en-IN')}
                        </td>
                        <td className="p-3">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3" /> PAID & COLLECTED
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
