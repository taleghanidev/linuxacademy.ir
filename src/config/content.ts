// Static site content (formerly fetched from Strapi). Edit freely.
// Two languages: fa (default / RTL) and en.

export type Sponsor = { id: number; name: string; logo: string; link: string };
export type Faq = { id: number; question: string; answer: string };
export type Position = {
  id: number;
  position: string;
  companyName: string;
  companyUrl: string;
  description: string;
};
export type Article = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  content: string;
  cover: { url: string };
  publishedAt: string;
};

type Locale = "fa" | "en";

const SPONSORS: Record<Locale, Sponsor[]> = {
  fa: [
    { id: 1, name: "آروان کلود", logo: "/images/linuxlogo.png", link: "#" },
    { id: 2, name: "لیارا", logo: "/images/linuxlogo.png", link: "#" },
  ],
  en: [
    { id: 1, name: "ArvanCloud", logo: "/images/linuxlogo.png", link: "#" },
    { id: 2, name: "Liara", logo: "/images/linuxlogo.png", link: "#" },
  ],
};

const FAQS: Record<Locale, Faq[]> = {
  fa: [
    {
      id: 1,
      question: "چه خدماتی ارائه می‌دهید؟",
      answer: "مشاوره، معماری و پیاده‌سازی در حوزه‌های دِواپس، زیرساخت ابری و هوش مصنوعی.",
    },
    {
      id: 2,
      question: "چگونه می‌توانم مشاوره رزرو کنم؟",
      answer:
        "از دکمه «رزرو مشاوره» استفاده کنید، زمان و مدت جلسه را انتخاب و پرداخت را تکمیل کنید.",
    },
    {
      id: 3,
      question: "هزینه مشاوره چقدر است؟",
      answer: "هزینه بر اساس نرخ ساعتی محاسبه می‌شود و پیش از پرداخت به‌صورت شفاف نمایش داده می‌شود.",
    },
  ],
  en: [
    {
      id: 1,
      question: "What services do you offer?",
      answer: "Consulting, architecture and implementation across DevOps, cloud and AI.",
    },
    {
      id: 2,
      question: "How do I book a consultation?",
      answer:
        "Use the “Book a consultation” button, pick a time and duration, and complete payment.",
    },
    {
      id: 3,
      question: "How much does a consultation cost?",
      answer: "It's based on an hourly rate, shown transparently before you pay.",
    },
  ],
};

const POSITIONS: Record<Locale, Position[]> = {
  fa: [
    {
      id: 1,
      position: "مشاور ارشد دِواپس",
      companyName: "لینوکس آکادمی",
      companyUrl: "#",
      description: "طراحی و پیاده‌سازی زیرساخت‌های ابری و فرآیندهای دِواپس.",
    },
    {
      id: 2,
      position: "معمار ابر",
      companyName: "لینوکس آکادمی",
      companyUrl: "#",
      description: "معماری راهکارهای مقیاس‌پذیر و امن ابری.",
    },
  ],
  en: [
    {
      id: 1,
      position: "Senior DevOps Consultant",
      companyName: "Linux Academy",
      companyUrl: "#",
      description: "Designing and implementing cloud infrastructure and DevOps processes.",
    },
    {
      id: 2,
      position: "Cloud Architect",
      companyName: "Linux Academy",
      companyUrl: "#",
      description: "Architecting scalable, secure cloud solutions.",
    },
  ],
};

const ARTICLES: Record<Locale, Article[]> = {
  fa: [
    {
      id: 1,
      slug: "getting-started-with-devops",
      title: "شروع کار با دِواپس",
      summary: "مقدمه‌ای بر اصول دِواپس و اینکه چرا برای کسب‌وکارها اهمیت دارد.",
      content:
        "دِواپس فرهنگ و مجموعه‌ای از شیوه‌هاست که توسعه و عملیات را به هم نزدیک می‌کند. در این مقاله به مبانی می‌پردازیم.",
      cover: { url: "/images/consult.webp" },
      publishedAt: "2026-06-01T00:00:00.000Z",
    },
    {
      id: 2,
      slug: "cloud-architecture-basics",
      title: "مبانی معماری ابری",
      summary: "اصول طراحی زیرساخت ابری مقیاس‌پذیر و مقاوم.",
      content: "معماری ابری خوب بر پایه مقیاس‌پذیری، امنیت و پایداری بنا می‌شود.",
      cover: { url: "/images/architect.webp" },
      publishedAt: "2026-06-15T00:00:00.000Z",
    },
    {
      id: 3,
      slug: "ai-for-business",
      title: "هوش مصنوعی برای کسب‌وکار",
      summary: "چگونه هوش مصنوعی می‌تواند عملیات کسب‌وکار شما را متحول کند.",
      content: "هوش مصنوعی فرصت‌های تازه‌ای برای خودکارسازی و تحلیل داده فراهم می‌کند.",
      cover: { url: "/images/implement.webp" },
      publishedAt: "2026-07-01T00:00:00.000Z",
    },
  ],
  en: [
    {
      id: 1,
      slug: "getting-started-with-devops",
      title: "Getting Started with DevOps",
      summary: "An introduction to DevOps principles and why they matter for businesses.",
      content:
        "DevOps is a culture and set of practices that brings development and operations together. This article covers the fundamentals.",
      cover: { url: "/images/consult.webp" },
      publishedAt: "2026-06-01T00:00:00.000Z",
    },
    {
      id: 2,
      slug: "cloud-architecture-basics",
      title: "Cloud Architecture Basics",
      summary: "Principles for designing scalable, resilient cloud infrastructure.",
      content: "Good cloud architecture is built on scalability, security and reliability.",
      cover: { url: "/images/architect.webp" },
      publishedAt: "2026-06-15T00:00:00.000Z",
    },
    {
      id: 3,
      slug: "ai-for-business",
      title: "AI for Business",
      summary: "How AI can transform your business operations.",
      content: "AI opens up new opportunities for automation and data analysis.",
      cover: { url: "/images/implement.webp" },
      publishedAt: "2026-07-01T00:00:00.000Z",
    },
  ],
};

function locale(): Locale {
  if (typeof document === "undefined") return "fa"; // SSR default
  return document.documentElement.dir === "rtl" ? "fa" : "en";
}

export const getSponsors = (l: Locale = locale()) => SPONSORS[l];
export const getFaqs = (l: Locale = locale()) => FAQS[l];
export const getPositions = (l: Locale = locale()) => POSITIONS[l];

// Attach a Strapi-style rich-text "blocks" array so the article renderer works.
function withBlocks(a: Article) {
  return { ...a, blocks: [{ id: 1, __component: "shared.rich-text", body: a.content }] };
}

export const getArticles = (l: Locale = locale()) => ARTICLES[l].map(withBlocks);
export const getArticleBySlug = (slug: string, l: Locale = locale()) => {
  const found = ARTICLES[l].find((a) => a.slug === slug);
  return found ? withBlocks(found) : null;
};
