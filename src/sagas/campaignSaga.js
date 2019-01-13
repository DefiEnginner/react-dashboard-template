import { takeLatest, all, put, takeEvery, call } from "redux-saga/effects";
import { types, campaignActions } from "../actions";
import { backendUrl } from "../utils";
import axios from "axios";
import { push } from "connected-react-router";
import { removeToken } from "actions/userActions";
import getError from "./getError";

const { CAMPAIGN: ACTION_HEADER } = types;
const {
  successCreateCampaign,
  successGetCampaigns,
  successDeleteCampaign,
  successStartCampaign,
  successPauseCampaign,
  successExcludeTarget,
  successGetContactInfo,
  finishLoading,
  fail
} = campaignActions;

const baseURL = backendUrl + "/campaign";

// add/update sequence request saga
function* requestCreateCampaign(action) {
  const { campaign, account, connectionData, repliedData } = action;
  try {
    const resp = yield axios.post(baseURL, campaign);

    // console.log("success create campaign", resp.data);
    const campaignData = {
      ...resp.data,
      identifier: "camp-" + resp.data.name.split(" -> ")[1].replace(/\W/g, "-"),
      connectionData: connectionData
        .map(dat => {
          const target = resp.data.targets.filter(
            campTarget =>
              campTarget.targetLink.split("/").reverse()[1] ===
              dat.targetLink.split("/").reverse()[1]
          )[0];
          return target
            ? {
                targetName: target.name,
                date: dat.date,
                targetLink: target.targetLink
              }
            : null;
        })
        .filter(Boolean),
      repliedData: repliedData
        .map(dat => {
          const target = resp.data.targets.filter(
            campTarget =>
              campTarget.targetLink.split("/").reverse()[1] ===
              dat.targetLink.split("/").reverse()[1]
          )[0];
          return target
            ? {
                targetName: target.name,
                date: dat.createdAt,
                targetLink: target.targetLink
              }
            : null;
        })
        .filter(Boolean)
    };

    yield put(successCreateCampaign(campaignData));
    yield put(push(`/admin/${account}/campaigns`));
  } catch (e) {
    let error = "Network Error";
    // console.log(e, e.response);
    if (e.response) {
      if (!e.response.data.errors) {
        error = e.response.data;
        if (error === "Unauthorized") {
          yield put(removeToken());
        }
      } else if (typeof e.response.data.errors.msg === "object") {
        error = e.response.data.errors.msg[0].msg;
      } else {
        error = e.response.data.errors.msg;
      }
    }
    yield put(fail(error));
  }
}

// delete campaign request saga
function* requestDeleteCampaign(action) {
  const { _id, account } = action;
  // console.log("delete campaign", _id);
  try {
    yield axios.delete(`${baseURL}/${_id}`);

    // console.log("success delete campaign", resp.data);
    yield put(successDeleteCampaign(_id));
    yield put(push(`/admin/${account}/campaigns`));
  } catch (e) {
    let error = "Network Error";
    // console.log(e, e.response);
    if (e.response) {
      if (!e.response.data.errors) {
        error = e.response.data;
        if (error === "Unauthorized") {
          yield put(removeToken());
        }
      } else if (typeof e.response.data.errors.msg === "object") {
        error = e.response.data.errors.msg[0].msg;
      } else {
        error = e.response.data.errors.msg;
      }
    }
    yield put(fail(error));
  }
}

// start campaign request saga
function* requestStartCampaign(action) {
  const { _id, mode } = action;
  // console.log("start campaign", _id, mode);
  try {
    const resp = yield axios.post(`${baseURL}/${mode}/${_id}`);

    // console.log("success start campaign", resp.data);
    yield put(successStartCampaign(resp.data));
  } catch (e) {
    let error = "Network Error";
    // console.log(e, e.response);
    if (e.response) {
      if (!e.response.data.errors) {
        error = e.response.data;
        if (error === "Unauthorized") {
          yield put(removeToken());
        }
      } else if (typeof e.response.data.errors.msg === "object") {
        error = e.response.data.errors.msg[0].msg;
      } else {
        error = e.response.data.errors.msg;
      }
    }
    yield put(fail(error));
  }
}

