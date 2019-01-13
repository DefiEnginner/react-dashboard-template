import React, { useState, useEffect } from "react";

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
  InputGroup
} from "reactstrap";
import LoadingOverlay from "react-loading-overlay";

import { validator } from "../../utils";

const AddAccountForm = props => {
  const [email, changeEmail] = useState(-1);
  const [password, changePassword] = useState(-1);
  const [error, setError] = useState("");
  const { loading } = props;

  useEffect(() => {
    setError(props.error);
  }, [props]);

  const setEmail = e => {
    changeEmail(e.target.value);
  };
  const setPassword = e => {
    changePassword(e.target.value);
  };
  const handleSubmit = e => {
    e.preventDefault();

    if (email === -1) {
      changeEmail("");
    }
    if (password === -1) {
      changePassword("");
    }

    if (
      validator.checkEmailValidation(email) ||
      validator.checkRequiredValidation(password) ||
      email === -1 ||
      password === -1
    ) {
      return;
    }

    props.requestAddAccount(email, password);
  };
  const closeModal = e => {
    e.preventDefault();
    props.closeModal();
  };

  return (
    <LoadingOverlay
      active={loading}
      spinner
      text="Adding Account. This usually takes a couple of minutes."
    >
      <Form action="" className="form" method="" onSubmit={handleSubmit}>
        <Card style={{ margin: 0 }}>
          <CardHeader>
            <CardHeader>
              <h3 className="header text-center">Add Linkedin Account</h3>
            </CardHeader>
          </CardHeader>
          <CardBody>
            {error && (
              <InputGroup>
                <Input hidden invalid />
                <FormFeedback>
                  {!error.includes("Network Error")
                    ? error
                    : `Network Error. please try again`}
                </FormFeedback>
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
                onChange={setEmail}
                onFocus={setEmail}
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
                onChange={setPassword}
                onFocus={setPassword}
                invalid={validator.checkRequiredValidation(password)}
              />
              <FormFeedback>Password Required</FormFeedback>
            </InputGroup>
            <br />
          </CardBody>
          <CardFooter>
            <h6 style={{ color: "red" }}>*Note</h6>
            <p>
              We will attempt to log in to Linkedin with the credentials you
              have provided. You may be asked to enter a verification code that
              will be sent to the email address of LI account owner. Please be
              sure you have access to this mailbox before proceeding.
            </p>
            <Button
              className="btn-round mb-3 pull-right"
              onClick={closeModal}
              style={{ marginLeft: 20 }}
            >
              Close
            </Button>
            <Button className="btn-round mb-3 pull-right" color="warning">
              Add Account
            </Button>
          </CardFooter>
        </Card>
      </Form>
    </LoadingOverlay>
  );
};

export default AddAccountForm;
