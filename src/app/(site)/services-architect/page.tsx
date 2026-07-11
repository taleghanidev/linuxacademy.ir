import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { SITE_NAME_FA, SITE_URL, serviceJsonLd } from "@/lib/seo";
import { ServicesArchitectClient } from "../spa-clients";

const DESCRIPTION =
  "طراحی معماری زیرساخت ابری مقیاس‌پذیر، امن و مقرون‌به‌صرفه برای محصول شما؛ از انتخاب مدل استقرار تا نقشه فنی کامل سامانه.";

export const metadata: Metadata = {
  title: `معماری زیرساخت ابری | ${SITE_NAME_FA}`,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/services-architect` },
  openGraph: {
    title: "خدمات معماری لینوکس آکادمی",
    description: DESCRIPTION,
    url: `${SITE_URL}/services-architect`,
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
          name: "معماری زیرساخت ابری",
          description: DESCRIPTION,
          path: "/services-architect",
        })}
      />
      <ServicesArchitectClient />
    </>
  );
}
