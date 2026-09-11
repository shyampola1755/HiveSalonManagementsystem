/**
 * Hive Salon Design Tokens and Color System
 */
export const themeColors = {
  // Brand Primary (Honey Gold / Amber Luxury)
  brand: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },
  // Dark Neutral (Sleek Slate Charcoal)
  charcoal: {
    900: '#0b0f17',
    800: '#111827',
    700: '#1f2937',
    600: '#374151',
    500: '#4b5563',
    400: '#9ca3af',
    300: '#d1d5db',
    200: '#e5e7eb',
    100: '#f3f4f6',
    50: '#f9fafb',
  },
  // Status Colors
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#f43f5e',
    info: '#0ea5e9',
  }
} as const;

export const brandMeta = {
  name: 'Hive Salon',
  tagline: 'Centralized Salon & Spa ERP',
  shortName: 'Hive',
  supportEmail: 'support@hivesalon.com',
  docsUrl: 'https://docs.hivesalon.com',
} as const;
