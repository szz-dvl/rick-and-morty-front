/** Inspired by: https://github.com/bernabe9/redux-react-session/blob/master/examples/react-router-v4-example/src/components/PrivateRoute.js */

import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

interface PrivateRouteProps {
  component: any;
  exact?: boolean;
  path: string;
  authenticated: boolean;
}

const PrivateRoute = ({ component: Component, exact = false, path, authenticated }: PrivateRouteProps) => (
  <Route
    exact={exact}
    path={path}
    render={props => (
      authenticated ? (
        <Component {...props} />
      ) : (
        <Redirect to={{
          pathname: '/',
          state: { from: props.location }
        }} />
      ))
    }
  />
);

const { object, bool, string, func } = PropTypes;

PrivateRoute.propTypes = {
  component: func.isRequired,
  exact: bool,
  path: string.isRequired,
  authenticated: bool.isRequired,
  location: object
};

export default PrivateRoute;