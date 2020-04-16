import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

const PropsRoute = ({ component, ...props }) => (
  <Route
    /* eslint-disable react/jsx-props-no-spreading */
    {...props}
    render={(routeProps) => React.createElement(component, { ...routeProps, ...props })}
  />
);

PropsRoute.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object,
  ]).isRequired,
};

export default PropsRoute;
