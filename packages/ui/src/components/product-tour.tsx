'use client';

import * as React from 'react';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  CheckCircle2,
  Calendar,
  Users,
  CreditCard,
  Package,
  UserCheck,
  Bot,
  BarChart3,
  Building2,
  HelpCircle,
  Play,
  RotateCcw,
} from 'lucide-react';
import { Button } from './button';
import { Badge } from './badge';
import { cn } from '@hive/utilities';

export interface TourStep {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  targetModule: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  recommendedAction: string;
}

export const defaultTourSteps: TourStep[] = [
  {
    id: 'step-welcome',
    title: 'Welcome to Hive Salon Enterprise',
    subtitle: 'Next-Generation Luxury Multi-Branch Management',
    description:
      'Hive Salon is an enterprise salon, spa, and clinic management system designed for multi-branch luxury operations with zero-training ease of use, atomic inventory sync, dynamic commissions, and AI business intelligence.',
    targetModule: 'Overview',
    icon: Sparkles,
    features: [
      'Multi-tier geographic hierarchy (Organization → State → District → City → Branch)',
      'Single sign-on with multi-tenant RBAC scope enforcement',
      'Unified omnichannel sales (In-salon, POS counter, and online storefront)',
      'Natural language Hive Salon AI analytics and predictive forecasting',
    ],
    recommendedAction: 'Click Next to explore core operational modules in 2 minutes.',
  },
  {
    id: 'step-dashboard',
    title: 'Real-Time Branch Operations Dashboard',
    subtitle: 'Live Command Center for Today’s Performance',
    description:
      'Monitor sales pacing against your daily branch target, track live chair occupancies, view scheduled appointments, inspect staff on duty, and catch low-stock inventory alerts instantly.',
    targetModule: 'Dashboard (/)',
    icon: BarChart3,
    features: [
      'Intraday sales vs target tracker with revenue breakdown (Services vs Retail)',
      'Hierarchical Branch Switcher for authorized regional managers',
      'Quick action buttons for new billings, walk-ins, and purchase orders',
    ],
    recommendedAction: 'Check this dashboard first thing each morning.',
  },
  {
    id: 'step-appointments',
    title: 'Appointment Diary & Multi-Chair Calendar',
    subtitle: 'Zero Double-Booking & Multi-Stylist Scheduling',
    description:
      'Manage appointment schedules across multiple styling stations with drag-and-drop flexibility, service buffer intervals, automated conflict detection, and instant client SMS/WhatsApp confirmations.',
    targetModule: 'Appointments (/appointments)',
    icon: Calendar,
    features: [
      'Visual timeline across all salon chairs and private aesthetic suites',
      '8-stage status tracking: SCHEDULED → CONFIRMED → IN_SERVICE → COMPLETED',
      'Walk-in queue management with estimated wait times',
    ],
    recommendedAction: 'Click on any open calendar slot to book an appointment.',
  },
  {
    id: 'step-customers',
    title: 'Customers CRM & Unified 360 History',
    subtitle: 'Complete Omnichannel Customer Timeline',
    description:
      'Access 360° guest profiles displaying hair/skin service history, POS counter purchases, online storefront orders, membership benefits, prepaid wallet balances, and personalized stylist notes.',
    targetModule: 'Customers CRM (/customers)',
    icon: Users,
    features: [
      'Unified chronological timeline across Salon, POS, and Online orders',
      'Prepaid customer wallets with zero-negative-balance enforcement',
      'Tiered loyalty points ledger with spend multipliers and referral rewards',
    ],
    recommendedAction: 'Search any customer by name, phone, or email via Ctrl+K.',
  },
  {
    id: 'step-pos',
    title: 'Point of Sale (POS) & Checkout',
    subtitle: 'Lightning-Fast Invoicing & Multi-Payment Splits',
    description:
      'Generate tax-compliant 18% GST salon invoices in under 30 seconds. Automatically apply membership discounts, redeem loyalty points, debit prepaid wallets, and split payments across UPI, Card, and Cash.',
    targetModule: 'POS & Billing (/pos)',
    icon: CreditCard,
    features: [
      'Multi-stylist line-item attribution for commission credit',
      'Automatic package session redemption and wallet auto-debits',
      'Printable luxury thermal receipts and digital WhatsApp invoice delivery',
    ],
    recommendedAction: 'Select a client and click Checkout to create an invoice.',
  },
  {
    id: 'step-inventory',
    title: 'Inventory, Stock Ledgers & Consumption',
    subtitle: 'Atomic Stock Tracking & Never-Oversell Guarantee',
    description:
      'Track retail products and backbar chemical consumption. Automatically deduct exact milliliters per service via recipes, execute inter-branch stock transfers, and receive automated stockout warnings.',
    targetModule: 'Inventory & Stock (/inventory)',
    icon: Package,
    features: [
      'Double-entry immutable stock ledger (Purchases, Sales, Usage, Transfers)',
      'Synchronized physical branch inventory with online storefront',
      'Automated purchase order recommendations based on burn rates',
    ],
    recommendedAction: 'Review critical stock alerts under the Reorders tab.',
  },
  {
    id: 'step-staff',
    title: 'Staff, Rosters & Commission Slabs',
    subtitle: 'Performance Attribution & Automated Payroll',
    description:
      'Manage staff shift rosters, attendance biometric logs, multi-tier progressive commission slabs, multi-stylist attribution splits, and export one-click payroll calculation summaries.',
    targetModule: 'Staff & Commissions (/staff & /commissions)',
    icon: UserCheck,
    features: [
      'Progressive commission slabs (e.g. 5%, 7%, 10% based on revenue milestones)',
      'Automatic refund clawback handling in the commission ledger',
      '7-dimensional target tracking: Revenue, Services, Retail, CSAT, Rebooking',
    ],
    recommendedAction: 'Audit monthly commission statements under the Commissions suite.',
  },
  {
    id: 'step-ai',
    title: 'Hive Salon AI & Business Intelligence',
    subtitle: 'Natural Language Text-to-SQL & Predictive Analytics',
    description:
      'Ask any business question in plain English ("How much did we sell today?", "Which branch performed best this month?") to receive instant executive summaries, interactive charts, and predictive ML forecasts.',
    targetModule: 'Hive Salon AI (/ai)',
    icon: Bot,
    features: [
      'Text-to-SQL with forced tenant and geographic RBAC predicate injection',
      'Zero-mutation security AST validator rejecting all DDL/DML operations',
      '5 ML Forecast Models: Revenue, Bookings, Stockout, Churn, and Demand spikes',
    ],
    recommendedAction: 'Click Hive Salon AI in the navigation bar to ask your first question.',
  },
];

