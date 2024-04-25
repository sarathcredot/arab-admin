import React, { useEffect, useState } from "react";
import { Row, Col, Card, CardBody, CardHeader, Button, Input, Container, Nav, NavItem, NavLink } from "reactstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { Link, useSearchParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import StatusIndicator from "src/components/statusIndicator/StatusIndicator";
import Loader from "src/components/Common/Loader";


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

const VendorProducts = () => {

  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(0);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [maxRecords, setMaxRecords] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [searchParams] = useSearchParams();
  const vendorId = searchParams.get("id")

  const [activeTab, setActiveTab] = useState<string>("ALL");

  const toggleTab = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(0)
  };

  const { data, refetch } = useQuery(GET_PRODUCTS, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        page: currentPage,
        size: pageSize,
        query: searchTerm,
        status: "",
        vendorId: vendorId
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
            status: "",
            vendorId: vendorId

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



    <Card style={{ marginTop: "30px" }}>
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
            {
              loading ?
                <Loader />
                :

                <Table
                  id="tech-companies-1"
                  className="table table-striped table-bordered"
                >
                  <Thead>
                    <Tr>
                      <Th data-priority="1">Sl.No</Th>
                      <Th data-priority="1">Name</Th>
                      <Th>Product Code</Th>
                      <Th data-priority="3">Short Description</Th>
                      <Th data-priority="3">Category</Th>
                      <Th data-priority="1">Image</Th>
                      {/* <Th data-priority="3"> Verify Status</Th> */}
                      <Th data-priority="3">Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {products?.map((product: Product, index: number) => (
                      <Tr key={index}>
                        <Td>{currentPage * pageSize + index + 1}</Td>
                        <Td><p style={{ maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{product?.productName}</p></Td>
                        <Td>{product?.productCode}</Td>
                        <Td ><p style={{ maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{product?.shortDescription}</p></Td>
                        <Td>{product?.categoryNamePath}</Td>
                        <Td>
                          <img
                            src={product?.images[0]?.fileURL}
                            alt={product?.productName}
                            width={80}
                          />
                        </Td>
                        {/* <Td>
                                <StatusIndicator status={product?.status} />

                              </Td> */}

                        <Td>
                          <Button
                            color="primary"
                            size="sm"
                            tag={Link}
                            to={{
                              pathname: "/product/variant",
                              search: `?productCode=${product?.productCode}&origin=vendor&vendorId=${vendorId}`,
                            }}
                          >
                            View
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
            }
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
      </CardBody>
    </Card>
  );
};

export default VendorProducts;
