// Camp Dash Page

import React from "react";
import { compose } from "recompose";
import { connect } from "react-redux";

import "react-circular-progressbar/dist/styles.css";

import LoadingOverlay from "react-loading-overlay";

// reactstrap components
import { Row, Col } from "reactstrap";

import CampaignProgressCard from "../../components/campaigns/CampaignProgressCard";
import CampaignConnectionCard from "../../components/campaigns/CampaignConnectionCard";
import CampaignAnalysisCard from "../../components/campaigns/CampaignAnalysisCard";
import CampaignDailyLogCard from "../../components/campaigns/CampaignDailyLogCard";
import CampaignProspectsCard from "../../components/campaigns/CampaignProspectsCard";
import CampaignRecentActivityCard from "../../components/campaigns/CampaignRecentActivityCard";
import { useState } from "react";

const CampaignDetailsPage = props => {
  const {
    match: {
      params: { identifier: detailID, account }
    },
    campaigns,
    loading,
    seqLoading,
    sequences
  } = props;

  const [queryURL, setQueryURL] = useState(false);

  const identifier = detailID.split("details-")[1];
  const campaign = campaigns.filter(camp => camp.identifier === identifier)[0];
  let totalSeqs = 0;
  let startedSeqs = 0;
  let newConnections = 0;
  let sequence = null;

  if (campaign && sequences.length) {
    sequence = sequences.filter(seq => seq._id === campaign.sequenceId)[0];

    totalSeqs = campaign.targets.filter(target => target.notExcluded).length;
    startedSeqs = campaign.data.length;

    newConnections = campaign.connectionData.length;
  }

  const manageProspects = () => {
    props.history.push(`/admin/${account}/campaigns/prospects-${identifier}`);
  };

  return (
    <>
      <LoadingOverlay
        active={loading || seqLoading}
        spinner
        text="Loading Campaign Data"
      ></LoadingOverlay>
      <div className="content camp-dash">
        <Row>
          <Col lg={12} xs={12}>
            <h3 style={{ marginBottom: 0 }} className="el-inline">
              {campaign && campaign.name.split(" -> ")[1]}
            </h3>
            <span className="text-muted el-inline">
              &nbsp;{"(" + totalSeqs + ")"}
            </span>{" "}
            &nbsp;
            <span className="el-inline">
              {sequence && (
                <a
                  href={`/admin/${account}/sequences/edit-${sequence.identifier}`}
                  style={{ position: "relative" }}
                >
                  <p style={{ margin: 0 }}>{sequence.name}</p>
                </a>
              )}
            </span>
            {campaign &&
              (campaign.type === "SALES_NAVIGATOR" ||
                campaign.type === "BASIC_QUERY") && (
                <>
                  <div class="tab">
                    <input id="tab-1" type="checkbox" name="tab" />
                    <label class="badge badge-primary" for="tab-1">
                      Query URL
                    </label>
                    <div class="tab-content">
                      <p style={{ position: "relative" }}>
                        <a
                          rel="noreferrer noopener"
                          href={campaign.sourceLinks[0]}
                          target="_blank"
                        >
                          {campaign.sourceLinks[0]}
                        </a>
                      </p>
                    </div>
                  </div>
                </>
              )}
          </Col>
        </Row>
        <Row>
          <Col lg={3} xs={6}>
            <CampaignProgressCard
              {...{
                doneSeqs:
                  campaign && sequence
                    ? campaign.isFinished
                      ? totalSeqs * sequence.sequences.length
                      : campaign.data.reduce(
                          (sum, campData) => (sum += campData.actions.length),
                          0
                        )
                    : 0,
                totalSeqs: sequence ? totalSeqs * sequence.sequences.length : 0
              }}
            />
            <CampaignConnectionCard
              title="New Connections"
              number={newConnections}
              logo="nc-icon nc-air-baloon text-primary"
              descrIcon="nc-icon nc-check-2"
              descrText="Requests accepted"
            />
            <CampaignConnectionCard
              title="Prospects Started"
              number={`${startedSeqs}/${totalSeqs}`}
              logo="nc-icon nc-user-run text-success"
              descrIcon="fa fa-clock-o"
              descrText="Updated"
            />
          </Col>
          <Col lg="9">
            <CampaignDailyLogCard
              {...{
                campaign
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col xl={8} lg={8} xs={12}>
            <CampaignProspectsCard
              {...{
                campaign,
                fromIndex: 0,
                count: 4,
                manageProspects
              }}
            />
            <CampaignAnalysisCard {...{ campaign }} />
          </Col>
          <Col xl={4} lg={4} xs={12}>
            <CampaignRecentActivityCard {...{ campaign }} />
          </Col>
        </Row>
      </div>
    </>
  );
};

const mapStateToProps = state => ({
  campaigns: state.campaigns.campaigns,
  loading: state.campaigns.loading,
  sequences: state.sequences.sequences,
  seqLoading: state.sequences.loading,
  error: state.campaigns.error
});

const mapDispatchToProps = dispatch => ({});

export default compose(
  connect(mapStateToProps, mapDispatchToProps)(CampaignDetailsPage)
);
