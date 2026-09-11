/**
 * Phase 5: Service Catalog, Categories, Pricing & Add-ons Types
 */

export type StandardCategoryName =
  | 'Hair'
  | 'Hair Color'
  | 'Hair Treatment'
  | 'Facial'
  | 'Skin'
  | 'Spa'
  | 'Massage'
  | 'Nails'
  | 'Makeup'
  | 'Bridal'
  | 'Tattoo'
  | 'Aesthetic'
  | 'Wellness'
  | 'Other';

export interface ServiceCategoryItem {
  id: string;
  organizationId?: string;
  name: string;
  code?: string;
  slug?: string | null;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  sortOrder?: number;
  displayOrder?: number;
  isActive: boolean;
  serviceCount?: number;
  isCustom?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServiceBranchPrice {
  id?: string;
  serviceId?: string;
  branchId: string;
  branchName?: string;
  branchCode?: string;
  price: number;
  durationMinutes?: number | null;
  isAvailable: boolean;
}

export interface ServiceStaffEligibilityItem {
  id?: string;
  serviceId?: string;
  staffId: string;
  staffName: string;
  employeeCode?: string;
  jobTitle?: string;
  role?: string;
  skillLevel?: string;
  isEligible?: boolean;
  commissionOverride?: number | null;
}

export interface ServiceAddonItem {
  id: string;
  serviceId?: string;
  name: string;
  description?: string | null;
  durationMinutes: number;
  price: number;
  isActive?: boolean;
  createdAt?: string;
}

export interface ServiceItem {
  id: string;
  organizationId?: string;
  categoryId: string;
  categoryName?: string;
  name: string;
  code?: string;
  customerDescription?: string | null;
  internalNotes?: string | null;
  durationMinutes: number;
  bufferMinutes: number;
  totalSlotMinutes?: number;
  basePrice: number;
  taxRate: number;
  effectivePrice?: number; // Price resolved for active branch context
  imageUrl?: string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  genderTarget: 'ALL' | 'FEMALE' | 'MALE' | 'KIDS';
  onlineBookingEnabled: boolean;
  branchPricings: ServiceBranchPrice[];
  staffEligibilities?: ServiceStaffEligibilityItem[];
  addons: ServiceAddonItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ServiceWizardPayload {
  // Step 1: Basic Info
  name: string;
  categoryId: string;
  customerDescription?: string;
  internalNotes?: string;
  imageUrl?: string;
  genderTarget?: 'ALL' | 'FEMALE' | 'MALE' | 'KIDS';
  status?: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  onlineBookingEnabled?: boolean;

  // Step 2: Pricing
  basePrice: number;
  taxRate?: number;
  branchPricings: ServiceBranchPrice[];

  // Step 3: Duration & Buffer
  durationMinutes: number;
  bufferMinutes: number;

  // Step 4: Staff Eligibility
  staffIds: string[];

  // Step 5: Branch Availability
  availableBranchIds: string[];

  // Step 6: Add-ons
  addons: Array<{
    name: string;
    description?: string;
    durationMinutes: number;
    price: number;
  }>;
}
