import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import poolData from "./cognito";

export function login(email, password) {
  return new Promise((resolve, reject) => {
    const authenticationData = {
      Username: email,
      Password: password,
    };

    const authenticationDetails = new AuthenticationDetails(authenticationData);
    const userData = {
      Username: email,
      Pool: poolData,
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        const token = result.getIdToken().getJwtToken();
        resolve({ success: true, token });
      },

      onFailure: (err) => {
        reject({ success: false, message: err.message || "Login failed" });
      },
    });
  });
}