import { takeLatest, all, put } from "redux-saga/effects";
import { types, planActions, userActions } from "../actions";
import { backendUrl } from "../utils";
import getError from "./getError";
import axios from "axios";
import { push } from "connected-react-router";
import { successActivatePlan } from "actions/planActions";
import { successUpgradePlan } from "actions/planActions";
import { successUnsubscribe } from "actions/planActions";
import { successReactivate } from "actions/planActions";
import { requestGetUser } from "actions/userActions";

const { PLAN } = types;
const { successGetPlans, fail } = planActions;

const planURL = backendUrl + "/stripe";

function* requestGetPlans() {
  try {
    const resp = yield axios.get(planURL + "/plans");
    yield put(successGetPlans(resp.data));
  } catch (e) {
    const error = getError(e);
    yield put(fail(error));
  }
}

function* requestActivatePlan(action) {
  const { planId } = action;
  console.log("activate plan", planId);
  try {
    const resp = yield axios.get(planURL + "/endTrial");
    console.log("asdf", resp);
    if (planId) {
      yield axios.post(planURL + "/upgradePlan", {
        planID: planId
      });
    }
    yield put(successActivatePlan());
  } catch (e) {
    console.log(e, e.response);
    const error = getError(e);
    yield put(fail(error));
  }
}

function* requestUpgradePlan(action) {
  const { planId } = action;
  try {
    const resp = yield axios.post(planURL + "/upgradePlan", {
      planID: planId
    });
    console.log(resp);
    yield put(successUpgradePlan());
  } catch (e) {
    console.log(e, e.response);
    const error = getError(e);
    yield put(fail(error));
  }
}

function* requestUnsubscribe() {
  try {
    const resp = yield axios.get(planURL + "/unsubscribe");
    console.log(resp);
    yield put(successUnsubscribe());
    yield put(requestGetUser());
  } catch (e) {
    console.log(e, e.response);
    const error = getError(e);
    yield put(fail(error));
  }
}

function* requestReactivate() {
  try {
    const resp = yield axios.get(planURL + "/reactivate");
    console.log(resp);
    yield put(successReactivate());
    yield put(requestGetUser());
  } catch (e) {
    console.log(e, e.response);
    const error = getError(e);
    yield put(fail(error));
  }
}

function* planSaga() {
  yield all([
    takeLatest(PLAN.REQUEST_PLANS, requestGetPlans),
    takeLatest(PLAN.REQUEST_ACTIVATE, requestActivatePlan),
    takeLatest(PLAN.REQUEST_UPGRADE, requestUpgradePlan),
    takeLatest(PLAN.REQUEST_UNSUBSCRIBE, requestUnsubscribe),
    takeLatest(PLAN.REQUEST_REACTIVATE, requestReactivate)
    // takeLatest(USER.CHANGEPROFILE_REQUEST, changeUser)
  ]);
}

export default planSaga;
