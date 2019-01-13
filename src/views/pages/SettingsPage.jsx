// Campaigns Page

import React from "react";
import { compose } from "recompose";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

// reactstrap components
import {
  Button,
  FormGroup,
  CardBody,
  Label,
  Row,
  Col,
  Card,
  CardHeader,
  CardFooter,
  Input,
  UncontrolledTooltip
} from "reactstrap";

import InputRange from "react-input-range";
import LoadingOverlay from "react-loading-overlay";
import timezones from "timezones.json";

import "react-input-range/lib/css/index.css";

import { liaccountActions } from "../../actions";
import { originToutc, utcTotarget } from "../../utils";

import ReactSelect from "react-select";
import SimpleValue from "react-select-simple-value";

const { requestChangeSettings } = liaccountActions;

const MySelect = ({ options, value, ...props }) => (
  <SimpleValue options={options} value={value}>
    {simpleProps => <ReactSelect {...props} {...simpleProps} />}
  </SimpleValue>
);

class SettingsPage extends React.Component {
  freqKeys = [
    { title: "Profile views", key: "profileViews" },
    { title: "Follows", key: "follows" },
    { title: "Invitations", key: "invitations" },
    { title: "Messages", key: "messages" }
  ];

  state = {
    freqRates: {
      profileViews: {
        min: 15,
        max: 30
      },
      follows: {
        min: 15,
        max: 30
      },
      invitations: {
        min: 15,
        max: 30
      },
      messages: {
        min: 15,
        max: 30
      }
    },
    timeSettings: {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      workingHours: {
        min: "15:04",
        max: "02:00"
      }
    },
    skipWeekends: true
  };

  fetchSettings = () => {
    const {
      match: {
        params: { account: identifier }
      },
      liaccounts
    } = this.props;

    if (liaccounts && liaccounts.length) {
      const acc = liaccounts.filter(acc => acc.identifier === identifier)[0];

      if (!acc) {
        return;
      }

      const settings = acc.settings;
      const setKeys = ["VISIT", "FOLLOW", "CONNECT", "MESSAGE"];
      const freqRates = {};

      setKeys.forEach((setKey, index) => {
        const freqKey = this.freqKeys[index].key;
        freqRates[freqKey] = {};
        freqRates[freqKey].min = settings[setKey][0];
        freqRates[freqKey].max = settings[setKey][1];
      });

      const workingHours = settings.workingHours;
      const localZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const timeSettings = {
        timezone: settings.timezone ? settings.timezone : localZone,
        workingHours: {
          min: settings.timezone
            ? `${workingHours[0]
                .toString()
                .padStart(2, "0")}:${workingHours[1]
                .toString()
                .padStart(2, "0")}`
            : originToutc("06:00", localZone),
          max: settings.timezone
            ? `${workingHours[2]
                .toString()
                .padStart(2, "0")}:${workingHours[3]
                .toString()
                .padStart(2, "0")}`
            : originToutc("20:00", localZone)
        }
      };

      this.setState({
        freqRates,
        timeSettings,
        skipWeekends: settings.excludeWeekend
      });
    }
  };

  saveSettings = () => {
    const { freqRates, timeSettings, skipWeekends } = this.state;
    const workingHours = timeSettings.workingHours.min
      .split(":")
      .map(str => parseInt(str))
      .concat(
        timeSettings.workingHours.max.split(":").map(str => parseInt(str))
      );

    const settings = {
      workingHours,
      timezone: timeSettings.timezone,
      excludeWeekend: skipWeekends
    };

    const setKeys = ["VISIT", "FOLLOW", "CONNECT", "MESSAGE"];
    setKeys.forEach((setKey, index) => {
      const freqKey = this.freqKeys[index].key;
      settings[setKey] = [freqRates[freqKey].min, freqRates[freqKey].max];
    });

    const {
      match: {
        params: { account: identifier }
      },
      liaccounts
    } = this.props;

    const _id = liaccounts.filter(acc => acc.identifier === identifier)[0]._id;
    this.props.requestChangeSettings(_id, settings);
  };

