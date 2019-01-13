import { types } from "../actions";
import Cookies from "js-cookie";
import { DEFAULT_EXPIRATION_TIME } from "../utils";
import axios from "axios";

const { USER: ACTION_HEADER } = types;

const initialState = {
  token: Cookies.get("BRJWT") || null,
  loading: false,
  error: "",
  remember: false,
  user: null,
  verifyToken: null
};

if (initialState.token) {
  axios.defaults.headers.common.Authorization = initialState.token;
}

function authReducer(state = initialState, action) {
  switch (action.type) {
    case ACTION_HEADER.REQUEST_LOGIN: {
      return {
        ...state,
        loading: true,
        error: "",
        remember: action.remember
      };
    }
    case ACTION_HEADER.SUCCESS_LOGIN: {
      const { token, user } = action.payload;
      if (user.verified) {
        Cookies.remove("BRJWT");
        const d = new Date();
        if (state.remember) {
          Cookies.set("BRJWT", token);
        } else {
          d.setTime(d.getTime() + DEFAULT_EXPIRATION_TIME * 1000);
          Cookies.set("BRJWT", token, { expires: d });
        }

        axios.defaults.headers.common.Authorization = token;
        return {
          ...state,
          token,
          user,
          loading: false,
          remember: false
        };
      }
      return {
        ...state,
        verifyToken: token,
        user,
        loading: false,
        token: null
      };
    }
    case ACTION_HEADER.FAIL_LOGIN:
      return { ...state, token: null, loading: false, error: action.error };
    case ACTION_HEADER.LOGOUT:
      Cookies.remove("BRJWT");
      delete axios.defaults.headers.common.Authorization;
      return { ...state, token: null, user: null };

    case ACTION_HEADER.REQUEST_REGISTER:
      return { ...state, loading: true };
    case ACTION_HEADER.SUCCESS_REGISTER:
      return { ...state, verifyToken: action.token, token: null };
    case ACTION_HEADER.FAIL_REGISTER:
      return { ...state, token: null, error: action.error, loading: false };

    case ACTION_HEADER.REQUEST_GETUSER:
      return { ...state, loading: true };
    case ACTION_HEADER.SUCCESS_GETUSER:
      return { ...state, user: action.user, loading: false };
    case ACTION_HEADER.FAIL_GETUSER:
      return { ...state, error: action.error, loading: false };

    case ACTION_HEADER.REMOVE_TOKEN:
      Cookies.remove("BRJWT");
      return { ...state, token: null };

    default: {
      return state;
    }
  }
}

export default authReducer;
