"use client";

import { useEffect, useState } from "react";
import { Link, useLocation } from "@/lib/router";

const OrderThankYou = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const ref = query.get("ref");
  const orderId = query.get("order");
  const isFa = document.documentElement.dir === "rtl";

  const [sessionsLeft, setSessionsLeft] = useState<number>(0);

  useEffect(() => {
    if (!orderId) return;
    fetch(`/api/schedule?order=${encodeURIComponent(orderId)}`)
      .then((r) => r.json())
      .then((j) => setSessionsLeft(j.left ?? 0))
      .catch(() => {});
  }, [orderId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-3">
          {isFa ? "پرداخت با موفقیت انجام شد" : "Payment successful"}
        </h1>
        <p className="text-lg mb-4">
          {isFa
            ? "از خرید شما سپاسگزاریم. سفارش شما ثبت شد."
            : "Thank you for your purchase. Your order is confirmed."}
        </p>
        {ref && (
          <div className="mb-6 text-base">
            <b>{isFa ? "کد پیگیری:" : "Reference:"}</b>{" "}
            <span className="text-brand-purple">{ref}</span>
          </div>
        )}

        {sessionsLeft > 0 && orderId && (
          <div className="mb-6 rounded-md border border-brand-purple/30 bg-brand-purple/5 p-4">
            <p className="mb-3 text-sm">
              {isFa
                ? `شما ${sessionsLeft} جلسه مشاوره برای زمان‌بندی دارید.`
                : `You have ${sessionsLeft} consultation session${sessionsLeft > 1 ? "s" : ""} to schedule.`}
            </p>
            <Link
              to={`/schedule?order=${orderId}`}
              className="inline-block rounded-md bg-brand-purple px-6 py-2.5 font-medium text-white hover:bg-brand-purple/90"
            >
              {isFa ? "زمان‌بندی جلسات" : "Schedule your sessions"}
            </Link>
          </div>
        )}

        <Link
          to="/"
          className="inline-block px-6 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
        >
          {isFa ? "بازگشت به خانه" : "Back to home"}
        </Link>
      </div>
    </div>
  );
};

export default OrderThankYou;
