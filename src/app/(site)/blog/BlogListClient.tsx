"use client";
import dynamic from "next/dynamic";

const Page = dynamic(() => import("@/spa/pages/Blog"), {
  ssr: false,
  loading: () => <div className="min-h-screen" />,
});

export default function BlogListClient() {
  return <Page />;
}
