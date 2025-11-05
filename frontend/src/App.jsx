import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import SearchRecipeForm from "./components/SearchRecipeForm";
import SearchIngredientForm from "./components/SearchIngredientForm";
import RecipeList from "./views/RecipeList";
import RecipeDetail from "./views/RecipeDetail";
import FavoriteList from "./views/FavoriteList";
import ShoppingList from "./views/ShoppingList";
import NewRecipeForm from "./views/NewRecipeForm";
const searchType = ["AND検索", "OR検索"];
const reorders = ["並び替え:デフォルト", "並び替え:調理期間の短い順"];
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
  const [doSearch, setDosearch] = useState(false);
  const [doReorder, setDoReorder] = useState("並び替え:デフォルト");
  const [recipeId, setRecipeId] = useState("");
  const [detailRecipe, setDetailRecipe] = useState("");
  const [currentView, setCurrentView] = useState("list");
  const [newRecipe, setNewRecipe] = useState(recipeFormat);
  const [favorite, setFavorite] = useState([]);
  const [favoriteRecipe, setFavoriteRecipe] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [checkItems, setCheckItem] = useState([]);
  const [searchTypeValue, setSerchTypeValue] = useState("AND検索");
  useEffect(() => {
    if (currentView !== "favoriteList") return;
    Promise.all(
      favorite.map(async (id) => {
        const response = await fetch(`http://127.0.0.1:5000/api/recipes/${id}`);
        const data = await response.json();
        return data.data;
      })
    ).then((recipes) => {
      setFavoriteRecipe(recipes);
    });
  }, [currentView]);

  const changeRecipe = (e) => {
    setRecipe(e.target.value);
  };
  const changeIngredients = (e) => {
    setIngredient(e.target.value);
  };
  const changeSearch = (e) => {
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
        setCurrentView("list");
      })
      .catch((err) => {
        console.error("fetch error:", err);
        setSearchResults([]);
      });
  };

  const searchIngredients = () => {
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
        setCurrentView("list");
      })
      .catch((err) => {
        console.error("fetch error:", err);
        setSearchResults([]);
      });
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
  useEffect(() => {
    const localFavorites = localStorage.getItem("favorites");
    if (localFavorites) {
      setFavorite(JSON.parse(localFavorites));
    }
  }, []);
  useEffect(() => {
    const localShopping = localStorage.getItem("shopping");
    if (localShopping) {
      setShoppingList(JSON.parse(localShopping));
    }
  }, []);

  const addFavorites = (id) => {
    if (!favorite.includes(id)) {
      const newList = [...favorite, id];
      setFavorite(newList);
      localStorage.setItem("favorites", JSON.stringify(newList));
    }
  };

  const deleteFavorites = (id) => {
    const deleteId = favorite.filter((ID) => ID !== id);
    setFavorite(deleteId);
    localStorage.setItem("favorites", JSON.stringify(deleteId));
  };
  const addList = (ListIngredients) => {
    const getList = localStorage.getItem("shopping");
    const newList = [...JSON.parse(getList), ...ListIngredients];
    setShoppingList(newList);
    localStorage.setItem("shopping", JSON.stringify(newList));
  };
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
      <Header setCurrentView={setCurrentView} />
      <SearchRecipeForm
        recipe={recipe}
        changeRecipe={changeRecipe}
        searchRecipes={searchRecipes}
        doSearch={doSearch}
      />

      <SearchIngredientForm
        ingredient={ingredient}
        changeIngredients={changeIngredients}
        searchIngredients={searchIngredients}
        changeSearch={changeSearch}
        searchType={searchType}
        searchTypeValue={searchTypeValue}
      />

      <hr />

      <select value={doReorder} onChange={changeOrder}>
        {reorders.map((reorder) => (
          <option key={reorder} value={reorder}>
            {reorder}
          </option>
        ))}
      </select>
      {currentView === "shoppingList" && (
        <ShoppingList
          shoppingList={shoppingList}
          checkItems={checkItem}
          clearShoppingList={clearShoppingList}
          checkItem={checkItem}
        />
      )}
      {currentView === "favoriteList" && (
        <FavoriteList
          favoriteRecipe={favoriteRecipe}
          setRecipeId={setRecipeId}
          setCurrentView={setCurrentView}
        />
      )}
      {currentView === "detail" && (
        <RecipeDetail
          detailRecipe={detailRecipe}
          favorite={favorite}
          deleteFavorites={deleteFavorites}
          addFavorites={addFavorites}
          addList={addList}
          setCurrentView={setCurrentView}
        />
      )}
      {currentView === "list" && (
        <RecipeList
          searchResults={searchResults}
          setRecipeId={setRecipeId}
          setCurrentView={setCurrentView}
        />
      )}
      {currentView === "new" && (
        <NewRecipeForm
          newRecipe={newRecipe}
          setNewRecipe={setNewRecipe}
          addNewRecipe={addNewRecipe}
        />
      )}
    </>
  );
};

export default App;
