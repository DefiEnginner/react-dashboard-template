import React, { useState } from "react";

// reactstrap components
import {
  Input,
  InputGroup,
  FormFeedback,
  UncontrolledTooltip,
  Button
} from "reactstrap";

// react plugin used to create switch buttons
import Switch from "react-bootstrap-switch";

import { validator } from "../../../utils";
import { useEffect } from "react";

const CampaignCard = ({ type, sequences, saveCampaign, campaigns }) => {
  const [name, changeName] = useState(-1);
  const [linkedinURL, changeLinkedinURL] = useState(-1);
  const [excludeOption, changeExcludeOption] = useState(true);
  const [isRunning, changeIsRunning] = useState(true);

  const [sequence, changeSequence] = useState(-1);

  let urlPlaceholder = null;
  let aboutExclude = null;

  useEffect(() => {
    if (sequences && sequences.length > 0) {
      changeSequence(sequences[0]._id);
    }
  }, [sequences]);

  switch (type) {
    case "SALES_NAVIGATOR":
      urlPlaceholder = "Enter a Sales Navigator search URL";
      break;
    case "BASIC_QUERY":
      urlPlaceholder = "Enter a LinkedIn search URL";
      break;
    case "CUSTOM":
      aboutExclude = (
        <p className="text-danger">
          This option is not recommended for 'Custom Import' campaign type.
        </p>
      );
      urlPlaceholder =
        "Enter a list of LinkedIn profile URLs; one URL per line";
      break;
    default:
      urlPlaceholder = "Enter a Sales Navigator search URL";
  }

  const setName = e => changeName(e.target.value);
  const setLinkedinURL = e => changeLinkedinURL(e.target.value);
  const toggleExcludeOption = () => changeExcludeOption(!excludeOption);
  const toggleIsRunning = () => changeIsRunning(!isRunning);
  const setSequence = e => {
    changeSequence(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (name === -1) {
      changeName("");
      return;
    }
    if (urlPlaceholder && linkedinURL === -1) {
      changeLinkedinURL("");
      return;
    }
    if (sequence === -1) {
      changeSequence("");
      return;
    }

    if (validator.checkRequiredValidation(name)) {
      return;
    }
    if (
      campaigns.findIndex(
        camp =>
          camp.name.split(" -> ")[1].replace(/\W/g, "-") ===
          name.replace(/\W/g, "-")
      ) !== -1
    ) {
      return;
    }
    if (urlPlaceholder && validator.checkRequiredValidation(linkedinURL)) {
      return;
    }
    if (validator.checkRequiredValidation(sequence)) {
      return;
    }
    if (
      type === "BASIC_QUERY" &&
      validator.checkBasicQueryValidation(linkedinURL)
    ) {
      return;
    }
    if (
      type === "SALES_NAVIGATOR" &&
      validator.checkSalesNavValidation(linkedinURL)
    ) {
      return;
    }

    const sourceLinks = urlPlaceholder ? linkedinURL.split("\n") : [];

    saveCampaign({
      name,
      sourceLinks,
      excludeOption,
      sequenceId: sequence,
      isRunning,
      isStarted: isRunning
    });
  };

  return (
    <>
      <div className="fade-in">
        <div className="inputfield">
          <p className="inputfieldname">Name</p>
          <InputGroup>
            <Input
              placeholder="Descriptor of this audience"
              type="text"
              invalid={
                validator.checkRequiredValidation(name) ||
                (name !== -1 &&
                  campaigns.findIndex(
                    camp =>
                      camp.name.split(" -> ")[1].replace(/\W/g, "-") ===
                      name.replace(/\W/g, "-")
                  ) !== -1)
              }
              onChange={setName}
            />
            <FormFeedback>
              {validator.checkRequiredValidation(name)
                ? "Campaign Name Required"
                : "Campaign Name already exists"}
            </FormFeedback>
          </InputGroup>
        </div>
        {urlPlaceholder && (
          <div className="inputfield">
            <p className="inputfieldname">
              Linkedin {type === "CUSTOM" ? "profile URLs list" : "URL"}
            </p>
            <InputGroup>
              <Input
                placeholder={urlPlaceholder}
                type={type === "CUSTOM" ? "textarea" : "text"}
                invalid={
                  validator.checkRequiredValidation(linkedinURL) ||
                  (type === "BASIC_QUERY" &&
                    validator.checkBasicQueryValidation(linkedinURL)) ||
                  (type === "SALES_NAVIGATOR" &&
                    validator.checkSalesNavValidation(linkedinURL))
                }
                onChange={setLinkedinURL}
              />
              <FormFeedback>
                {validator.checkRequiredValidation(linkedinURL)
                  ? `Linkedin URL${type === "CUSTOM" ? "s" : ""} Required`
                  : `Invalid URL format for this campaign type.`}
              </FormFeedback>
            </InputGroup>
          </div>
        )}
        <div className="inputfield run-immediately">
          <Switch
            offColor="primary"
            onColor="primary"
            defaultValue={excludeOption}
            onChange={toggleExcludeOption}
          />{" "}
          &nbsp; Exclude if in previous campaign
          <i
            className="nc-icon nc-alert-circle-i"
            id={`tooltip-prev-${type}`}
          ></i>
          <UncontrolledTooltip
            placement="bottom"
            delay={0}
            target={`tooltip-prev-${type}`}
          >
            Exclude prospects from this campaign if they've been approached
            previously in other campaigns
          </UncontrolledTooltip>
          {aboutExclude}
        </div>
        <div className="inputfield">
          <p className="inputfieldname">Sequence for this audience</p>
          <Input
            type="select"
            value={sequence}
            onChange={setSequence}
            style={{ height: 32 }}
            invalid={validator.checkRequiredValidation(sequence)}
          >
            {sequences.map(seq => (
              <option value={seq._id} key={seq.name}>
                {seq.name}
              </option>
            ))}
          </Input>
          <FormFeedback>
            Please select a sequence for this audience
          </FormFeedback>
        </div>
        <div className="inputfield run-immediately">
          <Switch
            offColor="primary"
            onColor="primary"
            defaultValue={isRunning}
            onChange={toggleIsRunning}
          />{" "}
          &nbsp; Run this campaign immediately
          <i
            className="nc-icon nc-alert-circle-i"
            id={`tooltip-set-on-${type}`}
          ></i>
          <UncontrolledTooltip
            placement="bottom"
            delay={0}
            target={`tooltip-set-on-${type}`}
          >
            Set to 'on' if you want to run this campaign immediately or 'off' to
            save for later.
          </UncontrolledTooltip>
          <i className="nc-icon nc-bulb-63" id={`tooltip-run-im-${type}`}></i>
          <UncontrolledTooltip
            delay={0}
            target={`tooltip-run-im-${type}`}
            placement="bottom"
          >
            You can review/manage imported prospects in the campaign dashboard
            before launching.
          </UncontrolledTooltip>
        </div>
        <div className="pull-right">
          <div>
            <Button color="primary" onClick={handleSubmit}>
              Save
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CampaignCard;
