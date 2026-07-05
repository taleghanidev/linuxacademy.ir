"use client";

import { Link, useLocation } from "@/lib/router";

const OrderThankYou = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const ref = query.get("ref");
  const isFa = document.documentElement.dir === "rtl";

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
        <Link
          to="/"
          className="inline-block px-6 py-2 bg-brand-purple text-white rounded-md hover:bg-brand-purple/90 transition-colors"
        >
          {isFa ? "بازگشت به خانه" : "Back to home"}
        </Link>
      </div>
    </div>
  );
};

export default OrderThankYou;
