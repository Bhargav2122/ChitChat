import { z } from 'zod';

export const RegisterSchema = z.object({
    name: z.string().min(3, 'Name must be atleast 3 characters'),
    email: z.email('Invalid email'),
    password: z.string().min(6, 'Password must be more than 6 characters'),
});
export const LoginSchema = z.object({
    email: z.email('Invalid email'),
    password: z.string().min(6, 'Password must be more than 6 characters'),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
