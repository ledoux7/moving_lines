import React, {
  Suspense, lazy, useEffect, useState,
} from 'react';
import {
  HashRouter as Router,
  // BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect,
} from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';
import ErrorBoundary from '../utils/ErrorBoundary';
import { AuthProvider, useAuthDispatch, useAuthState } from '../context/context';
import { useDarkMode, useKeyCount, useTwoKeyCount } from '../hooks';
import MiniDrawer from '../layouts';
import LoginLayout from '../layouts/LoginLayout';
import StoreProvider, { StoreContext } from '../store';
import themeObject from '../themes';
import { configureAmplify } from '../lib/amplify';

const Home = lazy(() => import('../views/Home'));
const Login = lazy(() => import('./Login'));
const AuthCmp = lazy(() => import('./AuthStatus'));
const Signup = lazy(() => import('./SignUp'));
const Chat = lazy(() => import('./Chat'));
const Upload = lazy(() => import('./Upload'));

const NavRoute = ({ exact, path, component: Component }) => (
  <Route
    // exact={exact}
    path={path}
    render={props => (
      <div>
        {/* <Header /> */}
        <div>header</div>
        <Component {...props} />
      </div>
    )}
  />
);

function PrivateRoute({ auth, children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) => (auth.auth
        ? children
        : <Redirect to={{
          pathname: '/login',
          state: { from: location },
        }}
        />)}
    />
  );
}

function ProtectedRoute({ auth, children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) => (
        (auth.auth || auth.unauth)
          ? children
          : <Redirect to={{
            pathname: '/login',
            state: { from: location },
          }}
          />)}
    />
  );
}

function NonLoggedInRoute({ auth, children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) => (
        (!auth.auth)
          ? children
          : <Redirect to={{
            pathname: '/',
            state: { from: location },
          }}
          />)}
    />
  );
}

const Loading = () => (
  <div style={{
    height: '100vh',
    width: ' 100vw',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',

  }}
  >
    <CircularProgress />
  </div>
);

const themeConfig = createMuiTheme(themeObject);

const Routes = ({ buster }) => {
  const store = React.useContext(StoreContext);
  const dispatch = useAuthDispatch();

  const auth = useAuthState();

  console.log('auth', auth);

  return (
    <MuiThemeProvider theme={store ? store.theme : themeConfig}>
      <Suspense fallback={<Loading />} key={buster}>
        <Router forceRefresh={false}>
          <div style={{
            height: '100vh',
            width: ' 100vw',
            // maxHeight: '100%',
            // maxWidth: ' 100%',
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '100%',
            overflowWrap: 'break-word',
            wordBreak: 'break-word',
          }}
          >
            <ErrorBoundary fallback={<div>aaaa</div>}>
              <Switch>
                <NonLoggedInRoute path='/signup' auth={auth}>
                  <LoginLayout>
                    <Signup />
                  </LoginLayout>
                </NonLoggedInRoute>
                <Route path='/auth'>
                  <MiniDrawer>
                    <AuthCmp />
                  </MiniDrawer>
                </Route>
                <ProtectedRoute path='/chat' auth={auth}>
                  <MiniDrawer>
                    <Chat />
                  </MiniDrawer>
                </ProtectedRoute>
                <Route path='/upload'>
                  <MiniDrawer>
                    <Upload />
                  </MiniDrawer>
                </Route>

                <NonLoggedInRoute path='/login' auth={auth}>
                  <LoginLayout>
                    <Login />
                  </LoginLayout>
                </NonLoggedInRoute>
                <PrivateRoute path='/dash' auth={auth}>
                  <MiniDrawer>
                    <AuthCmp />
                  </MiniDrawer>
                </PrivateRoute>
                <Route path='/'>
                  <MiniDrawer>
                    <div />
                    <Home />
                  </MiniDrawer>
                </Route>
              </Switch>
            </ErrorBoundary>
          </div>
        </Router>
      </Suspense>

    </MuiThemeProvider>
  );
};

const RoutesMemo = React.memo(Routes);

export default RoutesMemo;
