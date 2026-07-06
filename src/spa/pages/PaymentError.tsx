"use client";

import NavBar from "@/components/NavBar";
import navBarEn from "@/language/en/components/navBar";
import paymentErrorMessagesEn from "@/language/en/pages/paymentError";
import navBarFa from "@/language/fa/components/navBar";
import paymentErrorMessagesFa from "@/language/fa/pages/paymentError";
import { Link, useLocation } from "@/lib/router";

const PaymentError = () => {
  const location = useLocation();
  const error = location.state?.error;
  const lang = document.documentElement.dir === "rtl" ? "fa" : "en";
  const paymentErrorMessages = lang === "fa" ? paymentErrorMessagesFa : paymentErrorMessagesEn;
  const message = error?.key ? paymentErrorMessages[error.key] : undefined;

  return (
    <>
      <NavBar lang={lang === "fa" ? navBarFa : navBarEn} />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Payment Error</h2>
          <p className="mb-2 text-gray-700">Sorry, your payment could not be processed.</p>
          {message && <div className="mb-2 text-sm text-gray-500">{message}</div>}
          {!message && error?.code && (
            <div className="mb-2 text-sm text-gray-500">
              Unknown payment error. Please contact support.
            </div>
          )}
          {error?.code && (
            <div className="mb-2 text-xs text-gray-400">(Error code: {error.code})</div>
          )}
          <Link
            to="/"
            className="mt-6 text-brand-purple hover:underline text-base font-medium inline-block"
          >
            &larr; Return to Home
          </Link>
        </div>
      </div>
    </>
  );
};

export default PaymentError;
