'use client';

import * as React from 'react';
import { cn } from '@hive/utilities';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  shortcut?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  shortcut,
  position = 'top',
  className,
}) => {
  const [isVisible, setIsVisible] = React.useState(false);

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={cn(
            'pointer-events-none absolute z-50 flex items-center gap-1.5 whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1 text-xs text-slate-100 shadow-md animate-in fade-in zoom-in-95 duration-100 dark:bg-slate-100 dark:text-slate-900',
            positions[position],
            className
          )}
        >
          <span>{content}</span>
          {shortcut && (
            <kbd className="rounded border border-slate-700 bg-slate-800 px-1 text-[10px] font-mono text-slate-300 dark:border-slate-300 dark:bg-slate-200 dark:text-slate-700">
              {shortcut}
            </kbd>
          )}
        </div>
      )}
    </div>
  );
};
