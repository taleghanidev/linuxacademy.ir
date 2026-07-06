"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import NavBar from "@/components/NavBar";
import { evaluateCoupon } from "@/config/coupons";
import navBarEn from "@/language/en/components/navBar";
import cartEn from "@/language/en/pages/cart";
import navBarFa from "@/language/fa/components/navBar";
import cartFa from "@/language/fa/pages/cart";
import { useCart } from "@/lib/cart";
import { Link } from "@/lib/router";

const Cart = () => {
  const { items, subtotal, updateQuantity, removeItem, clear } = useCart();
  const isFa = document.documentElement.dir === "rtl";
  const t = isFa ? cartFa : cartEn;
  const navLang = isFa ? navBarFa : navBarEn;
  const currency = isFa ? "تومان" : "T";

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fmt = (n: number) => `${n.toLocaleString("en-US")} ${currency}`;

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    const result = evaluateCoupon(
      appliedCoupon,
      items.map((i) => ({ type: i.type, amount: i.unitPrice * i.quantity })),
    );
    return result.valid ? result.discount : 0;
  }, [appliedCoupon, items]);

  const total = Math.max(0, subtotal - discount);

  const applyCoupon = () => {
    setCouponError(null);
    const result = evaluateCoupon(
      couponInput,
      items.map((i) => ({ type: i.type, amount: i.unitPrice * i.quantity })),
    );
    if (result.valid) {
      setAppliedCoupon(result.code);
    } else {
      setAppliedCoupon(null);
      setCouponError(t.errors?.invalidCoupon || "Invalid coupon");
    }
  };

  const checkout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!customer.name.trim() || !customer.email.trim() || !customer.phone.trim()) {
      setError(t.errors?.required || "Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          couponCode: appliedCoupon || undefined,
          items: items.map((i) => ({
            type: i.type,
            itemKey: i.itemKey,
            label: i.label,
            quantity: i.quantity,
            meta: i.meta,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Checkout failed");
        setSubmitting(false);
        return;
      }
      clear();
      window.location.href = data.startPayUrl;
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar lang={navLang} />
      <div className="container mx-auto px-4 pt-28 pb-16 max-w-5xl">
        <h1 className="text-3xl font-bold mb-8">{t.headings?.orderSummary || "Cart"}</h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-10 text-center">
            <p className="text-gray-600 mb-6">{t.buttons.emptyCart}</p>
            <Link
              to="/sponsor"
              className="inline-block px-6 py-2 bg-brand-purple text-white rounded-md hover:bg-brand-purple/90"
            >
              {t.buttons.continueShopping}
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Line items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-4"
                >
                  <div className="flex-grow">
                    <div className="font-semibold">{item.label}</div>
                    <div className="text-sm text-gray-500">
                      {fmt(item.unitPrice)} × {item.quantity}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="h-8 w-8 rounded border flex items-center justify-center hover:bg-gray-50"
                      aria-label="decrease"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="h-8 w-8 rounded border flex items-center justify-center hover:bg-gray-50"
                      aria-label="increase"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="w-32 text-end font-medium">
                    {fmt(item.unitPrice * item.quantity)}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-600"
                    aria-label={t.buttons.remove}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
              <Link
                to="/sponsor"
                className="inline-block text-brand-purple hover:underline text-sm"
              >
                ← {t.buttons.continueShopping}
              </Link>
            </div>

            {/* Summary + checkout */}
            <form onSubmit={checkout} className="bg-white rounded-lg shadow-sm p-6 h-fit space-y-4">
              {/* Coupon */}
              <div>
                <label className="block text-sm font-medium mb-1">{t.labels.coupon}</label>
                <div className="flex gap-2">
                  <input
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder={t.labels.enterCoupon}
                    className="flex-grow rounded border px-3 py-2 text-sm"
                  />
                  <button
                    type="button"
                    onClick={applyCoupon}
                    className="px-3 py-2 rounded border text-sm hover:bg-gray-50 whitespace-nowrap"
                  >
                    {t.buttons.applyCoupon}
                  </button>
                </div>
                {couponError && <p className="text-xs text-red-600 mt-1">{couponError}</p>}
                {appliedCoupon && (
                  <p className="text-xs text-green-600 mt-1">
                    {appliedCoupon} −{fmt(discount)}
                  </p>
                )}
              </div>

              <div className="border-t pt-4 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">{t.labels.subtotal}</span>
                  <span>{fmt(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>{t.labels.coupon}</span>
                    <span>−{fmt(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold pt-2">
                  <span>{t.labels.total}</span>
                  <span>{fmt(total)}</span>
                </div>
              </div>

              {/* Customer */}
              <div className="border-t pt-4 space-y-3">
                <input
                  required
                  placeholder={t.labels.name}
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  className="w-full rounded border px-3 py-2 text-sm"
                />
                <input
                  required
                  type="email"
                  placeholder={t.labels.email}
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  className="w-full rounded border px-3 py-2 text-sm"
                />
                <input
                  required
                  placeholder={t.labels.phone}
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  className="w-full rounded border px-3 py-2 text-sm"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded bg-brand-purple py-2.5 font-medium text-white hover:bg-brand-purple/90 disabled:opacity-50"
              >
                {submitting ? t.buttons.processing : t.buttons.checkout}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
