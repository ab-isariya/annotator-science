/* istanbul ignore file */
import {OktaAuth} from '@okta/okta-auth-js';

export default new OktaAuth({
  issuer: `https://${process.env.REACT_APP_OKTA_DOMAIN}/oauth2/default`,
  clientId: process.env.REACT_APP_OKTA_CLIENT_ID,
  redirectUri: `${window.location.protocol}//${window.location.host}${process.env.REACT_APP_OKTA_CALLBACK_PATH}`,
  scopes: 'openid profile email offline_access'.split(/\s+/),
  pkce: true
});
