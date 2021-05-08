/* eslint-disable max-len */
/* eslint-disable camelcase */
const request = require('request');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
global.fetch = require('node-fetch');

// const appAccessGroup = process.env.APP_ACCESS_GROUP;
const UserPoolIdValue = process.env.USER_POOL_ID;
const ClientIdValue = process.env.CLIENT_ID;

// Pool Info
const poolData = {
  UserPoolId: UserPoolIdValue, // Your user pool id here
  ClientId: ClientIdValue, // Your client id here
};
const pool_region = 'eu-west-1';

/**
  * Returns an IAM policy document for a given user and resource.
  *
  * @method buildIAMPolicy
  * @param {String} userId - user id
  * @param {String} effect  - Allow / Deny
  * @param {String} resource - resource ARN
  * @param {String} context - response context
  * @returns {Object} policyDocument
  */
const buildIAMPolicy = (userId, effect, resource, context) => {
  console.log(`buildIAMPolicy ${userId} ${effect} ${resource}`);
  const policy = {
    principalId: userId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
    context,
  };

  console.log(JSON.stringify(policy));
  return policy;
};

// Help function to generate an IAM policy
const generatePolicy = function (principalId, effect, resource) {
  // Required output:
  const authResponse = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = '2012-10-17'; // default version
    policyDocument.Statement = [];
    const statementOne = {};
    statementOne.Action = 'execute-api:Invoke'; // default action
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  // Optional output with custom properties of the String, Number or Boolean type.
  authResponse.context = {
    'stringKey': 'stringval',
    'numberKey': 123,
    'booleanKey': true,
  };
  return authResponse;
};

const generateAllow = function (principalId, resource) {
  return generatePolicy(principalId, 'Allow', resource);
};

const generateDeny = function (principalId, resource) {
  return generatePolicy(principalId, 'Deny', resource);
};

//
// Reusable Authorizer function, set on `authorizer` field in serverless.yml
exports.handler = (event, context, cb) => {
  try {
    console.log('Auth function invoked', event, `https://cognito-idp.${pool_region}.amazonaws.com/${poolData.UserPoolId}/.well-known/jwks.json`);
    const { queryStringParameters } = event;
    const token = queryStringParameters.auth;

    console.log('eventParam', event.methodArn);
    let stage = '';

    if (event.methodArn) {
      console.log('start if');
      const what = event.methodArn.split(':');
      console.log('first split');

      if (what.length) {
        const apiGatewayArnTmp = what[5].split('/');
        stage = apiGatewayArnTmp[1];
        const route = apiGatewayArnTmp[2];
        console.log(' splited', apiGatewayArnTmp);
      }
    }

    console.log('stage', stage, stage === 'prod');

    if (stage === 'live') {
      cb(null, generateAllow('me', event.methodArn));
    }
    else if (token) {
      // Remove 'bearer ' from token:

      // const token = event.authorizationToken.substring(7);
      // Make a request to the iss + .well-known/jwks.json URL:
      request(
        {
          url: `https://cognito-idp.${pool_region}.amazonaws.com/${poolData.UserPoolId}/.well-known/jwks.json`,
          json: true,
        },
        (error, response, body) => {
          if (!error && response.statusCode === 200) {
            const pems = {};
            const { keys } = body;
            for (let i = 0; i < keys.length; i++) {
              // Convert each key to PEM
              const key_id = keys[i].kid;
              const modulus = keys[i].n;
              const exponent = keys[i].e;
              const key_type = keys[i].kty;
              const jwk = { kty: key_type, n: modulus, e: exponent };
              const pem = jwkToPem(jwk);
              pems[key_id] = pem;
            }
            // validate the token
            const decodedJwt = jwt.decode(token, { complete: true });
            if (!decodedJwt) {
              console.log('Not a valid JWT token');
              cb('Unauthorized');
            }

            const { kid } = decodedJwt.header;
            const pem = pems[kid];
            if (!pem) {
              console.log('Invalid token');
              cb('Unauthorized');
            }

            jwt.verify(token, pem, (err, payload) => {
              if (err) {
                console.log('Invalid Token.');
                cb('Unauthorized');
              }
              else {
                // // START - appAccessGroup check - Adding appAccessGroup to allow initial access to the Api based on the group membership
                // if (typeof payload['cognito:groups'] === 'undefined' || payload['cognito:groups'] === null) {
                //   console.log("No cognito:groups in the payload hence can't look for APP_ACCESS_GROUP in the array of cognito:groups which is a list of user groups, hence returning UNAUTHORISED");
                //   cb('Unauthorized');
                // }
                // else {
                //   const customScope = payload['cognito:groups'];
                //   if (customScope.includes(appAccessGroup)) {
                //     console.log(appAccessGroup + ' is in the customScope list ' + customScope);
                //   }
                //   else {
                //     console.log('Error! ' + appAccessGroup + ' is NOT in the customScope list ' + customScope);
                //     console.log('Please make sure that the user is a member of APP_ACCESS_GROUP env variable and claim rule added to ADFS config to pass group membership into a custom  attribute - APP_ACCESS_GROUP is env variable for the App authoriser lambda');
                //     cb('Unauthorized');
                //   }
                // }
                // const customScope = payload['cognito:groups'];
                //   if (customScope.includes(appAccessGroup)) {
                //     console.log(appAccessGroup + ' is in the customScope list ' + customScope);
                //   }
                //   else {
                //     console.log('Error! ' + appAccessGroup + ' is NOT in the customScope list ' + customScope);
                //     console.log('Please make sure that the user is a member of APP_ACCESS_GROUP env variable and claim rule added to ADFS config to pass group membership into a custom  attribute - APP_ACCESS_GROUP is env variable for the App authoriser lambda');
                //     cb('Unauthorized');
                //   }
                // END - appAccessGroup check
                // console.log('methodArn:');
                // console.log(event.methodArn);
                // Let's return the full payload in authorizerContext - this is really up to company's requirements
                // const authorizerContext = { token: JSON.stringify(payload) };
                // You can replace * with event.methodArn if you don't want to manage user access in the backend app based on the user scope (and face the consequences ;)
                // const policyDocument = buildIAMPolicy(payload.sub, 'Allow', '*', authorizerContext);
                cb(null, generateAllow('me', event.methodArn));
                // cb(null, policyDocument);
              }
            });
          }
          else {
            console.log('Error! Unable to download JWKs');
            cb('Unauthorized');
          }
        },
      );
    }
    else {
      console.log('No authorizationToken found in the header.');
      cb('Unauthorized');
    }
  }
  catch (error) {
    console.log('catch error', error);
  }
};
