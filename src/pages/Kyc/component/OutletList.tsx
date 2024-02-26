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
  Table,
} from "reactstrap";
import Breadcrumb from "src/components/Common/Breadcrumb";
interface IStatus {
  status: boolean;
}

interface IOutlet {
  vendorId: string;
  fullName: string;
  isKycCompleted: boolean;
  _id: string;
  outletName: string;
  status: string;
  companyId: string;
  companyName: string;
  companyStatus: string;
}

function OutletListing() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [outletData, setOutletData] = useState<IOutlet[]>([]);
  const [activeTab, setActiveTab] = useState<string>("UNDER_VERIFICATION");
  const [maxRecords, setMaxRecords] = useState<number>(0);
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(0);

  const GET_ALL_KYC = gql`query GetAllVendorOutletRecordsByAdmin($input: VendorOutletRecordsByAdminFilter) {
  getAllVendorOutletRecordsByAdmin(input: $input) {
    maxRecords
    records {
      vendorId
      fullName
      isKycCompleted
      _id
      outletName
      status
      companyId
      companyName
      companyStatus
    }
    message
  }
}
  `;


  const {
    loading: kycLoading,
    error: kycError,
    data: kycDataResponse,
    refetch: kycRefetch,
  } = useQuery(GET_ALL_KYC, {
    variables: {
      input: {
        page: currentPage,
        size: pageSize,
        status: activeTab
      },
    },
  });

  useEffect(() => {
    if (kycDataResponse) {
      setOutletData(kycDataResponse.getAllVendorOutletRecordsByAdmin?.records || []);
    }
  }, [kycDataResponse, currentPage]);

  const toggleTab = (tab: string) => {
    console.log("Active Tab:", tab);
    setActiveTab(tab);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // const getFilteredkyc = (): IOutlet[] => {
  //   switch (activeTab) {
  //     case "Pending":
  //       return outletData.filter((vendor) => vendor.isKycCompleted === false);
  //     case "Completed":
  //       return outletData.filter((vendor) => vendor.isKycCompleted === true);
  //     default:
  //       return outletData;
  //   }
  // };
  const totalRecords = kycDataResponse?.getAllVendorOutletRecordsByAdmin.maxRecords || 0;
  const totalPages = Math.ceil(totalRecords / pageSize);

  const handleNextPage = () => {
    if (currentPage + 1 < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Nav tabs>
            <NavItem>
              <NavLink
                className={activeTab === "UNDER_VERIFICATION" ? "active" : ""}
                onClick={() => toggleTab("UNDER_VERIFICATION")}
              >
                Verify
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === "PENDING" ? "active" : ""}
                onClick={() => toggleTab("PENDING")}
              >
                Pending
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === "COMPLETED" ? "active" : ""}
                onClick={() => toggleTab("COMPLETED")}
              >
                Completed
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
                    onChange={handleSearch}
                    style={{ width: "50%", marginBottom: "20px" }}
                  />
                  <Table id="tech-companies-1" className="table table-striped table-bordered">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Full Name</th>
                        <th>Outlet Name</th>
                        <th>Kyc Status</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {outletData
                        .slice(
                          currentPage * pageSize,
                          (currentPage + 1) * pageSize
                        )

                        .map((outlet, index) => (
                          <tr key={outlet._id}>
                            <td>{index + 1}</td>
                            <td>{outlet.fullName}</td>
                            <td>{outlet.outletName}</td>
                            <td
                              style={{
                                color: outlet.isKycCompleted ? "#5cb85c" : "red",
                              }}
                            >
                              {outlet.isKycCompleted ? "COMPLETED" : "PENDING"}
                            </td>
                            <td>{outlet.status}</td>
                            <td>
                              <Link to={`/vendors/${outlet.vendorId}`}>
                                <Button style={{ marginLeft: "20px", backgroundColor: "#000000" }}>
                                  View
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </CardBody>

                <Row style={{ marginRight: "10px" }}>
                  <Col>
                    <div className="d-flex justify-content-end mt-0 ">
                      <ul className="pagination">
                        <li
                          className={`page-item ${currentPage === 0 ? "disabled" : ""
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
                            key={`page-${index + 1}`}
                            className={`page-item ${currentPage === index ? "active" : ""
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
                            className={`page-item ${currentPage === totalPages - 1 ? "disabled" : ""
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
}

export default OutletListing;

