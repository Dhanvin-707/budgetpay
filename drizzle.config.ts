import { defineConfig } from "drizzle-kit"

const isTurso = process.env.TURSO_DATABASE_URL?.startsWith("libsql://")

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: isTurso ? "turso" : "sqlite",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL || "./data/budgetpay.db",
    authToken: isTurso ? process.env.TURSO_AUTH_TOKEN : undefined,
  },
})