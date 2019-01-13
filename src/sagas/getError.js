const getError = e => {
  let error = "Network Error";
  // console.log(e, e.response);
  if (e.response) {
    if (!e.response.data.errors) {
      error = e.response.data;
    } else if (typeof e.response.data.errors.msg === "object") {
      error = e.response.data.errors.msg[0].msg;
    } else {
      error = e.response.data.errors.msg;
    }
  }
  return error;
};

export default getError;
