import { z } from "zod"

export const newsletterSchema = z.object({
  email: z.email("Please enter a valid email address."),
})

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.email("Please enter a valid email address."),
  message: z.string().min(1, "Message is required."),
})
