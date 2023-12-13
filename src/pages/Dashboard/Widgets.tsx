import React from "react";
import { Card, CardBody, Col, Row } from "reactstrap";

import { WidgetsData } from "../../common/data/dashboard";

//import countup
import CountUp from "react-countup";

//import Charts
import ReactApexChart from "react-apexcharts";

const Widgets = ({ options }: any) => {
  return (
    <React.Fragment>
      {(WidgetsData || []).map((widget: any, key: number) => (
        <Col xl={3} md={6} key={key}>
          <Card className="card-h-100">
            <CardBody>
              <Row className="align-items-center">
                <Col xs={6}>
                  <span className="text-muted mb-3 lh-1 d-block text-truncate">
                    {widget["title"]}
                  </span>
                  <h4 className="mb-3">
                    {widget["isDoller"] === true ? "$" : ""}
                    <span className="counter-value">
                      <CountUp start={0} end={widget["price"]} duration={12} />
                      {widget["postFix"]}
                    </span>
                  </h4>
                </Col>
                <Col xs={6}>
                  <ReactApexChart
                    options={options}
                    series={[{ data: [...widget["series"]] }]}
                    type="line"
                    height="50px"
                    className="apex-charts"
                    dir="ltr"
                  />
                </Col>
              </Row>
              <div className="text-nowrap">
                <span
                  className={
                    "badge badge-soft-" +
                    widget["statusColor"] +
                    " text-" +
                    widget["statusColor"]
                  }
                >
                  {widget["rank"]}
                </span>
                <span className="ms-1 text-muted font-size-13">
                  Since last week
                </span>
              </div>
            </CardBody>
          </Card>
        </Col>
      ))}
    </React.Fragment>
  );
};

export default Widgets;
