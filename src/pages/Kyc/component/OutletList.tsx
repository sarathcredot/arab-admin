import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Collapse,
  Container,
  Input,
  Nav,
  NavItem,
  NavLink,
  Row,
  Table,
} from "reactstrap";
import Breadcrumb from "src/components/Common/Breadcrumb";
import CustomButton from "src/components/Common/CustomButton";
import Loader from "src/components/Common/Loader";
import DynamicFilter from "src/components/filter/DynamicFilter";
import StatusIndicator from "src/components/statusIndicator/StatusIndicator";
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
  const [filters, setFilters] = useState({
    vendorId: "",
    outletName: "",
  });


  const GET_ALL_KYC = gql`
  query GetAllVendorOutletRecordsByAdmin($input: VendorOutletRecordsByAdminFilter) {
  getAllVendorOutletRecordsByAdmin(input: $input) {
    message
    records {
      outletName
      vendorId
      fullName
      isKycCompleted
      _id
      status
      country
      district
      village
      address
      contactPersonName
      contactPersonNumber
      contactPersonDesignation
      remarks
    }
  }
}
  `;


  const {
    loading: kycLoading,
    error: kycError,
    data: kycDataResponse,
    refetch: kycRefetch,
  } = useQuery(GET_ALL_KYC, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        page: currentPage,
        size: pageSize,
        status: activeTab,
        fullName: searchTerm,
        ...(filters.vendorId && { vendorId: filters.vendorId }),
        outletName: filters.outletName,
      },
    },
  });

  useEffect(() => {
    if (kycDataResponse) {
      setOutletData(kycDataResponse.getAllVendorOutletRecordsByAdmin?.records || []);
    }
  }, [kycDataResponse, currentPage, filters, searchTerm]);

  const toggleTab = (tab: string) => {
    setActiveTab(tab);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const totalRecords = kycDataResponse?.getAllVendorOutletRecordsByAdmin.maxRecords || 0;
  const totalPages = Math.ceil(totalRecords / pageSize);

  const handleNextPage = () => {
    if (currentPage + 1 < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  const handleFilterSubmit = (formData: any) => {
    setFilters({
      outletName: formData.outletName,
      vendorId: formData.vendorId,
    })
  };

  const filterOptions = [
    {
      label: 'Vendor ID',
      type: 'text',
      name: 'vendorId',
    },
    {
      label: 'Outlet name',
      type: 'text',
      name: 'outletName',
    },
  ];

  return (
    <>
      <Container fluid={true} style={{ marginTop: "50px" }}>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={activeTab === "UNDER_VERIFICATION" ? "tab-button active" : "tab-button"}
              onClick={() => toggleTab("UNDER_VERIFICATION")}
            >
              VERIFY
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink
              className={activeTab === "COMPLETED" ? "tab-button active" : "tab-button"}
              onClick={() => toggleTab("COMPLETED")}
            >
              COMPLETED
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink
              className={activeTab === "PENDING" ? "tab-button active" : "tab-button"}
              onClick={() => toggleTab("PENDING")}
            >
              PENDING
            </NavLink>
          </NavItem>


          <NavItem>
            <NavLink
              className={activeTab === "REJECTED" ? "tab-button active" : "tab-button"}
              onClick={() => toggleTab("REJECTED")}
            >
              REJECTED
            </NavLink>
          </NavItem>

        </Nav>

        <Row>
          <Col lg={12}>
            <Card style={{ marginTop: "10px" }}>
              <CardHeader>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Input
                    type="text"
                    placeholder="Search by name"
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{ width: "450px", }}
                  />
                  <CustomButton onClick={toggleCollapse} name="Filters" icon="clarity:filter-solid" />
                </div>
              </CardHeader>
              <CardBody>
                <Collapse isOpen={isOpen}>
                  <DynamicFilter
                    filterOptions={filterOptions}
                    onSubmit={handleFilterSubmit}
                  />
                </Collapse>
                {
                  kycLoading ?
                    <Loader />
                    :

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
                        {outletData?.map((outlet, index) => (
                          <tr key={outlet._id}>
                            <td>{currentPage * pageSize + index + 1}</td>
                            <td>{outlet.fullName}</td>
                            <td>{outlet.outletName}</td>
                            <td
                            >
                              <StatusIndicator status={outlet.isKycCompleted ? "COMPLETED" : "PENDING"} />
                            </td>
                            <td>
                              <StatusIndicator status={outlet?.status} /></td>
                            <td>
                              <Link to={`/vendors/view?id=${outlet.vendorId}&&tab=businessoutlet`}>
                                <Button size="sm" color="primary">
                                  View
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                }
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
    </>
  );
}

export default OutletListing;

