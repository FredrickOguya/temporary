import { defineConfig } from "drizzle-kit"
import * as dotenv from "dotenv"

// Use .env.test in tests and in CI, otherwise .env.local
const useTestEnv = process.env.NODE_ENV === "test" || process.env.CI === "true"
const envFile = useTestEnv ? ".env.test" : ".env.local"
dotenv.config({ path: envFile })

if (!process.env.DATABASE_URL) {
  throw new Error(`DATABASE_URL is not set (tried loading ${envFile})`)
}

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
})