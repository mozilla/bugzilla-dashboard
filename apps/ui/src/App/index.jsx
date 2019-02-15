import { hot } from 'react-hot-loader';
import React, { Component, lazy } from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import CssBaseline from '@material-ui/core/CssBaseline';
import { BrowserRouter, Switch } from 'react-router-dom';
import FontStager from '../components/FontStager';
import LazyRoute from '../components/LazyRoute';

const Home = lazy(() => import(/* webpackChunkName: 'Home' */ '../views/Home'));
const Login = lazy(() =>
  import(/* webpackChunkName: 'Login' */ '../views/Login')
);

export default
@hot(module)
class App extends Component {
  client = new ApolloClient({
    uri: '/graphql',
    request: operation => {
      const storedCredentials = localStorage.getItem('credentials');
      const credentials = storedCredentials && JSON.parse(storedCredentials);

      if (credentials) {
        operation.setContext({
          headers: {
            Authorization: `Bearer ${credentials.idToken}`,
          },
        });
      }
    },
  });

  render() {
    return (
      <BrowserRouter>
        <ApolloProvider client={this.client}>
          <CssBaseline />
          <FontStager />
          <Switch>
            <LazyRoute path="/login" component={Login} />
            <LazyRoute path="/" component={Home} />
          </Switch>
        </ApolloProvider>
      </BrowserRouter>
    );
  }
}
