import React from "react";
import { Card, CardBody, CardTitle } from "reactstrap";

import moment from "moment";

import {
  actionToActivity,
  activityToDescription,
  formatAgo
} from "../../../utils";
import CampaignActionBadge from "./CampaignActionBadge";

const CampaignDailyLogCard = props => {
  const { campaign } = props;
  let recentActivities = [];
  if (campaign) {
    recentActivities = campaign.data
      .map(campData =>
        campData.actions.map(action => ({
          ...action,
          targetName: campData.name
        }))
      )
      .flat()
      .concat(
        campaign.connectionData.map(data => ({ ...data, name: "Accepted" }))
      )
      .concat(campaign.repliedData.map(data => ({ ...data, name: "Replied" })))
      .sort((action1, action2) =>
        moment(action1.date).isBefore(moment(action2.date)) ? 1 : -1
      )
      .slice(0, 6);
  }

  return (
    <Card className="card-timeline card-plain">
      <CardTitle tag="h4">Recent Activity</CardTitle>
      <CardBody>
        <ul className="timeline timeline-simple">
          {recentActivities.map(({ name, targetName, date }, index) => (
            <li className="timeline-inverted" key={index}>
              <div className="timeline-badge">
                {/*<i className="nc-icon nc-check-2" />*/}
              </div>
              <div className="timeline-panel">
                <div className="timeline-heading">
                  <CampaignActionBadge action={actionToActivity(name)} />
                </div>
                <div className="timeline-body">
                  <p>
                    {activityToDescription(actionToActivity(name), targetName)}
                  </p>
                </div>
                <h6>
                  <i className="ti-time" />
                  {formatAgo(date)}
                </h6>
              </div>
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
};

export default CampaignDailyLogCard;
