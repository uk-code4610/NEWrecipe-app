import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
type UseShoppingType = {
  shoppingList: string[];
  setShoppingList: (shoppingList: string[]) => void;
};
type ShoppingProviderProps = {
  children: ReactNode;
};

const ShoppingContext = createContext<UseShoppingType | undefined>(undefined);
const useShopping = () => {
  const context = useContext(ShoppingContext);
  if (context === undefined) {
    throw new Error("useShopping must be used within ShoppingProvider");
  }
  return context;
};
const ShoppingProvider = ({ children }: ShoppingProviderProps) => {
  const [shoppingList, setShoppingList] = useState<string[]>([]);

  return (
    <ShoppingContext.Provider value={{ shoppingList, setShoppingList }}>
      {children}
    </ShoppingContext.Provider>
  );
};
export { useShopping, ShoppingProvider };
