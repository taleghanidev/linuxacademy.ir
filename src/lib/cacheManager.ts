interface CacheItem {
  data: any;
  timestamp: number;
  ttl: number;
  size: number;
}

interface CacheConfig {
  maxSize: number; // Maximum cache size in MB
  defaultTTL: number; // Default TTL in milliseconds
}

class SmartCacheManager {
  private config: CacheConfig;
  private readonly CACHE_PREFIX = "linuxacademy_";
  private readonly META_KEY = "cache_meta";

  constructor(config: CacheConfig = { maxSize: 2, defaultTTL: 30 * 60 * 1000 }) {
    this.config = config;
  }

  // Calculate approximate size of data in bytes
  private calculateSize(data: any): number {
    return new Blob([JSON.stringify(data)]).size;
  }

  // Get cache metadata
  private getMeta(): Record<string, { size: number; timestamp: number }> {
    try {
      const meta = localStorage.getItem(this.CACHE_PREFIX + this.META_KEY);
      return meta ? JSON.parse(meta) : {};
    } catch {
      return {};
    }
  }

  // Update cache metadata
  private updateMeta(key: string, size: number, timestamp: number) {
    const meta = this.getMeta();
    meta[key] = { size, timestamp };
    localStorage.setItem(this.CACHE_PREFIX + this.META_KEY, JSON.stringify(meta));
  }

  // Get total cache size
  private getTotalCacheSize(): number {
    const meta = this.getMeta();
    return Object.values(meta).reduce((total, item) => total + item.size, 0);
  }

  // Clean expired items
  private cleanExpired() {
    const meta = this.getMeta();
    const now = Date.now();
    const updatedMeta: Record<string, { size: number; timestamp: number }> = {};

    Object.entries(meta).forEach(([key, item]) => {
      const fullKey = this.CACHE_PREFIX + key;
      const cached = localStorage.getItem(fullKey);

      if (cached) {
        try {
          const parsed: CacheItem = JSON.parse(cached);
          if (now - parsed.timestamp <= parsed.ttl) {
            updatedMeta[key] = item;
          } else {
            localStorage.removeItem(fullKey);
          }
        } catch {
          localStorage.removeItem(fullKey);
        }
      }
    });

    localStorage.setItem(this.CACHE_PREFIX + this.META_KEY, JSON.stringify(updatedMeta));
  }

  // Make space by removing oldest items
  private makeSpace(requiredSize: number) {
    const meta = this.getMeta();
    const maxSizeBytes = this.config.maxSize * 1024 * 1024;

    if (this.getTotalCacheSize() + requiredSize <= maxSizeBytes) {
      return; // No need to make space
    }

    // Sort by timestamp (oldest first)
    const sortedItems = Object.entries(meta).sort(([, a], [, b]) => a.timestamp - b.timestamp);

    for (const [key] of sortedItems) {
      this.remove(key);
      if (this.getTotalCacheSize() + requiredSize <= maxSizeBytes) {
        break;
      }
    }
  }

  // Set cache item with size and TTL management
  set(key: string, data: any, ttl: number = this.config.defaultTTL): boolean {
    try {
      this.cleanExpired();

      const size = this.calculateSize(data);
      const maxSizeBytes = this.config.maxSize * 1024 * 1024;

      // Don't cache if item is too large
      if (size > maxSizeBytes * 0.5) {
        console.warn(`Cache item too large: ${key} (${size} bytes)`);
        return false;
      }

      this.makeSpace(size);

      const item: CacheItem = {
        data,
        timestamp: Date.now(),
        ttl,
        size,
      };

      const fullKey = this.CACHE_PREFIX + key;
      localStorage.setItem(fullKey, JSON.stringify(item));
      this.updateMeta(key, size, item.timestamp);

      return true;
    } catch (error) {
      console.warn(`Failed to cache ${key}:`, error);
      return false;
    }
  }

  // Get cache item
  get(key: string): any | null {
    try {
      const fullKey = this.CACHE_PREFIX + key;
      const item = localStorage.getItem(fullKey);

      if (!item) return null;

      const parsed: CacheItem = JSON.parse(item);
      const now = Date.now();

      if (now - parsed.timestamp > parsed.ttl) {
        this.remove(key);
        return null;
      }

      return parsed.data;
    } catch {
      this.remove(key);
      return null;
    }
  }

  // Remove cache item
  remove(key: string) {
    try {
      const fullKey = this.CACHE_PREFIX + key;
      localStorage.removeItem(fullKey);

      const meta = this.getMeta();
      delete meta[key];
      localStorage.setItem(this.CACHE_PREFIX + this.META_KEY, JSON.stringify(meta));
    } catch {
      // Silent fail
    }
  }

