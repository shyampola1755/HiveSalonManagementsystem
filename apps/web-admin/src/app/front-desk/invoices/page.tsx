'use client';

import * as React from 'react';
import { Receipt, Search, Printer, Send, CreditCard, Clock } from 'lucide-react';
import { Button, Badge, Input, useToast } from '@hive/ui';
import { formatCurrency } from '@hive/utilities';

export default function FrontDeskInvoicesPage() {
  const toast = useToast();
  const [searchQuery, setSearchQuery] = React.useState('');

  const invoices = [
    { id: 'INV-902184', client: 'Priya Sharma', phone: '+91 98765 43210', amount: 7257.0, method: 'UPI', time: 'Today @ 14:15', status: 'PAID' },
    { id: 'INV-902183', client: 'Rahul Verma', phone: '+91 98111 22334', amount: 1416.0, method: 'CARD', time: 'Today @ 13:40', status: 'PAID' },
    { id: 'INV-902182', client: 'Sneha Kapoor', phone: '+91 97000 88991', amount: 4484.0, method: 'CASH', time: 'Today @ 12:20', status: 'PAID' },
    { id: 'INV-902181', client: 'Dr. Sunita Rao', phone: '+91 99887 76655', amount: 3800.0, method: 'WALLET', time: 'Today @ 11:05', status: 'PAID' },
  ];

  return (
    <div className="space-y-6 pb-12 font-sans select-none text-left">
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-sm">
            <Receipt className="w-4 h-4" />
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Today&rsquo;s Front Desk Invoices</h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Settled register tax invoices, thermal reprint slips, and WhatsApp resend triggers.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search invoice number, client phone or name..."
            className="pl-9 h-11 text-xs bg-slate-50"
          />
        </div>
      </div>

      <div className="space-y-2.5">
        {invoices.map((inv) => (
          <div
            key={inv.id}
            className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-amber-700 text-sm">{inv.id}</span>
                <span className="font-bold text-slate-900 text-xs">{inv.client}</span>
                <Badge variant="success" className="text-[9px]">{inv.status}</Badge>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                {inv.phone} • Method: <strong className="text-slate-800">{inv.method}</strong> • {inv.time}
              </p>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3">
              <span className="font-mono font-black text-amber-700 text-base">
                {formatCurrency(inv.amount)}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="text-xs border-slate-200 hover:bg-slate-50 shadow-xs"
                leftIcon={<Send className="w-3.5 h-3.5 text-emerald-600" />}
                onClick={() => toast.success(`Invoice sent to ${inv.phone} via WhatsApp.`)}
              >
                WhatsApp
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs border-slate-200 hover:bg-slate-50 shadow-xs"
                leftIcon={<Printer className="w-3.5 h-3.5" />}
                onClick={() => window.print()}
              >
                Print Slip
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
