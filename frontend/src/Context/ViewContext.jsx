import { createContext, useContext, useState } from "react";

const ViewContext = createContext();
const useView = () => useContext(ViewContext);
const ViewProvider = ({ children }) => {
  const [currentView, setCurrentView] = useState("list");
  return (
    <ViewContext.Provider value={{ currentView, setCurrentView }}>
      {children}
    </ViewContext.Provider>
  );
};
export { useView, ViewProvider };
