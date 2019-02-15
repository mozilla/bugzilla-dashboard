import React, { Component, Suspense } from 'react';
import { Route } from 'react-router-dom';
import Loading from '../Loading';

export default class LazyRoute extends Component {
  render() {
    const {
      component: Component,
      path,
      exact,
      strict,
      location,
      sensitive,
      ...props
    } = this.props;

    return (
      <Route
        path={path}
        exact={exact}
        strict={strict}
        location={location}
        sensitive={sensitive}
        render={({ staticContext, ...renderProps }) => (
          <Suspense fallback={<Loading />}>
            <Component {...renderProps} {...props} />
          </Suspense>
        )}
      />
    );
  }
}
