import React from "react";
import { Card, CardHeader, CardBody, CardFooter, CardTitle } from "reactstrap";
import { Line } from "react-chartjs-2";
import { chartExample12 } from "variables/charts.jsx";

import { recentDays, statusCount, connectedCount } from "../../../utils";

const CampaignAnalysisCard = props => {
  const recentDates = recentDays(10);
  const { campaign } = props;

  let connectionData = [];
  let acceptance = 0;

  if (campaign) {
    connectionData = recentDates.map(date => ({
      requested: statusCount(campaign.data, "CONNECT", 1, date),
      accepted: connectedCount(campaign.connectionData, date)
    }));
    const requestedTotal = connectionData.reduce(
      (sum, val) => (sum += val.requested),
      0
    );
    const acceptedTotal = connectionData.reduce(
      (sum, val) => (sum += val.accepted),
      0
    );

    if (requestedTotal) {
      acceptance = ((acceptedTotal * 100) / requestedTotal).toFixed(1);
    }
  }

  const graphData = {
    labels: recentDates.map(date => date.format("MMM D")),
    datasets: [2, 1].map(key => ({
      label: key === 1 ? "Requests sent" : "New connections",
      borderColor: key === 1 ? "#fbc658" : "#51bcda",
      backgroundColor: key === 1 ? "#fbc658" : "#51bcda",
      pointRadius: 0,
      pointHoverRadius: 0,
      borderWidth: 3,
      data:
        key === 1
          ? connectionData.map(({ requested }) => requested)
          : connectionData.map(({ accepted }) => accepted)
    }))
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle tag="h4" className="el-inline">
          Outreach Analysis
        </CardTitle>
        <p className="pull-right el-inline">
          <span className="badge badge-pill badge-brown-border">{`${acceptance}% acceptance`}</span>
        </p>
      </CardHeader>
      <CardBody>
        <Line data={graphData} options={chartExample12.options} />
      </CardBody>
      <CardFooter>
        <div className="legend">
          <i className="fa fa-circle text-warning" />
          Requests sent &nbsp; <i className="fa fa-circle text-info" />
          New connections
        </div>
      </CardFooter>
    </Card>
  );
};

export default CampaignAnalysisCard;
