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
import DeliveredOrders from "src/components/orders/shippingOrders/DeliveredOrders";
import PackageInProgressOrders from "src/components/orders/shippingOrders/PackageInProgressOrders";
import PendingOrders from "src/components/orders/shippingOrders/PendingOrders";
import Breadcrumb from "../../../components/Common/Breadcrumb";

import "../orders.css";
import ShippedOrders from "src/components/orders/shippingOrders/ShippedOrders";
import CancelledOrders from "src/components/orders/shippingOrders/CancelledOrders";
import All from "src/components/orders/shippingOrders/All";
import ExportExcelList from "src/components/orders/ExportExcelList";


const ShippingOrders = () => {
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
        <Container fluid={true}>
          <Breadcrumb items={items} currentPage="Shipping Orders" />

          <Row>
            <Col lg={12}>

              <Row>
                <Col xs={12} style={{ display: "flex", alignItems: "flex-end", justifyContent: "flex-end" }}>
                  <ExportExcelList name={"SHIPPING_EXPORT"} />
                </Col>

                <Col xs={12}>

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
                        PACKAGE IN PROGRESS
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={activeTab === "4" ? "tab-button active" : "tab-button"}
                        onClick={() => {
                          toggle("4");
                        }}
                      >
                        SHIPPED
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={activeTab === "5" ? "tab-button active" : "tab-button"}
                        onClick={() => {
                          toggle("5");
                        }}
                      >
                        DELIVERED
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={activeTab === "6" ? "tab-button active" : "tab-button"}
                        onClick={() => {
                          toggle("6");
                        }}
                      >
                        CANCELED
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
                </Col>


              </Row>


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
                      <PackageInProgressOrders />
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="4">
                  <Row>
                    <Col sm="12">
                      <ShippedOrders />
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="5">
                  <Row>
                    <Col sm="12">
                      <DeliveredOrders />
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="6">
                  <Row>
                    <Col sm="12">
                      <CancelledOrders />
                    </Col>
                  </Row>
                </TabPane>
              </TabContent>

            </Col>
          </Row>
        </Container>
      </div>
    </>
  );

};

export default ShippingOrders;
