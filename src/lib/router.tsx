"use client";

// Thin compatibility layer implementing the react-router-dom API used across the
// migrated pages, backed entirely by Next.js routing (next/navigation + next/link).
// This lets the pages keep their existing call sites while routing is 100% Next.
// No react-router-dom dependency.

import NextLink from "next/link";
import {
  useParams as useNextParams,
  useSearchParams as useNextSearchParams,
  usePathname,
  useRouter,
} from "next/navigation";
import { type ComponentProps, forwardRef, useEffect, useMemo } from "react";

type To = string | { pathname?: string; search?: string; hash?: string };

function toHref(to: To): string {
  if (typeof to === "string") return to;
  return `${to.pathname ?? ""}${to.search ?? ""}${to.hash ?? ""}`;
}

type LinkProps = Omit<ComponentProps<typeof NextLink>, "href"> & {
  to: To;
  replace?: boolean;
  state?: unknown;
};

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { to, replace: _replace, state: _state, ...rest },
  ref,
) {
  return <NextLink ref={ref} href={toHref(to)} {...rest} />;
});

export type NavigateOptions = { replace?: boolean; state?: unknown };

export function useNavigate() {
  const router = useRouter();
  return (to: To | number, options?: NavigateOptions) => {
    if (typeof to === "number") {
      if (to < 0) router.back();
      else router.forward();
      return;
    }
    const href = toHref(to);
    if (options?.replace) router.replace(href);
    else router.push(href);
  };
}

export function useLocation() {
  const pathname = usePathname();
  const search = useNextSearchParams();
  const searchString = search.toString();
  return useMemo(
    () => ({
      pathname: pathname ?? "/",
      search: searchString ? `?${searchString}` : "",
      hash: typeof window !== "undefined" ? window.location.hash : "",
      state: typeof window !== "undefined" ? window.history.state : null,
      key: "default",
    }),
    [pathname, searchString],
  );
}

export function useParams<T extends Record<string, string | undefined> = Record<string, string>>() {
  return (useNextParams() ?? {}) as T;
}

// react-router returns [searchParams, setSearchParams]; mirror that shape.
export function useSearchParams(): [URLSearchParams, (next: URLSearchParams | string) => void] {
  const params = useNextSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const urlParams = useMemo(() => new URLSearchParams(params.toString()), [params]);
  const setSearchParams = (next: URLSearchParams | string) => {
    const qs = typeof next === "string" ? next : next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };
  return [urlParams, setSearchParams];
}

export function Navigate({ to, replace }: { to: To; replace?: boolean }) {
  const router = useRouter();
  const href = toHref(to);
  useEffect(() => {
    if (replace) router.replace(href);
    else router.push(href);
  }, [href, replace, router]);
  return null;
}
