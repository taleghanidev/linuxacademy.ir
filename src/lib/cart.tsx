"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type CartItemType = "booking" | "sponsorship";

export type CartItem = {
  id: string; // unique line id
  type: CartItemType;
  itemKey: string; // packageKey or tierKey
  label: string;
  unitPrice: number; // Toman
  quantity: number; // hours (booking) or count (sponsorship)
  minQuantity?: number;
  maxQuantity?: number;
  meta?: Record<string, unknown>;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
};

const STORAGE_KEY = "linuxacademy_cart_v1";

const CartContext = createContext<CartContextValue | null>(null);

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load once on mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  // Persist on change (after hydration, so we don't clobber storage with []).
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore quota errors
    }
  }, [items, hydrated]);

  const addItem = useCallback((item: Omit<CartItem, "id">) => {
    setItems((prev) => {
      // Bookings collapse by package; sponsorships collapse by tier — bump quantity.
      const idx = prev.findIndex((p) => p.type === item.type && p.itemKey === item.itemKey);
      if (idx !== -1) {
        const next = [...prev];
        const merged = next[idx];
        const max = merged.maxQuantity ?? Number.MAX_SAFE_INTEGER;
        next[idx] = { ...merged, quantity: Math.min(max, merged.quantity + item.quantity) };
        return next;
      }
      return [...prev, { ...item, id: newId() }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const min = p.minQuantity ?? 1;
        const max = p.maxQuantity ?? Number.MAX_SAFE_INTEGER;
        return { ...p, quantity: Math.max(min, Math.min(max, quantity)) };
      }),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((n, i) => n + i.quantity, 0);
    const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    return { items, count, subtotal, addItem, removeItem, updateQuantity, clear };
  }, [items, addItem, removeItem, updateQuantity, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
