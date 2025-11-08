import { createContext, ReactNode, useContext, useState } from "react";
type ViewContextType = {
  currentView: string;
  setCurrentView: (currentView: string) => void;
};
type ViewProviderProps = {
  children: ReactNode;
};

const ViewContext = createContext<ViewContextType | undefined>(undefined);
const useView = () => {
  const context = useContext(ViewContext);
  if (context === undefined) {
    throw new Error("useView must be used within ViewProvider");
  }
  return context;
};

const ViewProvider = ({ children }: ViewProviderProps) => {
  const [currentView, setCurrentView] = useState("list");
  return (
    <ViewContext.Provider value={{ currentView, setCurrentView }}>
      {children}
    </ViewContext.Provider>
  );
};
export { useView, ViewProvider };
