// Sequence Page

import React from "react";
import CampaignManager from "./CampaignManager";
import CampaignAddPage from "./CampaignAddPage";
import CampaignDetailsPage from "./CampaignDetailsPage";
import CampaignProspectsPage from "./CampaignProspectsPage";

const CampaignPage = props => {
  const { identifier } = props.match.params;

  return !identifier ? (
    <CampaignManager {...props} />
  ) : identifier === "new" ? (
    <CampaignAddPage {...props} />
  ) : identifier.startsWith("details") ? (
    <CampaignDetailsPage {...props} />
  ) : identifier.startsWith("prospects") ? (
    <CampaignProspectsPage {...props} />
  ) : (
    <div />
  );
};

export default CampaignPage;
