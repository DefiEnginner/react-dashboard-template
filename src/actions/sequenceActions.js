import { SEQUENCE as ACTION_HEADER } from "./types";

export function requestUpdateSequence(sequence, account) {
  return { type: ACTION_HEADER.REQUEST_UPDATE, sequence, account };
}

export function successUpdateSequence(sequence) {
  return { type: ACTION_HEADER.SUCCESS_UPDATE, sequence };
}

export function requestGetSequences(liEmail) {
  return { type: ACTION_HEADER.REQUEST_GET, liEmail };
}

export function successGetSequences(sequences) {
  return { type: ACTION_HEADER.SUCCESS_GET, sequences };
}

export function requestDeleteSequence(_id, account) {
  return { type: ACTION_HEADER.REQUEST_DELETE, _id, account };
}

export function successDeleteSequence(_id) {
  return { type: ACTION_HEADER.SUCCESS_DELETE, _id };
}

export function fail(error) {
  return { type: ACTION_HEADER.FAIL, error };
}

export function setSeqFetch() {
  return { type: ACTION_HEADER.NEED_FETCH };
}
