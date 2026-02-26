import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod/v4";

export const env = createEnv({
  // Server-side env vars (never exposed to client)
  server: {
    // Database (Neon)
    DATABASE_URL: z.url(),
    DIRECT_URL: z.url(),

    // Auth (Better Auth)
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.url(),

    // Email (Resend)
    RESEND_API_KEY: z.string().startsWith("re_"),
    EMAIL_FROM: z.email(),

    // AI (Vercel AI SDK) — at least one should be set
    OPENAI_API_KEY: z.string().startsWith("sk-").optional(),
    AI_GATEWAY_API_KEY: z.string().min(1).optional(),

    // File Storage (Vercel Blob)
    BLOB_READ_WRITE_TOKEN: z.string().startsWith("vercel_blob_"),

    // Inngest
    INNGEST_EVENT_KEY: z.string().min(1).optional(),
    INNGEST_SIGNING_KEY: z.string().min(1).optional(),

    // Node environment
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  },

  // Client-side env vars (must be prefixed with NEXT_PUBLIC_)
  client: {
    NEXT_PUBLIC_APP_URL: z.url(),
  },

  // Runtime env — must destructure ALL vars explicitly
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    AI_GATEWAY_API_KEY: process.env.AI_GATEWAY_API_KEY,
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
    INNGEST_EVENT_KEY: process.env.INNGEST_EVENT_KEY,
    INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },

  // Skip validation in Docker builds or CI
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  // Treat empty strings as undefined
  emptyStringAsUndefined: true,
});
