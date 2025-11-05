import "../App.css";

const RecipeList = ({
  searchResults,
  setRecipeId,
  setCurrentView,
  doSearch,
}) => {
  return (
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
  );
};

export default RecipeList;
