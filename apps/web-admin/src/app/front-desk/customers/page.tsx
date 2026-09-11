'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Users,
  Phone,
  Calendar,
  CreditCard,
  UserCheck,
  Award,
  Wallet,
  Sparkles,
  Plus,
  Clock,
  ArrowRight,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import {
  Button,
  Badge,
  Input,
  Modal,
  useToast,
} from '@hive/ui';
import { formatCurrency } from '@hive/utilities';

const sampleCustomers = [
  {
    id: 'c1',
    fullName: 'Priya Sharma',
    phone: '+91 98765 43210',
    email: 'priya.sharma@example.com',
    membershipTier: 'Royal Diamond Club (20% Off)',
    walletBalance: 4200.0,
    loyaltyPoints: 850,
    lastVisit: 'Sep 2, 2026 (8 days ago)',
    nextAppointment: 'Today @ 03:30 PM (Balayage & Olaplex)',
    preferredStylist: 'Priya Sharma',
    totalVisits: 14,
    tags: ['VIP', 'Diamond', 'Hair Color'],
  },
  {
    id: 'c2',
    fullName: 'Rahul Verma',
    phone: '+91 98111 22334',
    email: 'rahul.verma@example.com',
    membershipTier: 'Prepaid Privilege (10% Off)',
    walletBalance: 12500.0,
    loyaltyPoints: 420,
    lastVisit: 'Aug 28, 2026 (13 days ago)',
    nextAppointment: 'Today @ 03:00 PM (Precision Cut)',
    preferredStylist: 'Rajesh Kumar',
    totalVisits: 8,
    tags: ['Frequent', 'Grooming'],
  },
  {
    id: 'c3',
    fullName: 'Dr. Sunita Rao',
    phone: '+91 99887 76655',
    email: 'sunita.rao@example.com',
    membershipTier: 'Platinum VIP (15% Off)',
    walletBalance: 6800.0,
    loyaltyPoints: 1240,
    lastVisit: 'Jul 14, 2026 (58 days ago)',
    nextAppointment: 'Today @ 03:45 PM (Hydra-Facial)',
    preferredStylist: 'Ananya Roy',
    totalVisits: 22,
    tags: ['VIP', 'Skin Care', 'High Spender'],
  },
  {
    id: 'c4',
    fullName: 'Ananya Roy',
    phone: '+91 91234 56789',
    email: 'ananya.roy@example.com',
    membershipTier: 'Standard Guest',
    walletBalance: 500.0,
    loyaltyPoints: 150,
    lastVisit: 'Sep 5, 2026 (5 days ago)',
    nextAppointment: 'Today @ 04:30 PM (Keratin Treatment)',
    preferredStylist: 'Vikram Malhotra',
    totalVisits: 3,
    tags: ['New Client'],
  },
];

