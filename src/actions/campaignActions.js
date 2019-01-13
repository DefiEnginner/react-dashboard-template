import { CAMPAIGN as ACTION_HEADER } from "./types";

export function requestCreateCampaign(
  campaign,
  account,
  connectionData,
  repliedData
) {
  return {
    type: ACTION_HEADER.REQUEST_CREATE,
    campaign,
    account,
    connectionData,
    repliedData
  };
}

export function successCreateCampaign(campaign) {
  return { type: ACTION_HEADER.SUCCESS_CREATE, campaign };
}

export function requestGetCampaigns(liEmail, connectionData, repliedData) {
  return {
    type: ACTION_HEADER.REQUEST_GET,
    liEmail,
    connectionData,
    repliedData
  };
}

export function successGetCampaigns(campaigns) {
  return { type: ACTION_HEADER.SUCCESS_GET, campaigns };
}

export function requestDeleteCampaign(_id, account) {
  return { type: ACTION_HEADER.REQUEST_DELETE, _id, account };
}

export function successDeleteCampaign(_id) {
  return { type: ACTION_HEADER.SUCCESS_DELETE, _id };
}

export function requestStartCampaign(_id, mode) {
  return { type: ACTION_HEADER.REQUEST_START, _id, mode };
}

export function successStartCampaign(data) {
  return { type: ACTION_HEADER.SUCCESS_START, data };
}

export function requestPauseCampaign(_id) {
  return { type: ACTION_HEADER.REQUEST_PAUSE, _id };
}

export function successPauseCampaign(data) {
  return { type: ACTION_HEADER.SUCCESS_PAUSE, data };
}

export function fail(error) {
  return { type: ACTION_HEADER.FAIL, error };
}

export function setCampFetch() {
  return { type: ACTION_HEADER.NEED_FETCH };
}

export function excludeTarget(
  browserKey,
  targetLink,
  salesLink,
  campIdentifier,
  targetIndex
) {
  return {
    type: ACTION_HEADER.EXCLUDE_TARGET,
    browserKey,
    targetLink,
    salesLink,
    campIdentifier,
    targetIndex
  };
}

export function successExcludeTarget(campIdentifier, targetIndex) {
  return {
    type: ACTION_HEADER.SUCCESS_EXCLUDE,
    campIdentifier,
    targetIndex
  };
}

export function requestGetContactInfo(targets) {
  return {
    type: ACTION_HEADER.REQUEST_CONTACT,
    targets
  };
}

export function successGetContactInfo(data, campIdentifier, targetIndex) {
  return {
    type: ACTION_HEADER.SUCCESS_CONTACT,
    data,
    campIdentifier,
    targetIndex
  };
}

export function finishLoading() {
  return { type: ACTION_HEADER.FINISH_LOADING };
}
