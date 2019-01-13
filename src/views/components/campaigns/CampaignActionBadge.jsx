import React from "react";
import { Badge } from "reactstrap";

const CampaignActionBadge = ({ action }) => {
  const actionToColor = {
    Replied: "success",
    Accepted: "info",
    Requested: "dull-orange",
    Messaged: "warning",
    Followed: "magenta",
    Visited: "danger",
    None: "grey"
  };
  return (
    <Badge color={actionToColor[action]} pill>
      {action}
    </Badge>
  );
};

export default CampaignActionBadge;
