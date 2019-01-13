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
  Col,
  Row,
  FormGroup,
  Label,
  InputGroup
} from "reactstrap";
import LoadingOverlay from "react-loading-overlay";

const UpgradeForm = props => {
  const [error, setError] = useState("");
  const { loading, subscriptionData } = props;
  const [upToPro, setUpToPro] = useState(false);
  const [upToAgency, setUpToAgency] = useState(false);
  const [activate, setActivate] = useState(false);

  useEffect(() => {
    setError(props.error);
  }, [props]);

  const toggleUpToPro = () => {
    if (!upToPro) {
      setUpToAgency(false);
    }
    setUpToPro(!upToPro);
  };
  const toggleUpToAgency = () => {
    if (!upToAgency) {
      setUpToPro(false);
    }
    setUpToAgency(!upToAgency);
  };
  const handleSubmit = e => {
    e.preventDefault();
    if (upToPro) {
      if (activate) {
        props.requestActivatePlan("PROFESSIONAL_PLAN");
      } else {
        props.requestUpgradePlan("PROFESSIONAL_PLAN");
      }
    } else if (upToAgency) {
      if (activate) {
        props.requestActivatePlan("AGENCY_PLAN");
      } else {
        props.requestUpgradePlan("AGENCY_PLAN");
      }
    } else {
      props.requestActivatePlan();
    }
  };
  const closeModal = e => {
    e.preventDefault();
    props.closeModal();
  };

  return (
    <LoadingOverlay
      active={loading}
      spinner
      text="Activating/Upgrading plan ..."
    >
      <Form action="" className="form" method="" onSubmit={handleSubmit}>
        <Card style={{ margin: 0 }}>
          <CardHeader>
            <CardHeader>
              <h3 className="header text-center">Plan limit reached</h3>
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
            <p>
              {subscriptionData.status === "trialing" &&
                "You are in trial period. You need to activate plan in order to add more accounts."}
              <br />
              {subscriptionData._doc.planID === "PERSONAL_PLAN" &&
                "You are using personal plan. You need to upgrade your plan in order to add more accounts."}
            </p>
            <Row>
              {subscriptionData.status === "trialing" && (
                <Col>
                  <FormGroup check className="text-left">
                    <Label check>
                      <Input
                        checked={activate}
                        type="checkbox"
                        onChange={() => setActivate(!activate)}
                      />
                      <span className="form-check-sign" />
                      <p style={{ fontWeight: "bold" }}>Activate Plan</p>
                    </Label>
                  </FormGroup>
                </Col>
              )}
              {subscriptionData._doc.planID === "PERSONAL_PLAN" && (
                <Col>
                  <h6>Upgrade Plan To:</h6>
                  <CardBody className="card-plain">
                    <FormGroup check className="text-left">
                      <Label check>
                        <Input
                          checked={upToPro}
                          type="checkbox"
                          onChange={toggleUpToPro}
                        />
                        <span className="form-check-sign" />
                        Professional Plan
                      </Label>
                    </FormGroup>
                    <FormGroup check className="text-left">
                      <Label check>
                        <Input
                          checked={upToAgency}
                          type="checkbox"
                          onChange={toggleUpToAgency}
                        />
                        <span className="form-check-sign" />
                        Agency Plan
                      </Label>
                    </FormGroup>
                  </CardBody>
                </Col>
              )}
            </Row>
          </CardBody>
          <CardFooter>
            <Button
              className="btn-round mb-3 pull-right"
              onClick={closeModal}
              style={{ marginLeft: 20 }}
            >
              Close
            </Button>
            <Button
              className="btn-round mb-3 pull-right"
              color="warning"
              disabled={
                (subscriptionData.status === "trialing" && !activate) ||
                (subscriptionData._doc.planID === "PERSONAL_PLAN" &&
                  !upToPro &&
                  !upToAgency)
              }
            >
              Upgrade/Activate plan
            </Button>
          </CardFooter>
        </Card>
      </Form>
    </LoadingOverlay>
  );
};

export default UpgradeForm;
