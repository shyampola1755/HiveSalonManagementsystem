/**
 * Global Constants for Hive Salon ERP — India First & Multi-Branch Enterprise
 */

export const DEFAULT_COUNTRY = 'India';
export const DEFAULT_CURRENCY = 'INR';
export const DEFAULT_TIMEZONE = 'Asia/Kolkata';

export const SUPPORTED_CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
  { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham', locale: 'ar-AE' },
  { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', locale: 'en-SG' },
] as const;

export const SUPPORTED_TIMEZONES = [
  'Asia/Kolkata',
  'Asia/Dubai',
  'Asia/Singapore',
  'Europe/London',
  'America/New_York',
  'America/Los_Angeles',
] as const;

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// The 14 System Roles
export const SYSTEM_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ORGANIZATION_OWNER: 'ORGANIZATION_OWNER',
  REGIONAL_MANAGER: 'REGIONAL_MANAGER',
  DISTRICT_MANAGER: 'DISTRICT_MANAGER',
  CITY_MANAGER: 'CITY_MANAGER',
  BRANCH_MANAGER: 'BRANCH_MANAGER',
  FRONT_DESK: 'FRONT_DESK',
  STYLIST: 'STYLIST',
  THERAPIST: 'THERAPIST',
  ACCOUNTANT: 'ACCOUNTANT',
  INVENTORY_MANAGER: 'INVENTORY_MANAGER',
  HR_MANAGER: 'HR_MANAGER',
  MARKETING_MANAGER: 'MARKETING_MANAGER',
  CLIENT: 'CLIENT',
} as const;

export type SystemRole = (typeof SYSTEM_ROLES)[keyof typeof SYSTEM_ROLES];

// 30+ Granular System Permissions
export const PERMISSION_FLAGS = {
  // Customers
  CUSTOMERS_VIEW: 'customers.view',
  CUSTOMERS_CREATE: 'customers.create',
  CUSTOMERS_EDIT: 'customers.edit',
  CUSTOMERS_DELETE: 'customers.delete',
  CUSTOMERS_EXPORT: 'customers.export',
  // Services Catalog (Phase 5)
  SERVICES_VIEW: 'services.view',
  SERVICES_CREATE: 'services.create',
  SERVICES_EDIT: 'services.edit',
  SERVICES_DELETE: 'services.delete',

  // Appointments
  APPOINTMENTS_VIEW: 'appointments.view',
  APPOINTMENTS_CREATE: 'appointments.create',
  APPOINTMENTS_EDIT: 'appointments.edit',
  APPOINTMENTS_CANCEL: 'appointments.cancel',
  APPOINTMENTS_ASSIGN: 'appointments.assign',

  // Billing & POS
  BILLING_VIEW: 'billing.view',
  BILLING_CREATE: 'billing.create',
  BILLING_REFUND: 'billing.refund',
  BILLING_VOID: 'billing.void',
  BILLING_DISCOUNT: 'billing.discount',

  // Inventory
  INVENTORY_VIEW: 'inventory.view',
  INVENTORY_MANAGE: 'inventory.manage',
  INVENTORY_ADJUST: 'inventory.adjust',
  INVENTORY_TRANSFER: 'inventory.transfer',
  INVENTORY_PURCHASE_ORDER: 'inventory.purchase_order',

  // Staff & HR
  STAFF_VIEW: 'staff.view',
  STAFF_MANAGE: 'staff.manage',
  STAFF_ATTENDANCE: 'staff.attendance',
  STAFF_COMMISSION: 'staff.commission',

  // Geographical Hierarchy
  HIERARCHY_STATE_MANAGE: 'hierarchy.state.manage',
  HIERARCHY_DISTRICT_MANAGE: 'hierarchy.district.manage',
  HIERARCHY_CITY_MANAGE: 'hierarchy.city.manage',
  HIERARCHY_BRANCH_MANAGE: 'hierarchy.branch.manage',

  // Reports
  REPORTS_ORGANIZATION: 'reports.organization',
  REPORTS_DISTRICT: 'reports.district',
  REPORTS_CITY: 'reports.city',
  REPORTS_BRANCH: 'reports.branch',
  REPORTS_EXPORT: 'reports.export',

  // Administration
  ROLES_MANAGE: 'roles.manage',
  USERS_MANAGE: 'users.manage',
  AUDIT_VIEW: 'audit.view',
  SETTINGS_MANAGE: 'settings.manage',
} as const;

