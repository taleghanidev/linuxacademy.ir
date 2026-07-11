import type { Metadata } from "next";
import { PaymentErrorClient } from "../spa-clients";

export const metadata: Metadata = {
  title: "خطای پرداخت | لینوکس آکادمی",
  robots: { index: false },
};

export default function Route() {
  return <PaymentErrorClient />;
}
