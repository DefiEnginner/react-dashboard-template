import { createActionTypes } from "../utils";

export const USER = createActionTypes("USER", [
  // sign in
  "REQUEST_LOGIN",
  "SUCCESS_LOGIN",
  "FAIL_LOGIN",
  //sign out
  "LOGOUT",
  // register
  "REQUEST_REGISTER",
  "SUCCESS_REGISTER",
  "FAIL_REGISTER",
  // get user
  "REQUEST_GETUSER",
  "SUCCESS_GETUSER",
  "FAIL_GETUSER",
  // verify email
  "REQUEST_VERIFY",

  // remove token
  "REMOVE_TOKEN"
]);

export const PLAN = createActionTypes("PLAN", [
  // get plans
  "REQUEST_PLANS",
  "SUCCESS_PLANS",
  // activate plan
  "REQUEST_ACTIVATE",
  "SUCCESS_ACTIVATE",
  // upgrade plan
  "REQUEST_UPGRADE",
  "SUCCESS_UPGRADE",
  // unsubscribe
  "REQUEST_UNSUBSCRIBE",
  "SUCCESS_UNSUBSCRIBE",
  // reactive plan
  "REQUEST_REACTIVATE",
  "SUCCESS_REACTIVATE",

  // fail
  "FAIL"
]);

export const LIACCOUNT = createActionTypes("LIACCOUNT", [
  // add linkedin account
  "REQUEST_ADD",
  "SUCCESS_ADD",
  // get linkedin accounts
  "REQUEST_GET",
  "SUCCESS_GET",
  // delete linkedin accounts
  "REQUEST_DELETE",
  "SUCCESS_DELETE",
  // change settings
  "REQUEST_SETTINGS",
  "SUCCESS_SETTINGS",
  // send pin
  "REQUEST_SENDPIN",

  // set fetch timer
  "SET_FETCH_TIMER",

  // fail request
  "FAIL"
]);

export const SEQUENCE = createActionTypes("SEQUENCE", [
  // add/update sequence
  "REQUEST_UPDATE",
  "SUCCESS_UPDATE",
  // get sequences
  "REQUEST_GET",
  "SUCCESS_GET",
  // delete sequence
  "REQUEST_DELETE",
  "SUCCESS_DELETE",

  // fail request
  "FAIL",

  // set fetch to false
  "NEED_FETCH"
]);

export const CAMPAIGN = createActionTypes("CAMPAIGN", [
  // add/update sequence
  "REQUEST_CREATE",
  "SUCCESS_CREATE",
  // get sequences
  "REQUEST_GET",
  "SUCCESS_GET",
  // delete campaign
  "REQUEST_DELETE",
  "SUCCESS_DELETE",
  // start campaign
  "REQUEST_START",
  "SUCCESS_START",
  // pause campaign
  "REQUEST_PAUSE",
  "SUCCESS_PAUSE",
  // get contact info
  "REQUEST_CONTACT",
  "SUCCESS_CONTACT",

  // exclude target
  "EXCLUDE_TARGET",
  "SUCCESS_EXCLUDE",

  // finish loading
  "FINISH_LOADING",

  // fail request
  "FAIL",

  // set fetch to false
  "NEED_FETCH"
]);
