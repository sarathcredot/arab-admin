import React, { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Container, Row, Col, FormGroup, Label, Input } from "reactstrap";
import { AiOutlineTable } from "react-icons/ai";
import { MdOutlineViewTimeline } from "react-icons/md";
import Timeline from "./Timeline";
import TableLog from "./TableLog";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import { Link, useSearchParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { IActivities } from "../Order/OrderActivityLogs";

const VENDOR_ACTIVITY_LOGS = gql`
  query GetActivityLogOfVendor($input: getActivityLogOfVendorInput!) {
    getActivityLogOfVendor(input: $input) {
      _id
      referenceDetails {
        _id
        ID
      }
      actionType
      action
      performedBy
      performedByRole
      referenceId
      referenceType
      details
      createdAt
    }
  }
`;

const VendorActivityLogs = () => {
  const [searchParams] = useSearchParams();
  const vendorID = searchParams.get("_id");
  const vendor = searchParams.get("vendor");
  const [log, setlog] = useState<string>("TIMELINE");
  const [activities, setActivities] = useState<IActivities[] | undefined>();
  const [selectedDate, setSelectedDate] = useState("");
  console.log("ADMIN ACTIVITIES = ", activities);

  const {
    data: activitiesData,
    loading: activitiesLoading,
    refetch: activitiesRefetch,
  } = useQuery(VENDOR_ACTIVITY_LOGS, {
    variables: {
      input: {
        vendorId: vendorID,
        date: selectedDate,
      },
    },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (activitiesData && activitiesData?.getActivityLogOfVendor) {
      setActivities(activitiesData?.getActivityLogOfVendor);
    }
  }, [activitiesData]);

  const items = [
    { text: "Dashboard", link: `/` },
    { text: "Vendors", link: `/vendors` },
    { text: "Vendor Details", link: `/vendors/view?id=${vendorID}` },
  ];

  useEffect(() => {
    setSelectedDate(new Date().toISOString().split("T")[0]);
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          {/* <Breadcrumbs title="Pages" breadcrumbItem="Timeline" /> */}
          <Breadcrumb
            items={items}
            currentPage="Activity Log"
          />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <h4 className="card-title m-0">{vendor}</h4>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ padding: 0, marginBottom: "-15px" }}>
                      <FormGroup style={{ margin: 0 }}>
                        <Input
                          type="date"
                          id="date"
                          name="selectedDate"
                          style={{ margin: 0 }}
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                        />
                      </FormGroup>
                    </div>
                    <div
                      className="btn-group"
                      role="group"
                      aria-label="Basic radio toggle button group "
                    >
                      <input
                        type="radio"
                        className="btn-check"
                        name="btnradio"
                        id="btnradio4"
                        onChange={() => setlog("TIMELINE")}
                        defaultChecked
                      />
                      <label
                        className="btn btn-outline-primary"
                        htmlFor="btnradio4"
                      >
                        <MdOutlineViewTimeline size={16} />
                      </label>

                      <input
                        type="radio"
                        className="btn-check"
                        name="btnradio"
                        id="btnradio5"
                        onChange={() => setlog("TABLE")}
                      />
                      <label
                        className="btn btn-outline-primary"
                        htmlFor="btnradio5"
                      >
                        <AiOutlineTable size={16} />
                      </label>
                    </div>
                  </div>
                </CardHeader>

                <CardBody>
                  {log === "TIMELINE" ? (
                    <Timeline activities={activities} />
                  ) : log === "TABLE" ? (
                    <TableLog activities={activities && activities?.slice().reverse()} />
                  ) : null}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default VendorActivityLogs;
