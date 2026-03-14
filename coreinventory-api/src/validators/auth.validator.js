import { z } from 'zod';

export const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['admin', 'manager', 'staff']).optional()
});

export const signInSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format')
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters')
});
