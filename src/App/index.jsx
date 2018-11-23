import { hot } from 'react-hot-loader';
import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import ErrorPanel from '@mozilla-frontend-infra/components/ErrorPanel';
import routes from './routes';

class App extends Component {
  state = {
    error: undefined,
  };

  render() {
    const { error } = this.state;

    return (
      <div className="App">
        {error && <ErrorPanel error={new Error(error)} />}
        <BrowserRouter>
          <Switch>
            {routes.map(props => (
              <Route key={props.path} {...props} />
            ))}
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default hot(module)(App);
