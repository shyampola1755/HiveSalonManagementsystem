'use client';

import * as React from 'react';
import { Sparkles, Calendar, CreditCard, ShoppingBag, Clock } from 'lucide-react';
import { Badge } from '@hive/ui';
import { formatCurrency } from '@hive/utilities';

export default function FrontDeskCustomerHistoryPage() {
  const historyEvents = [
    { type: 'SERVICE', title: 'Artisan Balayage & Olaplex Glaze', stylist: 'Priya Sharma', date: 'Sep 2, 2026', branch: 'Jubilee Hills Flagship', amount: 4720.0 },
    { type: 'RETAIL', title: 'Purchased Olaplex No. 3 Hair Perfector (100ml)', stylist: 'Priya Sharma', date: 'Sep 2, 2026', branch: 'Jubilee Hills Flagship', amount: 2150.0 },
    { type: 'ONLINE', title: 'Online Storefront Order #ORD-1092 (Dunzo Express)', stylist: 'Omnichannel Store', date: 'Aug 14, 2026', branch: 'Jubilee Hills Flagship', amount: 3330.0 },
    { type: 'SERVICE', title: 'Hydra-Facial Oxygen Luxe Glow', stylist: 'Ananya Roy', date: 'Jul 28, 2026', branch: 'Banjara Hills Spa', amount: 4130.0 },
  ];

  return (
    <div className="space-y-6 pb-12 font-sans select-none text-left">
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight">Omnichannel Customer History</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Unified 360° timeline: Salon in-chair services, POS retail counter purchases, and online e-commerce orders.
        </p>
      </div>

      <div className="space-y-3">
        {historyEvents.map((evt, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  evt.type === 'SERVICE'
                    ? 'bg-amber-500/20 text-amber-400'
                    : evt.type === 'RETAIL'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-purple-500/20 text-purple-400'
                }`}
              >
                {evt.type === 'SERVICE' ? <Calendar className="w-5 h-5" /> : evt.type === 'RETAIL' ? <CreditCard className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white text-xs">{evt.title}</h4>
                  <Badge variant="outline" className="text-[9px]">{evt.type}</Badge>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  By: <strong className="text-slate-200">{evt.stylist}</strong> • {evt.branch} • <span className="text-slate-500">{evt.date}</span>
                </p>
              </div>
            </div>

            <span className="font-mono font-bold text-amber-300 text-sm">
              {formatCurrency(evt.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
