import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type CartItem = {
  id: string;
  title: string;
  price_bdt: number;
  image_url: string | null;
  product_type: string;
  category: string;
  billing_interval?: string | null;
  qty: number;
};

type CartCtx = {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">) => void;
  remove: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "bazaarbd_cart_v1";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const add: CartCtx["add"] = (item) => {
    setItems((prev) => {
      const found = prev.find((i) => i.id === item.id);
      if (found) return prev.map((i) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
  };
  const remove = (id: string) => setItems((p) => p.filter((i) => i.id !== id));
  const updateQty = (id: string, qty: number) => setItems((p) => p.map((i) => i.id === id ? { ...i, qty: Math.max(1, qty) } : i));
  const clear = () => setItems([]);
  const total = items.reduce((s, i) => s + Number(i.price_bdt) * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  return <Ctx.Provider value={{ items, add, remove, updateQty, clear, total, count }}>{children}</Ctx.Provider>;
};

export const useCart = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be inside CartProvider");
  return c;
};
