// Reusable, bilingual display text for the product catalog (consulting packages
// and sponsorship tiers). Keys + prices live in products.ts (used by the API);
// all user-facing text lives here so it can be localized and reused.

type Locale = "fa" | "en";

type TierText = { title: string; description: string; perks: string[] };
type PackageText = { title: string; description: string };

export const TIER_TEXT: Record<Locale, Record<string, TierText>> = {
  fa: {
    bronze: {
      title: "برنز",
      description: "نمایش لوگو در صفحه حامیان.",
      perks: ["لوگو در صفحه حامیان", "یک ماه نمایش"],
    },
    silver: {
      title: "نقره‌ای",
      description: "نمایش در صفحه اصلی و صفحه حامیان.",
      perks: ["لوگو در صفحه اصلی", "لوگو در صفحه حامیان", "سه ماه نمایش"],
    },
    gold: {
      title: "طلایی",
      description: "نمایش ویژه در سراسر سایت.",
      perks: ["بنر بالای صفحه اصلی", "معرفی در خبرنامه", "شش ماه نمایش"],
    },
  },
  en: {
    bronze: {
      title: "Bronze",
      description: "Logo placement on the sponsors page.",
      perks: ["Logo on sponsors page", "1 month placement"],
    },
    silver: {
      title: "Silver",
      description: "Homepage + sponsors page placement.",
      perks: ["Homepage logo", "Sponsors page logo", "3 months placement"],
    },
    gold: {
      title: "Gold",
      description: "Premium placement across the site.",
      perks: ["Top homepage banner", "Newsletter mention", "6 months placement"],
    },
  },
};

export const PACKAGE_TEXT: Record<Locale, Record<string, PackageText>> = {
  fa: {
    "linux-consult": {
      title: "مشاوره لینوکس و دِواپس",
      description: "مشاوره اختصاصی درباره لینوکس، زیرساخت و دِواپس.",
    },
  },
  en: {
    "linux-consult": {
      title: "Linux & DevOps Consultation",
      description: "One-on-one consulting on Linux, infrastructure, and DevOps.",
    },
  },
};

function locale(): Locale {
  if (typeof document === "undefined") return "fa"; // SSR default
  return document.documentElement.dir === "rtl" ? "fa" : "en";
}

export const tierText = (key: string, l: Locale = locale()): TierText =>
  TIER_TEXT[l][key] ?? TIER_TEXT.en[key];
export const packageText = (key: string, l: Locale = locale()): PackageText =>
  PACKAGE_TEXT[l][key] ?? PACKAGE_TEXT.en[key];
