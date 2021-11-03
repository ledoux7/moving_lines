import React, {
  Suspense, lazy, useEffect, useState,
} from 'react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { AuthProvider, useAuthDispatch, useAuthState } from './context/context';
import { useDarkMode, useKeyCount, useTwoKeyCount } from './hooks';
import StoreProvider, { StoreContext } from './store';
import Routes from './components/Routes';
import AuthHandler from './components/AuthHandler';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60 * 1000,
      refetchOnMount: true,
      // cacheTime: 60 * 1000,
    },
  },
});

const App = () => {
  const keyCount = useTwoKeyCount('ctrl', 'q');

  return (
    <StoreProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AuthHandler>
            <Routes buster={keyCount} />
          </AuthHandler>
        </AuthProvider>
      </QueryClientProvider>
    </StoreProvider>

  );
};

export default App;
