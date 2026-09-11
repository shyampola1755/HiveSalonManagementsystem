'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Clock,
  User,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  UserCheck,
  ChevronRight,
} from 'lucide-react';
import {
  Button,
  Badge,
  Input,
  Modal,
  useToast,
} from '@hive/ui';
import { formatCurrency } from '@hive/utilities';

export default function FrontDeskAppointmentsPage() {
  const router = useRouter();
  const toast = useToast();

  const [filterStatus, setFilterStatus] = React.useState('ALL');
  const [isNewApptModalOpen, setIsNewApptModalOpen] = React.useState(false);

  const [appointments, setAppointments] = React.useState([
    {
      id: 'apt-1',
      time: '10:00 AM',
      client: 'Priya Sharma',
      phone: '+91 98765 43210',
      service: 'Artisan Balayage & Olaplex',
      stylist: 'Priya Sharma',
      chair: 'Station #01',
      status: 'IN_SERVICE',
      price: 4000,
    },
    {
      id: 'apt-2',
      time: '11:30 AM',
      client: 'Rahul Verma',
      phone: '+91 98111 22334',
      service: 'Executive Precision Haircut',
      stylist: 'Rajesh Kumar',
      chair: 'Station #03',
      status: 'ARRIVED',
      price: 1200,
    },
    {
      id: 'apt-3',
      time: '01:00 PM',
      client: 'Dr. Sunita Rao',
      phone: '+91 99887 76655',
      service: 'Hydra-Facial Oxygen Glow',
      stylist: 'Ananya Roy',
      chair: 'Spa Suite #02',
      status: 'CONFIRMED',
      price: 3500,
    },
    {
      id: 'apt-4',
      time: '02:30 PM',
      client: 'Kavita Menon',
      phone: '+91 97000 11223',
      service: 'Keratin Smoothing Complex',
      stylist: 'Vikram Malhotra',
      chair: 'Station #02',
      status: 'CONFIRMED',
      price: 5000,
    },
  ]);

  const filtered = appointments.filter(
    (a) => filterStatus === 'ALL' || a.status === filterStatus
  );

  return (
    <div className="space-y-6 pb-12 font-sans select-none text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-sm">
              <Calendar className="w-4 h-4" />
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Today&rsquo;s Appointment Diary</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time appointment schedule, physical chair occupancies, and check-in flow.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsNewApptModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
          className="text-xs font-bold shadow-sm"
        >
          Book Appointment
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {['ALL', 'CONFIRMED', 'ARRIVED', 'IN_SERVICE'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStatus === status
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-xs'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Appointment Cards */}
      <div className="space-y-3">
        {filtered.map((apt) => (
          <div
            key={apt.id}
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-colors shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-20 h-14 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center shadow-xs">
                <Clock className="w-4 h-4 text-amber-500 mb-0.5" />
                <span className="text-xs font-mono font-bold text-slate-900">{apt.time}</span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">{apt.client}</span>
                  <span className="text-xs text-slate-500 font-mono">({apt.phone})</span>
                  <Badge
                    variant={apt.status === 'CONFIRMED' ? 'success' : apt.status === 'ARRIVED' ? 'info' : 'warning'}
                    className="text-[9px]"
                  >
                    {apt.status}
                  </Badge>
                </div>
                <p className="text-xs text-slate-600">
                  {apt.service} • Stylist: <strong className="text-slate-800">{apt.stylist}</strong> • Location: <span className="text-amber-700 font-mono font-semibold">{apt.chair}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-200">
              <span className="font-mono font-bold text-amber-700 text-sm">
                {formatCurrency(apt.price)}
              </span>

              {apt.status === 'CONFIRMED' && (
                <Button
                  variant="primary"
                  size="sm"
                  className="text-xs shadow-xs"
                  onClick={() => {
                    setAppointments((prev) =>
                      prev.map((a) => (a.id === apt.id ? { ...a, status: 'ARRIVED' } : a))
                    );
                    toast.success(`${apt.client} checked in.`);
                  }}
                >
                  Check In
                </Button>
              )}

              {apt.status === 'ARRIVED' && (
                <Button
                  variant="primary"
                  size="sm"
                  className="text-xs bg-emerald-600 hover:bg-emerald-500 shadow-xs"
                  onClick={() => {
                    setAppointments((prev) =>
                      prev.map((a) => (a.id === apt.id ? { ...a, status: 'IN_SERVICE' } : a))
                    );
                    toast.info(`Service started for ${apt.client}`);
                  }}
                >
                  Start Service
                </Button>
              )}

              {apt.status === 'IN_SERVICE' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100 shadow-xs"
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

      {/* New Appointment Modal */}
      <Modal
        isOpen={isNewApptModalOpen}
        onClose={() => setIsNewApptModalOpen(false)}
        title="Schedule Salon Appointment"
        maxWidth="md"
      >
        <div className="space-y-4 text-left text-xs">
          <Input label="Customer Mobile Phone" placeholder="9876543210" required />
          <Input label="Treatment / Service" placeholder="e.g. Balayage & Haircut" required />
          <Input label="Stylist" placeholder="e.g. Priya Sharma" required />
          <Input label="Time Slot" type="datetime-local" defaultValue="2026-09-10T16:00" required />
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setIsNewApptModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => {
                setIsNewApptModalOpen(false);
                toast.success('Appointment booked successfully.');
              }}
            >
              Confirm Appointment
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
