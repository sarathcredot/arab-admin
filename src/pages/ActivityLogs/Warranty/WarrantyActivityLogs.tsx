import React, { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Container, Row, Col } from "reactstrap";
import { AiOutlineTable } from "react-icons/ai";
import { MdOutlineViewTimeline } from "react-icons/md";
import Timeline from "./Timeline";
import TableLog from "./TableLog";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import { useSearchParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { IActivities } from "../Order/OrderActivityLogs";

const WARRANTY_ACTIVITY_LOGS = gql`
  query GetWarrantyActivityLogByAdmin($input: getWarrantyActivityLogByAdminInput!) {
    getWarrantyActivityLogByAdmin(input: $input) {
      _id
      actionType
      action
      performedBy
      performedByRole
      referenceId
      referenceType
      details
      createdAt
      timeDifference
      performedByDetails {
        _id
        name
      }
    }
  }
`;

const WarrantyActivityLogs = () => {
  const [searchParams] = useSearchParams();
  const ID = searchParams.get("_id");
  const warrantyID = searchParams.get("warranty");

  const [log, setlog] = useState<string>("TIMELINE");

  const [activities, setActivities] = useState<IActivities[] | undefined>();
  console.log("ORDER ACTIVITIES = ", activities);

  const {
    data: activitiesData,
    loading: activitiesLoading,
    refetch: activitiesRefetch,
  } = useQuery(WARRANTY_ACTIVITY_LOGS, {
    variables: {
      input: {
        warrantyId: ID,
      },
    },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (activitiesData && activitiesData?.getWarrantyActivityLogByAdmin) {
      setActivities(activitiesData?.getWarrantyActivityLogByAdmin);
    }
  }, activitiesData);

  const items = [
    { text: "Dashboard", link: `/` },
    { text: "Claims And Requests", link: `/warranty-claims` },
    { text: "Details", link: `/warranty-claims/details?id=${ID}` },
  ];

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
                  <h4 className="card-title m-0">{warrantyID}</h4>
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

export default WarrantyActivityLogs;
