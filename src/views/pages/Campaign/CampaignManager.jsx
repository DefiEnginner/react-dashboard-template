// Campaigns Page

import React from "react";
import { compose } from "recompose";
import { connect } from "react-redux";

import ReactTable from "react-table";

// reactstrap components
import { Button, Card, CardBody } from "reactstrap";
import LoadingOverlay from "react-loading-overlay";
import moment from "moment";
import { Progress, UncontrolledTooltip } from "reactstrap";
import ReactBSAlert from "react-bootstrap-sweetalert";

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import { campaignTypes } from "../../../utils";
import { campaignActions } from "../../../actions";
import { progress } from "../../../utils";

const {
  requestDeleteCampaign,
  requestStartCampaign,
  requestPauseCampaign
} = campaignActions;

class CampaignPage extends React.Component {
  state = {
    alert: null
  };

  noSequenceAlert = () => {
    this.setState({
      alert: (
        <ReactBSAlert
          warning
          style={{ display: "block", marginTop: "-150px" }}
          title="Sequence missing."
          onConfirm={() => this.gotoSeqBuilder()}
          onCancel={() => this.gotoSeqBuilder()}
          confirmBtnBsStyle="info"
        >
          Please add a sequence before creating your campaign.
        </ReactBSAlert>
      )
    });
  };

  gotoSeqBuilder = () => {
    const {
      match: {
        params: { account }
      }
    } = this.props;
    this.props.history.push(`/admin/${account}/sequences/new`);
  };
  createCampaign = () => {
    const {
      match: {
        params: { account }
      },
      sequences
    } = this.props;

    if (!sequences || !sequences.length) {
      this.noSequenceAlert();
    } else {
      this.props.history.push(`/admin/${account}/campaigns/new`);
    }
  };
  campaignAction = (identifier, action) => {
    const { account } = this.props.match.params;
    const { campaigns } = this.props;
    const campaign = campaigns.filter(
      camp => camp.identifier === identifier
    )[0];

    switch (action) {
      case "remove":
        this.props.requestDeleteCampaign(campaign._id, account);
        break;
      case "start":
        this.props.requestStartCampaign(
          campaign._id,
          campaign.isStarted ? "resume" : "start"
        );
        break;
      case "pause":
        this.props.requestPauseCampaign(campaign._id);
        break;
      default:
        this.props.requestPauseCampaign(campaign._id);
        break;
    }

    this.hideAlert();
  };
  warningWithConfirmMessage = (e, identifier, action) => {
    e.preventDefault();
    this.setState({
      alert: (
        <ReactBSAlert
          warning
          style={{ display: "block", marginTop: "-100px" }}
          title="Are you sure?"
          onConfirm={() => this.campaignAction(identifier, action)}
          onCancel={() => this.hideAlert()}
          confirmBtnBsStyle="info"
          cancelBtnBsStyle="danger"
          confirmBtnText={`Yes, ${action} it!`}
          cancelBtnText="Cancel"
          showCancel
        >
          {action === "remove" &&
            "You will not be able to recover the campaign data."}
        </ReactBSAlert>
      )
    });
  };
  hideAlert = () => {
    this.setState({ alert: null });
  };
  navigateToCampaign = (e, identifier) => {
    e.preventDefault();
    const { account } = this.props.match.params;
    this.props.history.push(
      `/admin/${account}/campaigns/details-${identifier}`
    );
  };

  getSeqLink = sequence => {
    const {
      match: {
        params: { account }
      }
    } = this.props;

    return (
      <a href={`/admin/${account}/sequences/edit-${sequence.identifier}`}>
        {sequence.name}
      </a>
    );
  };

