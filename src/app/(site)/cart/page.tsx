import type { Metadata } from "next";
import { CartClient } from "../spa-clients";

export const metadata: Metadata = {
  title: "سبد خرید | لینوکس آکادمی",
  robots: { index: false },
};

export default function Route() {
  return <CartClient />;
}
