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
import CssBaseline from '@material-ui/core/CssBaseline';
import ErrorBoundary from '../utils/ErrorBoundary';
import { AuthProvider, useAuthDispatch, useAuthState } from '../context/context';
import { useDarkMode, useKeyCount, useTwoKeyCount } from '../hooks';
import MiniDrawer from '../layouts';
import LoginLayout from '../layouts/LoginLayout';
import StoreProvider, { StoreContext } from '../store';
import themeObject from '../themes';
import Dashboard from './Dashboard';
import Analytics from './NBA/Analytics';
import Replay from './NBA/Replay';
import Analytics from './NBA/Games';
import Game from './NBA/Game';
import PlayPBP from './NBA/PlayPBP';
import PlayRangeWrapper from './NBA/PlayRangeWrapper';

const Home = lazy(() => import('../views/Home'));
const Login = lazy(() => import('./Login'));
const AuthCmp = lazy(() => import('./AuthStatus'));
const Signup = lazy(() => import('./SignUp'));
const Chat = lazy(() => import('./Chat'));
const RealTimeChat = lazy(() => import('./RealTimeChat'));
const Upload = lazy(() => import('./Upload'));
const Live = lazy(() => import('./Live'));

const Loading = () => (
  <div style={{
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }}
  >
    <CircularProgress />
  </div>
);

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

const WaitALittle = (auth, location) => {
  const [waitOver, setWaitOver] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setWaitOver(true), 2000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  if (waitOver) {
    return (
      <Redirect to={{
        pathname: '/login',
        state: { from: location },
      }}
      />
    );
  }

  return <Loading />;
};

function PrivateRoute({ auth, children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) => (auth.auth
        ? children
        : <WaitALittle location={location} />)}
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
          : <WaitALittle location={location} />)}
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

const themeConfig = createMuiTheme(themeObject);

const Routes = ({ buster }) => {
  const store = React.useContext(StoreContext);
  const dispatch = useAuthDispatch();

  const auth = useAuthState();

  // console.log('auth', auth);

  return (
    <MuiThemeProvider theme={store ? store.theme : themeConfig}>
      <CssBaseline />
      <Suspense fallback={<Loading />} key={buster}>
        <Router forceRefresh={false}>
          <div style={{
            height: '100%',
            width: ' 100%',
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
                <ProtectedRoute path='/live' auth={auth}>
                  <MiniDrawer>
                    <Live stage={'prod'} />
                  </MiniDrawer>
                </ProtectedRoute>
                <ProtectedRoute path='/chat/s3' auth={auth}>
                  <MiniDrawer>
                    <Chat />
                  </MiniDrawer>
                </ProtectedRoute>
                <ProtectedRoute path='/chat/dev' auth={auth}>
                  <MiniDrawer>
                    <RealTimeChat stage={'dev'} />
                  </MiniDrawer>
                </ProtectedRoute>
                <ProtectedRoute path='/chat' auth={auth}>
                  <MiniDrawer>
                    <RealTimeChat stage={'prod'} />
                  </MiniDrawer>
                </ProtectedRoute>
                <Route path='/upload'>
                  <MiniDrawer>
                    <Upload />
                  </MiniDrawer>
                </Route>
                <Route path='/games'>
                  <MiniDrawer>
                    <Analytics stage={'dev'} />
                  </MiniDrawer>
                </Route>
                <Route path='/game'>
                  <MiniDrawer>
                    <Game />
                  </MiniDrawer>
                </Route>
                <Route path='/playrange'>
                  <MiniDrawer>
                    <PlayRangeWrapper />
                  </MiniDrawer>
                </Route>
                <Route path='/play'>
                  <MiniDrawer>
                    <PlayPBP />
                  </MiniDrawer>
                </Route>
                <NonLoggedInRoute path='/login' auth={auth}>
                  <LoginLayout>
                    <Login />
                  </LoginLayout>
                </NonLoggedInRoute>
                <Route path='/dash' auth={auth}>
                  <MiniDrawer>
                    {/* <AuthCmp /> */}
                    <Dashboard stage={'dev'} />
                  </MiniDrawer>
                </Route>
                <Route path='/'>
                  {/* <MiniDrawer>
                    <Home />
                  </MiniDrawer> */}
                  <MiniDrawer>
                    <Analytics stage={'dev'} />
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
