import { gql, useMutation, useQuery } from "@apollo/client";
import { capitalCase } from "change-case";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardImg,
  CardTitle,
  Container,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from "reactstrap";
import Breadcrumb from "src/components/Common/Breadcrumb";
import CustomButton from "src/components/Common/CustomButton";
import EditFormVender from "./EditFormVender";
import CategoryList from "./components/Category";
import AssignedBrandList from "./components/LIstBrands";
import VendorCards from "./components/VendorCards";
import ViewCardBusiness from "./components/ViewCardBusiness";
import ViewCardCompany from "./components/ViewCardCompany";
import VendorProducts from "./components/VendorProducts";
import demoAvatar from "../../assets/images/users/avatar-dummy.webp"
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
  isKycCompleted: boolean;
  outletId: string;
  outletName: string;
  outletStatus: string;
  companyId: string;
  companyName: string;
  companyStatus: string;
  countryCode: string;
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
        countryCode
        mobileNumber
        profilePic {
          fileType
          fileURL
          mimeType
          originalName
        }
        isBlocked
        isKycCompleted
        outletId
        outletName
        outletStatus
        companyId
        companyName
        companyStatus
        brands
        categories
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
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const tab = searchParams.get("tab");
  const [vendorData, setVendorData] = useState<IVendor>();
  const [activeTab, setActiveTab] = useState(tab || "Vendor");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);

  const editFormToggle = () => {
    setEditFormOpen(!editFormOpen);
  };

  const [updateVendorProfile] = useMutation(PUT_VENDOR_PROFILE);
  const {
    loading: vendorLoading,
    error: vendorError,
    data: vendorDataResponse,
    refetch: vendorRefetch,
  } = useQuery(GET_AVENDOR, {
    fetchPolicy: "network-only",
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


  const toggleConfirmationModal = () => {
    setShowConfirmationModal(!showConfirmationModal);
  };
  const handleCancel = () => {
    toggleConfirmationModal();
  };


  const items = [
    { text: "Dashboard", link: `/` },
    { text: "Vendors", link: `/vendors` },
  ];

  return (
    <div className="page-content">
      <Container fluid={true}>
        <Breadcrumb items={items} currentPage="Vendor Details" />

        <VendorCards id={id} />

        <Nav tabs style={{ marginTop: "20px" }}>
          <NavItem>
            <NavLink
              className={activeTab === "Vendor" ? "tab-button active" : "tab-button"}
              onClick={() => handleTabChange("Vendor")}
            >
              Vendor
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeTab === "companydetails" ? "tab-button active" : "tab-button"}
              onClick={() => handleTabChange("companydetails")}
            >
              Company Details
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeTab === "businessoutlet" ? "tab-button active" : "tab-button"}
              onClick={() => handleTabChange("businessoutlet")}
            >
              Business Outlet
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeTab === "category" ? "tab-button active" : "tab-button"}
              onClick={() => handleTabChange("category")}
            >
              Catagories
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeTab === "brands" ? "tab-button active" : "tab-button"}
              onClick={() => handleTabChange("brands")}
            >
              Brands
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={activeTab === "products" ? "tab-button active" : "tab-button"}
              onClick={() => handleTabChange("products")}
            >
              Products
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent activeTab={activeTab}>
          <TabPane tabId="Vendor">
            <div>
              <div style={{ display: "flex", marginTop: "20px", gap: "20px" }}>
                <Card style={{ flex: 3, padding: "20px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      flexDirection: "column",
                    }}
                  >
                    <CardImg
                      style={{
                        height: "100px",
                        width: "100px",
                        objectFit: "cover",
                        borderRadius: "50%",
                        margin: "20px",
                        border: "5px solid #fff",
                      }}
                      variant="top"
                      src={vendorData?.profilePic?.fileURL || demoAvatar}
                      alt="Profile"
                    />
                    <div>
                      <CardTitle>
                        <strong style={{ fontSize: "20px" }}>
                          {" "}
                          {vendorData?.fullName && capitalCase(vendorData?.fullName)}{" "}
                        </strong>
                      </CardTitle>
                    </div>

                    <div
                      style={{
                        border: "1px solid #e9e9ef",
                        borderRadius: "9px",
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: "3px",
                        flexDirection: "column",
                        padding: "5px 0px",
                      }}
                    >
                      <span style={{ fontSize: "10px" }}>Email Address</span>
                      <h6>{vendorData?.email}</h6>
                    </div>
                  </div>
                </Card>

                <Card style={{ flex: 8 }}>
                  <CardHeader
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ fontSize: "17px", fontWeight: "500" }}>Details</span>
                    <CustomButton name="Update" icon="ic:baseline-edit" onClick={editFormToggle} />
                    <EditFormVender
                      isOpen={editFormOpen}
                      refetch={vendorRefetch}
                      toggle={editFormToggle}
                      data={vendorData}
                    />
                  </CardHeader>
                  <CardBody>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ width: "100px" }}>Fullname : </div>
                        <strong>{vendorData?.fullName && capitalCase(vendorData?.fullName)}</strong>
                      </div>

                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ width: "100px" }}>Email : </div>
                        <strong>{vendorData?.email}</strong>
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ width: "100px" }}>ID : </div>
                        <strong>{vendorData?._id}</strong>
                      </div>

                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ width: "100px" }}>Phone : </div>
                        <strong>{`${vendorData?.countryCode} ${vendorData?.mobileNumber}`}</strong>
                      </div>

                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ width: "100px" }}>Status : </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "1px",
                            border: `1px solid ${vendorData?.isBlocked == true ? "red" : "green"}`,
                            width: "100px",
                            borderRadius: "20px",
                            color: ` ${vendorData?.isBlocked == true ? "red" : "green"}`,
                          }}
                        >
                          {vendorData?.isBlocked == true ? "Blocked" : "Active"}
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ width: "100px" }}>KYC Status : </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "1px",
                            border: `1px solid ${vendorData?.isKycCompleted !== true ? "orange" : "green"
                              }`,
                            width: "100px",
                            borderRadius: "20px",
                            color: ` ${vendorData?.isKycCompleted !== true ? "orange" : "green"}`,
                          }}
                        >
                          {vendorData?.isKycCompleted == true ? "Completed" : "Pending"}
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          </TabPane>
          <TabPane tabId="companydetails">
            <ViewCardCompany IdCompany={vendorData?.companyId} />
          </TabPane>
          <TabPane tabId="businessoutlet">
            <ViewCardBusiness IdBusiness={vendorData?.outletId} />
          </TabPane>
          <TabPane tabId="category">
            <CategoryList />
          </TabPane>
          <TabPane tabId="brands">
            <AssignedBrandList />
          </TabPane>
          <TabPane tabId="products">
            <VendorProducts />
          </TabPane>
        </TabContent>
      </Container>
    </div>
  );
}

export default ViewVenders;