export interface ProductTourProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (href: string) => void;
}

export const ProductTour: React.FC<ProductTourProps> = ({ isOpen, onClose, onNavigate }) => {
  const [currentStepIndex, setCurrentStepIndex] = React.useState<number>(0);

  if (!isOpen) return null;

  const currentStep = defaultTourSteps[currentStepIndex];
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === defaultTourSteps.length - 1;
  const progressPct = Math.round(((currentStepIndex + 1) / defaultTourSteps.length) * 100);

  const handleNext = () => {
    if (isLast) {
      onClose();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStepIndex(0);
  };

  const StepIcon = currentStep.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden text-left">
        {/* Top Gradient Header */}
        <div className="p-6 bg-gradient-to-r from-amber-500/20 via-slate-900 to-slate-900 border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shadow-lg">
              <StepIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase font-bold text-amber-400 tracking-wider">
                  Step {currentStepIndex + 1} of {defaultTourSteps.length}
                </span>
                <Badge variant="warning">{currentStep.targetModule}</Badge>
              </div>
              <h2 className="text-lg font-black text-white">{currentStep.title}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Skip Tour"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-950 h-1">
          <div
            className="bg-gradient-to-r from-amber-500 to-amber-300 h-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Tour Body */}
        <div className="p-6 space-y-5 text-xs">
          <div>
            <span className="text-amber-300 font-semibold block text-sm mb-1">{currentStep.subtitle}</span>
            <p className="text-slate-300 leading-relaxed text-xs">{currentStep.description}</p>
          </div>

          {/* Key Capabilities */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Core Capabilities:
            </span>
            <div className="space-y-1.5">
              {currentStep.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2 text-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-snug">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pro-Tip / Recommendation */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center gap-2 text-[11px]">
            <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
            <span>
              <strong>Zero-Training Tip:</strong> {currentStep.recommendedAction}
            </span>
          </div>
        </div>

        {/* Footer Navigation Controls */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRestart}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              Restart
            </Button>
            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1 font-medium transition-colors"
            >
              Skip Tour
            </button>
          </div>

          <div className="flex items-center gap-2">
            {!isFirst && (
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrev}
                leftIcon={<ChevronLeft className="w-4 h-4" />}
                className="text-xs"
              >
                Previous
              </Button>
            )}

            <Button
              variant="primary"
              size="sm"
              onClick={handleNext}
              rightIcon={!isLast ? <ChevronRight className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
              className="text-xs font-bold"
            >
              {isLast ? 'Get Started' : 'Next Step'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
