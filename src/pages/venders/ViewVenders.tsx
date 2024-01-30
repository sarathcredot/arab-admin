import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Breadcrumb from "src/components/Common/Breadcrumb";
import {
  Container,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Button,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Row,
  Col,
} from "reactstrap";
import classnames from "classnames";
import ViewCard from "./components/Outlate";
import CategoryList from "./components/Categorey";
import BrandList from "../branding/BrandList";
import AssignedBrandList from "./components/LIstBrands";
import user1 from "src/assets/images/users/avatar-1.jpg";
import ConfirmationModal from "./ConfirmationModal";
import { ToastContainer, toast } from "react-toastify";

interface IcontactPerson {
  phoneNumber: string;
  name: string;
  designation: string;
}

interface Iimage {
  fileURL: string;
}

interface IVendor {
  _id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  isBlocked: boolean;
  isKycCompleted: string;
  outletId: string;
  outletName: string;
  outletStatus: string;
  companyId: string;
  companyName: string;
  companyStatus: string;
  profilePic: Iimage;
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
        profilePic {
          fileType
          fileURL
          mimeType
          originalName
        }
      }
    }
  }
`;

const PUT_VENDOR_PROFILE = gql`
  mutation UpdateVendorProfileByAdmin($input: VendorEditProfileByAdminInput!) {
    updateVendorProfileByAdmin(input: $input) {
      _id
      message
    }
  }
`;

function ViewVenders() {
  const { id } = useParams();
  const [vendorData, setVendorData] = useState<IVendor>();
  const [activeTab, setActiveTab] = useState("Vendor");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const [updateVendorProfile] = useMutation(PUT_VENDOR_PROFILE);
  const {
    loading: vendorLoading,
    error: vendorError,
    data: vendorDataResponse,
    refetch: vendorRefetch,
  } = useQuery(GET_AVENDOR, {
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
  }, [id, vendorDataResponse]);

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
  };

  function getStatusColor(status: any) {
    switch (status) {
      case "ACTIVE":
        return "#4CAF50";
      case "BLOCKED":
        return "#F44336";

      default:
        return "#2196F3";
    }
  }

  const toggleConfirmationModal = () => {
    setShowConfirmationModal(!showConfirmationModal);
  };
  const handleCancel = () => {
    // If the user cancels, close the modal
    toggleConfirmationModal();
  };

  const handleConfirmation = async () => {
    try {
      const { data } = await updateVendorProfile({
        variables: {
          input: {
            _id: id,
            isKycCompleted: true,
          },
        },
      });

      vendorRefetch();
      toggleConfirmationModal();
      setTimeout(() => {
        if (data) {
          toast.success(data.message);
          vendorRefetch();
        }
      }, 3000);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Container fluid={true} style={{ marginTop: "100px" }}>
      <ToastContainer />
      <Breadcrumb title="Dashboard" breadcrumbItem="Vendor" link="/" />

      <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "Vendor" })}
            onClick={() => handleTabChange("Vendor")}
          >
            Vendor
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "companydetails" })}
            onClick={() => handleTabChange("companydetails")}
          >
            Company Details
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "businessoutlet" })}
            onClick={() => handleTabChange("businessoutlet")}
          >
            Business Outlet
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "category" })}
            onClick={() => handleTabChange("category")}
          >
            Category
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "brands" })}
            onClick={() => handleTabChange("brands")}
          >
            Brands
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent activeTab={activeTab}>
        <TabPane tabId="Vendor">
          <Card
            style={{
              width: "100rem",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
              marginTop: "5rem",
            }}
          >
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
              src={vendorData?.profilePic?.fileURL || user1}
              alt="Profile"
            />
            <CardBody>
              <CardTitle>
                <strong> {vendorData?.fullName} </strong>
              </CardTitle>
              <CardText>
                <Row>
                  <Col md={3}>
                    <p className="mt-5">
                      <strong>Email:</strong> {vendorData?.email}
                    </p>
                    <p className="mt-5">
                      <strong>Mobile Number:</strong> {vendorData?.mobileNumber}
                    </p>
                  </Col>
                  <Col md={3}>
                    <p className="mt-5">
                      <strong>Status:</strong>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "5px 10px",
                          borderRadius: "15px",
                          background: getStatusColor(
                            vendorData?.isBlocked == true ? "BLOCKED" : "ACTIVE"
                          ),
                          color: "#fff",
                          marginLeft: "10px",
                        }}
                      >
                        {vendorData?.isBlocked == true ? "BLOCKED" : "ACTIVE"}
                      </span>
                    </p>
                  </Col>
                </Row>
              </CardText>

              <div>
                {vendorData?.isKycCompleted ? (
                  <>{null}</>
                ) : (
                  <Button
                    style={{ backgroundColor: "#000000" }}
                    onClick={() => setShowConfirmationModal(true)}
                  >
                    Verify Vendor
                  </Button>
                )}
              </div>
              <ConfirmationModal
                isOpen={showConfirmationModal}
                onConfirm={handleConfirmation}
                onCancel={handleCancel}
              />
            </CardBody>
          </Card>
        </TabPane>
        <TabPane tabId="companydetails">
          <ViewCard
            option={"companydetails"}
            IdCompany={vendorData?.companyId}
          />
        </TabPane>
        <TabPane tabId="businessoutlet">
          <ViewCard
            option={"businessoutlet"}
            IdBusiness={vendorData?.outletId}
          />
        </TabPane>
        <TabPane tabId="category">
          <CategoryList />
        </TabPane>
        <TabPane tabId="brands">
          {/* <CategoryList    />
           */}

          <AssignedBrandList />
        </TabPane>
      </TabContent>
    </Container>
  );
}

export default ViewVenders;
