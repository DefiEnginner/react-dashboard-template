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
import { withRouter } from "react-router-dom";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Form,
  Container,
  Row,
  Col
} from "reactstrap";

import { userActions } from "../../actions";
const { requestVerify } = userActions;

class Verify extends React.Component {
  componentDidMount() {
    if (!this.props.verifyToken) {
      this.props.history.push("/auth/login");
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
  handleSubmit = e => {
    e.preventDefault();
    this.props.requestVerify(this.props.verifyToken);
  };
  render() {
    return (
      <div className="register-page">
        <Container>
          <Row>
            <Col lg="2" md="0" />
            <Col lg="8" md="12">
              <Form
                action=""
                className="form"
                method=""
                onSubmit={this.handleSubmit}
              >
                <Card className="card-signup text-center">
                  <CardHeader>
                    <CardTitle tag="h2">Verify your email address.</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <p>
                      Please check your inbox for the verfication email.
                      <br />
                      If you didn't received the email, you may need to check
                      your spam folder or resend the email.
                    </p>
                  </CardBody>
                  <CardFooter>
                    <Button
                      className="btn-round"
                      color="info"
                      onClick={() => window.alert("Email was resent")}
                    >
                      Resend Email
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
  verifyToken: state.authentication.verifyToken
});

const mapDispatchToProps = dispatch => ({
  requestVerify: verifyToken => dispatch(requestVerify(verifyToken))
});

export default withRouter(
  compose(connect(mapStateToProps, mapDispatchToProps)(Verify))
);
