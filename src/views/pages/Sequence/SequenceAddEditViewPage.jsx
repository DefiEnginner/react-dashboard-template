import React, { useState } from "react";
import { compose } from "recompose";
import { connect } from "react-redux";
import LoadingOverlay from "react-loading-overlay";

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
// drag and drop with react-beautiful-dnd
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// reactstrap components
import {
  Button,
  Alert,
  Row,
  Col,
  Input,
  Form,
  FormFeedback,
  InputGroup
} from "reactstrap";

import SequenceCard from "../../components/sequences/SequenceCard";

import { sequenceActions } from "../../../actions";
// form validator
import { validator } from "../../../utils";
import { useEffect } from "react";

const { requestUpdateSequence } = sequenceActions;

const SequenceAddEditForm = ({
  sequences,
  error,
  loading,
  requestUpdateSequence,
  liaccounts,
  ...restProps
}) => {
  const { identifier } = restProps.match.params;
  const sequence = sequences.filter(seq => seq.identifier === identifier)[0];
  const [steps, setSteps] = useState([
    {
      name: "VISIT",
      toggle: false,
      timeoutNumber: 0,
      timeoutUnit: "minutes"
    },
    {
      name: "FOLLOW",
      toggle: false,
      timeoutNumber: 1,
      timeoutUnit: "minutes"
    },
    {
      name: "CONNECT",
      toggle: false,
      timeoutNumber: 1,
      timeoutUnit: "minutes",
      msg: ""
    },
    {
      name: "MESSAGE",
      toggle: false,
      timeoutNumber: 1,
      timeoutUnit: "minutes",
      msg: -1,
      stopPrevDetected: true
    }
  ]);
  const [name, setName] = useState(-1);
  const [formError, setFormError] = useState("");

  const mode = identifier.slice(0, 4);
  const seqId = identifier.slice(5);

  useEffect(() => {
    const seqId = identifier.slice(5);

    const sequence = sequences.filter(seq => seq.identifier === seqId)[0];
    if (sequence) {
      setSteps(sequence.sequences);
      setName(sequence.name);
    }
  }, [sequences, identifier]);

  const changeName = e => {
    setName(e.target.value);
  };

  const onDragEnd = result => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const newSteps = steps.slice(0);
    newSteps.splice(
      result.destination.index,
      0,
      newSteps.splice(result.source.index, 1)[0]
    );
    setSteps(newSteps);
  };

  const toggleSequence = index => {
    const newSteps = steps.slice(0);
    newSteps[index].toggle = !newSteps[index].toggle;
    setSteps(newSteps);
  };

  const changeTimeoutNumber = index => number => {
    const newSteps = steps.slice(0);
    newSteps[index].timeoutNumber = number.replace(/\+/gi, "");
    setSteps(newSteps);
  };

  const changeTimeoutUnit = index => unit => {
    const newSteps = steps.slice(0);
    newSteps[index].timeoutUnit = unit;
    setSteps(newSteps);
  };

  const setMessage = index => message => {
    const newSteps = steps.slice(0);
    if (newSteps[index].name === "connect" && message.length > 275) {
      return;
    }
    newSteps[index].msg = message;
    setSteps(newSteps);
  };

  const toggleStopPrevDetected = index => {
    const newSteps = steps.slice(0);
    newSteps[index].stopPrevDetected = !newSteps[index].stopPrevDetected;
    setSteps(newSteps);
  };

  const convertToSeconds = (number, unit) => {
    switch (unit) {
      case "minutes":
        return number * 60;
      case "hours":
        return number * 3600;
      case "days":
        return number * 3600 * 24;
      default:
        return number * 3600 * 24;
    }
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (name === -1) {
      setName("");
      setFormError("Please enter the sequence name.");
      return;
    }
    if (validator.checkRequiredValidation(name)) {
      setFormError("Please enter the sequence name.");
      return;
    }
    if (steps.reduce((sum, step) => (sum += step.toggle ? 1 : 0), 0) === 0) {
      setFormError("You need to add at least one step.");
      return;
    }

    if (sequences.findIndex(seq => seq.name === name.trim()) !== -1) {
      setFormError("Sequence name is duplicated. Please use another name.");
      return;
    }

    const msgIndex = steps.findIndex(step => step.name === "MESSAGE");
    const msgStep = steps[msgIndex];
    if (msgStep.toggle) {
      if (msgStep.msg === -1) {
        setMessage(msgIndex)("");
      }
      if (validator.checkRequiredValidation(msgStep.msg)) {
        setFormError("Please enter the message for the MESSAGE step.");
        return;
      }
    }

    for (let step of steps) {
      if (validator.checkSequenceMessageValidation(step.msg)) {
        setFormError(
          "Your firstName syntax is wrong. You must input {firstName}"
        );
        return;
      }
    }

    setFormError("");

    const { account } = restProps.match.params;
    const liEmail = liaccounts.filter(liacc => liacc.identifier === account)[0]
      .email;

    const tobkdSteps = steps
      .map(
        ({ name, msg, stopPrevDetected, timeoutNumber, timeoutUnit, toggle }) =>
          toggle
            ? {
                name: name.toUpperCase(),
                msg,
                option: stopPrevDetected,
                timeout: convertToSeconds(timeoutNumber, timeoutUnit)
              }
            : null
      )
      .filter(Boolean)
      .map((seq, index) => ({ ...seq, timeout: index > 0 ? seq.timeout : 0 }));

    requestUpdateSequence(
      {
        steps: tobkdSteps,
        name: name.trim(),
        _id: sequence ? sequence._id : undefined,
        liEmail
      },
      account
    );
  };

  // const goBack = e => {
  //   e.preventDefault();
  //   const { account } = restProps.match.params;
  //   restProps.history.push(`/admin/${account}/sequences`);
  // };

  const activeSteps = steps.filter(step => step.toggle);

  return (
    <div className="content sequencelist">
      <LoadingOverlay
        active={loading}
        spinner
        text="Loading Sequence"
      ></LoadingOverlay>
      <Form className="form" method="" onSubmit={handleSubmit}>
        <Row>
          <Col md="9" xs="12">
            <Col xs="12" xl="12" className="ml-auto mr-auto">
              <h4>Sequence Builder</h4>
              <InputGroup className="sequence-name-field">
                <Input
                  disabled={
                    sequences.findIndex(seq => seq.identifier === seqId) !== -1
                  }
                  defaultValue={name !== -1 ? name : ""}
                  className="fade-in"
                  invalid={validator.checkRequiredValidation(name)}
                  onChange={changeName}
                  placeholder="Enter sequence name"
                ></Input>
                <FormFeedback>
                  <span>Sequence name is required</span>
                </FormFeedback>
              </InputGroup>
              <p>
                <i className="fa fa-arrows" aria-hidden="true"></i> Drag and
                drop to build your sequence.
              </p>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="dropstep">
                  {provided => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {steps.map((step, index) => (
                        <Draggable
                          key={step.name}
                          draggableId={step.name}
                          index={index}
                          isDragDisabled={mode !== "new"}
                        >
                          {provided => (
                            <SequenceCard
                              sequence={step}
                              cardRef={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                ...provided.draggableProps.style,
                                padding: 10
                              }}
                              toggleSequence={() => toggleSequence(index)}
                              changeTimeoutNumber={changeTimeoutNumber(index)}
                              changeTimeoutUnit={changeTimeoutUnit(index)}
                              setMessage={setMessage(index)}
                              toggleStopPrevDetected={() =>
                                toggleStopPrevDetected(index)
                              }
                              indexOn={steps
                                .slice(0, index + 1)
                                .reduce(
                                  (sum, step) => (sum += step.toggle ? 1 : 0),
                                  0
                                )}
                              draggable={mode === "new"}
                              controllable={mode !== "view"}
                            />
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                <p>Summary of sequence order:</p>
              </DragDropContext>
              <Col xs={11}>
                <Row>
                  {activeSteps.map((step, index) => (
                    <div className="el-inline" key={step.name}>
                      <h5
                        className="el-inline"
                        style={{ textTransform: "uppercase" }}
                      >
                        {step.name}
                      </h5>
                      {index < activeSteps.length - 1 && (
                        <h5
                          className="el-inline"
                          style={{ marginLeft: 10, marginRight: 10 }}
                          color="primary"
                        >
                          >
                        </h5>
                      )}
                    </div>
                  ))}
                </Row>
                <Row>
                  {formError && (
                    <InputGroup>
                      <Input hidden invalid />
                      <FormFeedback>
                        <Alert color="danger" fade={true}>
                          <span>{formError}</span>
                        </Alert>
                      </FormFeedback>
                    </InputGroup>
                  )}
                </Row>
                <Row className="pull-right">
                  <div>
                    {/*<Button onClick={goBack}>
                      <i className="nc-icon nc-minimal-left"></i>Back
                    </Button>*/}
                    {mode !== "view" && mode !== "edit" && (
                      <Button color="primary">Save</Button>
                    )}
                  </div>
                </Row>
              </Col>
            </Col>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

const mapStateToProps = state => ({
  liaccounts: state.liaccounts.liaccounts,
  sequences: state.sequences.sequences,
  loading: state.sequences.loading
});

const mapDispatchToProps = dispatch => ({
  requestUpdateSequence: (sequence, account) =>
    dispatch(requestUpdateSequence(sequence, account))
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps)(SequenceAddEditForm)
);
