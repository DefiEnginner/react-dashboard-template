import React, { useState } from "react";
import { compose } from "recompose";
import { connect } from "react-redux";

// reactstrap components
import {
  Row,
  Col,
  Nav,
  NavLink,
  NavItem,
  Card,
  CardBody,
  TabPane,
  TabContent
} from "reactstrap";

import CampaignCard from "../../components/campaigns/CampaignCard";

import { campaignTypes } from "../../../utils";
import { campaignActions } from "../../../actions";

const { requestCreateCampaign } = campaignActions;

const SequenceAddEditForm = ({
  sequences,
  error,
  loading,
  requestCreateCampaign,
  liaccounts,
  campaigns,
  ...restProps
}) => {
  const [type, setType] = useState("SALES_NAVIGATOR");

  const saveCampaign = values => {
    const { account } = restProps.match.params;
    const liaccount = liaccounts.filter(
      liacc => liacc.identifier === account
    )[0];
    requestCreateCampaign(
      { ...values, liEmail: liaccount.email, type },
      account,
      liaccount.connectionData,
      liaccount.repliedData
    );
  };

  const goBack = e => {
    e.preventDefault();
    const { account } = restProps.match.params;
    restProps.history.push(`/admin/${account}/campaigns`);
  };

  return (
    <div className="content campaignlist">
      <Col xs="12" xl="9" className="ml-auto mr-auto">
        <h4 className="el-inline">Campaign Builder</h4>
        <Card className="campaign-builder-card">
          <CardBody>
            <Row>
              <Col lg="4" md="5" sm="4" xs="6">
                <div className="nav-tabs-navigation verical-navs">
                  <div className="nav-tabs-wrapper">
                    <Nav
                      className="flex-column nav-stacked"
                      role="tablist"
                      tabs
                    >
                      {campaignTypes.map(campaignType => (
                        <NavItem key={campaignType.key}>
                          <NavLink
                            data-toggle="tab"
                            href="#"
                            role="tab"
                            disabled={campaignType.disabled}
                            className={
                              type === campaignType.key ? "active" : ""
                            }
                            onClick={() => setType(campaignType.key)}
                          >
                            {campaignType.title}
                          </NavLink>
                        </NavItem>
                      ))}
                    </Nav>
                  </div>
                </div>
              </Col>
              <Col lg="8" md="7" sm="8" xs="6">
                <TabContent activeTab={type}>
                  {campaignTypes.map(({ key }) => (
                    <TabPane tabId={key} key={key}>
                      <CampaignCard
                        key={key}
                        type={key}
                        sequences={sequences}
                        campaigns={campaigns}
                        goBack={goBack}
                        saveCampaign={saveCampaign}
                      />
                    </TabPane>
                  ))}
                </TabContent>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </div>
  );
};

const mapStateToProps = state => ({
  liaccounts: state.liaccounts.liaccounts,
  sequences: state.sequences.sequences,
  campaigns: state.campaigns.campaigns
});

const mapDispatchToProps = dispatch => ({
  requestCreateCampaign: (campaign, account, connectionData, repliedData) =>
    dispatch(
      requestCreateCampaign(campaign, account, connectionData, repliedData)
    )
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps)(SequenceAddEditForm)
);
