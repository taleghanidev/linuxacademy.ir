"use client";
import dynamic from "next/dynamic";

const Page = dynamic(() => import("@/spa/pages/BookRedirect"), {
  ssr: false,
  loading: () => <div className="min-h-screen" />,
});
export default function Route() {
  return <Page />;
}
