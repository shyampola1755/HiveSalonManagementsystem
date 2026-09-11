import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ApiError } from '@hive/types';

/**
 * Merges Tailwind classes safely with clsx and twMerge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Currency, Date and Number Formatters for Hive Salon
 */
export function formatCurrency(amount: number, currency: string = 'INR', locale: string = 'en-IN'): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `₹${amount.toFixed(2)}`;
  }
}

export function formatDurationMinutes(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${remainingMinutes}m`;
}

export function formatDate(date: string | Date | number, locale: string = 'en-US'): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
}

export function formatDateTime(date: string | Date | number, locale: string = 'en-US'): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(d);
}

export function formatTime(timeStr: string): string {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':');
  if (!hours || !minutes) return timeStr;
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const formattedHour = h % 12 || 12;
  return `${formattedHour}:${minutes} ${ampm}`;
}

export function formatPhoneNumber(phone: string): string {
  if (!phone) return '';
  const cleaned = ('' + phone).replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

/**
 * Human-Friendly Error Descriptions Map
 */
export const ERROR_CODE_TRANSLATIONS: Record<string, string> = {
  P2002: 'A record with this information already exists in this branch or organization.',
  P2003: 'This action could not be completed because a referenced item (such as the branch, customer, or service) was not found or is inactive.',
  P2025: 'The item you are trying to view or edit was not found or may have been deleted.',
  DUPLICATE_ENTRY: 'An entry with these details already exists. Please check phone number or email.',
  BRANCH_UNAVAILABLE: 'We couldn’t save this item because the selected branch is no longer active. Please select an active branch.',
  UNAUTHORIZED: 'Your session has expired. Please sign in again to continue.',
  FORBIDDEN: 'You do not have permission to perform this action. Contact your salon administrator.',
  INVALID_CREDENTIALS: 'The email address or password you entered is incorrect.',
  BRANCH_ACCESS_DENIED: 'You are not assigned to this branch. Please switch to an assigned branch.',
  SLOT_UNAVAILABLE: 'This time slot is no longer available. Another appointment may have just been booked with this stylist.',
  INSUFFICIENT_STOCK: 'Not enough stock is available at this branch to complete the sale.',
  INVOICE_ALREADY_PAID: 'This invoice has already been fully paid and cannot be edited.',
  REFUND_EXCEEDS_TOTAL: 'Refund amount cannot be greater than the total amount paid on this invoice.',
  NETWORK_ERROR: 'Unable to connect to Hive Salon servers. Please check your internet connection.',
  TIMEOUT_ERROR: 'The request took longer than expected. Please check your connection and try again.',
  UNKNOWN_ERROR: 'Something went wrong while processing your request. Please try again or contact support.',
};

/**
 * Transforms any technical error into a user-friendly ApiError object
 */
export function formatHumanFriendlyError(error: unknown): ApiError {
  if (!error) {
    return {
      code: 'UNKNOWN_ERROR',
      message: ERROR_CODE_TRANSLATIONS.UNKNOWN_ERROR,
    };
  }

  if (typeof error === 'object' && 'code' in error && 'message' in error) {
    const err = error as { code: string; message: string; fieldErrors?: Record<string, string> };
    const humanMsg = ERROR_CODE_TRANSLATIONS[err.code] || err.message;
    return {
      code: err.code,
      message: humanMsg,
      fieldErrors: err.fieldErrors,
    };
  }

  if (error instanceof Error) {
    if (error.message.includes('P2002') || error.message.includes('Unique constraint failed')) {
      return {
        code: 'P2002',
        message: ERROR_CODE_TRANSLATIONS.P2002,
      };
    }
    if (error.message.includes('P2003') || error.message.includes('Foreign key constraint failed')) {
      return {
        code: 'P2003',
        message: ERROR_CODE_TRANSLATIONS.P2003,
      };
    }
    if (error.message.includes('P2025') || error.message.includes('Record to update not found')) {
      return {
        code: 'P2025',
        message: ERROR_CODE_TRANSLATIONS.P2025,
      };
    }
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      return {
        code: 'NETWORK_ERROR',
        message: ERROR_CODE_TRANSLATIONS.NETWORK_ERROR,
      };
    }

    return {
      code: 'ERROR',
      message: error.message || ERROR_CODE_TRANSLATIONS.UNKNOWN_ERROR,
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: typeof error === 'string' ? error : ERROR_CODE_TRANSLATIONS.UNKNOWN_ERROR,
  };
}

/**
 * Async & Timing Utilities
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  let timeout: NodeJS.Timeout | null = null;

  const debounced = (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };

  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
