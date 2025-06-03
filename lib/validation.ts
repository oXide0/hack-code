import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(64, 'Password must be at most 64 characters')
});

export const onboardingSchema = z.object({
    firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
    lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(64, 'Password must be at most 64 characters')
});
