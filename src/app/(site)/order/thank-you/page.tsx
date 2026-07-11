import type { Metadata } from "next";
import { OrderThankYouClient } from "../../spa-clients";

export const metadata: Metadata = {
  title: "تشکر از سفارش | لینوکس آکادمی",
  robots: { index: false },
};

export default function Route() {
  return <OrderThankYouClient />;
}
