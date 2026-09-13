// Email via Resend: owner notifications and course emails to students.
// No-ops gracefully when RESEND_API_KEY is unset. Failures never break the
// payment/scheduling/registration flow.

const API_KEY = process.env.RESEND_API_KEY;
// Hard-coded: linuxacademy.ir is the domain verified in Resend.
const FROM = "Linux Academy <notify@linuxacademy.ir>";

function ownerEmail(): string | null {
  return (
    process.env.OWNER_NOTIFY_EMAIL ||
    (process.env.CLERK_ADMIN_EMAILS || "").split(",")[0]?.trim() ||
    null
  );
}

/** Sends one email. Resolves true when Resend accepted it. */
async function deliver(
  to: string,
  subject: string,
  html: string,
): Promise<boolean> {
  if (!API_KEY || !to) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM, to: [to], subject, html }),
    });
    if (!res.ok)
      console.error("Resend send failed:", (await res.text()).slice(0, 200));
    return res.ok;
  } catch (err) {
    console.error("Resend send error:", err);
    return false;
  }
}

async function send(subject: string, html: string): Promise<void> {
  const to = ownerEmail();
  if (to) await deliver(to, subject, html);
}

/** Student-typed text goes into HTML, so escape it. */
const esc = (v: string) =>
  v.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );

const fmt = (n: number) => `${n.toLocaleString("en-US")} Toman`;

type OrderEmail = {
  refId: string | null;
  total: number;
  discount: number;
  couponCode: string | null;
  customer: { name: string; email: string; phone: string };
  items: Array<{
    label: string;
    quantity: number;
    amount: number;
    type: string;
  }>;
};

export async function notifyOrderPaid(o: OrderEmail): Promise<void> {
  const rows = o.items
    .map(
      (i) =>
        `<tr><td style="padding:6px 12px;border-bottom:1px solid #eee">${i.label}</td>` +
        `<td style="padding:6px 12px;border-bottom:1px solid #eee">×${i.quantity}</td>` +
        `<td style="padding:6px 12px;border-bottom:1px solid #eee">${fmt(i.amount)}</td></tr>`,
    )
    .join("");
  const kinds = [...new Set(o.items.map((i) => i.type))].join(" + ");
  await send(
    `💰 New paid order (${kinds}) — ${fmt(o.total)}`,
    `<div style="font-family:sans-serif;max-width:560px">
      <h2 style="color:#8B5CF6">New paid order</h2>
      <p><b>${o.customer.name}</b> · ${o.customer.email} · <span dir="ltr">${o.customer.phone}</span></p>
      <table style="border-collapse:collapse;width:100%">${rows}</table>
      <p style="margin-top:12px">
        ${o.discount > 0 ? `Discount: −${fmt(o.discount)} (${o.couponCode ?? ""})<br/>` : ""}
        <b>Total: ${fmt(o.total)}</b><br/>
        Ref: <span dir="ltr">${o.refId ?? "—"}</span>
      </p>
      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin">Open dashboard →</a></p>
    </div>`,
  );
}

export async function notifySessionScheduled(s: {
  customer: { name: string; email: string };
  startIso: string;
  meetLink: string | null;
}): Promise<void> {
  await send(
    `📅 New consultation scheduled — ${s.customer.name}`,
    `<div style="font-family:sans-serif;max-width:560px">
      <h2 style="color:#8B5CF6">Session scheduled</h2>
      <p><b>${s.customer.name}</b> (${s.customer.email})</p>
      <p>Time: <b dir="ltr">${s.startIso}</b> (UTC — see your Google Calendar for local time)</p>
      ${s.meetLink ? `<p><a href="${s.meetLink}">Google Meet link</a></p>` : ""}
    </div>`,
  );
}

export async function notifyCourseEnrollment(e: {
  id: string;
  courseSlug: string;
  fullName: string;
  email: string;
  phone: string;
  amount: number;
  currency?: string;
  receiptUrl: string;
}): Promise<void> {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 12px;border-bottom:1px solid #eee;color:#666">${label}</td>` +
    `<td style="padding:6px 12px;border-bottom:1px solid #eee"><b>${value}</b></td></tr>`;

  await send(
    `New course registration — ${e.fullName}`,
    `<h2 style="font-family:system-ui">New course registration</h2>
     <table style="font-family:system-ui;border-collapse:collapse;font-size:14px">
       ${row("Course", e.courseSlug)}
       ${row("Name", e.fullName)}
       ${row("Email", e.email)}
       ${row("Phone", e.phone)}
       ${row("Fee quoted", e.currency === "AUD" ? `A$${e.amount.toLocaleString("en-US")}` : fmt(e.amount))}
     </table>
     <p style="font-family:system-ui;font-size:14px">
       <a href="${e.receiptUrl}">View the payment receipt</a><br>
       Confirm or reject the seat in the admin area. Reference: ${e.id}
     </p>`,
  );
}

