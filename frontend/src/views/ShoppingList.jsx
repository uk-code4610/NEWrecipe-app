import "../App.css";
import { useState, useEffect } from "react";
import { useView } from "../Context/ViewContext";
import { useShopping } from "../Context/ShoppingListContext";
const ShoppingList = () => {
  const { currentView } = useView();
  const { shoppingList, setShoppingList } = useShopping();
  const [checkItems, setCheckItem] = useState([]);

  useEffect(() => {
    const localShopping = localStorage.getItem("shopping");
    if (localShopping) {
      setShoppingList(JSON.parse(localShopping));
    }
  }, []);

  const checkItem = (shoppingItem) => {
    if (checkItems.includes(shoppingItem)) {
      const deleteItem = checkItems.filter((Item) => Item !== shoppingItem);
      setCheckItem(deleteItem);
    } else {
      setCheckItem([...checkItems, shoppingItem]);
    }
  };
  const clearShoppingList = () => {
    setShoppingList([]);
  };
  return (
    <>
      {currentView === "shoppingList" && (
        <div className="shopping-list-container">
          <div className="shopping-header">
            <h2>買い物リスト</h2>
            <button onClick={clearShoppingList}>クリア</button>
          </div>
          <ul>
            {shoppingList.map((shoppingItem, index) => (
              <li
                key={index}
                onClick={() => {
                  checkItem(shoppingItem);
                }}
                className={checkItems.includes(shoppingItem) ? "checked" : ""}
              >
                {shoppingItem}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};
export default ShoppingList;
