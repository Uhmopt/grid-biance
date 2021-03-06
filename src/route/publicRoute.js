import React from "react";
import { Route } from "react-router";

const PublicRoute = ({ component: Component, ...rest }) => {
  return (
    <Route {...rest} render={(props) => <Component {...props} {...rest} />} />
  );
};

export default PublicRoute;
