import { drizzle } from "drizzle-orm/libsql"
import * as schema from "./schema"

const url = process.env.TURSO_DATABASE_URL || "file:./data/budgetpay.db"

let client: any

if (url.startsWith("file:")) {
  // Local SQLite - load native client
  const { createClient } = require("@libsql/client")
  client = createClient({ url })
} else {
  // Remote Turso - load web client for cloud environments (Vercel)
  const { createClient } = require("@libsql/client/web")
  client = createClient({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN,
    // Avoid Next.js global fetch intercept caching errors
    fetch: (input: any, init: any) => {
      return fetch(input, {
        ...init,
        cache: "no-store",
      })
    }
  })
}

export const db = drizzle(client, { schema })
export type Db = typeof db