  componentDidMount() {
    this.fetchSettings();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.liaccounts || !prevProps.liaccounts.length) {
      this.fetchSettings();
    }
  }

  changeFreqRates = key => value => {
    if (value.max - value.min < 5) {
      return;
    }
    const { freqRates } = this.state;
    freqRates[key] = value;
    this.setState({ ...this.state, freqRates });
  };

  changeTimeZone = option => {
    const { timeSettings } = this.state;
    timeSettings.timezone = option.value;
    this.setState({ ...this.state, timeSettings });
  };

  changeWorkingHours = type => ({ target: { value: time } }) => {
    const { timeSettings } = this.state;
    timeSettings.workingHours[type] = originToutc(time, timeSettings.timezone);
    this.setState({ ...this.state, timeSettings });
  };

  toggleSkipWeekends = e => {
    this.setState({ ...this.state, skipWeekends: !this.state.skipWeekends });
  };

  render() {
    const { freqRates, timeSettings, skipWeekends } = this.state;
    const { timezone, workingHours } = timeSettings;
    const { loading } = this.props;

    return (
      <>
        <LoadingOverlay
          active={loading}
          spinner
          text="Loading/Saving settings"
        ></LoadingOverlay>
        <div className="content accountlist">
          <Row>
            <Col md="12">
              <h3>Account Settings</h3>
              <Card style={{ boxShadow: "none" }}>
                <CardHeader>
                  <h4>Daily rate of frequency</h4>
                  <span className="el-inline">
                    <a
                      href="https://help.perfectprospect.io/portal/kb/articles/account-settings-recommendations"
                      target="_blank"
                      className="text-muted"
                      rel="noopener noreferrer"
                    >
                      What settings should I use?{" "}
                    </a>
                    <i
                      className="nc-icon nc-bulb-63 el-inline"
                      id="tooltip-settings"
                    ></i>
                  </span>

                  <UncontrolledTooltip
                    placement="right"
                    delay={0}
                    target="tooltip-settings"
                  >
                    Send rates should only be increased gradually. Please read
                    our settings guide to learn best practices for rates and
                    limits.
                  </UncontrolledTooltip>
                </CardHeader>

                <CardBody style={{ padding: "0px 40px" }}>
                  {this.freqKeys.map(({ title, key }) => (
                    <Row key={key}>
                      <h6
                        style={{
                          width: 200,
                          marginTop: 40
                        }}
                      >
                        {title}
                      </h6>
                      <div
                        className="col-md-8 col-sm-12 ml-auto mr-auto"
                        style={{ marginTop: 40 }}
                      >
                        <InputRange
                          maxValue={100}
                          minValue={0}
                          value={freqRates[key]}
                          onChange={this.changeFreqRates(key)}
                        />
                      </div>
                    </Row>
                  ))}
                </CardBody>
                <CardFooter></CardFooter>
                <CardHeader>
                  <h4>Time settings</h4>
                </CardHeader>
                <CardBody style={{ padding: "0px 40px" }}>
                  <Row>
                    <h6
                      style={{
                        width: 200,
                        marginBottom: 10,
                        marginTop: 20
                      }}
                    >
                      Time zone
                    </h6>
                    <div
                      className="col-md-8 col-sm-12 ml-auto mr-auto"
                      style={{ marginTop: 20 }}
                    >
                      <MySelect
                        className="react-select primary"
                        classNamePrefix="react-select"
                        name="timezone"
                        value={timezone}
                        onChange={this.changeTimeZone}
                        options={timezones
                          .map(timezone =>
                            timezone.utc.map(utc => ({
                              label: `${timezone.text} - ${utc}`,
                              value: utc
                            }))
                          )
                          .flat()}
                        placeholder="Select the timezone"
                      />
                    </div>
                  </Row>
                  <Row>
                    <h6
                      style={{
                        width: 200,
                        marginBottom: 10,
                        marginTop: 20
                      }}
                    >
                      Working hours
                    </h6>
                    <div
                      className="col-md-8 col-sm-12 ml-auto mr-auto"
                      style={{ marginTop: 20 }}
                    >
                      <input
                        value={utcTotarget(workingHours.min, timezone)}
                        type="time"
                        onChange={this.changeWorkingHours("min")}
                      ></input>
                      <h6 className="el-inline" style={{ margin: "0 20px" }}>
                        to
                      </h6>
                      <input
                        value={utcTotarget(workingHours.max, timezone)}
                        type="time"
                        onChange={this.changeWorkingHours("max")}
                      ></input>
                    </div>
                  </Row>
                  <Row>
                    <h6
                      style={{
                        width: 200
                      }}
                    >
                      &nbsp;
                    </h6>
                    <div
                      className="col-md-8 col-sm-12 ml-auto mr-auto"
                      style={{ marginTop: 10 }}
                    >
                      <FormGroup check className="mt-3">
                        <FormGroup check>
                          <Label check>
                            <Input
                              checked={skipWeekends}
                              type="checkbox"
                              onChange={this.toggleSkipWeekends}
                            />
                            Skip weekends <span className="form-check-sign" />
                          </Label>
                        </FormGroup>
                      </FormGroup>
                    </div>
                  </Row>
                  <Row>
                    <h6
                      style={{
                        width: 200
                      }}
                    >
                      &nbsp;
                    </h6>
                    <div className="col-md-8 col-sm-12 ml-auto mr-auto">
                      <p>
                        NOTE: Changes to the account settings will not affect
                        tasks that have already been scheduled for execution.
                      </p>
                    </div>
                  </Row>
                  <Row>
                    <h6
                      style={{
                        width: 200
                      }}
                    >
                      &nbsp;
                    </h6>
                    <div
                      className="col-md-8 col-sm-12 ml-auto mr-auto"
                      style={{ marginTop: 0 }}
                    >
                      <Button
                        color="primary"
                        onClick={() => this.saveSettings()}
                      >
                        Save
                      </Button>
                      <Button onClick={() => this.fetchSettings()}>
                        Reset
                      </Button>
                    </div>
                  </Row>
                </CardBody>
                <CardFooter></CardFooter>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({
  liaccounts: state.liaccounts.liaccounts,
  loading: state.liaccounts.loading,
  error: state.liaccounts.error
});

const mapDispatchToProps = dispatch => ({
  requestChangeSettings: (_id, settings) =>
    dispatch(requestChangeSettings(_id, settings))
});

export default withRouter(
  compose(connect(mapStateToProps, mapDispatchToProps)(SettingsPage))
);
