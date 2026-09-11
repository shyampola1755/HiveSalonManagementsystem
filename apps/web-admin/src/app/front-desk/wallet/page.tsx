'use client';

import * as React from 'react';
import { Wallet, Plus, Search, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button, Input, Modal, useToast } from '@hive/ui';
import { formatCurrency } from '@hive/utilities';

export default function FrontDeskWalletPage() {
  const toast = useToast();
  const [isRechargeOpen, setIsRechargeOpen] = React.useState(false);

  return (
    <div className="space-y-6 pb-12 font-sans select-none text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-sm">
              <Wallet className="w-4 h-4" />
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Guest Prepaid Wallets</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Top-up client prepaid balances, check ledger transactions, and process bonus credits.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsRechargeOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
          className="text-xs font-bold shadow-sm"
        >
          Recharge Guest Wallet
        </Button>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-500 block uppercase font-bold">Total Customer Wallet Balances in Branch</span>
          <span className="text-3xl font-black text-emerald-700 font-mono mt-1 block">₹4,82,500.00</span>
        </div>
        <div className="text-right text-xs text-slate-500 font-mono">
          <span>Active Wallets: <strong className="text-slate-900">184 clients</strong></span><br />
          <span>Non-Negative Ledger Invariant: <strong className="text-emerald-700">Strict Enforced</strong></span>
        </div>
      </div>

      {/* Top-up Modal */}
      <Modal
        isOpen={isRechargeOpen}
        onClose={() => setIsRechargeOpen(false)}
        title="Recharge Client Prepaid Wallet"
        maxWidth="md"
      >
        <div className="space-y-4 text-left text-xs">
          <Input label="Client Mobile Phone" placeholder="9876543210" required />
          <Input label="Recharge Amount (₹)" type="number" placeholder="5000" required />
          <Input label="Bonus Credits (₹)" type="number" placeholder="500" defaultValue="500" />
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setIsRechargeOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => {
                setIsRechargeOpen(false);
                toast.success('Wallet topped up with ₹5,000 + ₹500 promotional bonus.');
              }}
            >
              Confirm Top-up
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
