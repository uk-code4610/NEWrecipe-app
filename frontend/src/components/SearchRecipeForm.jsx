import "../App.css";
const SearchRecipeForm = ({ recipe, changeRecipe, searchRecipes }) => {
  return (
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
  );
};

export default SearchRecipeForm;
