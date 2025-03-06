import React, { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Container, Row, Col } from "reactstrap";
import { AiOutlineTable } from "react-icons/ai";
import { MdOutlineViewTimeline } from "react-icons/md";
import Timeline from "./Timeline";
import TableLog from "./TableLog";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import { Link, useSearchParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { IActivities } from "../Order/OrderActivityLogs";

const ADMIN_ACTIVITY_LOGS = gql`
  query GetActivityLogOfProduct($input: getActivityLogOfProductInput!) {
    getActivityLogOfProduct(input: $input) {
      _id
      actionType
      action
      performedBy
      performedByRole
      referenceId
      referenceType
      details
      createdAt
      performedByDetails {
        _id
        name
      }
    }
  }
`;

const ProductActivityLogs = () => {
  const [searchParams] = useSearchParams();
  const productID = searchParams.get("_id");
  const [log, setlog] = useState<string>("TIMELINE");
  const [activities, setActivities] = useState<IActivities[] | undefined>();
  const [selectedDate, setSelectedDate] = useState("");
  console.log("ADMIN ACTIVITIES = ", activities);

  const {
    data: activitiesData,
    loading: activitiesLoading,
    refetch: activitiesRefetch,
  } = useQuery(ADMIN_ACTIVITY_LOGS, {
    variables: {
      input: {
        productId: productID,
      },
    },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (activitiesData && activitiesData?.getActivityLogOfProduct) {
      setActivities(activitiesData?.getActivityLogOfProduct);
    }
  }, [activitiesData]);

  useEffect(() => {
    setSelectedDate(new Date().toISOString().split("T")[0]);
  }, []);

  const items = [
    { text: "Dashboard", link: `/` },
    { text: "Products", link: `/product` },
    { text: "Variants", link: `/product/variant?productCode=${"1"}` },
    { text: "View Product", link: `/product/details?_id=${productID}` },
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
                  <h4 className="card-title m-0">iPhone 15 Plus 128GB Blue - Middle East Version</h4>
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

export default ProductActivityLogs;
