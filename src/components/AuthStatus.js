import React, { useState, useEffect } from 'react';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { AmplifyS3Image } from '@aws-amplify/ui-react';
import { loginUser, useAuthState, useAuthDispatch } from '../context/context';
import UserPool from '../UserPool';
import cognitoId from '../lib/cognitoId';

const AuthStatus = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [url, setUrl] = useState('');

  const [locUser, setLocUser] = useState(null);

  const userDetails = useAuthState();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}
    >
      <AmplifyS3Image level='public' path='public' imgKey='test.png' />
      {/* <AmplifyS3Image path='protected' identityId={'1'} imgKey='test.jpg' /> */}

      {/* <Image src={url} /> */}
      {/* <img
        alt={'team crest'}
        src={url}
        style={{
          width: 300,
          // he
        }}
      /> */}

    </div>
  );
};

export default AuthStatus;
