import { customers, db } from "@/db";

// Find or create a customer by email, keeping the latest name/phone.
export async function upsertCustomer(input: {
  name: string;
  email: string;
  phone: string;
}): Promise<string> {
  const email = input.email.trim().toLowerCase();
  const [row] = await db
    .insert(customers)
    .values({ name: input.name, email, phone: input.phone })
    .onConflictDoUpdate({
      target: customers.email,
      set: { name: input.name, phone: input.phone },
    })
    .returning({ id: customers.id });
  return row.id;
}

export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");
}
