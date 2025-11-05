import "../App.css";

const SearchIngredientForm = ({
  ingredient,
  changeIngredients,
  searchIngredients,
  changeSearch,
  searchTypeValue,
  searchType,
}) => {
  return (
    <div className="search-form">
      <input
        type="text"
        placeholder="材料を検索"
        value={ingredient}
        onChange={changeIngredients}
      />
      <button onClick={searchIngredients}>
        <i className="fas fa-search"></i>
      </button>
      <select value={searchTypeValue} onChange={changeSearch}>
        {searchType.map((search) => (
          <option key={search} value={search}>
            {search}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchIngredientForm;
