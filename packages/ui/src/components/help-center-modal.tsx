'use client';

import * as React from 'react';
import {
  HelpCircle,
  Search,
  BookOpen,
  Calendar,
  CreditCard,
  Users,
  Package,
  UserCheck,
  Award,
  Megaphone,
  BarChart3,
  Bot,
  ShieldCheck,
  ChevronRight,
  X,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { Input } from './input';
import { Badge } from './badge';
import { Button } from './button';

export interface HelpArticle {
  id: string;
  category: string;
  title: string;
  summary: string;
  content: string[];
  tips: string[];
}

export const helpArticlesDatabase: HelpArticle[] = [
  // 1. GETTING STARTED & RECEPTIONIST WORKFLOW
  {
    id: 'art-receptionist-flow',
    category: 'Getting Started',
    title: 'Zero-Training Receptionist 9-Step Daily Workflow',
    summary: 'The complete standard operating procedure for front-desk receptionists from client arrival to rebooking.',
    content: [
      '1. Find Customer: Press Ctrl+K or search by phone number/name in Customers CRM.',
      '2. Create Appointment: Select service, preferred stylist, date, and chair time slot.',
      '3. Check In Customer: Click Check-In upon guest arrival to update live chair occupancy on the dashboard.',
      '4. Assign Stylist: Verify primary stylist and secondary assistant station assignments.',
      '5. Complete Service: Mark appointment as COMPLETED once the hair/skin ritual is finished.',
      '6. Create Invoice: Click Checkout to auto-load service lines, duration, and stylist commission attribution.',
      '7. Take Payment: Apply loyalty points/wallets, split balance across UPI/Card/Cash, and complete checkout.',
      '8. Send Receipt: Dispatch instant digital GST invoice via WhatsApp Cloud API or print 3-inch thermal slip.',
      '9. Book Next Visit: Schedule the 45-day color refresh or maintenance appointment before the guest departs.',
    ],
    tips: [
      'Customers with active memberships will automatically receive their configured discounts at checkout.',
      'Always confirm the customer phone number to ensure loyalty points are credited to their account.',
    ],
  },
  {
    id: 'art-dashboard-overview',
    category: 'Getting Started',
    title: 'Understanding the Daily Operations Dashboard',
    summary: 'How to monitor sales pacing, chair occupancies, staff rosters, and critical inventory alerts.',
    content: [
      'Today Sales vs Target: Displays real-time billing against the branch daily revenue target with automated progress percentage.',
      'Live Chair Utilization: Shows current styling chair and aesthetic room occupancy in real time.',
      'Active Staff on Duty: Verifies checked-in stylists, therapists, and front-desk coordinators.',
      'Low Stock Alerts: Flags retail items and backbar supplies currently below safety thresholds.',
    ],
    tips: [
      'Regional managers can switch between authorized branches using the hierarchical branch dropdown in the header.',
    ],
  },

  // 2. APPOINTMENTS
  {
    id: 'art-appointments-booking',
    category: 'Appointments & Diary',
    title: 'Booking Appointments & Double-Booking Prevention',
    summary: 'How to schedule multi-service appointments, assign chairs, and handle buffer intervals.',
    content: [
      'Diary Grid: Each column represents an active stylist or private spa suite.',
      'Double-Booking Guard: The system strictly prevents overlapping bookings on the same stylist or chair.',
      'Buffer Intervals: Automated 10-minute turnaround buffer is added after chemical services (e.g. Balayage, Keratin).',
      'Status Lifecycle: SCHEDULED ➔ CONFIRMED ➔ IN_SERVICE ➔ COMPLETED ➔ NO_SHOW ➔ CANCELLED.',
    ],
    tips: [
      'Drag and drop appointments to quickly reschedule to another time slot or reassign to an available stylist.',
    ],
  },

  // 3. POS & BILLING
  {
    id: 'art-pos-checkout',
    category: 'POS & Invoicing',
    title: 'POS Checkout, Split Payments & Multi-Stylist Commissions',
    summary: 'Generating 18% GST tax invoices, splitting payment tenders, and applying wallet debits.',
    content: [
      'Line Item Attribution: Haircuts, colors, and retail items are credited to individual stylists for fair commission tracking.',
      'Split Payments: Easily split a ₹4,500 bill into ₹2,000 UPI + ₹2,500 Credit Card in one transaction.',
      'Prepaid Wallet & Loyalty: 1-click deduction from customer wallet balances or loyalty point redemptions.',
      '18% GST Compliance: Automatic calculation of CGST (9%) and SGST (9%) with HSN/SAC codes.',
    ],
    tips: [
      'Prepaid wallets strictly reject any debit that would result in a negative balance.',
    ],
  },

  // 4. CUSTOMERS CRM
  {
    id: 'art-customer-crm',
    category: 'Customers CRM',
    title: 'Customer 360 Profiles & Omnichannel History',
    summary: 'Viewing unified client timelines, hair history, patch tests, and lifetime metrics.',
    content: [
      'Omnichannel Timeline: Aggregates In-Salon Services, POS Counter Purchases, and Online Storefront Orders in one unified stream.',
      'Hair & Skin Profile: Records hair texture, scalp condition, color formulas, and patch test allergy history.',
      'Financial Summary: Lifetime spend, average ticket value, visit frequency, and active membership tier.',
    ],
    tips: [
      'Filter the customer timeline by channel to inspect online purchases vs in-salon counter bills.',
    ],
  },

  // 5. INVENTORY & STOCK
  {
    id: 'art-inventory-management',
    category: 'Inventory & Stock',
    title: 'Inventory Tracking, Stock Ledgers & Zero Oversell Guarantee',
    summary: 'Managing retail products, backbar consumption recipes, and inter-branch transfers.',
    content: [
      'Double-Entry Stock Ledger: Every receipt, sale, usage, and transfer creates an immutable ledger entry.',
      'Backbar Service Recipes: Performing a Keratin treatment automatically deducts 60ml of Keratin solution from branch stock.',
      'Never-Oversell Guarantee: Online storefront orders lock available branch units atomically at checkout.',
      'Inter-Branch Transfers: Transfer excess stock between salon locations with source dispatch and receiving verification.',
    ],
    tips: [
      'Review the Reorders tab weekly to generate automated Purchase Orders for high-velocity items.',
    ],
  },

  // 6. STAFF & COMMISSIONS
  {
    id: 'art-staff-commissions',
    category: 'Staff & Commissions',
    title: 'Staff Rosters, Commission Slabs & Payroll Summary',
    summary: 'Configuring tiered commission slabs, tracking targets, and exporting payroll-ready sheets.',
    content: [
      'Progressive Slabs: Configure milestone-based commissions (e.g. 5% on ₹0–₹50k, 7% on ₹50k–₹100k, 10% on ₹100k+).',
      'Immutable Ledger: Commission credits are recorded upon invoice payment. Refunds automatically log a clawback reversal.',
      '7-Dimensional Targets: Track Revenue, Services Count, Retail Sales, Memberships, New Clients, Rebooking %, and CSAT.',
      'Payroll Export: Reconcile base salary, commissions, overtime, and TDS deductions for bank disbursement.',
    ],
    tips: [
      'Use the commission simulation sandbox to test multi-stylist splits before publishing commission plans.',
    ],
  },

  // 7. MEMBERSHIPS & RETENTION
  {
    id: 'art-memberships-retention',
    category: 'Retention & Memberships',
    title: 'Memberships, Service Packages, Wallets & Family Plans',
    summary: 'Creating recurring membership plans, prepaid session packages, and shared family pools.',
    content: [
      '6 Membership Archetypes: Discount Memberships, Prepaid Credits, Service Packages, Family Pools, Monthly Passes, and Prestige Plans.',
      'Multi-Session Packages: Sell bundled treatments (e.g. 10 Blow-Drys for ₹5,000) and track used vs remaining sessions.',
      'Customer Wallets: Zero-negative-balance prepaid ledger with promotional credit expiries.',
      'Family Sharing: Primary members can share discounts and wallet balances with verified family members.',
    ],
    tips: [
      'Automated renewal notifications are dispatched at 30 days, 7 days, and 1 day prior to membership expiration.',
    ],
  },

  // 8. HIVE SALON AI
  {
    id: 'art-ai-bi',
    category: 'Hive Salon AI',
    title: 'Hive Salon AI — Text-to-SQL & Predictive Analytics',
    summary: 'Asking natural language business questions, generating visual charts, and reviewing ML forecasts.',
    content: [
      'Natural Language Queries: Ask "How much did we sell today?", "Which branch performed best?", or "Which products are running low?".',
      'Strict Read-Only Security: AI executes in zero-mutation mode with AST validation rejecting all DDL/DML operations.',
      'Forced RBAC Injection: Tenant isolation and geographic branch scopes are injected outside generated SQL.',
      '5 ML Forecast Models: 30/60/90-Day Revenue, Chair Occupancy, Inventory Depletion, Churn Risk, and Demand Spikes.',
    ],
    tips: [
      'Click "Inspect Generated SQL" on any AI response card to view the underlying sanitized query and latency metrics.',
    ],
  },
];

export interface HelpCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (href: string) => void;
}

