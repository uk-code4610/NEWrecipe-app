import "../App.css";
const RecipeDetail = ({
  detailRecipe,
  favorite,
  deleteFavorites,
  addFavorites,
  addList,
  setCurrentView,
}) => {
  return (
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
  );
};

export default RecipeDetail;
