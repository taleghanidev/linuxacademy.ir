"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import NavBar from "@/components/NavBar";
import navBarEn from "@/language/en/components/navBar";
import navBarFa from "@/language/fa/components/navBar";
import { cn } from "@/lib/utils";

// Syncs <html> dir/lang from the URL / existing state. Shared by all SPA pages
// so the RTL boilerplate lives in one place.
function useRtlSync() {
  useEffect(() => {
    const fa =
      window.location.pathname.startsWith("/fa") ||
      document.documentElement.lang === "fa" ||
      document.documentElement.dir === "rtl";
    document.documentElement.dir = fa ? "rtl" : "ltr";
    document.documentElement.lang = fa ? "fa" : "en";
  }, []);
}

/** True when the document is in RTL (Persian) mode. Safe during SSR. */
export function useIsFa(): boolean {
  return typeof document !== "undefined" && document.documentElement.dir === "rtl";
}

type PageShellProps = {
  children: ReactNode;
  /** Extra classes for the inner container. */
  className?: string;
  /** Wrap children in the standard centered container. Off for full-width pages. */
  container?: boolean;
};

/**
 * Standard page shell: gray background + NavBar + (optional) centered container.
 * The global footer and cart button live in Providers, so pages only supply content.
 */
export default function PageShell({ children, className, container = true }: PageShellProps) {
  useRtlSync();
  const isFa = useIsFa();
  const navLang = isFa ? navBarFa : navBarEn;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar lang={navLang} />
      {container ? (
        <div className={cn("container mx-auto pb-4 pt-24", className)}>{children}</div>
      ) : (
        children
      )}
    </div>
  );
}
