import React, { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Container, Row, Col } from "reactstrap";
import { AiOutlineTable } from "react-icons/ai";
import { MdOutlineViewTimeline } from "react-icons/md";

//Import Breadcrumb
import { useSearchParams } from "react-router-dom";

import Breadcrumb from "../../../components/Common/Breadcrumb";
import Timeline from "./Timeline";
import TableLog from "./TableLog";
import { gql, useQuery } from "@apollo/client";

export type IActivities = {
  _id: string;
  actionType: string;
  action: string;
  performedBy: string;
  performedByRole: string;
  referenceId: string;
  referenceType: string;
  details: string;
  createdAt: Date;
  timeDifference: string;
  performedByDetails: [
    {
      _id: string;
      name: string;
    }
  ];
  referenceDetails: [
    {
      _id: string;
      ID: string;
    }
  ];
};

const ORDER_ACTIVITY_LOGS = gql`
  query GetOrderActivityLogByAdmin($input: getOrderActivityLogByAdminInput!) {
    getOrderActivityLogByAdmin(input: $input) {
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

const OrderActivityLogs = () => {
  const [searchParams] = useSearchParams();
  const ORDER_ID = searchParams.get("orderId");
  const ID = searchParams.get("_id");
  const [log, setlog] = useState<string>("TIMELINE");
  const [activities, setActivities] = useState<IActivities[] | undefined>();
  console.log("ORDER ACTIVITIES = ", activities);

  const {
    data: activitiesData,
    loading: activitiesLoading,
    refetch: activitiesRefetch,
  } = useQuery(ORDER_ACTIVITY_LOGS, {
    variables: {
      input: {
        orderProductId: ID,
      },
    },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (activitiesData && activitiesData?.getOrderActivityLogByAdmin) {
      setActivities(activitiesData?.getOrderActivityLogByAdmin);
    }
  }, activitiesData);

  const items = [
    { text: "Dashboard", link: `/` },
    { text: "Shipping Orders", link: `/shipping-orders` },
    { text: "Details", link: `/shipping-orders/details?orderId=${ORDER_ID}&_id=${ID}` },
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
                  <h4 className="card-title m-0">{ORDER_ID}</h4>
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

export default OrderActivityLogs;
