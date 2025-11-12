import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
type Recipe = {
  id: number;
  title: string;
  description: string;
  image_url: string;
  ingredients: string[];
  steps: string[];
  time_min: number;
};
type FavoriteType = {
  favorite: number[];
  setFavorite: (favorite: number[]) => void;
  favoriteRecipe: Recipe[];
  setFavoriteRecipe: (recipe: Recipe[]) => void;
};
type FavoriteProviderProps = {
  children: ReactNode;
};
const FavoriteContext = createContext<FavoriteType | undefined>(undefined);
const useFavorite = () => {
  const context = useContext(FavoriteContext);
  if (context === undefined) {
    throw new Error("useFavorite must be used within FavoriteProvider");
  }
  return context;
};
const FavoriteProvider = ({ children }: FavoriteProviderProps) => {
  const [favorite, setFavorite] = useState<number[]>([]);
  const [favoriteRecipe, setFavoriteRecipe] = useState<Recipe[]>([]);
  return (
    <FavoriteContext.Provider
      value={{ favorite, setFavorite, favoriteRecipe, setFavoriteRecipe }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};
export { useFavorite, FavoriteProvider };
