import auth0 from 'auth0-js';
import { navigate } from "gatsby-link";

export default class Auth {
  auth0 = new auth0.WebAuth({
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    redirectUri: process.env.AUTH0_CALLBACK,
    audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
    responseType: 'token id_token',
    scope: 'openid profile email'
  });

  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
  }

  login() {
    this.auth0.authorize();
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('user');
    // remove once dev is complete
    localStorage.setItem('logged_out', 1);
  }

  handleAuthentication() {
    if (typeof window !== 'undefined') {
      this.auth0.parseHash((err, authResult) => {
        if (authResult && authResult.accessToken && authResult.idToken) {
          this.setSession(authResult);
        } else if (err) {
          console.log(err);
        }
        // Return to the homepage after authentication.
        navigate('/');
      });
    }
  }

  isAuthenticated() {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  setSession(authResult) {
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);

    this.auth0.client.userInfo(authResult.accessToken, (err, user) => {
      localStorage.setItem('user', JSON.stringify(user));
    })

    // remove once dev is Complete
    localStorage.removeItem('logged_out');
  }

  getUser() {
    if (localStorage.getItem('user')) {
      return JSON.parse(localStorage.getItem('user'));
    }
  }

  getUserName() {
    if (this.getUser()) {
      return this.getUser().name;
    }
  }
}