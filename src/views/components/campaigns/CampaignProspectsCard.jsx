import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Button,
  UncontrolledTooltip
} from "reactstrap";
import ReactTable from "react-table";

import CampaignActionBadge from "./CampaignActionBadge";
import { actionToActivity } from "../../../utils";

const CampaignProspectsCard = props => {
  const { campaign, manageProspects } = props;
  let prospectsData = [];

  const getAction = targetLink => {
    const campData = campaign.data.filter(
      campData => campData.targetLink === targetLink
    )[0];

    const actions = [];

    if (
      campaign.repliedData.findIndex(
        dat =>
          dat.targetLink.split("/").reverse()[1] ===
          targetLink.split("/").reverse()[1]
      ) !== -1
    ) {
      actions.push("Replied");
    }
    if (
      campaign.connectionData.findIndex(
        dat =>
          dat.targetLink.split("/").reverse()[1] ===
          targetLink.split("/").reverse()[1]
      ) !== -1
    ) {
      actions.push("Accepted");
    }

    if (campData) {
      actions.push(
        ...campData.actions
          .filter(Boolean)
          .map(({ name }) => actionToActivity(name))
      );

      if (actions.indexOf("Replied") !== -1) {
        if (actions.indexOf("Requested") !== -1) {
          actions.splice(actions.indexOf("Requested"), 1);
        }
        if (actions.indexOf("Messaged") !== -1) {
          actions.splice(actions.indexOf("Messaged"), 1);
        }
      } else if (actions.indexOf("Messaged") !== -1) {
        if (actions.indexOf("Requested") !== -1) {
          actions.splice(actions.indexOf("Requested"), 1);
        }
      } else if (actions.indexOf("Accepted") !== -1) {
        if (actions.indexOf("Requested") !== -1) {
          actions.splice(actions.indexOf("Requested"), 1);
        }
      }
    }

    return actions.length ? actions : ["None"];
  };

  if (campaign) {
    const { targets } = campaign;

    prospectsData = targets.map(
      ({ imageurl, name, headline, targetLink, salesLink }) => ({
        photo: (
          <div className="img-row">
            <div className="img-wrapper">
              <a
                rel="noreferrer noopener"
                href={targetLink || salesLink}
                target="_blank"
              >
                <img
                  style={{ height: 40 }}
                  alt={name}
                  src={
                    imageurl && imageurl.startsWith("https://media-")
                      ? imageurl
                      : require("assets/img/image_placeholder.jpg")
                  }
                />
              </a>
            </div>
          </div>
        ),
        description: (
          <div>
            <strong>{`${name}`}</strong>
            <br />
            <span className="text-muted">{`${headline}`}</span>
          </div>
        ),
        targetLink,
        activity: (
          <div className="activity-badges">
            {getAction(targetLink).map((action, index) => (
              <div key={index} className="el-inline">
                {<CampaignActionBadge {...{ action }} />}
              </div>
            ))}
          </div>
        )
      })
    );
  }

  return (
    <Card className="card-tasks camp-prospect">
      <CardHeader>
        <div className="el-inline">
          <CardTitle tag="h4">Prospects</CardTitle>
          <h5 className="card-category el-inline">
            Prospects from this campaign
          </h5>
          <i className="nc-icon nc-bulb-63 text-muted" id="tooltip-manage"></i>
          <UncontrolledTooltip delay={0} target="tooltip-manage">
            Click 'Manage' button to review and manage all imported prospects.
          </UncontrolledTooltip>
        </div>
        <Button className="pull-right el-inline btn" onClick={manageProspects}>
          {`Manage`}
        </Button>
      </CardHeader>
      <CardBody style={{ paddingTop: 0 }}>
        <div className="table-full-width table-responsive prospects-table">
          <ReactTable
            data={prospectsData}
            columns={[
              {
                Header: "",
                accessor: "photo",
                sortable: false,
                filterable: false,
                width: 70
              },
              {
                Header: "",
                accessor: "description",
                sortable: false,
                filterable: false
              },
              {
                Header: "Activity",
                accessor: "activity",
                sortable: true,
                filterable: false,
                width: 250
              }
            ]}
            defaultPageSize={5}
            defaultSorted={[
              {
                id: "activity"
              }
            ]}
            showPaginationTop={false}
            showPaginationBottom={true}
            /*
                  You can choose between primary-pagination, info-pagination, success-pagination, warning-pagination, danger-pagination or none - which will make the pagination buttons gray
                */
            className=" -highlight"
          />
        </div>
      </CardBody>
    </Card>
  );
};

export default CampaignProspectsCard;
