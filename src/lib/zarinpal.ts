// Zarinpal payment gateway — request + verify.
// Ported from the original Strapi controllers (pg/v4 API).

const MERCHANT_ID = process.env.ZARINPAL_MERCHANT_ID;
const BASE_URL = (process.env.ZARINPAL_BASE_URL || "https://api.zarinpal.com").replace(/\/+$/, "");
// Prices in this app are expressed in Toman (matching the UI). Tell Zarinpal so
// there is no unit ambiguity. Set ZARINPAL_CURRENCY=IRR if your prices are in Rial.
const CURRENCY = process.env.ZARINPAL_CURRENCY || "IRT";

function requireMerchant(): string {
  if (!MERCHANT_ID) throw new Error("Missing ZARINPAL_MERCHANT_ID");
  // The original code stripped a leading 'm' prefix if present.
  return MERCHANT_ID.startsWith("m") ? MERCHANT_ID.slice(1) : MERCHANT_ID;
}

export type ZarinpalRequestResult = {
  authority: string;
  startPayUrl: string;
};

/**
 * Create a payment request. Returns the authority + the URL to redirect the user to.
 * `amount` is in the configured CURRENCY (Toman by default).
 */
export async function zarinpalRequest(params: {
  amount: number;
  callbackUrl: string;
  description: string;
  metadata?: Record<string, string | number>;
}): Promise<ZarinpalRequestResult> {
  const merchant_id = requireMerchant();
  const res = await fetch(`${BASE_URL}/pg/v4/payment/request.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      merchant_id,
      amount: params.amount,
      currency: CURRENCY,
      callback_url: params.callbackUrl,
      description: params.description,
      metadata: params.metadata,
    }),
  });

  const json = await res.json();
  const data = json?.data;
  if (!data?.authority || data.code !== 100) {
    const code = json?.errors?.code ?? data?.code ?? "UNKNOWN";
    const message = json?.errors?.message ?? "Zarinpal payment request failed";
    throw new Error(`Zarinpal request error (${code}): ${message}`);
  }

  return {
    authority: data.authority,
    startPayUrl: `${BASE_URL}/pg/StartPay/${data.authority}`,
  };
}

export type ZarinpalVerifyResult = {
  success: boolean;
  refId: string | null;
  code: number;
};

/**
 * Verify a payment after the user returns from the gateway.
 * `amount` must match the original request. Success when code === 100 (or 101 = already verified).
 */
export async function zarinpalVerify(params: {
  amount: number;
  authority: string;
}): Promise<ZarinpalVerifyResult> {
  const merchant_id = requireMerchant();
  const res = await fetch(`${BASE_URL}/pg/v4/payment/verify.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      merchant_id,
      amount: params.amount,
      authority: params.authority,
    }),
  });

  const json = await res.json();
  const data = json?.data;
  if (!data) {
    return { success: false, refId: null, code: json?.errors?.code ?? -1 };
  }

  const code = data.code;
  const success = code === 100 || code === 101;
  return { success, refId: data.ref_id ? String(data.ref_id) : null, code };
}
