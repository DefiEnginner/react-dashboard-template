import { types } from "../actions";

const { SEQUENCE: ACTION_HEADER } = types;

const initialState = {
  sequences: [],
  loading: false,
  error: "",
  fetched: false
};

function sequenceReducer(state = initialState, action) {
  switch (action.type) {
    case ACTION_HEADER.REQUEST_UPDATE: {
      return {
        ...state,
        loading: true,
        error: ""
      };
    }
    case ACTION_HEADER.SUCCESS_UPDATE: {
      const sequences = state.sequences.slice(0);
      const { _id, name } = action.sequence;
      const identifier = "seq-" + name.replace(/\W/g, "-");

      const index = sequences.findIndex(seq => seq._id === _id);
      if (index === -1) {
        sequences.unshift({ ...action.sequence, identifier });
      } else {
        sequences[index] = { ...action.sequence, identifier };
      }
      return { ...state, loading: false, sequences };
    }

    case ACTION_HEADER.REQUEST_DELETE:
      return { ...state, loading: true, error: "" };

    case ACTION_HEADER.SUCCESS_DELETE: {
      const sequences = state.sequences.slice(0);

      const { _id } = action;
      const index = sequences.findIndex(seq => seq._id === _id);
      if (index !== -1) {
        sequences.splice(index, 1);
      }

      return { ...state, loading: false, sequences };
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
        sequences: action.sequences,
        fetched: true
      };

    case ACTION_HEADER.FAIL:
      return { ...state, loading: false, error: action.error };
    case ACTION_HEADER.NEED_FETCH:
      return { ...state, fetched: false };
    default: {
      return state;
    }
  }
}

export default sequenceReducer;
