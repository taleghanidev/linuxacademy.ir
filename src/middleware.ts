import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Only the admin dashboard requires login. Everything else is public.
// (/api/admin/* additionally enforces the CLERK_ADMIN_EMAILS allowlist in-route.)
const isProtected = createRouteMatcher(["/admin(.*)"]);
const isSignIn = createRouteMatcher(["/sign-in(.*)"]);
const isAdminApi = createRouteMatcher(["/api/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // Already signed in? /sign-in should land on the dashboard, not the site.
  if (isSignIn(req)) {
    const { userId } = await auth();
    if (userId) return NextResponse.redirect(new URL("/admin", req.url));
    return;
  }

  // Admin APIs: unauthenticated calls get a JSON 401 (the allowlist check
  // inside each route then decides 403). Avoids HTML redirects on API paths.
  if (isAdminApi(req)) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
    return;
  }

  if (isProtected(req)) {
    await auth.protect({
      unauthenticatedUrl: new URL("/sign-in", req.url).toString(),
    });
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files, run on everything else
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
