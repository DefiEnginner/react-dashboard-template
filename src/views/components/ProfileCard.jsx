import React, { useState } from "react";

// reactstrap components
import {
  Input,
  InputGroup,
  FormFeedback,
  UncontrolledTooltip,
  Button
} from "reactstrap";

import ReactBSAlert from "react-bootstrap-sweetalert";
import LoadingOverlay from "react-loading-overlay";

import { validator } from "../../utils";
import { useEffect } from "react";
import moment from "moment";

const ProfileCard = ({
  type,
  userData,
  seats,
  plans,
  loadingPlan,
  loadingAuth,
  ...restProps
}) => {
  const [alert, setAlert] = useState(null);

  const warningWithConfirmMessage = e => {
    e.preventDefault();
    setAlert(
      <ReactBSAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title="Are you sure?"
        onConfirm={() => {
          userData && userData.status !== "canceled"
            ? restProps.unsubscribe()
            : restProps.reactivate();
          setAlert(null);
        }}
        onCancel={() => setAlert(null)}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText={`Yes, I'm sure!`}
        cancelBtnText="Cancel"
        showCancel
      ></ReactBSAlert>
    );
  };

  switch (type) {
    case "subscription": {
      const plan = plans.filter(
        plan => userData && plan.id === userData._doc.planID
      )[0];
      return (
        <LoadingOverlay active={loadingPlan} spinner text="">
          {alert}
          {plan && userData && (
            <div>
              <label
                className="badge badge-primary"
                style={{ marginRight: 50 }}
              >
                {plan && plan.nickname}
              </label>
              <a
                href="/admin"
                style={{ marginRight: 100 }}
              >{`${seats} seats`}</a>
              <p style={{ display: "inline-block" }}>
                {userData &&
                  `Next billing date: ${moment
                    .unix(userData.nextBillingDate)
                    .format("MMM DD, YYYY")}`}
              </p>
              <Button
                style={{ display: "block" }}
                onClick={e => warningWithConfirmMessage(e)}
              >
                {userData && userData.status !== "canceled"
                  ? "Cancel"
                  : "Reactivate"}
              </Button>
              <div>
                {userData && userData.status === "canceled" && (
                  <div>
                    We're sorry to see you go. We'll maintain your saved data
                    for 30 days in case you decide to return.
                    <br />
                    <br />
                    We are always receptive to suggestions and feedback. Send us
                    a line: <br /> support@perfectprospect.io
                  </div>
                )}
              </div>
            </div>
          )}
        </LoadingOverlay>
      );
    }
    case "password":
      return <div />;
    default:
      return <div />;
  }
};

export default ProfileCard;
