import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { SITE_NAME_FA, SITE_URL, webPageJsonLd } from "@/lib/seo";
import { PrivacyPolicyClient } from "../spa-clients";

const DESCRIPTION = "سیاست حفظ حریم خصوصی لینوکس آکادمی: چه داده‌ای، چرا و چگونه نگهداری می‌شود.";

export const metadata: Metadata = {
  title: `حریم خصوصی | ${SITE_NAME_FA}`,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/privacy-policy` },
};

export default function Route() {
  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          name: "سیاست حفظ حریم خصوصی",
          description: DESCRIPTION,
          path: "/privacy-policy",
        })}
      />
      <PrivacyPolicyClient />
    </>
  );
}
