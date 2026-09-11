'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BarChart3,
  DollarSign,
  Calendar,
  Users,
  TrendingUp,
  Receipt,
  Award,
  ShoppingBag,
  Building2,
  Globe,
  MapPin,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Sparkles,
  Bot,
} from 'lucide-react';
import {
  PageHeader,
  StatCard,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  useToast,
} from '@hive/ui';
import { formatCurrency } from '@hive/utilities';

export default function BackOfficeManagementDashboardPage() {
  const router = useRouter();
  const toast = useToast();

  // Geographic Scope Filter State
  const [activeScope, setActiveScope] = React.useState('ALL_ORG');
  const [selectedTimeframe, setSelectedTimeframe] = React.useState('MONTH_TO_DATE');

  return (
    <div className="space-y-6 pb-12 font-sans select-none text-left">
      {/* 1. Header & Management Vitals */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-sky-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-md">
              BO
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Executive Management Dashboard</h1>
            <Badge variant="info" showDot>
              Organization-Wide Scope • 4 Branches
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Consolidated enterprise revenue, multi-branch benchmarking, workforce targets, and profit & loss analysis.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/back-office/reports/finance')}
            className="text-xs font-semibold"
          >
            Financial Statements
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => router.push('/back-office/ai')}
            leftIcon={<Bot className="w-4 h-4 text-purple-200" />}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white text-xs font-bold shadow-md"
          >
            Ask Hive AI
          </Button>
        </div>
      </div>

      {/* 2. Top Tier 4 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Total Revenue"
          value="₹1,84,500.00"
          changePercentage={18.4}
          changeLabel="vs last Thursday"
          icon={<DollarSign className="w-4 h-4 text-emerald-600" />}
          helpText="Consolidated receipts today across Service Chairs, POS Retail, Memberships, and E-commerce."
        />

        <StatCard
          title="Monthly MTD Revenue"
          value="₹24,80,000.00"
          changePercentage={14.2}
          changeLabel="MoM Revenue Growth"
          icon={<TrendingUp className="w-4 h-4 text-sky-600" />}
          helpText="Month-to-date total recognized revenue across all 4 salon branches."
        />

        <StatCard
          title="Total Appointments"
          value="642 Bookings"
          changePercentage={8.5}
          changeLabel="94.2% Attendance Rate"
          icon={<Calendar className="w-4 h-4 text-amber-600" />}
          helpText="Total appointments serviced this month with 3.8% cancellation rate."
        />

        <StatCard
          title="Average Ticket Size"
          value="₹3,862.00"
          changePercentage={11.0}
          changeLabel="Upselling Growth"
          icon={<Receipt className="w-4 h-4 text-purple-600" />}
          helpText="Average spend per client transaction combining salon services and retail add-ons."
        />
      </div>

      {/* 3. Second Tier: Revenue Breakdown & Financial Vitals */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">New Clients MTD</span>
          <span className="text-lg font-black text-slate-900 font-mono">148 New</span>
          <span className="text-[10px] text-emerald-600 block font-medium">+22% acquisition</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Returning Clients</span>
          <span className="text-lg font-black text-amber-600 font-mono">494 Clients</span>
          <span className="text-[10px] text-slate-500 block font-medium">76.9% retention rate</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Membership Revenue</span>
          <span className="text-lg font-black text-sky-600 font-mono">₹4,20,000</span>
          <span className="text-[10px] text-slate-500 block font-medium">28 VIP plan enrollments</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Retail Revenue</span>
          <span className="text-lg font-black text-emerald-600 font-mono">₹5,14,000</span>
          <span className="text-[10px] text-slate-500 block font-medium">20.7% of total sales</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Operating Expenses</span>
          <span className="text-lg font-black text-rose-600 font-mono">₹9,80,000</span>
          <span className="text-[10px] text-slate-500 block font-medium">Salaries, Rent & Utilities</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Outstanding Balances</span>
          <span className="text-lg font-black text-amber-600 font-mono">₹14,500</span>
          <span className="text-[10px] text-slate-500 block font-medium">Corporate tabs</span>
        </div>
      </div>

      {/* 4. Multi-Branch Organization Matrix & Benchmarking */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7-Col: Branch Performance Comparison Table */}
        <div className="lg:col-span-7 space-y-3">
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Multi-Branch Benchmark Comparison</h3>
                <p className="text-[11px] text-slate-500">Ranked by revenue contribution & growth</p>
              </div>
              <Link href="/back-office/reports/branch-comparison">
                <Button variant="outline" size="sm" className="text-xs">
                  Full Analytics →
                </Button>
              </Link>
            </div>

            <div className="space-y-2.5">
              {[
                { rank: 1, name: 'Jubilee Hills Flagship (JH-01)', city: 'Hyderabad', revenue: 980000, growth: '+18.4%', status: 'TOP_PERFORMER', staffCount: 10 },
                { rank: 2, name: 'Indiranagar Sanctuary (IN-01)', city: 'Bengaluru', revenue: 740000, growth: '+14.2%', status: 'GROWING', staffCount: 8 },
                { rank: 3, name: 'Banjara Hills Spa (BH-02)', city: 'Hyderabad', revenue: 480000, growth: '+9.1%', status: 'STABLE', staffCount: 6 },
                { rank: 4, name: 'Hitech City Express (HC-03)', city: 'Hyderabad', revenue: 280000, growth: '+4.5%', status: 'LOWEST_PERFORMER', staffCount: 4 },
              ].map((br) => (
                <div
                  key={br.name}
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/70 border border-slate-200 flex items-center justify-between gap-4 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-600 font-bold font-mono text-xs flex items-center justify-center shadow-2xs">
                      #{br.rank}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">{br.name}</span>
                        <Badge
                          variant={br.status === 'TOP_PERFORMER' ? 'success' : br.status === 'LOWEST_PERFORMER' ? 'destructive' : 'info'}
                          className="text-[9px]"
                        >
                          {br.status === 'TOP_PERFORMER' ? '🏆 Top Branch' : br.status === 'LOWEST_PERFORMER' ? '⚠️ Focus Branch' : 'Active'}
                        </Badge>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {br.city} • {br.staffCount} Stylists • MoM Growth: <strong className="text-emerald-600">{br.growth}</strong>
                      </span>
                    </div>
                  </div>

                  <span className="font-mono font-black text-amber-600 text-sm">
                    {formatCurrency(br.revenue)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5-Col: Stylist Revenue Leaderboard & Top Services */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">Stylist Revenue Leaderboard</h3>
              <Badge variant="warning">Top 4 Producers</Badge>
            </div>

            <div className="space-y-2.5 text-xs">
              {[
                { name: 'Priya Sharma', role: 'Master Stylist', branch: 'Jubilee Hills', revenue: 324000, targetPct: '128% Target' },
                { name: 'Rajesh Kumar', role: 'Senior Colorist', branch: 'Jubilee Hills', revenue: 268000, targetPct: '112% Target' },
                { name: 'Ananya Roy', role: 'Principal Aesthetician', branch: 'Banjara Hills', revenue: 215000, targetPct: '104% Target' },
                { name: 'Vikram Malhotra', role: 'Senior Stylist', branch: 'Indiranagar', revenue: 198000, targetPct: '98% Target' },
              ].map((st, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/70 border border-slate-200 flex items-center justify-between transition-colors"
                >
                  <div>
                    <span className="font-bold text-slate-900 block">{st.name}</span>
                    <span className="text-[10px] text-slate-500">{st.role} • {st.branch}</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-black text-emerald-600 block">{formatCurrency(st.revenue)}</span>
                    <span className="text-[10px] text-amber-600 font-semibold">{st.targetPct}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
