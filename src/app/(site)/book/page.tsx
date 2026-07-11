import type { Metadata } from "next";
import { BookClient } from "../spa-clients";

export const metadata: Metadata = {
  title: "رزرو مشاوره | لینوکس آکادمی",
  robots: { index: false },
};

export default function Route() {
  return <BookClient />;
}
