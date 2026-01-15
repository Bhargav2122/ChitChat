import {z} from 'zod';

export const registerSchema = z.object({
    name: z.string().min(3, "Name should contain atleast 3 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be 6 or more"),
})

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, "Password must be 6 or more"),
})

export type registerInput = z.infer<typeof registerSchema>
export type loginInput = z.infer<typeof loginSchema>