/* ---------- Course emails to the student (Persian, right-to-left) ---------- */

export type EnrollmentEmailKind = "received" | "confirmed" | "rejected";

type StudentEmail = {
  to: string;
  fullName: string;
  courseTitle: string;
  startDate: string;
  schedule: string;
  reviewNote?: string | null;
};

function studentShell(heading: string, body: string): string {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://linuxacademy.ir";
  return `<div dir="rtl" lang="fa" style="font-family:Tahoma,Arial,sans-serif;max-width:560px;margin:0 auto;line-height:1.9;color:#1f2937;text-align:right">
    <h2 style="color:#7C3AED;margin-bottom:8px">${heading}</h2>
    ${body}
    <hr style="border:none;border-top:1px solid #eee;margin:24px 0" />
    <p style="font-size:12px;color:#9ca3af">لینوکس آکادمی · <a href="${site}" style="color:#7C3AED">linuxacademy.ir</a><br/>
    برای هر پرسشی به همین ایمیل پاسخ دهید یا از صفحه تماس سایت اقدام کنید.</p>
  </div>`;
}

export async function sendEnrollmentEmail(
  kind: EnrollmentEmailKind,
  e: StudentEmail,
): Promise<boolean> {
  const name = esc(e.fullName);
  const course = esc(e.courseTitle);
  const note = e.reviewNote?.trim()
    ? `<p style="background:#f9fafb;border-radius:8px;padding:10px 14px">${esc(e.reviewNote.trim())}</p>`
    : "";

  if (kind === "received") {
    return deliver(
      e.to,
      `ثبت‌نام شما در «${e.courseTitle}» دریافت شد`,
      studentShell(
        "ثبت‌نام شما دریافت شد",
        `<p>${name} عزیز، سلام.</p>
         <p>فرم ثبت‌نام و رسید پرداخت شما برای دوره <b>${course}</b> به دست ما رسید. رسید را بررسی می‌کنیم و حداکثر ظرف دو روز کاری نتیجه را به شما اعلام می‌کنیم.</p>
         <p>تا آن زمان کار دیگری لازم نیست.</p>`,
      ),
    );
  }

  if (kind === "confirmed") {
    return deliver(
      e.to,
      `ثبت‌نام شما در «${e.courseTitle}» تأیید شد`,
      studentShell(
        "ثبت‌نام شما تأیید شد ✅",
        `<p>${name} عزیز، سلام.</p>
         <p>پرداخت شما بررسی و ثبت‌نامتان در دوره <b>${course}</b> قطعی شد. خوشحالیم که همراه ما هستید.</p>
         <table style="border-collapse:collapse;margin:12px 0">
           <tr><td style="padding:4px 0 4px 16px;color:#6b7280">شروع دوره</td><td style="padding:4px 0"><b>${esc(e.startDate)}</b></td></tr>
           <tr><td style="padding:4px 0 4px 16px;color:#6b7280">زمان جلسات</td><td style="padding:4px 0"><b>${esc(e.schedule)}</b></td></tr>
         </table>
         ${note}
         <p>لینک ورود به جلسات پیش از جلسه اول برایتان فرستاده می‌شود.</p>`,
      ),
    );
  }

  return deliver(
    e.to,
    `درباره ثبت‌نام شما در «${e.courseTitle}»`,
    studentShell(
      "ثبت‌نام شما تأیید نشد",
      `<p>${name} عزیز، سلام.</p>
       <p>متأسفانه نتوانستیم پرداخت شما برای دوره <b>${course}</b> را با رسید ارسالی تطبیق دهیم.</p>
       ${note}
       <p>اگر فکر می‌کنید اشتباهی رخ داده، به همین ایمیل پاسخ دهید تا بررسی کنیم.</p>`,
    ),
  );
}
