import { types } from "../actions";

const { PLAN: ACTION_HEADER } = types;

const initialState = {
  loading: false,
  error: "",
  plans: []
};

function planReducer(state = initialState, action) {
  switch (action.type) {
    case ACTION_HEADER.REQUEST_PLANS:
      return { ...state, loading: true };
    case ACTION_HEADER.SUCCESS_PLANS:
      return { ...state, plans: action.plans, loading: false };
    case ACTION_HEADER.REQUEST_ACTIVATE:
      return { ...state, loading: true };
    case ACTION_HEADER.SUCCESS_ACTIVATE:
      return { ...state, loading: false };
    case ACTION_HEADER.REQUEST_UPGRADE:
      return { ...state, loading: true };
    case ACTION_HEADER.SUCCESS_UPGRADE:
      return { ...state, loading: false };
    case ACTION_HEADER.REQUEST_UNSUBSCRIBE:
      return { ...state, loading: true };
    case ACTION_HEADER.SUCCESS_UNSUBSCRIBE:
      return { ...state, loading: false };
    case ACTION_HEADER.REQUEST_REACTIVATE:
      return { ...state, loading: true };
    case ACTION_HEADER.SUCCESS_REACTIVATE:
      return { ...state, loading: false };
    case ACTION_HEADER.FAIL:
      return { ...state, error: action.error, loading: false };
    default: {
      return state;
    }
  }
}

export default planReducer;
