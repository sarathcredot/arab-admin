import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import {
  Button,
  Col,
  Container,
  Nav,
  NavItem,
  NavLink,
  Popover,
  PopoverBody,
  PopoverHeader,
  Row,
  TabContent, TabPane, Table
} from "reactstrap";
import CompletedOrders from "src/components/orders/allOrders/CompletedOrders";
import InProgressOrders from "src/components/orders/allOrders/InProgressOrders";
import PendingOrders from "src/components/orders/allOrders/PendingOrders";
import All from "src/components/orders/allOrders/All";
import Breadcrumb from "../../../components/Common/Breadcrumb";

import "../orders.css";
import CustomButton from "src/components/Common/CustomButton";
import { gql, useQuery } from "@apollo/client";
import moment from "moment";
import ExportExcelList from "src/components/orders/ExportExcelList";


const AllOrders = () => {
  const [activeTab, setActiveTab] = useState("1");






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
          <Breadcrumb items={items} currentPage="All Orders" />
          <Row>
            <Col xs={12} style={{ display: "flex", alignItems: "flex-end", justifyContent: "flex-end" }}>
              <ExportExcelList name={"ORDER_EXPORT"} />
            </Col>

            <Col lg={12}>
              <Row>
                <Col xs={12}>
                  <Nav tabs>
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
                    <NavItem>
                      <NavLink
                        className={activeTab === "2" ? "tab-button active" : "tab-button"}
                        onClick={() => {
                          toggle("2");
                        }}
                      >
                        Pending
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={activeTab === "3" ? "tab-button active" : "tab-button"}
                        onClick={() => {
                          toggle("3");
                        }}
                      >
                        In Progress
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={activeTab === "4" ? "tab-button active" : "tab-button"}
                        onClick={() => {
                          toggle("4");
                        }}
                      >
                        Completed
                      </NavLink>
                    </NavItem>
                    
                  </Nav>
                </Col>


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
              </Row>
            </Col>
          </Row>
        </Container>

      </div>
    </>
  );

};

export default AllOrders;
