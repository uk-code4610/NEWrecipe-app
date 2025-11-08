import "../App.css";
import { useState } from "react";
import { useSearch } from "../Context/SearchContext";
import { useView } from "../Context/ViewContext";
const SearchRecipeForm = () => {
  const { setSearchResults, setDosearch } = useSearch();
  const { setCurrentView } = useView();
  const [recipe, setRecipe] = useState("");
  const changeRecipe = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setRecipe(e.target.value);
  };
  const searchRecipes = () => {
    setDosearch(true);
    fetch("http://127.0.0.1:5001/api/search", {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: recipe }),
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
        placeholder="レシピを検索"
        value={recipe}
        onChange={changeRecipe}
      />
      <button onClick={searchRecipes}>
        <i className="fas fa-search"></i>
      </button>
    </div>
  );
};

export default SearchRecipeForm;
