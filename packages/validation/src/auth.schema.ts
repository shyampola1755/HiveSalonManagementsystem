import { z } from 'zod';

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, 'Please enter your email or mobile number')
    .refine(
      (val) => {
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        const isPhone = /^\+?[0-9]{10,14}$/.test(val.replace(/\D/g, ''));
        return isEmail || isPhone;
      },
      {
        message: 'Please enter a valid email address or 10-digit mobile number',
      }
    ),
  password: z
    .string()
    .min(8, 'Password must contain at least 8 characters')
    .max(100, 'Password is too long'),
  rememberMe: z.boolean().optional().default(false),
});

export const forgotPasswordSchema = z.object({
  identifier: z
    .string()
    .min(1, 'Please enter your registered email or mobile number'),
});

export const verifyOtpSchema = z.object({
  identifier: z.string().min(1, 'Identifier is required'),
  otp: z
    .string()
    .length(6, 'Verification code must be exactly 6 digits')
    .regex(/^\d{6}$/, 'Verification code must contain only numbers'),
});

export const resetPasswordSchema = z.object({
  identifier: z.string().min(1, 'Identifier is required'),
  otp: z.string().length(6, 'Verification code must be 6 digits'),
  newPassword: z
    .string()
    .min(8, 'Password must contain at least 8 characters')
    .max(100),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'New password must contain at least 8 characters')
    .max(100),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'New passwords do not match',
  path: ['confirmPassword'],
});

export const userScopeAssignSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  scopeType: z.enum(['ORGANIZATION', 'STATE', 'DISTRICT', 'CITY', 'BRANCH']),
  targetId: z.string().min(1, 'Target ID is required'),
});
