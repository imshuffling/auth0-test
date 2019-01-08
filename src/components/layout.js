import React, { Component } from 'react'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'
//import Nav from './Nav'
import Auth from '../utils/auth.js'
const auth = new Auth()

class Layout extends Component {
  componentDidMount() {
    console.log(auth.isAuthenticated())
    console.log('logged_out: ' + localStorage.getItem('logged_out'))
    if (!auth.isAuthenticated() && localStorage.getItem('logged_out') !== '1') {
      console.log('login triggered')
      auth.login()
    }
  }
  render() {
    const { children } = this.props
    return (
      <StaticQuery
        query={graphql`
          query LayoutQuery {
            site {
              siteMetadata {
                title
              }
            }
          }
        `}
        render={data => (
          <>
            <Helmet
              title="Testing auth0"
              meta={[
                { name: 'description', content: '' },
                { name: 'keywords', content: '' },
              ]}
            />
            <div />
            <main>{children}</main>
          </>
        )}
      />
    )
  }
}

export default Layout
