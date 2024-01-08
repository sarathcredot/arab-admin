import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Table,
  Input,
  Button,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import Breadcrumb from "src/components/Common/Breadcrumb";
import FormVender from "./FormVender";

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
}

const VendorList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [vendorData, setVendorData] = useState<IVendor[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10; // Number of items per page
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  const GET_VENDOR = gql`
    query GetAllVendorsRecordsByAdmin($input: VendorsRecordsByAdminFilter) {
      getAllVendorsRecordsByAdmin(input: $input) {
        maxRecords
        message
        records {
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

  const {
    loading: vendorLoading,
    error: vendorError,
    data: vendorDataResponse,
    refetch:refetchVendore
  } = useQuery(GET_VENDOR, {
    variables: {
      input: {
        page: null,
        size: 10,
      },
    },
  });
  useEffect(() => {
    if (vendorDataResponse && vendorDataResponse.getAllVendorsRecordsByAdmin) {
      setVendorData(vendorDataResponse.getAllVendorsRecordsByAdmin.records);
   
    }
  }, [vendorDataResponse]);

  if (vendorError) {
    console.error("Error fetching vendor data:", vendorError);
    // Handle error, display an error message, etc.
  }

  const getFilteredVendors = (): IVendor[] => {
    switch (activeTab) {
      case "verified":
        return vendorData.filter((vendor) => vendor.isBlocked === false);
      case "blocked":
        return vendorData.filter((vendor) => vendor.isKycCompleted === false);
      default:
        return vendorData;
    }
  };

  const totalPages = Math.ceil(getFilteredVendors().length / pageSize);

  const handleNextPage = () => {
    if (currentPage + 1 < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const toggleAddModal = () => {
    setShowAddModal(!showAddModal);
  };

  return (
    <>
      <div className="page-content">
        <Breadcrumb title="Dashboard" breadcrumbItem="Vendors" link="/" />
        <Container fluid={true}>
          <Nav tabs>
            <NavItem>
              <NavLink
                className={activeTab === "all" ? "active" : ""}
                onClick={() => setActiveTab("all")}
              >
                All
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === "verified" ? "active" : ""}
                onClick={() => setActiveTab("verified")}
              >
                Verified
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === "blocked" ? "active" : ""}
                onClick={() => setActiveTab("blocked")}
              >
                Blocked
              </NavLink>
            </NavItem>
          </Nav>

          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <Input
                    type="text"
                    placeholder="Search by name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: "50%", marginBottom: "20px" }}
                  />

                  <div className="d-flex justify-content-end mb-3">
                    <Button onClick={() => toggleAddModal()}  style={{backgroundColor: "#000000"}}>Add Vendor</Button>
                  </div>

                  <FormVender isOpen={showAddModal} toggle={toggleAddModal}  refetch={refetchVendore} />

                  <Table
                    responsive
                    className="table table-bordered table-centered mb-0"
                  >
                    <thead>
                      <tr>
                        <th>No</th> 
                        <th>Full Name</th>
                        <th>Mobile Number</th>
                        <th>Email</th>
                        <th>Company Name</th>
                        <th>Kyc Status</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vendorData
                        .filter((vendor) =>
                          vendor.fullName
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                        )
                        .map((vendor, index) => (
                          <tr key={vendor._id}>
                            <td>{index + 1}</td>
                            <td>{vendor.fullName}</td>
                            <td>{vendor.mobileNumber}</td>
                            <td>{vendor.email}</td>
                            <td>{vendor.companyName}</td>
                            <td   style={{
                                color: vendor.isKycCompleted=== true  ?  "#5cb85c" : "#FFA500",
                              }}>{vendor.isKycCompleted === true ? "Approve":"Pending"}</td>
                            <td
                              style={{
                                color: vendor.isBlocked ===true ? "red" : "#5cb85c",
                              }}
                            >
                              {vendor.isBlocked ===true  ? "Blocked" : "Active"}
                            </td>
                            <td>
                              <Link to={`/vendors/${vendor._id}`}>
                                <Button style={{ marginLeft: "20px" , backgroundColor: "#000000"}}>
                                  View
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </CardBody>

                <Row>
                  <Col>
                    <div className="d-flex justify-content-end mt-0 ">
                      <ul className="pagination">
                        <li
                          className={`page-item ${
                            currentPage === 0 ? "disabled" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 0}
                          >
                            Previous
                          </button>
                        </li>

                        {Array.from({ length: totalPages }, (_, index) => (
                          <li
                            key={index}
                            className={`page-item ${
                              currentPage === index ? "active" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(index)}
                            >
                              {index + 1}
                            </button>
                          </li>
                        ))}

                        {currentPage < totalPages - 1 && (
                          <li
                            className={`page-item ${
                              currentPage === totalPages - 1 ? "disabled" : ""
                            }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(currentPage + 1)}
                              disabled={currentPage === totalPages - 1}
                            >
                              Next
                            </button>
                          </li>
                        )}
                      </ul>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default VendorList;
