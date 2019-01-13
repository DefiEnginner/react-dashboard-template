import { types } from "../actions";

const { CAMPAIGN: ACTION_HEADER } = types;

const initialState = {
  campaigns: [],
  loading: false,
  error: "",
  fetched: false
};

function campaignReducer(state = initialState, action) {
  switch (action.type) {
    case ACTION_HEADER.REQUEST_CREATE: {
      return {
        ...state,
        loading: true,
        error: ""
      };
    }
    case ACTION_HEADER.SUCCESS_CREATE: {
      const campaigns = state.campaigns ? state.campaigns.slice(0) : [];
      const { _id } = action.campaign;

      const index = campaigns.findIndex(camp => camp._id === _id);
      if (index === -1) {
        campaigns.push(action.campaign);
      } else {
        campaigns[index] = action.campaign;
      }
      return { ...state, loading: false, campaigns };
    }

    case ACTION_HEADER.REQUEST_DELETE:
      return { ...state, loading: true, error: "" };

    case ACTION_HEADER.SUCCESS_DELETE: {
      const campaigns = state.campaigns.slice(0);

      const { _id } = action;
      const index = campaigns.findIndex(seq => seq._id === _id);
      if (index !== -1) {
        campaigns.splice(index, 1);
      }

      return { ...state, loading: false, campaigns };
    }

    case ACTION_HEADER.REQUEST_START:
      return { ...state, loading: true, error: "" };

    case ACTION_HEADER.SUCCESS_START: {
      const campaigns = state.campaigns.slice(0);

      const { data: camp } = action;
      const index = campaigns.findIndex(seq => seq._id === camp._id);
      if (index !== -1) {
        campaigns[index].isRunning = true;
      }

      return { ...state, loading: false, campaigns };
    }

    case ACTION_HEADER.REQUEST_PAUSE:
      return { ...state, loading: true, error: "" };

    case ACTION_HEADER.SUCCESS_PAUSE: {
      const campaigns = state.campaigns.slice(0);

      const { data: camp } = action;
      const index = campaigns.findIndex(seq => seq._id === camp._id);
      if (index !== -1) {
        campaigns[index].isRunning = false;
      }

      return { ...state, loading: false, campaigns };
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
        campaigns: action.campaigns,
        fetched: true
      };

    case ACTION_HEADER.EXCLUDE_TARGET:
      return { ...state, loading: true };
    case ACTION_HEADER.SUCCESS_EXCLUDE: {
      const { campIdentifier, targetIndex } = action;
      const campaigns = state.campaigns.slice(0);
      const campaign = campaigns.filter(
        camp => camp.identifier === campIdentifier
      )[0];
      if (campaign) {
        campaign.targets[targetIndex].notExcluded = !campaign.targets[
          targetIndex
        ].notExcluded;
        return { ...state, loading: false, campaigns };
      }
    }

    case ACTION_HEADER.REQUEST_CONTACT:
      return { ...state, loading: true };
    case ACTION_HEADER.SUCCESS_CONTACT: {
      const campaigns = state.campaigns.slice(0);
      const { campIdentifier, targetIndex, data, finished } = action;
      const campaign = campaigns.filter(
        camp => camp.identifier === campIdentifier
      )[0];
      if (campaign) {
        campaign.targets[targetIndex].contactInfo = data.contactInfo
          ? JSON.parse(data.contactInfo)
          : {};

        return { ...state, campaigns };
      }
    }

    case ACTION_HEADER.FINISH_LOADING:
      return { ...state, loading: false };

    case ACTION_HEADER.FAIL:
      return { ...state, loading: false, error: action.error };
    case ACTION_HEADER.NEED_FETCH:
      return { ...state, fetched: false };
    default: {
      return state;
    }
  }
}

export default campaignReducer;
