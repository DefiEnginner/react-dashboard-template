import { LIACCOUNT as ACTION_HEADER } from "./types";

export function requestAddAccount(email, password) {
  return { type: ACTION_HEADER.REQUEST_ADD, email, password };
}

export function successAddAccount(account) {
  return { type: ACTION_HEADER.SUCCESS_ADD, account };
}

export function requestGetAccounts() {
  return { type: ACTION_HEADER.REQUEST_GET };
}

export function successGetAccounts(accounts) {
  return { type: ACTION_HEADER.SUCCESS_GET, accounts };
}

export function requestSendPIN(email, password, pin, reLoginUrl) {
  return {
    type: ACTION_HEADER.REQUEST_SENDPIN,
    email,
    password,
    pin,
    reLoginUrl
  };
}

export function successSendPIN(account) {
  return { type: ACTION_HEADER.SUCCESS_SENDPIN, account };
}

export function requestDeleteAccount(_id) {
  return { type: ACTION_HEADER.REQUEST_DELETE, _id };
}

export function successDeleteAccount(_id) {
  return { type: ACTION_HEADER.SUCCESS_DELETE, _id };
}

export function requestChangeSettings(_id, settings) {
  return { type: ACTION_HEADER.REQUEST_SETTINGS, _id, settings };
}

export function successChangeSettings(_id, settings) {
  return { type: ACTION_HEADER.SUCCESS_SETTINGS, _id, settings };
}

export function setFetchTimer(timer) {
  return { type: ACTION_HEADER.SET_FETCH_TIMER, timer };
}

export function fail(error, args) {
  return { type: ACTION_HEADER.FAIL, error, args };
}
