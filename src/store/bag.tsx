import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export type BagItem = {
  key: string;
  id: string;
  name: string;
  temp: string;
  price: number;
  qty: number;
  tint: [string, string];
};

export type NewBagItem = Omit<BagItem, 'key' | 'qty' | 'temp'> & { temp?: string };

export const DEFAULT_TEMP = '2700K Warm Sunset';
export const DELIVERY = { dhaka: 60, outside: 120 } as const;

const PROMOS: Record<string, number> = { ORANGE15: 0.15 };

type BagCtx = {
  items: BagItem[];
  count: number;
  types: number;
  subtotal: number;
  discount: number;
  promo: string | null;
  add: (item: NewBagItem, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  applyPromo: (code: string) => boolean;
};

const Ctx = createContext<BagCtx>({
  items: [],
  count: 0,
  types: 0,
  subtotal: 0,
  discount: 0,
  promo: null,
  add: () => {},
  setQty: () => {},
  remove: () => {},
  clear: () => {},
  applyPromo: () => false,
});

export function BagProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BagItem[]>([]);
  const [promo, setPromo] = useState<string | null>(null);

  const add = useCallback((item: NewBagItem, qty = 1) => {
    const temp = item.temp ?? DEFAULT_TEMP;
    const key = `${item.id}|${temp}`;
    setItems((prev) => {
      const found = prev.find((i) => i.key === key);
      if (found) return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i));
      return [...prev, { ...item, temp, key, qty }];
    });
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setItems((prev) => (qty < 1 ? prev.filter((i) => i.key !== key) : prev.map((i) => (i.key === key ? { ...i, qty } : i))));
  }, []);

  const remove = useCallback((key: string) => setItems((prev) => prev.filter((i) => i.key !== key)), []);

  const clear = useCallback(() => {
    setItems([]);
    setPromo(null);
  }, []);

  const applyPromo = useCallback((code: string) => {
    const c = code.trim().toUpperCase();
    if (PROMOS[c]) {
      setPromo(c);
      return true;
    }
    return false;
  }, []);

  const value = useMemo(() => {
    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const discount = promo ? Math.round(subtotal * PROMOS[promo]) : 0;
    return {
      items,
      count: items.reduce((sum, i) => sum + i.qty, 0),
      types: items.length,
      subtotal,
      discount,
      promo,
      add,
      setQty,
      remove,
      clear,
      applyPromo,
    };
  }, [items, promo, add, setQty, remove, clear, applyPromo]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useBag = () => useContext(Ctx);
