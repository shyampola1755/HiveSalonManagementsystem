'use client';

import * as React from 'react';
import {
  Search,
  Users,
  Calendar,
  CreditCard,
  Package,
  UserCheck,
  Building2,
  Award,
  ArrowRight,
  X,
  Compass,
} from 'lucide-react';
import { Badge } from './badge';
import type { SearchCategory, SearchResultItem } from '@hive/types';
import { cn } from '@hive/utilities';

export interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult?: (item: SearchResultItem) => void;
  initialQuery?: string;
}

const mockSearchItems: SearchResultItem[] = [
  {
    id: 'c1',
    category: 'CUSTOMER',
    title: 'Eleanor Vance',
    subtitle: '+1 (555) 234-5678 • Total Spent: $1,420 • 8 visits',
    badge: 'VIP Member',
    href: '/customers/c1',
  },
  {
    id: 'c2',
    category: 'CUSTOMER',
    title: 'Marcus Brody',
    subtitle: '+1 (555) 987-6543 • marcus.b@example.com',
    href: '/customers/c2',
  },
  {
    id: 'a1',
    category: 'APPOINTMENT',
    title: 'Balayage & Blowdry — Eleanor Vance',
    subtitle: 'Today @ 2:30 PM • Stylist: Sophia Miller • Downtown Flagship',
    badge: 'Confirmed',
    href: '/appointments/a1',
  },
  {
    id: 'i1',
    category: 'INVOICE',
    title: 'Invoice #INV-2026-0891',
    subtitle: 'Eleanor Vance • Amount: $240.00 • Paid (Card)',
    badge: 'Paid',
    href: '/invoices/i1',
  },
  {
    id: 'p1',
    category: 'PRODUCT',
    title: 'Olaplex No. 3 Hair Perfector 100ml',
    subtitle: 'SKU: OLA-003 • In Stock: 18 units • Retail: $32.00',
    badge: 'In Stock',
    href: '/inventory/p1',
  },
  {
    id: 's1',
    category: 'STAFF',
    title: 'Sophia Miller',
    subtitle: 'Senior Colorist & Stylist • Active • Downtown Flagship',
    badge: 'Available',
    href: '/staff/s1',
  },
  {
    id: 'b1',
    category: 'BRANCH',
    title: 'Downtown Flagship',
    subtitle: '124 Fifth Ave, Suite 400 • (555) 019-2831',
    badge: 'Main Branch',
    href: '/branches/b1',
  },
  {
    id: 'm1',
    category: 'MEMBERSHIP',
    title: 'Hive Black Diamond Tier',
    subtitle: '15% Off all services & free blowout monthly • $99/mo',
    badge: 'Tier',
    href: '/memberships/m1',
  },
  {
    id: 'n1',
    category: 'NAVIGATION',
    title: 'Point of Sale (POS)',
    subtitle: 'Open terminal register checkout',
    href: '/pos',
  },
  {
    id: 'n2',
    category: 'NAVIGATION',
    title: 'UX Design System Showcase',
    subtitle: 'View Phase 0 UI components and style tokens',
    href: '/showcase',
  },
];

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  isOpen,
  onClose,
  onSelectResult,
  initialQuery = '',
}) => {
  const [query, setQuery] = React.useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = React.useState<string>('ALL');
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Focus input when opened
  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Keyboard shortcut listener (Ctrl+K or Cmd+K)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filtered results
  const filteredResults = React.useMemo(() => {
    let list = mockSearchItems;
    if (selectedCategory !== 'ALL') {
      list = list.filter((item) => item.category === selectedCategory);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.subtitle?.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [query, selectedCategory]);

  const categories: Array<{ id: string; label: string }> = [
    { id: 'ALL', label: 'All' },
    { id: 'CUSTOMER', label: 'Customers' },
    { id: 'APPOINTMENT', label: 'Appointments' },
    { id: 'INVOICE', label: 'Invoices' },
    { id: 'PRODUCT', label: 'Products' },
    { id: 'STAFF', label: 'Staff' },
    { id: 'BRANCH', label: 'Branches' },
    { id: 'MEMBERSHIP', label: 'Memberships' },
    { id: 'NAVIGATION', label: 'Pages' },
  ];

  const getCategoryIcon = (category: SearchCategory) => {
    switch (category) {
      case 'CUSTOMER':
        return <Users className="h-4 w-4 text-emerald-500" />;
      case 'APPOINTMENT':
        return <Calendar className="h-4 w-4 text-amber-500" />;
      case 'INVOICE':
        return <CreditCard className="h-4 w-4 text-sky-500" />;
      case 'PRODUCT':
        return <Package className="h-4 w-4 text-purple-500" />;
      case 'STAFF':
        return <UserCheck className="h-4 w-4 text-pink-500" />;
      case 'BRANCH':
        return <Building2 className="h-4 w-4 text-indigo-500" />;
      case 'MEMBERSHIP':
        return <Award className="h-4 w-4 text-yellow-500" />;
      case 'NAVIGATION':
        return <Compass className="h-4 w-4 text-slate-500" />;
    }
  };

  const handleSelect = (item: SearchResultItem) => {
    onSelectResult?.(item);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Palette Container */}
      <div className="relative z-50 w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl animate-in zoom-in-95 duration-150 text-left">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 px-4 py-3.5">
          <Search className="h-5 w-5 text-amber-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search customers, bookings, invoices, products, staff..."
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="rounded-lg p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline rounded border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-500">
            ESC
          </kbd>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-100 dark:border-slate-800/80 px-4 py-2 no-scrollbar bg-slate-50/50 dark:bg-slate-900/50">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                'rounded-lg px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors select-none',
                selectedCategory === cat.id
                  ? 'bg-amber-600 text-white font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filteredResults.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No results found for &ldquo;<strong className="text-slate-700 dark:text-slate-300">{query}</strong>&rdquo;
            </div>
          ) : (
            filteredResults.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={cn(
                  'group flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left transition-colors',
                  selectedIndex === idx
                    ? 'bg-amber-50 dark:bg-amber-950/40 text-slate-900 dark:text-white'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                )}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                  {getCategoryIcon(item.category)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs truncate">{item.title}</span>
                    {item.badge && (
                      <span className="rounded px-1.5 py-0.2 text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {item.subtitle && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {item.subtitle}
                    </p>
                  )}
                </div>

                <ArrowRight className="h-3.5 w-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </button>
            ))
          )}
        </div>

        {/* Footer Hint */}
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 px-4 py-2.5 text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>
              <strong className="font-semibold text-slate-600 dark:text-slate-300">
                {filteredResults.length}
              </strong>{' '}
              results
            </span>
            <span>• Press ↵ to select</span>
          </div>
          <span>Hive Global Search</span>
        </div>
      </div>
    </div>
  );
};
