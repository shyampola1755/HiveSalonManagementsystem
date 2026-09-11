'use client';

import * as React from 'react';
import { cn } from '@hive/utilities';

export interface LoadingStateProps {
  count?: number;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ count = 4, className }) => {
  return (
    <div className={cn('w-full space-y-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900', className)}>
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
        <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
      </div>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-2">
          <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
            <div className="h-2.5 w-1/2 rounded bg-slate-100 dark:bg-slate-800/60 animate-pulse" />
          </div>
          <div className="h-6 w-16 rounded-md bg-slate-200 dark:bg-slate-800 animate-pulse shrink-0" />
        </div>
      ))}
    </div>
  );
};
