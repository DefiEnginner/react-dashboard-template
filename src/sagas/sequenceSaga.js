import { takeLatest, all, put } from "redux-saga/effects";
import { types, sequenceActions } from "../actions";
import { backendUrl } from "../utils";
import axios from "axios";
import { push } from "connected-react-router";
import { removeToken } from "actions/userActions";

const { SEQUENCE } = types;
const {
  successUpdateSequence,
  successGetSequences,
  successDeleteSequence,
  fail
} = sequenceActions;

const baseURL = backendUrl + "/sequence";

const secondsToTimeout = secs => {
  const timeoutNumber =
    secs >= 3600 * 24
      ? secs / 3600 / 24
      : secs >= 3600
      ? secs / 3600
      : secs >= 60
      ? secs / 60
      : 0;
  const timeoutUnit =
    secs >= 3600 * 24 ? "days" : secs >= 3600 ? "hours" : "minutes";

  return { timeoutNumber: Math.floor(timeoutNumber), timeoutUnit };
};

const tofrdSequences = sequences => {
  return sequences.map(({ name, msg, timeout, option }) => ({
    name,
    msg,
    stopPrevDetected: option,
    toggle: true,
    ...secondsToTimeout(timeout)
  }));
};

// add/update sequence request saga
function* requestUpdateSequence(action) {
  const { sequence, account } = action;
  // console.log("update", sequence);
  try {
    const caller = sequence._id ? axios.put : axios.post;
    const resp = yield caller(baseURL, {
      name: sequence.name,
      liEmail: sequence.liEmail,
      sequences: sequence.steps,
      id: sequence._id
    });

    // console.log("success update sequence", resp.data);
    yield put(
      successUpdateSequence({
        ...resp.data,
        sequences: tofrdSequences(resp.data.sequences)
      })
    );
    yield put(push(`/admin/${account}/sequences`));
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

// delete sequence request saga
function* requestDeleteSequence(action) {
  const { _id, account } = action;
  // console.log("delete sequence", _id);
  try {
    yield axios.delete(`${baseURL}/${_id}`);

    // console.log("success delete sequence", resp.data);
    yield put(successDeleteSequence(_id));
    yield put(push(`/admin/${account}/sequences`));
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

// get sequences request saga
function* requestGetSequences(action) {
  try {
    const { liEmail } = action;
    const resp = yield axios.get(`${baseURL}?liEmail=${liEmail}`);
    // console.log("success get sequences", resp.data.docs);
    const sequences = resp.data.docs.map(seq => ({
      ...seq,
      sequences: tofrdSequences(seq.sequences),
      identifier: "seq-" + seq.name.replace(/\W/g, "-")
    }));
    yield put(successGetSequences(sequences));
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

function* sequenceSaga() {
  yield all([
    takeLatest(SEQUENCE.REQUEST_UPDATE, requestUpdateSequence),
    takeLatest(SEQUENCE.REQUEST_GET, requestGetSequences),
    takeLatest(SEQUENCE.REQUEST_DELETE, requestDeleteSequence)
  ]);
}

export default sequenceSaga;
