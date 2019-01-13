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
import React from "react";
import { compose } from "recompose";
import { connect } from "react-redux";

// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import { Route, Switch } from "react-router-dom";

import AdminNavbar from "components/Navbars/AdminNavbar.jsx";
import Footer from "components/Footer/Footer.jsx";
import Sidebar from "components/Sidebar/Sidebar.jsx";

import routes from "routes.js";

import { userActions, liaccountActions } from "../actions";
import { setFetchTimer } from "actions/liaccountActions";
const { logout, requestGetUser } = userActions;
const { requestGetAccounts } = liaccountActions;

var ps;

class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: "black",
      activeColor: "info",
      sidebarMini: false
    };

    if (props.token && !props.user) {
      props.requestGetUser();
    }

    if (props.token) {
      props.requestGetAccounts();
    }
  }
  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1 && this.props.token) {
      document.documentElement.className += " perfect-scrollbar-on";
      document.documentElement.classList.remove("perfect-scrollbar-off");
      ps = new PerfectScrollbar(this.refs.mainPanel);
    }

    setFetchTimer(null);
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
      document.documentElement.className += " perfect-scrolbar-off";
      document.documentElement.classList.remove("perfect-scrollbar-on");
    }
  }
  componentDidUpdate(e) {
    if (e.history.action === "PUSH" && this.props.token) {
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
      this.refs.mainPanel.scrollTop = 0;
    }
  }
  getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return this.getRoutes(prop.views);
      }
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={() => React.createElement(prop.component)}
            key={key}
            exact={prop.isExact}
          />
        );
      } else {
        return null;
      }
    });
  };
  handleActiveClick = color => {
    this.setState({ activeColor: color });
  };
  handleBgClick = color => {
    this.setState({ backgroundColor: color });
  };
  handleMiniClick = () => {
    // if (document.body.classList.contains("sidebar-mini")) {
    //   this.setState({ sidebarMini: false });
    // } else {
    //   this.setState({ sidebarMini: true });
    // }
    document.body.classList.toggle("sidebar-mini");
  };
  render() {
    const {
      token,
      history: {
        location: { pathname }
      },
      liaccounts
    } = this.props;

    const account = pathname.split("/")[2];

    return token ? (
      <div className="wrapper">
        {account && account !== "user-profile" && (
          <Sidebar
            {...this.props}
            routes={routes}
            liaccounts={liaccounts}
            bgColor={this.state.backgroundColor}
            activeColor={this.state.activeColor}
          />
        )}
        <div
          className="main-panel"
          ref="mainPanel"
          style={{
            width: account && account !== "user-profile" ? undefined : "100%"
          }}
        >
          <AdminNavbar
            {...this.props}
            handleMiniClick={this.handleMiniClick}
            logout={() => {
              this.props.logout();
              window.location.reload();
            }}
          />
          <Switch>{this.getRoutes(routes)}</Switch>
          {// we don't want the Footer to be rendered on full screen maps page
          this.props.location.pathname.indexOf("full-screen-map") !==
          -1 ? null : (
            <Footer fluid />
          )}
        </div>
        {/* <FixedPlugin
          bgColor={this.state.backgroundColor}
          activeColor={this.state.activeColor}
          sidebarMini={this.state.sidebarMini}
          handleActiveClick={this.handleActiveClick}
          handleBgClick={this.handleBgClick}
          handleMiniClick={this.handleMiniClick}
        /> */}
      </div>
    ) : null;
  }
}

const mapStateToProps = state => ({
  token: state.authentication.token,
  user: state.authentication.user,
  liaccounts: state.liaccounts.liaccounts
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
  requestGetUser: () => dispatch(requestGetUser()),
  requestGetAccounts: () => dispatch(requestGetAccounts()),
  setFetchTimer: timer => dispatch(setFetchTimer(timer))
});

export default compose(connect(mapStateToProps, mapDispatchToProps)(Admin));
