import { AuthConfig } from 'angular-oauth2-oidc';

export const authonfig: AuthConfig = {
  // Url of the Identity Provider
  loginUrl: 'https://identity.youfit.com/adfs/oauth2/authorize',
  issuer: 'https://identity.youfit.com/adfs',

  redirectUri: window.location.origin,

  clientId: '758ac6c5-d1d8-4f12-ae82-463f5c3ffad8',

  responseType: 'id_token token',

  scope: 'openid profile',

};