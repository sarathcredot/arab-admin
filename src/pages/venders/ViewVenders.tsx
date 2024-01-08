import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Breadcrumb from "src/components/Common/Breadcrumb";
import { Container, Card, CardBody, CardImg, CardText, CardTitle, Button, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import classnames from "classnames";
import ViewCard from "./components/Outlate";
import CategoryList from "./components/Categorey";
import BrandList from "../branding/BrandList";
import AssignedBrandList from "./components/LIstBrands";

interface IcontactPerson {
  phoneNumber: string;
  name: string;
  designation: string;
}

interface Iimage {
  fileURL: string;
}

interface IVendor {
  _id:string;
  fullName:string;
  email: string;
  mobileNumber:string;
  isBlocked:boolean;
  isKycCompleted:string;
  outletId:string;
  outletName:string;
  outletStatus:string;
  companyId:string;
  companyName:string;
  companyStatus:string;
  profilePic:Iimage;
}






const GET_AVENDOR = gql`
query GetVendorRecordByAdmin($input: VendorRecordByAdminInput!) {
  getVendorRecordByAdmin(input: $input) {
    message
    record {
      _id
      fullName
      email
      mobileNumber
      isBlocked
      isKycCompleted
      outletId
      outletName
      outletStatus
      companyId
      companyName
      companyStatus
    }
  }
}
`;




function ViewVenders() {
  const { id } = useParams();
  const [vendorData, setVendorData] = useState<IVendor>();
  const [activeTab, setActiveTab] = useState("Vendor");


 

  const { loading: vendorLoading, error: vendorError, data: vendorDataResponse } = useQuery(GET_AVENDOR, {
    variables: {
      input: {
        _id: id,
      },
    },
  });

 

  useEffect(() => {
    if (vendorDataResponse && vendorDataResponse.getVendorRecordByAdmin) {
      setVendorData(vendorDataResponse.getVendorRecordByAdmin?.record);
    }
  }, [id,vendorDataResponse]);

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
  };


 


  function getStatusColor(status:any) {
    switch (status) {
      case "ACTIVE": 
        return "#4CAF50"; // Green for Active status
      case "BLOCKED":
        return "#F44336"; // Red for Inactive status
      // Add more cases for other statuses as needed
      default:
        return "#2196F3"; // Default color for unknown status
    }
  }
  return (
    <Container fluid={true} style={{ marginTop: "100px" }}>
      
      <Breadcrumb title="Dashboard" breadcrumbItem="Vendor" link="/" />
      <Nav tabs>
        <NavItem>
          <NavLink className={classnames({ active: activeTab === "Vendor" })} onClick={() => handleTabChange("Vendor")}>
            Vendor
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink className={classnames({ active: activeTab === "companydetails" })} onClick={() => handleTabChange("companydetails")}>
            Company Details
          </NavLink>
        </NavItem>
        <NavItem>
        <NavLink className={classnames({ active: activeTab === "businessoutlet" })} onClick={() => handleTabChange("businessoutlet")}>
            Business Outlet
          </NavLink>
        </NavItem>
        <NavItem>
        <NavLink className={classnames({ active: activeTab === "category" })} onClick={() => handleTabChange("category")}>
        Category
        </NavLink>
        </NavItem>
        <NavItem>
        <NavLink className={classnames({ active: activeTab === "brands" })} onClick={() => handleTabChange("brands")}>
        brands
        </NavLink>
        </NavItem>
      </Nav>

      <TabContent activeTab={activeTab}>
        <TabPane tabId="Vendor" >
          <Card style={{ width: "50rem", boxShadow: "0 0 10px rgba(0,0,0,0.1)" , marginTop:"5rem"}}>
            <CardImg
              style={{
                height: "200px",
                width: "200px",
                objectFit: "cover",
                borderRadius: "50%",
                margin: "20px",
                border: "5px solid #fff",
              }}
              variant="top"
              src={vendorData?.profilePic?.fileURL}
              alt="Profile"
            />
            <CardBody>
              <CardTitle>
                <strong> {vendorData?.fullName} </strong>
              </CardTitle>
              <CardText>
                <p className="mt-5"><strong>Email:</strong> {vendorData?.email}</p>
                <p className="mt-5"><strong >Mobile Number:</strong> {vendorData?.mobileNumber}</p>
                <p className="mt-5">
  <strong>Status:</strong>
  <span
    style={{
      display: "inline-block",
      padding: "5px 10px",
      borderRadius: "15px",
      background: getStatusColor(vendorData?.isBlocked==true?"BLOCKED":"ACTIVE"), // You can define a function to determine the color based on status
      color: "#fff", // Adjust text color as needed
      marginLeft: "10px", // Adjust spacing
    }}
  >
    {vendorData?.isBlocked==true?"BLOCKED":"ACTIVE"}
  </span>
</p>
              </CardText>
              <div>
               
               
                  <Button  style={{backgroundColor: "#000000"}}>BLOCK</Button>
              
              </div>
            </CardBody>
          </Card>
        </TabPane>
        <TabPane tabId="companydetails">
          <ViewCard option={"companydetails"} IdCompany={vendorData?.companyId}/>
        </TabPane>
        <TabPane tabId="businessoutlet">
          <ViewCard option={"businessoutlet"} IdBusiness={vendorData?.outletId}/>
        </TabPane>
        <TabPane tabId="category">
          <CategoryList    />
          

           
        </TabPane>
        <TabPane tabId="brands">
          {/* <CategoryList    />
           */}

           <AssignedBrandList/>
        </TabPane>
      </TabContent>
    </Container>
  );
}

export default ViewVenders;
