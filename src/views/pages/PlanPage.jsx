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

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Container,
  Row,
  Col
} from "reactstrap";

import { userActions, planActions } from "../../actions";
const { requestRegister } = userActions;
const { requestGetPlans } = planActions;

const PlanCard = ({ plan, selectPlan }) => {
  const { amount_decimal, interval, nickname, id } = plan;
  let flat = amount_decimal;
  let unit = 0;
  let upto = 1;
  let trial = 0;
  if (!flat) {
    flat = plan.tiers[0].flat_amount_decimal;
    unit = plan.tiers[1].unit_amount_decimal;
    upto = plan.tiers[0].up_to || 0;
  }

  if (plan.trial_period_days) {
    trial = plan.trial_period_days;
  }

  return (
    <Card className="card-signup text-center">
      <CardHeader>
        <CardTitle tag="h3" className="text-primary">
          {nickname}
        </CardTitle>
        <p style={{ fontStyle: "italic" }}>{`${upto} Linkedin Profile${
          parseInt(upto) !== 1 ? "s" : ""
        }`}</p>
      </CardHeader>
      <CardBody>
        <h1 className="el-inline">{`$${flat / 100}`}</h1>
        <p className="gray-text el-inline">{`/${interval}`}</p>
        <ul>{!!unit && <li>{`$${unit / 100} per additional profile`}</li>}</ul>
      </CardBody>
      <CardFooter>
        <Button
          block
          className="btn-round"
          color="info"
          onClick={() => selectPlan(id)}
        >
          {trial ? `Start ${trial}-Day Free Trial` : `Activate plan`}
        </Button>
      </CardFooter>
    </Card>
  );
};

class Register extends React.Component {
  // static defaultProps = {
  //   plans: examplePlansPayload.data
  // };
  componentDidMount() {
    this.props.requestGetPlans();
    document.body.classList.toggle("register-page");
  }
  componentWillUnmount() {
    document.body.classList.toggle("register-page");
  }
  selectPlan = id => {
    this.props.history.push(`/auth/register/${id}`);
  };
  render() {
    const { plans } = this.props;

    return (
      <div className="register-page">
        <Container>
          <Row>
            {plans.map(plan => (
              <Col key={plan.id}>
                <PlanCard {...{ plan, selectPlan: this.selectPlan }} />
              </Col>
            ))}
          </Row>
        </Container>
        <div
          className="full-page-background"
          style={{
            backgroundImage: `url(${require("assets/img/bg/david-marcu.jpg")})`
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  plans: state.plans.plans
});

const mapDispatchToProps = dispatch => ({
  requestRegister: (email, password) =>
    dispatch(requestRegister(email, password)),
  requestGetPlans: () => dispatch(requestGetPlans())
});

export default compose(connect(mapStateToProps, mapDispatchToProps)(Register));
