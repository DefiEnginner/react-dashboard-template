import { USER as ACTION_HEADER } from "./types";

export function requestLogin(email, password) {
  return { type: ACTION_HEADER.REQUEST_LOGIN, email, password };
}

export function successLogin(token, user) {
  return {
    type: ACTION_HEADER.SUCCESS_LOGIN,
    payload: { token, user, remember: false }
  };
}

export function failLogin(error) {
  return { type: ACTION_HEADER.FAIL_LOGIN, error };
}

export function logout() {
  return { type: ACTION_HEADER.LOGOUT };
}

export function requestRegister(email, password, token, planID) {
  return {
    type: ACTION_HEADER.REQUEST_REGISTER,
    email,
    password,
    token,
    planID
  };
}

export function successRegister(token) {
  return { type: ACTION_HEADER.SUCCESS_REGISTER, token };
}

export function failRegister(error) {
  return { type: ACTION_HEADER.FAIL_REGISTER, error };
}

export function requestGetUser() {
  return { type: ACTION_HEADER.REQUEST_GETUSER };
}

export function successGetUser(user) {
  return { type: ACTION_HEADER.SUCCESS_GETUSER, user };
}

export function failGetUser(error) {
  return { type: ACTION_HEADER.FAIL_GETUSER, error };
}

export function requestVerify(verifyToken) {
  return { type: ACTION_HEADER.REQUEST_VERIFY, verifyToken };
}

export function removeToken() {
  return { type: ACTION_HEADER.REMOVE_TOKEN };
}

// export function requestChangeProfile(token) {
// 	return { type: USER.CHANGEPROFILE_REQUEST, token };
// }

// export function receiveChangeProfile(user) {
// 	return { type: USER.CHANGEPROFILE_SUCCESS, user };
// }
