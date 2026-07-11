import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { SITE_NAME_FA, SITE_URL, serviceJsonLd } from "@/lib/seo";
import { ServicesImplementClient } from "../spa-clients";

const DESCRIPTION =
  "پیاده‌سازی عملی دِواپس، زیرساخت ابری و راهکارهای هوش مصنوعی؛ از راه‌اندازی CI/CD و زیرساخت به‌صورت کد تا استقرار مدل‌های هوش مصنوعی.";

export const metadata: Metadata = {
  title: `پیاده‌سازی دِواپس، ابر و هوش مصنوعی | ${SITE_NAME_FA}`,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/services-implement` },
  openGraph: {
    title: "خدمات پیاده‌سازی لینوکس آکادمی",
    description: DESCRIPTION,
    url: `${SITE_URL}/services-implement`,
    type: "website",
    locale: "fa_IR",
    siteName: SITE_NAME_FA,
  },
};

export default function Route() {
  return (
    <>
      <JsonLd
        data={serviceJsonLd({
          name: "پیاده‌سازی دِواپس، زیرساخت ابری و هوش مصنوعی",
          description: DESCRIPTION,
          path: "/services-implement",
        })}
      />
      <ServicesImplementClient />
    </>
  );
}
