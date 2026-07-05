"use client";
import dynamic from "next/dynamic";

const Page = dynamic(() => import("@/spa/pages/NotFound"), {
  ssr: false,
  loading: () => <div className="min-h-screen" />,
});
export default function NotFound() {
  return <Page />;
}
