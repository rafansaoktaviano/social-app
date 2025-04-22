// context/TabVisibilityContext.tsx
import { createContext, useState, useContext } from "react";

const TabVisibilityContext = createContext({
  tabVisible: false,
  setTabVisible: (visible: boolean) => {},
});

export const TabVisibilityProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [tabVisible, setTabVisible] = useState(false);

  return (
    <TabVisibilityContext.Provider value={{ tabVisible, setTabVisible }}>
      {children}
    </TabVisibilityContext.Provider>
  );
};

export const useTabVisibility = () => useContext(TabVisibilityContext);
