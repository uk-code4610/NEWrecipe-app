import { useEffect, useState } from "react";
import "./App.css";
const reorders = ["並び替え:デフォルト", "並び替え:調理期間の短い順"];
const searchType = ["AND検索", "OR検索"];
const recipeFormat = {
  title: "",
  description: "",
  image_url: "",
  ingredients: "",
  steps: "",
  time_min: "",
};
const App = () => {
  const [recipe, setRecipe] = useState("");
  const [ingredient, setIngredient] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchTypeValue, setSerchTypeValue] = useState("AND検索");
  const [doSearch, setDosearch] = useState(false);
  const [doReorder, setDoReorder] = useState("並び替え:デフォルト");
  const [recipeId, setRecipeId] = useState("");
  const [detailRecipe, setDetailRecipe] = useState("");
  const [currentView, setCurrentView] = useState("list");
  const [newRecipe, setNewRecipe] = useState(recipeFormat);
  const changeRecipe = (e) => {
    setRecipe(e.target.value);
  };
  const changeIngredients = (e) => {
    setIngredient(e.target.value);
  };
  const changeSerch = (e) => {
    setSerchTypeValue(e.target.value);
  };
  const changeOrder = (e) => {
    if (e.target.value === "並び替え:調理期間の短い順") {
      const sorted = [...searchResults].sort((a, b) => a.time_min - b.time_min);
      setSearchResults(sorted);
    }
  };
  useEffect(() => {
    if (!recipeId) return;
    fetch(`http://127.0.0.1:5000/api/recipes/${recipeId}`, {
      method: "GET",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (!response.ok)
          throw new Error(`Server responded ${response.status}`);
        return response.json();
      })
      .then((data) => {
        console.log("詳細データ:", data);
        setDetailRecipe(data.data);
      })
      .catch((err) => {
        console.error("fetch error:", err);
        setDetailRecipe(null);
      });
  }, [recipeId]);
  const searchRecipes = () => {
    setDosearch(true);
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
    setDosearch(true);
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
  const newTitle = (e) => {
    setNewRecipe({ ...newRecipe, title: e.target.value });
  };
  const newDescription = (e) => {
    setNewRecipe({ ...newRecipe, description: e.target.value });
  };
  const newImage = (e) => {
    setNewRecipe({ ...newRecipe, image_url: e.target.value });
  };
  const newTime = (e) => {
    setNewRecipe({ ...newRecipe, time_min: e.target.value });
  };
  const newIngredients = (e) => {
    const ingredientsArray = e.target.value.split("\n");
    setNewRecipe({ ...newRecipe, ingredients: ingredientsArray });
  };
  const newStep = (e) => {
    const stepArray = e.target.value.split("\n");
    setNewRecipe({ ...newRecipe, steps: stepArray });
  };

  const addNewRecipe = () => {
    if (
      !newRecipe.title ||
      !newRecipe.description ||
      !newRecipe.time_min ||
      !newRecipe.ingredients ||
      !newRecipe.steps
    ) {
      alert("空欄があります");
    } else {
      fetch("http://127.0.0.1:5000/admin/recipes", {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRecipe),
      })
        .then((response) => response.json())
        .then((data) => {
          setCurrentView("list");
          setNewRecipe(recipeFormat);
        });
    }
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
      <button onClick={() => setCurrentView("new")}>新規レシピ作成</button>
      <hr />

      <select value={doReorder} onChange={changeOrder}>
        {reorders.map((reorder) => (
          <option key={reorder} value={reorder}>
            {reorder}
          </option>
        ))}
      </select>
      {currentView === "detail" && (
        <div className="recipe-detail">
          <div className="left">
            <h3>{detailRecipe.title}</h3>
            <img src={detailRecipe.image_url} alt={detailRecipe.title} />
            <p>{detailRecipe.description}</p>
            <p className="time">調理時間目安: {detailRecipe.time_min}分</p>
          </div>
          <div className="right">
            <h2>材料:</h2>
            <ul>
              {detailRecipe.ingredients &&
                detailRecipe.ingredients.map((ing, index) => (
                  <li key={index}>{ing}</li>
                ))}
            </ul>
            <h2>作り方:</h2>
            <ol>
              {detailRecipe.steps &&
                detailRecipe.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
            </ol>
            <button onClick={() => setCurrentView("list")}>閉じる</button>
          </div>
        </div>
      )}
      {currentView === "list" && (
        <div className="recipe-list">
          {searchResults.length > 0
            ? searchResults.map((result) => (
                <div
                  className="recipe-item"
                  key={result.id}
                  onClick={() => {
                    setRecipeId(result.id);
                    setCurrentView("detail");
                  }}
                >
                  <h3>{result.title}</h3>
                  <img src={result.image_url} alt={result.title} />
                  <p>{result.description}</p>
                  <p>調理時間目安:{result.time_min}分</p>
                </div>
              ))
            : doSearch && "レシピが見つかりませんでした"}
        </div>
      )}
      {currentView === "new" && (
        <div className="new-recipe-form">
          <h3>
            タイトル:{" "}
            <input type="text" value={newRecipe.title} onChange={newTitle} />
          </h3>
          <h3>
            説明:{" "}
            <textarea value={newRecipe.description} onChange={newDescription} />
          </h3>
          <h3>
            画像URL:{" "}
            <input type="url" value={newRecipe.image_url} onChange={newImage} />
          </h3>
          <h3>
            調理時間(分):
            <input
              type="number"
              value={newRecipe.time_min}
              onChange={newTime}
            />
          </h3>
          <h3>
            材料 (1行ごとに入力):
            <textarea
              value={
                Array.isArray(newRecipe.ingredients)
                  ? newRecipe.ingredients.join("\n")
                  : newRecipe.ingredients
              }
              onChange={newIngredients}
            />
          </h3>
          <h3>
            作り方 (1行ごとに入力):
            <textarea
              value={
                Array.isArray(newRecipe.steps)
                  ? newRecipe.steps.join("\n")
                  : newRecipe.steps
              }
              onChange={newStep}
            />
          </h3>
          <button onClick={addNewRecipe}>レシピを追加</button>
        </div>
      )}
    </>
  );
};

export default App;
