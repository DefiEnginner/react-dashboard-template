/*!

=========================================================
* Paper Dashboard PRO React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-pro-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "recompose";

import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import configureStore, { history } from "./store";

import AuthLayout from "layouts/Auth.jsx";
import AdminLayout from "layouts/Admin.jsx";

import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/paper-dashboard.scss?v=1.1.0";
import "assets/demo/demo.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";

import { userActions } from "actions";
const { requestGetUser } = userActions;

const store = configureStore();

const App = props => {
  useEffect(() => {
    const checkSignIn = () => {
      const { token, history, location } = props;
      const mainRouter = location.pathname.split("/")[1];
      if (token) {
        if (!props.user) {
          props.requestGetUser();
        }
        if (mainRouter === "auth") {
          history.push("/admin");
        }
      } else if (mainRouter === "admin") {
        history.push("/auth/login");
      }
    };

    checkSignIn();
  });

  return (
    <Switch>
      <Route path="/auth" render={props => <AuthLayout {...props} />} />
      <Route path="/admin" render={props => <AdminLayout {...props} />} />
      <Redirect to="/admin" />
    </Switch>
  );
};

const mapStateToProps = state => ({
  token: state.authentication.token,
  user: state.authentication.user
});

const mapDispatchToProps = dispatch => ({
  requestGetUser: () => dispatch(requestGetUser())
});

const AppWithStore = withRouter(
  compose(connect(mapStateToProps, mapDispatchToProps)(App))
);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <AppWithStore />
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root")
);