  render() {
    const { campaigns, loading, sequences, seqLoading } = this.props;
    const campaignData = campaigns.map(camp => ({
      ...camp,
      date: <span>{moment(camp.createdAt).format("lll")}</span>,
      name: (
        <a href="/" onClick={e => this.navigateToCampaign(e, camp.identifier)}>
          {camp.name.split(" -> ")[1]}
        </a>
      ),
      type: (
        <span>
          {
            campaignTypes.filter(campType => campType.key === camp.type)[0]
              .title
          }
        </span>
      ),
      seqLink:
        sequences.length &&
        this.getSeqLink(
          sequences.filter(seq => seq._id === camp.sequenceId)[0]
        ),
      prospects: <span>{camp.targets.length}</span>,
      connected: <span>{camp.connectionData.length}</span>,
      replies: <span>{camp.repliedData.length}</span>,
      progress: (
        <div className="progress-container" style={{ marginTop: 7 }}>
          <Progress
            max="100"
            value={
              sequences.length
                ? progress(
                    camp.data,
                    sequences.filter(seq => seq._id === camp.sequenceId)[0]
                      .sequences,
                    camp.targets.filter(target => target.notExcluded).length,
                    camp.isFinished
                  )
                : 0
            }
            style={{ height: 20 }}
          >
            <span className="progress-value" style={{ paddingLeft: 10 }}>
              {(sequences.length
                ? progress(
                    camp.data,
                    sequences.filter(seq => seq._id === camp.sequenceId)[0]
                      .sequences,
                    camp.targets.filter(target => target.notExcluded).length,
                    camp.isFinished
                  )
                : 0
              ).toFixed(2) + "%"}
            </span>
          </Progress>
          {/*<small className="progress-badge">540/{camp.targets.length}</small>*/}
        </div>
      ),
      status: (
        <span>
          {camp.lastError ? (
            <>
              <i
                className="fa fa-exclamation-triangle text-danger clear-both"
                id={`tooltip-processing-${camp.identifier}`}
              />
              <small className="camp-status-text">Invalid</small>
              <UncontrolledTooltip
                delay={0}
                target={`tooltip-processing-${camp.identifier}`}
              >
                {camp.lastError} <br />
              </UncontrolledTooltip>
            </>
          ) : !camp.targets.length && !camp.isStarted && !camp.isFinished ? (
            <>
              <i
                className="fa fa-circle-o-notch fa-spin clear-both"
                id={`tooltip-processing-${camp.identifier}`}
              />
              <small className="camp-status-text">Compiling</small>
              <UncontrolledTooltip
                delay={0}
                target={`tooltip-processing-${camp.identifier}`}
              >
                Importing campaign prospects <br />
                <small>(1 prospect per 0.5 ~ 1s )</small>
              </UncontrolledTooltip>
            </>
          ) : camp.isRunning ? (
            <>
              <i
                className="fa fa-circle-o-notch fa-spin text-info clear-both"
                id={`tooltip-camp-active-${camp.identifier}`}
              />
              <small className="camp-status-text">Running</small>
              <UncontrolledTooltip
                delay={0}
                target={`tooltip-camp-active-${camp.identifier}`}
              >
                Campaign is actively running sequences
              </UncontrolledTooltip>
            </>
          ) : !camp.isFinished ? (
            <>
              <i
                className="fa fa-circle text-warning clear-both"
                id={`tooltip-camp-inactive-${camp.identifier}`}
              />
              <small className="camp-status-text">Idle</small>
              <UncontrolledTooltip
                delay={0}
                target={`tooltip-camp-inactive-${camp.identifier}`}
              >
                Campaign is not currently running sequences
              </UncontrolledTooltip>
            </>
          ) : (
            <>
              <i
                className="fa fa-flag-checkered text-success clear-both"
                id={`tooltip-camp-finished-${camp.identifier}`}
              />
              <small className="camp-status-text">Completed</small>
              <UncontrolledTooltip
                delay={0}
                target={`tooltip-camp-finished-${camp.identifier}`}
              >
                Campaign is completed
              </UncontrolledTooltip>
            </>
          )}
        </span>
      ),
      actions: (
        // we've added some custom button actions
        <div className="actions-center">
          {/* use this button to remove the data row */}
          <Button
            size="md"
            id={`tooltip-camp-pause-${camp.identifier}`}
            className="btn-icon btn-link remove"
            onClick={e =>
              this.warningWithConfirmMessage(
                e,
                camp.identifier,
                camp.isRunning ? "pause" : "start"
              )
            }
            disabled={
              !camp.targets.length && !camp.isStarted && !camp.isFinished
            }
          >
            <i className={camp.isRunning ? "fa fa-pause" : "fa fa-play"} />
          </Button>{" "}
          <UncontrolledTooltip
            delay={0}
            target={`tooltip-camp-pause-${camp.identifier}`}
          >
            {`${camp.isRunning ? "Pause" : "Start/Resume"} the campaign`}
          </UncontrolledTooltip>
          {/*<Button
            color="black"
            size="md"
            id="tooltip-camp-pause"
            className="btn-icon btn-link"
            onClick={e => this.createCampaign}
          >
            <i className="fa fa-user" />
          </Button>*/}
          {/* use this button to remove the data row */}
          <Button
            color="danger"
            size="md"
            id={`tooltip-camp-remove-${camp.identifier}`}
            className="btn-icon btn-link remove"
            onClick={e =>
              this.warningWithConfirmMessage(e, camp.identifier, "remove")
            }
          >
            <i className="fa fa-times" />
          </Button>{" "}
          <UncontrolledTooltip
            delay={0}
            target={`tooltip-camp-remove-${camp.identifier}`}
          >
            Remove the campaign
          </UncontrolledTooltip>
        </div>
      )
    }));
    return (
      <>
        <LoadingOverlay
          active={loading || seqLoading}
          spinner
          text="Loading Campaigns"
        ></LoadingOverlay>
        <div className="content accountlist">
          {this.state.alert}
          <h3 className="el-inline">Campaign Manager</h3>
          <Button
            className="add-btn el-inline btn btn-primary btn-icon btn-round"
            onClick={this.createCampaign}
          >
            <i className="nc-icon nc-simple-add" />
          </Button>
          <Card>
            <CardBody>
              <ReactTable
                data={campaignData}
                columns={[
                  {
                    Header: "Campaign",
                    accessor: "name",
                    sortable: false,
                    filterable: false,
                    width: 150
                  },
                  {
                    Header: "Created",
                    accessor: "date",
                    sortable: true,
                    filterable: false
                  },

                  {
                    Header: "Type",
                    accessor: "type",
                    sortable: true,
                    filterable: false
                  },
                  {
                    Header: "Prospects",
                    accessor: "prospects",
                    sortable: false,
                    filterable: false
                  },
                  {
                    Header: "Connections",
                    accessor: "connected",
                    sortable: false,
                    filterable: false
                  },
                  {
                    Header: "Replies",
                    accessor: "replies",
                    sortable: false,
                    filterable: false
                  },
                  {
                    Header: "Progress",
                    accessor: "progress",
                    sortable: true,
                    filterable: false
                  },
                  {
                    Header: "Status",
                    accessor: "status",
                    sortable: true,
                    filterable: false,
                    className: "camp-man-status"
                  },
                  {
                    Header: "Actions",
                    accessor: "actions",
                    sortable: false,
                    filterable: false
                  }
                ]}
                defaultPageSize={10}
                defaultSorted={[
                  {
                    id: "date",
                    desc: true
                  }
                ]}
                showPaginationTop={false}
                showPaginationBottom={true}
                /*
                  You can choose between primary-pagination, info-pagination, success-pagination, warning-pagination, danger-pagination or none - which will make the pagination buttons gray
                */
                className=" -highlight campaign-manager-table"
              />
            </CardBody>
          </Card>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({
  campaigns: state.campaigns.campaigns,
  loading: state.campaigns.loading,
  sequences: state.sequences.sequences,
  seqLoading: state.sequences.loading,
  error: state.campaigns.error
});

const mapDispatchToProps = dispatch => ({
  requestDeleteCampaign: (_id, account) =>
    dispatch(requestDeleteCampaign(_id, account)),
  requestStartCampaign: (_id, mode) =>
    dispatch(requestStartCampaign(_id, mode)),
  requestPauseCampaign: _id => dispatch(requestPauseCampaign(_id))
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps)(CampaignPage)
);
