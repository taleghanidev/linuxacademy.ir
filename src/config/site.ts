// Static global site settings (formerly fetched from Strapi /api/global).
// Everything here is static — edit values directly.

export type GlobalSettings = {
  siteNameEn: string;
  siteNameFa: string;
  siteDescriptionEn: string;
  siteDescriptionFa: string;
  favicon: string;
  logo: string;
  hourlyRate: number; // Toman per hour (used by the booking form)
  metaTitleEn: string;
  metaTitleFa: string;
  metaDescriptionEn: string;
  metaDescriptionFa: string;
  heroImage: string;
  aboutImage: string;
};

export const SITE_SETTINGS: GlobalSettings = {
  siteNameEn: "Linux Academy",
  siteNameFa: "لینوکس آکادمی",
  siteDescriptionEn: "DevOps, cloud infrastructure and AI consulting for modern businesses.",
  siteDescriptionFa: "دِواپس، زیرساخت‌های ابری و هوش مصنوعی برای کسب‌وکارهای مدرن",
  favicon: "/images/favicon.ico",
  logo: "/images/linuxlogo.png",
  hourlyRate: 3_000_000,
  metaTitleEn: "Linux Academy",
  metaTitleFa: "لینوکس آکادمی",
  metaDescriptionEn: "DevOps, cloud infrastructure and AI consulting.",
  metaDescriptionFa: "دِواپس، زیرساخت‌های ابری و هوش مصنوعی",
  heroImage: "/images/hero-me.webp",
  aboutImage: "/images/about-me.webp",
};
