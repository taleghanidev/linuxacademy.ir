// Owner email notifications via Resend. No-ops gracefully when RESEND_API_KEY
// is unset. Failures never break the payment/scheduling flow.

const API_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.RESEND_FROM || "Linux Academy <onboarding@resend.dev>";

function ownerEmail(): string | null {
  return (
    process.env.OWNER_NOTIFY_EMAIL ||
    (process.env.CLERK_ADMIN_EMAILS || "").split(",")[0]?.trim() ||
    null
  );
}

async function send(subject: string, html: string): Promise<void> {
  const to = ownerEmail();
  if (!API_KEY || !to) return;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: [to], subject, html }),
    });
    if (!res.ok) console.error("Resend send failed:", (await res.text()).slice(0, 200));
  } catch (err) {
    console.error("Resend send error:", err);
  }
}

const fmt = (n: number) => `${n.toLocaleString("en-US")} Toman`;

type OrderEmail = {
  refId: string | null;
  total: number;
  discount: number;
  couponCode: string | null;
  customer: { name: string; email: string; phone: string };
  items: Array<{ label: string; quantity: number; amount: number; type: string }>;
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