export type PermissionFlag = (typeof PERMISSION_FLAGS)[keyof typeof PERMISSION_FLAGS];

export const APPOINTMENT_STATUS = {
  BOOKED: 'BOOKED',
  CONFIRMED: 'CONFIRMED',
  ARRIVED: 'ARRIVED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  NO_SHOW: 'NO_SHOW',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PARTIALLY_PAID: 'PARTIALLY_PAID',
  PAID: 'PAID',
  REFUNDED: 'REFUNDED',
  VOID: 'VOID',
} as const;

export const AUDIT_ACTIONS = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  PASSWORD_RESET: 'PASSWORD_RESET',
  STATUS_CHANGE: 'STATUS_CHANGE',
  PERMISSION_UPDATE: 'PERMISSION_UPDATE',
  SCOPE_ASSIGN: 'SCOPE_ASSIGN',
} as const;

// Customer CRM Constants (Phase 4)
export const CUSTOMER_TAGS = [
  'VIP',
  'New',
  'Returning',
  'High Value',
  'Inactive',
  'Birthday',
  'Membership',
  'Corporate',
] as const;

export const CUSTOMER_SEGMENTS = [
  { id: 'all', label: 'All Clients' },
  { id: 'new', label: 'New Clients' },
  { id: 'returning', label: 'Returning' },
  { id: 'vip', label: 'VIP' },
  { id: 'high_spender', label: 'High Spenders (> ₹25k)' },
  { id: 'frequent', label: 'Frequent (> 5 Visits)' },
  { id: 'membership', label: 'Membership' },
  { id: 'inactive', label: 'Inactive (> 60 Days)' },
] as const;

export const CUSTOMER_SOURCES = [
  'WALK_IN',
  'INSTAGRAM',
  'GOOGLE',
  'REFERRAL',
  'WEBSITE',
  'CAMPAIGN',
  'PHONE_INQUIRY',
] as const;

// 14 Standard Service Categories (Phase 5)
export const STANDARD_SERVICE_CATEGORIES = [
  { name: 'Hair', slug: 'hair', icon: 'Scissors', color: '#f59e0b', description: 'Haircuts, styling, blowdrys, and texture treatments.' },
  { name: 'Hair Color', slug: 'hair-color', icon: 'Palette', color: '#ec4899', description: 'Balayage, root touch-ups, highlights, and gloss.' },
  { name: 'Hair Treatment', slug: 'hair-treatment', icon: 'Sparkles', color: '#8b5cf6', description: 'Keratin, Olaplex, Botox, and scalp therapies.' },
  { name: 'Facial', slug: 'facial', icon: 'Smile', color: '#06b6d4', description: 'Hydra-dermabrasion, anti-aging, and botanical facials.' },
  { name: 'Skin', slug: 'skin', icon: 'Droplets', color: '#10b981', description: 'Dermal infusions, chemical peels, and body polishing.' },
  { name: 'Spa', slug: 'spa', icon: 'Flower2', color: '#6366f1', description: 'Full body spa rituals, wraps, and hydrotherapy.' },
  { name: 'Massage', slug: 'massage', icon: 'Hand', color: '#d97706', description: 'Deep tissue, Swedish, hot stone, and aromatherapy.' },
  { name: 'Nails', slug: 'nails', icon: 'Sparkle', color: '#f43f5e', description: 'Gel manicures, acrylic extensions, and nail artistry.' },
  { name: 'Makeup', slug: 'makeup', icon: 'Brush', color: '#e11d48', description: 'HD party, editorial, and evening occasion makeup.' },
  { name: 'Bridal', slug: 'bridal', icon: 'Crown', color: '#ca8a04', description: 'Complete bride & groom pre-wedding packages.' },
  { name: 'Tattoo', slug: 'tattoo', icon: 'Feather', color: '#64748b', description: 'Microblading, cosmetic tattoos, and body art.' },
  { name: 'Aesthetic', slug: 'aesthetic', icon: 'Activity', color: '#0284c7', description: 'Laser rejuvenation, micro-needling, and LED therapy.' },
  { name: 'Wellness', slug: 'wellness', icon: 'Heart', color: '#16a34a', description: 'Detox therapies, reflexology, and holistic care.' },
  { name: 'Other', slug: 'other', icon: 'MoreHorizontal', color: '#94a3b8', description: 'Custom and specialized salon packages.' },
] as const;


