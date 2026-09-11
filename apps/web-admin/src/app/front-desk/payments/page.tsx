'use client';

import * as React from 'react';
import { Wallet, CreditCard, Banknote, QrCode, Sliders } from 'lucide-react';
import { Badge } from '@hive/ui';
import { formatCurrency } from '@hive/utilities';

export default function FrontDeskPaymentsPage() {
  const paymentBreakdown = [
    { method: 'UPI BharatQR', amount: 32450.0, txns: 12, icon: QrCode, color: 'text-purple-400' },
    { method: 'Credit & Debit Cards', amount: 21800.0, txns: 8, icon: CreditCard, color: 'text-blue-400' },
    { method: 'Cash at Counter', amount: 9400.0, txns: 5, icon: Banknote, color: 'text-emerald-400' },
    { method: 'Prepaid Wallet Redemptions', amount: 4850.0, txns: 4, icon: Wallet, color: 'text-sky-400' },
  ];

  const totalCollected = paymentBreakdown.reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="space-y-6 pb-12 font-sans select-none text-left">
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-sm">
            <Wallet className="w-4 h-4" />
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Today&rsquo;s Register Collections</h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Settlement batches across UPI, EDC Card machine, Cash drawer, and Customer Wallets.
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-slate-500 block uppercase font-bold">Total Settled Collections Today</span>
          <span className="text-3xl font-black text-amber-700 font-mono mt-1 block">{formatCurrency(totalCollected)}</span>
        </div>
        <Badge variant="success" className="text-xs px-3 py-1 font-bold">
          Register Balanced • Shift Active
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {paymentBreakdown.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <Icon className={`w-5 h-5 ${p.color}`} />
                <span className="text-xs text-slate-500 font-mono">{p.txns} txns</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">{p.method}</span>
                <span className="text-lg font-black text-slate-900 font-mono mt-0.5 block">{formatCurrency(p.amount)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
