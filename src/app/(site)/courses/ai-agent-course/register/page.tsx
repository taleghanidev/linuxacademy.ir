import type { Metadata } from "next";
import { SITE_NAME_FA, SITE_URL } from "@/lib/seo";
import { CourseRegisterClient } from "../../../spa-clients";

const PATH = "/courses/ai-agent-course/register";

export const metadata: Metadata = {
  title: `ثبت‌نام در دوره ساخت ایجنت هوش مصنوعی | ${SITE_NAME_FA}`,
  description:
    "ثبت‌نام دوره ساخت ایجنت هوش مصنوعی: واریز شهریه به حساب اعلام‌شده، تکمیل فرم و بارگذاری تصویر رسید پرداخت.",
  alternates: { canonical: `${SITE_URL}${PATH}` },
  // A form page has nothing to offer search; keep it out of the index.
  robots: { index: false, follow: true },
};

export default function Route() {
  return <CourseRegisterClient />;
}
