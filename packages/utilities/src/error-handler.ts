import type { ApiError } from '@hive/types';

/**
 * Human-Friendly Error Descriptions Map
 */
export const ERROR_CODE_TRANSLATIONS: Record<string, string> = {
  // Database / Multi-tenant Errors
  P2002: 'A record with this information already exists in this branch or organization.',
  P2003: 'This action could not be completed because a referenced item (such as the branch, customer, or service) was not found or is inactive.',
  P2025: 'The item you are trying to view or edit was not found or may have been deleted.',
  DUPLICATE_ENTRY: 'An entry with these details already exists. Please check phone number or email.',
  BRANCH_UNAVAILABLE: 'We couldn’t save this item because the selected branch is no longer active. Please select an active branch.',
  
  // Auth Errors
  UNAUTHORIZED: 'Your session has expired. Please sign in again to continue.',
  FORBIDDEN: 'You do not have permission to perform this action. Contact your salon administrator.',
  INVALID_CREDENTIALS: 'The email address or password you entered is incorrect.',
  BRANCH_ACCESS_DENIED: 'You are not assigned to this branch. Please switch to an assigned branch.',
  
  // Operational Errors
  SLOT_UNAVAILABLE: 'This time slot is no longer available. Another appointment may have just been booked with this stylist.',
  INSUFFICIENT_STOCK: 'Not enough stock is available at this branch to complete the sale.',
  INVOICE_ALREADY_PAID: 'This invoice has already been fully paid and cannot be edited.',
  REFUND_EXCEEDS_TOTAL: 'Refund amount cannot be greater than the total amount paid on this invoice.',
  
  // Network / System
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

  // If already structured ApiError
  if (typeof error === 'object' && 'code' in error && 'message' in error) {
    const err = error as { code: string; message: string; fieldErrors?: Record<string, string> };
    const humanMsg = ERROR_CODE_TRANSLATIONS[err.code] || err.message;
    return {
      code: err.code,
      message: humanMsg,
      fieldErrors: err.fieldErrors,
    };
  }

  // Handle standard Error instance
  if (error instanceof Error) {
    // Check for Prisma error codes in message
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
