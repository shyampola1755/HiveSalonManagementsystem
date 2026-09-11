'use client';

import * as React from 'react';
import { Building2, MapPin, Phone, Mail, Plus } from 'lucide-react';
import { Button, Badge, useToast } from '@hive/ui';

export default function BackOfficeBranchesPage() {
  const toast = useToast();

  const branches = [
    { id: 'b1', name: 'Jubilee Hills Flagship', code: 'JH-01', state: 'Telangana', city: 'Hyderabad', address: 'Road No. 36, Jubilee Hills', phone: '+91 40 2355 9901', status: 'ACTIVE', chairs: 12 },
    { id: 'b2', name: 'Banjara Hills Spa & Lounge', code: 'BH-02', state: 'Telangana', city: 'Hyderabad', address: 'Road No. 12, Banjara Hills', phone: '+91 40 2335 8802', status: 'ACTIVE', chairs: 8 },
    { id: 'b3', name: 'Hitech City Express', code: 'HC-03', state: 'Telangana', city: 'Hyderabad', address: 'Cyber Towers Main Road', phone: '+91 40 4012 7703', status: 'ACTIVE', chairs: 6 },
    { id: 'b4', name: 'Indiranagar Sanctuary', code: 'IN-01', state: 'Karnataka', city: 'Bengaluru', address: '100ft Road, Indiranagar', phone: '+91 80 2521 6604', status: 'ACTIVE', chairs: 10 },
  ];

  return (
    <div className="space-y-6 pb-12 font-sans select-none text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-sky-500 text-slate-950 font-black text-xs flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">Branches Master Directory</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Physical salon units, geographical inheritance, phone lines, and operating capacity.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => toast.info('Add Branch form opened.')}
          leftIcon={<Plus className="w-4 h-4" />}
          className="text-xs font-bold"
        >
          Add Salon Branch
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {branches.map((b) => (
          <div key={b.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] text-amber-400 font-bold uppercase">{b.code}</span>
                <h3 className="text-base font-bold text-white">{b.name}</h3>
              </div>
              <Badge variant="success" className="text-[10px]">{b.status}</Badge>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs text-slate-300">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                <span>{b.address}, {b.city}, {b.state}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono">{b.phone}</span>
              </p>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
              <span className="text-slate-400">Total Workstations: <strong className="text-white font-mono">{b.chairs} Chairs</strong></span>
              <Button variant="outline" size="sm" className="text-xs">
                Configure Unit
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
