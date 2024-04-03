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
  CardHeader,
} from "reactstrap";
import Breadcrumb from "src/components/Common/Breadcrumb";
import FormVender from "../venders/FormVender";
import { bR } from "@fullcalendar/core/internal-common";
import BrandForm from "./BrandForm";
import CustomButton from "src/components/Common/CustomButton";
import StatusIndicator from "src/components/statusIndicator/StatusIndicator";
import Loader from "src/components/Common/Loader";
import { isBoolean } from "lodash";
import { act } from "react-dom/test-utils";

interface IBrandRecord {
  _id: string;
  brandName: string;
  isBlocked: boolean;
  logo: {
    fileURL: string;
  };
}

const BrandList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [brandData, setBrandData] = useState<IBrandRecord[]>([]);
  const [activeTab, setActiveTab] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [maxRecords, setMaxRecords] = useState(0);


  const GET_BRAND = gql`
   query GetAllBrandRecordsByAdmin($input: BrandRecordsFilter) {
  getAllBrandRecordsByAdmin(input: $input) {
    maxRecords
    records {
      _id
      brandName
      isBlocked
      logo {
        fileType
        fileURL
        mimeType
        originalName
      }
      isPopular
      priority
    }
    message
  }
}
  `;

  const {
    loading: brandLoading,
    error: brandError,
    data: brandDataResponse,
    refetch: brandRefetch,
  } = useQuery(GET_BRAND, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        page: currentPage,
        size: pageSize,
        query: searchTerm,
        isBlocked: activeTab
      },
    },
  });


  useEffect(() => {
    if (brandDataResponse && brandDataResponse.getAllBrandRecordsByAdmin) {
      setBrandData(brandDataResponse.getAllBrandRecordsByAdmin.records);
      setMaxRecords(brandDataResponse.getAllBrandRecordsByAdmin.maxRecords);
    }
  }, [brandDataResponse, brandRefetch, activeTab]);

  if (brandError) {
    console.error("Error fetching vendor data:", brandError);

  }

  const totalPages = Math.ceil(maxRecords / pageSize);

  const toggleAddModal = () => {
    setShowAddModal(!showAddModal);
  };
  const items = [
    { text: "Dashboard", link: `/` },
  ];


  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb items={items} currentPage="Brands" />
          <Nav tabs>
            <NavItem>
              <NavLink
                className={activeTab === null ? "tab-button active" : "tab-button"}
                onClick={() => setActiveTab(null)}
              >
                ALL
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === false ? "tab-button active" : "tab-button"}
                onClick={() => setActiveTab(false)}
              >
                ACTIVE
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === true ? "tab-button active" : "tab-button"}
                onClick={() => setActiveTab(true)}
              >
                BLOCKED
              </NavLink>
            </NavItem>
          </Nav>

          <Row style={{ marginTop: "20px" }}>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <Row>
                    <Col xs={6}>
                      <Input
                        type="text"
                        placeholder="Search by name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: "60%", }}
                      />
                    </Col>
                    <Col xs={6} style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                      <CustomButton
                        onClick={() => toggleAddModal()} name="Add New Brand" icon="material-symbols:add" /
                      >
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>

                  <BrandForm
                    isOpen={showAddModal}
                    toggle={toggleAddModal}
                    refetch={brandRefetch}
                  />
                  {
                    brandLoading ?
                      <Loader />
                      :

                      <Table id="tech-companies-1" className="table table-striped table-bordered">
                        <thead>
                          <tr>
                            <th>No</th>
                            <th>Brand Name</th>
                            <th>Logo</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {brandData.map((brand, index) => (
                            <tr key={brand._id}>
                              <td>{currentPage * pageSize + index + 1}</td>
                              <td>{brand.brandName}</td>

                              <td>
                                {brand.logo && (
                                  <img
                                    src={brand.logo.fileURL}
                                    alt={`Logo for ${brand.brandName}`}
                                    style={{ width: "50px", height: "50px" }}
                                  />
                                )}
                              </td>
                              <td
                              >
                                <StatusIndicator status={brand.isBlocked ? "BLOCKED" : "ACTIVE"} />

                              </td>
                              <td>
                                <Link to={`/brands/${brand._id}`}>
                                  <Button
                                    size="sm"
                                    color="primary"
                                  >
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
                            key={index}
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
};

export default BrandList;
