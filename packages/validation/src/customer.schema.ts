import { z } from 'zod';

export const createCustomerSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: 'Customer name must be at least 2 characters.' })
    .max(100, { message: 'Customer name cannot exceed 100 characters.' }),
  phone: z
    .string()
    .min(10, { message: 'Please enter a valid 10-digit mobile number.' })
    .regex(/^[0-9+\s()-]{10,20}$/, { message: 'Please enter a valid mobile number format.' }),
  email: z
    .string()
    .email({ message: 'Please enter a valid email address.' })
    .optional()
    .or(z.literal('')),
  gender: z.enum(['FEMALE', 'MALE', 'OTHER', 'UNSPECIFIED']).optional().default('UNSPECIFIED'),
  birthDate: z.string().optional().or(z.literal('')),
  address: z.string().max(255).optional().or(z.literal('')),
  preferredBranchId: z.string().optional().or(z.literal('')),
  preferredStylistId: z.string().optional().or(z.literal('')),
  customerSource: z
    .enum(['WALK_IN', 'INSTAGRAM', 'GOOGLE', 'REFERRAL', 'WEBSITE', 'CAMPAIGN', 'PHONE_INQUIRY'])
    .optional()
    .default('WALK_IN'),
  referredByCustomerId: z.string().optional().or(z.literal('')),
  tags: z.array(z.string()).optional().default([]),
  notes: z.string().max(1000).optional().or(z.literal('')),
});

export const updateCustomerSchema = createCustomerSchema.partial().extend({
  hairProfile: z
    .object({
      texture: z.enum(['FINE', 'MEDIUM', 'COARSE', 'EXTRA_COARSE']).optional(),
      porosity: z.enum(['LOW', 'NORMAL', 'HIGH']).optional(),
      scalpType: z.enum(['NORMAL', 'OILY', 'DRY', 'SENSITIVE', 'DANDRUFF_PRONE']).optional(),
      density: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
      curlPattern: z.enum(['STRAIGHT_1A_1C', 'WAVY_2A_2C', 'CURLY_3A_3C', 'COILY_4A_4C']).optional(),
      hairLength: z.enum(['SHORT', 'SHOULDER', 'MID_BACK', 'LONG', 'EXTRA_LONG']).optional(),
      chemicalHistory: z.array(z.string()).optional(),
    })
    .optional(),
  skinProfile: z
    .object({
      skinType: z.enum(['NORMAL', 'OILY', 'DRY', 'COMBINATION', 'SENSITIVE']).optional(),
      undertone: z.enum(['WARM', 'COOL', 'NEUTRAL', 'OLIVE']).optional(),
      allergies: z.array(z.string()).optional(),
      sensitivities: z.array(z.string()).optional(),
      skinConcerns: z.array(z.string()).optional(),
    })
    .optional(),
  preferences: z
    .object({
      beverages: z.array(z.string()).optional(),
      quietAppointment: z.boolean().optional(),
      pressurePreference: z.enum(['LIGHT', 'MEDIUM', 'FIRM', 'DEEP_TISSUE']).optional(),
      musicPreference: z.string().optional(),
      scalpSensitivity: z.enum(['NORMAL', 'MILD', 'HIGH']).optional(),
      customNotes: z.string().optional(),
    })
    .optional(),
});

export const colorFormulaSchema = z.object({
  formulaName: z.string().min(2, { message: 'Formula name is required.' }),
  brand: z.string().min(2, { message: 'Color brand is required (e.g. L\'Oréal Majirel, Wella Koleston).' }),
  formulaMix: z.string().min(2, { message: 'Formula shade mix ratio is required (e.g. 7.1 + 8.1 1:1).' }),
  developerVolume: z.string().min(1, { message: 'Developer volume is required (e.g. 20 Vol / 6%).' }),
  developerRatio: z.string().default('1:1.5'),
  processingTimeMinutes: z.coerce.number().min(5).max(120).default(35),
  targetHairTone: z.string().optional(),
  stylistNotes: z.string().optional(),
});

export const patchTestSchema = z.object({
  testType: z.enum(['HAIR_COLOR_DYE', 'BLEACH', 'KERATIN', 'CHEMICAL_PEEL', 'LASH_GLUE']),
  chemicalOrBrandName: z.string().min(2, { message: 'Chemical or product name is required.' }),
  testedAt: z.string().optional(),
  result: z.enum(['PASSED', 'FAILED', 'PENDING']).default('PASSED'),
  validUntil: z.string().optional(),
  notes: z.string().optional(),
});

export const customerNoteSchema = z.object({
  note: z.string().min(1, { message: 'Note text cannot be empty.' }),
  isPrivate: z.boolean().default(false),
  category: z.enum(['GENERAL', 'TECH_FORMULA', 'BEHAVIORAL', 'MEDICAL']).default('GENERAL'),
});

export const walletTopupSchema = z.object({
  amount: z.coerce.number().min(100, { message: 'Minimum wallet recharge amount is ₹100.00' }),
  paymentMethod: z.enum(['UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'CASH', 'NET_BANKING']).default('UPI'),
  reason: z.string().default('Prepaid Wallet Recharge'),
  bonusCashback: z.coerce.number().default(0),
});
