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

type useSearchType = {
  searchResults: Recipe[];
  setSearchResults: (searchResults: Recipe[]) => void;
  doSearch: boolean;
  setDosearch: (doSearch: boolean) => void;
};

type SearchProviderProps = {
  children: ReactNode;
};
const SearchContext = createContext<useSearchType | undefined>(undefined);
const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within SearchProvider");
  }
  return context;
};
const SearchProvider = ({ children }: SearchProviderProps) => {
  const [searchResults, setSearchResults] = useState<Recipe[]>([]);
  const [doSearch, setDosearch] = useState(false);
  return (
    <SearchContext.Provider
      value={{ searchResults, setSearchResults, doSearch, setDosearch }}
    >
      {children}
    </SearchContext.Provider>
  );
};
export { useSearch, SearchProvider };
