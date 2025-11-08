import "../App.css";
import { useEffect, useState } from "react";
import { useView } from "../Context/ViewContext";
import { useFavorite } from "../Context/FavoriteContext";
import { useShopping } from "../Context/ShoppingListContext";
import { useRecipeId } from "../Context/IdContext";
type Recipe = {
  id: number;
  title: string;
  description: string;
  image_url: string;
  ingredients: string[];
  steps: string[];
  time_min: number;
};

const RecipeDetail = () => {
  const { currentView, setCurrentView } = useView();
  const { favorite, setFavorite, setFavoriteRecipe } = useFavorite();
  const { setShoppingList } = useShopping();
  const { recipeId } = useRecipeId();
  const [detailRecipe, setDetailRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    if (!recipeId) return;
    fetch(`http://127.0.0.1:5001/api/recipes/${recipeId}`, {
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
  useEffect(() => {
    if (currentView !== "favoriteList") return;
    Promise.all(
      favorite.map(async (id) => {
        const response = await fetch(`http://127.0.0.1:5001/api/recipes/${id}`);
        const data = await response.json();
        return data.data;
      })
    ).then((recipes) => {
      setFavoriteRecipe(recipes);
    });
  }, [currentView]);

  const addFavorites = (id: number) => {
    if (!favorite.includes(id)) {
      const newList = [...favorite, id];
      setFavorite(newList);
      localStorage.setItem("favorites", JSON.stringify(newList));
    }
  };

  const deleteFavorites = (id: number) => {
    const deleteId = favorite.filter((ID) => ID !== id);
    setFavorite(deleteId);
    localStorage.setItem("favorites", JSON.stringify(deleteId));
  };

  const addList = (ListIngredients: string[]) => {
    const getList = localStorage.getItem("shopping");
    const newList = getList ? [...JSON.parse(getList), ...ListIngredients] : [];
    setShoppingList(newList);
    localStorage.setItem("shopping", JSON.stringify(newList));
  };
  return (
    <>
      {currentView === "detail" && detailRecipe && (
        <div className="recipe-detail">
          <div className="left">
            <div className="detail-header">
              <h3>{detailRecipe.title}</h3>

              <span
                className="favorite-icon"
                onClick={() => {
                  if (favorite.includes(detailRecipe.id)) {
                    deleteFavorites(detailRecipe.id);
                  } else {
                    addFavorites(detailRecipe.id);
                  }
                }}
              >
                {favorite.includes(detailRecipe.id) ? "★" : "☆"}
              </span>
            </div>
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
            <button onClick={() => addList(detailRecipe.ingredients)}>
              買い物リストに登録
            </button>
            <button onClick={() => setCurrentView("list")}>閉じる</button>
          </div>
        </div>
      )}
    </>
  );
};

export default RecipeDetail;
