import { useState } from "react";
import { useSearch } from "../Context/SearchContext";
const reorders = ["並び替え:デフォルト", "並び替え:調理期間の短い順"];
const Order = () => {
  const [doReorder, setDoReorder] = useState("並び替え:デフォルト");

  const changeOrder = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const { searchResults, setSearchResults } = useSearch();
    if (e.target.value === "並び替え:調理期間の短い順") {
      const sorted = [...searchResults].sort((a, b) => a.time_min - b.time_min);
      setSearchResults(sorted);
    }
  };
  return (
    <select value={doReorder} onChange={changeOrder}>
      {reorders.map((reorder) => (
        <option key={reorder} value={reorder}>
          {reorder}
        </option>
      ))}
    </select>
  );
};
export default Order;
