import { useState } from "react";
import "./App.css";
const reorders = ["並び替え:デフォルト", "並び替え:調理期間の短い順"];
const searchType = ["AND検索", "OR検索"];
const App = () => {
  const [recipe, setRecipe] = useState("");
  const [ingredient, setIngredient] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchTypeValue, setSerchTypeValue] = useState("AND検索");
  const changeRecipe = (e) => {
    setRecipe(e.target.value);
  };
  const changeIngredients = (e) => {
    setIngredient(e.target.value);
  };
  const changeSerch = (e) => {
    setSerchTypeValue(e.target.value);
  };
  const searchRecipes = () => {
    fetch("http://127.0.0.1:5000/api/search", {
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
      })
      .catch((err) => {
        console.error("fetch error:", err);
        setSearchResults([]);
      });
  };

  const serchIngredients = () => {
    const searchTypeForApi = searchTypeValue === "AND検索" ? "and" : "or";
    fetch("http://127.0.0.1:5000/api/search_by_ingredients", {
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
      })
      .catch((err) => {
        console.error("fetch error:", err);
        setSearchResults([]);
      });
  };
  return (
    <>
      <header className="site-header">
        <h1 className="brand">
          <img src="/afro_logo.svg" alt="AfroLogo" className="afro-logo" />
          <span className="brand-text">
            Afro
            <br />
            Kitchen
          </span>
        </h1>
      </header>

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
      <div className="search-form">
        <input
          type="text"
          placeholder="材料を検索"
          value={ingredient}
          onChange={changeIngredients}
        />
        <button onClick={serchIngredients}>
          <i className="fas fa-search"></i>
        </button>
        <select value={searchTypeValue} onChange={changeSerch}>
          {searchType.map((search) => (
            <option key={search} value={search}>
              {search}
            </option>
          ))}
        </select>
      </div>
      <button>新規レシピ作成</button>
      <hr />

      <select>
        {reorders.map((reorder) => (
          <option key={reorder} value={reorder}>
            {reorder}
          </option>
        ))}
      </select>
      <div className="recipe-list">
        {searchResults.length > 0
          ? searchResults.map((result) => (
              <div className="recipe-item" key={result.id} value={result.title}>
                <h3>{result.title}</h3>
                <img src={result.image_url} alt={result.title} />
                <p>{result.description}</p>
                <p>調理時間目安:{result.time_min}</p>
              </div>
            ))
          : "レシピが見つかりませんでした"}
      </div>
    </>
  );
};

export default App;
