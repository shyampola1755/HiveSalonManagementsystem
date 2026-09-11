'use client';

import * as React from 'react';
import { Layers, Plus, CheckCircle2, User } from 'lucide-react';
import { Button, Badge, useToast } from '@hive/ui';
import { formatCurrency } from '@hive/utilities';

export default function FrontDeskPackagesPage() {
  const toast = useToast();

  const packages = [
    { name: 'Bridal Glow & Pre-Wedding Rituals', sessions: '8 Custom Sessions', price: 28000, activeSold: 12 },
    { name: 'Keratin & Scalp Rejuvenation Bundle', sessions: '4 Sessions (1/quarter)', price: 14000, activeSold: 28 },
    { name: 'Executive Men’s Grooming Pass', sessions: '10 Precision Cuts & Beard', price: 9500, activeSold: 45 },
  ];

  return (
    <div className="space-y-6 pb-12 font-sans select-none text-left">
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-sm">
            <Layers className="w-4 h-4" />
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Service Packages & Bundles</h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Multi-session bundled treatment packages and remaining session redemptions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {packages.map((pkg, idx) => (
          <div key={idx} className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-slate-900">{pkg.name}</h3>
              <span className="text-xs text-amber-700 font-semibold mt-0.5 block">{pkg.sessions}</span>
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900 font-mono">{formatCurrency(pkg.price)}</span>
              <span className="text-xs text-slate-500 block mt-1">Active Sold in Branch: <strong className="text-emerald-700 font-mono">{pkg.activeSold}</strong></span>
            </div>
            <Button
              variant="primary"
              size="sm"
              className="w-full text-xs font-bold shadow-xs"
              onClick={() => toast.success(`Selling package: ${pkg.name}`)}
            >
              Sell Package to Guest
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
