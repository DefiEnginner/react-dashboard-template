import React from "react";
import { compose } from "recompose";
import { connect } from "react-redux";

import CampaignPage from "./Campaign/CampaignPage";
import SequencePage from "./Sequence/SequencePage";
import SettingsPage from "./SettingsPage";
import ProfileManager from "./ProfileManager";

import { sequenceActions, campaignActions } from "../../actions";
import { setFetchTimer } from "actions/liaccountActions";
import { withRouter } from "react-router-dom";
const { requestGetSequences } = sequenceActions;
const { requestGetCampaigns } = campaignActions;

const ManagePage = props => {
  const {
    liaccounts,
    match: {
      params: { account, page }
    },
    loading,
    requestGetSequences,
    requestGetCampaigns,
    seqFetched,
    campFetched,
    fetchTimer,
    setFetchTimer
  } = props;

  if (account === "user-profile") {
    return <ProfileManager {...props} />;
  }

  if (
    !loading &&
    liaccounts.findIndex(acc => acc.identifier === account) === -1
  ) {
    props.history.push(`/admin`);
    return null;
  }

  if (liaccounts && liaccounts.length > 0) {
    const liaccount = liaccounts.filter(
      liacc => liacc.identifier === account
    )[0];

    if (!seqFetched) {
      requestGetSequences(liaccount.email);
    }
    if (!campFetched) {
      requestGetCampaigns(
        liaccount.email,
        liaccount.connectionData,
        liaccount.repliedData
      );
    }

    if (!fetchTimer) {
      setFetchTimer(
        setInterval(
          () =>
            requestGetCampaigns(
              liaccount.email,
              liaccount.connectionData,
              liaccount.repliedData
            ),
          15 * 60 * 1000
        )
      );
    }
  }

  switch (page) {
    case "campaigns":
      return <CampaignPage {...props} />;
    case "sequences":
      return <SequencePage {...props} />;
    case "settings":
      return <SettingsPage {...props} />;
    default:
      props.history.push(`/admin/${account}/campaigns`);
      return null;
  }
};

const mapStateToProps = state => ({
  liaccounts: state.liaccounts.liaccounts,
  loading: state.liaccounts.loading,
  seqFetched: state.sequences.fetched,
  campFetched: state.campaigns.fetched,
  fetchTimer: state.liaccounts.fetchTimer
});

const mapDispatchToProps = dispatch => ({
  requestGetSequences: liEmail => dispatch(requestGetSequences(liEmail)),
  requestGetCampaigns: (liEmail, connectionData, repliedData) =>
    dispatch(requestGetCampaigns(liEmail, connectionData, repliedData)),
  setFetchTimer: timer => dispatch(setFetchTimer(timer))
});

export default withRouter(
  compose(connect(mapStateToProps, mapDispatchToProps)(ManagePage))
);
