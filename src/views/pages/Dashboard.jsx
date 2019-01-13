// Camp Dash Page

import React from "react";
import { compose } from "recompose";
import { connect } from "react-redux";

// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend
// } from "recharts";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

// react plugin used to create charts
import { Line, Bar, Doughnut } from "react-chartjs-2";
// reactstrap components
import {
  Badge,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Label,
  FormGroup,
  Table,
  Row,
  Input,
  Col,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  UncontrolledTooltip
} from "reactstrap";

import {
  chartExample4,
  chartExample5,
  chartExample12
} from "variables/charts.jsx";

import LoadingOverlay from "react-loading-overlay";

const CampaignDetailsPage = props => {
  const {
    match: {
      params: { identifier: detailID }
    },
    campaigns,
    loading
  } = props;

  const identifier = detailID.split("details-")[1];
  const campaign = campaigns.filter(camp => camp.identifier === identifier)[0];
  const percentage = 11;
  const totalConnections = 150;
  const newConnections = 49;
  const campaignTitle = "CPA Perth";

  const graphData = [...Array(10).keys()].map(day => ({
    name: day + 1,
    "Requests sent": Math.floor(Math.random() * 900 + 100),
    Accepted: Math.floor(Math.random() * 900 + 100),
    amt: Math.floor(Math.random() * 900 + 100)
  }));

  return (
    <>
      <LoadingOverlay
        active={loading}
        spinner
        text="Loading Campaigns"
      ></LoadingOverlay>
      <div className="content camp-dash">
        <h3 style={{ marginBottom: 15 }}>{campaignTitle}</h3>
        <Row>
          <Col xl={3} lg={3} xs={6}>
            <Card className="camp-dash-progress">
              <CardHeader>
                <CardTitle>Progress</CardTitle>
                <p className="card-category">Total sequences completed</p>
              </CardHeader>
              <CardBody>
                <Doughnut
                  data={chartExample5.data}
                  options={chartExample5.options}
                  className="ct-chart ct-perfect-fourth"
                  height={300}
                  width={456}
                />
              </CardBody>
              <CardFooter>
                <div className="legend">
                  <i className="fa fa-circle text-info" />
                  Processed (457/800)
                </div>
                <hr />
                <div className="stats">
                  <i className="fa fa-clock-o" />
                  Updated 1 hour ago
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col xl={3} lg={3} xs={6}>
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center">
                      <i className="nc-icon nc-globe" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Total Connections</p>
                      <CardTitle tag="p">1502</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fa fa-clock-o" />
                  All time
                </div>
              </CardFooter>
            </Card>
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-success">
                      <i className="nc-icon nc-air-baloon" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">New Connections</p>
                      <CardTitle tag="p">490</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="nc-icon nc-user-run" />
                  From this campaign
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col md="6">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Outreach Analysis</CardTitle>
              </CardHeader>
              <CardBody>
                <Bar
                  data={chartExample4.data}
                  options={chartExample4.options}
                />
              </CardBody>
              <CardFooter>
                <div className="legend">
                  <i className="fa fa-circle text-info" />
                  Requests sent <i className="fa fa-circle text-danger" />
                  Requests accepted
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xl={8} lg={8} xs={12}>
            <Card className="dash-daily-table">
              <CardHeader>
                <CardTitle tag="h4">Campaign Results</CardTitle>
                <h5 className="card-category" style={{marginBottom:0}}>Daily log of campaign interactions</h5>
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Visits</th>
                      <th>Follows</th>
                      <th>Requests</th>
                      <th>Accepted</th>
                      <th>Replies</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1/10</td>
                      <td>13</td>
                      <td>38</td>
                      <td>45</td>
                      <td>13</td>
                      <td>45</td>
                    </tr>
                    <tr>
                      <td>1/9</td>
                      <td>13</td>
                      <td>89</td>
                      <td>45</td>
                      <td>13</td>
                      <td>45</td>
                    </tr>
                    <tr>
                      <td>1/8</td>
                      <td>13</td>
                      <td>42</td>
                      <td>45</td>
                      <td>13</td>
                      <td>45</td>
                    </tr>
                    <tr>
                      <td>1/7</td>
                      <td>13</td>
                      <td>33</td>
                      <td>35</td>
                      <td>45</td>
                      <td>13</td>
                    </tr>
                    <tr>
                      <td>1/6</td>
                      <td>68</td>
                      <td>68</td>
                      <td>42</td>
                      <td>45</td>
                      <td>13</td>
                    </tr>
                  </tbody>
                </Table>
              </CardBody>
            </Card>
            <Card className="card-tasks">
              <CardHeader>
                <CardTitle tag="h4">Prospects</CardTitle>
                <h5 className="card-category">Every prospect from this campaign</h5>
              </CardHeader>
              <CardBody>
                <div className="table-full-width table-responsive">
                  <Table>
                    <tbody>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input defaultChecked type="checkbox" />
                              <span className="form-check-sign" />
                            </Label>
                          </FormGroup>
                        </td>
                        <td className="img-row">
                          <div className="img-wrapper">
                            <img
                              alt="..."
                              className="img-raised"
                              src={require("assets/img/faces/ayo-ogunseinde-2.jpg")}
                            />
                          </div>
                        </td>
                        <td className="text-left">
                          Jack Mehoff - Mehoff and Associates
                        </td>
                        <td className="td-actions text-right">
                          <Button
                            className="btn-round btn-icon btn-icon-mini btn-neutral"
                            color="info"
                            id="tooltip42906017"
                            title=""
                            type="button"
                          >
                            <i className="nc-icon nc-ruler-pencil" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip42906017"
                          >
                            Make a note
                          </UncontrolledTooltip>
                          <Button
                            className="btn-round btn-icon btn-icon-mini btn-neutral"
                            color="danger"
                            id="tooltip570363224"
                            title=""
                            type="button"
                          >
                            <i className="nc-icon nc-simple-remove" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip570363224"
                          >
                            Remove
                          </UncontrolledTooltip>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input type="checkbox" />
                              <span className="form-check-sign" />
                            </Label>
                          </FormGroup>
                        </td>
                        <td className="img-row">
                          <div className="img-wrapper">
                            <img
                              alt="..."
                              className="img-raised"
                              src={require("assets/img/faces/erik-lucatero-2.jpg")}
                            />
                          </div>
                        </td>
                        <td className="text-left">
                          Ben Dover - Skybox Company
                        </td>
                        <td className="td-actions text-right">
                          <Button
                            className="btn-round btn-icon btn-icon-mini btn-neutral"
                            color="info"
                            id="tooltip584875601"
                            title=""
                            type="button"
                          >
                            <i className="nc-icon nc-ruler-pencil" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip584875601"
                          >
                            Make a note
                          </UncontrolledTooltip>
                          <Button
                            className="btn-round btn-icon btn-icon-mini btn-neutral"
                            color="danger"
                            id="tooltip517629613"
                            title=""
                            type="button"
                          >
                            <i className="nc-icon nc-simple-remove" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip517629613"
                          >
                            Remove
                          </UncontrolledTooltip>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input defaultChecked type="checkbox" />
                              <span className="form-check-sign" />
                            </Label>
                          </FormGroup>
                        </td>
                        <td className="img-row">
                          <div className="img-wrapper">
                            <img
                              alt="..."
                              className="img-raised"
                              src={require("assets/img/faces/kaci-baum-2.jpg")}
                            />
                          </div>
                        </td>
                        <td className="text-left">
                          Sharon Peters - Puffing, LLC
                        </td>
                        <td className="td-actions text-right">
                          <Button
                            className="btn-round btn-icon btn-icon-mini btn-neutral"
                            color="info"
                            id="tooltip792337830"
                            title=""
                            type="button"
                          >
                            <i className="nc-icon nc-ruler-pencil" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip792337830"
                          >
                            Make a note
                          </UncontrolledTooltip>
                          <Button
                            className="btn-round btn-icon btn-icon-mini btn-neutral"
                            color="danger"
                            id="tooltip731952378"
                            title=""
                            type="button"
                          >
                            <i className="nc-icon nc-simple-remove" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip731952378"
                          >
                            Remove
                          </UncontrolledTooltip>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input type="checkbox" />
                              <span className="form-check-sign" />
                            </Label>
                          </FormGroup>
                        </td>
                        <td className="img-row">
                          <div className="img-wrapper">
                            <img
                              alt="..."
                              className="img-raised"
                              src={require("assets/img/faces/joe-gardner-2.jpg")}
                            />
                          </div>
                        </td>
                        <td className="text-left">
                          Cliff Claven - Barfly
                        </td>
                        <td className="td-actions text-right">
                          <Button
                            className="btn-round btn-icon btn-icon-mini btn-neutral"
                            color="info"
                            id="tooltip825783733"
                            title=""
                            type="button"
                          >
                            <i className="nc-icon nc-ruler-pencil" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip825783733"
                          >
                            Make a note
                          </UncontrolledTooltip>
                          <Button
                            className="btn-round btn-icon btn-icon-mini btn-neutral"
                            color="danger"
                            id="tooltip285089652"
                            title=""
                            type="button"
                          >
                            <i className="nc-icon nc-simple-remove" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip285089652"
                          >
                            Remove
                          </UncontrolledTooltip>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fa fa-refresh spin" />
                  Updated 3 minutes ago
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col xl={4} lg={4} xs={12}>
            <Card className="card-timeline card-plain">
              <CardTitle tag='h4'>Recent Activity</CardTitle>
              <CardBody>
                <ul className="timeline timeline-simple">
                  <li className="timeline-inverted">
                    <div className="timeline-badge danger">
                      <i className="nc-icon nc-single-copy-04" />
                    </div>
                    <div className="timeline-panel">
                      <div className="timeline-heading">
                        <Badge color="danger" pill>
                          Connected
                        </Badge>
                      </div>
                      <div className="timeline-body">
                        <p>
                          Hi Jim, thanks for connecting. It will be great to
                          have you in my network.
                        </p>
                      </div>
                      <h6>
                        <i className="ti-time" />2 hours ago
                      </h6>
                    </div>
                  </li>
                  <li className="timeline-inverted">
                    <div className="timeline-badge success">
                      <i className="nc-icon nc-sun-fog-29" />
                    </div>
                    <div className="timeline-panel">
                      <div className="timeline-heading">
                        <Badge color="success" pill>
                          Another One
                        </Badge>
                      </div>
                      <div className="timeline-body">
                        <p>
                          Thank God for the support of my wife and real friends.
                          I also wanted to point out that it’s the first album
                          to go number 1 off of streaming!!! I love you Ellen
                          and also my number one design rule of anything I do
                          from shoes to music to homes is that Kim has to like
                          it....
                        </p>
                      </div>
                    </div>
                  </li>
                  <li className="timeline-inverted">
                    <div className="timeline-badge info">
                      <i className="nc-icon nc-world-2" />
                    </div>
                    <div className="timeline-panel">
                      <div className="timeline-heading">
                        <Badge color="info" pill>
                          Another Title
                        </Badge>
                      </div>
                      <div className="timeline-body">
                        <p>
                          Called I Miss the Old Kanye That’s all it was Kanye
                          And I love you like Kanye loves Kanye Famous viewing @
                          Figueroa and 12th in downtown LA 11:10PM
                        </p>
                        <p>
                          What if Kanye made a song about Kanye Royère doesn't
                          make a Polar bear bed but the Polar bear couch is my
                          favorite piece of furniture we own It wasn’t any
                          Kanyes Set on his goals Kanye
                        </p>
                        <hr />
                      </div>
                      <div className="timeline-footer">
                        <UncontrolledDropdown>
                          <DropdownToggle
                            caret
                            className="btn-round"
                            color="info"
                            data-toggle="dropdown"
                            type="button"
                          >
                            <i className="nc-icon nc-settings-gear-65" />
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem
                              href="#pablo"
                              onClick={e => e.preventDefault()}
                            >
                              Action
                            </DropdownItem>
                            <DropdownItem
                              href="#pablo"
                              onClick={e => e.preventDefault()}
                            >
                              Another action
                            </DropdownItem>
                            <DropdownItem
                              href="#pablo"
                              onClick={e => e.preventDefault()}
                            >
                              Something else here
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </div>
                    </div>
                  </li>
                </ul>
              </CardBody>
            </Card>
          </Col>
          {/* <Col>
            <Card>
              <LineChart
                width={700}
                height={300}
                data={graphData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis interval={10} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Requests sent"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line type="monotone" dataKey="Accepted" stroke="#82ca9d" />
              </LineChart>
            </Card>
          </Col> */}
        </Row>
      </div>
    </>
  );
};

const mapStateToProps = state => ({
  campaigns: state.campaigns.campaigns,
  loading: state.campaigns.loading,
  error: state.campaigns.error
});

const mapDispatchToProps = dispatch => ({});

export default compose(
  connect(mapStateToProps, mapDispatchToProps)(CampaignDetailsPage)
);
