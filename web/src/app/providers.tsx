"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useContext, useEffect, useState } from "react";
import { GlobalContext, GlobalProvider } from "@/components/GlobalContext";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/lib/cart";

// These read document.* during render, so keep them client-only.
const FooterCard = dynamic(() => import("@/components/FooterCard"), { ssr: false });
const CartButton = dynamic(() => import("@/components/CartButton"), { ssr: false });

// Keeps the browser tab favicon in sync with the global settings (as before).
function FaviconUpdater() {
  const global = useContext(GlobalContext);
  useEffect(() => {
    if (!global.favicon) return;
    let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = global.favicon;
  }, [global.favicon]);
  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <FaviconUpdater />
            <div className="flex min-h-screen flex-col">
              <div className="flex-grow">{children}</div>
              <FooterCard />
            </div>
            <CartButton />
          </TooltipProvider>
        </CartProvider>
      </GlobalProvider>
    </QueryClientProvider>
  );
}
