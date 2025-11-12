import "../../App.css";
import { useState } from "react";
import { useSearch } from "../../Context/SearchContext";
import { useView } from "../../Context/ViewContext";
const searchType = ["AND検索", "OR検索"];
const SearchIngredientForm = () => {
  const { setSearchResults, setDosearch } = useSearch();
  const { setCurrentView } = useView();
  const [ingredient, setIngredient] = useState("");
  const [searchTypeValue, setSerchTypeValue] = useState("AND検索");
  const changeIngredients = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setIngredient(e.target.value);
  };
  const changeSearch = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSerchTypeValue(e.target.value);
  };
  const searchIngredients = () => {
    setDosearch(true);
    const searchTypeForApi = searchTypeValue === "AND検索" ? "and" : "or";
    fetch("http://127.0.0.1:5001/api/search_by_ingredients", {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: ingredient,
        search_type: searchTypeForApi,
      }),
    })
      .then((response) => {
        if (!response.ok)
          throw new Error(`Server responded ${response.status}`);
        return response.json();
      })
      .then((data) => {
        setSearchResults(data.data || []);
        setCurrentView("list");
      })
      .catch((err) => {
        console.error("fetch error:", err);
        setSearchResults([]);
      });
  };
  return (
    <div className="search-form">
      <input
        type="text"
        placeholder="材料を検索"
        value={ingredient}
        onChange={changeIngredients}
      />
      <button onClick={searchIngredients}>
        <i className="fas fa-search"></i>
      </button>
      <select value={searchTypeValue} onChange={changeSearch}>
        {searchType.map((search) => (
          <option key={search} value={search}>
            {search}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchIngredientForm;
