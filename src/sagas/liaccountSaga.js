import { takeLatest, all, put } from "redux-saga/effects";
import { types, liaccountActions } from "../actions";
import { backendUrl } from "../utils";
import axios from "axios";
import { successChangeSettings } from "actions/liaccountActions";
import { removeToken } from "actions/userActions";
import getError from "./getError";

const { LIACCOUNT } = types;
const {
  successAddAccount,
  successGetAccounts,
  successDeleteAccount,
  fail
} = liaccountActions;

const baseURL = backendUrl + "/linkedin";
const registerURL = "/login";
const verifyURL = "/login-verify";

// add account request saga
function* requestAddAccount(action) {
  const { email, password } = action;
  try {
    const resp = yield axios.post(baseURL + registerURL, { email, password });
    console.log(resp);
    yield put(successAddAccount(resp.data));
  } catch (e) {
    console.log(e, e.response);
    const error = getError(e);
    const reLoginUrl = e.response.data.errors.reLoginUrl
      ? e.response.data.errors.reLoginUrl
      : "";
    yield put(fail(error, { reLoginUrl }));
  }
}

// delete account request saga
function* requestDeleteAccount(action) {
  const { _id } = action;
  try {
    const resp = yield axios.delete(`${baseURL}/${_id}`);
    yield put(successDeleteAccount(_id));
  } catch (e) {
    let error = "Network Error";
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

// get accounts request saga
function* requestGetAccounts(action) {
  try {
    const resp = yield axios.get(baseURL);
    // console.log("success get li accounts", resp);
    yield put(
      successGetAccounts(
        resp.data.docs.map(acc => {
          const { imageurl: profileImg, profileLink } = acc;
          const identifier = profileLink.split("/").reverse()[1];
          return { ...acc, profileImg, identifier };
        })
      )
    );
  } catch (e) {
    let error = "Network Error";
    if (e.response) {
      if (!e.response.data.errors) {
        error = e.response.data;
        // console.log(error);
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

function* requestChangeSettings(action) {
  const { _id, settings } = action;
  try {
    // console.log("change settings ...", settings);
    yield axios.put(`${baseURL}/${_id}`, { settings });
    // console.log("success update settings", resp);
    yield put(successChangeSettings(_id, settings));
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

function* requestSendPIN(action) {
  const { email, password, pin, reLoginUrl } = action;
  try {
    const resp = yield axios.post(baseURL + verifyURL, {
      email,
      password,
      code: pin,
      reLoginUrl
    });
    // console.log("success send pin", resp);
    yield put(successAddAccount(resp.data));
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

function* liaccountSaga() {
  yield all([
    takeLatest(LIACCOUNT.REQUEST_ADD, requestAddAccount),
    takeLatest(LIACCOUNT.REQUEST_GET, requestGetAccounts),
    takeLatest(LIACCOUNT.REQUEST_DELETE, requestDeleteAccount),
    takeLatest(LIACCOUNT.REQUEST_SETTINGS, requestChangeSettings),
    takeLatest(LIACCOUNT.REQUEST_SENDPIN, requestSendPIN)
  ]);
}

export default liaccountSaga;
