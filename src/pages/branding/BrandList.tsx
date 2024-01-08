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
import FormVender from "../venders/FormVender";
import { bR } from "@fullcalendar/core/internal-common";
import BrandForm from "./BrandForm";


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
  const [activeTab, setActiveTab] = useState<boolean>();
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10; // Number of items per page
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  const GET_BRAND = gql`
   query GetAllBrandRecordsByAdmin($input: BrandRecordsFilter) {
  getAllBrandRecordsByAdmin(input: $input) {
    maxRecords
    message
    records {
      _id
      brandName
      isBlocked
      logo {
        fileURL
      }
    }
  }
}
  `;

  const {
    loading: brandLoading,
    error: brandError,
    data: brandDataResponse,
    refetch: brandRefetch,
  } = useQuery(GET_BRAND, {
    variables: {
      input: {
        page: null,
        size: 10,
        
      },
    },
  });
 


  useEffect(() => {
    if (brandDataResponse && brandDataResponse.getAllBrandRecordsByAdmin) {
      setBrandData(brandDataResponse.getAllBrandRecordsByAdmin.records);
    }
  }, [brandDataResponse,brandRefetch]);
  

  if (brandError) {
    console.error("Error fetching vendor data:", brandError);
    // Handle error, display an error message, etc.
  }

 

 

  const totalPages = Math.ceil(brandData.length / pageSize);

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
        <Breadcrumb title="Dashboard" breadcrumbItem="Brands" link="/" />
        <Container fluid={true}>
          <Nav tabs>
            <NavItem>
              <NavLink
                className={activeTab === undefined ? "active" : ""}
                onClick={() => setActiveTab(undefined)}
              >
                All
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === false? "active" : ""}
                onClick={() => setActiveTab(false)}
              >
                Active
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === true ? "active" : ""}
                onClick={() => setActiveTab(true)}
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
            <Button  onClick={() => toggleAddModal()}  style={{backgroundColor: "#000000"}}>Add New Brand</Button>
          </div>

          
<BrandForm isOpen={showAddModal} toggle={toggleAddModal} refetch={brandRefetch} />

                  <Table
                    responsive
                    className="table table-bordered table-centered mb-0"
                  >
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
                      {brandData
                        .filter((brand) =>
                          brand.brandName
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                        )
                        .map((brand, index) => (
                          <tr key={brand._id}>
                            <td>{index + 1}</td>
                            <td>{brand.brandName}</td>
                            
                            <td>
          {brand.logo && (
            <img
              src={brand.logo.fileURL}
              alt={`Logo for ${brand.brandName}`}
              style={{ width: '50px', height: '50px' }}
            />
          )}
        </td>
                            <td   style={{
                                color: brand.isBlocked ? "red" : "#5cb85c",
                              }}>{brand.isBlocked?"Blocked":"Active"}</td>
                            <td>
                              <Link to={`/brands/${brand._id}`}>
                                <Button style={{ marginLeft: "20px"  , backgroundColor: "#000000"}}>
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

export default BrandList;
