import { createContext, useContext, useState } from "react";

const FavoriteContext = createContext();
const useFavorite = () => useContext(FavoriteContext);
const FavoriteProvider = ({ children }) => {
  const [favorite, setFavorite] = useState([]);
  const [favoriteRecipe, setFavoriteRecipe] = useState([]);
  return (
    <FavoriteContext.Provider
      value={{ favorite, setFavorite, favoriteRecipe, setFavoriteRecipe }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};
export { useFavorite, FavoriteProvider };
