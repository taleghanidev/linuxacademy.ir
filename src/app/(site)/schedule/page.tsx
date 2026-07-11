import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { SITE_NAME_FA, SITE_URL, serviceJsonLd } from "@/lib/seo";
import { ScheduleClient } from "../spa-clients";

const DESCRIPTION =
  "زمان و مدت جلسه مشاوره دِواپس، ابر یا هوش مصنوعی را آنلاین انتخاب کنید؛ هزینه بر اساس نرخ ساعتی، پیش از پرداخت شفاف نمایش داده می‌شود.";

export const metadata: Metadata = {
  title: `رزرو جلسه مشاوره | ${SITE_NAME_FA}`,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/schedule` },
  openGraph: {
    title: "رزرو آنلاین جلسه مشاوره",
    description: DESCRIPTION,
    url: `${SITE_URL}/schedule`,
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
          name: "رزرو آنلاین جلسه مشاوره",
          description: DESCRIPTION,
          path: "/schedule",
        })}
      />
      <ScheduleClient />
    </>
  );
}
