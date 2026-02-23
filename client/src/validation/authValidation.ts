import {email, z} from 'zod';

export const registerSchema = z.object({
    name: z.string().min(3, 'Name must be more than 3 characters'),
    email: z.email('Invalid email'),
    password: z.string(),
})
export const loginSchema = z.object({
    email: z.email('Invalid email'),
    password: z.string(),
})

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;


