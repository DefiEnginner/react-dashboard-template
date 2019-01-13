import { combineReducers } from "redux";
import authReducer from "./authReducer";
import liaccountReducer from "./liaccountReducer";
import sequenceReducer from "./sequenceReducer";
import campaignReducer from "./campaignReducer";
import planReducer from "./planReducer";
import { connectRouter } from "connected-react-router";

const appReducer = history =>
  combineReducers({
    authentication: authReducer,
    liaccounts: liaccountReducer,
    sequences: sequenceReducer,
    campaigns: campaignReducer,
    plans: planReducer,
    router: connectRouter(history)
  });

function rootReducer(history) {
  return appReducer(history);
}

export default rootReducer;
