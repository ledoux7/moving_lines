import React, {
  Suspense, lazy, useEffect, useState,
} from 'react';
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import ErrorBoundary from '../utils/ErrorBoundary';
import { useAuthDispatch, useAuthState } from '../context/context';
import MiniDrawer from '../layouts';
import LoginLayout from '../layouts/LoginLayout';
import { StoreContext } from '../store';
import themeObject from '../themes';
import Dashboard from './Dashboard';
import Games from './NBA/Games';
import Game from './NBA/Game';
import PlayPBP from './NBA/PlayPBP';
import PlayRangeWrapper from './NBA/PlayRangeWrapper';
import PlaySelectorWrapper from './NBA/PlaySelectorWrapper';
import RandomShots from './NBA/Random';
import IsIt from './NBA/IsIt';
import Shots from './NBA/Shots';
import PlayListWrapper from './NBA/PlayListWrapper';
import Pred from './NBA/Pred';

const Home = lazy(() => import('../views/Home'));
const Login = lazy(() => import('./Login'));
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
      key={rest.path}
      {...rest}
      render={({ location }) => (auth && auth.auth
        ? children
        : <WaitALittle location={location} />)}
    />
  );
}

function ProtectedRoute({ auth, children, ...rest }) {
  return (
    <Route
      key={rest.path}
      {...rest}
      render={({ location }) => (
        (auth && (auth.auth || auth.unauth))
          ? children
          : <WaitALittle location={location} />)}
    />
  );
}

function NonLoggedInRoute({ auth, children, ...rest }) {
  return (
    <Route
      key={rest.path}
      {...rest}
      render={({ location }) => (
        (auth && !auth.auth)
          ? children
          : <Redirect to={{
            pathname: '/',
            state: { from: location },
          }}
          />)}
    />
  );
}

function MyRoute({ children, ...rest }) {
  return (
    <Route
      key={rest.path}
      {...rest}
      render={() => children}
    />
  );
}

const themeConfig = createTheme(themeObject);

const Routes = ({ buster }) => {
  const store = React.useContext(StoreContext);
  const dispatch = useAuthDispatch();
  const auth = useAuthState();

  return (
    <MuiThemeProvider theme={store ? store.theme : themeConfig}>
      <CssBaseline />
      <Suspense fallback={<Loading />} key={buster}>
        <Router forceRefresh={false}>
          <div style={{
            height: '100%',
            width: ' 100%',
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '100%',
            overflowWrap: 'break-word',
            wordBreak: 'break-word',
          }}
          >
            <ErrorBoundary fallback={<div>Error</div>}>
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
                <MyRoute path='/upload'>
                  <MiniDrawer>
                    <Upload />
                  </MiniDrawer>
                </MyRoute>
                <MyRoute path='/games'>
                  <MiniDrawer>
                    <Games stage={'dev'} />
                  </MiniDrawer>
                </MyRoute>
                <MyRoute path='/game'>
                  <MiniDrawer>
                    <Game />
                  </MiniDrawer>
                </MyRoute>
                <PrivateRoute path='/playrange' auth={auth}>
                  <MiniDrawer>
                    <PlayRangeWrapper />
                  </MiniDrawer>
                </PrivateRoute>
                <MyRoute path='/playlist'>
                  <MiniDrawer>
                    <PlayListWrapper />
                  </MiniDrawer>
                </MyRoute>
                <MyRoute path='/playselector'>
                  <MiniDrawer>
                    <PlaySelectorWrapper />
                  </MiniDrawer>
                </MyRoute>
                <MyRoute path='/play'>
                  <MiniDrawer>
                    <PlayPBP />
                  </MiniDrawer>
                </MyRoute>
                <MyRoute path='/random'>
                  <MiniDrawer>
                    <RandomShots />
                  </MiniDrawer>
                </MyRoute>
                <MyRoute path='/shots'>
                  <MiniDrawer>
                    <Shots />
                  </MiniDrawer>
                </MyRoute>
                <MyRoute path='/3pt'>
                  <MiniDrawer>
                    <Pred />
                  </MiniDrawer>
                </MyRoute>
                <MyRoute path='/isit'>
                  <MiniDrawer>
                    <IsIt />
                  </MiniDrawer>
                </MyRoute>
                <NonLoggedInRoute path='/login' auth={auth}>
                  <LoginLayout>
                    <Login />
                  </LoginLayout>
                </NonLoggedInRoute>
                <MyRoute path='/dash' auth={auth}>
                  <MiniDrawer>
                    {/* <AuthCmp /> */}
                    <Dashboard stage={'dev'} />
                    {/* <NBADash /> */}
                  </MiniDrawer>
                </MyRoute>
                <MyRoute path='/'>
                  <MiniDrawer>
                    <Home />
                  </MiniDrawer>
                  {/* <MiniDrawer>
                    <Games stage={'dev'} />
                  </MiniDrawer> */}
                </MyRoute>
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
