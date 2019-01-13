import { takeLatest, all, put } from "redux-saga/effects";
import { types, userActions } from "../actions";
import { backendUrl } from "../utils";
import axios from "axios";
import { push } from "connected-react-router";
import { removeToken } from "actions/userActions";

const { USER } = types;
const {
  successLogin,
  failLogin,
  successRegister,
  failRegister,
  successGetUser,
  failGetUser
} = userActions;

const loginURL = "/login";
const registerURL = "/register";
const userURL = "/users";
const verifyURL = "/reverify";

// login request saga
function* requestLogin(action) {
  // console.log("request login");
  const { email, password } = action;
  try {
    const resp = yield axios.post(backendUrl + loginURL, { email, password });
    const { token, user } = resp.data;
    if (token) {
      yield put(successLogin(token, user));
      if (!user.verified) {
        yield put(push("/auth/verify"));
      }
    } else {
      yield put(failLogin(resp.data));
    }
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
    yield put(failLogin(error));
  }
}

function* requestRegister(action) {
  try {
    const { type, ...payloads } = action;
    const resp = yield axios.post(backendUrl + registerURL, payloads);
    console.log(resp);
    const { token } = resp.data;
    yield put(successRegister(token));
    yield put(push("/auth/verify"));
  } catch (e) {
    let error = "Network Error";
    console.log(e, e.response);
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

    // console.log("error", error);
    yield put(failRegister(error));
  }
}

function* requestGetUser(action) {
  try {
    const resp = yield axios.get(backendUrl + userURL);
    console.log(resp);
    yield put(successGetUser(resp.data));
  } catch (e) {
    console.log(e, e.response);
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
    yield put(failGetUser(error));
  }
}

function* requestVerify(action) {
  // console.log(action.verifyToken);
  yield axios.post(backendUrl + verifyURL, { token: action.verifyToken });
}

// function* changeUser(action) {
// 	try {
// 		console.log("change user ....");
// 		const resp = yield axios.put(backendUrl + "/api/user", { token: action.token });
// 		console.log("change success ....", resp.data);
// 		yield put(receiveChangeProfile(resp.data));
// 		yield put(push("/signin"));
// 	} catch (e) {
// 		console.log("change failure ...", e);
// 		yield put(cancelChangeProfile(e.response ? e.response.data.error : "Network Error"));
// 	}
// }

function* userSaga() {
  yield all([
    takeLatest(USER.REQUEST_LOGIN, requestLogin),
    takeLatest(USER.REQUEST_REGISTER, requestRegister),
    takeLatest(USER.REQUEST_GETUSER, requestGetUser),
    takeLatest(USER.REQUEST_VERIFY, requestVerify)
    // takeLatest(USER.CHANGEPROFILE_REQUEST, changeUser)
  ]);
}

export default userSaga;
