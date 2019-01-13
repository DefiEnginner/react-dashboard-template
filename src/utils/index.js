import { extendMoment } from "moment-range";
import Moment from "moment-timezone";

const moment = extendMoment(Moment);

export const createActionTypes = (base, actions = []) =>
  actions.reduce((acc, type) => {
    acc[type] = `${base}_${type}`;

    return acc;
  }, {});

// export const backendUrl = "https://api.perfectprospect.io";
export const backendUrl = "https://api-test.perfectprospect.io";
// export const backendUrl = "http://192.168.1.21:3000";
export const DEFAULT_EXPIRATION_TIME = 4320 * 60;

export const validator = {
  checkEmailValidation(email) {
    if (email === -1) {
      return false;
    }
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !email || !re.test(String(email).toLowerCase());
  },
  checkRequiredValidation(value) {
    return value !== -1 && !value;
  },
  checkPasswordValidation(password) {
    return password.length < 5;
  },
  checkBasicQueryValidation(query) {
    return (
      query !== -1 &&
      !query.startsWith("https://www.linkedin.com/search/results/")
    );
  },
  checkSalesNavValidation(query) {
    return (
      query !== -1 &&
      !query.startsWith("https://www.linkedin.com/sales/search/")
    );
  },
  checkSequenceMessageValidation(msg) {
    return (
      msg !== -1 && msg && /firstname/i.test(msg) && !/{firstName}/.test(msg)
    );
  }
};

export const originToutc = (time, zone) => {
  const date = moment().format("YYYY-MM-DD");
  const momentTime = moment.tz(date + " " + time, zone);
  return momentTime.utc().format("HH:mm");
};

export const utcTotarget = (time, zone) => {
  const date = moment().format("YYYY-MM-DD");
  const momentTime = moment(date + "T" + time + "Z");
  return momentTime.tz(zone).format("HH:mm");
};

export const campaignTypes = [
  {
    title: "Sales Navigator Search Results",
    key: "SALES_NAVIGATOR",
    disabled: false
  },
  {
    title: "Basic LinkedIn Search Results",
    key: "BASIC_QUERY",
    disabled: false
  },
  {
    title: "Custom Import",
    key: "CUSTOM",
    disabled: false
  },
  {
    title: "Linkedin Suggestions",
    key: "LI_SUGGESTIONS",
    disabled: true
  },
  {
    title: "My Followers",
    key: "FOLLOWERS",
    disabled: true
  }
];

const getDate = date => {
  return moment(date).format("YYYY-MM-DD");
};

export const statusCount = (data, status, result, date = "all") =>
  status === "CONNECTED"
    ? data.filter(dat => dat.isConnected).length
    : status === "REPLIED"
    ? data.filter(dat => dat.isReplied).length
    : data.reduce(
        (sum, curVal) =>
          sum +
          curVal.actions.reduce(
            (sum, action) =>
              (sum +=
                action.name === status &&
                action.result === result &&
                (date === "all" || getDate(action.date) === getDate(date))),
            0
          ),
        0
      );

export const connectedCount = (connectionData, date) =>
  connectionData.filter(dat => getDate(dat.date) === getDate(date)).length;

export const repliedCount = (repliedData, date) =>
  repliedData.filter(dat => getDate(dat.date) === getDate(date)).length;

export const recentDays = range =>
  [...Array(range).keys()].map(key =>
    moment().subtract(range - key - 1, "days")
  );

export const dateRange = (start, end) => {
  return Array.from(moment.range(moment(start), moment(end)).by("day"));
};

export const actionToActivity = name =>
  name === "CONNECT"
    ? "Requested"
    : name === "MESSAGE"
    ? "Messaged"
    : name === "VISIT"
    ? "Visited"
    : name === "FOLLOW"
    ? "Followed"
    : name;

export const activityToDescription = (activity, name) => {
  switch (activity) {
    case "Requested":
      return `Sent connection request to ${name}`;
    case "Accepted":
      return `${name} accepted your connection request`;
    case "Messaged":
      return `Sent a message to ${name}`;
    case "Visited":
      return `Visited ${name}`;
    case "Followed":
      return `Followed ${name}`;
    case "Replied":
      return `${name} sent a reply!`;
    default:
      return `Unknown action to ${name}`;
  }
};

export const progress = (data, seqSteps, totalLen, campFinished) => {
  if (totalLen === 0) {
    return 0;
  }

  return (
    (campFinished
      ? 1
      : data.reduce((sum, campData) => (sum += campData.actions.length), 0) /
        totalLen /
        seqSteps.length) * 100
  );
};

export const formatAgo = dateFrm => {
  const date = moment(dateFrm);
  const yrDiff = moment().diff(date, "year");
  if (yrDiff) {
    return `${yrDiff} ${yrDiff > 1 ? "years" : "year"} ago`;
  }
  const moDiff = moment().diff(date, "month");
  if (moDiff) {
    return `${moDiff} ${moDiff > 1 ? "months" : "month"} ago`;
  }
  const dyDiff = moment().diff(date, "day");
  if (dyDiff) {
    return `${dyDiff} ${dyDiff > 1 ? "days" : "day"} ago`;
  }
  const hrDiff = moment().diff(date, "hour");
  if (hrDiff) {
    return `${hrDiff} ${hrDiff > 1 ? "hours" : "hour"} ago`;
  }
  const minDiff = moment().diff(date, "minute");
  if (minDiff) {
    return `${minDiff} ${minDiff > 1 ? "minutes" : "minute"} ago`;
  }
  const secDiff = moment().diff(date, "second");
  if (secDiff) {
    return `${secDiff} ${secDiff > 1 ? "seconds" : "second"} ago`;
  }
};
