'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  UserCheck,
  Search,
  CheckCircle2,
  Clock,
  User,
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import {
  Button,
  Badge,
  Input,
  useToast,
} from '@hive/ui';

export default function FrontDeskCheckInPage() {
  const router = useRouter();
  const toast = useToast();

  const [searchPhone, setSearchPhone] = React.useState('');
  const [checkedInList, setCheckedInList] = React.useState([
    { id: 'ck-1', name: 'Rahul Verma', phone: '+91 98111 22334', service: 'Precision Cut', stylist: 'Rajesh Kumar', time: '14:55', status: 'WAITING_LOUNGE' },
    { id: 'ck-2', name: 'Dr. Sunita Rao', phone: '+91 99887 76655', service: 'Hydra-Facial', stylist: 'Ananya Roy', time: '15:10', status: 'IN_CONSULTATION' },
  ]);

  const handleInstantCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchPhone.trim()) return;

    const newRecord = {
      id: `ck-${Date.now()}`,
      name: 'Walk-in Guest',
      phone: searchPhone,
      service: 'General Consultation',
      stylist: 'Any Available Master Stylist',
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      status: 'WAITING_LOUNGE',
    };

    setCheckedInList([newRecord, ...checkedInList]);
    setSearchPhone('');
    toast.success(`Guest with phone ${searchPhone} checked into waiting lounge.`);
  };

  return (
    <div className="space-y-6 pb-12 font-sans select-none text-left">
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-sm">
            <UserCheck className="w-4 h-4" />
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Front Desk Fast Check-in Terminal</h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Instant physical arrival check-in for scheduled guests and walk-in arrivals.
        </p>
      </div>

      {/* Quick Check-in Bar */}
      <form onSubmit={handleInstantCheckIn} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
        <label className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
          ⚡ 1-Tap Guest Mobile Check-in
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
            placeholder="Enter arriving guest 10-digit mobile number..."
            className="flex-1 h-12 px-4 rounded-xl bg-slate-50 border-2 border-slate-200 text-sm text-slate-900 font-mono placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none transition-all"
            autoFocus
          />
          <Button type="submit" variant="primary" className="h-12 px-6 font-bold text-xs shadow-sm">
            Mark Arrived
          </Button>
        </div>
      </form>

      {/* Checked In Guests */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          Currently Arrived & Waiting Guests ({checkedInList.length})
        </span>

        <div className="space-y-2">
          {checkedInList.map((guest) => (
            <div
              key={guest.id}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-mono font-bold text-xs shadow-xs">
                  {guest.time}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{guest.name}</span>
                    <span className="text-xs text-slate-500 font-mono">{guest.phone}</span>
                    <Badge variant="success" className="text-[9px]">
                      {guest.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {guest.service} • Assigned to: <strong className="text-slate-800">{guest.stylist}</strong>
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  className="text-xs bg-emerald-600 hover:bg-emerald-500 shadow-xs"
                  onClick={() => toast.success(`Moved ${guest.name} to styling chair.`)}
                >
                  Seat at Station
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100 shadow-xs"
                  onClick={() => router.push('/front-desk/pos')}
                >
                  Open POS
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
