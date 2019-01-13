import React, { useState } from "react";
import { compose } from "recompose";
import { connect } from "react-redux";

// reactstrap components
import {
  Row,
  Col,
  Nav,
  NavLink,
  NavItem,
  Card,
  CardBody,
  TabPane,
  TabContent
} from "reactstrap";

import ProfileCard from "../components/ProfileCard";

import { planActions, userActions } from "../../actions";
import { useEffect } from "react";

const { requestGetUser } = userActions;
const { requestGetPlans, requestUnsubscribe, requestReactivate } = planActions;

const SequenceAddEditForm = ({
  user,
  liaccounts,
  plans,
  loadingPlan,
  loadingAuth,
  ...restProps
}) => {
  const headlines = [
    {
      key: "subscription",
      title: "Manage Subscription"
    },
    { key: "password", title: "Change Password" }
  ];

  const [type, setType] = useState("subscription");

  useEffect(() => {
    if (!plans.length && user) {
      restProps.requestGetPlans();
    }
  }, []);

  return (
    <div className="content campaignlist">
      <Col md="12" xl="9" className="ml-auto mr-auto">
        <h4 className="el-inline">Profile Manager</h4>
        <Card className="campaign-builder-card">
          <CardBody>
            <Row>
              <Col lg="4" md="5" sm="4" xs="6">
                <div className="nav-tabs-navigation verical-navs">
                  <div className="nav-tabs-wrapper">
                    <Nav
                      className="flex-column nav-stacked"
                      role="tablist"
                      tabs
                    >
                      {headlines.map(({ key, title }) => (
                        <NavItem key={key}>
                          <NavLink
                            data-toggle="tab"
                            href="#"
                            role="tab"
                            className={type === key ? "active" : ""}
                            onClick={() => setType(key)}
                          >
                            {title}
                          </NavLink>
                        </NavItem>
                      ))}
                    </Nav>
                  </div>
                </div>
              </Col>
              <Col lg="8" md="7" sm="8" xs="6">
                <TabContent activeTab={type}>
                  {headlines.map(({ key }) => (
                    <TabPane tabId={key} key={key}>
                      <ProfileCard
                        key={key}
                        type={key}
                        userData={user}
                        seats={liaccounts.length}
                        plans={plans}
                        loadingPlan={loadingPlan}
                        loadingAuth={loadingAuth}
                        unsubscribe={restProps.requestUnsubscribe}
                        reactivate={restProps.requestReactivate}
                      />
                    </TabPane>
                  ))}
                </TabContent>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </div>
  );
};

const mapStateToProps = state => ({
  liaccounts: state.liaccounts.liaccounts,
  plans: state.plans.plans,
  user: state.authentication.user,
  loadingPlan: state.plans.loading,
  loadingAuth: state.authentication.loading
});

const mapDispatchToProps = dispatch => ({
  requestGetPlans: () => dispatch(requestGetPlans()),
  requestUnsubscribe: () => dispatch(requestUnsubscribe()),
  requestReactivate: () => dispatch(requestReactivate()),
  requestGetUser: () => dispatch(requestGetUser())
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps)(SequenceAddEditForm)
);
