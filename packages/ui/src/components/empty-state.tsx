'use client';

import * as React from 'react';
import { Sparkles, Plus, FolderOpen } from 'lucide-react';
import { Button } from './button';
import { cn } from '@hive/utilities';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 px-6 py-12 text-center transition-all',
        className
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 mb-4 shadow-xs">
        {icon || <FolderOpen className="h-7 w-7" />}
      </div>
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="mt-1.5 max-w-sm text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
        {description}
      </p>

      {(primaryActionLabel || secondaryActionLabel) && (
        <div className="mt-6 flex items-center gap-3">
          {primaryActionLabel && onPrimaryAction && (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={onPrimaryAction}
            >
              {primaryActionLabel}
            </Button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <Button variant="outline" size="sm" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
