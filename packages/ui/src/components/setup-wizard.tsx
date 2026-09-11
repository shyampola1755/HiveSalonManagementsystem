'use client';

import * as React from 'react';
import {
  Building2,
  MapPin,
  Sparkles,
  Users,
  Package,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  Plus,
  Trash2,
} from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { Select } from './select';
import { Badge } from './badge';
import { Modal } from './modal';
import { SUPPORTED_CURRENCIES, SUPPORTED_TIMEZONES } from '@hive/config';
import { cn } from '@hive/utilities';

export interface SetupWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: any) => void;
  initialStep?: number;
}

export const SetupWizard: React.FC<SetupWizardProps> = ({
  isOpen,
  onClose,
  onComplete,
  initialStep = 1,
}) => {
  const [currentStep, setCurrentStep] = React.useState(initialStep);

  // Form states across the 7 steps
  const [businessData, setBusinessData] = React.useState({
    businessName: 'Hive Luxury Lounge & Spa',
    businessType: 'SALON',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    phone: '+1 (555) 234-5678',
    email: 'contact@hiveluxury.com',
  });

  const [locationData, setLocationData] = React.useState({
    branchName: 'Downtown Flagship',
    branchCode: 'DT-01',
    address: '124 Fifth Avenue, Suite 400',
    city: 'New York',
    country: 'United States',
    phone: '+1 (555) 234-5678',
  });

  const [services, setServices] = React.useState([
    { name: 'Signature Blowdry & Style', duration: 45, price: 65 },
    { name: 'Balayage & Gloss Finish', duration: 120, price: 195 },
    { name: 'Deep Tissue Massage (60m)', duration: 60, price: 110 },
  ]);

  const [staffList, setStaffList] = React.useState([
    { fullName: 'Sarah Jenkins', role: 'Branch Manager', email: 'sarah@hiveluxury.com' },
    { fullName: 'Sophia Miller', role: 'Senior Colorist', email: 'sophia@hiveluxury.com' },
  ]);

  const [products, setProducts] = React.useState([
    { name: 'Olaplex No. 3 Hair Perfector 100ml', sku: 'OLA-003', costPrice: 16, retailPrice: 32, initialStock: 24 },
    { name: 'Moroccanoil Treatment 100ml', sku: 'MOR-100', costPrice: 22, retailPrice: 48, initialStock: 15 },
  ]);

  const [paymentMethods, setPaymentMethods] = React.useState({
    cash: true,
    card: true,
    upi: false,
    loyalty: true,
    taxPercentage: 8.5,
    invoicePrefix: 'INV-',
  });

  // Steps definition
  const steps = [
    { number: 1, title: 'Business Profile', icon: Building2, desc: 'Tell us about your business' },
    { number: 2, title: 'Location Setup', icon: MapPin, desc: 'Set up your primary branch' },
    { number: 3, title: 'Services Catalog', icon: Sparkles, desc: 'Add popular treatments' },
    { number: 4, title: 'Staff Roster', icon: Users, desc: 'Add stylists and managers' },
    { number: 5, title: 'Products & Stock', icon: Package, desc: 'Add retail & backbar products' },
    { number: 6, title: 'Payments & Tax', icon: CreditCard, desc: 'Set payment methods & tax rules' },
    { number: 7, title: 'Ready to Launch', icon: CheckCircle2, desc: 'Review and start managing' },
  ];

  // Calculate percentage: Step 1 -> 14%, Step 6 -> 85%, Step 7 -> 100%
  const progressPercent = Math.round((currentStep / steps.length) * 100);

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onComplete({
        business: businessData,
        location: locationData,
        services,
        staff: staffList,
        products,
        payments: paymentMethods,
      });
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="3xl"
      title={
        <div className="flex items-center justify-between w-full pr-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-950 font-bold text-xs text-amber-700 dark:text-amber-400">
              {currentStep}/7
            </span>
            <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
              Welcome to Hive Salon Setup
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline underline-offset-2"
          >
            Skip & Return Later
          </button>
        </div>
      }
      footer={
        <div className="flex items-center justify-between w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            disabled={currentStep === 1}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Back
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:inline">
              Step {currentStep} of {steps.length}
            </span>
            <Button
              variant="primary"
              size="sm"
              onClick={handleNext}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              {currentStep === 7 ? 'Complete Setup & Launch 🚀' : 'Continue'}
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-1.5 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Business Setup Completion
            </span>
            <span className="font-bold text-amber-600 dark:text-amber-400 tabular-nums">
              {progressPercent}% Complete
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Step Indicator Badges */}
        <div className="flex items-center justify-between overflow-x-auto pb-2 gap-1 no-scrollbar">
          {steps.map((s) => {
            const isDone = currentStep > s.number;
            const isCurrent = currentStep === s.number;
            return (
              <button
                key={s.number}
                type="button"
                onClick={() => setCurrentStep(s.number)}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors select-none',
                  isCurrent && 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 font-semibold',
                  isDone && 'text-emerald-700 dark:text-emerald-400',
                  !isCurrent && !isDone && 'text-slate-400 hover:text-slate-600'
                )}
              >
                {isDone ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                ) : (
                  <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-[9px] font-bold">
                    {s.number}
                  </span>
                )}
                <span>{s.title}</span>
              </button>
            );
          })}
        </div>

        {/* STEP 1: BUSINESS PROFILE */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-150 text-left">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Step 1: Tell us about your business
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Set up your brand identity and base localization preferences.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Business / Brand Name"
                value={businessData.businessName}
                onChange={(e) => setBusinessData({ ...businessData, businessName: e.target.value })}
                required
              />
              <Select
                label="Business Type"
                value={businessData.businessType}
                onChange={(e) => setBusinessData({ ...businessData, businessType: e.target.value })}
                options={[
                  { label: 'Hair & Beauty Salon', value: 'SALON' },
                  { label: 'Day Spa & Wellness', value: 'SPA' },
                  { label: 'Aesthetic & Skin Clinic', value: 'AESTHETIC_CLINIC' },
                  { label: 'Multi-Branch Salon Chain', value: 'CHAIN' },
                ]}
              />
              <Select
                label="Primary Operating Currency"
                value={businessData.currency}
                onChange={(e) => setBusinessData({ ...businessData, currency: e.target.value })}
                options={SUPPORTED_CURRENCIES.map((c) => ({
                  label: `${c.code} (${c.symbol}) — ${c.name}`,
                  value: c.code,
                }))}
              />
              <Select
                label="Timezone"
                value={businessData.timezone}
                onChange={(e) => setBusinessData({ ...businessData, timezone: e.target.value })}
                options={SUPPORTED_TIMEZONES.map((tz) => ({ label: tz, value: tz }))}
              />
              <Input
                label="Primary Contact Email"
                type="email"
                value={businessData.email}
                onChange={(e) => setBusinessData({ ...businessData, email: e.target.value })}
                required
              />
              <Input
                label="Primary Contact Phone"
                value={businessData.phone}
                onChange={(e) => setBusinessData({ ...businessData, phone: e.target.value })}
                required
              />
            </div>
          </div>
        )}

        {/* STEP 2: LOCATION SETUP */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in duration-150 text-left">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Step 2: Set up your primary branch
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Every salon starts with at least one physical location. You can add more later.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Branch / Location Name"
                value={locationData.branchName}
                onChange={(e) => setLocationData({ ...locationData, branchName: e.target.value })}
                required
              />
              <Input
                label="Branch Code"
                value={locationData.branchCode}
                onChange={(e) => setLocationData({ ...locationData, branchCode: e.target.value })}
                helperText="Unique identifier for receipts & stock"
                required
              />
              <div className="sm:col-span-2">
                <Input
                  label="Street Address"
                  value={locationData.address}
                  onChange={(e) => setLocationData({ ...locationData, address: e.target.value })}
                  required
                />
              </div>
              <Input
                label="City"
                value={locationData.city}
                onChange={(e) => setLocationData({ ...locationData, city: e.target.value })}
                required
              />
              <Input
                label="Country"
                value={locationData.country}
                onChange={(e) => setLocationData({ ...locationData, country: e.target.value })}
                required
              />
            </div>
          </div>
        )}

        {/* STEP 3: SERVICES */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in duration-150 text-left">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Step 3: Add your initial services
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Define your popular treatments with durations and base pricing.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Plus className="h-3.5 w-3.5" />}
                onClick={() =>
                  setServices([...services, { name: 'New Treatment', duration: 30, price: 50 }])
                }
              >
                Add Service
              </Button>
            </div>

            <div className="space-y-2">
              {services.map((svc, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                >
                  <div className="flex-1">
                    <Input
                      placeholder="Service Name"
                      value={svc.name}
                      onChange={(e) => {
                        const updated = [...services];
                        updated[idx].name = e.target.value;
                        setServices(updated);
                      }}
                    />
                  </div>
                  <div className="w-28">
                    <Input
                      type="number"
                      placeholder="Mins"
                      value={svc.duration}
                      onChange={(e) => {
                        const updated = [...services];
                        updated[idx].duration = Number(e.target.value);
                        setServices(updated);
                      }}
                      helperText="Duration (m)"
                    />
                  </div>
                  <div className="w-28">
                    <Input
                      type="number"
                      placeholder="Price"
                      value={svc.price}
                      onChange={(e) => {
                        const updated = [...services];
                        updated[idx].price = Number(e.target.value);
                        setServices(updated);
                      }}
                      helperText="Price ($)"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setServices(services.filter((_, i) => i !== idx))}
                    className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: STAFF */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in duration-150 text-left">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Step 4: Add your staff & team members
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Set up user accounts for receptionists, managers, and stylists.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Plus className="h-3.5 w-3.5" />}
                onClick={() =>
                  setStaffList([
                    ...staffList,
                    { fullName: '', role: 'Stylist', email: '' },
                  ])
                }
              >
                Add Member
              </Button>
            </div>

            <div className="space-y-2">
              {staffList.map((st, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                >
                  <div className="flex-1 w-full">
                    <Input
                      placeholder="Full Name"
                      value={st.fullName}
                      onChange={(e) => {
                        const updated = [...staffList];
                        updated[idx].fullName = e.target.value;
                        setStaffList(updated);
                      }}
                    />
                  </div>
                  <div className="w-full sm:w-44">
                    <Select
                      value={st.role}
                      onChange={(e) => {
                        const updated = [...staffList];
                        updated[idx].role = e.target.value;
                        setStaffList(updated);
                      }}
                      options={[
                        { label: 'Branch Manager', value: 'Branch Manager' },
                        { label: 'Receptionist', value: 'Receptionist' },
                        { label: 'Stylist / Artist', value: 'Stylist' },
                        { label: 'Therapist', value: 'Therapist' },
                      ]}
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <Input
                      placeholder="Email Address"
                      value={st.email}
                      onChange={(e) => {
                        const updated = [...staffList];
                        updated[idx].email = e.target.value;
                        setStaffList(updated);
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setStaffList(staffList.filter((_, i) => i !== idx))}
                    className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: PRODUCTS */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-in fade-in duration-150 text-left">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Step 5: Add retail & backbar products
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Track retail items sold at checkout or professional backbar supplies.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Plus className="h-3.5 w-3.5" />}
                onClick={() =>
                  setProducts([
                    ...products,
                    { name: 'Product Name', sku: 'SKU-001', costPrice: 10, retailPrice: 20, initialStock: 10 },
                  ])
                }
              >
                Add Product
              </Button>
            </div>

            <div className="space-y-2">
              {products.map((p, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                >
                  <div className="flex-1 w-full">
                    <Input
                      placeholder="Product Name"
                      value={p.name}
                      onChange={(e) => {
                        const updated = [...products];
                        updated[idx].name = e.target.value;
                        setProducts(updated);
                      }}
                    />
                  </div>
                  <div className="w-full sm:w-28">
                    <Input
                      placeholder="SKU"
                      value={p.sku}
                      onChange={(e) => {
                        const updated = [...products];
                        updated[idx].sku = e.target.value;
                        setProducts(updated);
                      }}
                    />
                  </div>
                  <div className="w-full sm:w-24">
                    <Input
                      type="number"
                      placeholder="Retail $"
                      value={p.retailPrice}
                      onChange={(e) => {
                        const updated = [...products];
                        updated[idx].retailPrice = Number(e.target.value);
                        setProducts(updated);
                      }}
                    />
                  </div>
                  <div className="w-full sm:w-24">
                    <Input
                      type="number"
                      placeholder="Stock"
                      value={p.initialStock}
                      onChange={(e) => {
                        const updated = [...products];
                        updated[idx].initialStock = Number(e.target.value);
                        setProducts(updated);
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setProducts(products.filter((_, i) => i !== idx))}
                    className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 6: PAYMENTS & TAX */}
        {currentStep === 6 && (
          <div className="space-y-4 animate-in fade-in duration-150 text-left">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Step 6: Configure payment methods & invoicing
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Enable payment channels accepted at your POS registers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3 rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-900/50">
                <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                  Accepted Payment Methods
                </h5>
                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paymentMethods.cash}
                    onChange={(e) =>
                      setPaymentMethods({ ...paymentMethods, cash: e.target.checked })
                    }
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>Cash Payments</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paymentMethods.card}
                    onChange={(e) =>
                      setPaymentMethods({ ...paymentMethods, card: e.target.checked })
                    }
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>Credit / Debit Cards (POS Terminal)</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paymentMethods.loyalty}
                    onChange={(e) =>
                      setPaymentMethods({ ...paymentMethods, loyalty: e.target.checked })
                    }
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>Loyalty Points & Gift Vouchers</span>
                </label>
              </div>

              <div className="space-y-4">
                <Input
                  label="Sales Tax / VAT Rate (%)"
                  type="number"
                  value={paymentMethods.taxPercentage}
                  onChange={(e) =>
                    setPaymentMethods({
                      ...paymentMethods,
                      taxPercentage: Number(e.target.value),
                    })
                  }
                  helperText="Standard sales tax applied at checkout"
                />
                <Input
                  label="Invoice Number Prefix"
                  value={paymentMethods.invoicePrefix}
                  onChange={(e) =>
                    setPaymentMethods({ ...paymentMethods, invoicePrefix: e.target.value })
                  }
                  helperText="e.g. INV- or NYC-"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: READY TO USE */}
        {currentStep === 7 && (
          <div className="space-y-6 py-4 text-center animate-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 shadow-sm">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                You’re Ready to Use Hive Salon!
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                Your organization profile, primary branch, services catalog, and staff credentials
                have been configured. You can now start booking appointments and running POS
                transactions.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50/50 dark:bg-slate-900/50">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Location</span>
                <p className="text-xs font-bold truncate mt-0.5">{locationData.branchName}</p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50/50 dark:bg-slate-900/50">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Services</span>
                <p className="text-xs font-bold truncate mt-0.5">{services.length} configured</p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50/50 dark:bg-slate-900/50">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Team</span>
                <p className="text-xs font-bold truncate mt-0.5">{staffList.length} members</p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 bg-slate-50/50 dark:bg-slate-900/50">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Currency</span>
                <p className="text-xs font-bold truncate mt-0.5">{businessData.currency}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
