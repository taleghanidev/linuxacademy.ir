import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

// Admin allowlist — comma-separated verified emails. Shared by admin pages and
// admin API route handlers so the gate is defined in exactly one place.

function allowedEmails(): string[] {
  return (process.env.CLERK_ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

/** True if the current Clerk user is an allowlisted admin (fail-closed in prod). */
export async function isAdmin(): Promise<boolean> {
  const allowed = allowedEmails();
  if (allowed.length === 0) return process.env.NODE_ENV !== "production";

  const user = await currentUser();
  const verified = (user?.emailAddresses ?? [])
    .filter((e) => e.verification?.status === "verified")
    .map((e) => e.emailAddress.toLowerCase());

  return verified.some((e) => allowed.includes(e));
}

/** For server pages/layouts: 404 (hide the route) unless the user is an admin. */
export async function assertAdminPage(): Promise<void> {
  if (!(await isAdmin())) notFound();
}
