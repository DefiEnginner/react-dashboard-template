import React from "react";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  UncontrolledAlert,
  FormFeedback,
  InputGroup,
  Row,
  UncontrolledTooltip,
  Col
} from "reactstrap";

// react plugin used to create switch buttons
import Switch from "react-bootstrap-switch";
import { validator } from "utils";

const SequenceCard = ({
  sequence,
  cardRef,
  toggleSequence,
  setMessage,
  toggleStopPrevDetected,
  changeTimeoutNumber,
  changeTimeoutUnit,
  indexOn,
  draggable,
  controllable,
  ...restProps
}) => {
  const {
    name,
    timeoutNumber,
    timeoutUnit,
    msg,
    stopPrevDetected,
    toggle
  } = sequence;

  return (
    <Row>
      <Col xs={11} className="sequence-builder">
        <div className={controllable ? "" : "cover"} />
        <Card {...restProps} innerRef={cardRef} key={name}>
          <CardHeader>
            <h5 className="pull-left" style={{ margin: 0 }}>
              {name.toUpperCase()}
            </h5>
            <div className="pull-right">
              <Switch
                offColor="primary"
                onColor="primary"
                value={toggle}
                onChange={toggleSequence}
                disabled={!draggable}
              />
            </div>
          </CardHeader>
          <CardBody>
            {toggle && (
              <>
                {name === "CONNECT" && (
                  <>
                    <Card style={{ boxShadow: "none" }}>
                      <p>Connection Message (optional)</p>
                      <InputGroup>
                        <Input
                          type="textarea"
                          maxLength="275"
                          defaultValue={msg !== -1 ? msg : ""}
                          onChange={e => setMessage(e.target.value)}
                          onClick={e => setMessage(e.target.value)}
                          placeholder="Hi {firstName}, I'd like to add you to my network."
                          invalid={
                            validator.checkSequenceMessageValidation(msg) ||
                            msg.length > 275
                          }
                        />
                        <FormFeedback>
                          {msg.length > 275
                            ? "Message length limit reached"
                            : "Your firstName syntax is wrong. You must input {firstName}"}
                        </FormFeedback>
                      </InputGroup>
                      <small className="text-muted el-inline">
                        <span>{`${275 -
                          (msg === -1
                            ? 0
                            : msg.length)} characters remaining.`}</span>
                        &nbsp;
                        <i
                          className="nc-icon nc-alert-circle-i text-muted el-inline"
                          id="tooltip-max"
                        ></i>
                      </small>

                      <UncontrolledTooltip
                        placement="bottom"
                        delay={0}
                        target="tooltip-max"
                      >
                        Using the {"{firstName}"} variable may increase the
                        character count beyond LI's 299 char limit. Consider
                        avoiding long connection messages.
                      </UncontrolledTooltip>
                    </Card>

                    <UncontrolledAlert className="alert-info" fade={false}>
                      <span>
                        <b>Available variables: </b>
                        {"{firstName}"}
                      </span>
                    </UncontrolledAlert>
                  </>
                )}
                {name === "MESSAGE" && (
                  <Card style={{ boxShadow: "none" }}>
                    <p>Followup Message</p>
                    <InputGroup>
                      <Input
                        type="textarea"
                        defaultValue={msg !== -1 ? msg : ""}
                        onChange={e => setMessage(e.target.value)}
                        onClick={e => setMessage(e.target.value)}
                        placeholder="Hi {firstName}, thanks for connecting. It would be great to compare notes with you and share my expertise. When are you available for a quick chat?"
                        invalid={
                          validator.checkRequiredValidation(msg) ||
                          validator.checkSequenceMessageValidation(msg)
                        }
                      />
                      <FormFeedback>
                        {validator.checkRequiredValidation(msg)
                          ? "Message is Required"
                          : "Your firstName syntax is wrong. You must input {firstName}"}
                      </FormFeedback>
                    </InputGroup>
                    <p className="descriptor">
                      The message will be scheduled for sending after we detect
                      that the invitation has been accepted.
                    </p>
                    <Switch
                      offColor="primary"
                      onColor="primary"
                      value={stopPrevDetected}
                      onChange={toggleStopPrevDetected}
                    />{" "}
                    &nbsp; Skip this step if the recipient messages you first
                  </Card>
                )}
                {indexOn > 1 && (
                  <Card style={{ boxShadow: "none", marginTop: 20 }}>
                    <Row>
                      <p
                        style={{
                          display: "inline-block",
                          marginLeft: 20,
                          marginTop: 5
                        }}
                      >
                        Perform
                      </p>
                      <Col>
                        <Input
                          type="number"
                          value={timeoutNumber}
                          onChange={e => changeTimeoutNumber(e.target.value)}
                          min={1}
                        ></Input>
                      </Col>
                      <Col>
                        <Input
                          type="select"
                          value={timeoutUnit}
                          onChange={e => changeTimeoutUnit(e.target.value)}
                          style={{ height: 32 }}
                        >
                          <option value="minutes">minutes</option>
                          <option value="hours">hours</option>
                          <option value="days">days</option>
                        </Input>
                      </Col>
                      <p
                        style={{
                          display: "inline-block",
                          marginRight: 20,
                          marginTop: 5
                        }}
                      >
                        after previous step
                      </p>
                      <p className="descriptor" style={{ paddingLeft: 20 }}>
                        Action will be performed the next available day if time
                        falls outside of the working hours specified in
                        settings.
                      </p>
                    </Row>
                  </Card>
                )}
              </>
            )}
          </CardBody>
        </Card>
      </Col>
      {indexOn > 0 && toggle && <h1>{indexOn}</h1>}
    </Row>
  );
};

export default SequenceCard;
