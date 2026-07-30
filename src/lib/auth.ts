import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { verifyPassword } from "./hash"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const adminEmail = process.env.AUTH_ADMIN_EMAIL
        const adminPassword = process.env.AUTH_ADMIN_PASSWORD

        // Admin check
        if (credentials.email === adminEmail && credentials.password === adminPassword) {
          return { id: "admin", name: "Admin", email: adminEmail, role: "admin" }
        }

        // Database user (customer) check
        try {
          const user = await db.query.users.findFirst({
            where: eq(users.email, credentials.email),
          })
          if (user && user.passwordHash) {
            const isValid = verifyPassword(credentials.password, user.passwordHash)
            if (isValid) {
              return { id: user.id, name: user.name, email: user.email, role: "customer" }
            }
          }
        } catch (err) {
          console.error("Auth db error:", err)
        }

        return null
      },
    }),
  ],
  pages: {
    signIn: "/login", // Universal login page
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.role = token.role
        session.user.id = token.sub
      }
      return session
    },
  },
  secret: process.env.AUTH_SECRET,
}