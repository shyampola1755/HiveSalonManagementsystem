'use client';

import * as React from 'react';
import { ArrowUpRight, ArrowDownRight, HelpCircle } from 'lucide-react';
import { Tooltip } from './tooltip';
import { cn } from '@hive/utilities';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  changePercentage?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  helpText?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  changePercentage,
  changeLabel = 'vs last month',
  icon,
  helpText,
  className,
}) => {
  const isPositive = changePercentage !== undefined && changePercentage >= 0;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition-all hover:shadow-md',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{title}</span>
          {helpText && (
            <Tooltip content={helpText}>
              <HelpCircle className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600 cursor-help" />
            </Tooltip>
          )}
        </div>
        {icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 tabular-nums">
          {value}
        </span>
      </div>

      {(changePercentage !== undefined || subtitle) && (
        <div className="mt-2.5 flex items-center gap-1.5 text-xs">
          {changePercentage !== undefined && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 font-semibold',
                isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              )}
            >
              {isPositive ? (
                <ArrowUpRight className="h-3.5 w-3.5" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5" />
              )}
              <span>{Math.abs(changePercentage)}%</span>
            </span>
          )}
          <span className="text-slate-500 dark:text-slate-400">{subtitle || changeLabel}</span>
        </div>
      )}
    </div>
  );
};
