import "./App.css";
import Header from "./components/Header";
import SearchRecipeForm from "./components/SearchRecipeForm";
import SearchIngredientForm from "./components/SearchIngredientForm";
import RecipeList from "./views/RecipeList";
import RecipeDetail from "./views/RecipeDetail";
import FavoriteList from "./views/FavoriteList";
import ShoppingList from "./views/ShoppingList";
import NewRecipeForm from "./views/NewRecipeForm";
import Order from "./views/Order";
import { ViewProvider } from "./Context/ViewContext";
import { SearchProvider } from "./Context/SearchContext";
import { RecipeIdProvider } from "./Context/IdContext";
import { FavoriteProvider } from "./Context/FavoriteContext";
import { ShoppingProvider } from "./Context/ShoppingListContext";
const App = () => {
  return (
    <>
      <ViewProvider>
        <SearchProvider>
          <Header />
          <SearchRecipeForm />

          <SearchIngredientForm />
          <hr />
          <Order />
          <RecipeIdProvider>
            <FavoriteProvider>
              <ShoppingProvider>
                <RecipeList />
                <RecipeDetail />
                <FavoriteList />
                <ShoppingList />
              </ShoppingProvider>
            </FavoriteProvider>
          </RecipeIdProvider>
        </SearchProvider>

        <NewRecipeForm />
      </ViewProvider>
    </>
  );
};

export default App;
