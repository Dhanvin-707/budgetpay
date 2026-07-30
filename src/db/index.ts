import { drizzle } from "drizzle-orm/libsql"
import { createClient } from "@libsql/client"
import * as schema from "./schema"

const url = process.env.TURSO_DATABASE_URL || "file:./data/budgetpay.db"

console.log("DB URL is configured:", !!process.env.TURSO_DATABASE_URL, "using local fallback:", !process.env.TURSO_DATABASE_URL)

const client = createClient({
  url,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

export const db = drizzle(client, { schema })
export type Db = typeof db