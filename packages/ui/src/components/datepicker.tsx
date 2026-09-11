'use client';

import * as React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@hive/utilities';

export interface DatePickerProps {
  label?: string;
  error?: string;
  helperText?: string;
  value?: string; // YYYY-MM-DD
  onChange?: (date: string) => void;
  min?: string;
  max?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  error,
  helperText,
  value,
  onChange,
  min,
  max,
  disabled,
  required,
  className,
}) => {
  const id = React.useId();

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label htmlFor={id} className="block text-xs font-medium text-slate-700 dark:text-slate-300">
          {label}
          {required && <span className="ml-1 text-rose-500">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        <div className="pointer-events-none absolute left-3 flex items-center text-slate-400">
          <CalendarIcon className="h-4 w-4" />
        </div>
        <input
          id={id}
          type="date"
          value={value}
          min={min}
          max={max}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
          className={cn(
            'flex h-9 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 pl-9 pr-3 py-1 text-sm text-slate-900 dark:text-slate-100 shadow-sm transition-colors focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-60',
            error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500',
            className
          )}
        />
      </div>
      {error ? (
        <p className="text-xs text-rose-500">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
};
