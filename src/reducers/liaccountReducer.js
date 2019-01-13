import { types } from "../actions";

const { LIACCOUNT: ACTION_HEADER } = types;

const initialState = {
  liaccounts: [],
  loading: false,
  error: "",
  liFetched: false,
  fetchTimer: null,
  reLoginUrl: ""
};

function liaccountReducer(state = initialState, action) {
  switch (action.type) {
    case ACTION_HEADER.REQUEST_ADD: {
      return {
        ...state,
        loading: true,
        error: ""
      };
    }
    case ACTION_HEADER.SUCCESS_ADD: {
      const liaccounts = state.liaccounts.slice(0);
      const { imageurl: profileImg, profileLink } = action.account;
      liaccounts.push({
        ...action.account,
        profileImg,
        identifier: profileLink.split("/").reverse()[1]
      });
      return { ...state, loading: false, liaccounts };
    }

    case ACTION_HEADER.REQUEST_GET:
      return {
        ...state,
        loading: true,
        error: ""
      };
    case ACTION_HEADER.SUCCESS_GET:
      return {
        ...state,
        loading: false,
        liaccounts: action.accounts,
        liFetched: true
      };

    case ACTION_HEADER.REQUEST_DELETE:
      return { ...state, loading: true, error: "" };

    case ACTION_HEADER.SUCCESS_DELETE: {
      const liaccounts = state.liaccounts.slice(0);

      const { _id } = action;
      const index = liaccounts.findIndex(acc => acc._id === _id);
      if (index !== -1) {
        liaccounts.splice(index, 1);
      }

      return { ...state, loading: false, liaccounts };
    }

    case ACTION_HEADER.REQUEST_SETTINGS:
      return { ...state, loading: true, error: "" };

    case ACTION_HEADER.SUCCESS_SETTINGS: {
      const liaccounts = state.liaccounts.slice(0);
      const { _id, settings } = action;
      const index = liaccounts.findIndex(acc => acc._id === _id);
      liaccounts[index].settings = settings;
      return { ...state, loading: false, liaccounts };
    }

    case ACTION_HEADER.REQUEST_SENDPIN:
      return { ...state, loading: true, error: "" };

    case ACTION_HEADER.SET_FETCH_TIMER:
      return { ...state, fetchTimer: action.timer };

    case ACTION_HEADER.FAIL:
      return {
        ...state,
        loading: false,
        error: action.error,
        reLoginUrl: action.args ? action.args.reLoginUrl : undefined
      };
    default: {
      return state;
    }
  }
}

export default liaccountReducer;
