import React from "react";

//import Breadcrumbs
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Card, CardBody, Col, Container, Row } from "reactstrap";

/** import Mini Widget data */
import WalletBalance from "./WalletBalance";
import InvestedOverview from "./InvestedOverview";
import MarketOverview from "./MarketOverview";
import Locations from "./Locations";
import Trading from "./Trading";
import Transactions from "./Transactions";
import RecentActivity from "./RecentActivity";
import NewSlider from "./NewSlider";
// import Widgets from "./Widgets";
import CountUp from "react-countup";
import ReactApexChart from "react-apexcharts";

// import common data
import { WidgetsData } from "../../common/data/dashboard";


const options: Object = {
  chart: {
    height: 50,
    type: "line",
    toolbar: { show: false },
    sparkline: {
      enabled: true
  }
  },
  colors: ["#5156be"],
  stroke: {
    curve: "smooth",
    width: 2,
  },
  xaxis: {
    labels: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
  },
  yaxis: {
    labels: {
      show: false,
    },
  },
  tooltip: {
    fixed: {
      enabled: false,
    },
    x: {
      show: false,
    },
    y: {
      title: {
        formatter: function (seriesName: any) {
          return "";
        },
      },
    },
    marker: {
      show: false,
    },
  },
};

//meta title

const Dashboard = () => {
  document.title = "Dashboard | Arab Deals";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs  breadcrumbItem="Dashboard" />

          <Row>
            {/* <Widgets options={options} /> */}
            {(WidgetsData || []).map((widget, key) => (
              <Col xl={3} md={6} key={key}>
              <Card className="card-h-100" style={{ height: "400px", width:"400px",borderRadius: "7px", borderColor: "1px solid #F9F9F9", boxShadow: "1px solid #F9F9F9" }}>
                <CardBody style={{ display: "flex", flexDirection: "column" ,marginTop:"90px"}}>
                  <ReactApexChart
                    // options={options}
                    series={[{ data: [...widget["series"]] }]}
                    type="line"
                    className="apex-charts  "
                    dir="ltr"
                    height={100}
                    options={{
                      ...options, // Use your existing options
                      colors: ['#35C27F'], // Set the desired color here
                      // plotOptions: {
                      //   line: {
                      //     colors: ['#FF5733'], // Set the desired color here
                      //   },
                      // },
                    }}
                  />
                  <div style={{ marginTop: "auto" }}>
                    <Col className="align-items-center">
                      <Col xs={6}>
                        <span className="text-muted mb-3 lh-1 d-block text-truncate">
                          {widget.title}
                        </span>
                        <h4 className="">
                          {widget.isDoller === true ? "₹" : ""}
                          <span className="counter-value">
                            <CountUp
                              start={0}
                              end={widget.price}
                              duration={2}
                              // decimals={2}
                              separator=""
                            />
                            {widget.postFix}
                          </span>
                        </h4>
                      </Col>
                      <Col xs={6}>
                        <div className="text-nowrap">
                          <span
                            className={
                              "badge bg-" +
                              widget.statusColor +
                              "-subtle text-" +
                              widget.statusColor
                            }
                          >
                            {widget.rank}
                          </span>
                          <span className="ms-1 text-muted font-size-13"> Since last week
                          </span>
                        </div>
                      </Col>
                    </Col>
                  </div>
                </CardBody>
              </Card>
            </Col>
            
            ))}
          </Row>
          {/* <Row>
            <WalletBalance />
            <Col>
              <Row>
                <InvestedOverview />
                <NewSlider />
              </Row>
            </Col>
          </Row> */}
          {/* <Row>
            <MarketOverview />
            <Locations />
          </Row> */}
          <Row>
            {/* <Trading /> */}
            <Transactions />
            {/* <RecentActivity /> */}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;