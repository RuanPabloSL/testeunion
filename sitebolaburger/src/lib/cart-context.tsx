import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { MenuItem } from "./menu-data";

export interface CartLine extends MenuItem {
  qty: number;
}

interface CartCtx {
  items: CartLine[];
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (i: MenuItem) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
}

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);

  const add = useCallback((i: MenuItem) => {
    setItems((p) => {
      const found = p.find((x) => x.id === i.id);
      if (found) return p.map((x) => (x.id === i.id ? { ...x, qty: x.qty + 1 } : x));
      return [...p, { ...i, qty: 1 }];
    });
    setOpen(true);
  }, []);

  const remove = useCallback((id: string) => setItems((p) => p.filter((x) => x.id !== id)), []);
  const setQty = useCallback((id: string, qty: number) => {
    setItems((p) =>
      qty <= 0 ? p.filter((x) => x.id !== id) : p.map((x) => (x.id === id ? { ...x, qty } : x)),
    );
  }, []);
  const clear = useCallback(() => setItems([]), []);

  const total = items.reduce((s, x) => s + x.price * x.qty, 0);
  const count = items.reduce((s, x) => s + x.qty, 0);

  return (
    <Ctx.Provider value={{ items, open, setOpen, add, remove, setQty, clear, total, count }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
}
