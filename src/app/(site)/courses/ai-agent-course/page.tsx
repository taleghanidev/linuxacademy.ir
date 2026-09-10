import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { AI_AGENT_COURSE, lastSessionDate } from "@/config/courses";
import aiAgentCourseFa from "@/language/fa/pages/aiAgentCourse";
import { courseJsonLd, faqJsonLd, SITE_NAME_FA, SITE_URL } from "@/lib/seo";
import { AiAgentCourseClient } from "../../spa-clients";

const PATH = "/courses/ai-agent-course";

const DESCRIPTION =
  "کارگاه آنلاین زنده ساخت ایجنت هوش مصنوعی؛ شروع جمعه ۱ آبان ۱۴۰۵، جمعه‌ها ۱۲:۰۰ تا ۱۴:۰۰ به وقت تهران، ۱۰ جلسه و ۲۰ ساعت، ۱۲ فصل و ۹۳ درس، ظرفیت ۱۲ نفر، همراه با پروژه پایانی. شهریه ۴,۹۸۰,۰۰۰ تومان برای ساکنان ایران و ۱۰۰ دلار استرالیا برای خارج از ایران.";

export const metadata: Metadata = {
  title: `دوره ساخت ایجنت هوش مصنوعی | ${SITE_NAME_FA}`,
  description: DESCRIPTION,
  keywords: [
    "دوره هوش مصنوعی",
    "ساخت ایجنت هوش مصنوعی",
    "AI agent",
    "Claude Code",
    "کارگاه آنلاین هوش مصنوعی",
    "آموزش ایجنت",
  ],
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: {
    title: "دوره جامع ساخت ایجنت هوش مصنوعی",
    description: DESCRIPTION,
    url: `${SITE_URL}${PATH}`,
    type: "website",
    locale: "fa_IR",
    siteName: SITE_NAME_FA,
  },
};

export default function Route() {
  return (
    <>
      <JsonLd
        data={courseJsonLd({
          name: "دوره جامع ساخت ایجنت هوش مصنوعی",
          description: DESCRIPTION,
          path: PATH,
          hours: AI_AGENT_COURSE.hours,
          sessions: AI_AGENT_COURSE.sessions,
          byDay: "Friday",
          startDate: AI_AGENT_COURSE.startDate,
          endDate: lastSessionDate(AI_AGENT_COURSE),
          startTime: AI_AGENT_COURSE.startTime,
          endTime: AI_AGENT_COURSE.endTime,
          price: AI_AGENT_COURSE.price,
        })}
      />
      <JsonLd data={faqJsonLd(aiAgentCourseFa.faq.items)} />
      <AiAgentCourseClient />
    </>
  );
}
