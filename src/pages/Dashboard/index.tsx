import React from "react";

//import Breadcrumbs
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Card, CardBody, Col, Container, FormGroup, Input, Label, Row } from "reactstrap";

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
import Widgets from "./Widgets";
import SummaryCard from "./SummaryCard";
import UsersOverview from "./UsersOverview";
import OrdersOverview from "./OrdersOverview";
import ReturnOrdersOverview from "./ReturnOrdersOverview";
import RefundOrdersOverview from "./RefundOrdersOverview";
import OrdersAmountOverview from "./OrdersAmountOverview";



//meta title

const Dashboard = () => {
  // // document.title = "Dashboard | collin";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          {/* <Breadcrumbs  breadcrumbItem="Dashboard" /> */}
          <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>

            <div>
              <h4 style={{ margin: "20px 0" }}>Orders</h4>
              <OrdersOverview />
            </div>
            <div style={{ borderTop: '1px solid #ccc', width: '100%' }} />

            <div>
              <h4 style={{ margin: "20px 0" }}>Order Amounts</h4>
              <OrdersAmountOverview />
            </div>

            <div style={{ borderTop: '1px solid #ccc', width: '100%' }} />

            <div>
              <h4 style={{ margin: "10px 0 20px  0" }}>Return</h4>
              <ReturnOrdersOverview />
            </div>

            <div style={{ borderTop: '1px solid #ccc', width: '100%' }} />

            <div>
              <h4 style={{ margin: "10px 0 20px  0" }}>Refund</h4>
              <RefundOrdersOverview />
            </div>

            <div style={{ borderTop: '1px solid #ccc', width: '100%' }} />


            <div>
              <h4 style={{ margin: "10px 0 20px  0" }}>Users</h4>
              <UsersOverview />
            </div>


          </div>
          {/* <Row>
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
          {/* <Row>
            <Trading />
            <Transactions />
            <RecentActivity />
          </Row> */}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;