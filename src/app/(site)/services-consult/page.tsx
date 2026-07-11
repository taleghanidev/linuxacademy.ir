import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { SITE_NAME_FA, SITE_URL, serviceJsonLd } from "@/lib/seo";
import { ServicesConsultClient } from "../spa-clients";

const DESCRIPTION =
  "جلسه مشاوره تخصصی دِواپس، زیرساخت ابری و هوش مصنوعی با نرخ ساعتی شفاف؛ زمان جلسه را آنلاین انتخاب و رزرو کنید.";

export const metadata: Metadata = {
  title: `مشاوره دِواپس، ابر و هوش مصنوعی | ${SITE_NAME_FA}`,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/services-consult` },
  openGraph: {
    title: "خدمات مشاوره لینوکس آکادمی",
    description: DESCRIPTION,
    url: `${SITE_URL}/services-consult`,
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
          name: "مشاوره دِواپس، زیرساخت ابری و هوش مصنوعی",
          description: DESCRIPTION,
          path: "/services-consult",
        })}
      />
      <ServicesConsultClient />
    </>
  );
}
