import PropTypes from "prop-types";
import React from "react";
import { connect, useSelector } from "react-redux";
import { Redirect, Route } from "react-router";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isAuthed = useSelector((state) => Boolean(state?.auth?.token) ?? false);
  console.log(rest, "===========================================");
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthed ? (
          <Component {...props} {...rest} />
        ) : (
          <Redirect to={{ pathname: "/", state: { from: props.location } }} />
        )
      }
    />
  );
};

export default PrivateRoute;
