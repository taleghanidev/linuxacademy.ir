import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { SITE_NAME_FA, SITE_URL, webPageJsonLd } from "@/lib/seo";
import { CoursesClient } from "../spa-clients";

const DESCRIPTION =
  "دوره‌های آموزشی لینوکس آکادمی؛ کارگاه‌های آنلاین زنده در گروه‌های کوچک با پروژه عملی، در حوزه هوش مصنوعی، دِواپس و زیرساخت ابری.";

export const metadata: Metadata = {
  title: `دوره‌ها | ${SITE_NAME_FA}`,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/courses` },
  openGraph: {
    title: "دوره‌های لینوکس آکادمی",
    description: DESCRIPTION,
    url: `${SITE_URL}/courses`,
    type: "website",
    locale: "fa_IR",
    siteName: SITE_NAME_FA,
  },
};

export default function Route() {
  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          name: "دوره‌های لینوکس آکادمی",
          description: DESCRIPTION,
          path: "/courses",
        })}
      />
      <CoursesClient />
    </>
  );
}
