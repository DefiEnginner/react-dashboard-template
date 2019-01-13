import { all, fork } from "redux-saga/effects";
import userSaga from "./userSaga";
import liaccountSaga from "./liaccountSaga";
import sequenceSaga from "./sequenceSaga";
import campaignSaga from "./campaignSaga";
import planSaga from "./planSaga";

export default function* rootSaga() {
  yield all([
    fork(userSaga),
    fork(liaccountSaga),
    fork(sequenceSaga),
    fork(campaignSaga),
    fork(planSaga)
  ]);
}
