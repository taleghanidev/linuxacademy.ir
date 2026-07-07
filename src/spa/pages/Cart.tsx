"use client";

import { ArrowLeft, Lock, ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import CartLineItem from "@/components/cart/CartLineItem";
import CouponField from "@/components/cart/CouponField";
import CustomerFields, { type Customer } from "@/components/cart/CustomerFields";
import EmptyCart from "@/components/cart/EmptyCart";
import OrderTotals from "@/components/cart/OrderTotals";
import NavBar from "@/components/NavBar";
import navBarEn from "@/language/en/components/navBar";
import cartEn from "@/language/en/pages/cart";
import navBarFa from "@/language/fa/components/navBar";
import cartFa from "@/language/fa/pages/cart";
import { type CartItemType, useCart } from "@/lib/cart";
import { Link } from "@/lib/router";

const Cart = () => {
  const { items, subtotal, updateQuantity, removeItem, clear } = useCart();
  const isFa = typeof document !== "undefined" && document.documentElement.dir === "rtl";
  const t = isFa ? cartFa : cartEn;
  const navLang = isFa ? navBarFa : navBarEn;
  const currency = isFa ? "تومان" : "T";

  const typeLabel = (type: CartItemType): string =>
    type === "sponsorship" ? (isFa ? "اسپانسری" : "Sponsorship") : isFa ? "مشاوره" : "Consultation";

  const unitLabel = (type: CartItemType): string | undefined =>
    type === "booking" ? t.labels.hour : undefined;

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const [customer, setCustomer] = useState<Customer>({ name: "", email: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [discount, setDiscount] = useState(0);

  // Validate a code against the server (honors admin-managed DB codes + static).
  const validateCoupon = useCallback(
    async (code: string, silent = false) => {
      if (!code.trim() || items.length === 0) return;
      try {
        const res = await fetch("/api/coupon", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            lines: items.map((i) => ({ type: i.type, amount: i.unitPrice * i.quantity })),
          }),
        });
        const result = await res.json();
        if (result.valid) {
          setAppliedCoupon(result.code);
          setDiscount(result.discount);
          setCouponError(null);
        } else {
          setAppliedCoupon(null);
          setDiscount(0);
          if (!silent) setCouponError(t.errors?.invalidCoupon || "Invalid coupon");
        }
      } catch {
        if (!silent) setCouponError(t.errors?.invalidCoupon || "Invalid coupon");
      }
    },
    [items, t],
  );

  const applyCoupon = () => {
    setCouponError(null);
    validateCoupon(couponInput);
  };

  // Keep the discount correct as the cart contents change.
  useEffect(() => {
    if (appliedCoupon) validateCoupon(appliedCoupon, true);
  }, [appliedCoupon, validateCoupon]);

  const total = Math.max(0, subtotal - discount);

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

  const itemCount = items.reduce((n, i) => n + i.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar lang={navLang} />
      <div className="container mx-auto max-w-5xl px-4 pb-16 pt-28">
        <div className="mb-8 flex items-baseline gap-3">
          <h1 className="text-3xl font-bold text-gray-900">{t.headings?.orderSummary || "Cart"}</h1>
          {items.length > 0 && (
            <span className="text-sm text-gray-500">
              {itemCount} {isFa ? "مورد" : itemCount === 1 ? "item" : "items"}
            </span>
          )}
        </div>

        {items.length === 0 ? (
          <EmptyCart
            message={t.buttons.emptyCart}
            action={
              <Link
                to="/sponsor"
                className="inline-block rounded-lg bg-brand-purple px-6 py-2.5 font-medium text-white transition-colors hover:bg-brand-purple-dark"
              >
                {t.buttons.continueShopping}
              </Link>
            }
          />
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Line items */}
            <div className="space-y-4 lg:col-span-2">
              {items.map((item) => (
                <CartLineItem
                  key={item.id}
                  label={item.label}
                  type={item.type}
                  typeLabel={typeLabel(item.type)}
                  unitPrice={item.unitPrice}
                  quantity={item.quantity}
                  currency={currency}
                  min={item.minQuantity}
                  max={item.maxQuantity}
                  unitLabel={unitLabel(item.type)}
                  onQuantityChange={(q) => updateQuantity(item.id, q)}
                  onRemove={() => removeItem(item.id)}
                  removeLabel={t.buttons.remove}
                  decreaseLabel={isFa ? "کاهش" : "decrease"}
                  increaseLabel={isFa ? "افزایش" : "increase"}
                />
              ))}
              <Link
                to="/sponsor"
                className="inline-flex items-center gap-1.5 text-sm text-brand-purple transition-colors hover:text-brand-purple-dark"
              >
                <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                {t.buttons.continueShopping}
              </Link>
            </div>

            {/* Summary + checkout */}
            <form
              onSubmit={checkout}
              className="h-fit space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:sticky lg:top-28"
            >
              <CouponField
                value={couponInput}
                onChange={setCouponInput}
                onApply={applyCoupon}
                label={t.labels.coupon}
                placeholder={t.labels.enterCoupon}
                applyLabel={t.buttons.applyCoupon}
                currency={currency}
                error={couponError}
                appliedCode={appliedCoupon}
                discount={discount}
              />

              <div className="border-t border-gray-100 pt-5">
                <OrderTotals
                  subtotal={subtotal}
                  discount={discount}
                  total={total}
                  currency={currency}
                  labels={{
                    subtotal: t.labels.subtotal,
                    discount: t.labels.coupon,
                    total: t.labels.total,
                  }}
                />
              </div>

              <div className="border-t border-gray-100 pt-5">
                <CustomerFields
                  value={customer}
                  onChange={setCustomer}
                  labels={{
                    name: t.labels.name,
                    email: t.labels.email,
                    phone: t.labels.phone,
                  }}
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-gradient-to-r from-brand-purple to-brand-magenta py-3 font-semibold text-white shadow-sm transition-opacity hover:opacity-95 disabled:opacity-50"
              >
                {submitting ? t.buttons.processing : t.buttons.checkout}
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-gray-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {isFa ? "پرداخت امن" : "Secure payment"}
                </span>
                <span className="flex items-center gap-1">
                  <Lock className="h-3.5 w-3.5" />
                  {isFa ? "زرین‌پال" : "Zarinpal"}
                </span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
