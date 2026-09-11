'use client';

import * as React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@hive/utilities';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, 'id'>) => string;
  removeToast: (id: string) => void;
  success: (title: string, description?: string) => string;
  error: (title: string, description?: string) => string;
  warning: (title: string, description?: string) => string;
  info: (title: string, description?: string) => string;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = React.useCallback(
    (toast: Omit<ToastItem, 'id'>) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = { ...toast, id };
      setToasts((prev) => [...prev, newToast]);

      const duration = toast.duration ?? 4500;
      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
      return id;
    },
    [removeToast]
  );

  const success = React.useCallback(
    (title: string, description?: string) => showToast({ type: 'success', title, description }),
    [showToast]
  );

  const error = React.useCallback(
    (title: string, description?: string) =>
      showToast({ type: 'error', title, description, duration: 6000 }),
    [showToast]
  );

  const warning = React.useCallback(
    (title: string, description?: string) => showToast({ type: 'warning', title, description }),
    [showToast]
  );

  const info = React.useCallback(
    (title: string, description?: string) => showToast({ type: 'info', title, description }),
    [showToast]
  );

  return (
    <ToastContext.Provider
      value={{ toasts, showToast, removeToast, success, error, warning, info }}
    >
      {children}
      {/* Toast Render Portal */}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 max-w-md w-full pointer-events-none p-2 sm:p-0">
        {toasts.map((t) => {
          const icons = {
            success: <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />,
            error: <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />,
            warning: <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />,
            info: <Info className="h-5 w-5 text-sky-500 shrink-0 mt-0.5" />,
          };

          const borders = {
            success: 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/90 dark:bg-slate-900',
            error: 'border-rose-200 dark:border-rose-800/60 bg-rose-50/90 dark:bg-slate-900',
            warning: 'border-amber-200 dark:border-amber-800/60 bg-amber-50/90 dark:bg-slate-900',
            info: 'border-sky-200 dark:border-sky-800/60 bg-sky-50/90 dark:bg-slate-900',
          };

          return (
            <div
              key={t.id}
              className={cn(
                'pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-lg backdrop-blur-md transition-all animate-in slide-in-from-bottom-5 duration-200',
                borders[t.type]
              )}
            >
              {icons[t.type]}
              <div className="flex-1 text-left">
                <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  {t.title}
                </h4>
                {t.description && (
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {t.description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-500"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
