import { createContext, useContext, useState } from "react";

const SearchContext = createContext();
const useSearch = () => useContext(SearchContext);
const SearchProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);
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
