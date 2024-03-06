import React, { useEffect, useState } from "react";
import { Row, Col, Card, CardBody, CardHeader, Button, Input, Container, Nav, NavItem, NavLink } from "reactstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Link } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import Breadcrumb from "../../components/Common/Breadcrumb";


const GET_PRODUCTS = gql`
 query GetProductsByAdmin($input: ProductFilters) {
  getProductsByAdmin(input: $input) {
    maxRecords
    records {
      _id
      vendorId
      brandId
      brandName
      productName
      shortDescription
      skuId
      description
      productInfo
      productShortInfo
      material
      images {
        fileType
        fileURL
        mimeType
        originalName
      }
      rating
      sellingPrice
      price
      mrp
      tags
      productCode
      categoryId
      categoryNamePath
      categoryIdPath
      isBlocked
      stock
      status
      offerPrice
      attributes {
        attributeId
        attributeName
        attributeValueId
        attributeValue
        attributeDescription
      }
      productDetailImages {
        fileType
        fileURL
        mimeType
        originalName
      }
    }
  }
}
`;




interface Product {
  _id: string;
  productName: string;
  productCode: string;
  shortDescription: string;
  categoryNamePath: string;
  images: {
    fileURL: string;
  }[];
  isBlocked: boolean;
  status: string;
}

const ProductListing = () => {

  const pageSize = 10; // Number of items per page
  const [currentPage, setCurrentPage] = useState(0);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [maxRecords, setMaxRecords] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<string>("UNDER_VERIFICATION");

  const toggleTab = (tab: string) => {
    setActiveTab(tab);
  };

  const { data, refetch } = useQuery(GET_PRODUCTS, {
    variables: {
      input: {
        page: currentPage,
        size: pageSize,
        query: searchTerm,
      },
    },
  });





  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await refetch({
          input: {
            page: currentPage,
            size: pageSize,
            query: searchTerm,
            status: activeTab,
          },
        });
        setProducts(result.data.getProductsByAdmin.records);
        setMaxRecords(result.data.getProductsByAdmin.maxRecords);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchTerm, currentPage, refetch, activeTab]);


  const totalPages = Math.ceil(maxRecords / pageSize);

  const handleNextPage = () => {
    if (currentPage + 1 <= totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSearch = (event: any) => {
    setSearchTerm(event.target.value);
  };

  const items = [
    { text: "Dashboard", link: `/` },
  ];
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb items={items} currentPage="Products" />

          <Nav tabs>
            <NavItem>
              <NavLink
                className={activeTab === "UNDER_VERIFICATION" ? "tab-button active" : "tab-button"}
                onClick={() => toggleTab("UNDER_VERIFICATION")}
              >
                Pending
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === "APPROVED" ? "tab-button active" : "tab-button"}
                onClick={() => toggleTab("APPROVED")}
              >
                Approved
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


          <Card>
            <CardHeader>
              <Col xs={6} >
                <Input
                  type="text"
                  placeholder="Search Product"
                  value={searchTerm}
                  onChange={handleSearch}
                  style={{ width: "70%" }}
                />
              </Col>
            </CardHeader>

            <CardBody>
              <div className="table-rep-plugin">
                <div
                  className="table-responsive mb-0"
                  data-pattern="priority-columns"
                >
                  <Table
                    id="tech-companies-1"
                    className="table table-striped table-bordered"
                  >
                    <Thead>
                      <Tr>
                        <Th data-priority="1">Sl.No</Th>
                        <Th data-priority="1">Name</Th>
                        <Th>ProductCode</Th>
                        <Th data-priority="3">Short Description</Th>
                        <Th data-priority="3">Category</Th>
                        <Th data-priority="1">Image</Th>
                        <Th data-priority="3"> Verify Status</Th>
                        <Th data-priority="3">Status</Th>
                        <Th data-priority="3">View</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {products?.map((product: Product, index: number) => (
                        <Tr key={index}>
                          <Td>{currentPage * pageSize + index + 1}</Td>
                          <Td>{product?.productName}</Td>
                          <Td>{product?.productCode}</Td>
                          <Td>{product?.shortDescription}</Td>
                          <Td>{product?.categoryNamePath}</Td>
                          <Td>
                            <img
                              src={product?.images[0]?.fileURL}
                              alt={product?.productName}
                              width={80}
                              height={80}
                            />
                          </Td>
                          <Td>
                            {product?.status}
                          </Td>
                          <Td>
                            {product?.isBlocked ? "Blocked" : "Active"}
                          </Td>
                          <Td>
                            <Button
                              color="primary"
                              size="sm"
                              tag={Link}
                              to={{
                                pathname: "/product/variant/",
                                search: `?_id=${product?._id}`,
                              }}
                            >
                              View
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </div>
              </div>
              <Row>
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
                            {index}
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
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ProductListing;
