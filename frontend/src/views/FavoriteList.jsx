import "../App.css";
import { useEffect } from "react";
import { useView } from "../Context/ViewContext";
import { useFavorite } from "../Context/FavoriteContext";
import { useRecipeId } from "../Context/IdContext";
const FavoriteList = () => {
  const { currentView, setCurrentView } = useView();
  const { setFavorite, favoriteRecipe, setFavoriteRecipe } = useFavorite();
  const { setRecipeId } = useRecipeId();
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
          {favoriteRecipe.length === 0
            ? "お気に入りが登録されていません"
            : favoriteRecipe.map((favorite) => (
                <div
                  className="recipe-item"
                  key={favorite.id}
                  onClick={() => {
                    setRecipeId(favorite.id);
                    setCurrentView("detail");
                  }}
                >
                  <h3>{favorite.title}</h3>
                  <img src={favorite.image_url} alt={favorite.title} />
                  <p>{favorite.description}</p>
                  <p>調理時間目安:{favorite.time_min}分</p>
                </div>
              ))}
        </div>
      )}
    </>
  );
};
export default FavoriteList;
