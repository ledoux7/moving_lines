import React, { useReducer, useContext } from 'react';

const AuthStateContext = React.createContext();
const AuthDispatchContext = React.createContext();

export const initialState = {
  loading: false,
  errorMessage: null,
  user: null,
  auth: false,
  unauth: false,

  cognitoUser: null,

  authCreds: {
    accessKeyId: '',
    secretAccessKey: '',
    sessionToken: '',
  },

  unAuthCreds: {
    accessKeyId: '',
    secretAccessKey: '',
    sessionToken: '',
  },
};

export const AuthReducer = (state, action) => {
  switch (action.type) {
    case 'INIT':
      return {
        ...state,
        loading: true,
      };
    case 'CREDENTIALS':
      if (action.payload && action.payload.data) {
        const creds = {
          ...action.payload.data,
        };
        const { authenticated } = creds;
        const authObjKey = authenticated ? 'authCreds' : 'unAuthCreds';

        return {
          ...state,
          loading: false,
          [authObjKey]: creds,
          auth: authenticated,
          unauth: !authenticated,
        };
      } else {
        return {
          ...state,
          loading: false,
          auth: false,
          unauth: false,
        };
      }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        auth: true,
        unauth: false,
        loading: false,
        cognitoUser: action.payload.user,
      };
    case 'LOGIN_FAILED':
      return {
        ...state,
        loading: false,
        auth: false,
        unauth: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        loading: false,
        auth: false,
        unauth: false,
      };

    default:
      return state;
  }
};

export function useAuthState() {
  const context = useContext(AuthStateContext);
  if (context === undefined) {
    throw new Error('useAuthState must be used within a AuthProvider');
  }

  return context;
}

export function useAuthDispatch() {
  const context = useContext(AuthDispatchContext);
  if (context === undefined) {
    throw new Error('useAuthDispatch must be used within a AuthProvider');
  }

  return context;
}

export const AuthProvider = ({ children }) => {
  const [user, dispatch] = useReducer(AuthReducer, initialState);

  return (
    <AuthStateContext.Provider value={user}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};
