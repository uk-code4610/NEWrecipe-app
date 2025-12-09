import "../App.css";
import { useEffect } from "react";
import { useView } from "../Context/ViewContext";
import { useFavorite } from "../Context/FavoriteContext";
import { useRecipeId } from "../Context/IdContext";
const FavoriteList = () => {
  const { currentView, setCurrentView } = useView();
  const { favorite, setFavorite, favoriteRecipe, setFavoriteRecipe } =
    useFavorite();
  const { setRecipeId } = useRecipeId();
  useEffect(() => {
    if (currentView !== "favoriteList") return;
    Promise.all(
      (Array.isArray(favorite) ? favorite : []).map(async (id) => {
        if (id == null) return null;
        try {
          const response = await fetch(
            `https://new-afro-kitchen.onrender.com/api/recipes/${id}`
          );
          if (!response.ok) return null;
          const data = await response.json();
          return data?.data ?? null;
        } catch (err) {
          console.warn("Failed to fetch favorite recipe", id, err);
          return null;
        }
      })
    ).then((recipes) => {
      // filter out any null/undefined entries from failed fetches
      setFavoriteRecipe((recipes || []).filter(Boolean));
    });
  }, [currentView]);
  useEffect(() => {
    const localFavorites = localStorage.getItem("favorites");
    if (localFavorites) {
      setFavorite(JSON.parse(localFavorites));
    }
  }, []);
  return (
    <>
      {currentView === "favoriteList" && (
        <div className="recipe-list">
          {(!Array.isArray(favoriteRecipe) || favoriteRecipe.length === 0) && (
            <p className="no-results">お気に入りが登録されていません</p>
          )}
          {Array.isArray(favoriteRecipe) &&
            favoriteRecipe.length > 0 &&
            favoriteRecipe
              .filter((r) => r && typeof r.title === "string")
              .map((fav, idx) => (
                <div
                  className="recipe-item"
                  key={fav.id ?? idx}
                  onClick={() => {
                    setRecipeId(fav.id);
                    setCurrentView("detail");
                  }}
                >
                  <h3>{fav.title}</h3>
                  {fav.image_url && <img src={fav.image_url} alt={fav.title} />}
                  <p>{fav.description}</p>
                  <p>調理時間目安:{fav.time_min}分</p>
                </div>
              ))}
        </div>
      )}
    </>
  );
};
export default FavoriteList;
