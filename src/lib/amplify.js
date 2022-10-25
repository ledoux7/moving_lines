import { Amplify } from 'aws-amplify';

export default function configureAmplify() {
  Amplify.configure(
    {
      Auth: {
        identityPoolId: process.env.REACT_APP_COGNITO_IDENTITY_POOL,
        region: process.env.REACT_APP_AWS_REGION,
        userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
        userPoolWebClientId: process.env.REACT_APP_COGNITO_CLIENT_ID,
      },
      Storage: {
        bucket: process.env.REACT_APP_S3_BUCKET,
        region: process.env.REACT_APP_AWS_REGION,
        identityPoolId: process.env.REACT_APP_COGNITO_IDENTITY_POOL,
      },
    },
  );
}
