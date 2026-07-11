import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { SITE_NAME_FA, SITE_URL, webPageJsonLd } from "@/lib/seo";
import { ContactClient } from "../spa-clients";

const DESCRIPTION =
  "برای پرسش درباره خدمات مشاوره، معماری و پیاده‌سازی لینوکس آکادمی با ما در تماس باشید یا مستقیم جلسه مشاوره رزرو کنید.";

export const metadata: Metadata = {
  title: `تماس با ما | ${SITE_NAME_FA}`,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/contact` },
};

export default function Route() {
  return (
    <>
      <JsonLd
        data={{
          ...webPageJsonLd({
            name: "تماس با لینوکس آکادمی",
            description: DESCRIPTION,
            path: "/contact",
          }),
          "@type": "ContactPage",
        }}
      />
      <ContactClient />
    </>
  );
}
