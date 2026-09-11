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
  DollarSign,
  TrendingUp,
  Award,
  Users,
  Percent,
  Calculator,
  FileSpreadsheet,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Download,
  Plus,
  RefreshCw,
  Search as SearchIcon,
  SlidersHorizontal,
  Scissors,
  ShoppingBag,
  UserCheck,
  Star,
  ShieldCheck,
  Zap,
  RotateCcw,
  Check,
  Calendar,
  Building2,
} from 'lucide-react';
import { formatCurrency } from '@hive/utilities';
import type {
  CommissionPlanDetail,
  CreateCommissionPlanDto,
  CommissionLedgerRecord,
  CommissionLedgerFilter,
  ManualLedgerAdjustmentPayload,
  StaffPerformanceTargetDetail,
  UpdateStaffTargetDto,
  PayrollPeriodDetail,
  PayrollStaffLineDetail,
  CreatePayrollPeriodDto,
  PayrollAdjustmentDto,
  PayrollExportData,
  CommissionSimulationRequest,
  CommissionSimulationResult,
  StaffCommissionOverview,
  ManagerCommissionAnalytics,
  CommissionPlanType,
  CommissionLedgerStatus,
} from '@hive/types';

// Mock Branch Options
const branchOptions = [
  { value: 'ALL', label: '🏢 All Branches (Enterprise View)' },
  { value: 'br-jubilee', label: '📍 Jubilee Hills Flagship (HYD)' },
  { value: 'br-banjara', label: '📍 Banjara Hills Spa & Lounge (HYD)' },
  { value: 'br-hitech', label: '📍 Hitech City Express (HYD)' },
  { value: 'br-indiranagar', label: '📍 Indiranagar Sanctuary (BLR)' },
];

const planTypeBadges: Record<CommissionPlanType, { label: string; variant: 'default' | 'success' | 'warning' | 'secondary' }> = {
  TIERED: { label: 'Progressive Tier Slabs', variant: 'default' },
  PERCENTAGE: { label: 'Flat Percentage', variant: 'success' },
  FIXED: { label: 'Fixed Service Fee', variant: 'warning' },
  TARGET_ACCELERATOR: { label: 'Target Accelerator', variant: 'secondary' },
};

const ledgerStatusBadges: Record<CommissionLedgerStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'destructive' | 'secondary' }> = {
  EARNED: { label: 'Earned & Verified', variant: 'success' },
  PENDING_PAYOUT: { label: 'Pending Payout', variant: 'warning' },
  PAID: { label: 'Paid in Payroll', variant: 'default' },
  REVERSED: { label: 'Refund Clawback', variant: 'destructive' },
  ADJUSTED: { label: 'Manual Adjustment', variant: 'secondary' },
};

