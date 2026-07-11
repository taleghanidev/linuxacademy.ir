import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { SITE_NAME_FA, SITE_URL, webPageJsonLd } from "@/lib/seo";
import { TermsOfServiceClient } from "../spa-clients";

const DESCRIPTION = "شرایط استفاده از خدمات لینوکس آکادمی، از رزرو مشاوره تا پرداخت و لغو جلسه.";

export const metadata: Metadata = {
  title: `شرایط استفاده | ${SITE_NAME_FA}`,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/terms-of-service` },
};

export default function Route() {
  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          name: "شرایط استفاده از خدمات",
          description: DESCRIPTION,
          path: "/terms-of-service",
        })}
      />
      <TermsOfServiceClient />
    </>
  );
}
