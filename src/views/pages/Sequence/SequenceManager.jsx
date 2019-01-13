// Campaigns Page

import React from "react";
import { compose } from "recompose";
import { connect } from "react-redux";

import ReactTable from "react-table";

// reactstrap components
import { Button, Card, CardBody, Row, Col } from "reactstrap";
import LoadingOverlay from "react-loading-overlay";
import ReactBSAlert from "react-bootstrap-sweetalert";

import { sequenceActions } from "../../../actions";
const { requestDeleteSequence } = sequenceActions;

class SequenceManager extends React.Component {
  state = {
    alert: null
  };

  createSequence = () => {
    const { account } = this.props.match.params;

    this.props.history.push(`/admin/${account}/sequences/new`);
  };
  navigateToSequence = (e, identifier, mode) => {
    e.preventDefault();
    const { account } = this.props.match.params;
    this.props.history.push(
      `/admin/${account}/sequences/${mode}-${identifier}`
    );
  };
  deleteSequence = identifier => {
    const { account } = this.props.match.params;
    const { sequences } = this.props;
    const sequence = sequences.filter(seq => seq.identifier === identifier)[0];
    this.props.requestDeleteSequence(sequence._id, account);
    this.hideAlert();
  };

  warningWithConfirmMessage = (e, identifier) => {
    e.preventDefault();
    this.setState({
      alert: (
        <ReactBSAlert
          warning
          style={{ display: "block", marginTop: "-100px" }}
          title="Are you sure?"
          onConfirm={() => this.deleteSequence(identifier)}
          onCancel={() => this.hideAlert()}
          confirmBtnBsStyle="info"
          cancelBtnBsStyle="danger"
          confirmBtnText="Yes, delete it!"
          cancelBtnText="Cancel"
          showCancel
        >
          You will not be able to recover this sequence!
        </ReactBSAlert>
      )
    });
  };
  hideAlert = () => {
    this.setState({ alert: null });
  };
  render() {
    const { sequences, loading, campaigns } = this.props;

    const sequenceData = sequences.map(seq => ({
      name: (
        <a
          href="/"
          onClick={e => this.navigateToSequence(e, seq.identifier, "edit")}
        >
          {seq.name}
        </a>
      ),
      type: seq.sequences.map((step, index) => (
        <div className="el-inline" key={step.name}>
          <span className="el-inline" style={{ textTransform: "lowercase" }}>
            {step.name}
          </span>
          {index < seq.sequences.length - 1 && (
            <span
              className="el-inline"
              style={{ marginLeft: 10, marginRight: 10 }}
              color="primary"
            >
              >
            </span>
          )}
        </div>
      )),
      actions: (
        // we've added some custom button actions
        <div className="">
          {/* use this button to add a edit kind of action 
          <Button
            color="success"
            size="md"
            className="btn-icon btn-link edit"
            onClick={e => this.navigateToSequence(e, seq.identifier, "edit")}
          >
            <i className="fa fa-edit" />
          </Button>{" "}
          */}
          {/* use this button to remove the data row */}
          <Button
            color="danger"
            size="md"
            className="btn-icon btn-default btn-link remove"
            onClick={e => this.warningWithConfirmMessage(e, seq.identifier)}
            disabled={
              campaigns &&
              campaigns.findIndex(camp => camp.sequenceId === seq._id) !== -1
            }
          >
            <i className="fa fa-times" />
          </Button>{" "}
        </div>
      )
    }));
    return (
      <>
        <LoadingOverlay
          active={loading}
          spinner
          text="Loading Sequences"
        ></LoadingOverlay>
        <div className="content sequencelist">
          {this.state.alert}
          <Row>
            <Col md="12">
              <h3 className="el-inline">Sequence Manager</h3>
              <Button
                className="add-btn el-inline btn-primary btn-icon btn-round"
                onClick={this.createSequence}
              >
                <i className="nc-icon nc-simple-add" style={{ width: 22 }} />
              </Button>
              <Card>
                <CardBody>
                  <ReactTable
                    data={sequenceData}
                    resizable={true}
                    columns={[
                      {
                        Header: "Name",
                        accessor: "name",
                        sortable: false,
                        filterable: false
                      },
                      {
                        Header: "Type",
                        accessor: "type",
                        sortable: false,
                        filterable: false
                      },
                      {
                        Header: "Actions",
                        accessor: "actions",
                        sortable: false,
                        filterable: false
                      }
                    ]}
                    defaultPageSize={10}
                    showPaginationTop={false}
                    showPaginationBottom
                    /*
                    You can choose between primary-pagination, info-pagination, success-pagination, warning-pagination, danger-pagination or none - which will make the pagination buttons gray
                  */
                    className=" -highlight sequence-manager-table"
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({
  campaigns: state.campaigns.campaigns,
  sequences: state.sequences.sequences,
  loading: state.sequences.loading,
  error: state.sequences.error
});

const mapDispatchToProps = dispatch => ({
  requestDeleteSequence: (_id, account) =>
    dispatch(requestDeleteSequence(_id, account))
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps)(SequenceManager)
);
