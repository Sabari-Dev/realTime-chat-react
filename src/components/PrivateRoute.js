import React, { useContext } from "react";
import { Navigate, Route } from "react-router-dom";
import { AuthContext } from "../context/auth";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { user } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      exact
      render={(props) =>
        user ? <Component {...props} /> : <Navigate replace to="/signIn" />
      }
    />
  );
};

export default PrivateRoute;
