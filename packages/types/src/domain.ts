/**
 * Core Domain Models & Hierarchy Types for Hive Salon
 */

export interface Organization {
  id: string;
  name: string;
  legalName?: string | null;
  code: string;
  businessType: string;
  currency: string;
  timezone: string;
  logoUrl?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  address?: string | null;
  country: string;
  taxSettings?: Record<string, any> | null;
  businessHours?: Record<string, any> | null;
  status: string;
  isSetupComplete: boolean;
  setupStep: number;
  createdAt: string;
  updatedAt: string;
}

export interface State {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface District {
  id: string;
  organizationId: string;
  stateId: string;
  name: string;
  code: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  state?: State;
}

export interface City {
  id: string;
  organizationId: string;
  stateId: string;
  districtId: string;
  name: string;
  code: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  state?: State;
  district?: District;
}

export interface Branch {
  id: string;
  organizationId: string;
  stateId?: string | null;
  districtId?: string | null;
  cityId?: string | null;
  name: string;
  code: string;
  address: string;
  phone: string;
  email?: string | null;
  managerUserId?: string | null;
  operatingHours?: Record<string, { open: string; close: string; isOpen: boolean }> | null;
  openingDate?: string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'UNDER_RENOVATION';
  isActive: boolean;
  isMainBranch: boolean;
  logoUrl?: string | null;
  taxConfig?: Record<string, any> | null;
  invoiceConfig?: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
  state?: State;
  district?: District;
  city?: City;
}

export type ScopeType = 'ORGANIZATION' | 'STATE' | 'DISTRICT' | 'CITY' | 'BRANCH';

export interface UserScope {
  id: string;
  organizationId: string;
  userId: string;
  scopeType: ScopeType;
  targetId: string;
  targetName?: string;
  createdAt: string;
}

export interface CustomRole {
  id: string;
  organizationId: string;
  name: string;
  description?: string | null;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  organizationId: string;
  email: string;
  phone?: string | null;
  fullName: string;
  avatarUrl?: string | null;
  role: string;
  isActive: boolean;
  failedLoginAttempts?: number;
  lockedUntil?: string | null;
  lastLoginAt?: string | null;
  assignedBranchIds: string[];
  scopes?: UserScope[];
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  organizationId: string;
  fullName: string;
  phone: string;
  email?: string | null;
  gender?: 'FEMALE' | 'MALE' | 'OTHER' | 'UNSPECIFIED';
  birthDate?: string | null;
  notes?: string | null;
  loyaltyPoints: number;
  totalSpent: number;
  totalVisits: number;
  lastVisitAt?: string | null;
  preferredBranchId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceCategory {
  id: string;
  organizationId: string;
  name: string;
  description?: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface Service {
  id: string;
  organizationId: string;
  categoryId: string;
  name: string;
  description?: string | null;
  durationMinutes: number;
  bufferMinutes: number;
  basePrice: number;
  taxRate: number;
  isActive: boolean;
  genderTarget?: 'ALL' | 'FEMALE' | 'MALE';
  category?: ServiceCategory;
}

export interface StaffProfile {
  id: string;
  organizationId: string;
  userId: string;
  employeeCode: string;
  displayName: string;
  jobTitle: string;
  specialization?: string[];
  commissionRate: number;
  isAvailableForBooking: boolean;
  assignedBranchIds: string[];
  user?: User;
}

export interface Appointment {
  id: string;
  organizationId: string;
  branchId: string;
  customerId: string;
  staffId: string;
  serviceId: string;
  startTime: string;
  endTime: string;
  status: 'BOOKED' | 'CONFIRMED' | 'ARRIVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  price: number;
  notes?: string | null;
  customer?: Customer;
  staff?: StaffProfile;
  service?: Service;
  branch?: Branch;
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  itemType: 'SERVICE' | 'PRODUCT' | 'MEMBERSHIP' | 'PACKAGE';
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  totalPrice: number;
  staffId?: string | null;
}

export interface Invoice {
  id: string;
  organizationId: string;
  branchId: string;
  customerId?: string | null;
  invoiceNumber: string;
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  grandTotal: number;
  status: 'PENDING' | 'PARTIALLY_PAID' | 'PAID' | 'REFUNDED' | 'VOID';
  paymentMethod: string;
  items: InvoiceItem[];
  customer?: Customer | null;
  createdAt: string;
}

export interface Product {
  id: string;
  organizationId: string;
  name: string;
  sku: string;
  barcode?: string | null;
  brand?: string | null;
  categoryId?: string | null;
  costPrice: number;
  retailPrice: number;
  minThreshold: number;
  isRetail: boolean;
  isBackbar: boolean;
  unit: string;
  createdAt: string;
}

export interface MembershipTier {
  id: string;
  organizationId: string;
  name: string;
  price: number;
  validityDays: number;
  discountPercentage: number;
  perksDescription?: string | null;
  isActive: boolean;
}
