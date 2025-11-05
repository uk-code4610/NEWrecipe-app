import "../App.css";
const ShoppingList = ({
  shoppingList,
  checkItems,
  checkItem,
  clearShoppingList,
}) => {
  return (
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
  );
};
export default ShoppingList;
