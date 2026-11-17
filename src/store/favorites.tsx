import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

type FavCtx = {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  remove: (id: string) => void;
};

const Ctx = createContext<FavCtx>({ ids: [], has: () => false, toggle: () => {}, remove: () => {} });

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);

  const toggle = useCallback((id: string) => {
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev]));
  }, []);
  const remove = useCallback((id: string) => setIds((prev) => prev.filter((x) => x !== id)), []);

  const value = useMemo(() => ({ ids, has: (id: string) => ids.includes(id), toggle, remove }), [ids, toggle, remove]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useFavorites = () => useContext(Ctx);
