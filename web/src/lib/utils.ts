import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Resolves a media URL. Images are static local assets now (e.g. /images/...),
 * so absolute and root-relative URLs are returned as-is.
 */
export function getMediaUrl(url?: string): string {
  return url ?? "";
}

// Backwards-compatible alias for existing call sites.
export const getStrapiMediaUrl = getMediaUrl;
