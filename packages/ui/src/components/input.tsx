'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@hive/utilities';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClear?: () => void;
  showClearButton?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      value,
      onClear,
      showClearButton = false,
      disabled,
      required,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || React.useId();
    const hasValue = value !== undefined && value !== '' && value !== null;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-slate-700 dark:text-slate-300"
          >
            {label}
            {required && <span className="ml-1 text-rose-500">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="pointer-events-none absolute left-3 flex items-center text-slate-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            value={value}
            disabled={disabled}
            className={cn(
              'flex h-9 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm transition-colors focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:cursor-not-allowed disabled:bg-slate-50 dark:disabled:bg-slate-800 disabled:opacity-60',
              leftIcon && 'pl-9',
              (rightIcon || (showClearButton && hasValue)) && 'pr-9',
              error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500',
              className
            )}
            {...props}
          />
          {showClearButton && hasValue && !disabled && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-3 flex h-4 w-4 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-3 w-3" />
            </button>
          )}
          {!showClearButton && rightIcon && (
            <div className="pointer-events-none absolute right-3 flex items-center text-slate-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-xs text-rose-500 animate-in fade-in duration-150">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
