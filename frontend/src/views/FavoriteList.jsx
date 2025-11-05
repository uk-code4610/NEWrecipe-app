import "../App.css";
const FavoriteList = ({ favoriteRecipe, setRecipeId, setCurrentView }) => {
  return (
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
  );
};
export default FavoriteList;
