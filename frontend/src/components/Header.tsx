import "../App.css";
import { useView } from "../Context/ViewContext";
const Header = () => {
  const { setCurrentView } = useView();
  return (
    <>
      <header className="site-header">
        <button
          className="new-recipe-button"
          onClick={() => setCurrentView("new")}
        >
          新規レシピ作成
        </button>

        <h1 className="brand">
          <img src="/afro_logo.svg" alt="AfroLogo" className="afro-logo" />
          <span className="brand-text">
            Afro
            <br />
            Kitchen
          </span>
        </h1>

        <div className="header-buttons">
          <button
            className="favorite-button"
            onClick={() => setCurrentView("favoriteList")}
          >
            ★
          </button>
          <button
            className="shopping-cart-button"
            onClick={() => setCurrentView("shoppingList")}
          >
            <i className="fas fa-shopping-cart"></i>
          </button>
        </div>
      </header>
    </>
  );
};

export default Header;
