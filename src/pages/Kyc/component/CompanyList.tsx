

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
import StatusIndicator from "src/components/statusIndicator/StatusIndicator";


interface ICompanyData {
  vendorId: string;
  _id: string;
  fullName: string;
  isKycCompleted: boolean;
  companyName: string;
  status: string;
  outletId: string;
  outletName: string;
  outletStatus: string;
}

function CompanyListing() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [companyData, setCompanyData] = useState<ICompanyData[]>([]);
  const [activeTab, setActiveTab] = useState<string>("UNDER_VERIFICATION");
  const [maxRecords, setMaxRecords] = useState<number>(0);
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(0);

  const GET_ALL_COMPANY_DATA = gql`
  query GetAllVendorCompanyRecordsByAdmin($input: VendorCompanyRecordsByAdminFilter) {
    getAllVendorCompanyRecordsByAdmin(input: $input) {
      maxRecords
      records {
        status
        vendorId
        _id
        fullName
        isKycCompleted
        companyName
        companyType
        crNumber
      }
      message
    }
  }`;


  const { data: kycDataResponse } = useQuery(GET_ALL_COMPANY_DATA, {
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
      setCompanyData(kycDataResponse.getAllVendorCompanyRecordsByAdmin?.records || []);

    }

  }, [kycDataResponse, activeTab, currentPage]);


  const toggleTab = (tab: string) => {
    setActiveTab(tab);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // const getFilteredkyc = (): ICompanyData[] => {
  //   switch (activeTab) {
  //     case "Pending":
  //       return companyData.filter((vendor) => vendor.isKycCompleted === false);
  //     case "Completed":
  //       return companyData.filter((vendor) => vendor.isKycCompleted === true);
  //     default:
  //       return companyData;
  //   }
  // };
  const totalRecords = kycDataResponse?.getAllVendorCompanyRecordsByAdmin.maxRecords || 0;
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
                className={activeTab === "UNDER_VERIFICATION" ? "tab-button active" : "tab-button"}
                onClick={() => toggleTab("UNDER_VERIFICATION")}
              >
                Verify
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === "PENDING" ? "tab-button active" : "tab-button"}
                onClick={() => toggleTab("PENDING")}
              >
                Pending
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === "COMPLETED" ? "tab-button active" : "tab-button"}
                onClick={() => toggleTab("COMPLETED")}
              >
                Completed
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === "REJECTED" ? "tab-button active" : "tab-button"}
                onClick={() => toggleTab("REJECTED")}
              >
                Rejected
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
                        <th>Company Name</th>
                        <th>Kyc Status</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {companyData
                        .slice(
                          currentPage * pageSize,
                          (currentPage + 1) * pageSize
                        )

                        .map((company, index) => (
                          <tr key={company._id}>
                            <td>{pageSize * currentPage + index + 1}</td>
                            <td>{company.fullName}</td>
                            <td>{company.companyName}</td>
                            <td style={{ color: company.isKycCompleted ? "#5cb85c" : "red" }}>
                              {company.isKycCompleted ? "COMPLETED" : "PENDING"}
                            </td>
                            <td >
                              <StatusIndicator status={company?.status} />

                            </td>
                            <td>
                              <Link to={`/vendors/view?id=${company.vendorId}`}>
                                <Button size="sm" color="primary">
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

export default CompanyListing;

