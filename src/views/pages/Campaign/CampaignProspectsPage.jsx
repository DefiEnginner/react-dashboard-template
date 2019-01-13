// Camp Dash Page

import React from "react";
import { compose } from "recompose";
import { connect } from "react-redux";
import { CSVLink } from "react-csv";
import { gapi } from "gapi-script";

import logo from "assets/img/li-icon.png";

import "react-circular-progressbar/dist/styles.css";

import LoadingOverlay from "react-loading-overlay";
import Switch from "react-bootstrap-switch";

// reactstrap components
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import ReactTable from "react-table";

import CampaignActionBadge from "../../components/campaigns/CampaignActionBadge";
import { actionToActivity } from "../../../utils";
import {
  excludeTarget,
  requestGetContactInfo
} from "../../../actions/campaignActions";
import { useEffect } from "react";
import { useState } from "react";

let csvLink = null;
let exportCSV = false;

const CampaignDetailsPage = props => {
  const {
    match: {
      params: { identifier: detailID, account }
    },
    campaigns,
    loading,
    seqLoading,
    sequences,
    excludeTarget,
    requestGetContactInfo
  } = props;

  const identifier = detailID.split("prospects-")[1];
  const campaign = campaigns.filter(camp => camp.identifier === identifier)[0];
  let sequence = null;
  let prospectsData = [];

  const [pageIndex, setPageIndex] = useState(0);
  const [queryURL, setQueryURL] = useState(false);

  useEffect(() => {
    window.gapi.load("client:auth2", async () => {
      try {
        await window.gapi.client.init({
          apiKey: "AIzaSyCL0i9O-dGHmuN_QnPmD69EW8o0WaWFbuU",
          clientId:
            "198229650459-btvfuml94nbskivl7aj1b1t2slhafc4t.apps.googleusercontent.com",
          discoveryDocs: [
            "https://sheets.googleapis.com/$discovery/rest?version=v4"
          ],
          scope: "https://www.googleapis.com/auth/spreadsheets"
        });
      } catch (e) {
        console.error("ooo", e);
      }
    });
  }, []);

  useEffect(() => {
    const getContactInfo = pageIndex => {
      if (!campaign) {
        return;
      }
      const { targets } = campaign;
      requestGetContactInfo(
        targets.slice(pageIndex * 10, pageIndex * 10 + 10).map((target, i) => ({
          targetLink: target.targetLink,
          salesLink: target.salesLink,
          campIdentifier: identifier,
          targetIndex: pageIndex * 10 + i
        }))
      );
    };

    getContactInfo(pageIndex);
  }, [campaign, pageIndex, identifier, requestGetContactInfo]);

  useEffect(() => {
    if (exportCSV && !loading) {
      csvLink.link.click();
      exportCSV = false;
    }
  }, [loading]);

  const getAction = targetLink => {
    const campData = campaign.data.filter(
      campData => campData.targetLink === targetLink
    )[0];

    const actions = [];

    if (
      campaign.repliedData.findIndex(
        dat =>
          dat.targetLink.split("/").reverse()[1] ===
          targetLink.split("/").reverse()[1]
      ) !== -1
    ) {
      actions.push("Replied");
    }
    if (
      campaign.connectionData.findIndex(
        dat =>
          dat.targetLink.split("/").reverse()[1] ===
          targetLink.split("/").reverse()[1]
      ) !== -1
    ) {
      actions.push("Accepted");
    }

    if (campData) {
      actions.push(
        ...campData.actions
          .filter(Boolean)
          .map(({ name }) => actionToActivity(name))
      );

      if (actions.indexOf("Replied") !== -1) {
        if (actions.indexOf("Requested") !== -1) {
          actions.splice(actions.indexOf("Requested"), 1);
        }
        if (actions.indexOf("Messaged") !== -1) {
          actions.splice(actions.indexOf("Messaged"), 1);
        }
      } else if (actions.indexOf("Messaged") !== -1) {
        if (actions.indexOf("Requested") !== -1) {
          actions.splice(actions.indexOf("Requested"), 1);
        }
      } else if (actions.indexOf("Accepted") !== -1) {
        if (actions.indexOf("Requested") !== -1) {
          actions.splice(actions.indexOf("Requested"), 1);
        }
      }
    }

    return actions.length ? actions : ["None"];
  };

  if (campaign) {
    const { targets } = campaign;
    prospectsData = targets.map(
      (
        {
          imageurl,
          name,
          headline,
          targetLink,
          salesLink,
          notExcluded,
          contactInfo
        },
        targetIndex
      ) => ({
        photo: (
          <div className="img-row">
            <div className="img-wrapper">
              <a
                rel="noreferrer noopener"
                href={targetLink || salesLink}
                target="_blank"
              >
                <img
                  style={{ height: 40 }}
                  alt={name}
                  src={
                    imageurl && imageurl.startsWith("https://media-")
                      ? imageurl
                      : require("assets/img/image_placeholder.jpg")
                  }
                />
              </a>
            </div>
          </div>
        ),
        contactInfo,
        name,
        headline,
        targetLink,
        activity: (
          <div className="activity-badges">
            {getAction(targetLink).map((action, index) => (
              <div key={index} className="el-inline">
                {<CampaignActionBadge {...{ action }} />}
              </div>
            ))}
          </div>
        ),
        actions: (
          <div className="actions-center">
            <Switch
              offColor="success"
              offText={<i className="nc-icon nc-simple-remove" />}
              onColor="success"
              onText={<i className="nc-icon nc-check-2" />}
              value={notExcluded}
              onChange={() =>
                excludeTarget(
                  campaign.browserKey,
                  targetLink,
                  salesLink,
                  identifier,
                  targetIndex
                )
              }
            />{" "}
          </div>
        )
      })
    );

    if (sequences.length) {
      sequence = sequences.filter(seq => seq._id === campaign.sequenceId)[0];
    }
  }

  const exportToCSV = () => {
    const { targets, connectionData } = campaign;
    requestGetContactInfo(
      connectionData.map(connectedTarget => {
        const targetIndex = targets.findIndex(
          target => target.targetLink === connectedTarget.targetLink
        );
        const { targetLink, salesLink } = targets[targetIndex];
        return {
          targetLink,
          salesLink,
          campIdentifier: identifier,
          targetIndex
        };
      })
    );

    exportCSV = true;
  };

  const filterMethod = (filter, row, column) => {
    const id = filter.pivotId || filter.id;
    if (row[id]) {
      const orgStringArray = row[id].toLowerCase().split(" ");
      const filterString = filter.value.toLowerCase();
      for (let i in orgStringArray) {
        if (
          orgStringArray
            .slice(i)
            .join(" ")
            .startsWith(filterString)
        ) {
          return true;
        }
      }

      return false;
    }
    return true;
  };

  const targetsToExportsData = targets =>
    targets.map(({ name, headline, contactInfo }) => ({
      "Email Address":
        contactInfo && contactInfo.emailAddress ? contactInfo.emailAddress : "",
      "First Name": name.split(" ")[0],
      "Last Name": name
        .split(" ")
        .slice(1)
        .join(" "),
      "Job Title": headline.split(" at ")[0],
      Company: headline.split(" at ")[1],
      "Phone Numbers":
        contactInfo && contactInfo.phoneNumbers
          ? contactInfo.phoneNumbers.map(({ number }) => number).join(", ")
          : ""
    }));

  const syncGoogle = () => {
    if (!window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
      gapi.auth2.getAuthInstance().signIn();
    }

    window.gapi.client.sheets.spreadsheets
      .create({
        properties: {
          title: "pp-campaign-data"
        }
      })
      .then(response => {
        const {
          result: { spreadsheetId, spreadsheetUrl }
        } = response;

        const headers = [
          "Email Address",
          "First Name",
          "Last Name",
          "Job Title",
          "Phone Numbers"
        ];

        window.gapi.client.sheets.spreadsheets.values
          .update({
            spreadsheetId,
            range: "Sheet1!A:E",
            valueInputOption: "RAW",
            resource: {
              values: headers.map(header =>
                [header].concat(
                  targetsToExportsData(campaign.targets).map(
                    target => target[header]
                  )
                )
              ),
              majorDimension: "COLUMNS"
            }
          })
          .then(response => {
            var result = response.result;
          });
      });
  };

  return (
    <>
      <LoadingOverlay
        active={loading || seqLoading}
        spinner
        text="Loading Prospects"
      ></LoadingOverlay>
      <div className="content camp-prospect">
        <CSVLink
          data={campaign ? targetsToExportsData(campaign.targets) : []}
          filename="pp-campaign-data.csv"
          className="hidden"
          ref={ref => (csvLink = ref)}
          target="_blank"
        />
        <CardTitle tag="h3" className="el-inline">
          Prospects Manager &nbsp;
        </CardTitle>
        {/* hide until it is working
        <i
          className="nc-icon nc-alert-circle-i el-inline"
          id="tooltip-ex"
          style={{ position: "relative" }}
        />
        
        <UncontrolledTooltip delay={0} target="tooltip-ex">
          Exclude certain prospects in this campaign by toggling active column.
        </UncontrolledTooltip>
        */}

        <Card className="card-tasks">
          <CardHeader>
            <div className="el-inline" style={{ marginLeft: 15 }}>
              <h3
                className="el-inline"
                style={{ marginBottom: 0, marginTop: 10 }}
              >
                {campaign && campaign.name.split(" -> ")[1]}{" "}
              </h3>
              <span className="text-muted el-inline">
                &nbsp;({campaign && campaign.targets.length})&nbsp;
              </span>
              <span className="el-inline">
                {sequence && (
                  <a
                    href={`/admin/${account}/sequences/edit-${sequence.identifier}`}
                    style={{ position: "relative" }}
                  >
                    <span>{sequence.name}</span>
                  </a>
                )}
              </span>
            </div>

            <UncontrolledDropdown
              className="el-inline pull-right"
              nav
              style={{ position: "absolute", right: "20px" }}
            >
              <DropdownToggle color="default" data-toggle="dropdown" nav>
                <button type="button" className="btn">
                  {/*<i className="nc-icon round nc-cloud-download-93" ></i>*/}
                  Export data
                </button>
              </DropdownToggle>
              <DropdownMenu aria-labelledby="" className="fadeIn">
                <DropdownItem onClick={exportToCSV}>
                  {" "}
                  Export to CSV
                </DropdownItem>
                <DropdownItem onClick={syncGoogle}>Sync w/ Google</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </CardHeader>
          <CardBody>
            <div className="table-full-width table-responsive prospects-table">
              <ReactTable
                data={prospectsData}
                columns={[
                  {
                    Header: "",
                    accessor: "photo",
                    sortable: false,
                    filterable: false,
                    width: 70
                  },
                  {
                    Header: "Name",
                    accessor: "name",
                    Cell: row => (
                      <div className="name-row">
                        <div className="">
                          <a
                            rel="noreferrer noopener"
                            href={
                              row.original.targetLink || row.original.salesLink
                            }
                            target="_blank"
                          >
                            <img
                              alt={row.value}
                              src={logo}
                              style={{ width: 15 }}
                            />
                          </a>{" "}
                          &nbsp; {row.value}
                        </div>
                      </div>
                    ),
                    sortable: true,
                    filterable: true
                  },
                  {
                    Header: "Headline",
                    accessor: "headline",
                    sortable: false,
                    filterable: true,
                    className: "headline"
                  },
                  {
                    Header: "Contact Info",
                    accessor: "contactInfo",
                    Cell: row => (
                      <div className="name-row">
                        <div className="">
                          {row.original.contactInfo && (
                            <>
                              <strong>{`${row.original.contactInfo
                                .emailAddress || ""}`}</strong>
                              <br />
                              {row.original.contactInfo.phoneNumbers &&
                                row.original.contactInfo.phoneNumbers.map(
                                  ({ type, number }, i) => (
                                    <div
                                      className="text-muted"
                                      key={i}
                                    >{`${type}: ${number}`}</div>
                                  )
                                )}
                            </>
                          )}
                        </div>
                      </div>
                    ),
                    sortable: false,
                    filterable: true
                  },
                  {
                    Header: "Activity",
                    accessor: "activity",
                    sortable: true,
                    filterable: false
                  },
                  {
                    Header: "Active",
                    accessor: "actions",
                    sortable: false,
                    filterable: false,
                    width: 70
                  }
                ]}
                defaultFilterMethod={filterMethod}
                defaultPageSize={10}
                defaultSorted={[
                  {
                    id: "activity"
                  }
                ]}
                showPaginationTop={false}
                showPaginationBottom={true}
                onPageChange={pageIndex => setPageIndex(pageIndex)}
                /*
                  You can choose between primary-pagination, info-pagination, success-pagination, warning-pagination, danger-pagination or none - which will make the pagination buttons gray
                */
                className=" -highlight"
              />
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

const mapStateToProps = state => ({
  campaigns: state.campaigns.campaigns,
  loading: state.campaigns.loading,
  sequences: state.sequences.sequences,
  seqLoading: state.sequences.loading,
  error: state.campaigns.error
});

const mapDispatchToProps = dispatch => ({
  excludeTarget: (
    browserKey,
    targetLink,
    salesLink,
    campIdentifier,
    targetIndex
  ) =>
    dispatch(
      excludeTarget(
        browserKey,
        targetLink,
        salesLink,
        campIdentifier,
        targetIndex
      )
    ),
  requestGetContactInfo: targets => dispatch(requestGetContactInfo(targets))
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps)(CampaignDetailsPage)
);
