import React, { useState } from "react";
import {
  Elements,
  injectStripe,
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement
} from "react-stripe-elements";
import { Button, Alert, InputGroup, Input, FormFeedback } from "reactstrap";

import { validator } from "../utils";

const _CardForm = ({
  createSubscription,
  stripe,
  setEmail,
  setPassword,
  email,
  password,
  agree,
  plan
}) => {
  const [err, setErr] = useState("");

  const doCheckout = e => {
    e.preventDefault();

    if (email === -1) {
      setEmail("");
      return;
    }
    if (password === -1) {
      setPassword("");
      return;
    }
    if (!agree) {
      return;
    }

    if (
      validator.checkEmailValidation(email) ||
      validator.checkRequiredValidation(password) ||
      validator.checkPasswordValidation(password) ||
      email === -1 ||
      password === -1
    ) {
      return;
    }

    /**
     * Temporarily hide the stripe elements
     */
    stripe.createToken().then(({ error, token }) => {
      if (!error && token) {
        setErr("");
        createSubscription(token);
      } else {
        setErr(error.message);
      }
    });
  };
  return (
    <form onSubmit={doCheckout}>
      {/**
       * Temporarily hide the stripe elements
       */}
      <InputGroup>
        <Input hidden invalid={!!err} />
        <FormFeedback>{err}</FormFeedback>
      </InputGroup>
      <CardNumberElement />
      <CardExpiryElement />
      <CardCVCElement />
      <Alert color="info">
        {plan && plan.trial_period_days ? (
          <span>
            The first {plan.trial_period_days} days are
            free. We will only bill you after we have demonstrated how sweet it is to be our customer.
          </span>
        ) : (
          <span>
             By clicking ACTIVATE button, you agree to pay base fee of $499 per month until canceled. You will be able to cancel at any time.
          </span>
        )}
      </Alert>
      <Button block className="btn-round" color="success">
        {plan && plan.trial_period_days ? "Start Free Trial" : "Activate"}
      </Button>
    </form>
  );
};

const CardForm = injectStripe(_CardForm);

function Checkout({
  createSubscription,
  email,
  password,
  setEmail,
  setPassword,
  agree,
  plan
}) {
  return (
    <div className="Checkout">
      <Elements>
        <CardForm
          {...{
            createSubscription,
            email,
            password,
            setEmail,
            setPassword,
            agree,
            plan
          }}
        />
      </Elements>
    </div>
  );
}

export default Checkout;
