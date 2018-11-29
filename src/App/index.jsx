import { hot } from 'react-hot-loader';
import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import ErrorPanel from '@mozilla-frontend-infra/components/ErrorPanel';
import routes from './routes';

const styles = () => ({
  container: {
    fontFamily: 'Roboto',
  },
});

class App extends Component {
  state = {
    error: undefined,
  };

  render() {
    const { classes } = this.props;
    const { error } = this.state;

    return (
      <div className={classes.container}>
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

export default hot(module)(withStyles(styles)(App));
