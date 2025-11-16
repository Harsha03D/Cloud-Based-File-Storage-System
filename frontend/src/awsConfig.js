const awsConfig = {
  region: process.env.REACT_APP_REGION,
  userPoolId: process.env.REACT_APP_USER_POOL_ID,
  clientId: process.env.REACT_APP_CLIENT_ID,
  authDomain: process.env.REACT_APP_COGNITO_DOMAIN,
};

export default awsConfig;