import "./App.css";
const reorders = ["並び替え:デフォルト", "並び替え:調理期間の短い順"];
const searchType = ["AND検索", "OR検索"];
const App = () => {
  return (
    <div>
      <header className="site-header">
        <h1 className="brand">
          <img src="/afro_logo.svg" alt="AfroLogo" className="afro-logo" />
          <span className="brand-text">
            Afro
            <br />
            Kitchen
          </span>
        </h1>
      </header>

      <div className="search-form">
        <input type="text" placeholder="レシピを検索" />
        <button>
          <i className="fas fa-search"></i>
        </button>
      </div>
      <div className="search-form">
        <input type="text" placeholder="材料を検索" />
        <button>
          <i className="fas fa-search"></i>
        </button>
        <select>
          {searchType.map((search) => (
            <option key={search} value={search}>
              {search}
            </option>
          ))}
        </select>
      </div>
      <button>新規レシピ作成</button>
      <hr />

      <select>
        {reorders.map((reorder) => (
          <option key={reorder} value={reorder}>
            {reorder}
          </option>
        ))}
      </select>
      <div className="recipe-list" id="search-results-container"></div>
    </div>
  );
};

export default App;
