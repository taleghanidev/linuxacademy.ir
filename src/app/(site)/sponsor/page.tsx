import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { SITE_NAME_FA, SITE_URL, webPageJsonLd } from "@/lib/seo";
import { SponsorshipClient } from "../spa-clients";

const DESCRIPTION =
  "با حمایت مالی از لینوکس آکادمی، برند شما در کنار محتوای تخصصی دِواپس، ابر و هوش مصنوعی دیده می‌شود.";

export const metadata: Metadata = {
  title: `حمایت مالی (اسپانسرشیپ) | ${SITE_NAME_FA}`,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/sponsor` },
};

export default function Route() {
  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          name: "حمایت مالی از لینوکس آکادمی",
          description: DESCRIPTION,
          path: "/sponsor",
        })}
      />
      <SponsorshipClient />
    </>
  );
}
