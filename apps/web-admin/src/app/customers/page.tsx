'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  PageHeader,
  DataTable,
  Search,
  Button,
  Badge,
  Modal,
  Input,
  Select,
  Tabs,
  useToast,
  type ColumnDef,
} from '@hive/ui';
import {
  Plus,
  Users,
  Eye,
  Trash2,
  Phone,
  Sparkles,
  Award,
  Wallet,
  Calendar,
  Filter,
  CheckCircle2,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { formatCurrency } from '@hive/utilities';
import type { CustomerSegment, CustomerTag } from '@hive/types';

interface CustomerListItem {
  id: string;
  fullName: string;
  phone: string;
  email?: string | null;
  tags: CustomerTag[] | string[];
  loyaltyPoints: number;
  walletBalance: number;
  totalSpent: number;
  totalVisits: number;
  lastVisitAt?: string | null;
  nextAppointmentAt?: string | null;
  preferredBranchName?: string;
  preferredStylistName?: string;
  membershipStatus?: 'NONE' | 'ACTIVE' | 'EXPIRED';
  activeMembershipTier?: string | null;
  customerSource?: string;
}

const initialCustomerList: CustomerListItem[] = [
  {
    id: 'c1',
    fullName: 'Priya Sharma',
    phone: '+91 98765 43210',
    email: 'priya.sharma@example.com',
    tags: ['VIP', 'Returning', 'High Value'],
    loyaltyPoints: 850,
    walletBalance: 4200.0,
    totalSpent: 48500.0,
    totalVisits: 14,
    lastVisitAt: '2026-09-02',
    nextAppointmentAt: '2026-09-12 02:30 PM',
    preferredBranchName: 'Jubilee Hills Flagship',
    preferredStylistName: 'Ananya Reddy',
    membershipStatus: 'ACTIVE',
    activeMembershipTier: 'Diamond Elite',
    customerSource: 'INSTAGRAM',
  },
  {
    id: 'c2',
    fullName: 'Vikram Mehta',
    phone: '+91 98111 22334',
    email: 'vikram.mehta@example.com',
    tags: ['Returning', 'Corporate'],
    loyaltyPoints: 340,
    walletBalance: 1500.0,
    totalSpent: 16400.0,
    totalVisits: 9,
    lastVisitAt: '2026-08-28',
    nextAppointmentAt: null,
    preferredBranchName: 'Jubilee Hills Flagship',
    preferredStylistName: 'Rahul Varma',
    membershipStatus: 'ACTIVE',
    activeMembershipTier: 'Gold Care',
    customerSource: 'WALK_IN',
  },
  {
    id: 'c3',
    fullName: 'Sneha Kapoor',
    phone: '+91 97000 88991',
    email: 'sneha.kapoor@example.com',
    tags: ['New', 'VIP'],
    loyaltyPoints: 120,
    walletBalance: 0.0,
    totalSpent: 3800.0,
    totalVisits: 1,
    lastVisitAt: '2026-09-05',
    nextAppointmentAt: '2026-09-14 11:00 AM',
    preferredBranchName: 'Jubilee Hills Flagship',
    preferredStylistName: 'Kavita Nair',
    membershipStatus: 'NONE',
    customerSource: 'REFERRAL',
  },
  {
    id: 'c4',
    fullName: 'Rohan Gupta',
    phone: '+91 99887 76655',
    email: 'rohan.gupta@example.com',
    tags: ['Returning'],
    loyaltyPoints: 210,
    walletBalance: 800.0,
    totalSpent: 11200.0,
    totalVisits: 6,
    lastVisitAt: '2026-08-10',
    nextAppointmentAt: null,
    preferredBranchName: 'Jubilee Hills Flagship',
    preferredStylistName: 'Meera Sen',
    membershipStatus: 'NONE',
    customerSource: 'GOOGLE',
  },
  {
    id: 'c5',
    fullName: 'Ananya Deshmukh',
    phone: '+91 98222 33445',
    email: 'ananya.d@example.com',
    tags: ['New'],
    loyaltyPoints: 50,
    walletBalance: 0.0,
    totalSpent: 1800.0,
    totalVisits: 1,
    lastVisitAt: '2026-09-08',
    nextAppointmentAt: null,
    preferredBranchName: 'Banjara Hills Spa',
    preferredStylistName: 'Sophia Miller',
    membershipStatus: 'NONE',
    customerSource: 'WALK_IN',
  },
  {
    id: 'c6',
    fullName: 'Kavita Chawla',
    phone: '+91 99000 11223',
    email: 'kavita.c@example.com',
    tags: ['Inactive', 'Membership'],
    loyaltyPoints: 520,
    walletBalance: 2100.0,
    totalSpent: 31000.0,
    totalVisits: 11,
    lastVisitAt: '2026-06-15',
    nextAppointmentAt: null,
    preferredBranchName: 'Jubilee Hills Flagship',
    preferredStylistName: 'Ananya Reddy',
    membershipStatus: 'ACTIVE',
    activeMembershipTier: 'Platinum Club',
    customerSource: 'REFERRAL',
  },
];

export default function CustomersPage() {
  const router = useRouter();
  const toast = useToast();
  const [customers, setCustomers] = React.useState<CustomerListItem[]>(initialCustomerList);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeSegment, setActiveSegment] = React.useState<CustomerSegment>('all');
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  // Auto-open modal on quick action
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('action') === 'new-customer') {
        setIsAddModalOpen(true);
      }

      const handleQuickAction = (e: Event) => {
        const customEvent = e as CustomEvent;
        if (customEvent.detail?.id === 'act-new-customer') {
          setIsAddModalOpen(true);
        }
      };
      window.addEventListener('hive:quick-action', handleQuickAction);
      return () => window.removeEventListener('hive:quick-action', handleQuickAction);
    }
  }, []);

  // Add Customer Form State
  const [newCustomer, setNewCustomer] = React.useState({
    fullName: '',
    phone: '',
    email: '',
    gender: 'FEMALE',
    birthDate: '',
    address: '',
    preferredBranchId: 'b1',
    preferredStylistId: 's1',
    customerSource: 'WALK_IN',
    referredByCustomerId: '',
    tags: 'New',
    notes: '',
  });

  const handleAddCustomer = () => {
    if (!newCustomer.fullName || !newCustomer.phone) {
      toast.error('Validation Error', 'Customer Full Name and 10-digit Mobile Number are required.');
      return;
    }
    const cleanPhone = newCustomer.phone.startsWith('+91')
      ? newCustomer.phone
      : `+91 ${newCustomer.phone.trim()}`;

    const created: CustomerListItem = {
      id: `c_${Date.now()}`,
      fullName: newCustomer.fullName,
      phone: cleanPhone,
      email: newCustomer.email || null,
      tags: newCustomer.tags ? [newCustomer.tags as CustomerTag] : ['New'],
      loyaltyPoints: 50,
      walletBalance: 0.0,
      totalSpent: 0.0,
      totalVisits: 0,
      lastVisitAt: null,
      nextAppointmentAt: null,
      preferredBranchName: 'Jubilee Hills Flagship',
      preferredStylistName: 'Ananya Reddy',
      membershipStatus: 'NONE',
      customerSource: newCustomer.customerSource,
    };

    setCustomers([created, ...customers]);
    setIsAddModalOpen(false);
    setNewCustomer({
      fullName: '',
      phone: '',
      email: '',
      gender: 'FEMALE',
      birthDate: '',
      address: '',
      preferredBranchId: 'b1',
      preferredStylistId: 's1',
      customerSource: 'WALK_IN',
      referredByCustomerId: '',
      tags: 'New',
      notes: '',
    });
    toast.success(
      'Client Created Successfully',
      `${created.fullName} (${created.phone}) registered with 50 welcome loyalty points.`
    );
  };

  const getTagBadgeVariant = (tag: string) => {
    switch (tag) {
      case 'VIP':
        return 'warning' as const;
      case 'New':
        return 'info' as const;
      case 'Returning':
        return 'success' as const;
      case 'High Value':
        return 'default' as const;
      case 'Inactive':
        return 'secondary' as const;
      case 'Membership':
        return 'default' as const;
      default:
        return 'outline' as const;
    }
  };

  const segmentTabs = [
    { id: 'all', label: 'All Clients', count: customers.length },
    { id: 'new', label: 'New Clients', count: customers.filter((c) => c.totalVisits <= 1).length },
    { id: 'returning', label: 'Returning', count: customers.filter((c) => c.totalVisits > 1).length },
    { id: 'vip', label: 'VIP Guests', count: customers.filter((c) => c.tags.includes('VIP')).length },
    {
      id: 'high_spender',
      label: 'High Spenders (> ₹25k)',
      count: customers.filter((c) => c.totalSpent >= 25000).length,
    },
    {
      id: 'frequent',
      label: 'Frequent (> 5 Visits)',
      count: customers.filter((c) => c.totalVisits >= 5).length,
    },
    {
      id: 'membership',
      label: 'Memberships',
      count: customers.filter((c) => c.membershipStatus === 'ACTIVE').length,
    },
    {
      id: 'inactive',
      label: 'Inactive (> 60 Days)',
      count: customers.filter((c) => c.tags.includes('Inactive')).length,
    },
  ];

  // Filtering Logic
  const filteredCustomers = customers.filter((c) => {
    // 1. Segment filter
    if (activeSegment === 'new' && c.totalVisits > 1) return false;
    if (activeSegment === 'returning' && c.totalVisits <= 1) return false;
    if (activeSegment === 'vip' && !c.tags.includes('VIP')) return false;
    if (activeSegment === 'high_spender' && c.totalSpent < 25000) return false;
    if (activeSegment === 'frequent' && c.totalVisits < 5) return false;
    if (activeSegment === 'membership' && c.membershipStatus !== 'ACTIVE') return false;
    if (activeSegment === 'inactive' && !c.tags.includes('Inactive')) return false;

    // 2. Search query filter (Mobile primary, Name, Email, Membership)
    if (!searchQuery) return true;
    const clean = searchQuery.toLowerCase().trim();
    const cleanNum = clean.replace(/\D/g, '');

    if (cleanNum.length >= 3 && c.phone.replace(/\D/g, '').includes(cleanNum)) {
      return true;
    }
    if (c.fullName.toLowerCase().includes(clean)) return true;
    if (c.email && c.email.toLowerCase().includes(clean)) return true;
    if (c.activeMembershipTier && c.activeMembershipTier.toLowerCase().includes(clean)) return true;

    return false;
  });

  const columns: ColumnDef<CustomerListItem>[] = [
    {
      key: 'fullName',
      header: 'Customer Profile',
      cell: (row) => (
        <div
          className="cursor-pointer group flex flex-col text-left py-0.5"
          onClick={() => router.push(`/customers/${row.id}`)}
        >
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-slate-900 dark:text-slate-100 group-hover:text-amber-600 transition-colors">
              {row.fullName}
            </span>
            {row.activeMembershipTier && (
              <span className="rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-1.5 py-0.2 text-[9px] font-bold">
                {row.activeMembershipTier}
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
            <Phone className="h-3 w-3 text-slate-400" />
            {row.phone}
          </span>
        </div>
      ),
    },
    {
      key: 'tags',
      header: 'Tags & Badges',
      cell: (row) => (
        <div className="flex flex-wrap items-center gap-1">
          {row.tags.map((tag, idx) => (
            <Badge key={idx} variant={getTagBadgeVariant(tag)} className="text-[10px] py-0">
              {tag}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: 'totalSpent',
      header: 'Lifetime Spend',
      cell: (row) => (
        <div className="flex flex-col text-left">
          <span className="font-bold text-xs tabular-nums text-slate-900 dark:text-slate-100">
            {formatCurrency(row.totalSpent)}
          </span>
          <span className="text-[10px] text-slate-400">
            {row.totalVisits} {row.totalVisits === 1 ? 'visit' : 'visits'}
          </span>
        </div>
      ),
    },
    {
      key: 'walletBalance',
      header: 'Wallet & Loyalty',
      cell: (row) => (
        <div className="flex flex-col text-left">
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums flex items-center gap-1">
            <Wallet className="h-3 w-3" />
            {formatCurrency(row.walletBalance)}
          </span>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
            {row.loyaltyPoints} loyalty pts
          </span>
        </div>
      ),
    },
    {
      key: 'lastVisitAt',
      header: 'Visit History',
      cell: (row) => (
        <div className="flex flex-col text-left text-xs">
          <span className="text-slate-700 dark:text-slate-300 text-[11px]">
            Last: {row.lastVisitAt ? new Date(row.lastVisitAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Never'}
          </span>
          {row.nextAppointmentAt ? (
            <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-0.5">
              <Calendar className="h-2.5 w-2.5" /> Next: {row.nextAppointmentAt}
            </span>
          ) : (
            <span className="text-[10px] text-slate-400">No upcoming booking</span>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Link href={`/customers/${row.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2.5 text-xs text-amber-700 border-amber-300 dark:border-amber-800 hover:bg-amber-50"
              leftIcon={<Eye className="h-3.5 w-3.5" />}
            >
              360° Profile
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600"
            onClick={() => {
              setCustomers(customers.filter((c) => c.id !== row.id));
              toast.warning(`Deleted customer profile for ${row.fullName}`);
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-16 text-left">
      {/* 1. WHERE AM I? */}
      <PageHeader
        title="Customer CRM & Client 360°"
        description="Search clients by 10-digit mobile number, manage beauty profiles, color formulas, patch test compliance, prepaid wallets, and loyalty tiers."
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Customer Directory', isCurrent: true },
        ]}
        badge={
          <Badge variant="default" showDot>
            Multi-Branch CRM
          </Badge>
        }
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            New Customer
          </Button>
        }
      />

      {/* 2. FAST SEARCH & SEGMENT TABS */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-96">
            <Search
              placeholder="Search by Mobile (e.g. 98765...), Name, Email, Membership..."
              value={searchQuery}
              onChange={setSearchQuery}
              className="w-full"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0 text-xs text-slate-500 font-medium">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <span>
              Showing <strong className="text-slate-900 dark:text-white">{filteredCustomers.length}</strong> of{' '}
              {customers.length} clients
            </span>
          </div>
        </div>

        {/* Customer Segments Navigation */}
        <Tabs
          tabs={segmentTabs}
          activeTab={activeSegment}
          onChange={(tab) => setActiveSegment(tab as CustomerSegment)}
          variant="pills"
          className="overflow-x-auto pb-1"
        />
      </div>

      {/* 3. CUSTOMER DATA TABLE */}
      <DataTable
        columns={columns}
        data={filteredCustomers}
        emptyTitle="No matching customers found"
        emptyDescription={
          searchQuery
            ? `No customer record found matching "${searchQuery}". Click below to quickly create a new profile.`
            : 'No clients found in this segment.'
        }
        emptyActionLabel="Create New Customer"
        onEmptyAction={() => setIsAddModalOpen(true)}
      />

      {/* 4. COMPREHENSIVE ADD CUSTOMER MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Customer Profile"
        description="Capture contact details, branch preference, and initial preferences."
        maxWidth="lg"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddCustomer}>
              Create Customer Profile
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              placeholder="e.g. Priya Sharma"
              value={newCustomer.fullName}
              onChange={(e) => setNewCustomer({ ...newCustomer, fullName: e.target.value })}
              required
            />
            <Input
              label="10-Digit Mobile Number"
              placeholder="e.g. 98765 43210"
              value={newCustomer.phone}
              onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
              helperText="Primary identifier for booking and checkout lookup"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="priya.sharma@example.com"
              value={newCustomer.email}
              onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
            />
            <Select
              label="Gender"
              value={newCustomer.gender}
              onChange={(e) => setNewCustomer({ ...newCustomer, gender: e.target.value })}
              options={[
                { label: 'Female', value: 'FEMALE' },
                { label: 'Male', value: 'MALE' },
                { label: 'Other', value: 'OTHER' },
                { label: 'Unspecified', value: 'UNSPECIFIED' },
              ]}
            />
            <Input
              label="Date of Birth"
              type="date"
              value={newCustomer.birthDate}
              onChange={(e) => setNewCustomer({ ...newCustomer, birthDate: e.target.value })}
              helperText="For birthday privilege alerts"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Preferred Branch"
              value={newCustomer.preferredBranchId}
              onChange={(e) => setNewCustomer({ ...newCustomer, preferredBranchId: e.target.value })}
              options={[
                { label: 'Jubilee Hills Flagship (JH-01)', value: 'b1' },
                { label: 'Banjara Hills Spa & Lounge (BH-02)', value: 'b2' },
                { label: 'Hitech City Express (HC-03)', value: 'b3' },
              ]}
            />
            <Select
              label="Customer Acquisition Source"
              value={newCustomer.customerSource}
              onChange={(e) => setNewCustomer({ ...newCustomer, customerSource: e.target.value })}
              options={[
                { label: 'Walk-In Guest', value: 'WALK_IN' },
                { label: 'Instagram / Social Media', value: 'INSTAGRAM' },
                { label: 'Google Search & Maps', value: 'GOOGLE' },
                { label: 'Friend / Client Referral', value: 'REFERRAL' },
                { label: 'Website Online Booking', value: 'WEBSITE' },
              ]}
            />
            <Select
              label="Initial Tag"
              value={newCustomer.tags}
              onChange={(e) => setNewCustomer({ ...newCustomer, tags: e.target.value })}
              options={[
                { label: 'New Client', value: 'New' },
                { label: 'VIP Guest', value: 'VIP' },
                { label: 'Corporate Partner', value: 'Corporate' },
              ]}
            />
          </div>

          <Input
            label="Street Address / Locality"
            placeholder="e.g. Plot 42, Road No. 36, Jubilee Hills"
            value={newCustomer.address}
            onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
          />

          <Input
            label="Initial Notes & Service Preferences"
            placeholder="e.g. Sensitive scalp, prefers herbal shampoos, quiet sessions..."
            value={newCustomer.notes}
            onChange={(e) => setNewCustomer({ ...newCustomer, notes: e.target.value })}
          />
        </div>
      </Modal>
    </div>
  );
}
