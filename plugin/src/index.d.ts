declare module "google-oauth2-env-vars" {
  export default class GoogleOAuth2 {
    constructor(options: { token: string });
    getAuth(): Promise<import("google-auth-library").OAuth2Client>;
  }
}
