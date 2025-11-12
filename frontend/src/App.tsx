import "./App.css";
import Header from "./assets/components/Header";
import SearchRecipeForm from "./assets/components/SearchRecipeForm";
import SearchIngredientForm from "./assets/components/SearchIngredientForm";
import RecipeList from "./views/RecipeList";
import RecipeDetail from "./views/RecipeDetail";
import FavoriteList from "./views/FavoriteList";
import ShoppingList from "./views/ShoppingList";
import NewRecipeForm from "./views/NewRecipeForm";
import RegisterForm from "./views/RegisteForm";
import LoginForm from "./views/LoginForm";
import Order from "./views/Order";
import { ViewProvider } from "./Context/ViewContext";
import { SearchProvider } from "./Context/SearchContext";
import { RecipeIdProvider } from "./Context/IdContext";
import { FavoriteProvider } from "./Context/FavoriteContext";
import { ShoppingProvider } from "./Context/ShoppingListContext";
import { useState } from "react";
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <ViewProvider>
      {!isLoggedIn ? (
        <>
          <Header />
          <LoginForm setIsLoggedIn={setIsLoggedIn} />
          <RegisterForm />
        </>
      ) : (
        <>
          <Header />
          <SearchProvider>
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
        </>
      )}
    </ViewProvider>
  );
};

export default App;