  // Clear all cache
  clear() {
    try {
      const meta = this.getMeta();
      Object.keys(meta).forEach((key) => {
        localStorage.removeItem(this.CACHE_PREFIX + key);
      });
      localStorage.removeItem(this.CACHE_PREFIX + this.META_KEY);
    } catch {
      // Silent fail
    }
  }

  // Get cache statistics
  getStats() {
    const meta = this.getMeta();
    const totalSize = this.getTotalCacheSize();
    const itemCount = Object.keys(meta).length;
    const maxSizeBytes = this.config.maxSize * 1024 * 1024;

    return {
      itemCount,
      totalSize,
      maxSize: maxSizeBytes,
      usage: (totalSize / maxSizeBytes) * 100,
      items: meta,
    };
  }
}

// Cache TTL constants (in milliseconds)
export const CACHE_TTL = {
  VERY_SHORT: 5 * 60 * 1000, // 5 minutes - dynamic content
  SHORT: 15 * 60 * 1000, // 15 minutes - blog articles
  MEDIUM: 30 * 60 * 1000, // 30 minutes - categories, packages
  LONG: 60 * 60 * 1000, // 1 hour - global settings, FAQs
  VERY_LONG: 6 * 60 * 60 * 1000, // 6 hours - sponsors, static content
} as const;

// Cache keys
export const CACHE_KEYS = {
  GLOBAL_SETTINGS: "global_settings",
  CATEGORIES: "categories",
  FAQS: "faqs",
  SPONSORS: "sponsors",
  PACKAGES: "packages",
  BLOG_ARTICLES: "blog_articles",
  FEATURES: "features",
} as const;

// Create singleton instance
export const cacheManager = new SmartCacheManager({
  maxSize: 2, // 2MB limit
  defaultTTL: CACHE_TTL.MEDIUM,
});

// Utility function for fetch with cache
export const fetchWithCache = async (
  cacheKey: string,
  fetchFn: () => Promise<any>,
  ttl: number = CACHE_TTL.MEDIUM,
): Promise<any> => {
  // Try cache first
  const cached = cacheManager.get(cacheKey);
  if (cached) {
    return cached;
  }

  // Fetch fresh data
  try {
    const data = await fetchFn();
    cacheManager.set(cacheKey, data, ttl);
    return data;
  } catch (error) {
    // Return cached data even if expired in case of network error
    const staleData = cacheManager.get(`${cacheKey}_stale`);
    if (staleData) {
      console.warn("Using stale cache data due to fetch error");
      return staleData;
    }
    throw error;
  }
};

// Language-aware cache key generator
export const createLanguageAwareCacheKey = (baseKey: string): string => {
  const lang = document.documentElement.dir === "rtl" ? "fa" : "en";
  return `${baseKey}_${lang}`;
};

// Clear all language-specific cache
export const clearLanguageCache = () => {
  const stats = cacheManager.getStats();
  Object.keys(stats.items).forEach((key) => {
    if (key.includes("_fa") || key.includes("_en")) {
      cacheManager.remove(key);
    }
  });
};

// Clear cache for specific content type
export const clearContentTypeCache = (contentType: keyof typeof CACHE_KEYS) => {
  const stats = cacheManager.getStats();
  const baseKey = CACHE_KEYS[contentType];
  Object.keys(stats.items).forEach((key) => {
    if (key.includes(baseKey)) {
      cacheManager.remove(key);
    }
  });
};

// Version-based cache invalidation
const CACHE_VERSION = "1.0.0";
const VERSION_KEY = "cache_version";

export const checkCacheVersion = () => {
  if (typeof window === "undefined") return; // SSR-safe: no localStorage on the server
  const storedVersion = localStorage.getItem(VERSION_KEY);
  if (storedVersion !== CACHE_VERSION) {
    console.log("Cache version mismatch, clearing all cache");
    cacheManager.clear();
    localStorage.setItem(VERSION_KEY, CACHE_VERSION);
  }
};

// Initialize cache version check on import (client-side only)
checkCacheVersion();

// Development debug utility
export const logCacheStats = () => {
  if (process.env.NODE_ENV === "development") {
    const stats = cacheManager.getStats();
    console.group("📦 Cache Statistics");
    console.log("Total items:", stats.itemCount);
    console.log("Total size:", `${(stats.totalSize / 1024).toFixed(2)} KB`);
    console.log("Usage:", `${stats.usage.toFixed(1)}%`);
    console.log(
      "Items:",
      Object.entries(stats.items).map(([key, item]) => ({
        key,
        size: `${(item.size / 1024).toFixed(2)} KB`,
        age: `${Math.round((Date.now() - item.timestamp) / 1000)}s ago`,
      })),
    );
    console.groupEnd();
  }
};

// Auto-log cache stats in development
if (process.env.NODE_ENV === "development") {
  // Log cache stats every 30 seconds in development
  setInterval(logCacheStats, 30000);
}
