/**
 * First-Time Onboarding Setup Wizard Types
 */

export interface SetupStepInfo {
  step: number;
  id: string;
  title: string;
  subtitle: string;
  description: string;
  isCompleted: boolean;
  isRequired: boolean;
}

export interface BusinessProfileSetupData {
  businessName: string;
  businessType: 'SALON' | 'SPA' | 'AESTHETIC_CLINIC' | 'WELLNESS_CENTER' | 'CHAIN';
  currency: string;
  timezone: string;
  taxNumber?: string;
  phone: string;
  email: string;
}

export interface LocationSetupData {
  branchName: string;
  branchCode: string;
  address: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  phone: string;
  operatingHours: {
    open: string;
    close: string;
    isOpenEveryday: boolean;
  };
}

export interface ServiceSetupData {
  categories: Array<{ name: string; services: Array<{ name: string; duration: number; price: number }> }>;
}

export interface StaffSetupData {
  staffMembers: Array<{ fullName: string; role: string; email: string; phone?: string }>;
}

export interface ProductSetupData {
  products: Array<{ name: string; sku: string; costPrice: number; retailPrice: number; initialStock: number }>;
}

export interface PaymentSetupData {
  acceptedMethods: string[];
  taxRatePercentage: number;
  invoicePrefix: string;
}

export interface CompleteSetupPayload {
  business: BusinessProfileSetupData;
  location: LocationSetupData;
  services: ServiceSetupData;
  staff: StaffSetupData;
  products: ProductSetupData;
  payments: PaymentSetupData;
}
