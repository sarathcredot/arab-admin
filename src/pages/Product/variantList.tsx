import React, { useEffect, useState } from "react";
import { Row, Col, Card, CardBody, CardHeader, Button, Input } from "reactstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Link, useSearchParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";

const GET_VARIANTS = gql`
query GetVariantsTableByAdmin($input: ProductVariantsByAdminFilter!) {
  getVariantsTableByAdmin(input: $input) {
    maxRecords
    message
    records {
      _id
      productName
      images {
        fileType
        fileURL
        mimeType
        originalName
      }
      attributes {
        attributeId
        attributeName
        attributeValueId
        attributeValue
        attributeDescription
      }
      stock
      status
      isBlocked
    }
  }
}

`;

interface Product {
    _id: string;
    productName: string;
    images: {
      fileType: string;
      fileURL: string;
      mimeType: string;
      originalName: string;
    }[];
    attributes: {
      attributeId: string;
      attributeName: string;
      attributeValueId: string;
      attributeValue: string;
      attributeDescription: string;
    }[];
    stock: number; // Assuming stock is a number, adjust the type if needed
    status: string; // Assuming status is a string, adjust the type if needed
    isBlocked: boolean;
  
}

const VariantListing = () => {
  document.title =
    "Responsive Table | Arab Deals ";

  const pageSize = 10; // Number of items per page
  const [currentPage, setCurrentPage] = useState(0);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [maxRecords, setMaxRecords] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [params] = useSearchParams();
  const _id = params.get("_id");

  const { data,refetch } = useQuery(GET_VARIANTS, {
    variables: {
      input: {
        page: currentPage,
        size: pageSize,
       _id:_id

        // parentCategory: searchTerm,
        // categories:[searchTerm],
        // color: [searchTerm],
        // productSize:[searchTerm]
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
            // query: searchTerm,
            _id:_id,
          },
        });
        setProducts(result.data.getVariantsTableByAdmin.records);
        setMaxRecords(result.data.getVariantsTableByAdmin.maxRecords);
      } catch (error:any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [searchTerm, currentPage, refetch]);
  

  const totalPages = Math.ceil(maxRecords / pageSize);

  const handleNextPage = () => {
    if (currentPage + 1 <= totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSearch = (event: any) => {
    setSearchTerm(event.target.value);
    console.log(event.target.value);
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Dashboard" breadcrumbItem="Product" link="/dashboard" />
          {/* <Row>
            <Col lg={12}>
             
                <div className="d-flex justify-content-end mb-3">
                <Link to="/add-product">
                  <button
                    style={{
                      backgroundColor: "black",
                      color: "white",
                      width: "100px",
                      height: "40px",
                      borderRadius: "10px",
                    }}
                  >
                    Add Product
                  </button>
                  </Link>
                </div>
             
            </Col>
          </Row> */}

          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <h4 className="card-title">Variants</h4>


                  {/* <Col xs={5} style={{marginTop:"20px"}}>
                      <Input
                        type="text"
                        placeholder="Search Product"
                        value={searchTerm}
                        onChange={handleSearch}
                        style={{ width: "50%" }}
                      />
                    </Col> */}
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
                            <Th data-priority="1">Name</Th>
                            <Th data-priority="3">Attributes</Th>
                            <Th data-priority="3">Stock</Th>
                            <Th data-priority="1">Image</Th>
                            <Th data-priority="3">Verify Status</Th>
                            <Th data-priority="3">Status</Th>
                            <Th data-priority="3">View</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {products.map((product: Product, index: number) => (
                            <Tr key={index}>
                              <Td>{product.productName}</Td>
                              <Td>{product.attributes[0].attributeDescription}: {product.attributes[0].attributeValue}</Td>
                              
                              <Td>{product.stock}</Td>
                    
                              <Td>
                                <img
                                  src={product.images[0]?.fileURL}
                                  alt={product?.productName}
                                  width={80}
                                  height={80}
                                />
                              </Td>
                              <Td>{product?.status}</Td>
                              <Td>
                                {product.isBlocked ? "Blocked" : "Active"}
                              </Td>
                              <Td>
                                <Button
                                  color="white"
                                  style={{
                                    backgroundColor: "black",
                                    alignItems: "center",
                                    color: "white",
                                  }}
                                  tag={Link}
                                  to={{
                                    pathname: "/product/details/",
                                    search: `?_id=${product._id}`,
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
                                {index}
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
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
};

export default VariantListing;
