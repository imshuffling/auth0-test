import React from 'react';
import Auth from '../utils/auth';

const auth = new Auth();

export default class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false
    };
  }

  login() {
    auth.login();

    this.setState({
      authenticated: auth.isAuthenticated()
    });
  }

  logout() {
    auth.logout();

    this.setState({
      authenticated: auth.isAuthenticated()
    });
  }

  componentDidMount() {
    this.setState({
      authenticated: auth.isAuthenticated()
    });
  }

  render() {
    return (
      <div>
        <a href="/">
          Home
        </a>
        <span> | </span>
        {
          !this.state.authenticated && (
            <span>
              <a href="#" onClick={this.login.bind(this)}>Log In</a>
            </span>
          )
        }
        {
          this.state.authenticated && (
            <span>
              <a href="#" onClick={this.logout.bind(this)}>Log Out
                {
                  auth.getUserName() && (
                    <span> ({auth.getUserName()})</span>
                  )
                }
              </a>
            </span>
          )
        }
      </div>
    );
  }
}
