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

import PendingRefundOrders from "src/components/orders/refundOrders/PendingRefundOrders";
import PaidRefundOrders from "src/components/orders/refundOrders/PaidRefundOrders";
import All from "src/components/orders/refundOrders/All";

import "../orders.css";

const RefundOrders = () => {
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
          <Breadcrumb items={items} currentPage="Refund Orders" />

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
                      PAID
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
                        <PendingRefundOrders />
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="3">
                    <Row>
                      <Col sm="12">
                        <PaidRefundOrders />
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

export default RefundOrders;
