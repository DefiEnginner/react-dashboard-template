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
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Label,
  FormGroup,
  FormFeedback,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col
} from "reactstrap";
import LoadingOverlay from "react-loading-overlay";

import { StripeProvider } from "react-stripe-elements";

import CheckoutForm from "../../stripe/CheckoutForm";
import { validator } from "../../utils";
import { userActions, planActions } from "../../actions";
const { requestRegister } = userActions;
const { requestGetPlans } = planActions;

// const stripePublicKey = "pk_test_oKxYhNLOXOwl9jw6OP0jxlEi00yjla5bTb";
const stripePublicKey = "pk_test_spJkXGwiH4nEiC8AANbhMMWW00yCKdKlWV";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: -1,
      password: -1,
      agree: true,
      error: ""
    };
  }
  componentDidMount() {
    if (!this.props.plans.length) {
      this.props.requestGetPlans();
    }
    document.body.classList.toggle("register-page");
  }
  componentWillUnmount() {
    document.body.classList.toggle("register-page");
  }
  componentDidUpdate(prevProps) {
    if (this.props.error && this.props.error !== prevProps.error) {
      this.setState({ error: this.props.error });
    }
  }
  createSubscription = token => {
    const {
      match: {
        params: { planId }
      }
    } = this.props;

    const { email, password } = this.state;
    this.props.requestRegister(email, password, token, planId);
  };
  setEmail = e => {
    this.setState({ email: e.target.value });
  };
  setPassword = e => {
    this.setState({ password: e.target.value });
  };
  toggleAgree = () => {
    this.setState({ agree: !this.state.agree });
  };
  render() {
    const {
      match: {
        params: { planId }
      },
      plans,
      loading
    } = this.props;
    const { email, password, error, agree } = this.state;

    return (
      <LoadingOverlay active={loading} spinner text="Registering Account ...">
        <div className="register-page">
          <Container>
            <Row>
              <Col className="mr-auto ml-auto" lg="4" md="6">
                <div action="" className="form" method="">
                  <Card className="card-signup text-center">
                    <CardHeader>
                      <CardTitle tag="h4">Register</CardTitle>
                      {/*<div className="social">
                      <Button className="btn-icon btn-round" color="twitter">
                        <i className="fa fa-twitter" />
                      </Button>
                      <Button className="btn-icon btn-round" color="facebook">
                        <i className="fa fa-facebook-f" />
                      </Button>
                      <p className="card-description">or be classical</p>
                    </div>*/}
                    </CardHeader>
                    <CardBody>
                      {error && (
                        <InputGroup>
                          <Input hidden invalid />
                          <FormFeedback>{error}</FormFeedback>
                        </InputGroup>
                      )}
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="nc-icon nc-email-85" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder="Email..."
                          type="email"
                          invalid={validator.checkEmailValidation(email)}
                          onChange={this.setEmail}
                          onFocus={this.setEmail}
                        />
                        <FormFeedback>
                          {email === "" ? `Email required` : `Invalid Email`}
                        </FormFeedback>
                      </InputGroup>
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="nc-icon nc-key-25" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder="Password"
                          type="password"
                          autoComplete="off"
                          onChange={this.setPassword}
                          onFocus={this.setPassword}
                          invalid={
                            validator.checkRequiredValidation(password) ||
                            validator.checkPasswordValidation(password)
                          }
                        />
                        <FormFeedback>
                          {password === ""
                            ? `Password required`
                            : `Needs to be at least 5 letters`}
                        </FormFeedback>
                      </InputGroup>
                      <FormGroup check className="text-left">
                        <Label check>
                          <Input
                            checked={agree}
                            type="checkbox"
                            onChange={this.toggleAgree}
                          />
                          <span className="form-check-sign" />I agree to the{" "}
                          <a
                            href="https://perfectprospect.io/terms.html"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            terms and conditions
                          </a>
                          .
                        </Label>
                      </FormGroup>
                      <InputGroup>
                        <Input hidden invalid={!agree} />
                        <FormFeedback>Please check the box</FormFeedback>
                      </InputGroup>
                      <StripeProvider apiKey={stripePublicKey}>
                        <CheckoutForm
                          createSubscription={this.createSubscription}
                          email={email}
                          password={password}
                          agree={agree}
                          plan={
                            plans
                              ? plans.filter(plan => plan.id === planId)[0]
                              : undefined
                          }
                          setEmail={email => this.setState({ email })}
                          setPassword={password => this.setState({ password })}
                        />
                      </StripeProvider>
                    </CardBody>
                  </Card>
                </div>
              </Col>
            </Row>
          </Container>
          <div
            className="full-page-background"
            style={{
              backgroundImage: `url(${require("assets/img/bg/david-marcu.jpg")})`
            }}
          />
        </div>
      </LoadingOverlay>
    );
  }
}

const mapStateToProps = state => ({
  plans: state.plans.plans,
  error: state.authentication.error,
  loading: state.authentication.loading
});

const mapDispatchToProps = dispatch => ({
  requestRegister: (email, password, token, planID) =>
    dispatch(requestRegister(email, password, token, planID)),
  requestGetPlans: () => dispatch(requestGetPlans())
});

export default compose(connect(mapStateToProps, mapDispatchToProps)(Register));
