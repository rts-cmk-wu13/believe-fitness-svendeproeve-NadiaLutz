"use server"

import { newsletterSchema, contactSchema } from "@/lib/schemas"

export async function newsletterAction(prevState, formData) {
  const raw = { email: formData.get("email") }
  const result = newsletterSchema.safeParse(raw)

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  return { success: true }
}

export async function contactAction(prevState, formData) {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  }
  const result = contactSchema.safeParse(raw)

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  return { success: true }
}
