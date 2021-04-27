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
import ErrorBoundary from '../utils/ErrorBoundary';
import { AuthProvider, useAuthDispatch, useAuthState } from '../context/context';
import Dashboard from './Dashboard/Dashboard';
import Album from './Album/Album';
import AppNew from './My/DarkMode';
import { useDarkMode, useKeyCount, useTwoKeyCount } from '../hooks';
import MiniDrawer from '../layouts';
import LoginLayout from '../layouts/LoginLayout';
import StoreProvider, { StoreContext } from '../store';
import themeObject from '../themes';
import cognitoId from '../lib/cognitoId';
import { checkCreds, getUnAuthCreds } from '../lib/simple';
import { configureAmplify } from '../lib/amplify';

const Home = lazy(() => import('../views/Home'));
const Login = lazy(() => import('./Login'));
const AuthCmp = lazy(() => import('./AuthStatus'));
const Confirm = lazy(() => import('./ConfirmUser'));
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

const themeConfig = createMuiTheme(themeObject);

const Routes = ({ buster }) => {
  const store = React.useContext(StoreContext);
  const dispatch = useAuthDispatch();

  const auth = useAuthState();

  console.log('auth', auth);

  return (
    <MuiThemeProvider theme={store ? store.theme : themeConfig}>
      <Suspense fallback={<div>Loading...</div>} key={buster}>
        <Router forceRefresh={false}>
          <div style={{
            height: '100vh',
            width: ' 100vw',
            maxHeight: '100%',
            maxWidth: ' 100%',
            display: 'flex',
            flexDirection: 'column',
          }}
          >
            <ErrorBoundary fallback={<div>aaaa</div>}>
              <Switch>
                <Route path='/signup'>
                  <LoginLayout>
                    <Signup />
                  </LoginLayout>
                </Route>
                <Route path='/confirm'>
                  <Confirm />
                </Route>
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

                <Route path='/login'>
                  <LoginLayout>
                    <Login />
                  </LoginLayout>
                </Route>
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
