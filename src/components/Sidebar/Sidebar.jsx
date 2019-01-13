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
import { NavLink } from "react-router-dom";
import { Nav, Collapse, UncontrolledTooltip } from "reactstrap";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
var ps;

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getCollapseStates(props.routes);
  }
  // this creates the intial state of this component based on the collapse routes
  // that it gets through this.props.routes
  getCollapseStates = routes => {
    let initialState = {};
    routes.map((prop, key) => {
      if (prop.collapse) {
        initialState = {
          [prop.state]: this.getCollapseInitialState(prop.views),
          ...this.getCollapseStates(prop.views),
          ...initialState
        };
      }
      return null;
    });
    return initialState;
  };
  // this verifies if any of the collapses should be default opened on a rerender of this component
  // for example, on the refresh of the page,
  // while on the src/views/forms/RegularForms.jsx - route /admin/regular-forms
  getCollapseInitialState(routes) {
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse && this.getCollapseInitialState(routes[i].views)) {
        return true;
      } else if (window.location.pathname.indexOf(routes[i].path) !== -1) {
        return true;
      }
    }
    return false;
  }
  // this function creates the links and collapses that appear in the sidebar (left menu)
  createLinks = identifier => {
    const routes = [
      {
        key: "campaigns",
        icon: "nc-icon nc-user-run"
      },
      {
        key: "sequences",
        icon: "nc-icon nc-sound-wave"
      },
      {
        key: "prospects",
        icon: "nc-icon nc-sun-fog-29",
        tooltip: "Comprehensive prospects manager coming soon.",
        disabled: true
      }
    ];
    return routes.map(({ key, icon, tooltip, disabled }, index) => {
      return (
        <li
          className={`${this.activeRoute(`/admin/${identifier}/${key}`)}${
            disabled ? " pros-btn-disabled" : ""
          }`}
          key={index}
        >
          <NavLink
            to={`/admin/${identifier}/${key}`}
            activeClassName=""
            id={`tooltip-${key}`}
          >
            <>
              <i className={icon} />
              <p>{key}</p>
            </>
          </NavLink>
          {tooltip && (
            <UncontrolledTooltip delay={700} target={`tooltip-${key}`}>
              {tooltip}
            </UncontrolledTooltip>
          )}
        </li>
      );
    });
  };
  // verifies if routeName is the one active (in browser input)
  activeRoute = routeName => {
    return this.props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };
  componentDidMount() {
    // if you are using a Windows Machine, the scrollbars will have a Mac look
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.refs.sidebar, {
        suppressScrollX: true,
        suppressScrollY: false
      });
    }
  }
  componentWillUnmount() {
    // we need to destroy the false scrollbar when we navigate
    // to a page that doesn't have this component rendered
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
    }
  }
  render() {
    const {
      history: {
        location: { pathname }
      },
      liaccounts
    } = this.props;

    const identifier = pathname.split("/")[2];

    const liaccount = liaccounts.filter(
      acc => acc.identifier === identifier
    )[0];

    return (
      <div
        className="sidebar"
        data-color="brown"
        data-active-color={this.props.activeColor}
      >
        <div className="logo">
          <div className="logo-img">
            <img src={require("assets/img/pp-logo.png")} alt="react-logo" />
          </div>
        </div>

        <div className="sidebar-wrapper" ref="sidebar">
          <div className="user">
            <div className="photo">
              <img src={liaccount && liaccount.profileImg} alt="Avatar" />
            </div>
            <div className="info">
             
              <span>{liaccount && liaccount.name}</span>
              
            </div>
          </div>
          <Nav>
            {this.createLinks(identifier)}
            <li
              className={`${this.activeRoute(`/admin/${identifier}/settings`)}`}
            >
              <NavLink to={`/admin/${identifier}/settings`} activeClassName="">
                <>
                  <i className="nc-icon nc-settings" />
                  <p>Settings</p>
                </>
              </NavLink>
            </li>
          </Nav>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.authentication.user
});

export default compose(connect(mapStateToProps, null)(Sidebar));
