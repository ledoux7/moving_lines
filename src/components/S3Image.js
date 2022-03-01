import React, { useState, useEffect } from 'react';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import { AmplifyS3Image } from '@aws-amplify/ui-react';
import { loginUser, useAuthState, useAuthDispatch } from '../context/context';

const S3Image = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }}
  >
    <AmplifyS3Image level='public' path='public' imgKey='test.png' />
    {/* <AmplifyS3Image path='protected' identityId={'1'} imgKey='test.jpg' /> */}
  </div>
);

export default S3Image;
