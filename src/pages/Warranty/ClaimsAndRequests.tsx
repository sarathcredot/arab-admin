import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Nav,
  NavItem,
  NavLink,
  Row,
  Table,
} from "reactstrap";
import Breadcrumb from "src/components/Common/Breadcrumb";
import Loader from "src/components/Common/Loader";
import { gql, useMutation, useQuery } from "@apollo/client";
import { toast, ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import StatusIndicator from "src/components/statusIndicator/StatusIndicator";
import { Link } from "react-router-dom";
import { capitalize } from "lodash";
import { capitalCase } from "change-case";

const items = [
  { text: "Dashboard", link: `/` },
  { text: "Warranty", link: null },
];

const GET_ALL_REQUESTS = gql`
  query GetAllClaimRequestsByAdmin($input: getAllClaimRequestsByAdminInput) {
    getAllClaimRequestsByAdmin(input: $input) {
      data {
        user {
          displayName
        }
        product {
          productName
          _id
          itemId
        }
        _id
        productImage {
          fileType
          fileURL
          mimeType
          originalName
        }
        createdAt
        issueDescription
        order
        warrantyId
        claimStatus
        claimType
      }
      maxRecords
      success
    }
  }
`;

const ClaimsAndRequests = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeTab, setActiveTab] = useState("REQUESTS");
  const statusOptions =
    activeTab === "REQUESTS"
      ? ["PENDING", "REJECTED"]
      : [
          "APPROVED",
          "PACKAGE_IN_PROGRESS",
          "REPLACEMENT_SHIPPED",
          "OUT_FOR_DELIVERY",
          "REPLACEMENT_COMPLETED",
          "RETURNED_TO_WAREHOUSE",
          "POSTPONED",
        ];
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<any>("PENDING");
  const toggleStatusDropdown = () => {
    setStatusDropdownOpen(!statusDropdownOpen);
  };
  console.log("selectedStatus = ", selectedStatus);
  const handleStatusSelect = (selectedOption: any) => {
    setSelectedStatus(selectedOption);
    setStatusDropdownOpen(false);
  };
  const toggleTab = (tab: string) => {
    setActiveTab(tab);
    tab === "CLAIMS" ? setSelectedStatus("APPROVED") : setSelectedStatus("PENDING");
  };
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  const [requests, setRequests] = useState<any[]>([]);

  // get all warranty claim requests
  const {
    loading: requestsLoading,
    error: requestsError,
    data: requestsDataResponse,
    refetch: requestsRefetch,
  } = useQuery(GET_ALL_REQUESTS, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        page: currentPage,
        size: pageSize,
        search: searchTerm,
        claimStatus: selectedStatus,
      },
    },
  });

  useEffect(() => {
    if (requestsDataResponse && requestsDataResponse.getAllClaimRequestsByAdmin?.data) {
      console.log("RESPONSE = ", requestsDataResponse?.getAllClaimRequestsByAdmin?.data);
      setRequests(requestsDataResponse && requestsDataResponse?.getAllClaimRequestsByAdmin?.data);
    }
  }, [requestsDataResponse]);

  const totalRecords = requestsDataResponse?.getAllClaimRequestsByAdmin?.maxRecords || 0;
  const totalPages = Math.ceil(totalRecords / pageSize);
  console.log("requests = ", requestsDataResponse);
  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            items={items}
            currentPage="Claims and Requests"
          />
          <Nav tabs>
            <NavItem>
              <NavLink
                className={activeTab === "REQUESTS" ? "tab-button active" : "tab-button"}
                onClick={() => toggleTab("REQUESTS")}
              >
                Requests
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === "CLAIMS" ? "tab-button active" : "tab-button"}
                onClick={() => toggleTab("CLAIMS")}
              >
                Claims
              </NavLink>
            </NavItem>
          </Nav>
          <Row style={{ marginTop: "20px" }}>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <Row>
                    <Col
                      xs={9}
                      style={{ display: "flex", alignItems: "center", gap: "20px" }}
                    >
                      <Input
                        type="text"
                        placeholder="Search by Warranty ID"
                        value={searchTerm}
                        onChange={(e) => {
                          setCurrentPage(0);
                          setSearchTerm(e.target.value);
                        }}
                        style={{ width: "50%" }}
                      />
                    </Col>
                    <Col
                      xs={3}
                      style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}
                    >
                      <Dropdown
                        isOpen={statusDropdownOpen}
                        toggle={toggleStatusDropdown}
                      >
                        <DropdownToggle caret>
                          {selectedStatus ? capitalCase(selectedStatus) : "Select Status"}{" "}
                          <FontAwesomeIcon
                            icon={faAngleDown}
                            style={{ marginLeft: 5 }}
                          />
                        </DropdownToggle>
                        <DropdownMenu>
                          {statusOptions.map((option) => (
                            <DropdownItem
                              key={option}
                              onClick={() => handleStatusSelect(option)}
                            >
                              {capitalCase(option)}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </Dropdown>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Row>
                    {requestsLoading ? (
                      <Loader />
                    ) : (
                      <div className="table-rep-plugin">
                        <div
                          className="table-responsive mb-0"
                          data-pattern="priority-columns"
                        >
                          <Table
                            id="tech-companies-1"
                            className="table table-striped table-bordered"
                          >
                            <thead>
                              <tr>
                                <th style={{ width: "30px", textAlign: "center" }}>#</th>
                                <th>Warranty ID</th>
                                <th style={{ width: "110px" }}>Date</th>
                                <th>Order ID</th>
                                <th>Product Name</th>
                                <th>Warranty Type</th>
                                <th style={{ width: "100px", textAlign: "center" }}>Status</th>
                                <th style={{ width: "75px", textAlign: "center" }}>Action</th>
                              </tr>
                            </thead>

                            <tbody>
                              {requests &&
                                requests.map((item, index) => (
                                  <tr key={index}>
                                    <td style={{ textAlign: "center" }}>{currentPage * pageSize + (index + 1)}</td>
                                    <td>{item?.warrantyId}</td>
                                    <td>{moment(item?.createdAt).format("ll")}</td>
                                    <td>
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <p style={{ margin: 0 }}>{item?.order}</p>
                                      </div>
                                    </td>
                                    <td>{item?.product?.productName}</td>
                                    <td>{capitalize(item?.claimType)} </td>
                                    <td style={{ textAlign: "center" }}>
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        <StatusIndicator
                                          variant="default"
                                          status={item?.claimStatus}
                                        />
                                      </div>
                                    </td>
                                    <td>
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          gap: 10,
                                        }}
                                      >
                                        <Link to={`/warranty-claims/details?id=${item?._id}`}>
                                          <Button
                                            style={{
                                              display: "block",
                                              margin: "auto",
                                            }}
                                            color="primary"
                                            size="sm"
                                          >
                                            View
                                          </Button>
                                        </Link>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </Table>
                        </div>
                      </div>
                    )}
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          {/* pagination */}

          <Row style={{ marginRight: "10px" }}>
            <Col>
              <div className="d-flex justify-content-end mt-0 ">
                <ul className="pagination">
                  <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
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
                      className={`page-item ${currentPage === index ? "active" : ""}`}
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
                    <li className={`page-item ${currentPage === totalPages - 1 ? "disabled" : ""}`}>
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
        </Container>
      </div>
      <ToastContainer />
    </>
  );
};

export default ClaimsAndRequests;
