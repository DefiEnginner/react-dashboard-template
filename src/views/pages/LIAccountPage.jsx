// Linkedin Account Page
// Home Page

import React from "react";
import { compose } from "recompose";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { exampleSubscriptionData } from "variables/subscription";

// reactstrap components
import { Card, CardBody, Row, Col, Modal } from "reactstrap";

import LoadingOverlay from "react-loading-overlay";
import ReactBSAlert from "react-bootstrap-sweetalert";

import UpgradeForm from "../components/UpgradeForm";
import AddAccountForm from "../components/AddAccountForm";
import PinForm from "../components/PinForm";

import {
  liaccountActions,
  campaignActions,
  sequenceActions,
  planActions
} from "../../actions";

const {
  requestAddAccount,
  requestSendPIN,
  requestDeleteAccount
} = liaccountActions;

const { setCampFetch } = campaignActions;
const { setSeqFetch } = sequenceActions;
const { requestActivatePlan, requestUpgradePlan } = planActions;

const LIAccount = props => {
  const {
    _id,
    profileImg,
    headline,
    name,
    identifier,
    activeCMPcnt,
    connections,
    removeAccount
  } = props;

  const goToAccount = e => {
    e.preventDefault();
    props.goToAccount(identifier);
  };

  return (
    <div className="col-sm-6 col-md-3">
      <Card className="liaccount">
        <i
          className="close-btn nc-icon nc-simple-remove"
          onClick={() => removeAccount(_id)}
        />
        <CardBody onClick={e => goToAccount(e)}>
          <div className="row">
            <div className="col-md-4">
              {profileImg !== "UNKOWN" ? (
                <img src={profileImg} className="photo" alt="profile"></img>
              ) : (
                <img
                  className="photo"
                  alt="missing"
                  src="https://perfectprospect.io/assets/img/placeholder.jpg"
                />
              )}
            </div>
            <div className="col-md-8 li-user-info">
              <h3 className="">{name}</h3>
              <p className="text-muted">{headline}</p>
            </div>
          </div>
          <div className="liac-bottom">
            <span className="text-center badge badge-pill badge-success">
              {activeCMPcnt ? activeCMPcnt : "0"} Active Campaigns
            </span>
            <span className="text-center badge badge-pill badge-info">
              {connections} connections
            </span>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

class LIAccountPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      upgradeModal: false,
      modal: false,
      pinModal: false,
      popIndex: -1,
      alert: null
    };
  }
  componentDidUpdate(prevProps) {
    const { error, loading, planError, planLoading } = this.props;
    if (!planError && !planLoading && prevProps.planLoading) {
      this.showModal(false, false);
      return;
    }
    if (error && error !== prevProps.error) {
      if (error.includes("Manual check")) {
        this.showModal(true, true);
      } else if (error === "Network Error") {
        clearTimeout(this.timeId);
      }
    } else if (!error && !loading && prevProps.loading) {
      this.showModal(true, false);
      this.showModal(false, false);
    }
  }
  needUpgrade = () => {
    if (this.props.liaccounts.length === 0) {
      return false;
    }
    const { user } = this.props;
    if (
      user._doc.planID === "PERSONAL_PLAN" ||
      (user._doc.planID === "PROFESSIONAL_PLAN" && user.status === "trialing")
    ) {
      return true;
    }

    return false;
  };
  showModal = (isPin, modal) => {
    if (isPin) {
      this.setState({ pinModal: modal });
    } else if (this.needUpgrade()) {
      this.setState({ upgradeModal: modal });
    } else {
      this.setState({ modal });
    }
  };
  requestAddAccount = (email, password) => {
    this.email = email;
    this.password = password;
    this.props.requestAddAccount(email, password);
  };
  requestSendPIN = pin => {
    this.props.requestSendPIN(
      this.email,
      this.password,
      pin,
      this.props.reLoginUrl
    );
    this.timeId = setTimeout(() => {
      this.showModal(true, false);
    }, 1000);
  };
  removeAccount = _id => {
    this.props.requestDeleteAccount(_id);
    this.hideAlert();
  };
  hideAlert = () => {
    this.setState({ alert: null });
  };
  warningWithConfirmMessage = _id => {
    this.setState({
      alert: (
        <ReactBSAlert
          warning
          style={{ display: "block", marginTop: "-100px" }}
          title="Are you sure?"
          onConfirm={() => this.removeAccount(_id)}
          onCancel={() => this.hideAlert()}
          confirmBtnBsStyle="info"
          cancelBtnBsStyle="danger"
          confirmBtnText="Yes, delete it!"
          cancelBtnText="Cancel"
          showCancel
        ></ReactBSAlert>
      )
    });
  };
  render() {
    const { modal, pinModal, upgradeModal } = this.state;
    const {
      liaccounts,
      loading,
      error,
      liFetched,
      planLoading,
      planError,
      user
    } = this.props;

    return (
      <>
        <LoadingOverlay
          active={!liFetched}
          spinner
          text="Loading Linkedin Accounts"
        ></LoadingOverlay>
        <div className="content accountlist">
          {this.state.alert}
          <Row>
            <Col md="12">
              <h4 className="el-inline">LinkedIn Accounts &nbsp;</h4>

              <Row>
                {liaccounts.map((account, index) => (
                  <LIAccount
                    key={index}
                    {...account}
                    goToAccount={identifier =>
                      this.props.history.push(`/admin/${identifier}`)
                    }
                    removeAccount={this.warningWithConfirmMessage}
                  />
                ))}
                {/* add new li account */}
                <Col className="col-sm-6 col-md-3">
                  <Card
                    className="liaccount-new"
                    onClick={() => this.showModal(false, true)}
                  >
                    <CardBody className="text-center">
                      <img
                        alt="missing"
                        className="round"
                        src="https://perfectprospect.io/assets/img/placeholder.jpg"
                        style={{ width: 60, borderRadius: 50, margin: 15 }}
                      />

                      <p className="text-muted">Add New LinkedIn Account</p>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
          <Modal isOpen={upgradeModal}>
            <UpgradeForm
              closeModal={() => this.showModal(false, false)}
              requestActivatePlan={this.props.requestActivatePlan}
              requestUpgradePlan={this.props.requestUpgradePlan}
              loading={planLoading}
              error={planError}
              subscriptionData={user}
            />
          </Modal>
          <Modal isOpen={modal}>
            <AddAccountForm
              closeModal={() => this.showModal(false, false)}
              requestAddAccount={this.requestAddAccount}
              loading={loading}
              error={error}
            />
          </Modal>
          <Modal isOpen={pinModal}>
            <PinForm
              requestSendPIN={this.requestSendPIN}
              error={error}
              loading={loading}
            />
          </Modal>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({
  liaccounts: state.liaccounts.liaccounts,
  loading: state.liaccounts.loading,
  liFetched: state.liaccounts.liFetched,
  error: state.liaccounts.error,
  reLoginUrl: state.liaccounts.reLoginUrl,
  user: state.authentication.user,
  planLoading: state.plans.loading,
  planError: state.plans.error
});

const mapDispatchToProps = dispatch => ({
  requestAddAccount: (email, password) =>
    dispatch(requestAddAccount(email, password)),
  requestSendPIN: (email, password, pin, reLoginUrl) =>
    dispatch(requestSendPIN(email, password, pin, reLoginUrl)),
  requestActivatePlan: planId => dispatch(requestActivatePlan(planId)),
  requestUpgradePlan: planId => dispatch(requestUpgradePlan(planId)),
  requestDeleteAccount: _id => dispatch(requestDeleteAccount(_id)),
  setCampFetch: () => dispatch(setCampFetch()),
  setSeqFetch: () => dispatch(setSeqFetch())
});

export default withRouter(
  compose(connect(mapStateToProps, mapDispatchToProps)(LIAccountPage))
);
