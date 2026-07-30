"use server"

import { db } from "@/db"
import { users, orders } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import { hashPassword } from "@/lib/hash"

export async function setPasswordAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const orderId = formData.get("orderId") as string

  if (!email || !password || !orderId) {
    throw new Error("Missing parameters")
  }

  // Security check: must have a paid order for this email
  const order = await db.query.orders.findFirst({
    where: and(eq(orders.razorpayOrderId, orderId), eq(orders.customerEmail, email)),
  })

  if (!order || order.status !== "paid") {
    throw new Error("Unauthorized password set")
  }

  // Update password hash
  const hash = hashPassword(password)
  await db.update(users).set({ passwordHash: hash }).where(eq(users.email, email))
}
