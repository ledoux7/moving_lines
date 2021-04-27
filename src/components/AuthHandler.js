import React, {
  Suspense, lazy, useEffect, useState,
} from 'react';
import Amplify, { Auth, Hub, Logger } from 'aws-amplify';
import { AuthProvider, useAuthDispatch, useAuthState } from '../context/context';
import MyAuth, { configureAmplify } from '../lib/amplify';

const AuthHandler = ({ children }) => {
  const [logger, setLogger] = useState(new Logger('Hub', 'DEBUG'));

  const dispatch = useAuthDispatch();

  useEffect(() => {
    console.log('init');
    dispatch({ type: 'INIT', payload: null });

    configureAmplify();

    Auth.currentCredentials()
      .then(data => {
        dispatch({ type: 'CREDENTIALS', payload: { data } });

        if (data.authenticated) {
          Auth.currentAuthenticatedUser().then(user => {
            dispatch({ type: 'LOGIN_SUCCESS', payload: { user } });
          })
            .catch(e => {
              console.log('e', e);
            });
        }
      }).catch(e => {
        console.log('err unauth');
        dispatch({ type: 'CREDENTIALS', payload: null });
      });
    return () => {
      // cleanup
    };
  }, [dispatch]);

  useEffect(() => {
    Hub.listen('Auth', data => {
      console.log('Hub', data);
      if (data && data.payload) {
        switch (data.payload.event) {
          case 'signIn':
            logger.info('user signed in');
            break;
          case 'signUp':
            logger.info('user signed up');
            break;
          case 'signOut':
            logger.info('user signed out');
            break;
          case 'signIn_failure':
            logger.error('user sign in failed');
            break;
          case 'tokenRefresh':
            logger.info('token refresh succeeded');
            Auth.currentCredentials()
              .then(d => {
                dispatch({ type: 'CREDENTIALS', payload: { data: d } });
              })
              .catch(() => null);
            break;
          case 'tokenRefresh_failure':
            logger.error('token refresh failed');
            dispatch({ type: 'CREDENTIALS', payload: { } });
            break;
          case 'configured':
            logger.info('the Auth module is configured');
            break;
          default:
            logger.info(data.payload.message);
        }
      }
    });
  }, [dispatch, logger]);

  return children;
};

export default AuthHandler;
