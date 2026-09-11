'use client';

import * as React from 'react';
import { Sparkles, Award, Users, CheckCircle2 } from 'lucide-react';
import { Badge } from '@hive/ui';

export default function FrontDeskLoyaltyPage() {
  const loyaltyTiers = [
    { tier: 'Diamond VIP', rate: '2.0x Points / ₹100', multiplier: '₹1.00 / Point POS Discount', minSpend: '₹50,000+' },
    { tier: 'Gold Prestige', rate: '1.5x Points / ₹100', multiplier: '₹1.00 / Point POS Discount', minSpend: '₹25,000+' },
    { tier: 'Silver Member', rate: '1.0x Points / ₹100', multiplier: '₹1.00 / Point POS Discount', minSpend: '₹10,000+' },
    { tier: 'Bronze Starter', rate: '0.5x Points / ₹100', multiplier: '₹1.00 / Point POS Discount', minSpend: '₹0+' },
  ];

  return (
    <div className="space-y-6 pb-12 font-sans select-none text-left">
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4" />
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Loyalty Rewards Program</h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Tiered spend rewards, points balance conversions (1 pt = ₹1.00 discount), and client tier rules.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {loyaltyTiers.map((t, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">{t.tier}</h3>
              <Badge variant="warning" className="text-[9px]">{t.minSpend}</Badge>
            </div>
            <div className="space-y-1 text-xs">
              <span className="text-amber-700 font-bold block">{t.rate}</span>
              <span className="text-slate-500 block">{t.multiplier}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
