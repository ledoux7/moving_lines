import React, {
  Suspense, lazy, useEffect, useState,
} from 'react';
import { AuthProvider, useAuthDispatch, useAuthState } from './context/context';
import { useDarkMode, useKeyCount, useTwoKeyCount } from './hooks';
import StoreProvider, { StoreContext } from './store';
import Routes from './components/Routes';
import AuthHandler from './components/AuthHandler';

const App = () => {
  const keyCount = useTwoKeyCount('ctrl', 'q');

  return (
    <StoreProvider>
      <AuthProvider>
        <AuthHandler>
          <Routes buster={keyCount} />
        </AuthHandler>
      </AuthProvider>
    </StoreProvider>

  );
};

export default App;
