import { email, z } from 'zod';

export const registerSchema = z.object({
    fullname: z.string().trim().min(3, "Name is too short"),
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password must be 6 character"),
    avatar:z.string().optional(),
});

export const loginSchema = z.object({
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password must be 6 character"),
     avatar:z.string().optional(),
})


export type registerInput = z.infer< typeof registerSchema>;
export type loginInput = z.infer<typeof loginSchema>;
