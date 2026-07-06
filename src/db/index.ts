// Drizzle client backed by node-postgres.
// Works with any Postgres over TCP — local containers in dev, and Neon in
// production (use Neon's *pooled* connection string on Vercel).

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

// Reuse the pool across hot reloads / serverless invocations.
const globalForDb = globalThis as unknown as { __pgPool?: Pool };

const pool =
  globalForDb.__pgPool ??
  new Pool({
    connectionString,
    // Keep the pool tiny on serverless; Neon's pooler handles fan-out.
    max: 1,
    ssl: /neon\.tech|sslmode=require/.test(connectionString)
      ? { rejectUnauthorized: false }
      : undefined,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__pgPool = pool;
}

export const db = drizzle(pool, { schema });

export * from "./schema";
