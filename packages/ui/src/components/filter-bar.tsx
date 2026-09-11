'use client';

import * as React from 'react';
import { Filter, X, RotateCcw } from 'lucide-react';
import { Button } from './button';
import { Badge } from './badge';
import { cn } from '@hive/utilities';

export interface FilterOption {
  id: string;
  label: string;
  value: string;
  isActive?: boolean;
}

export interface FilterBarProps {
  filters: FilterOption[];
  onFilterToggle: (filterId: string) => void;
  onClearAll?: () => void;
  children?: React.ReactNode;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterToggle,
  onClearAll,
  children,
  className,
}) => {
  const activeCount = filters.filter((f) => f.isActive).length;

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-3',
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mr-1">
          <Filter className="h-3.5 w-3.5 text-amber-500" />
          <span>Filters</span>
          {activeCount > 0 && (
            <Badge variant="default" className="px-1.5 py-0 text-[10px]">
              {activeCount}
            </Badge>
          )}
        </div>

        {filters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={() => onFilterToggle(filter.id)}
            className={cn(
              'inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium transition-all select-none',
              filter.isActive
                ? 'border-amber-500 bg-amber-50 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200 shadow-xs'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
            )}
          >
            <span>{filter.label}</span>
            {filter.isActive && <X className="h-3 w-3 text-amber-600 dark:text-amber-400" />}
          </button>
        ))}

        {activeCount > 0 && onClearAll && (
          <button
            type="button"
            onClick={onClearAll}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 ml-1 underline underline-offset-2"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
};
