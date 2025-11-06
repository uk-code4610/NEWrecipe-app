import { createContext, useContext, useState } from "react";

const ShoppingContext = createContext();
const useShopping = () => useContext(ShoppingContext);
const ShoppingProvider = ({ children }) => {
  const [shoppingList, setShoppingList] = useState([]);

  return (
    <ShoppingContext.Provider value={{ shoppingList, setShoppingList }}>
      {children}
    </ShoppingContext.Provider>
  );
};
export { useShopping, ShoppingProvider };
