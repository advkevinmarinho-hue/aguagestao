import { createContext, useContext, useMemo, useState } from "react";

export type CartLine = { exitModeId: number; productId: number; quantity: number };
type SaleCartContextValue = {
  lines: CartLine[];
  setQuantity: (input: CartLine) => void;
  clear: () => void;
};

const SaleCartContext = createContext<SaleCartContextValue | undefined>(undefined);

export function SaleCartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const value = useMemo<SaleCartContextValue>(() => ({
    lines,
    setQuantity: (input) => setLines((current) => {
      const withoutLine = current.filter((line) => line.exitModeId !== input.exitModeId);
      return input.quantity > 0 ? [...withoutLine, input] : withoutLine;
    }),
    clear: () => setLines([]),
  }), [lines]);
  return <SaleCartContext.Provider value={value}>{children}</SaleCartContext.Provider>;
}

export function useSaleCart() {
  const context = useContext(SaleCartContext);
  if (!context) throw new Error("useSaleCart precisa estar dentro de SaleCartProvider");
  return context;
}
