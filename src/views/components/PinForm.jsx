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
  const [pin, changePin] = useState(-1);
  const [error, setError] = useState("");
  const { loading } = props;

  useEffect(() => {
    const { error } = props;
    if (error && !error.includes("manual check")) {
      setError(error);
    }
  }, [props]);

  const setPin = e => {
    changePin(e.target.value);
  };
  const handleSubmit = e => {
    e.preventDefault();
    if (pin === -1) {
      changePin("");
    }

    if (validator.checkRequiredValidation(pin) || pin === -1) {
      return;
    }

    props.requestSendPIN(pin);
  };

  return (
    <LoadingOverlay active={loading} spinner text="Adding Account">
      <Form action="" className="form" method="" onSubmit={handleSubmit}>
        <Card style={{ margin: 0 }}>
          <CardHeader>
            <CardHeader>
              <h3 className="header text-center">Manual Check Required</h3>
              <p className="text-center">
                Please check the email account used for this LinkedIn account and enter the pin sent from LinkedIn.
              </p>
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
                  <i className="nc-icon nc-key-25" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                placeholder="PIN"
                type="number"
                autoComplete="off"
                onChange={setPin}
                onFocus={setPin}
                invalid={validator.checkRequiredValidation(pin)}
              />
              <FormFeedback>PIN Required</FormFeedback>
            </InputGroup>
            <br />
          </CardBody>
          <CardFooter>
            <Button className="btn-round mb-3 pull-right" color="warning">
              Submit PIN
            </Button>
          </CardFooter>
        </Card>
      </Form>
    </LoadingOverlay>
  );
};

export default AddAccountForm;
