import React, { useEffect, useState } from 'react';
import { useDarkMode } from '../hooks';

export const StoreContext = React.createContext(null);

const StoreProvider = ({ children }) => {
  const [theme, darkModeState, toggleDarkMode] = useDarkMode();
  const [store, setStore] = useState({
    theme,
    darkModeState,
    toggleDarkMode,
  });

  useEffect(() => {
    setStore({
      theme,
      darkModeState,
      toggleDarkMode,
    });
  }, [darkModeState, theme, toggleDarkMode]);

  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>);
};

export default StoreProvider;
