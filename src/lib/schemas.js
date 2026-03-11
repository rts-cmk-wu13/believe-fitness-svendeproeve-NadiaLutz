import { z } from "zod"

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
})

export const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  repeatPassword: z.string().min(1, "Please repeat your password"),
}).refine((data) => data.password === data.repeatPassword, {
  message: "Passwords don't match",
  path: ["repeatPassword"],
})

export const newsletterSchema = z.object({
  email: z.email("Invalid email"),
})

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email"),
  message: z.string().min(1, "Message is required"),
})

export const createClassSchema = z.object({
  className: z.string().min(1, "Class name is required"),
  classDescription: z.string().optional(),
  classDay: z.string().min(1, "Please select a day"),
  classTime: z.string().min(1, "Please select a time"),
  trainerId: z.string().min(1, "Please select a trainer"),
  maxParticipants: z.coerce.number().int().min(1, "Must be at least 1"),
})