export default function FrontDeskCustomersPage() {
  const router = useRouter();
  const toast = useToast();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCustomer, setSelectedCustomer] = React.useState<any>(sampleCustomers[0]);
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = React.useState(false);

  const filteredCustomers = sampleCustomers.filter(
    (c) =>
      !searchQuery ||
      c.phone.replace(/\D/g, '').includes(searchQuery.replace(/\D/g, '')) ||
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 font-sans select-none text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-sm">
              <Users className="w-4 h-4" />
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Guest Lookup & Fast Actions</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Search guests by 10-digit mobile number for instant profile lookup and 1-click booking or sales.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsNewCustomerModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
          className="text-xs font-bold shadow-sm"
        >
          New Customer Profile
        </Button>
      </div>

      {/* Fast Mobile Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
        <label className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
          ⚡ 10-Digit Mobile Fast Lookup
        </label>
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type guest mobile number (e.g. 9876543210) or name..."
            className="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-50 border-2 border-slate-200 text-sm text-slate-900 font-mono placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none transition-all"
            autoFocus
          />
        </div>
      </div>

      {/* 2-Column Search Results & Customer Profile Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5-col: Matching Guests List */}
        <div className="lg:col-span-5 space-y-2.5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Matching Guest Records ({filteredCustomers.length})
          </span>

          <div className="space-y-2">
            {filteredCustomers.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCustomer(c)}
                className={`w-full p-3.5 rounded-2xl border text-left transition-all ${
                  selectedCustomer?.id === c.id
                    ? 'border-amber-500 bg-amber-50 shadow-sm'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">{c.fullName}</span>
                  <Badge variant="warning" className="text-[9px]">
                    {c.membershipTier.split('(')[0]}
                  </Badge>
                </div>
                <div className="flex items-center justify-between mt-1 text-xs font-mono text-slate-500">
                  <span>{c.phone}</span>
                  <span className="text-emerald-700 font-bold">{formatCurrency(c.walletBalance)}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right 7-col: Active Guest Profile Card with 4 Primary Actions */}
        {selectedCustomer && (
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md space-y-5">
              {/* Profile Top Details */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900">{selectedCustomer.fullName}</h2>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 font-mono">
                    <Phone className="w-3.5 h-3.5 text-amber-500" />
                    <span>{selectedCustomer.phone}</span>
                    <span>•</span>
                    <span>{selectedCustomer.email}</span>
                  </div>
                </div>

                <Badge variant="warning" className="text-xs px-2.5 py-1 font-bold">
                  {selectedCustomer.membershipTier}
                </Badge>
              </div>

              {/* Operational Vitals Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 text-[10px] block uppercase">Prepaid Wallet</span>
                  <span className="text-base font-black text-emerald-700 font-mono">
                    {formatCurrency(selectedCustomer.walletBalance)}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 text-[10px] block uppercase">Loyalty Points</span>
                  <span className="text-base font-black text-amber-700 font-mono">
                    {selectedCustomer.loyaltyPoints} Pts
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 text-[10px] block uppercase">Total Visits</span>
                  <span className="text-base font-black text-slate-900 font-mono">
                    {selectedCustomer.totalVisits} Visits
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 text-[10px] block uppercase">Preferred Stylist</span>
                  <span className="text-xs font-bold text-slate-800 block truncate">
                    {selectedCustomer.preferredStylist}
                  </span>
                </div>
              </div>

              {/* Last Visit & Next Appointment */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-700">
                  <span className="text-slate-500">Last Salon Visit:</span>
                  <span className="font-semibold text-slate-900">{selectedCustomer.lastVisit}</span>
                </div>
                <div className="flex justify-between items-center text-slate-700 pt-1 border-t border-slate-200">
                  <span className="text-slate-500">Next Scheduled Appointment:</span>
                  <span className="font-bold text-amber-700">{selectedCustomer.nextAppointment}</span>
                </div>
              </div>

              {/* The 4 Front Desk Primary Action Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  className="h-10 text-xs font-bold shadow-xs"
                  onClick={() => {
                    router.push('/front-desk/appointments');
                    toast.success(`Booking appointment for ${selectedCustomer.fullName}`);
                  }}
                >
                  Book Appointment
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 text-xs font-bold bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100 shadow-xs"
                  onClick={() => {
                    router.push('/front-desk/pos');
                    toast.info(`Opening POS register for ${selectedCustomer.fullName}`);
                  }}
                >
                  Start Sale (POS)
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 text-xs font-bold bg-sky-50 border-sky-200 text-sky-900 hover:bg-sky-100 shadow-xs"
                  onClick={() => {
                    router.push('/front-desk/checkin');
                    toast.success(`${selectedCustomer.fullName} checked into live waiting queue.`);
                  }}
                >
                  Check-in Guest
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 text-xs font-bold border-slate-200 hover:bg-slate-50 shadow-xs"
                  onClick={() => toast.info(`Viewing 360° history for ${selectedCustomer.fullName}`)}
                >
                  View 360° History
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New Customer Registration Modal */}
      <Modal
        isOpen={isNewCustomerModalOpen}
        onClose={() => setIsNewCustomerModalOpen(false)}
        title="Register New Salon Guest"
        maxWidth="md"
      >
        <div className="space-y-4 text-left text-xs">
          <Input label="Full Name" placeholder="e.g. Neha Singhania" required />
          <Input label="10-Digit Mobile Phone" placeholder="e.g. 9876543210" required />
          <Input label="Email Address" placeholder="e.g. neha@example.com" />
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setIsNewCustomerModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => {
                setIsNewCustomerModalOpen(false);
                toast.success('New client registered and ready for booking.');
              }}
            >
              Create Profile
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
