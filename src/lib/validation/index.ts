import * as z from "zod"

export const SignupSchema = z.object({
    name: z.string().min(2, { message: "Name is too short" }),
    username: z.string().min(2, { message: "Username is too short" }),
    email: z.string().email(),
    password: z.string()
        .min(8, { message: 'Password must have at least 8 characters' })
        .refine((value) => /[A-Z]/.test(value), { message: "Password must have at least one uppercase letter" })
        .refine((value) => /[a-z]/.test(value), { message: "Password must have at least one lowercase letter" })
        .refine((value) => /[!@#$%^&*(),.?":{}|<>-_]/.test(value), { message: "Password must have at least one special character" })
})