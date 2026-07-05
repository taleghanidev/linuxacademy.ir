import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Linux Academy",
  description: "Consulting bookings and sponsorships.",
};

// Runs before hydration so the whole app renders in the correct language/direction
// (fa = rtl default). Reads the visitor's saved choice from localStorage.
const setInitialDir = `(function(){try{var l=localStorage.getItem('selected_language')||'fa';document.documentElement.setAttribute('lang',l);document.documentElement.setAttribute('dir',l==='fa'?'rtl':'ltr');}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="fa"
        dir="rtl"
        suppressHydrationWarning
        className={`${vazirmatn.variable} h-full antialiased`}
      >
        <head>
          {/* eslint-disable-next-line @next/next/no-sync-scripts */}
          <script dangerouslySetInnerHTML={{ __html: setInitialDir }} />
        </head>
        <body className="min-h-full flex flex-col font-sans">{children}</body>
      </html>
    </ClerkProvider>
  );
}