export default function CommissionsPage() {
  const toast = useToast();

  // Mode Switcher: 'STYLIST' (Stylist Self-Service Performance Hub) vs 'MANAGER' (Manager & Payroll Administration Center)
  const [viewMode, setViewMode] = React.useState<'STYLIST' | 'MANAGER'>('STYLIST');

  // Active Global Filters
  const [selectedBranch, setSelectedBranch] = React.useState<string>('ALL');
  const [managerTab, setManagerTab] = React.useState<string>('plans');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [selectedPeriodMonth, setSelectedPeriodMonth] = React.useState<string>('2026-09');

  // Currently logged-in stylist persona in Stylist Mode (default: Priya Sharma)
  const [activeStylistId, setActiveStylistId] = React.useState<string>('st-1');

  // Data States
  const [plans, setPlans] = React.useState<CommissionPlanDetail[]>([]);
  const [ledger, setLedger] = React.useState<CommissionLedgerRecord[]>([]);
  const [targets, setTargets] = React.useState<StaffPerformanceTargetDetail[]>([]);
  const [payrollPeriods, setPayrollPeriods] = React.useState<PayrollPeriodDetail[]>([]);
  const [stylistOverview, setStylistOverview] = React.useState<StaffCommissionOverview | null>(null);
  const [managerAnalytics, setManagerAnalytics] = React.useState<ManagerCommissionAnalytics | null>(null);

  // Modals
  const [isPlanModalOpen, setIsPlanModalOpen] = React.useState<boolean>(false);
  const [isManualAdjModalOpen, setIsManualAdjModalOpen] = React.useState<boolean>(false);
  const [isEditTargetModalOpen, setIsEditTargetModalOpen] = React.useState<boolean>(false);
  const [selectedTargetForEdit, setSelectedTargetForEdit] = React.useState<StaffPerformanceTargetDetail | null>(null);
  const [isGeneratePayrollModalOpen, setIsGeneratePayrollModalOpen] = React.useState<boolean>(false);
  const [isPayrollAdjModalOpen, setIsPayrollAdjModalOpen] = React.useState<boolean>(false);
  const [selectedPayrollLineForAdj, setSelectedPayrollLineForAdj] = React.useState<PayrollStaffLineDetail | null>(null);
  const [payrollExportModalData, setPayrollExportModalData] = React.useState<PayrollExportData | null>(null);

  // Form States
  const [planForm, setPlanForm] = React.useState<CreateCommissionPlanDto>({
    name: '',
    code: '',
    description: '',
    planType: 'TIERED',
    serviceCommissionRate: 10,
    retailCommissionRate: 5,
    fixedServiceFee: 0,
    targetBonusRate: 2,
    branchId: 'br-jubilee',
    tierSlabs: [
      { slabOrder: 1, minRevenue: 0, maxRevenue: 50000, commissionPercentage: 5, bonusFixedAmount: 0 },
      { slabOrder: 2, minRevenue: 50001, maxRevenue: 100000, commissionPercentage: 7, bonusFixedAmount: 0 },
      { slabOrder: 3, minRevenue: 100001, maxRevenue: null, commissionPercentage: 10, bonusFixedAmount: 2500 },
    ],
  });

  const [manualAdjForm, setManualAdjForm] = React.useState({
    staffId: 'st-1',
    branchId: 'br-jubilee',
    amount: 1000,
    reason: 'Special festival volume styling bonus',
  });

  const [editTargetForm, setEditTargetForm] = React.useState({
    revenueTarget: 200000,
    servicesTarget: 75,
    retailTarget: 35000,
    membershipTarget: 10,
    newCustomersTarget: 25,
    rebookingTargetPercentage: 65,
    ratingTarget: 4.8,
  });

  const [generatePayrollForm, setGeneratePayrollForm] = React.useState({
    branchId: 'br-jubilee',
    periodMonth: '2026-09',
    notes: 'September 2026 payroll calculation',
  });

  const [payrollAdjForm, setPayrollAdjForm] = React.useState({
    adjustmentAmount: -500,
    reason: 'Advance payment adjustment',
  });

  // Simulation Sandbox State
  const [simRequest, setSimRequest] = React.useState<CommissionSimulationRequest>({
    branchId: 'br-jubilee',
    currentMonthRevenue: 68000,
    lineItems: [
      { itemType: 'SERVICE', name: 'Balayage & Hair Glaze', price: 6800, staffId: 'st-1', staffName: 'Priya Sharma' },
      { itemType: 'SERVICE', name: 'Hydra Facial & Skin Glow', price: 3500, staffId: 'st-4', staffName: 'Ananya Roy' },
      { itemType: 'RETAIL', name: 'Olaplex No. 7 Bonding Oil', price: 2400, staffId: 'st-1', staffName: 'Priya Sharma' },
      { itemType: 'SERVICE', name: 'Signature Precision Haircut', price: 1800, staffId: 'st-2', staffName: 'Rahul Verma' },
    ],
    isRefundSimulation: false,
    refundPercentage: 100,
  });
  const [simResult, setSimResult] = React.useState<CommissionSimulationResult | null>(null);

  // Fetch Data on Load
  const fetchAllData = React.useCallback(async () => {
    try {
      const branchParam = selectedBranch !== 'ALL' ? `?branchId=${selectedBranch}` : '';

      // 1. Commission Plans
      const plansRes = await fetch('/api/v1/commissions/plans');
      if (plansRes.ok) {
        const json = await plansRes.json();
        setPlans(json.data || []);
      }

      // 2. Commission Ledger
      const ledgerRes = await fetch(`/api/v1/commissions/ledger${branchParam}`);
      if (ledgerRes.ok) {
        const json = await ledgerRes.json();
        setLedger(json.data || []);
      }

      // 3. 7-Dimensional Staff Targets
      const targetsRes = await fetch(`/api/v1/commissions/targets${branchParam}&periodMonth=${selectedPeriodMonth}`);
      if (targetsRes.ok) {
        const json = await targetsRes.json();
        setTargets(json.data || []);
      }

      // 4. Stylist Personal Overview
      const stylistRes = await fetch(
        `/api/v1/commissions/overview?staffId=${activeStylistId}&periodMonth=${selectedPeriodMonth}`
      );
      if (stylistRes.ok) {
        const json = await stylistRes.json();
        setStylistOverview(json.data || null);
      }

      // 5. Manager Analytics
      const analyticsRes = await fetch(
        `/api/v1/commissions/analytics${branchParam}&periodMonth=${selectedPeriodMonth}`
      );
      if (analyticsRes.ok) {
        const json = await analyticsRes.json();
        setManagerAnalytics(json.data || null);
      }

      // 6. Payroll Periods
      const payrollRes = await fetch(`/api/v1/commissions/payroll${branchParam}`);
      if (payrollRes.ok) {
        const json = await payrollRes.json();
        setPayrollPeriods(json.data || []);
      }
    } catch (err) {
      console.error('Failed to load commission data:', err);
    }
  }, [selectedBranch, selectedPeriodMonth, activeStylistId]);

  React.useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Run Simulation automatically on Sandbox state change
  const runSimulation = React.useCallback(async () => {
    try {
      const res = await fetch('/api/v1/commissions/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(simRequest),
      });
      if (res.ok) {
        const json = await res.json();
        setSimResult(json.data || null);
      }
    } catch (err) {
      console.error('Simulation error:', err);
    }
  }, [simRequest]);

  React.useEffect(() => {
    runSimulation();
  }, [runSimulation]);

  // Submit Create Plan
  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/commissions/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...planForm,
          serviceCommissionRate: Number(planForm.serviceCommissionRate),
          retailCommissionRate: Number(planForm.retailCommissionRate),
          fixedServiceFee: Number(planForm.fixedServiceFee),
          targetBonusRate: Number(planForm.targetBonusRate),
        }),
      });

      const json = await res.json();
      if (res.ok) {
        toast.success(
          'Commission Plan Created',
          `Plan "${json.data.name}" (${json.data.code}) is now active.`
        );
        setIsPlanModalOpen(false);
        fetchAllData();
      } else {
        toast.error('Plan Creation Failed', json.message || 'Could not save commission plan.');
      }
    } catch (err) {
      toast.error('Network Error', 'Failed to create plan.');
    }
  };

  // Submit Manual Ledger Adjustment
  const handleManualAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/commissions/ledger/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...manualAdjForm,
          amount: Number(manualAdjForm.amount),
        }),
      });

      const json = await res.json();
      if (res.ok) {
        toast.success('Adjustment Recorded', 'Manual commission entry posted to double-entry ledger.');
        setIsManualAdjModalOpen(false);
        fetchAllData();
      } else {
        toast.error('Adjustment Failed', json.message || 'Could not record adjustment.');
      }
    } catch (err) {
      toast.error('Error', 'Failed to post adjustment.');
    }
  };

  // Submit Update Target
  const handleUpdateTarget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTargetForEdit) return;
    try {
      const res = await fetch(`/api/v1/commissions/targets/${selectedTargetForEdit.staffId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staffId: selectedTargetForEdit.staffId,
          branchId: selectedTargetForEdit.branchId,
          periodMonth: selectedTargetForEdit.periodMonth,
          revenueTarget: Number(editTargetForm.revenueTarget),
          servicesTarget: Number(editTargetForm.servicesTarget),
          retailTarget: Number(editTargetForm.retailTarget),
          membershipTarget: Number(editTargetForm.membershipTarget),
          newCustomersTarget: Number(editTargetForm.newCustomersTarget),
          rebookingTargetPercentage: Number(editTargetForm.rebookingTargetPercentage),
          ratingTarget: Number(editTargetForm.ratingTarget),
        }),
      });

      const json = await res.json();
      if (res.ok) {
        toast.success(
          'Goals Updated',
          `7-dimensional targets updated for ${selectedTargetForEdit.staffName}.`
        );
        setIsEditTargetModalOpen(false);
        setSelectedTargetForEdit(null);
        fetchAllData();
      } else {
        toast.error('Target Update Failed', json.message || 'Could not update goals.');
      }
    } catch (err) {
      toast.error('Error', 'Failed to update target goals.');
    }
  };

  // Generate Monthly Payroll
  const handleGeneratePayroll = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/commissions/payroll/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generatePayrollForm),
      });

      const json = await res.json();
      if (res.ok) {
        toast.success(
          'Payroll Draft Compiled',
          `Reconciled gross commissions, base salaries, and TDS deductions for ${json.data.periodMonth}.`
        );
        setIsGeneratePayrollModalOpen(false);
        fetchAllData();
      } else {
        toast.error('Payroll Error', json.message || 'Failed to generate payroll.');
      }
    } catch (err) {
      toast.error('Error', 'Could not generate payroll period.');
    }
  };

  // Apply Adjustment to Payroll Line
  const handlePayrollAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayrollLineForAdj) return;
    try {
      const res = await fetch('/api/v1/commissions/payroll/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payrollStaffLineId: selectedPayrollLineForAdj.id,
          adjustmentAmount: Number(payrollAdjForm.adjustmentAmount),
          reason: payrollAdjForm.reason,
        }),
      });

      const json = await res.json();
      if (res.ok) {
        toast.success('Payroll Adjusted', `Line adjusted for ${selectedPayrollLineForAdj.staffName}.`);
        setIsPayrollAdjModalOpen(false);
        setSelectedPayrollLineForAdj(null);
        fetchAllData();
      } else {
        toast.error('Adjustment Failed', json.message || 'Could not apply adjustment.');
      }
    } catch (err) {
      toast.error('Error', 'Failed to adjust payroll line.');
    }
  };

  // Approve Payroll Period
  const handleApprovePayroll = async (periodId: string) => {
    try {
      const res = await fetch(`/api/v1/commissions/payroll/${periodId}/approve`, {
        method: 'PATCH',
      });
      const json = await res.json();
      if (res.ok) {
        toast.success('Payroll Approved', 'Payroll period approved for banking wire disbursement.');
        fetchAllData();
      } else {
        toast.error('Approval Error', json.message || 'Could not approve payroll.');
      }
    } catch (err) {
      toast.error('Network Error', 'Failed to approve payroll.');
    }
  };

  // Export Payroll CSV / JSON
  const handleExportPayroll = async (periodId: string) => {
    try {
      const res = await fetch(`/api/v1/commissions/payroll/${periodId}/export`);
      const json = await res.json();
      if (res.ok) {
        setPayrollExportModalData(json.data);
        toast.success('Export Ready', 'Payroll CSV generated.');
      }
    } catch (err) {
      toast.error('Export Error', 'Failed to fetch export payload.');
    }
  };

  // Filtered Commission Ledger
  const filteredLedger = React.useMemo(() => {
    return ledger.filter((l) => {
      const q = searchQuery.toLowerCase();
      return (
        l.staffName.toLowerCase().includes(q) ||
        l.staffCode.toLowerCase().includes(q) ||
        l.invoiceNumber.toLowerCase().includes(q) ||
        l.lineItemName.toLowerCase().includes(q)
      );
    });
  }, [ledger, searchQuery]);

  return (
    <div className="space-y-6 pb-12">
      {/* 1. TOP HEADER & PERSONA / MODE SWITCHER */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Phase 10 Commission &amp; Payroll Engine
              </span>
              <span className="text-xs text-slate-400">
                Tiered Progressive Slabs • Multi-Stylist Attribution • 7-Target Matrix • Refund Clawbacks
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-amber-400" />
              Commission Engine, Targets &amp; Payroll
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Transparent, real-time commission calculation across service and retail streams. Double-entry immutable ledger attribution, 7-dimensional staff targets, and 1-click payroll-ready gross-to-net reconciliation.
            </p>
          </div>

          {/* Mode Switcher Pill */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-slate-950/80 p-2 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => setViewMode('STYLIST')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-all ${
                  viewMode === 'STYLIST'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Scissors className="w-4 h-4" />
                Stylist Performance Hub
              </button>
              <button
                type="button"
                onClick={() => setViewMode('MANAGER')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-all ${
                  viewMode === 'MANAGER'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Manager &amp; Payroll Admin
              </button>
            </div>

            {/* In Stylist Mode: Persona Switcher */}
            {viewMode === 'STYLIST' && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 hidden sm:inline">Active Stylist:</span>
                <select
                  value={activeStylistId}
                  onChange={(e) => setActiveStylistId(e.target.value)}
                  className="text-xs bg-slate-900 border border-amber-500/40 text-amber-300 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="st-1">Priya Sharma (Master Stylist)</option>
                  <option value="st-2">Rahul Verma (Hair Director)</option>
                  <option value="st-3">Sneha Patel (Spa Therapist)</option>
                  <option value="st-4">Ananya Roy (Senior Beautician)</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: STYLIST SELF-SERVICE PERFORMANCE HUB                              */}
      {/* ========================================================================= */}
      {viewMode === 'STYLIST' && stylistOverview && (
        <div className="space-y-6">
          {/* 1.1 TIER PROGRESSION HERO & PAYOUT TICKER */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Dynamic Tier Slab Visualizer */}
            <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl font-bold text-amber-400">
                      {stylistOverview.staffName.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        {stylistOverview.staffName}
                        <Badge variant="default">
                          {stylistOverview.activePlan.currentTier}
                        </Badge>
                      </h2>
                      <p className="text-xs text-slate-400">
                        Employee ID: <span className="font-mono text-amber-300">{stylistOverview.staffCode}</span> • Plan: {stylistOverview.activePlan.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span className="text-slate-400">Current Rate:</span>
                    <strong className="text-emerald-400 text-sm">{stylistOverview.activePlan.currentRate}% on Net Services</strong>
                  </div>
                </div>

                {/* Slabs Progression Gauge */}
                <div className="my-6">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-amber-400" />
                      Monthly Tier Progression Slab Matrix
                    </span>
                    <span className="text-amber-400 font-bold">
                      {formatCurrency(stylistOverview.totalRevenueGenerated)} Month-to-Date Revenue
                    </span>
                  </div>

                  {/* 3-Tier Visual Segments */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                    <div className="p-2.5 rounded-lg border bg-emerald-500/10 border-emerald-500/30 text-center">
                      <div className="text-[11px] text-slate-400">Tier 1: ₹0 – ₹50k</div>
                      <div className="text-base font-bold text-emerald-400">5.0%</div>
                      <div className="text-[10px] text-emerald-500 font-semibold">✓ Completed</div>
                    </div>

                    <div className="p-2.5 rounded-lg border bg-amber-500/15 border-amber-500/40 text-center relative overflow-hidden">
                      <div className="text-[11px] text-slate-400">Tier 2: ₹50k – ₹100k</div>
                      <div className="text-base font-bold text-amber-300">7.0%</div>
                      <div className="text-[10px] text-amber-400 font-semibold">✓ Active Tier</div>
                    </div>

                    <div className="p-2.5 rounded-lg border bg-slate-900 border-slate-800 text-center opacity-80">
                      <div className="text-[11px] text-slate-400">Tier 3: ₹100k+</div>
                      <div className="text-base font-bold text-purple-400">10.0%</div>
                      <div className="text-[10px] text-purple-400 font-semibold">+ ₹2,500 Milestone</div>
                    </div>
                  </div>

                  {/* Next Tier Remaining Banner */}
                  {stylistOverview.activePlan.nextTierName && (
                    <div className="mt-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-400">
                        🚀 Next Tier Milestone:{' '}
                        <strong className="text-purple-400">{stylistOverview.activePlan.nextTierName}</strong>
                      </span>
                      <span className="font-bold text-amber-400">
                        {formatCurrency(stylistOverview.activePlan.distanceToNextTier || 0)} more revenue needed
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Quick Commission Ticker */}
              <div className="border-t border-slate-800 pt-4 grid grid-cols-3 gap-3 text-center">
                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[11px] text-slate-400">Service Comm</div>
                  <div className="text-base font-bold text-emerald-400">
                    {formatCurrency(stylistOverview.earnedServiceCommission)}
                  </div>
                </div>
                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[11px] text-slate-400">Retail Comm (5%)</div>
                  <div className="text-base font-bold text-blue-400">
                    {formatCurrency(stylistOverview.earnedRetailCommission)}
                  </div>
                </div>
                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[11px] text-slate-400">Accelerator Bonus</div>
                  <div className="text-base font-bold text-purple-400">
                    {formatCurrency(stylistOverview.acceleratorBonusEarned)}
                  </div>
                </div>
              </div>
            </div>

            {/* Total Accrued Payout Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    Month-to-Date Accrued Payout
                  </h3>
                  <Badge variant="success">
                    Active Cycle
                  </Badge>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/20 text-center my-4">
                  <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Total Estimated Payout</div>
                  <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-emerald-400 to-amber-300">
                    {formatCurrency(stylistOverview.totalCommissionMonthToDate)}
                  </div>
                  <div className="text-[11px] text-emerald-400/90 mt-1 font-medium">
                    ✓ Calculated with line-item attribution &amp; zero duplicates
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Target Month:</span>
                    <strong className="text-white">September 2026</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Overall Target Met:</span>
                    <Badge variant={stylistOverview.targetSummary.isTargetMet ? 'success' : 'default'}>
                      {stylistOverview.targetSummary.overallAchievementPercentage}% Achieved
                    </Badge>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Payroll Disbursement:</span>
                    <span className="text-slate-300 font-mono">1st Oct 2026</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-center">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() =>
                    toast.info('Ledger Stream', 'Inspecting verified line-item entries.')
                  }
                >
                  View Full Double-Entry Ledger
                </Button>
              </div>
            </div>
          </div>

          {/* 1.2 7-DIMENSIONAL TARGET PERFORMANCE MATRIX */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  7-Dimensional Staff Performance Targets (September 2026)
                </h3>
                <p className="text-xs text-slate-400">
                  Multi-metric goals driving salon excellence, service volume, client retention, and CSAT ratings
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={stylistOverview.targetSummary.overallAchievementPercentage >= 100 ? 'success' : 'default'}>
                  Overall Score: {stylistOverview.targetSummary.overallAchievementPercentage}%
                </Badge>
              </div>
            </div>

            {/* 7 Target KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 1. Total Revenue */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>1. Total Revenue</span>
                  <DollarSign className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-lg font-bold text-white">
                  {formatCurrency(stylistOverview.targetSummary.revenueActual)}
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden my-2">
                  <div
                    className="bg-amber-400 h-full rounded-full"
                    style={{ width: `${Math.min(100, stylistOverview.targetSummary.revenueAchievementPercentage)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>{stylistOverview.targetSummary.revenueAchievementPercentage}% Met</span>
                  <span>Target: {formatCurrency(stylistOverview.targetSummary.revenueTarget)}</span>
                </div>
              </div>

              {/* 2. Services Volume */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>2. Services Count</span>
                  <Scissors className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-lg font-bold text-white">
                  {stylistOverview.targetSummary.servicesActual} Services
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden my-2">
                  <div
                    className="bg-blue-400 h-full rounded-full"
                    style={{ width: `${Math.min(100, stylistOverview.targetSummary.servicesAchievementPercentage)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>{stylistOverview.targetSummary.servicesAchievementPercentage}% Met</span>
                  <span>Target: {stylistOverview.targetSummary.servicesTarget}</span>
                </div>
              </div>

              {/* 3. Retail Sales */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>3. Retail Product Sales</span>
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-lg font-bold text-white">
                  {formatCurrency(stylistOverview.targetSummary.retailActual)}
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden my-2">
                  <div
                    className="bg-emerald-400 h-full rounded-full"
                    style={{ width: `${Math.min(100, stylistOverview.targetSummary.retailAchievementPercentage)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>{stylistOverview.targetSummary.retailAchievementPercentage}% Met</span>
                  <span>Target: {formatCurrency(stylistOverview.targetSummary.retailTarget)}</span>
                </div>
              </div>

              {/* 4. Memberships Sold */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>4. Memberships Sold</span>
                  <Award className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-lg font-bold text-white">
                  {stylistOverview.targetSummary.membershipActual} Memberships
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden my-2">
                  <div
                    className="bg-purple-400 h-full rounded-full"
                    style={{ width: `${Math.min(100, stylistOverview.targetSummary.membershipAchievementPercentage)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>{stylistOverview.targetSummary.membershipAchievementPercentage}% Met</span>
                  <span>Target: {stylistOverview.targetSummary.membershipTarget}</span>
                </div>
              </div>

              {/* 5. New Customers Acquired */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>5. First-Time Clients</span>
                  <Users className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-lg font-bold text-white">
                  {stylistOverview.targetSummary.newCustomersActual} Clients
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden my-2">
                  <div
                    className="bg-amber-400 h-full rounded-full"
                    style={{ width: `${Math.min(100, stylistOverview.targetSummary.newCustomersAchievementPercentage)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>{stylistOverview.targetSummary.newCustomersAchievementPercentage}% Met</span>
                  <span>Target: {stylistOverview.targetSummary.newCustomersTarget}</span>
                </div>
              </div>

              {/* 6. Rebooking Rate */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>6. Client Rebooking %</span>
                  <RotateCcw className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-lg font-bold text-emerald-400">
                  {stylistOverview.targetSummary.rebookingActualPercentage}%
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden my-2">
                  <div
                    className="bg-emerald-400 h-full rounded-full"
                    style={{ width: `${Math.min(100, stylistOverview.targetSummary.rebookingAchievementPercentage)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span className="text-emerald-400 font-bold">✓ Target Exceeded</span>
                  <span>Target: {stylistOverview.targetSummary.rebookingTargetPercentage}%</span>
                </div>
              </div>

              {/* 7. CSAT Client Rating */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 sm:col-span-2 lg:col-span-2 flex items-center justify-between p-5">
                <div>
                  <div className="text-xs text-slate-400 mb-1">7. Client Satisfaction CSAT Rating</div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-amber-400">
                      {stylistOverview.targetSummary.ratingActual.toFixed(2)}
                    </span>
                    <div className="flex text-amber-400 text-sm">
                      {'★'.repeat(5)}
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Target: {stylistOverview.targetSummary.ratingTarget.toFixed(2)}★ • Based on 48 verified customer post-service reviews
                  </div>
                </div>
                <Badge variant="success">
                  Top Rated Stylist
                </Badge>
              </div>
            </div>
          </div>

          {/* 1.3 RECENT DOUBLE-ENTRY COMMISSION LEDGER STREAM */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                  My Commission Ledger Stream
                </h3>
                <p className="text-xs text-slate-400">
                  Immutable records linked directly to invoice line items and refund adjustments
                </p>
              </div>
              <Badge variant="default">
                Double-Entry Verified
              </Badge>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-800 text-slate-400">
                    <th className="p-3 font-semibold">Date &amp; Time</th>
                    <th className="p-3 font-semibold">Invoice Ref</th>
                    <th className="p-3 font-semibold">Line Item</th>
                    <th className="p-3 font-semibold">Stream</th>
                    <th className="p-3 font-semibold">Sale Value</th>
                    <th className="p-3 font-semibold">Rate %</th>
                    <th className="p-3 font-semibold text-right">Commission Earned</th>
                    <th className="p-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 bg-slate-900/50">
                  {stylistOverview.recentLedger.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 text-slate-400">
                        {new Date(rec.date).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-3 font-mono text-amber-400 font-semibold">{rec.invoiceNumber}</td>
                      <td className="p-3 font-medium text-white max-w-xs truncate">{rec.lineItemName}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          rec.lineItemType === 'SERVICE' ? 'bg-blue-500/20 text-blue-300' : 'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          {rec.lineItemType}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-slate-200">{formatCurrency(rec.saleAmount)}</td>
                      <td className="p-3 text-slate-300">{rec.commissionRate}%</td>
                      <td className={`p-3 text-right font-bold ${rec.commissionEarned < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {formatCurrency(rec.commissionEarned)}
                      </td>
                      <td className="p-3">
                        <Badge variant={ledgerStatusBadges[rec.status]?.variant || 'default'}>
                          {ledgerStatusBadges[rec.status]?.label || rec.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: MANAGER & PAYROLL ADMINISTRATION CENTER                          */}
      {/* ========================================================================= */}
      {viewMode === 'MANAGER' && (
        <div className="space-y-6">
          {/* 2.1 MANAGER OVERVIEW KPIS */}
          {managerAnalytics && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Total Revenue</span>
                  <DollarSign className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-xl font-bold text-white">
                  {formatCurrency(managerAnalytics.totalBranchRevenue)}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Month-to-date sales</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Commissions</span>
                  <Award className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xl font-bold text-emerald-400">
                  {formatCurrency(managerAnalytics.totalCommissionsPaidOrAccrued)}
                </div>
                <div className="text-[11px] text-emerald-500/80 mt-0.5">
                  {managerAnalytics.commissionToRevenuePercentage}% of gross revenue
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Ledger Entries</span>
                  <FileSpreadsheet className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-blue-400">
                  {managerAnalytics.ledgerEntriesCount}
                </div>
                <div className="text-[11px] text-blue-500/80 mt-0.5">Zero duplicates verified</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Top Stylist</span>
                  <Scissors className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-sm font-bold text-white truncate">
                  {managerAnalytics.topCommissionEarners[0]?.staffName || 'Priya Sharma'}
                </div>
                <div className="text-[11px] text-amber-400 mt-0.5">
                  {formatCurrency(managerAnalytics.topCommissionEarners[0]?.commissionEarned || 18425)}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Target Leaders</span>
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-purple-400">
                  {targets.filter((t) => t.overallAchievementPercentage >= 100).length} / {targets.length}
                </div>
                <div className="text-[11px] text-purple-500/80 mt-0.5">Achieved 100%+ goals</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Payroll Drafts</span>
                  <Clock className="w-4 h-4 text-rose-400" />
                </div>
                <div className="text-2xl font-bold text-rose-400">
                  {managerAnalytics.pendingPayrollPeriodsCount}
                </div>
                <div className="text-[11px] text-rose-500/80 mt-0.5">Ready for disbursement</div>
              </div>
            </div>
          )}

          {/* 2.2 MANAGER TABS NAVIGATION */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'plans', label: 'Commission Plans & Slabs', icon: Layers },
                  { id: 'ledger', label: 'Double-Entry Ledger', icon: FileSpreadsheet },
                  { id: 'targets', label: '7-Dimensional Targets', icon: Award },
                  { id: 'payroll', label: 'Payroll Ready Payouts', icon: DollarSign },
                  { id: 'sandbox', label: 'Simulation & Sandbox', icon: Calculator },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setManagerTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        managerTab === tab.id
                          ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  options={branchOptions}
                  className="w-56 text-xs"
                />
                {managerTab === 'plans' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setIsPlanModalOpen(true)}
                    className="flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Create Plan
                  </Button>
                )}
                {managerTab === 'ledger' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsManualAdjModalOpen(true)}
                    className="flex items-center gap-1.5"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                    Manual Adjustment
                  </Button>
                )}
                {managerTab === 'payroll' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setIsGeneratePayrollModalOpen(true)}
                    className="flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Generate Payroll
                  </Button>
                )}
              </div>
            </div>

            {/* --------------------------------------------------------------------- */}
            {/* TAB 1: COMMISSION PLANS & TIER SLABS                                  */}
            {/* --------------------------------------------------------------------- */}
            {managerTab === 'plans' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className="bg-slate-950 border border-slate-800/90 rounded-xl p-5 hover:border-amber-500/40 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div>
                            <h4 className="text-base font-bold text-white">{plan.name}</h4>
                            <p className="text-[11px] text-slate-400">
                              Code: <span className="font-mono text-amber-400">{plan.code}</span>
                            </p>
                          </div>
                          <Badge variant={planTypeBadges[plan.planType]?.variant || 'default'}>
                            {planTypeBadges[plan.planType]?.label || plan.planType}
                          </Badge>
                        </div>

                        <p className="text-xs text-slate-300 mb-4">{plan.description}</p>

                        {/* Slab Matrix if Tiered */}
                        {plan.tierSlabs.length > 0 && (
                          <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-1.5 text-xs mb-3">
                            <div className="font-semibold text-slate-300 text-[11px] mb-1">
                              Progressive Revenue Tier Slabs:
                            </div>
                            {plan.tierSlabs.map((slab) => (
                              <div key={slab.id} className="flex justify-between text-slate-300 py-0.5 border-b border-slate-800/60 last:border-0">
                                <span>
                                  Slab {slab.slabOrder}: {formatCurrency(slab.minRevenue)} –{' '}
                                  {slab.maxRevenue ? formatCurrency(slab.maxRevenue) : '∞'}
                                </span>
                                <span className="font-bold text-emerald-400">
                                  {slab.commissionPercentage}%
                                  {slab.bonusFixedAmount > 0 && ` + ${formatCurrency(slab.bonusFixedAmount)}`}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="grid grid-cols-3 gap-2 text-center text-xs bg-slate-900 p-2 rounded-lg border border-slate-800/60">
                          <div>
                            <div className="text-[10px] text-slate-400">Service Base</div>
                            <strong className="text-white">{plan.serviceCommissionRate}%</strong>
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-400">Retail Rate</div>
                            <strong className="text-blue-400">{plan.retailCommissionRate}%</strong>
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-400">Target Bonus</div>
                            <strong className="text-purple-400">+{plan.targetBonusRate}%</strong>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
                        <span>Status: <strong className="text-emerald-400">Active</strong></span>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => toast.info('Commission Rules', 'Editing plan configuration.')}
                          className="text-xs"
                        >
                          Edit Slabs
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* TAB 2: DOUBLE-ENTRY COMMISSION LEDGER                                 */}
            {/* --------------------------------------------------------------------- */}
            {managerTab === 'ledger' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="relative flex-1 max-w-md">
                    <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Search invoice number, stylist name, item..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <Badge variant="default">
                    {filteredLedger.length} Verified Records
                  </Badge>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-950 border-b border-slate-800 text-slate-400">
                        <th className="p-3 font-semibold">Date</th>
                        <th className="p-3 font-semibold">Invoice No</th>
                        <th className="p-3 font-semibold">Staff Attributed</th>
                        <th className="p-3 font-semibold">Line Item</th>
                        <th className="p-3 font-semibold">Type</th>
                        <th className="p-3 font-semibold">Sale Amount</th>
                        <th className="p-3 font-semibold">Rate</th>
                        <th className="p-3 font-semibold text-right">Commission</th>
                        <th className="p-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 bg-slate-900/50">
                      {filteredLedger.map((rec) => (
                        <tr key={rec.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-3 text-slate-400">
                            {new Date(rec.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </td>
                          <td className="p-3 font-mono text-amber-400 font-semibold">{rec.invoiceNumber}</td>
                          <td className="p-3 font-medium text-white">
                            <div>{rec.staffName}</div>
                            <div className="text-[10px] text-slate-500 font-mono">{rec.staffCode}</div>
                          </td>
                          <td className="p-3 text-slate-200 max-w-xs truncate">{rec.lineItemName}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              rec.lineItemType === 'SERVICE' ? 'bg-blue-500/20 text-blue-300' : 'bg-emerald-500/20 text-emerald-300'
                            }`}>
                              {rec.lineItemType}
                            </span>
                          </td>
                          <td className="p-3 text-slate-200">{formatCurrency(rec.saleAmount)}</td>
                          <td className="p-3 text-slate-300">{rec.commissionRate}%</td>
                          <td className={`p-3 text-right font-bold ${rec.commissionEarned < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {formatCurrency(rec.commissionEarned)}
                          </td>
                          <td className="p-3">
                            <Badge variant={ledgerStatusBadges[rec.status]?.variant || 'default'}>
                              {ledgerStatusBadges[rec.status]?.label || rec.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* TAB 3: 7-DIMENSIONAL STAFF TARGETS                                    */}
            {/* --------------------------------------------------------------------- */}
            {managerTab === 'targets' && (
              <div className="space-y-4">
                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-950 border-b border-slate-800 text-slate-400">
                        <th className="p-3 font-semibold">Staff Member</th>
                        <th className="p-3 font-semibold">Revenue (Actual/Target)</th>
                        <th className="p-3 font-semibold">Services Volume</th>
                        <th className="p-3 font-semibold">Retail Sales</th>
                        <th className="p-3 font-semibold">Memberships</th>
                        <th className="p-3 font-semibold">New Clients</th>
                        <th className="p-3 font-semibold">Rebooking %</th>
                        <th className="p-3 font-semibold">CSAT Rating</th>
                        <th className="p-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 bg-slate-900/50">
                      {targets.map((tgt) => (
                        <tr key={tgt.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-3 font-medium text-white">
                            <div>{tgt.staffName}</div>
                            <div className="text-[10px] text-slate-400">{tgt.role}</div>
                          </td>
                          <td className="p-3">
                            <div className="font-semibold text-white">
                              {formatCurrency(tgt.revenueActual)} / {formatCurrency(tgt.revenueTarget)}
                            </div>
                            <div className="text-[10px] text-amber-400">{tgt.revenueAchievementPercentage}% Met</div>
                          </td>
                          <td className="p-3 text-slate-200">
                            <div>{tgt.servicesActual} / {tgt.servicesTarget}</div>
                            <div className="text-[10px] text-blue-400">{tgt.servicesAchievementPercentage}%</div>
                          </td>
                          <td className="p-3 text-slate-200">
                            <div>{formatCurrency(tgt.retailActual)} / {formatCurrency(tgt.retailTarget)}</div>
                            <div className="text-[10px] text-emerald-400">{tgt.retailAchievementPercentage}%</div>
                          </td>
                          <td className="p-3 text-slate-200">
                            <div>{tgt.membershipActual} / {tgt.membershipTarget}</div>
                            <div className="text-[10px] text-purple-400">{tgt.membershipAchievementPercentage}%</div>
                          </td>
                          <td className="p-3 text-slate-200">
                            <div>{tgt.newCustomersActual} / {tgt.newCustomersTarget}</div>
                            <div className="text-[10px] text-amber-400">{tgt.newCustomersAchievementPercentage}%</div>
                          </td>
                          <td className="p-3">
                            <div className="font-bold text-emerald-400">{tgt.rebookingActualPercentage}%</div>
                            <div className="text-[10px] text-slate-500">Target {tgt.rebookingTargetPercentage}%</div>
                          </td>
                          <td className="p-3 text-amber-400 font-bold">
                            {tgt.ratingActual.toFixed(2)} ★
                          </td>
                          <td className="p-3 text-right">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => {
                                setSelectedTargetForEdit(tgt);
                                setEditTargetForm({
                                  revenueTarget: tgt.revenueTarget,
                                  servicesTarget: tgt.servicesTarget,
                                  retailTarget: tgt.retailTarget,
                                  membershipTarget: tgt.membershipTarget,
                                  newCustomersTarget: tgt.newCustomersTarget,
                                  rebookingTargetPercentage: tgt.rebookingTargetPercentage,
                                  ratingTarget: tgt.ratingTarget,
                                });
                                setIsEditTargetModalOpen(true);
                              }}
                              className="text-xs"
                            >
                              Edit Goals
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* TAB 4: PAYROLL READY PAYOUTS                                          */}
            {/* --------------------------------------------------------------------- */}
            {managerTab === 'payroll' && (
              <div className="space-y-6">
                {payrollPeriods.map((period) => (
                  <div
                    key={period.id}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-white">
                            Payroll Cycle: {period.periodMonth} ({period.branchName})
                          </h4>
                          <Badge
                            variant={
                              period.status === 'APPROVED' || period.status === 'EXPORTED'
                                ? 'success'
                                : 'warning'
                            }
                          >
                            {period.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{period.notes}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {period.status === 'DRAFT' && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleApprovePayroll(period.id)}
                            className="text-xs"
                          >
                            Approve Cycle
                          </Button>
                        )}
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleExportPayroll(period.id)}
                          className="flex items-center gap-1.5 text-xs"
                        >
                          <Download className="w-3.5 h-3.5 text-amber-400" />
                          Export CSV
                        </Button>
                      </div>
                    </div>

                    {/* Payroll Staff Lines Table */}
                    <div className="overflow-x-auto rounded-lg border border-slate-800">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-900 border-b border-slate-800 text-slate-400">
                            <th className="p-2.5 font-semibold">Employee</th>
                            <th className="p-2.5 font-semibold">Base Salary</th>
                            <th className="p-2.5 font-semibold">Service Comm</th>
                            <th className="p-2.5 font-semibold">Retail Comm</th>
                            <th className="p-2.5 font-semibold">Bonus Accel</th>
                            <th className="p-2.5 font-semibold">Gross Comm</th>
                            <th className="p-2.5 font-semibold">Adjustments</th>
                            <th className="p-2.5 font-semibold">TDS (1%)</th>
                            <th className="p-2.5 font-semibold text-right">Net Payable</th>
                            <th className="p-2.5 font-semibold text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 bg-slate-950">
                          {period.staffLines.map((line) => (
                            <tr key={line.id} className="hover:bg-slate-800/40">
                              <td className="p-2.5 font-medium text-white">
                                <div>{line.staffName}</div>
                                <div className="text-[10px] text-slate-500 font-mono">{line.staffCode}</div>
                              </td>
                              <td className="p-2.5 text-slate-300">{formatCurrency(line.baseSalary)}</td>
                              <td className="p-2.5 text-emerald-400">{formatCurrency(line.serviceCommissionTotal)}</td>
                              <td className="p-2.5 text-blue-400">{formatCurrency(line.retailCommissionTotal)}</td>
                              <td className="p-2.5 text-purple-400">{formatCurrency(line.bonusAcceleratorTotal)}</td>
                              <td className="p-2.5 font-bold text-white">{formatCurrency(line.grossCommission)}</td>
                              <td className={`p-2.5 ${line.adjustmentsTotal < 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                                {formatCurrency(line.adjustmentsTotal)}
                              </td>
                              <td className="p-2.5 text-slate-400">-{formatCurrency(line.tdsDeduction)}</td>
                              <td className="p-2.5 text-right font-bold text-emerald-400 text-sm">
                                {formatCurrency(line.netPayable)}
                              </td>
                              <td className="p-2.5 text-center">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedPayrollLineForAdj(line);
                                    setIsPayrollAdjModalOpen(true);
                                  }}
                                  className="text-[11px] py-1 px-2"
                                >
                                  Adjust
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex justify-between items-center text-xs text-slate-400 bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
                      <span>Total Staff Count: <strong className="text-white">{period.totalStaffCount}</strong></span>
                      <span>Total Gross Commission: <strong className="text-emerald-400">{formatCurrency(period.totalGrossCommission)}</strong></span>
                      <span>Total Net Disbursement: <strong className="text-amber-400 font-bold text-sm">{formatCurrency(period.totalNetPayable)}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* TAB 5: INTERACTIVE COMMISSION SIMULATION & SANDBOX                    */}
            {/* --------------------------------------------------------------------- */}
            {managerTab === 'sandbox' && (
              <div className="space-y-6">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Calculator className="w-4 h-4 text-amber-400" />
                      Live Commission Attribution &amp; Clawback Testing Sandbox
                    </h3>
                    <p className="text-xs text-slate-400">
                      Test multi-stylist single invoice splits, tier dynamic progression, and refund clawbacks
                    </p>
                  </div>
                  <Badge variant="success">
                    Idempotent Calculation Engine
                  </Badge>
                </div>

                {/* Simulation Setup Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Input Sandbox */}
                  <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      1. Test Scenario Inputs
                    </h4>

                    <div>
                      <label className="block text-slate-300 text-xs font-semibold mb-1">
                        Current Stylist Month Revenue Slabs (₹)
                      </label>
                      <Input
                        type="number"
                        value={simRequest.currentMonthRevenue}
                        onChange={(e) =>
                          setSimRequest({ ...simRequest, currentMonthRevenue: Number(e.target.value) })
                        }
                      />
                      <span className="text-[11px] text-slate-500">
                        Try values: ₹45,000 (Tier 1 5%), ₹75,000 (Tier 2 7%), ₹1,20,000 (Tier 3 10%)
                      </span>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <input
                        type="checkbox"
                        id="refundSim"
                        checked={simRequest.isRefundSimulation}
                        onChange={(e) =>
                          setSimRequest({ ...simRequest, isRefundSimulation: e.target.checked })
                        }
                        className="rounded bg-slate-950 border-slate-800 text-amber-500"
                      />
                      <label htmlFor="refundSim" className="text-slate-200 text-xs font-semibold cursor-pointer">
                        Simulate Refund Clawback Reversal (Negative Commission)
                      </label>
                    </div>

                    {/* Simulated Multi-Stylist Bill Line Items */}
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-slate-300">
                        Test Bill Line Items (Multi-Stylist Split):
                      </div>
                      {simRequest.lineItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs flex items-center justify-between"
                        >
                          <div>
                            <span className="font-semibold text-white">{item.name}</span>
                            <div className="text-[11px] text-slate-400">
                              Attributed: <strong className="text-amber-400">{item.staffName}</strong> • {item.itemType}
                            </div>
                          </div>
                          <div className="text-sm font-bold text-slate-200">{formatCurrency(item.price)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Real-time Calculation Result */}
                  <div className="bg-slate-950 p-5 rounded-xl border border-amber-500/30 space-y-4">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      2. Calculation Engine Breakdown
                    </h4>

                    {simResult && (
                      <div className="space-y-3">
                        <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 grid grid-cols-2 gap-3 text-xs text-center">
                          <div>
                            <div className="text-slate-400">Total Bill Value</div>
                            <div className="text-lg font-bold text-white">
                              {formatCurrency(simResult.totalSaleAmount)}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-400">Net Commission Calculated</div>
                            <div
                              className={`text-lg font-bold ${
                                simResult.totalCommissionCalculated < 0
                                  ? 'text-rose-400'
                                  : 'text-emerald-400'
                              }`}
                            >
                              {formatCurrency(simResult.totalCommissionCalculated)}
                            </div>
                          </div>
                        </div>

                        <div className="text-xs font-semibold text-slate-300">Individual Stylist Attributions:</div>

                        <div className="space-y-2">
                          {simResult.staffSplits.map((split) => (
                            <div
                              key={split.staffId}
                              className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1"
                            >
                              <div className="flex justify-between items-center">
                                <strong className="text-white text-sm">{split.staffName}</strong>
                                <span
                                  className={`font-bold ${
                                    split.totalCommission < 0 ? 'text-rose-400' : 'text-emerald-400'
                                  }`}
                                >
                                  {formatCurrency(split.totalCommission)}
                                </span>
                              </div>
                              <div className="flex justify-between text-[11px] text-slate-400">
                                <span>
                                  Service: {formatCurrency(split.serviceRevenue)} ({split.tierApplied}) →{' '}
                                  <strong className="text-slate-200">{formatCurrency(split.serviceCommission)}</strong>
                                </span>
                                {split.retailRevenue > 0 && (
                                  <span>
                                    Retail: {formatCurrency(split.retailRevenue)} (5%) →{' '}
                                    <strong className="text-blue-400">{formatCurrency(split.retailCommission)}</strong>
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-400 space-y-1">
                          <div className="flex justify-between">
                            <span>Evaluated Tier Slab:</span>
                            <strong className="text-amber-300">{simResult.tierStatus.currentTierName} ({simResult.tierStatus.currentTierRate}%)</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Idempotency Unique Key:</span>
                            <span className="font-mono text-emerald-400">PASS (Zero Duplicate Risk)</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: CREATE COMMISSION PLAN                                           */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        title="Create New Commission Plan"
        description="Configure tier slabs, service/retail rates, and milestone target bonus accelerators."
        maxWidth="2xl"
      >
        <form onSubmit={handleCreatePlan} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Plan Name *</label>
              <Input
                value={planForm.name}
                onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                placeholder="e.g. Master Stylist Progressive Tier"
                required
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Plan Code *</label>
              <Input
                value={planForm.code}
                onChange={(e) => setPlanForm({ ...planForm, code: e.target.value })}
                placeholder="ST-TIER-02"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Plan Type *</label>
            <select
              value={planForm.planType}
              onChange={(e) => setPlanForm({ ...planForm, planType: e.target.value as CommissionPlanType })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="TIERED">Progressive Tiered Slabs (₹0-50k @ 5%, ₹50-100k @ 7%, ₹100k+ @ 10%)</option>
              <option value="PERCENTAGE">Flat Percentage (e.g. 15% on Services)</option>
              <option value="FIXED">Fixed Service Fee (e.g. ₹250 per package)</option>
              <option value="TARGET_ACCELERATOR">Target Accelerator Bonus Plan</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div>
              <label className="block text-slate-400 text-[11px] font-semibold mb-1">Service Base Rate (%)</label>
              <Input
                type="number"
                value={planForm.serviceCommissionRate}
                onChange={(e) => setPlanForm({ ...planForm, serviceCommissionRate: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-slate-400 text-[11px] font-semibold mb-1">Retail Product Rate (%)</label>
              <Input
                type="number"
                value={planForm.retailCommissionRate}
                onChange={(e) => setPlanForm({ ...planForm, retailCommissionRate: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-slate-400 text-[11px] font-semibold mb-1">Target Accelerator (%)</label>
              <Input
                type="number"
                value={planForm.targetBonusRate}
                onChange={(e) => setPlanForm({ ...planForm, targetBonusRate: Number(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Plan Description</label>
            <Input
              value={planForm.description || ''}
              onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
              placeholder="e.g. Progressive tiered structure designed for high-volume stylists."
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <Button variant="secondary" type="button" onClick={() => setIsPlanModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Commission Plan
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 2: MANUAL COMMISSION ADJUSTMENT                                     */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isManualAdjModalOpen}
        onClose={() => setIsManualAdjModalOpen(false)}
        title="Manual Commission Adjustment"
        description="Post a double-entry bonus or clawback adjustment directly to the commission ledger."
      >
        <form onSubmit={handleManualAdjustment} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Staff Member *</label>
            <select
              value={manualAdjForm.staffId}
              onChange={(e) => setManualAdjForm({ ...manualAdjForm, staffId: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="st-1">Priya Sharma (EMP-HYD-001)</option>
              <option value="st-2">Rahul Verma (EMP-HYD-002)</option>
              <option value="st-3">Sneha Patel (EMP-HYD-003)</option>
              <option value="st-4">Ananya Roy (EMP-HYD-004)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Adjustment Amount (₹) *</label>
            <Input
              type="number"
              value={manualAdjForm.amount}
              onChange={(e) => setManualAdjForm({ ...manualAdjForm, amount: Number(e.target.value) })}
              placeholder="Use positive for bonus (+1000) or negative for recovery (-500)"
              required
            />
            <span className="text-[11px] text-slate-500">
              Positive amount = Credit bonus. Negative amount = Clawback deduction.
            </span>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Adjustment Reason *</label>
            <Input
              value={manualAdjForm.reason}
              onChange={(e) => setManualAdjForm({ ...manualAdjForm, reason: e.target.value })}
              placeholder="e.g. Festival volume bonus / Product return clawback"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <Button variant="secondary" type="button" onClick={() => setIsManualAdjModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Post Adjustment Entry
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 3: EDIT 7-DIMENSIONAL STAFF TARGETS                                 */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isEditTargetModalOpen}
        onClose={() => setIsEditTargetModalOpen(false)}
        title="Edit Staff 7-Dimensional Targets"
        description={`Set performance goals for ${selectedTargetForEdit?.staffName} (${selectedTargetForEdit?.periodMonth})`}
        maxWidth="2xl"
      >
        <form onSubmit={handleUpdateTarget} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">1. Monthly Revenue Target (₹)</label>
              <Input
                type="number"
                value={editTargetForm.revenueTarget}
                onChange={(e) => setEditTargetForm({ ...editTargetForm, revenueTarget: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">2. Services Volume Target</label>
              <Input
                type="number"
                value={editTargetForm.servicesTarget}
                onChange={(e) => setEditTargetForm({ ...editTargetForm, servicesTarget: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">3. Retail Sales Target (₹)</label>
              <Input
                type="number"
                value={editTargetForm.retailTarget}
                onChange={(e) => setEditTargetForm({ ...editTargetForm, retailTarget: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">4. Memberships Sold Target</label>
              <Input
                type="number"
                value={editTargetForm.membershipTarget}
                onChange={(e) => setEditTargetForm({ ...editTargetForm, membershipTarget: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">5. New Clients</label>
              <Input
                type="number"
                value={editTargetForm.newCustomersTarget}
                onChange={(e) => setEditTargetForm({ ...editTargetForm, newCustomersTarget: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">6. Rebooking Rate (%)</label>
              <Input
                type="number"
                value={editTargetForm.rebookingTargetPercentage}
                onChange={(e) => setEditTargetForm({ ...editTargetForm, rebookingTargetPercentage: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">7. CSAT Rating (★)</label>
              <Input
                type="number"
                step="0.1"
                min="1.0"
                max="5.0"
                value={editTargetForm.ratingTarget}
                onChange={(e) => setEditTargetForm({ ...editTargetForm, ratingTarget: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <Button variant="secondary" type="button" onClick={() => setIsEditTargetModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Target Matrix
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 4: GENERATE PAYROLL PERIOD                                          */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isGeneratePayrollModalOpen}
        onClose={() => setIsGeneratePayrollModalOpen(false)}
        title="Generate Monthly Payroll Draft"
        description="Compile service and retail commissions with base salaries and TDS calculations."
      >
        <form onSubmit={handleGeneratePayroll} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Branch *</label>
            <select
              value={generatePayrollForm.branchId}
              onChange={(e) => setGeneratePayrollForm({ ...generatePayrollForm, branchId: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="br-jubilee">Jubilee Hills Flagship (HYD)</option>
              <option value="br-banjara">Banjara Hills Spa &amp; Lounge (HYD)</option>
              <option value="br-hitech">Hitech City Express (HYD)</option>
              <option value="br-indiranagar">Indiranagar Sanctuary (BLR)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Period Month (YYYY-MM) *</label>
            <Input
              value={generatePayrollForm.periodMonth}
              onChange={(e) => setGeneratePayrollForm({ ...generatePayrollForm, periodMonth: e.target.value })}
              placeholder="2026-09"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Notes (Optional)</label>
            <Input
              value={generatePayrollForm.notes}
              onChange={(e) => setGeneratePayrollForm({ ...generatePayrollForm, notes: e.target.value })}
              placeholder="e.g. September 2026 verified monthly payroll"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <Button variant="secondary" type="button" onClick={() => setIsGeneratePayrollModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Compile Payroll Period
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 5: PAYROLL STAFF LINE ADJUSTMENT                                    */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isPayrollAdjModalOpen}
        onClose={() => setIsPayrollAdjModalOpen(false)}
        title="Adjust Payroll Line"
        description={`Modify payout for ${selectedPayrollLineForAdj?.staffName} (${selectedPayrollLineForAdj?.staffCode})`}
      >
        <form onSubmit={handlePayrollAdjustment} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Adjustment Amount (₹) *</label>
            <Input
              type="number"
              value={payrollAdjForm.adjustmentAmount}
              onChange={(e) => setPayrollAdjForm({ ...payrollAdjForm, adjustmentAmount: Number(e.target.value) })}
              placeholder="e.g. -500 for recovery or +1000 for bonus"
              required
            />
            <span className="text-[11px] text-slate-500">
              Negative values deduct from net payout; positive values credit bonus.
            </span>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Adjustment Reason *</label>
            <Input
              value={payrollAdjForm.reason}
              onChange={(e) => setPayrollAdjForm({ ...payrollAdjForm, reason: e.target.value })}
              placeholder="e.g. Advance salary deduction / Scissors drop repair cost"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <Button variant="secondary" type="button" onClick={() => setIsPayrollAdjModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Apply to Payroll
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 6: PAYROLL CSV EXPORT PREVIEW                                       */}
      {/* ========================================================================= */}
      {payrollExportModalData && (
        <Modal
          isOpen={!!payrollExportModalData}
          onClose={() => setPayrollExportModalData(null)}
          title="Payroll CSV Export Preview"
          description={`Export generated for ${payrollExportModalData.periodMonth} (${payrollExportModalData.branchName})`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 max-h-60 overflow-y-auto whitespace-pre">
              {payrollExportModalData.csvContent}
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-slate-400">
                {payrollExportModalData.records.length} Staff Payout Lines Ready
              </span>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setPayrollExportModalData(null)}
                >
                  Close
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    const blob = new Blob([payrollExportModalData.csvContent], { type: 'text/csv' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `HiveSalon-Payroll-${payrollExportModalData.periodMonth}.csv`;
                    a.click();
                    toast.success('Download Started', 'Payroll CSV downloaded.');
                  }}
                  className="flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download CSV File
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
