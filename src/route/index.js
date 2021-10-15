import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { setConnectorInjection } from "store/actions/appAction";
import InjectedConnector from "utils/InjectedConnector";
import NoMatchPage from "../pages/404/NoMatchPage";
import PrivateRoute from "./privateRoute";
import PublicRoute from "./publicRoute";
import routeMaps from "./routeMap";

const Routes = () => {
  const [connector, setConnector] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const Injectedconnectors = new InjectedConnector(
      process.env.REACT_APP_CHAIN_ID
    );
    setConnector(Injectedconnectors);
    setConnectorInjection(dispatch, { connector: Injectedconnectors });
    // console.log(Injectedconnectors, "injectedconnected")
    // Injectedconnectors.connect((connector) => {
    //   console.log(connector, "connector")
    //   setConnector(connector);
    //   setAuthentication(dispatch, { account: connector.account });
    //   setConnectorInjection(dispatch, { connector: connector });
    // });
  }, []);

  return (
    <Switch>
      {connector !== null
        ? routeMaps.map((route) => {
            if (route.auth) {
              return (
                <PrivateRoute
                  key={route.path}
                  {...route}
                  connector={connector}
                />
              );
            }
            return (
              <PublicRoute key={route.path} {...route} connector={connector} />
            );
          })
        : null}
      <Route component={NoMatchPage} />
    </Switch>
  );
};

export default Routes;
