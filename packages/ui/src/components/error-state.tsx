'use client';

import * as React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from './button';
import { cn } from '@hive/utilities';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to load content',
  message = 'We encountered an issue while loading this data. Please try again or check your connection.',
  onRetry,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20 px-6 py-10 text-center',
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 mb-3 shadow-xs">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="mt-1 max-w-sm text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <div className="mt-5">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
            onClick={onRetry}
            className="border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800"
          >
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};