export const HelpCenterModal: React.FC<HelpCenterModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('ALL');
  const [selectedArticle, setSelectedArticle] = React.useState<HelpArticle | null>(helpArticlesDatabase[0]);

  if (!isOpen) return null;

  const categories = ['ALL', 'Getting Started', 'Appointments & Diary', 'POS & Invoicing', 'Customers CRM', 'Inventory & Stock', 'Staff & Commissions', 'Retention & Memberships', 'Hive Salon AI'];

  const filteredArticles = helpArticlesDatabase.filter((art) => {
    const matchesCat = selectedCategory === 'ALL' || art.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.content.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-left">
        {/* Top Header */}
        <div className="p-5 bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white">Hive Salon Help Center</h2>
                <Badge variant="warning">Zero-Training Knowledge Base</Badge>
              </div>
              <p className="text-xs text-slate-400">Search guides, receptionist checklists, and system workflows.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Category Filter */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search help articles (e.g. 'receptionist workflow', 'split payments', 'inventory', 'commissions')..."
              className="pl-9 h-10 text-xs bg-slate-900 border-slate-800 rounded-xl focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Pane (Two-Column) */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden min-h-[380px]">
          {/* Left Column: Article List */}
          <div className="md:col-span-5 border-r border-slate-800 overflow-y-auto divide-y divide-slate-850 p-2 bg-slate-950/40">
            {filteredArticles.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                <HelpCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
                No matching help articles found.
              </div>
            ) : (
              filteredArticles.map((art) => (
                <button
                  key={art.id}
                  onClick={() => setSelectedArticle(art)}
                  className={`w-full text-left p-3 rounded-xl transition-all mb-1 ${
                    selectedArticle?.id === art.id
                      ? 'bg-amber-500/15 border border-amber-500/30 text-white'
                      : 'hover:bg-slate-900/60 text-slate-300'
                  }`}
                >
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-0.5">
                    {art.category}
                  </span>
                  <span className="text-xs font-bold block mb-1">{art.title}</span>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{art.summary}</p>
                </button>
              ))
            )}
          </div>

          {/* Right Column: Selected Article Detail */}
          <div className="md:col-span-7 p-6 overflow-y-auto space-y-4 bg-slate-900/60 text-xs text-left">
            {selectedArticle ? (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div>
                  <Badge variant="outline" className="mb-1 text-[10px]">
                    {selectedArticle.category}
                  </Badge>
                  <h3 className="text-base font-black text-white">{selectedArticle.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{selectedArticle.summary}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Step-by-Step Instructions:
                  </span>
                  <div className="space-y-2 text-slate-300 text-xs">
                    {selectedArticle.content.map((point, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedArticle.tips.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Pro-Tips & Edge Cases:</span>
                    </div>
                    {selectedArticle.tips.map((tip, tIdx) => (
                      <p key={tIdx} className="text-[11px] text-amber-200/90 pl-5">
                        • {tip}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500 text-xs">Select an article from the left to read.</div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 px-6">
          <span>Need immediate assistance? Press <strong>Ctrl + /</strong> anytime to open contextual help.</span>
          <Button variant="primary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
