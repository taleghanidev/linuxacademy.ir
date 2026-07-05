// Static product catalog. Prices live in code (no DB, no CMS).
// Amounts are in Toman. Update here when you change offerings.

export type ConsultingPackage = {
  key: string;
  title: string;
  description: string;
  hourlyRate: number; // Toman per hour
  minHours: number;
  maxHours: number;
};

export type SponsorshipTier = {
  key: string;
  title: string;
  description: string;
  price: number; // Rial
  perks: string[];
};

export const CONSULTING_PACKAGES: ConsultingPackage[] = [
  {
    key: "linux-consult",
    title: "Linux & DevOps Consultation",
    description: "One-on-one consulting on Linux, infrastructure, and DevOps.",
    hourlyRate: 5_000_000,
    minHours: 1,
    maxHours: 8,
  },
];

export const SPONSORSHIP_TIERS: SponsorshipTier[] = [
  {
    key: "bronze",
    title: "Bronze",
    description: "Logo placement on the sponsors page.",
    price: 20_000_000,
    perks: ["Logo on sponsors page", "1 month placement"],
  },
  {
    key: "silver",
    title: "Silver",
    description: "Homepage + sponsors page placement.",
    price: 50_000_000,
    perks: ["Homepage logo", "Sponsors page logo", "3 months placement"],
  },
  {
    key: "gold",
    title: "Gold",
    description: "Premium placement across the site.",
    price: 120_000_000,
    perks: ["Top homepage banner", "Newsletter mention", "6 months placement"],
  },
];

export function getPackage(key: string): ConsultingPackage | undefined {
  return CONSULTING_PACKAGES.find((p) => p.key === key);
}

export function getTier(key: string): SponsorshipTier | undefined {
  return SPONSORSHIP_TIERS.find((t) => t.key === key);
}
