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
import Breadcrumb from "../../../components/Common/Breadcrumb";

import ApprovedOrders from "src/components/orders/returnOrders/ApprovedOrders";
import PendingOrders from "src/components/orders/returnOrders/PendingOrders";
import RejectedOrders from "src/components/orders/returnOrders/RejectedOrders";
import All from "src/components/orders/returnOrders/All";

import "../orders.css";

const ReturnOrders = () => {
  const [activeTab, setActiveTab] = useState("2");

  const toggle = (tab: any) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const items = [
    { text: "Dashboard", link: `/` },
  ];

  return (
    <>
      <div className="page-content">
        <Container fluid={true} >
          <Breadcrumb items={items} currentPage="Return Orders" />

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
                      APPROVED
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={activeTab === "4" ? "tab-button active" : "tab-button"}
                      onClick={() => {
                        toggle("4");
                      }}
                    >
                      REJECTED
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
                  <TabPane tabId="1">
                    <Row>
                      <Col sm="12">
                        <All />
                      </Col>
                    </Row>
                  </TabPane>
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
                        <ApprovedOrders />
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="4">
                    <Row>
                      <Col sm="12">
                        <RejectedOrders />
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

export default ReturnOrders;
