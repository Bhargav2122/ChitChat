import { email, z } from 'zod';

export const registerInput = z.object({
    fullname: z.string().trim().min(3, "Name is too short"),
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password must be 6 character")
});

export const loginInput = z.object({
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password must be 6 character")
})

export const googleAuthInput = z.object({
    googleId: z.string(),
    fullname: z.string().trim().min(3, "Name is too short"),
    email: z.email("Invalid email"),
})


export type registerSchema = z.infer< typeof registerInput>;
export type loginSchema = z.infer<typeof loginInput>;
export type googleAuthSchema = z.infer<typeof googleAuthInput>;
