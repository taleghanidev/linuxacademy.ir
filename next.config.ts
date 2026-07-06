import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root (repo has multiple lockfiles).
  turbopack: {
    root: __dirname,
  },
  // The migrated SPA is pre-existing, working code that was loosely typed for
  // Vite. Don't let strict TS/ESLint block production builds; we tighten these
  // incrementally. (Our own new code is checked via `npm run typecheck`.)
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
