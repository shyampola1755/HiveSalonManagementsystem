'use client';

import * as React from 'react';
import {
  Building2,
  Receipt,
  Clock,
  Bell,
  Shield,
  Save,
  Globe,
  Percent,
} from 'lucide-react';
import {
  PageHeader,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Input,
  Select,
  Badge,
  Tabs,
  useToast,
} from '@hive/ui';

export default function OrganizationSettingsPage() {
  const toast = useToast();
  const [activeTab, setActiveTab] = React.useState('profile');
  const [isSaving, setIsSaving] = React.useState(false);

  // Form State
  const [form, setForm] = React.useState({
    // Profile
    name: 'Hive Luxury Salons & Spa Group',
    legalName: 'Hive Wellness Private Limited',
    taxIdentifier: '36AAAAA0000A1Z5',
    email: 'contact@hivesalon.com',
    phone: '+91 98765 43210',
    website: 'https://hivesalon.com',
    logoUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=200',

    // Localization
    country: 'India',
    state: 'Telangana',
    city: 'Hyderabad',
    pincode: '500033',
    currency: 'INR',
    currencySymbol: '₹',
    timezone: 'Asia/Kolkata',

    // Tax & Invoicing
    gstNumber: '36AAAAA0000A1Z5',
    defaultGSTRate: '18',
    cgstRate: '9',
    sgstRate: '9',
    invoicePrefix: 'HIVE-HYD-',
    invoiceFooterNote: 'Thank you for choosing Hive Salon! All services include 18% GST.',
    autoRoundOff: true,

    // Scheduling
    slotIntervalMinutes: '15',
    bookingBufferMinutes: '10',
    cancelWindowHours: '4',
    maxAdvanceBookingDays: '30',

    // Security & RBAC Policies
    maxFailedLogins: '5',
    lockoutDurationMinutes: '15',
    sessionTimeoutMinutes: '60',
    enforceMfaForManagers: true,
  });

  const handleSave = (section: string) => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Settings updated successfully', `${section} preferences have been saved and applied.`);
    }, 600);
  };

  const settingsTabs = [
    { id: 'profile', label: 'Profile & Brand', icon: <Building2 className="h-3.5 w-3.5" /> },
    { id: 'tax', label: 'GST & Invoicing', icon: <Percent className="h-3.5 w-3.5" /> },
    { id: 'localization', label: 'Localization (₹)', icon: <Globe className="h-3.5 w-3.5" /> },
    { id: 'booking', label: 'Appointments', icon: <Clock className="h-3.5 w-3.5" /> },
    { id: 'security', label: 'Security & RBAC', icon: <Shield className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* 1. WHERE AM I? */}
      <PageHeader
        title="Organization & System Settings"
        description="Configure organization-wide business profile, Indian GST tax rules, currency (₹), booking parameters, and security policies."
        breadcrumbs={[
          { label: 'Hive Beauty Group', href: '#' },
          { label: 'Settings', isCurrent: true },
        ]}
        badge={
          <Badge variant="default" showDot>
            Multi-Branch Master Config
          </Badge>
        }
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Save className="h-4 w-4" />}
            isLoading={isSaving}
            onClick={() => handleSave('Organization')}
          >
            Save All Changes
          </Button>
        }
      />

      <Tabs
        tabs={settingsTabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="pills"
        className="max-w-3xl"
      />

      {/* 1. BUSINESS PROFILE TAB */}
      {activeTab === 'profile' && (
        <div className="space-y-6 pt-2 text-left">
          <Card>
            <CardHeader>
              <CardTitle>Business Identification</CardTitle>
              <CardDescription>
                Primary business details displayed on customer receipts, invoices, and brand portals.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Organization Trade Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  helperText="Public facing commercial brand name"
                  required
                />
                <Input
                  label="Legal Entity Name"
                  value={form.legalName}
                  onChange={(e) => setForm({ ...form, legalName: e.target.value })}
                  helperText="Official registered company name (for tax invoices)"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Corporate Email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
                <Input
                  label="Helpline Mobile / Phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  helperText="10-digit mobile or Landline"
                  required
                />
                <Input
                  label="Official Website"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <Input
                  label="Brand Logo URL"
                  value={form.logoUrl}
                  onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                  helperText="High-resolution square SVG/PNG logo for invoices & receipts"
                />
                <Input
                  label="Company PAN / Tax Identifier"
                  value={form.taxIdentifier}
                  onChange={(e) => setForm({ ...form, taxIdentifier: e.target.value })}
                  helperText="10-digit Indian PAN number"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t border-slate-100 dark:border-slate-800 pt-4">
              <Button
                variant="primary"
                size="sm"
                isLoading={isSaving}
                onClick={() => handleSave('Business Profile')}
              >
                Save Profile
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* 2. GST & INVOICING TAB */}
      {activeTab === 'tax' && (
        <div className="space-y-6 pt-2 text-left">
          <Card>
            <CardHeader>
              <CardTitle>India GST & Invoicing Configuration</CardTitle>
              <CardDescription>
                Configure Goods & Services Tax (GST) breakdown, invoice prefixes, and thermal receipt notes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="GSTIN (GST Identification Number)"
                  value={form.gstNumber}
                  onChange={(e) => setForm({ ...form, gstNumber: e.target.value })}
                  helperText="15-character Indian GST identification number"
                  required
                />
                <Input
                  label="Default GST Tax Rate (%)"
                  value={form.defaultGSTRate}
                  onChange={(e) => setForm({ ...form, defaultGSTRate: e.target.value })}
                  helperText="Standard 18% for Salon & Aesthetic services"
                  required
                />
                <Input
                  label="Invoice Number Prefix"
                  value={form.invoicePrefix}
                  onChange={(e) => setForm({ ...form, invoicePrefix: e.target.value })}
                  helperText="e.g. HIVE-HYD-2026-"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Intra-State GST Split (Within Telangana)
                  </div>
                  <div className="text-xs text-slate-500">
                    CGST: <strong>{form.cgstRate}%</strong> + SGST: <strong>{form.sgstRate}%</strong> = Total <strong>{form.defaultGSTRate}%</strong>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Inter-State Tax
                  </div>
                  <div className="text-xs text-slate-500">
                    IGST: <strong>{form.defaultGSTRate}%</strong> for interstate corporate billings
                  </div>
                </div>
              </div>

              <Input
                label="Invoice & Receipt Footer Note"
                value={form.invoiceFooterNote}
                onChange={(e) => setForm({ ...form, invoiceFooterNote: e.target.value })}
                helperText="Prints at the bottom of all thermal POS receipts & PDF tax invoices."
              />
            </CardContent>
            <CardFooter className="flex justify-end border-t border-slate-100 dark:border-slate-800 pt-4">
              <Button
                variant="primary"
                size="sm"
                isLoading={isSaving}
                onClick={() => handleSave('GST & Invoicing')}
              >
                Save GST Configuration
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* 3. LOCALIZATION TAB */}
      {activeTab === 'localization' && (
        <div className="space-y-6 pt-2 text-left">
          <Card>
            <CardHeader>
              <CardTitle>Regional & Currency Standards</CardTitle>
              <CardDescription>
                System-wide default currency formatting, date presentation, and timezone synchronization.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  label="Country"
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  options={[
                    { label: 'India', value: 'India' },
                    { label: 'United Arab Emirates', value: 'UAE' },
                    { label: 'United States', value: 'USA' },
                  ]}
                  required
                />
                <Select
                  label="Base Currency"
                  value={form.currency}
                  onChange={(e) => setForm({ ...form, currency: e.target.value })}
                  options={[
                    { label: 'INR - Indian Rupee (₹)', value: 'INR' },
                    { label: 'AED - UAE Dirham (د.إ)', value: 'AED' },
                    { label: 'USD - US Dollar ($)', value: 'USD' },
                  ]}
                  required
                />
                <Select
                  label="Timezone"
                  value={form.timezone}
                  onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                  options={[
                    { label: 'Asia/Kolkata (IST +5:30)', value: 'Asia/Kolkata' },
                    { label: 'Asia/Dubai (GST +4:00)', value: 'Asia/Dubai' },
                    { label: 'America/New_York (EST)', value: 'America/New_York' },
                  ]}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Headquarters State"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                />
                <Input
                  label="Headquarters City"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
                <Input
                  label="Pincode / Postal Code"
                  value={form.pincode}
                  onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t border-slate-100 dark:border-slate-800 pt-4">
              <Button
                variant="primary"
                size="sm"
                isLoading={isSaving}
                onClick={() => handleSave('Localization')}
              >
                Save Localization
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* 4. APPOINTMENTS & SCHEDULING TAB */}
      {activeTab === 'booking' && (
        <div className="space-y-6 pt-2 text-left">
          <Card>
            <CardHeader>
              <CardTitle>Appointment & Calendar Rules</CardTitle>
              <CardDescription>
                Define slot intervals, buffer times between treatments, and cancellation policies.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Calendar Slot Grid Interval"
                  value={form.slotIntervalMinutes}
                  onChange={(e) => setForm({ ...form, slotIntervalMinutes: e.target.value })}
                  options={[
                    { label: '15 Minutes (High Precision)', value: '15' },
                    { label: '30 Minutes (Standard)', value: '30' },
                    { label: '45 Minutes', value: '45' },
                    { label: '60 Minutes', value: '60' },
                  ]}
                />
                <Select
                  label="Station Cleanup / Buffer Time"
                  value={form.bookingBufferMinutes}
                  onChange={(e) => setForm({ ...form, bookingBufferMinutes: e.target.value })}
                  options={[
                    { label: 'None (0 Minutes)', value: '0' },
                    { label: '5 Minutes Buffer', value: '5' },
                    { label: '10 Minutes Buffer (Recommended)', value: '10' },
                    { label: '15 Minutes Buffer', value: '15' },
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Free Cancellation Window (Hours)"
                  type="number"
                  value={form.cancelWindowHours}
                  onChange={(e) => setForm({ ...form, cancelWindowHours: e.target.value })}
                  helperText="Minimum hours notice required before appointment start"
                />
                <Input
                  label="Max Advance Booking Window (Days)"
                  type="number"
                  value={form.maxAdvanceBookingDays}
                  onChange={(e) => setForm({ ...form, maxAdvanceBookingDays: e.target.value })}
                  helperText="How far ahead clients and reception can book appointments"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t border-slate-100 dark:border-slate-800 pt-4">
              <Button
                variant="primary"
                size="sm"
                isLoading={isSaving}
                onClick={() => handleSave('Booking Rules')}
              >
                Save Booking Rules
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* 5. SECURITY & RBAC POLICIES TAB */}
      {activeTab === 'security' && (
        <div className="space-y-6 pt-2 text-left">
          <Card>
            <CardHeader>
              <CardTitle>Enterprise Security & Lockout Policies</CardTitle>
              <CardDescription>
                Account lockout protections, session lifespans, and cross-branch isolation rules.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Max Failed Login Attempts"
                  type="number"
                  value={form.maxFailedLogins}
                  onChange={(e) => setForm({ ...form, maxFailedLogins: e.target.value })}
                  helperText="Account temporarily locked after 5 consecutive failures"
                />
                <Input
                  label="Account Lockout Duration (Minutes)"
                  type="number"
                  value={form.lockoutDurationMinutes}
                  onChange={(e) => setForm({ ...form, lockoutDurationMinutes: e.target.value })}
                  helperText="Duration user must wait or use OTP unlock"
                />
                <Input
                  label="Session Inactivity Timeout (Minutes)"
                  type="number"
                  value={form.sessionTimeoutMinutes}
                  onChange={(e) => setForm({ ...form, sessionTimeoutMinutes: e.target.value })}
                  helperText="Automatic logout on idle terminal"
                />
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-200 dark:border-amber-900/50 space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-amber-600" />
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Cross-Branch Data Isolation Guarantee
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  TenantGuard and ScopeGuard strictly enforce multi-branch access tokens. Staff assigned to a branch cannot query or modify clients, invoices, or inventory in another branch without explicit Regional or Organization Owner scopes.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t border-slate-100 dark:border-slate-800 pt-4">
              <Button
                variant="primary"
                size="sm"
                isLoading={isSaving}
                onClick={() => handleSave('Security Policies')}
              >
                Save Security Policies
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
