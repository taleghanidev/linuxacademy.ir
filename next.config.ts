import type { NextConfig } from "next";

// Baseline security headers for every route. HSTS is added by Vercel already.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

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
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      // Cross-origin MCP discovery (the /api/mcp endpoint already sends CORS).
      {
        source: "/.well-known/mcp.json",
        headers: [{ key: "Access-Control-Allow-Origin", value: "*" }],
      },
    ];
  },
  async rewrites() {
    // Markdown mirrors for AI agents: /blog/<slug>.md → raw markdown route
    // (noindex + canonical headers set in src/app/blog-md/[slug]/route.ts).
    return [{ source: "/blog/:slug.md", destination: "/blog-md/:slug" }];
  },
};

export default nextConfig;
