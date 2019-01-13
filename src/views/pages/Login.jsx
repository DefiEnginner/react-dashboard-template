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
  Form,
  FormFeedback,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Col,
  Row
} from "reactstrap";

import { validator } from "../../utils";
import { userActions } from "../../actions";
const { requestLogin } = userActions;

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: -1,
      password: -1,
      error: ""
    };
  }
  componentDidMount() {
    document.body.classList.toggle("login-page");
  }
  componentWillUnmount() {
    document.body.classList.toggle("login-page");
  }
  componentDidUpdate(prevProps) {
    if (this.props.error && this.props.error !== prevProps.error) {
      this.setState({ error: this.props.error });
    }
  }
  handleSubmit = e => {
    e.preventDefault();
    const { email, password } = this.state;
    if (email === -1) {
      this.setState({ email: "" });
    }
    if (password === -1) {
      this.setState({ password: "" });
    }

    if (
      validator.checkEmailValidation(email) ||
      validator.checkRequiredValidation(password) ||
      email === -1 ||
      password === -1
    ) {
      return;
    }

    this.props.requestLogin(email, password);
  };
  setEmail = e => {
    this.setState({ email: e.target.value });
  };
  setPassword = e => {
    this.setState({ password: e.target.value });
  };
  render() {
    const { email, error, password } = this.state;
    return (
      <div className="login-page">
        <Container>
          <Row>
            <Col className="ml-auto mr-auto" lg="4" md="6">
              <Form
                action=""
                className="form"
                method=""
                onSubmit={this.handleSubmit}
              >
                <Card className="card-login">
                  <CardHeader>
                    <CardHeader>
                      <h3 className="header text-center">Login</h3>
                    </CardHeader>
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
                          <i className="nc-icon nc-single-02" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Email"
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
                        invalid={validator.checkRequiredValidation(password)}
                      />
                      <FormFeedback>Password Required</FormFeedback>
                    </InputGroup>
                  </CardBody>
                  <CardFooter>
                    <Button block className="btn-round mb-3" color="warning">
                      Login
                    </Button>
                  </CardFooter>
                </Card>
              </Form>
            </Col>
          </Row>
        </Container>
        <div
          className="full-page-background"
          style={{
            backgroundImage: `url(${require("assets/img/bg/joshua-earles.jpg")})`
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  error: state.authentication.error,
  loading: state.authentication.loading
});

const mapDispatchToProps = dispatch => ({
  requestLogin: (email, password) => dispatch(requestLogin(email, password))
});

export default compose(connect(mapStateToProps, mapDispatchToProps)(Login));
