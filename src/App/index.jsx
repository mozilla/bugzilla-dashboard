import { hot } from 'react-hot-loader';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import ErrorPanel from '@mozilla-frontend-infra/components/ErrorPanel';
import Main from '../views/Main';

const styles = () => ({
  container: {
    fontFamily: 'Roboto',
  },
  '@global': {
    body: {
      margin: 0,
    },
  },
});
class App extends Component {
  static propTypes = {
    classes: PropTypes.shape({}).isRequired,
  };

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
            <Route path="/" component={Main} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default hot(module)(withStyles(styles)(App));
