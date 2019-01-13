import { PLAN as ACTION_HEADER } from "./types";

export function requestGetPlans() {
  return { type: ACTION_HEADER.REQUEST_PLANS };
}

export function successGetPlans(plans) {
  return { type: ACTION_HEADER.SUCCESS_PLANS, plans };
}

export function requestActivatePlan(planId) {
  return { type: ACTION_HEADER.REQUEST_ACTIVATE, planId };
}

export function successActivatePlan() {
  return { type: ACTION_HEADER.SUCCESS_ACTIVATE };
}

export function requestUpgradePlan(planId) {
  return { type: ACTION_HEADER.REQUEST_UPGRADE, planId };
}

export function successUpgradePlan() {
  return { type: ACTION_HEADER.SUCCESS_UPGRADE };
}

export function requestUnsubscribe() {
  return { type: ACTION_HEADER.REQUEST_UNSUBSCRIBE };
}

export function successUnsubscribe() {
  return { type: ACTION_HEADER.SUCCESS_UNSUBSCRIBE };
}

export function requestReactivate() {
  return { type: ACTION_HEADER.REQUEST_REACTIVATE };
}

export function successReactivate() {
  return { type: ACTION_HEADER.SUCCESS_REACTIVATE };
}

export function fail(error) {
  return { type: ACTION_HEADER.FAIL, error };
}
