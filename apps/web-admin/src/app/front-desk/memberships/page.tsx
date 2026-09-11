'use client';

import * as React from 'react';
import { Award, Search, Sparkles, Check } from 'lucide-react';
import { Button, Badge, Input, useToast } from '@hive/ui';
import { formatCurrency } from '@hive/utilities';

export default function FrontDeskMembershipsPage() {
  const toast = useToast();

  const membershipTiers = [
    { name: 'Royal Diamond Club', discount: '20% Off All Services', price: 15000, validity: '12 Months', activeClients: 48 },
    { name: 'Platinum VIP Privilege', discount: '15% Off All Services', price: 9000, validity: '12 Months', activeClients: 84 },
    { name: 'Prepaid Gold Club', discount: '10% Off All Services', price: 5000, validity: '6 Months', activeClients: 142 },
  ];

  return (
    <div className="space-y-6 pb-12 font-sans select-none text-left">
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-sm">
            <Award className="w-4 h-4" />
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Active Membership Plans & Passes</h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Front-desk membership enrollment, privilege lookups, and VIP discount verifications.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {membershipTiers.map((m, idx) => (
          <div key={idx} className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">{m.name}</h3>
              <Badge variant="warning" className="text-[10px]">{m.validity}</Badge>
            </div>
            <div>
              <span className="text-2xl font-black text-amber-700 font-mono">{formatCurrency(m.price)}</span>
              <span className="text-xs text-emerald-700 block mt-1 font-semibold">✓ {m.discount}</span>
            </div>
            <p className="text-xs text-slate-500">Active Members in Branch: <strong className="text-slate-900 font-mono">{m.activeClients} guests</strong></p>
            <Button
              variant="primary"
              size="sm"
              className="w-full text-xs font-bold shadow-xs"
              onClick={() => toast.success(`Enrollment initialized for ${m.name}`)}
            >
              Enroll Guest in Plan
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
