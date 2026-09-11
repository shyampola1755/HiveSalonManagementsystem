'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Users,
  CreditCard,
  UserCheck,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Receipt,
  Sparkles,
  Zap,
  Phone,
  UserPlus,
  Play,
  RotateCcw,
  Store,
  DollarSign,
  Layers,
  ChevronRight,
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
  Modal,
  Input,
} from '@hive/ui';
import { formatCurrency } from '@hive/utilities';

export default function FrontDeskDashboardPage() {
  const router = useRouter();
  const toast = useToast();

  // Quick Action Modal States
  const [isQuickApptOpen, setIsQuickApptOpen] = React.useState(false);
  const [isNewCustomerOpen, setIsNewCustomerOpen] = React.useState(false);
  const [isWalkinOpen, setIsWalkinOpen] = React.useState(false);

  // Live Today Appointments State
  const [appointments, setAppointments] = React.useState([
    {
      id: 'apt-1',
      time: '02:30 PM',
      client: 'Priya Sharma',
      phone: '+91 98765 43210',
      service: 'Artisan Balayage & Olaplex Glaze',
      stylist: 'Priya Sharma (Master Stylist)',
      chair: 'Station #01',
      status: 'IN_SERVICE' as const,
      price: 4000,
      badgeVariant: 'warning' as const,
    },
    {
      id: 'apt-2',
      time: '03:00 PM',
      client: 'Rahul Verma',
      phone: '+91 98111 22334',
      service: 'Executive Haircut & Beard Grooming',
      stylist: 'Rajesh Kumar (Senior Colorist)',
      chair: 'Station #03',
      status: 'ARRIVED' as const,
      price: 1200,
      badgeVariant: 'info' as const,
    },
    {
      id: 'apt-3',
      time: '03:45 PM',
      client: 'Dr. Sunita Rao',
      phone: '+91 99887 76655',
      service: 'Hydra-Facial Oxygen Luxe Glow',
      stylist: 'Ananya Roy (Principal Aesthetician)',
      chair: 'Spa Suite #02',
      status: 'CONFIRMED' as const,
      price: 3500,
      badgeVariant: 'success' as const,
    },
    {
      id: 'apt-4',
      time: '04:30 PM',
      client: 'Ananya Roy',
      phone: '+91 91234 56789',
      service: 'Brazilian Keratin Smoothing Complex',
      stylist: 'Vikram Malhotra (Senior Stylist)',
      chair: 'Station #02',
      status: 'CONFIRMED' as const,
      price: 5000,
      badgeVariant: 'success' as const,
    },
  ]);

  // Handle 1-Click Check In
  const handleCheckIn = (aptId: string, clientName: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === aptId ? { ...apt, status: 'ARRIVED', badgeVariant: 'info' } : apt))
    );
    toast.success(`${clientName} checked in. Assigned to waiting lounge.`);
  };

  // Handle 1-Click Start Service
  const handleStartService = (aptId: string, clientName: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === aptId ? { ...apt, status: 'IN_SERVICE', badgeVariant: 'warning' } : apt))
    );
    toast.info(`Service started for ${clientName}. Backbar recipe deducted.`);
  };

  return (
    <div className="space-y-6 pb-12 font-sans select-none text-left">
      {/* 1. Header & Receptionist Identity */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-sm">
              FD
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Front Desk Operations</h1>
            <Badge variant="warning" showDot>
              Jubilee Hills Flagship • Live Register
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time daily operations, appointments, queue check-ins, and high-speed POS billing.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/front-desk/pos')}
            leftIcon={<CreditCard className="w-4 h-4 text-amber-600" />}
            className="border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 text-xs font-bold shadow-xs"
          >
            Fast POS Terminal
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsQuickApptOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
            className="text-xs font-bold shadow-sm"
          >
            New Appointment
          </Button>
        </div>
      </div>

      {/* 2. Receptionist Zero-Training Quick Action Speed Dial */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50/80 via-white to-amber-50/40 border border-amber-200 shadow-xs">
        <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block mb-3">
          ⚡ 1-Click Front Desk Actions (Zero Training)
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          <button
            onClick={() => setIsQuickApptOpen(true)}
            className="p-3 rounded-xl bg-white hover:bg-amber-50/60 border border-slate-200 hover:border-amber-300 text-left transition-all group shadow-xs hover:shadow-md flex flex-col justify-between"
          >
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 group-hover:bg-amber-500 group-hover:text-slate-950 flex items-center justify-center mb-2 transition-colors">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold block text-slate-900">New Booking</span>
            <span className="text-[10px] text-slate-500">Schedule advance visit</span>
          </button>

          <button
            onClick={() => setIsNewCustomerOpen(true)}
            className="p-3 rounded-xl bg-white hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 text-left transition-all group shadow-xs hover:shadow-md flex flex-col justify-between"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 group-hover:bg-blue-500 group-hover:text-white flex items-center justify-center mb-2 transition-colors">
              <UserPlus className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold block text-slate-900">New Customer</span>
            <span className="text-[10px] text-slate-500">Register phone & profile</span>
          </button>

          <button
            onClick={() => setIsWalkinOpen(true)}
            className="p-3 rounded-xl bg-white hover:bg-purple-50/60 border border-slate-200 hover:border-purple-300 text-left transition-all group shadow-xs hover:shadow-md flex flex-col justify-between"
          >
            <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 group-hover:bg-purple-500 group-hover:text-white flex items-center justify-center mb-2 transition-colors">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold block text-slate-900">Walk-in Client</span>
            <span className="text-[10px] text-slate-500">Instant chair assignment</span>
          </button>

          <button
            onClick={() => router.push('/front-desk/pos')}
            className="p-3 rounded-xl bg-white hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 text-left transition-all group shadow-xs hover:shadow-md flex flex-col justify-between"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 group-hover:bg-emerald-500 group-hover:text-white flex items-center justify-center mb-2 transition-colors">
              <CreditCard className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold block text-slate-900">New Sale / Bill</span>
            <span className="text-[10px] text-slate-500">Touchscreen checkout</span>
          </button>

          <button
            onClick={() => router.push('/front-desk/checkin')}
            className="p-3 rounded-xl bg-white hover:bg-sky-50/60 border border-slate-200 hover:border-sky-300 text-left transition-all group shadow-xs hover:shadow-md flex flex-col justify-between"
          >
            <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 group-hover:bg-sky-500 group-hover:text-white flex items-center justify-center mb-2 transition-colors">
              <UserCheck className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold block text-slate-900">Check-in Guest</span>
            <span className="text-[10px] text-slate-500">Arrived waiting board</span>
          </button>
        </div>
      </div>

      {/* 3. Operational Performance Stats (6 Key Daily Operational Numbers) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Today's Appts</span>
          <span className="text-xl font-black text-slate-900 font-mono">24 Booked</span>
          <span className="text-[10px] text-emerald-600 block font-medium">18 Confirmed • 4 Live</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Waiting Lounge</span>
          <span className="text-xl font-black text-amber-600 font-mono">2 Waiting</span>
          <span className="text-[10px] text-slate-500 block font-medium">Avg wait: 4 mins</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Checked In</span>
          <span className="text-xl font-black text-sky-600 font-mono">6 Arrived</span>
          <span className="text-[10px] text-slate-500 block font-medium">Ready for stations</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Today's Sales</span>
          <span className="text-xl font-black text-amber-600 font-mono">₹68,500</span>
          <span className="text-[10px] text-emerald-600 block font-medium">85.6% of daily goal</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Payments Collected</span>
          <span className="text-xl font-black text-emerald-600 font-mono">₹63,650</span>
          <span className="text-[10px] text-slate-500 block font-medium">UPI, Card & Cash</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Pending Balance</span>
          <span className="text-xl font-black text-rose-600 font-mono">₹4,850</span>
          <span className="text-[10px] text-rose-600/90 block font-medium">3 open draft tabs</span>
        </div>
      </div>

      {/* 4. Live Today Appointments & Queue Board */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8-col: Live Appointment Schedule */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Today&rsquo;s Appointment Schedule & Chair Status</h3>
                <p className="text-[11px] text-slate-500">Jubilee Hills Flagship • Real-time operational board</p>
              </div>
              <Link href="/front-desk/calendar">
                <Button variant="outline" size="sm" className="text-xs border-slate-200 hover:bg-slate-50">
                  Full Day Calendar →
                </Button>
              </Link>
            </div>

            <div className="space-y-2.5">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/90 hover:border-slate-300 hover:bg-slate-100/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-16 h-12 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center text-center shrink-0 shadow-xs">
                      <Clock className="w-3.5 h-3.5 text-amber-500 mb-0.5" />
                      <span className="text-[11px] font-mono font-bold text-slate-900">{apt.time}</span>
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">{apt.client}</span>
                        <span className="text-[11px] text-slate-500 font-mono">({apt.phone})</span>
                        <Badge variant={apt.badgeVariant} className="text-[9px]">
                          {apt.status}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        {apt.service} • <strong className="text-slate-800">{apt.stylist}</strong> • <span className="text-amber-700 font-mono font-semibold">{apt.chair}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                    <span className="font-mono font-bold text-amber-700 text-xs">
                      {formatCurrency(apt.price)}
                    </span>

                    {apt.status === 'CONFIRMED' && (
                      <Button
                        variant="primary"
                        size="sm"
                        className="text-xs h-8 shadow-xs"
                        onClick={() => handleCheckIn(apt.id, apt.client)}
                      >
                        Check In
                      </Button>
                    )}

                    {apt.status === 'ARRIVED' && (
                      <Button
                        variant="primary"
                        size="sm"
                        className="text-xs h-8 bg-emerald-600 hover:bg-emerald-500 shadow-xs"
                        onClick={() => handleStartService(apt.id, apt.client)}
                      >
                        Start Service
                      </Button>
                    )}

                    {apt.status === 'IN_SERVICE' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-8 bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100 shadow-xs"
                        onClick={() => {
                          router.push('/front-desk/pos');
                          toast.info(`Opening POS bill for ${apt.client}`);
                        }}
                      >
                        Open Bill (POS)
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 4-col: Live Stylist Availability & Walk-in Queue */}
        <div className="lg:col-span-4 space-y-4">
          {/* Active Stylist Floor Status */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Stylist Station Occupancy</h3>
              <Badge variant="success">6 Active on Duty</Badge>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { name: 'Priya Sharma', chair: 'Station #01', status: 'IN_SERVICE', client: 'Priya S.' },
                { name: 'Rajesh Kumar', chair: 'Station #03', status: 'AVAILABLE', client: 'Free' },
                { name: 'Ananya Roy', chair: 'Spa Suite #02', status: 'PREPARING', client: 'Sunita R.' },
                { name: 'Vikram Malhotra', chair: 'Station #02', status: 'AVAILABLE', client: 'Free' },
                { name: 'Siddharth Sen', chair: 'Barber Chair', status: 'AVAILABLE', client: 'Free' },
                { name: 'Meera Nambiar', chair: 'Nail Lounge', status: 'IN_SERVICE', client: 'Kavita M.' },
              ].map((st, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-200 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-slate-900 block">{st.name}</span>
                    <span className="text-[10px] text-slate-500">{st.chair}</span>
                  </div>
                  <Badge
                    variant={st.status === 'AVAILABLE' ? 'success' : st.status === 'IN_SERVICE' ? 'warning' : 'info'}
                    className="text-[9px]"
                  >
                    {st.status === 'AVAILABLE' ? 'Available' : st.client}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick New Appointment Modal */}
      <Modal
        isOpen={isQuickApptOpen}
        onClose={() => setIsQuickApptOpen(false)}
        title="Schedule New Appointment"
        maxWidth="md"
      >
        <div className="space-y-4 text-left text-xs">
          <Input label="Customer Mobile / Name" placeholder="e.g. 9876543210" required />
          <Input label="Service Treatment" placeholder="e.g. Balayage, Keratin, Cut" required />
          <Input label="Preferred Stylist" placeholder="e.g. Priya Sharma" required />
          <Input label="Date & Time" type="datetime-local" defaultValue="2026-09-10T15:30" required />
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setIsQuickApptOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => {
                setIsQuickApptOpen(false);
                toast.success('Appointment scheduled successfully.');
              }}
            >
              Confirm Booking
            </Button>
          </div>
        </div>
      </Modal>

      {/* Quick New Customer Modal */}
      <Modal
        isOpen={isNewCustomerOpen}
        onClose={() => setIsNewCustomerOpen(false)}
        title="Register New Customer"
        maxWidth="md"
      >
        <div className="space-y-4 text-left text-xs">
          <Input label="Full Name" placeholder="e.g. Sarah Connor" required />
          <Input label="10-Digit Mobile Number" placeholder="e.g. 9876543210" required />
          <Input label="Email Address (Optional)" placeholder="e.g. guest@example.com" />
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setIsNewCustomerOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => {
                setIsNewCustomerOpen(false);
                toast.success('New customer profile created.');
              }}
            >
              Save Customer
            </Button>
          </div>
        </div>
      </Modal>

      {/* Quick Walkin Modal */}
      <Modal
        isOpen={isWalkinOpen}
        onClose={() => setIsWalkinOpen(false)}
        title="Instant Walk-in Arrival"
        maxWidth="md"
      >
        <div className="space-y-4 text-left text-xs">
          <Input label="Guest Name / Phone" placeholder="e.g. Walk-in Guest / 9811122334" required />
          <Input label="Requested Service" placeholder="e.g. Haircut & Wash" required />
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setIsWalkinOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => {
                setIsWalkinOpen(false);
                toast.success('Walk-in guest assigned to active queue.');
              }}
            >
              Assign to Chair
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
