'use client';

import * as React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './modal';
import { Button } from './button';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'destructive' | 'primary';
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'destructive',
  isLoading = false,
}) => {
  const [loading, setLoading] = React.useState(false);
  const activeLoading = isLoading || loading;

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="sm"
      title={
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          {variant === 'destructive' && (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="h-4 w-4" />
            </div>
          )}
          <span>{title}</span>
        </div>
      }
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={activeLoading}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant === 'destructive' ? 'destructive' : 'primary'}
            size="sm"
            onClick={handleConfirm}
            isLoading={activeLoading}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
    </Modal>
  );
};
