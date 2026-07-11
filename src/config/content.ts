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
  updatedAt?: string;
  faq?: { question: string; answer: string }[];
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
      title: "شروع کار با دِواپس: راهنمای گام‌به‌گام برای کسب‌وکارها",
      summary:
        "دِواپس چیست، چرا سرعت و پایداری تحویل نرم‌افزار را چند برابر می‌کند و چگونه در ۶ گام عملی آن را در سازمان خود شروع کنید.",
      content: `**پاسخ کوتاه:** دِواپس (DevOps) مجموعه‌ای از فرهنگ، شیوه‌ها و ابزارهاست که تیم توسعه و تیم عملیات را یکپارچه می‌کند تا نرم‌افزار سریع‌تر، پایدارتر و ایمن‌تر به دست کاربر برسد. برای شروع، سه قدم اول این‌هاست: خودکارسازی استقرار با CI/CD، تعریف زیرساخت به‌صورت کد (IaC) و اندازه‌گیری چهار شاخص کلیدی تحویل نرم‌افزار.

## دِواپس چیست؟

دِواپس ترکیب دو واژه Development (توسعه) و Operations (عملیات) است. به‌جای اینکه برنامه‌نویس‌ها کد بنویسند و «به آن‌طرف دیوار» پرتاب کنند تا تیم زیرساخت مستقرش کند، در دِواپس هر دو تیم با فرآیندها و ابزارهای مشترک، مسئولیت کل چرخه عمر نرم‌افزار را با هم بر عهده می‌گیرند.

سه رکن اصلی آن:

- **فرهنگ همکاری:** مسئولیت مشترک از کد تا محیط عملیاتی
- **خودکارسازی:** ساخت، تست و استقرار بدون دخالت دستی (CI/CD)
- **اندازه‌گیری و بازخورد:** پایش مستمر و بهبود بر اساس داده

## چرا دِواپس برای کسب‌وکار شما مهم است؟

تفاوت عملکرد تیم‌هایی که دِواپس را درست پیاده کرده‌اند با بقیه، حاشیه‌ای نیست؛ چند ده برابری است. بر اساس پژوهش چندساله DORA (تیم تحقیقاتی گوگل، گزارش Accelerate State of DevOps)، تیم‌های «نخبه» نسبت به تیم‌های کم‌بازده صدها برابر بیشتر استقرار انجام می‌دهند و زمان رسیدن تغییر از کامیت تا محیط عملیاتی آن‌ها به‌جای چند ماه، کمتر از یک روز است.

برای مدیر کسب‌وکار این یعنی: ایده‌ی امروز، ویژگی قابل‌فروشِ هفته بعد است — نه فصل بعد.

## تیم‌های موفق دِواپس چه شاخص‌هایی را اندازه می‌گیرند؟

پژوهش DORA چهار شاخص کلیدی (Four Key Metrics) را معیار سلامت تحویل نرم‌افزار می‌داند:

| شاخص | تیم نخبه | تیم کم‌بازده |
| --- | --- | --- |
| تناوب استقرار | بنا به نیاز، چند بار در روز | کمتر از یک بار در ماه |
| زمان تحویل تغییر | کمتر از یک روز | بیش از یک ماه |
| زمان بازیابی از خرابی | کمتر از یک ساعت | بیش از یک هفته |
| نرخ شکست تغییرات | حدود ۵٪ | بیش از ۳۰٪ |

اگر امروز هیچ‌کدام از این چهار عدد را نمی‌دانید، نخستین قدمِ دِواپس برای شما اندازه‌گیری همین‌هاست.

## چگونه دِواپس را شروع کنیم؟ (۶ گام عملی)

1. **وضعیت فعلی را بسنجید.** چهار شاخص DORA را برای یک محصول محاسبه کنید تا خط مبنا داشته باشید.
2. **کنترل نسخه را کامل کنید.** همه‌چیز — کد، پیکربندی، اسکریپت‌های استقرار — در Git باشد.
3. **یکپارچه‌سازی مداوم (CI) راه بیندازید.** با هر کامیت، ساخت و تست خودکار اجرا شود (GitLab CI، GitHub Actions یا Jenkins).
4. **استقرار را خودکار کنید (CD).** استقرار دستی روی سرور را حذف کنید؛ هر استقرار باید تکرارپذیر و قابل‌بازگشت باشد.
5. **زیرساخت را به‌صورت کد تعریف کنید (IaC).** با ابزارهایی مثل Terraform یا Ansible، ساخت سرور و شبکه هم نسخه‌دار و بازتولیدپذیر می‌شود.
6. **پایش و بازخورد بسازید.** متریک، لاگ و هشدار (مثلاً Prometheus و Grafana) تا مشکل را پیش از مشتری ببینید.

## اشتباه‌های رایج در شروع دِواپس

- **خرید ابزار به‌جای تغییر فرآیند:** کوبرنتیز خریدنی نیست که فرهنگ بیاورد؛ اول فرآیند، بعد ابزار.
- **تیم جداگانه «دِواپس»:** ساختن یک سیلوی جدید بین توسعه و عملیات، دقیقاً خلاف هدف است.
- **شروع بزرگ:** به‌جای تحول کل سازمان، از یک محصول و یک خط استقرار شروع کنید.
- **نادیده‌گرفتن امنیت:** بررسی‌های امنیتی را از روز اول در خط CI/CD بگنجانید (DevSecOps).

## جمع‌بندی

دِواپس پروژه‌ای یک‌باره نیست؛ مسیر بهبود مستمر است که با خودکارسازی استقرار، زیرساختِ کدشده و اندازه‌گیری چهار شاخص کلیدی شروع می‌شود. تیم لینوکس آکادمی در [پیاده‌سازی دِواپس](/services-implement) و [مشاوره معماری](/services-consult) کنار شماست — برای شروع می‌توانید [یک جلسه مشاوره رزرو کنید](/schedule).

## پرسش‌های پرتکرار

### پیاده‌سازی دِواپس چقدر طول می‌کشد؟

راه‌اندازی اولیه CI/CD برای یک محصول معمولاً بین ۲ تا ۶ هفته زمان می‌برد. رسیدن به بلوغ سازمانی (خودکارسازی کامل، IaC و فرهنگ مسئولیت مشترک) معمولاً ۶ تا ۱۸ ماه است.

### آیا دِواپس فقط برای شرکت‌های بزرگ است؟

خیر. تیم‌های کوچک سریع‌تر نتیجه می‌گیرند، چون فرآیندهای کمتری باید تغییر کند. حتی یک تیم ۳ نفره از استقرار خودکار و زیرساختِ کدشده سود می‌برد.

### دِواپس با چه ابزارهایی شروع می‌شود؟

ترکیب رایج: Git برای کنترل نسخه، GitHub Actions یا GitLab CI برای CI/CD، Docker برای بسته‌بندی، Terraform یا Ansible برای زیرساخت به‌صورت کد و Prometheus/Grafana برای پایش.

### تفاوت دِواپس و DevSecOps چیست؟

DevSecOps همان دِواپس است با این تفاوت که کنترل‌های امنیتی (اسکن وابستگی‌ها، تحلیل ایستای کد، بررسی پیکربندی) از ابتدا داخل خط CI/CD خودکار می‌شوند، نه در انتها و به‌صورت دستی.`,
      cover: { url: "/images/consult.webp" },
      publishedAt: "2026-06-01T00:00:00.000Z",
      updatedAt: "2026-07-11T00:00:00.000Z",
      faq: [
        {
          question: "پیاده‌سازی دِواپس چقدر طول می‌کشد؟",
          answer:
            "راه‌اندازی اولیه CI/CD برای یک محصول معمولاً بین ۲ تا ۶ هفته زمان می‌برد؛ رسیدن به بلوغ سازمانی معمولاً ۶ تا ۱۸ ماه است.",
        },
        {
          question: "آیا دِواپس فقط برای شرکت‌های بزرگ است؟",
          answer:
            "خیر. تیم‌های کوچک به‌دلیل فرآیندهای ساده‌تر معمولاً سریع‌تر از دِواپس نتیجه می‌گیرند؛ حتی یک تیم ۳ نفره از استقرار خودکار سود می‌برد.",
        },
        {
          question: "دِواپس با چه ابزارهایی شروع می‌شود؟",
          answer:
            "ترکیب رایج: Git، GitHub Actions یا GitLab CI برای CI/CD، Docker، Terraform یا Ansible برای زیرساخت به‌صورت کد و Prometheus/Grafana برای پایش.",
        },
        {
          question: "تفاوت دِواپس و DevSecOps چیست؟",
          answer:
            "DevSecOps همان دِواپس است با این تفاوت که کنترل‌های امنیتی از ابتدا و به‌صورت خودکار در خط CI/CD قرار می‌گیرند.",
        },
      ],
    },
    {
      id: 2,
      slug: "cloud-architecture-basics",
      title: "مبانی معماری ابری: طراحی زیرساختی مقیاس‌پذیر و مقاوم",
      summary:
        "معماری ابری چیست، پنج ستون یک معماری خوب کدام است و چگونه از هدررفت حدود یک‌سوم هزینه ابری جلوگیری کنید.",
      content: `**پاسخ کوتاه:** معماری ابری یعنی طراحی ساختار سرویس‌ها، شبکه، داده و امنیت روی زیرساخت ابری، به‌گونه‌ای که سامانه هم‌زمان مقیاس‌پذیر، در دسترس، امن و مقرون‌به‌صرفه باشد. یک معماری خوب بر پنج ستون استوار است: امنیت، پایایی، کارایی، بهینه‌سازی هزینه و تعالی عملیاتی.

## معماری ابری چیست؟

معماری ابری نقشه‌ی فنی سامانه شما روی ابر است: چه سرویس‌هایی، با چه ارتباطی، در چند ناحیه، با چه سیاست امنیتی و با چه مدل هزینه‌ای اجرا می‌شوند. تفاوت آن با «فقط اجاره سرور»، در طراحی برای تغییر است — مقیاس‌شدن خودکار هنگام اوج بار و کوچک‌شدن هنگام کم‌باری.

## چرا معماری درست از روز اول مهم است؟

دو دلیل عددی روشن وجود دارد:

- **هزینه:** بر اساس گزارش سالانه Flexera (State of the Cloud)، سازمان‌ها به‌طور میانگین نزدیک به ۳۰٪ از هزینه ابری خود را هدررفته ارزیابی می‌کنند — عمدتاً به‌خاطر منابع بیش‌ازاندازه بزرگ یا فراموش‌شده.
- **دسترس‌پذیری:** هر ساعت ازکارافتادگی برای کسب‌وکار آنلاین، هم درآمد و هم اعتبار می‌سوزاند. معماری چند-ناحیه‌ای و خودترمیم، هزینه‌ی این ریسک را به کسری از خسارت آن می‌رساند.

اصلاح معماری بعد از رشد سامانه، چندین برابر گران‌تر از طراحی درست در ابتداست.

## پنج ستون معماری ابری خوب کدام‌اند؟

چارچوب‌های مرجع (مانند AWS Well-Architected و معادل‌های Azure/GCP) بر پنج ستون توافق دارند:

| ستون | پرسش کلیدی |
| --- | --- |
| امنیت | چه کسی به چه چیزی دسترسی دارد و داده کجا رمز می‌شود؟ |
| پایایی | اگر یک جزء از کار بیفتد، سامانه چگونه ادامه می‌دهد؟ |
| کارایی | آیا منابع متناسب با بار واقعی انتخاب شده‌اند؟ |
| بهینه‌سازی هزینه | برای چه چیزی پول می‌دهیم و آیا لازم است؟ |
| تعالی عملیاتی | استقرار، پایش و واکنش به رخداد چقدر خودکار است؟ |

## IaaS و PaaS و SaaS چه تفاوتی دارند؟

- **IaaS (زیرساخت):** ماشین مجازی، شبکه و دیسک در اختیار شماست؛ کنترل کامل، مسئولیت بیشتر.
- **PaaS (سکو):** فقط کد را می‌دهید؛ اجرا، مقیاس و وصله‌کردن با ارائه‌دهنده است.
- **SaaS (نرم‌افزار):** محصول آماده مثل ایمیل سازمانی؛ فقط استفاده می‌کنید.

قاعده سرانگشتی: هرچه بالاتر بروید (به سمت SaaS)، سرعت شروع بیشتر و کنترل کمتر می‌شود.

## طراحی معماری ابری را از کجا شروع کنیم؟ (۵ گام)

1. **نیازمندی‌ها را عددی کنید:** کاربر هم‌زمان، حجم داده، سقف قابل‌قبول ازکارافتادگی (SLA) و بودجه ماهانه.
2. **مدل استقرار را انتخاب کنید:** ابر عمومی، خصوصی یا ترکیبی — در ایران معمولاً ترکیب ابر داخلی برای داده و CDN/سرویس خارجی برای لبه.
3. **برای خرابی طراحی کنید:** حداقل دو ناحیه دسترس‌پذیری، پشتیبان‌گیری خودکار و تمرین بازیابی (نه فقط گرفتن بکاپ!).
4. **امنیت را لایه‌لایه بچینید:** حداقلِ دسترسی (IAM)، رمزنگاری در انتقال و سکون، و جداسازی شبکه.
5. **از روز اول هزینه را پایش کنید:** برچسب‌گذاری منابع، بودجه و هشدار هزینه، و بازبینی ماهانه منابع بلااستفاده.

## جمع‌بندی

معماری ابری خوب تصادفی به‌دست نمی‌آید؛ حاصل تصمیم‌های آگاهانه درباره پنج ستون امنیت، پایایی، کارایی، هزینه و عملیات است. اگر در حال طراحی یا بازطراحی زیرساخت هستید، [خدمات معماری لینوکس آکادمی](/services-architect) را ببینید یا [جلسه مشاوره رزرو کنید](/schedule).

## پرسش‌های پرتکرار

### مهاجرت به ابر چقدر هزینه دارد؟

به اندازه و پیچیدگی سامانه بستگی دارد، اما قاعده مهم این است: هزینه مهاجرتِ برنامه‌ریزی‌شده (ارزیابی، بازمعماری، مهاجرت مرحله‌ای) تقریباً همیشه کمتر از هزینه مهاجرت شتاب‌زده به‌علاوه دوباره‌کاری آن است.

### ابر عمومی امن‌تر است یا سرور داخلی؟

ارائه‌دهندگان بزرگ ابری در لایه فیزیکی و زیرساخت معمولاً از هر دیتاسنتر شخصی امن‌ترند؛ اما امنیتِ پیکربندی (دسترسی‌ها، رمزنگاری، شبکه) مسئولیت شماست. بیشتر رخنه‌های ابری نتیجه پیکربندی اشتباه مشتری است، نه ضعف ارائه‌دهنده.

### چند ابری (Multi-Cloud) برای ما لازم است؟

برای بیشتر کسب‌وکارهای کوچک و متوسط، خیر — پیچیدگی آن بیش از فایده‌اش است. وقتی معنا پیدا می‌کند که الزام قانونی، ریسک وابستگی به یک ارائه‌دهنده یا نیاز جغرافیایی خاص داشته باشید.

### تفاوت مقیاس‌پذیری عمودی و افقی چیست؟

عمودی یعنی سرور فعلی را بزرگ‌تر کنید (CPU/RAM بیشتر) — ساده اما سقف‌دار. افقی یعنی تعداد سرورها را زیاد کنید — پیچیده‌تر اما تقریباً بی‌سقف. معماری ابری مدرن حول مقیاس‌پذیری افقی طراحی می‌شود.`,
      cover: { url: "/images/architect.webp" },
      publishedAt: "2026-06-15T00:00:00.000Z",
      updatedAt: "2026-07-11T00:00:00.000Z",
      faq: [
        {
          question: "مهاجرت به ابر چقدر هزینه دارد؟",
          answer:
            "به اندازه و پیچیدگی سامانه بستگی دارد؛ اما مهاجرت برنامه‌ریزی‌شده و مرحله‌ای تقریباً همیشه ارزان‌تر از مهاجرت شتاب‌زده به‌علاوه دوباره‌کاری آن تمام می‌شود.",
        },
        {
          question: "ابر عمومی امن‌تر است یا سرور داخلی؟",
          answer:
            "در لایه زیرساخت، ارائه‌دهندگان بزرگ معمولاً امن‌ترند؛ اما امنیت پیکربندی مسئولیت شماست و بیشتر رخنه‌های ابری از پیکربندی اشتباه مشتری ناشی می‌شود.",
        },
        {
          question: "چند ابری (Multi-Cloud) برای ما لازم است؟",
          answer:
            "برای بیشتر کسب‌وکارهای کوچک و متوسط لازم نیست؛ فقط با الزام قانونی، ریسک وابستگی به یک ارائه‌دهنده یا نیاز جغرافیایی خاص توجیه می‌شود.",
        },
        {
          question: "تفاوت مقیاس‌پذیری عمودی و افقی چیست؟",
          answer:
            "عمودی یعنی بزرگ‌ترکردن سرور فعلی (ساده اما سقف‌دار) و افقی یعنی افزایش تعداد سرورها (پیچیده‌تر اما تقریباً بی‌سقف). معماری مدرن ابری حول مقیاس افقی طراحی می‌شود.",
        },
      ],
    },
    {
      id: 3,
      slug: "ai-for-business",
      title: "هوش مصنوعی برای کسب‌وکار: از کجا شروع کنیم و چه انتظاری داشته باشیم؟",
      summary:
        "هوش مصنوعی دقیقاً چه مشکلی از کسب‌وکار شما حل می‌کند، آمار پذیرش جهانی چه می‌گوید و مسیر ۵ گامی شروعِ کم‌ریسک کدام است.",
      content: `**پاسخ کوتاه:** هوش مصنوعی برای کسب‌وکار یعنی استفاده از مدل‌های یادگیری ماشین و مدل‌های زبانی برای خودکارسازی کارهای تکراری، تحلیل داده و بهبود تصمیم‌گیری. کم‌ریسک‌ترین مسیر شروع: یک فرآیند پرتکرار و پرهزینه را انتخاب کنید، با یک پایلوت ۴ تا ۸ هفته‌ای نتیجه را بسنجید و فقط در صورت اثبات بازده، گسترش دهید.

## هوش مصنوعی برای کسب‌وکار دقیقاً چه کاری انجام می‌دهد؟

کاربردهای اثبات‌شده در چهار دسته اصلی جای می‌گیرند:

- **خودکارسازی پشتیبانی و ارتباط با مشتری:** چت‌بات‌ها و دستیارهایی که به پرسش‌های تکراری پاسخ می‌دهند و موارد پیچیده را به انسان می‌سپارند.
- **تولید و پردازش محتوا و اسناد:** خلاصه‌سازی، استخراج داده از فاکتور و قرارداد، تهیه پیش‌نویس گزارش.
- **تحلیل و پیش‌بینی:** پیش‌بینی تقاضا و موجودی، تشخیص تقلب، امتیازدهی سرنخ فروش.
- **دستیار درون‌سازمانی:** جست‌وجوی هوشمند روی دانش داخلی شرکت و کمک به برنامه‌نویس‌ها با ابزارهای کدنویسی.

## آمار پذیرش هوش مصنوعی چه می‌گوید؟

بر اساس نظرسنجی جهانی مک‌کینزی (McKinsey Global Survey on AI)، از سال ۲۰۲۴ به بعد اکثریت روشن سازمان‌ها — بیش از دوسوم پاسخ‌دهندگان — هوش مصنوعی را دست‌کم در یک واحد کسب‌وکاری به‌کار گرفته‌اند و استفاده از هوش مصنوعی مولد ظرف یک سال تقریباً دو برابر شد.

پیام این آمار برای بازار ایران روشن است: رقابت آینده بین «استفاده‌کننده» و «استفاده‌نکننده» نیست؛ بین کسانی است که زود شروع کرده‌اند و داده و تجربه انباشته‌اند، و کسانی که دیر رسیده‌اند.

## پیاده‌سازی هوش مصنوعی را از کجا شروع کنیم؟ (۵ گام)

1. **مشکل را انتخاب کنید، نه فناوری را.** فهرستی از فرآیندهای پرتکرار، پرهزینه یا کند تهیه کنید؛ بهترین نامزد، فرآیندی با حجم بالا و قاعده نسبتاً روشن است.
2. **داده را ارزیابی کنید.** آیا داده کافی، تمیز و در دسترس دارید؟ کیفیت داده بیش از انتخاب مدل در موفقیت پروژه نقش دارد.
3. **پایلوت کوچک اجرا کنید.** یک سرویس محدود، ۴ تا ۸ هفته، با معیار موفقیت عددیِ ازپیش‌تعریف‌شده (مثلاً کاهش ۳۰٪ زمان پاسخ پشتیبانی).
4. **بازده را بسنجید.** هزینه پایلوت را با صرفه‌جویی یا درآمد ایجادشده مقایسه کنید و درباره ادامه، تغییر مسیر یا توقف تصمیم بگیرید.
5. **مقیاس دهید و حاکمیت بسازید.** پس از اثبات ارزش، به فرآیندهای مجاور گسترش دهید و هم‌زمان قواعد امنیت داده، بازبینی انسانی و پایش کیفیت خروجی را رسمی کنید.

## اشتباه‌های رایج در پروژه‌های هوش مصنوعی

- **شروع از فناوری:** «باید یک چت‌بات داشته باشیم» به‌جای «کدام مشکل را حل می‌کنیم؟»
- **انتظار جادو از داده آشفته:** مدل روی داده بی‌کیفیت، خروجی بی‌کیفیتِ سریع‌تر تولید می‌کند.
- **حذف انسان از حلقه:** در تصمیم‌های حساس (مالی، حقوقی، پزشکی) بازبینی انسانی را حذف نکنید.
- **بی‌توجهی به محرمانگی:** پیش از ارسال داده مشتریان به سرویس‌های خارجی، الزامات حقوقی و امنیتی را روشن کنید.

## جمع‌بندی

هوش مصنوعی وقتی نتیجه می‌دهد که از یک مشکل مشخص، داده قابل‌قبول و پایلوت قابل‌اندازه‌گیری شروع شود. اگر می‌خواهید نقطه شروع سازمان خودتان را پیدا کنید، تیم لینوکس آکادمی در [مشاوره](/services-consult) و [پیاده‌سازی](/services-implement) راهکارهای هوش مصنوعی همراه شماست — [رزرو جلسه مشاوره](/schedule).

## پرسش‌های پرتکرار

### هزینه شروع یک پروژه هوش مصنوعی چقدر است؟

با مدل‌های زبانی آماده و پرداخت به‌ازای مصرف، پایلوت‌های امروزی به‌جای ماه‌ها توسعه، اغلب با چند هفته کار و هزینه محدود قابل اجرا هستند؛ هزینه اصلی معمولاً آماده‌سازی داده و یکپارچه‌سازی با سیستم‌های موجود است.

### آیا برای استفاده از هوش مصنوعی به تیم داده بزرگ نیاز داریم؟

خیر. برای شروع با مدل‌های آماده (مانند مدل‌های زبانی از طریق API)، یک تیم کوچک مهندسی کافی است. تیم داده اختصاصی وقتی لازم می‌شود که بخواهید مدل‌ها را روی داده خودتان آموزش یا تنظیم کنید.

### هوش مصنوعی مولد با هوش مصنوعی سنتی چه فرقی دارد؟

هوش مصنوعی سنتی (یادگیری ماشین) عمدتاً پیش‌بینی و طبقه‌بندی می‌کند (مثل پیش‌بینی فروش)؛ هوش مصنوعی مولد محتوای جدید تولید می‌کند (متن، کد، تصویر) و با مدل‌های زبانی بزرگ مثل GPT و Claude شناخته می‌شود.

### داده شرکت ما محرمانه است؛ آیا می‌توانیم از مدل‌های زبانی استفاده کنیم؟

بله، با انتخاب معماری درست: از قراردادهای سازمانی ارائه‌دهندگان (که داده را برای آموزش استفاده نمی‌کنند)، استقرار مدل روی زیرساخت خودتان یا ناشناس‌سازی داده پیش از ارسال استفاده کنید.`,
      cover: { url: "/images/implement.webp" },
      publishedAt: "2026-07-01T00:00:00.000Z",
      updatedAt: "2026-07-11T00:00:00.000Z",
      faq: [
        {
          question: "هزینه شروع یک پروژه هوش مصنوعی چقدر است؟",
          answer:
            "با مدل‌های زبانی آماده و پرداخت به‌ازای مصرف، پایلوت اغلب با چند هفته کار قابل اجراست؛ هزینه اصلی معمولاً آماده‌سازی داده و یکپارچه‌سازی با سیستم‌های موجود است.",
        },
        {
          question: "آیا برای استفاده از هوش مصنوعی به تیم داده بزرگ نیاز داریم؟",
          answer:
            "خیر؛ برای شروع با مدل‌های آماده یک تیم کوچک مهندسی کافی است. تیم داده اختصاصی برای آموزش یا تنظیم مدل روی داده خودتان لازم می‌شود.",
        },
        {
          question: "هوش مصنوعی مولد با هوش مصنوعی سنتی چه فرقی دارد؟",
          answer:
            "هوش مصنوعی سنتی عمدتاً پیش‌بینی و طبقه‌بندی می‌کند؛ هوش مصنوعی مولد محتوای جدید (متن، کد، تصویر) تولید می‌کند و با مدل‌های زبانی بزرگ شناخته می‌شود.",
        },
        {
          question: "داده شرکت ما محرمانه است؛ آیا می‌توانیم از مدل‌های زبانی استفاده کنیم؟",
          answer:
            "بله؛ با قرارداد سازمانی ارائه‌دهنده، استقرار مدل روی زیرساخت خودتان یا ناشناس‌سازی داده پیش از ارسال، می‌توان محرمانگی را حفظ کرد.",
        },
      ],
    },
    {
      id: 4,
      slug: "what-is-webmcp",
      title: "WebMCP چیست؟ اتصال وب‌سایت شما به عامل‌های هوش مصنوعی",
      summary:
        "WebMCP استاندارد پیشنهادی مرورگرهاست که به وب‌سایت اجازه می‌دهد به‌جای اسکرول و کلیک‌شدن توسط ربات، ابزارهای ساخت‌یافته به عامل‌های هوش مصنوعی بدهد — و ما آن را روی همین سایت پیاده کرده‌ایم.",
      content: `**پاسخ کوتاه:** WebMCP یک پیشنهاد استاندارد وب است که به وب‌سایت اجازه می‌دهد «ابزار»‌های ساخت‌یافته (مثل جست‌وجوی مقاله یا رزرو جلسه) را مستقیم در مرورگر به عامل‌های هوش مصنوعی عرضه کند — از طریق API جدید \`navigator.modelContext\`. به‌جای اینکه عامل هوش مصنوعی صفحه را مثل انسان اسکرول و کلیک کند، تابع‌های تعریف‌شده‌ی خود سایت را صدا می‌زند: سریع‌تر، دقیق‌تر و امن‌تر.

## WebMCP چیست و از کجا آمده؟

WebMCP ادامه‌ی طبیعی پروتکل MCP است. پروتکل MCP (Model Context Protocol) را شرکت Anthropic در نوامبر ۲۰۲۴ به‌عنوان استاندارد باز اتصال مدل‌های هوش مصنوعی به ابزارها و داده‌ها معرفی کرد و در سال ۲۰۲۵ شرکت‌های OpenAI و Google نیز پشتیبانی از آن را اعلام کردند — عملاً استاندارد صنعت شد.

WebMCP همین ایده را به مرورگر می‌آورد: پیشنهادی در گروه Web Machine Learning کنسرسیوم W3C (با مشارکت مهندسان مایکروسافت و گوگل) که به هر صفحه وب اجازه می‌دهد ابزارهای خود را برای دستیار هوش مصنوعیِ داخل مرورگر ثبت کند. کروم از اواخر ۲۰۲۵ آن را به‌صورت آزمایشی (Origin Trial) در دسترس توسعه‌دهندگان قرار داده است.

## چرا WebMCP مهم است؟

عامل‌های هوش مصنوعی امروز برای کار با سایت‌ها عمدتاً «شبیه‌سازی انسان» می‌کنند: اسکرین‌شات می‌گیرند، DOM را می‌خوانند و روی دکمه‌ها کلیک می‌کنند. این روش سه مشکل بزرگ دارد:

- **شکننده است:** با هر تغییر ظاهری سایت، عامل گم می‌شود.
- **کند و پرهزینه است:** ده‌ها رفت‌وبرگشت برای کاری که یک فراخوانی تابع است.
- **پرخطاست:** کلیک اشتباه در فرم پرداخت یعنی خسارت واقعی.

WebMCP این رابطه را وارونه می‌کند: سایت خودش اعلام می‌کند «این کارها را می‌توانی از من بخواهی» — با ورودی و خروجی مشخص.

## سه روش اتصال هوش مصنوعی به سایت شما

| روش | چگونه کار می‌کند | نقطه قوت | نقطه ضعف |
| --- | --- | --- | --- |
| اسکرِیپینگ / Computer Use | خواندن صفحه و کلیک شبیه انسان | بدون تغییر در سایت | شکننده، کند، پرخطا |
| سرور MCP راه دور | نقطه اتصال HTTP جدا (مثل \`/api/mcp\`) | مستقل از مرورگر، مناسب اتوماسیون | جلسه و لاگین کاربر را ندارد |
| WebMCP | ثبت ابزار داخل صفحه با \`navigator.modelContext\` | با جلسه و دسترسی خود کاربر اجرا می‌شود | هنوز آزمایشی، فقط مرورگرهای جدید |

نکته مهم: این سه روش رقیب نیستند؛ مکمل‌اند. سایت جدی در ۲۰۲۶ هر سه لایه را آماده می‌کند.

## پیاده‌سازی WebMCP در عمل چه شکلی است؟ (تجربه خود ما)

ما هر دو لایه را روی همین وب‌سایت پیاده کرده‌ایم: یک سرور MCP راه دور در \`linuxacademy.ir/api/mcp\` و ابزارهای WebMCP داخل صفحه. ثبت یک ابزار به همین سادگی است:

    navigator.modelContext.registerTool({
      name: "book_consultation",
      description: "باز کردن صفحه رزرو جلسه مشاوره",
      inputSchema: { type: "object", properties: {} },
      async execute() {
        window.location.assign("/schedule");
        return { content: [{ type: "text", text: "ok" }] };
      },
    });

با همین الگو، عامل هوش مصنوعی کاربر می‌تواند فهرست مقالات را بگیرد، متن کامل مقاله را بخواند یا مستقیم به صفحه رزرو برود — بدون یک بار کلیک شبیه‌سازی‌شده.

## برای آماده‌شدن چه کنیم؟ (۴ گام)

1. **محتوای ماشین‌خوان فراهم کنید:** \`llms.txt\` و داده ساخت‌یافته (JSON-LD) حداقلِ لازم است.
2. **کارهای کلیدی سایت را فهرست کنید:** جست‌وجو، رزرو، استعلام قیمت — هر کدام کاندیدای یک ابزار است.
3. **ابزارها را ایمن طراحی کنید:** ابزارهای فقط-خواندنی را آزاد بگذارید؛ کارهای حساس (پرداخت) حتماً تأیید کاربر بخواهند.
4. **زود شروع کنید:** استاندارد هنوز آزمایشی است، اما سایت‌هایی که زود ابزار عرضه کنند، در تجربه‌های عامل-محورِ آینده پیش‌فرض انتخاب می‌شوند.

## جمع‌بندی

WebMCP وب را از «صفحه‌هایی برای خواندن انسان» به «سرویس‌هایی قابل‌فراخوانی برای عامل‌ها» گسترش می‌دهد. اگر می‌خواهید سایت یا محصولتان برای این موج آماده شود، [مشاوره](/services-consult) و [پیاده‌سازی](/services-implement) این زیرساخت دقیقاً کاری است که انجام می‌دهیم — [رزرو جلسه](/schedule).

## پرسش‌های پرتکرار

### تفاوت WebMCP با MCP معمولی چیست؟

MCP معمولی یک سرور جدا (محلی یا راه دور) است که عامل به آن وصل می‌شود؛ WebMCP همان مفهوم ابزار را داخل صفحه وب و با API مرورگر (\`navigator.modelContext\`) پیاده می‌کند و با جلسه و لاگین خود کاربر اجرا می‌شود.

### آیا WebMCP الان در مرورگرها فعال است؟

به‌صورت پیش‌فرض نه؛ کروم آن را در قالب Origin Trial آزمایشی عرضه کرده و مشخصات در W3C در حال تکامل است. پیاده‌سازی درست باید وجود API را بررسی کند و در نبودش بی‌اثر باشد — دقیقاً کاری که ما کرده‌ایم.

### آیا WebMCP خطر امنیتی دارد؟

ابزارها فقط همان کارهایی را انجام می‌دهند که سایت تعریف کرده و در مرورگرِ خود کاربر اجرا می‌شوند؛ مدل مجوزدهی مرورگر و تأیید کاربر هم روی آن اعمال می‌شود. ریسک اصلی، طراحی ابزارِ بیش‌ازحد قدرتمند بدون تأیید کاربر است — نه خود پروتکل.

### اگر API عمومی داریم، باز هم WebMCP لازم است؟

بله، برای سناریوی متفاوتی: API عمومی برای اتوماسیون سرور-به-سرور است؛ WebMCP برای دستیارِ داخل مرورگرِ کاربری است که همین حالا در سایت شما لاگین است و می‌خواهد با زبان طبیعی کارش را انجام دهد.`,
      cover: { url: "/images/implement.webp" },
      publishedAt: "2026-07-11T00:00:00.000Z",
      updatedAt: "2026-07-11T00:00:00.000Z",
      faq: [
        {
          question: "تفاوت WebMCP با MCP معمولی چیست؟",
          answer:
            "MCP معمولی سروری جداست که عامل به آن وصل می‌شود؛ WebMCP همان ابزارها را داخل صفحه وب با navigator.modelContext ثبت می‌کند و با جلسه و لاگین خود کاربر اجرا می‌شود.",
        },
        {
          question: "آیا WebMCP الان در مرورگرها فعال است؟",
          answer:
            "به‌صورت پیش‌فرض نه؛ کروم آن را آزمایشی (Origin Trial) عرضه کرده است. پیاده‌سازی درست باید وجود API را بررسی کند و در نبود آن بی‌اثر باشد.",
        },
        {
          question: "آیا WebMCP خطر امنیتی دارد؟",
          answer:
            "ابزارها فقط کارهای تعریف‌شده سایت را در مرورگر خود کاربر انجام می‌دهند. ریسک اصلی طراحی ابزار حساس بدون تأیید کاربر است، نه خود پروتکل.",
        },
        {
          question: "اگر API عمومی داریم، باز هم WebMCP لازم است؟",
          answer:
            "بله؛ API عمومی برای اتوماسیون سرور-به-سرور است و WebMCP برای دستیار داخل مرورگر کاربری که در سایت شما لاگین است.",
        },
      ],
    },
    {
      id: 5,
      slug: "markdown-for-ai-visibility",
      title: "مارک‌داون و هوش مصنوعی: چرا ساختار متن، دیده‌شدن شما را تعیین می‌کند",
      summary:
        "چرا مدل‌های زبانی محتوای مارک‌داون‌مانند را بهتر می‌فهمند و استناد می‌کنند، llms.txt چیست و چگونه محتوای سایت را برای عامل‌های هوش مصنوعی ساختاردهی کنیم.",
      content: `**پاسخ کوتاه:** مارک‌داون (Markdown) به دلیل ساختار صریح و کم‌حجم — تیتر، فهرست، جدول — همان قالبی است که مدل‌های زبانی راحت‌تر می‌خوانند، خلاصه می‌کنند و از آن نقل می‌کنند. اگر می‌خواهید ChatGPT و Perplexity و AI Overviews به سایت شما استناد کنند، محتوا را مارک‌داون‌گونه بنویسید (تیترِ پرسشی، بند کوتاه، فهرست و جدول) و نسخه ماشین‌خوان آن را با \`llms.txt\` عرضه کنید.

## چرا قالب متن برای هوش مصنوعی این‌قدر مهم است؟

مدل زبانی صفحه شما را مثل انسان «نمی‌بیند»؛ متن آن را می‌خواند. یک صفحه HTML سنگین پر از منو، اسکریپت و تگ تو‌در‌تو است و بخش عمده‌ی آن هنگام پردازش دور ریخته می‌شود. به همین دلیل بسیاری از ابزارهای عامل‌های هوش مصنوعی (مانند خزنده‌ها و کتابخانه‌های استخراج محتوا) صفحه وب را پیش از پردازش به مارک‌داون تبدیل می‌کنند: ساختار می‌ماند، شلوغی حذف می‌شود و حجم توکن به کسری از HTML می‌رسد.

نتیجه عملی: محتوایی که از ابتدا با منطق مارک‌داون نوشته شده — سلسله‌مراتب تیتر روشن، بند کوتاه، فهرست و جدول واقعی — پس از این تبدیل سالم می‌ماند و «قابل استخراج» است. محتوای دفن‌شده در طراحی‌های پیچیده، در همین مرحله ناپدید می‌شود.

## پژوهش‌ها درباره ساختار محتوا چه می‌گویند؟

- پژوهش GEO (ارائه‌شده در کنفرانس KDD 2024 توسط پژوهشگران پرینستون و جورجیا‌تک) نشان داد افزودن استناد، نقل‌قول و آمار — که همگی در مارک‌داون به‌سادگی بیان می‌شوند — دیده‌شدن محتوا در موتورهای مولد را ۳۰ تا ۴۰ درصد افزایش می‌دهد.
- تحلیل مقالات استنادشده توسط ChatGPT (نشریه Search Engine Land، ۲۰۲۵) نشان داد ۷۲٪ مقالات استنادشده «پاسخ کوتاه» ابتدای متن داشتند و قطعه‌های ۴۰ تا ۷۵ کلمه‌ای بیشترین شانس نقل‌شدن را دارند.
- راهنماهای معتبر سئو توصیه می‌کنند بندها زیر ~۱۲۰ کلمه بمانند و اطلاعات با فهرست و جدول شکسته شود — دقیقاً بلوک‌های سازنده مارک‌داون.

## llms.txt چیست و چه کمکی می‌کند؟

\`llms.txt\` قراردادی است که سپتامبر ۲۰۲۴ توسط جرمی هاوارد (Answer.AI) پیشنهاد شد: یک فایل مارک‌داون در ریشه سایت که به مدل‌های زبانی می‌گوید «مهم‌ترین محتوای این سایت این‌هاست» — با خلاصه و پیوند. نسخه کامل‌تر، \`llms-full.txt\`، متن کامل صفحات کلیدی را یک‌جا عرضه می‌کند تا عامل هوش مصنوعی بدون خزیدن ده‌ها صفحه، کل محتوا را ببیند.

همین سایت هر دو را دارد: [llms.txt](/llms.txt) و [llms-full.txt](/llms-full.txt) — که به‌صورت خودکار از همان منبع محتوای مقالات تولید می‌شوند تا هیچ‌وقت از متن اصلی عقب نمانند. این «بینش دست‌اول» ما از پیاده‌سازی است: تولید خودکار از یک منبع واحد، تنها راه جلوگیری از دوگانگی محتواست.

## چگونه محتوای خود را مارک‌داون‌گونه ساختاردهی کنیم؟ (۶ قاعده)

1. **با پاسخ کوتاه شروع کنید:** دو-سه جمله اول، پاسخ مستقیم پرسش اصلی مقاله باشد.
2. **تیترها را پرسشی بنویسید:** H2 و H3 دقیقاً همان پرسش‌هایی باشد که کاربر از هوش مصنوعی می‌پرسد.
3. **بندها را کوتاه نگه دارید:** زیر ~۱۲۰ کلمه؛ هر بند یک ایده.
4. **از فهرست و جدول واقعی استفاده کنید:** نه شبه‌جدولِ ساخته‌شده با استایل؛ جدول و فهرست واقعی مارک‌داون/HTML.
5. **آمار و استناد بدهید:** عدد با منبع نام‌دار، شانس نقل‌شدن را به‌شکل اثبات‌شده بالا می‌برد.
6. **نسخه ماشین‌خوان عرضه کنید:** \`llms.txt\`، \`llms-full.txt\` و داده ساخت‌یافته JSON-LD.

## جمع‌بندی

در رقابت برای دیده‌شدن در پاسخ‌های هوش مصنوعی، «چه می‌گویید» فقط نیمی از ماجراست؛ «با چه ساختاری می‌گویید» نیمه دیگر است. مارک‌داون — به‌عنوان قالب یا به‌عنوان طرز فکر — محتوای شما را قابل‌استخراج و قابل‌استناد می‌کند. اگر می‌خواهید سایتتان برای موتورهای پاسخ و عامل‌های هوش مصنوعی بهینه شود، [مشاوره](/services-consult) بگیرید یا [جلسه رزرو کنید](/schedule).

## پرسش‌های پرتکرار

### آیا باید کل سایت را با مارک‌داون بسازیم؟

نه؛ منظور «منطق مارک‌داون» است: سلسله‌مراتب تیتر روشن، بند کوتاه، فهرست و جدول واقعی در HTML خروجی. فرقی نمی‌کند CMS شما چه باشد؛ خروجی باید پس از تبدیل به متن ساده، ساختارش را حفظ کند.

### llms.txt را کجا بگذاریم و چه چیزی در آن بنویسیم؟

در ریشه دامنه (example.com/llms.txt). یک تیتر، یک خلاصه یک‌بندی از کسب‌وکار و فهرست پیوند صفحات مهم با توضیح یک‌خطی. نسخه llms-full.txt هم می‌تواند متن کامل صفحات کلیدی را داشته باشد.

### آیا llms.txt جای سایت‌مپ و robots.txt را می‌گیرد؟

خیر؛ مکمل آن‌هاست. robots.txt اجازه خزیدن را مدیریت می‌کند، sitemap.xml فهرست URLها را می‌دهد و llms.txt محتوای منتخب را در قالبی می‌دهد که مدل زبانی مستقیم بفهمد.

### آیا استفاده از مارک‌داون به سئوی کلاسیک آسیب می‌زند؟

برعکس؛ همان ساختاری که برای مدل‌های زبانی بهینه است (تیتر معنادار، بند کوتاه، جدول) دقیقاً همان چیزی است که گوگل برای فیچرد اسنیپت و AI Overviews ترجیح می‌دهد. یک محتوا، هر دو مخاطب.`,
      cover: { url: "/images/architect.webp" },
      publishedAt: "2026-07-11T00:00:00.000Z",
      updatedAt: "2026-07-11T00:00:00.000Z",
      faq: [
        {
          question: "آیا باید کل سایت را با مارک‌داون بسازیم؟",
          answer:
            "نه؛ منظور منطق مارک‌داون است: سلسله‌مراتب تیتر روشن، بند کوتاه و فهرست و جدول واقعی در خروجی HTML، فارغ از اینکه CMS شما چیست.",
        },
        {
          question: "llms.txt را کجا بگذاریم و چه چیزی در آن بنویسیم؟",
          answer:
            "در ریشه دامنه؛ شامل یک تیتر، خلاصه یک‌بندی کسب‌وکار و فهرست پیوند صفحات مهم با توضیح یک‌خطی. نسخه llms-full.txt متن کامل صفحات کلیدی را اضافه می‌کند.",
        },
        {
          question: "آیا llms.txt جای سایت‌مپ و robots.txt را می‌گیرد؟",
          answer:
            "خیر، مکمل آن‌هاست: robots.txt اجازه خزیدن، sitemap.xml فهرست URLها و llms.txt محتوای منتخب در قالب قابل‌فهم برای مدل زبانی.",
        },
        {
          question: "آیا استفاده از مارک‌داون به سئوی کلاسیک آسیب می‌زند؟",
          answer:
            "برعکس؛ ساختار بهینه برای مدل‌های زبانی همان چیزی است که گوگل برای فیچرد اسنیپت و AI Overviews ترجیح می‌دهد.",
        },
      ],
    },
  ],
  en: [
    {
      id: 1,
      slug: "getting-started-with-devops",
      title: "Getting Started with DevOps: A Step-by-Step Guide for Businesses",
      summary:
        "What DevOps is, why it multiplies software delivery speed and stability, and how to start in your organization with 6 practical steps.",
      content: `**Short answer:** DevOps is a set of cultural practices and tools that unifies development and operations teams so software reaches users faster, more reliably, and more securely. The first three steps: automate deployments with CI/CD, define infrastructure as code (IaC), and measure the four key software delivery metrics.

## What is DevOps?

DevOps combines Development and Operations. Instead of developers writing code and throwing it "over the wall" for an infrastructure team to deploy, both teams share responsibility for the entire software lifecycle using common processes and tooling.

Its three pillars:

- **Collaborative culture:** shared ownership from code to production
- **Automation:** build, test, and deploy without manual steps (CI/CD)
- **Measurement and feedback:** continuous monitoring and data-driven improvement

## Why does DevOps matter for your business?

The performance gap between teams that practice DevOps well and those that don't isn't marginal — it's orders of magnitude. According to Google's multi-year DORA research (the Accelerate State of DevOps reports), elite teams deploy hundreds of times more frequently than low performers, and their lead time from commit to production is under a day instead of months.

For a business owner that means: today's idea becomes next week's sellable feature — not next quarter's.

## Which metrics do successful DevOps teams track?

DORA's research identifies Four Key Metrics as the measure of software delivery health:

| Metric | Elite teams | Low performers |
| --- | --- | --- |
| Deployment frequency | On demand, multiple times a day | Less than once a month |
| Lead time for changes | Under one day | Over one month |
| Time to restore service | Under one hour | Over one week |
| Change failure rate | Around 5% | Over 30% |

If you don't know any of these four numbers today, measuring them is your first DevOps step.

## How do you start with DevOps? (6 practical steps)

1. **Assess where you are.** Calculate the four DORA metrics for one product to establish a baseline.
2. **Complete version control.** Everything — code, configuration, deployment scripts — belongs in Git.
3. **Set up continuous integration (CI).** Every commit triggers automated build and tests (GitLab CI, GitHub Actions, or Jenkins).
4. **Automate deployment (CD).** Eliminate manual server deployments; every release should be repeatable and reversible.
5. **Define infrastructure as code (IaC).** With tools like Terraform or Ansible, servers and networks become versioned and reproducible.
6. **Build monitoring and feedback.** Metrics, logs, and alerts (e.g., Prometheus and Grafana) so you see problems before your customers do.

## Common mistakes when starting DevOps

- **Buying tools instead of changing process:** Kubernetes doesn't ship with culture; fix the process first, then pick tools.
- **Creating a separate "DevOps team":** building a new silo between dev and ops defeats the purpose.
- **Starting too big:** transform one product and one deployment pipeline, not the whole organization at once.
- **Ignoring security:** put security checks into the CI/CD pipeline from day one (DevSecOps).

## Summary

DevOps isn't a one-off project; it's a path of continuous improvement that starts with automated deployments, infrastructure as code, and measuring the four key metrics. The Linux Academy team can help with [DevOps implementation](/services-implement) and [architecture consulting](/services-consult) — you can [book a consultation](/schedule) to get started.

## Frequently asked questions

### How long does a DevOps implementation take?

Initial CI/CD setup for one product typically takes 2–6 weeks. Reaching organizational maturity (full automation, IaC, and a shared-ownership culture) usually takes 6–18 months.

### Is DevOps only for large companies?

No. Small teams see results faster because fewer processes need to change. Even a 3-person team benefits from automated deployments and infrastructure as code.

### Which tools do you start DevOps with?

A common stack: Git for version control, GitHub Actions or GitLab CI for CI/CD, Docker for packaging, Terraform or Ansible for infrastructure as code, and Prometheus/Grafana for monitoring.

### What is the difference between DevOps and DevSecOps?

DevSecOps is DevOps with security controls (dependency scanning, static analysis, configuration checks) automated inside the CI/CD pipeline from the start, rather than reviewed manually at the end.`,
      cover: { url: "/images/consult.webp" },
      publishedAt: "2026-06-01T00:00:00.000Z",
      updatedAt: "2026-07-11T00:00:00.000Z",
      faq: [
        {
          question: "How long does a DevOps implementation take?",
          answer:
            "Initial CI/CD setup for one product typically takes 2–6 weeks; reaching organizational maturity usually takes 6–18 months.",
        },
        {
          question: "Is DevOps only for large companies?",
          answer:
            "No. Small teams often see results faster because fewer processes need to change; even a 3-person team benefits from automated deployments.",
        },
        {
          question: "Which tools do you start DevOps with?",
          answer:
            "A common stack: Git, GitHub Actions or GitLab CI for CI/CD, Docker, Terraform or Ansible for infrastructure as code, and Prometheus/Grafana for monitoring.",
        },
        {
          question: "What is the difference between DevOps and DevSecOps?",
          answer:
            "DevSecOps is DevOps with security controls automated inside the CI/CD pipeline from the start rather than reviewed manually at the end.",
        },
      ],
    },
    {
      id: 2,
      slug: "cloud-architecture-basics",
      title: "Cloud Architecture Basics: Designing Scalable, Resilient Infrastructure",
      summary:
        "What cloud architecture is, the five pillars of a good design, and how to avoid wasting roughly a third of your cloud spend.",
      content: `**Short answer:** Cloud architecture is the design of your services, networking, data, and security on cloud infrastructure so the system is simultaneously scalable, available, secure, and cost-effective. A good architecture rests on five pillars: security, reliability, performance efficiency, cost optimization, and operational excellence.

## What is cloud architecture?

Cloud architecture is the technical blueprint of your system on the cloud: which services run where, how they communicate, across how many zones, under which security policies, and on what cost model. What separates it from "just renting servers" is designing for change — scaling out automatically under peak load and shrinking back when demand drops.

## Why does getting the architecture right matter from day one?

Two numbers make the case:

- **Cost:** according to Flexera's annual State of the Cloud report, organizations estimate that nearly 30% of their cloud spend is wasted — mostly on oversized or forgotten resources.
- **Availability:** every hour of downtime burns both revenue and reputation for an online business. Multi-zone, self-healing architecture reduces that risk at a fraction of what an outage costs.

Re-architecting after a system has grown is several times more expensive than designing it correctly up front.

## What are the five pillars of good cloud architecture?

Reference frameworks (such as AWS Well-Architected and the Azure/GCP equivalents) agree on five pillars:

| Pillar | Key question |
| --- | --- |
| Security | Who can access what, and where is data encrypted? |
| Reliability | If one component fails, how does the system keep going? |
| Performance efficiency | Are resources sized for the real workload? |
| Cost optimization | What are we paying for, and do we need it? |
| Operational excellence | How automated are deployment, monitoring, and incident response? |

## What's the difference between IaaS, PaaS, and SaaS?

- **IaaS (infrastructure):** you get virtual machines, networking, and storage; full control, more responsibility.
- **PaaS (platform):** you bring only your code; the provider runs, scales, and patches it.
- **SaaS (software):** a finished product like hosted email; you just use it.

Rule of thumb: the higher you go (toward SaaS), the faster you start and the less control you keep.

## Where do you start designing cloud architecture? (5 steps)

1. **Quantify the requirements:** concurrent users, data volume, acceptable downtime (SLA), and monthly budget.
2. **Choose the deployment model:** public, private, or hybrid cloud — in Iran, commonly a mix of domestic cloud for data plus foreign CDN/services at the edge.
3. **Design for failure:** at least two availability zones, automated backups, and recovery drills (not just taking backups!).
4. **Layer the security:** least-privilege access (IAM), encryption in transit and at rest, and network segmentation.
5. **Watch cost from day one:** resource tagging, budgets and spend alerts, and a monthly review of idle resources.

## Summary

Good cloud architecture doesn't happen by accident; it's the result of deliberate decisions across the five pillars of security, reliability, performance, cost, and operations. If you're designing or redesigning infrastructure, see [Linux Academy's architecture services](/services-architect) or [book a consultation](/schedule).

## Frequently asked questions

### How much does cloud migration cost?

It depends on the size and complexity of the system, but one rule holds: a planned migration (assessment, re-architecture, phased moves) almost always costs less than a rushed migration plus the rework it causes.

### Is public cloud more secure than on-premises servers?

Large cloud providers are usually more secure than any private data center at the physical and infrastructure layers; but configuration security (access, encryption, networking) is your responsibility. Most cloud breaches result from customer misconfiguration, not provider weakness.

### Do we need multi-cloud?

For most small and mid-sized businesses, no — the complexity outweighs the benefit. It makes sense when you face regulatory requirements, unacceptable vendor lock-in risk, or specific geographic needs.

### What's the difference between vertical and horizontal scaling?

Vertical means making your current server bigger (more CPU/RAM) — simple but capped. Horizontal means adding more servers — more complex but nearly unlimited. Modern cloud architecture is designed around horizontal scaling.`,
      cover: { url: "/images/architect.webp" },
      publishedAt: "2026-06-15T00:00:00.000Z",
      updatedAt: "2026-07-11T00:00:00.000Z",
      faq: [
        {
          question: "How much does cloud migration cost?",
          answer:
            "It depends on system size and complexity, but a planned, phased migration almost always costs less than a rushed one plus the rework it causes.",
        },
        {
          question: "Is public cloud more secure than on-premises servers?",
          answer:
            "At the infrastructure layer, large providers are usually more secure; but configuration security is your responsibility, and most cloud breaches stem from customer misconfiguration.",
        },
        {
          question: "Do we need multi-cloud?",
          answer:
            "For most small and mid-sized businesses, no; it's justified only by regulatory requirements, vendor lock-in risk, or specific geographic needs.",
        },
        {
          question: "What's the difference between vertical and horizontal scaling?",
          answer:
            "Vertical scaling makes the current server bigger (simple but capped); horizontal scaling adds more servers (more complex but nearly unlimited). Modern cloud architecture favors horizontal scaling.",
        },
      ],
    },
    {
      id: 3,
      slug: "ai-for-business",
      title: "AI for Business: Where to Start and What to Expect",
      summary:
        "What problems AI actually solves for your business, what global adoption data says, and the low-risk 5-step path to getting started.",
      content: `**Short answer:** AI for business means using machine learning and language models to automate repetitive work, analyze data, and improve decision-making. The lowest-risk path: pick one high-volume, costly process, run a 4–8 week pilot with a predefined success metric, and scale only once the return is proven.

## What does AI actually do for a business?

Proven use cases fall into four main categories:

- **Customer support and communication automation:** chatbots and assistants that answer repetitive questions and hand complex cases to humans.
- **Content and document processing:** summarization, extracting data from invoices and contracts, drafting reports.
- **Analysis and prediction:** demand and inventory forecasting, fraud detection, sales lead scoring.
- **Internal assistants:** intelligent search over company knowledge and coding assistants for developers.

## What does AI adoption data say?

According to McKinsey's Global Survey on AI, since 2024 a clear majority of organizations — over two-thirds of respondents — have adopted AI in at least one business function, and generative AI use roughly doubled within a year.

The message for any market, including Iran, is clear: the coming competition isn't between users and non-users of AI; it's between early movers who have accumulated data and experience, and late arrivals.

## How do you start implementing AI? (5 steps)

1. **Pick the problem, not the technology.** List your repetitive, costly, or slow processes; the best candidate has high volume and reasonably clear rules.
2. **Assess your data.** Do you have enough clean, accessible data? Data quality matters more to project success than model choice.
3. **Run a small pilot.** One limited service, 4–8 weeks, with a predefined numeric success metric (e.g., 30% lower support response time).
4. **Measure the return.** Compare the pilot's cost against savings or new revenue, then decide to continue, pivot, or stop.
5. **Scale and add governance.** After proving value, expand to adjacent processes while formalizing data security, human review, and output quality monitoring.

## Common mistakes in AI projects

- **Starting from the technology:** "we need a chatbot" instead of "which problem are we solving?"
- **Expecting magic from messy data:** a model on low-quality data just produces low-quality output faster.
- **Removing humans from the loop:** keep human review for sensitive decisions (financial, legal, medical).
- **Ignoring confidentiality:** clarify legal and security requirements before sending customer data to external services.

## Summary

AI delivers when you start from a specific problem, acceptable data, and a measurable pilot. If you want to find your organization's starting point, the Linux Academy team offers [consulting](/services-consult) and [implementation](/services-implement) for AI solutions — [book a consultation](/schedule).

## Frequently asked questions

### How much does it cost to start an AI project?

With ready-made language models and pay-per-use pricing, today's pilots often take weeks rather than months of development; the main cost is usually data preparation and integration with existing systems.

### Do we need a large data team to use AI?

No. To start with ready-made models (such as language models via API), a small engineering team is enough. A dedicated data team becomes necessary when you want to train or fine-tune models on your own data.

### How is generative AI different from traditional AI?

Traditional AI (machine learning) mostly predicts and classifies (like sales forecasting); generative AI creates new content (text, code, images) and is known through large language models such as GPT and Claude.

### Our company data is confidential; can we still use language models?

Yes, with the right architecture: use enterprise agreements (where providers don't train on your data), deploy models on your own infrastructure, or anonymize data before sending it.`,
      cover: { url: "/images/implement.webp" },
      publishedAt: "2026-07-01T00:00:00.000Z",
      updatedAt: "2026-07-11T00:00:00.000Z",
      faq: [
        {
          question: "How much does it cost to start an AI project?",
          answer:
            "With ready-made language models and pay-per-use pricing, pilots often take weeks rather than months; the main cost is usually data preparation and integration.",
        },
        {
          question: "Do we need a large data team to use AI?",
          answer:
            "No; a small engineering team is enough to start with ready-made models via API. A dedicated data team is needed only for training or fine-tuning on your own data.",
        },
        {
          question: "How is generative AI different from traditional AI?",
          answer:
            "Traditional AI mostly predicts and classifies; generative AI creates new content (text, code, images) and is known through large language models.",
        },
        {
          question: "Our company data is confidential; can we still use language models?",
          answer:
            "Yes — via enterprise agreements where providers don't train on your data, self-hosted models, or anonymizing data before sending it.",
        },
      ],
    },
    {
      id: 4,
      slug: "what-is-webmcp",
      title: "What is WebMCP? Connecting Your Website to AI Agents",
      summary:
        "WebMCP is the proposed browser standard that lets a website offer structured tools to AI agents instead of being scrolled and clicked by bots — and we've implemented it on this very site.",
      content: `**Short answer:** WebMCP is a proposed web standard that lets a website expose structured "tools" (like searching articles or booking a session) directly to AI agents in the browser — through the new \`navigator.modelContext\` API. Instead of an AI agent scrolling and clicking your page like a human, it calls functions your site defines: faster, more accurate, and safer.

## What is WebMCP and where does it come from?

WebMCP is the natural continuation of the MCP protocol. MCP (Model Context Protocol) was introduced by Anthropic in November 2024 as an open standard for connecting AI models to tools and data, and during 2025 OpenAI and Google announced support as well — making it the de facto industry standard.

WebMCP brings the same idea into the browser: a proposal in the W3C Web Machine Learning community group (driven by engineers from Microsoft and Google) that lets any web page register its tools with the browser's AI assistant. Chrome has made it available to developers as an experimental Origin Trial since late 2025.

## Why does WebMCP matter?

Today's AI agents mostly work with websites by imitating humans: taking screenshots, reading the DOM, and clicking buttons. That approach has three big problems:

- **It's brittle:** any visual redesign gets the agent lost.
- **It's slow and expensive:** dozens of round-trips for what should be one function call.
- **It's error-prone:** a wrong click in a payment form causes real damage.

WebMCP inverts the relationship: the site itself declares "here's what you can ask me to do" — with defined inputs and outputs.

## Three ways AI can connect to your site

| Approach | How it works | Strength | Weakness |
| --- | --- | --- | --- |
| Scraping / Computer Use | Reading the page and clicking like a human | No site changes needed | Brittle, slow, error-prone |
| Remote MCP server | Separate HTTP endpoint (like \`/api/mcp\`) | Browser-independent, good for automation | No access to the user's session/login |
| WebMCP | Registering tools in-page via \`navigator.modelContext\` | Runs with the user's own session and permissions | Still experimental, new browsers only |

Key point: these aren't competitors — they're complementary. A serious site in 2026 prepares all three layers.

## What does implementing WebMCP look like? (our firsthand experience)

We've implemented both layers on this very website: a remote MCP server at \`linuxacademy.ir/api/mcp\` and in-page WebMCP tools. Registering a tool is as simple as:

    navigator.modelContext.registerTool({
      name: "book_consultation",
      description: "Open the consultation booking page",
      inputSchema: { type: "object", properties: {} },
      async execute() {
        window.location.assign("/schedule");
        return { content: [{ type: "text", text: "ok" }] };
      },
    });

With this pattern, a user's AI agent can list our articles, read a full post, or jump straight to booking — without a single simulated click.

## How do you get ready? (4 steps)

1. **Provide machine-readable content:** \`llms.txt\` and structured data (JSON-LD) are the baseline.
2. **List your site's key actions:** search, booking, price lookup — each is a tool candidate.
3. **Design tools safely:** leave read-only tools open; sensitive actions (payments) must require user confirmation.
4. **Start early:** the standard is still experimental, but sites that expose tools early become the default choice in tomorrow's agent-driven experiences.

## Summary

WebMCP extends the web from "pages for humans to read" to "services agents can call." If you want your site or product ready for this wave, [consulting](/services-consult) and [implementation](/services-implement) of exactly this infrastructure is what we do — [book a session](/schedule).

## Frequently asked questions

### How is WebMCP different from regular MCP?

Regular MCP is a separate server (local or remote) that an agent connects to; WebMCP implements the same tool concept inside the web page via the browser API (\`navigator.modelContext\`) and runs with the user's own session and login.

### Is WebMCP enabled in browsers today?

Not by default; Chrome ships it as an experimental Origin Trial and the spec is still evolving at the W3C. A correct implementation must feature-detect the API and no-op without it — exactly what we did.

### Is WebMCP a security risk?

Tools only do what the site defines, and they run in the user's own browser under its permission model. The real risk is designing overly powerful tools without user confirmation — not the protocol itself.

### We already have a public API — do we still need WebMCP?

Yes, for a different scenario: a public API serves server-to-server automation; WebMCP serves the in-browser assistant of a user who is already logged into your site and wants to get things done in natural language.`,
      cover: { url: "/images/implement.webp" },
      publishedAt: "2026-07-11T00:00:00.000Z",
      updatedAt: "2026-07-11T00:00:00.000Z",
      faq: [
        {
          question: "How is WebMCP different from regular MCP?",
          answer:
            "Regular MCP is a separate server an agent connects to; WebMCP registers the same kind of tools inside the web page via navigator.modelContext and runs with the user's own session.",
        },
        {
          question: "Is WebMCP enabled in browsers today?",
          answer:
            "Not by default; Chrome ships it as an experimental Origin Trial. Implementations should feature-detect the API and do nothing when it's absent.",
        },
        {
          question: "Is WebMCP a security risk?",
          answer:
            "Tools only do what the site defines and run in the user's browser under its permission model; the real risk is powerful tools without user confirmation, not the protocol.",
        },
        {
          question: "We already have a public API — do we still need WebMCP?",
          answer:
            "Yes; a public API serves server-to-server automation, while WebMCP serves the in-browser assistant of a logged-in user working in natural language.",
        },
      ],
    },
    {
      id: 5,
      slug: "markdown-for-ai-visibility",
      title: "Markdown and AI: Why Text Structure Determines Your Visibility",
      summary:
        "Why language models understand and cite markdown-like content better, what llms.txt is, and how to structure your site's content for AI agents.",
      content: `**Short answer:** Markdown — with its explicit, lightweight structure of headings, lists, and tables — is the format language models read, summarize, and quote most easily. If you want ChatGPT, Perplexity, and AI Overviews to cite your site, write markdown-shaped content (question headings, short paragraphs, real lists and tables) and publish a machine-readable version via \`llms.txt\`.

## Why does text format matter so much to AI?

A language model doesn't "see" your page like a human; it reads its text. A heavy HTML page is full of menus, scripts, and nested tags, and most of it gets thrown away during processing. That's why many AI agent tools (crawlers and content-extraction libraries) convert web pages to markdown before processing: structure survives, clutter disappears, and token count drops to a fraction of the HTML.

The practical consequence: content written with markdown logic from the start — a clear heading hierarchy, short paragraphs, real lists and tables — survives that conversion intact and stays extractable. Content buried in complex designs disappears at exactly this step.

## What does research say about content structure?

- The GEO study (presented at KDD 2024 by researchers from Princeton and Georgia Tech) found that adding citations, quotations, and statistics — all trivially expressed in markdown — improves content visibility in generative engines by 30–40%.
- An analysis of articles cited by ChatGPT (Search Engine Land, 2025) found 72% of cited posts opened with a short direct answer, and passages of 40–75 words get quoted most.
- Reputable SEO guides recommend keeping paragraphs under ~120 words and breaking information into lists and tables — precisely markdown's building blocks.

## What is llms.txt and how does it help?

\`llms.txt\` is a convention proposed in September 2024 by Jeremy Howard (Answer.AI): a markdown file at your site's root that tells language models "here is this site's most important content" — with summaries and links. The fuller variant, \`llms-full.txt\`, serves the complete text of key pages in one place so an AI agent can see everything without crawling dozens of pages.

This site has both: [llms.txt](/llms.txt) and [llms-full.txt](/llms-full.txt) — generated automatically from the same content source as the articles so they never drift out of sync. That's our firsthand implementation insight: generating from a single source of truth is the only way to prevent content divergence.

## How do you structure content markdown-style? (6 rules)

1. **Open with a short answer:** the first two or three sentences should directly answer the article's core question.
2. **Write headings as questions:** H2s and H3s should be the exact questions users ask an AI.
3. **Keep paragraphs short:** under ~120 words; one idea per paragraph.
4. **Use real lists and tables:** not styled pseudo-tables; actual markdown/HTML list and table elements.
5. **Add statistics and citations:** numbers with named sources demonstrably increase quotability.
6. **Publish machine-readable versions:** \`llms.txt\`, \`llms-full.txt\`, and JSON-LD structured data.

## Summary

In the race for visibility inside AI answers, *what* you say is only half the game; *how it's structured* is the other half. Markdown — as a format or as a mindset — makes your content extractable and citable. If you want your site optimized for answer engines and AI agents, [get a consultation](/services-consult) or [book a session](/schedule).

## Frequently asked questions

### Should we build the whole site in markdown?

No; the point is "markdown logic": a clear heading hierarchy, short paragraphs, and real lists and tables in the rendered HTML. Whatever your CMS, the output should keep its structure after conversion to plain text.

### Where does llms.txt go and what belongs in it?

At the domain root (example.com/llms.txt): one title, a one-paragraph business summary, and a linked list of important pages with one-line descriptions. An llms-full.txt variant can add the full text of key pages.

### Does llms.txt replace sitemap.xml and robots.txt?

No — it complements them. robots.txt manages crawl permission, sitemap.xml lists URLs, and llms.txt serves curated content in a format language models understand directly.

### Does writing for AI hurt classic SEO?

The opposite: the structure that language models prefer (meaningful headings, short paragraphs, tables) is exactly what Google prefers for featured snippets and AI Overviews. One piece of content, both audiences.`,
      cover: { url: "/images/architect.webp" },
      publishedAt: "2026-07-11T00:00:00.000Z",
      updatedAt: "2026-07-11T00:00:00.000Z",
      faq: [
        {
          question: "Should we build the whole site in markdown?",
          answer:
            "No; the point is markdown logic — clear heading hierarchy, short paragraphs, real lists and tables in the rendered HTML, regardless of CMS.",
        },
        {
          question: "Where does llms.txt go and what belongs in it?",
          answer:
            "At the domain root: a title, a one-paragraph business summary, and a linked list of key pages with one-line descriptions; llms-full.txt adds full page texts.",
        },
        {
          question: "Does llms.txt replace sitemap.xml and robots.txt?",
          answer:
            "No — it complements them: robots.txt manages crawling, sitemap.xml lists URLs, and llms.txt serves curated content in an LLM-friendly format.",
        },
        {
          question: "Does writing for AI hurt classic SEO?",
          answer:
            "The opposite: the structure language models prefer is exactly what Google prefers for featured snippets and AI Overviews.",
        },
      ],
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
