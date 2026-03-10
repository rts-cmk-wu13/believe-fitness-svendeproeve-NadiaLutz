import { z } from "zod"

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required."),
  password: z.string().min(1, "Password is required."),
})

export const signupSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  repeatPassword: z.string().min(1, "Please repeat your password."),
}).refine((data) => data.password === data.repeatPassword, {
  message: "Passwords do not match.",
  path: ["repeatPassword"],
})

export const newsletterSchema = z.object({
  email: z.email("Please enter a valid email address."),
})

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.email("Please enter a valid email address."),
  message: z.string().min(1, "Message is required."),
})
