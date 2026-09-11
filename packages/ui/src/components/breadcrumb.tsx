'use client';

import * as React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@hive/utilities';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  showHome = true,
  className,
}) => {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400', className)}>
      {showHome && (
        <a
          href="/"
          className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
        >
          <Home className="h-3.5 w-3.5" />
          <span className="sr-only">Dashboard</span>
        </a>
      )}

      {items.map((item, index) => {
        const isLast = index === items.length - 1 || item.isCurrent;

        return (
          <React.Fragment key={index}>
            {(showHome || index > 0) && (
              <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            )}
            {isLast || !item.href ? (
              <span className="font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[200px]">
                {item.label}
              </span>
            ) : (
              <a
                href={item.href}
                className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors truncate max-w-[150px]"
              >
                {item.label}
              </a>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
