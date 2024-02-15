import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import {
  Col,
  Container,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent, TabPane
} from "reactstrap";
import CompletedOrders from "src/components/orders/allOrders/CompletedOrders";
import InProgressOrders from "src/components/orders/allOrders/InProgressOrders";
import PendingOrders from "src/components/orders/allOrders/PendingOrders";
import All from "src/components/orders/allOrders/All";
import Breadcrumb from "../../../components/Common/Breadcrumb";

import "../orders.css";


const AllOrders = () => {
  const [activeTab, setActiveTab] = useState("2");

  const toggle = (tab: any) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const items = [
    { text: "Dashboard", link: `/` },
  ];

  return (
    <>
      <ToastContainer />
      <div className="page-content">
        <Container fluid={true} >
          {/* <Breadcrumb items={items} currentPage="All Orders" /> */}
          <Row>
            <Col lg={12}>
              <div>
                <Nav tabs>

                  <NavItem>
                    <NavLink
                      className={activeTab === "2" ? "tab-button active" : "tab-button"}
                      onClick={() => {
                        toggle("2");
                      }}
                    >
                      PENDING
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={activeTab === "3" ? "tab-button active" : "tab-button"}
                      onClick={() => {
                        toggle("3");
                      }}
                    >
                      IN PROGRESS
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={activeTab === "4" ? "tab-button active" : "tab-button"}
                      onClick={() => {
                        toggle("4");
                      }}
                    >
                      COMPLETED
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={activeTab === "1" ? "tab-button active" : "tab-button"}
                      onClick={() => {
                        toggle("1");
                      }}
                    >
                      All
                    </NavLink>
                  </NavItem>
                </Nav>
                <TabContent activeTab={activeTab}>

                  <TabPane tabId="2">
                    <Row>
                      <Col sm="12">
                        <PendingOrders />
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="3">
                    <Row>
                      <Col sm="12">
                        <InProgressOrders />
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="4">
                    <Row>
                      <Col sm="12">
                        <CompletedOrders />
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="1">
                    <Row>
                      <Col sm="12">
                        <All />
                      </Col>
                    </Row>
                  </TabPane>
                </TabContent>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );

};

export default AllOrders;
