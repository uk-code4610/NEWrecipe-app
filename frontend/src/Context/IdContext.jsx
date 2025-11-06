import { createContext, useContext, useState } from "react";

const IdContext = createContext();
const useRecipeId = () => useContext(IdContext);
const RecipeIdProvider = ({ children }) => {
  const [recipeId, setRecipeId] = useState("");
  return (
    <IdContext.Provider value={{ recipeId, setRecipeId }}>
      {children}
    </IdContext.Provider>
  );
};
export { useRecipeId, RecipeIdProvider };
