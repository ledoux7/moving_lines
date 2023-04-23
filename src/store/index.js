import React, { useEffect, useState } from 'react';
import { useDarkMode } from '../hooks';

export const StoreContext = React.createContext(null);

const StoreProvider = ({ children }) => {
  const [theme, darkModeState, toggleDarkMode] = useDarkMode();
  const [videoMenuPostion, toggleVideoMenuPosition] = useState(true);
  const [store, setStore] = useState({
    theme,
    darkModeState,
    toggleDarkMode,
    videoMenuPostion,
    toggleVideoMenuPosition,
  });

  useEffect(() => {
    setStore({
      theme,
      darkModeState,
      toggleDarkMode,
      videoMenuPostion,
      toggleVideoMenuPosition,
    });
  }, [darkModeState, theme, toggleDarkMode, videoMenuPostion]);

  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>);
};

export default StoreProvider;
