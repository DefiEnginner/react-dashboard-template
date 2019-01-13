import React from "react";
import { Card, CardHeader, CardBody, CardTitle } from "reactstrap";
import ReactTable from "react-table";
import {
  dateRange,
  statusCount,
  connectedCount,
  repliedCount
} from "../../../utils";
import moment from "moment";

const CampaignDailyLogCard = props => {
  const { campaign } = props;
  let logData = [];
  if (campaign) {
    const { createdAt, data, connectionData, repliedData } = campaign;
    logData = dateRange(createdAt, moment().add(1, "day"))
      .reverse()
      .map(date => ({
        date: date.format("DD/MM"),
        visits: statusCount(data, "VISIT", 1, date),
        follows: statusCount(data, "FOLLOW", 1, date),
        requests: statusCount(data, "CONNECT", 1, date),
        accepted: connectedCount(connectionData, date),
        replies: repliedCount(repliedData, date)
      }))
      .filter(
        row =>
          row.visits ||
          row.follows ||
          row.requests ||
          row.accepted ||
          row.replies
      );
  }

  const headers = [
    "Date",
    "Visits",
    "Follows",
    "Requests",
    "Accepted",
    "Replies"
  ];
  return (
    <Card className="dash-daily-table">
      <CardHeader>
        <CardTitle tag="h4">Campaign Results</CardTitle>
        <h5 className="card-category el-inline">
          Daily log of campaign interactions
        </h5>
      </CardHeader>
      <CardBody style={{ paddingTop: 0 }}>
        <ReactTable
          data={logData}
          columns={headers.map(header => ({
            Header: header,
            accessor: header.toLowerCase(),
            sortable: true,
            filterable: false
          }))}
          defaultPageSize={5}
          showPaginationTop={false}
          showPaginationBottom={true}
          /*
                  You can choose between primary-pagination, info-pagination, success-pagination, warning-pagination, danger-pagination or none - which will make the pagination buttons gray
                */
          className=" -highlight"
        />
      </CardBody>
    </Card>
  );
};

export default CampaignDailyLogCard;
