import React, { useEffect, useState } from "react";
import { Row, Col, Card, CardBody, CardHeader, Button, Input } from "reactstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Link } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";

const GET_PRODUCTS = gql`
  query GetProductsByAdmin($input: ProductFilters) {
    getProductsByAdmin(input: $input) {
      maxRecords
      records {
        _id
        categoryId
        categoryNamePath
        color
        description
        images {
          fileType
          fileURL
          mimeType
          originalName
        }
        isBlocked
        material
        mrp
        price
        productCode
        productName
        rating
        sellingPrice
        shortDescription
        size
        skuId
        tags
        stock
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
}

const ProductListing = () => {
  document.title =
    "Responsive Table | Collin ";

  const pageSize = 10; // Number of items per page
  const [currentPage, setCurrentPage] = useState(0);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [maxRecords, setMaxRecords] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { data,refetch } = useQuery(GET_PRODUCTS, {
    variables: {
      input: {
        page: currentPage,
        size: pageSize,
        query: searchTerm,
        // parentCategory: searchTerm,
        // categories:[searchTerm],
        // color: [searchTerm],
        // productSize:[searchTerm]
      },
    },
  });

  

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error.message}</p>;

  // const products = data.getProductsByAdmin.records;
  // const maxRecords = data.getProductsByAdmin.maxRecords;

  // console.log(products)


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await refetch({
          input: {
            page: currentPage,
            size: pageSize,
            query: searchTerm,
          },
        });
        setProducts(result.data.getProductsByAdmin.records);
        setMaxRecords(result.data.getProductsByAdmin.maxRecords);
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
          <Row>
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
          </Row>

          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <h4 className="card-title">Products</h4>


                  <Col xs={5} style={{marginTop:"20px"}}>
                      <Input
                        type="text"
                        placeholder="Search Product"
                        value={searchTerm}
                        onChange={handleSearch}
                        style={{ width: "50%" }}
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
                            <Th>ProductCode</Th>
                            <Th data-priority="1">Name</Th>
                            <Th data-priority="3">Short Description</Th>
                            <Th data-priority="3">Category</Th>
                            <Th data-priority="1">Image</Th>
                            <Th data-priority="3">Status</Th>
                            <Th data-priority="3">View</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {products.map((product: Product, index: number) => (
                            <Tr key={index}>
                              <Td>{product.productCode}</Td>
                              <Td>{product.productName}</Td>
                              <Td>{product.shortDescription}</Td>
                              <Td>{product?.categoryNamePath}</Td>
                              <Td>
                                <img
                                  src={product.images[0]?.fileURL}
                                  alt={product?.productName}
                                  width={80}
                                  height={80}
                                />
                              </Td>
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

export default ProductListing;
