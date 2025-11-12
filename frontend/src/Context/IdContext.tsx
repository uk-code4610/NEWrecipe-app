import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
type Idtype = {
  recipeId: number | null;
  setRecipeId: (recipeId: number | null) => void;
};
type RecipeIdProviderProps = {
  children: ReactNode;
};
const IdContext = createContext<Idtype | undefined>(undefined);
const useRecipeId = () => {
  const context = useContext(IdContext);
  if (context === undefined) {
    throw new Error("useRecipeId must be used within RecipeIdProvider");
  }
  return context;
};
const RecipeIdProvider = ({ children }: RecipeIdProviderProps) => {
  const [recipeId, setRecipeId] = useState<number | null>(null);
  return (
    <IdContext.Provider value={{ recipeId, setRecipeId }}>
      {children}
    </IdContext.Provider>
  );
};
export { useRecipeId, RecipeIdProvider };
