import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  Table,
} from "reactstrap";
import Breadcrumb from "src/components/Common/Breadcrumb";
import ViewCard from "../venders/components/Outlate";
import classnames from "classnames";
import { Tabs } from "react-bootstrap";
import OutletListing from "./component/OutletList";
import CompanyListing from "./component/CompanyList";
interface IStatus {
  status: boolean;
}

interface IKyc {
  _id: string;
  businessOutlet: IStatus;
  companyDetails: IStatus;
  isKycCompleted: boolean;
  sellingProduct: IStatus;
  vendorId: IStatus;
  fullName: string;
}

function KycListing() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [kycData, setKycData] = useState<IKyc[]>([]);
  const [activeTab, setActiveTab] = useState<string>("CompanyList");
  const [maxRecords, setMaxRecords] = useState<number>(0);
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(0);

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
  };


  return (
    <>
      <div className="page-content">
        <Breadcrumb title="Dashboard" breadcrumbItem="Kyc Listing" link="/" />
        <Container fluid={true}>
        <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "CompanyList" })} onClick={() => handleTabChange("CompanyList")}
              >
                Company List
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "OutletList" })} onClick={() => handleTabChange("OutletList")}>
               Outlet List
              </NavLink>
            </NavItem>
            
          </Nav>


          <TabContent activeTab={activeTab}>

          <TabPane tabId="CompanyList">
          <CompanyListing/>
        </TabPane>

        <TabPane tabId="OutletList">
        <OutletListing/>
        </TabPane>
  </TabContent>
        </Container>
      </div>
    </>
  );
}

export default KycListing;