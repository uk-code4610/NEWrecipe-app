import "../App.css";
import { useSearch } from "../Context/SearchContext";
import { useView } from "../Context/ViewContext";
import { useRecipeId } from "../Context/IdContext";
const RecipeList = () => {
  const { currentView, setCurrentView } = useView();
  const { searchResults, doSearch } = useSearch();
  const { setRecipeId } = useRecipeId();
  return (
    <>
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
            : doSearch && (
                <p className="no-results">レシピが見つかりませんでした</p>
              )}
        </div>
      )}
    </>
  );
};

export default RecipeList;
