import { createContext, useContext, useState } from "react";
const RecipeContext = createContext();
const useRecipe = () => useContext(RecipeContext);

const RecipeProvider = (children) => {
  return <RecipeContext.Provider>{children}</RecipeContext.Provider>;
};
export { RecipeProvider, useRecipe };