// pause campaign request saga
function* requestPauseCampaign(action) {
  const { _id } = action;
  // console.log("pause campaign", _id);
  try {
    const resp = yield axios.post(`${baseURL}/pause/${_id}`);

    // console.log("success pause campaign", resp.data);
    yield put(successPauseCampaign(resp.data));
  } catch (e) {
    let error = "Network Error";
    // console.log(e, e.response);
    if (e.response) {
      if (!e.response.data.errors) {
        error = e.response.data;
        if (error === "Unauthorized") {
          yield put(removeToken());
        }
      } else if (typeof e.response.data.errors.msg === "object") {
        error = e.response.data.errors.msg[0].msg;
      } else {
        error = e.response.data.errors.msg;
      }
    }
    yield put(fail(error));
  }
}

// get sequences request saga
function* requestGetCampaigns(action) {
  try {
    const { liEmail, connectionData, repliedData } = action;
    const resp = yield axios.get(`${baseURL}?liEmail=${liEmail}`);
    // console.log("success get campaigns", resp.data);
    const campaigns = resp.data.map(camp => ({
      ...camp,
      identifier: "camp-" + camp.name.split(" -> ")[1].replace(/\W/g, "-"),
      connectionData: connectionData
        .map(dat => {
          const target = camp.targets.filter(
            campTarget =>
              campTarget.targetLink.split("/").reverse()[1] ===
              dat.targetLink.split("/").reverse()[1]
          )[0];
          return target
            ? {
                targetName: target.name,
                date: dat.date,
                targetLink: target.targetLink
              }
            : null;
        })
        .filter(Boolean),
      repliedData: repliedData
        .map(dat => {
          const target = camp.targets.filter(
            campTarget =>
              campTarget.targetLink.split("/").reverse()[1] ===
              dat.targetLink.split("/").reverse()[1]
          )[0];
          return target
            ? {
                targetName: target.name,
                date: dat.createdAt,
                targetLink: target.targetLink
              }
            : null;
        })
        .filter(Boolean)
    }));
    // console.log(campaigns);
    yield put(successGetCampaigns(campaigns));
  } catch (e) {
    const error = getError(e);
    if (error === "Unauthorized") {
      yield put(removeToken());
    }
    yield put(fail(error));
  }
}

function* requestExcludeTarget(action) {
  const {
    browserKey,
    targetLink,
    salesLink,
    campIdentifier,
    targetIndex
  } = action;
  try {
    yield axios.post(`${baseURL}/excludeTarget`, {
      browserKey,
      targetLink: targetLink ? targetLink : undefined,
      salesLink: targetLink ? undefined : salesLink
    });
    yield put(successExcludeTarget(campIdentifier, targetIndex));
  } catch (e) {
    const error = getError(e);
    if (error === "Unauthorized") {
      yield put(removeToken());
    }
    yield put(fail(error));
  }
}

function* contactInfoPerOne({
  targetLink,
  salesLink,
  targetIndex,
  campIdentifier
}) {
  try {
    const resp = yield axios.post(`${backendUrl}/target?`, {
      targetLink: targetLink ? targetLink : undefined,
      salesLink: targetLink ? undefined : salesLink
    });
    yield put(
      successGetContactInfo(resp.data || "", campIdentifier, targetIndex)
    );
  } catch (e) {
    const error = getError(e);
    if (error === "Unauthorized") {
      yield put(removeToken());
    }
  }
}

function* requestGetContactInfo(action) {
  yield all(action.targets.map(target => contactInfoPerOne(target)));
  yield put(finishLoading());
}

function* campaignSaga() {
  yield all([
    takeLatest(ACTION_HEADER.REQUEST_CREATE, requestCreateCampaign),
    takeLatest(ACTION_HEADER.REQUEST_GET, requestGetCampaigns),
    takeLatest(ACTION_HEADER.REQUEST_DELETE, requestDeleteCampaign),
    takeLatest(ACTION_HEADER.REQUEST_START, requestStartCampaign),
    takeLatest(ACTION_HEADER.REQUEST_PAUSE, requestPauseCampaign),
    takeLatest(ACTION_HEADER.EXCLUDE_TARGET, requestExcludeTarget),
    takeEvery(ACTION_HEADER.REQUEST_CONTACT, requestGetContactInfo)
  ]);
}

export default campaignSaga;
