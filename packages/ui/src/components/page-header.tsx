'use client';

import * as React from 'react';
import { HelpCircle } from 'lucide-react';
import { Breadcrumb, type BreadcrumbItem } from './breadcrumb';
import { Tooltip } from './tooltip';
import { Button } from './button';
import { cn } from '@hive/utilities';

export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  onHelpClick?: () => void;
  helpTooltip?: string;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  breadcrumbs,
  badge,
  actions,
  onHelpClick,
  helpTooltip = 'Learn more about this page (Ctrl + /)',
  className,
}) => {
  return (
    <div className={cn('space-y-2 pb-6 border-b border-slate-200/80 dark:border-slate-800/80', className)}>
      {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumb items={breadcrumbs} className="mb-2" />}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">
              {title}
            </h1>
            {badge}
            {onHelpClick && (
              <Tooltip content={helpTooltip} shortcut="Ctrl+/">
                <button
                  type="button"
                  onClick={onHelpClick}
                  className="rounded-full p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                  aria-label="Contextual Help"
                >
                  <HelpCircle className="h-4 w-4" />
                </button>
              </Tooltip>
            )}
          </div>
          {description && (
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">{description}</p>
          )}
        </div>

        {actions && <div className="flex flex-wrap items-center gap-2.5">{actions}</div>}
      </div>
    </div>
  );
};
