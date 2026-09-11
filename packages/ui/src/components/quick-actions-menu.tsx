'use client';

import * as React from 'react';
import {
  Zap,
  Calendar,
  Users,
  CreditCard,
  Package,
  UserCheck,
  Bot,
  X,
  ArrowRight,
} from 'lucide-react';
import { Button } from './button';
import { Badge } from './badge';

export interface QuickActionItem {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  hotkey?: string;
  shortcutKey?: string;
  badge?: string;
  color: string;
}

export const defaultQuickActions: QuickActionItem[] = [
  {
    id: 'act-new-appointment',
    label: 'New Appointment',
    description: 'Book a client for hair color, haircut, spa, or aesthetic ritual.',
    href: '/appointments?action=new-appointment',
    icon: Calendar,
    hotkey: 'Alt + A',
    shortcutKey: '1',
    badge: 'Popular',
    color: 'from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/30 hover:border-amber-400/60',
  },
  {
    id: 'act-new-pos',
    label: 'New Sale / POS Checkout',
    description: 'Create an 18% GST invoice, apply loyalty, and collect payment.',
    href: '/pos',
    icon: CreditCard,
    hotkey: 'Alt + P',
    shortcutKey: '2',
    badge: 'Fast Checkout',
    color: 'from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/30 hover:border-emerald-400/60',
  },
  {
    id: 'act-new-customer',
    label: 'Register New Customer',
    description: 'Add a new client profile with phone, hair notes, and membership tier.',
    href: '/customers?action=new-customer',
    icon: Users,
    hotkey: 'Alt + C',
    shortcutKey: '3',
    color: 'from-sky-500/20 to-sky-500/5 text-sky-400 border-sky-500/30 hover:border-sky-400/60',
  },
  {
    id: 'act-ask-ai',
    label: 'Ask Hive Salon AI',
    description: 'Query sales, branch performance, stockouts, or predictive forecasts.',
    href: '/ai',
    icon: Bot,
    hotkey: 'Alt + Q',
    shortcutKey: '4',
    badge: 'BI & ML',
    color: 'from-purple-500/20 to-purple-500/5 text-purple-400 border-purple-500/30 hover:border-purple-400/60',
  },
  {
    id: 'act-add-product',
    label: 'Add Retail or Backbar Product',
    description: 'Register a new SKU with barcode, cost, MRP, and safety threshold.',
    href: '/inventory?action=new-product',
    icon: Package,
    shortcutKey: '5',
    color: 'from-orange-500/20 to-orange-500/5 text-orange-400 border-orange-500/30 hover:border-orange-400/60',
  },
  {
    id: 'act-add-staff',
    label: 'Add Staff Member',
    description: 'Onboard a new stylist, therapist, or receptionist with commission rules.',
    href: '/staff?action=new-staff',
    icon: UserCheck,
    shortcutKey: '6',
    color: 'from-indigo-500/20 to-indigo-500/5 text-indigo-400 border-indigo-500/30 hover:border-indigo-400/60',
  },
];

export interface QuickActionsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onActionClick: (href: string) => void;
}

export const QuickActionsMenu: React.FC<QuickActionsMenuProps> = ({
  isOpen,
  onClose,
  onActionClick,
}) => {
  const handleAction = React.useCallback(
    (act: QuickActionItem) => {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('hive:quick-action', {
            detail: { id: act.id, href: act.href },
          })
        );
      }
      onActionClick(act.href);
      onClose();
    },
    [onActionClick, onClose]
  );

  // Keyboard shortcut listener when modal is open
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      // Alt + hotkeys
      if (e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        handleAction(defaultQuickActions[0]);
        return;
      }
      if (e.altKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handleAction(defaultQuickActions[1]);
        return;
      }
      if (e.altKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        handleAction(defaultQuickActions[2]);
        return;
      }
      if (e.altKey && e.key.toLowerCase() === 'q') {
        e.preventDefault();
        handleAction(defaultQuickActions[3]);
        return;
      }

      // Number keys 1-6 when no modifier is pressed
      if (!e.altKey && !e.ctrlKey && !e.metaKey) {
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= defaultQuickActions.length) {
          e.preventDefault();
          handleAction(defaultQuickActions[num - 1]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleAction, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-left">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-lg">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white">Global Quick Actions</h2>
                <Badge variant="warning">Speed Dial</Badge>
              </div>
              <p className="text-xs text-slate-400">Launch standard salon operations in one click.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Grid */}
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/60">
          {defaultQuickActions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.id}
                type="button"
                onClick={() => handleAction(act)}
                className={`p-4 rounded-2xl border bg-gradient-to-br ${act.color} text-left transition-all hover:scale-[1.02] hover:shadow-lg flex flex-col justify-between space-y-3 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400/50`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  {act.badge && (
                    <Badge variant="outline" className="text-[10px] bg-slate-950/60">
                      {act.badge}
                    </Badge>
                  )}
                </div>

                <div>
                  <h3 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors flex items-center justify-between">
                    {act.label}
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {act.description}
                  </p>
                </div>

                {act.hotkey && (
                  <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                    <span className="text-[9px] font-mono text-slate-500">
                      Press <strong>{act.shortcutKey}</strong>
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
                      {act.hotkey}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 px-6">
          <span>Tip: Press <strong>Ctrl + K</strong> anytime to open the global search palette.</span>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
