import React, { useEffect, useState } from "react";
import { Row, Col, Card, CardBody, CardHeader, Button, Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Label, FormGroup } from "reactstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Link, useSearchParams } from "react-router-dom";
import { gql, useMutation, useQuery } from "@apollo/client";
import { toast } from "react-toastify";
import Breadcrumb from "../../components/Common/Breadcrumb";
import StatusIndicator from "src/components/statusIndicator/StatusIndicator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

const GET_VARIANTS = gql`
query GetVariantsTableByAdmin($input: ProductVariantsByAdminFilter!) {
  getVariantsTableByAdmin(input: $input) {
    maxRecords
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
      categoryNamePath
      categoryId
      warehouseSkuId
      skuId
      productCode
    }
    message
  }
}

`;

const PUT_STATUS = gql`
mutation UpdateProductByAdmin($input: UpdateProductByAdminInput!) {
  updateProductByAdmin(input: $input) {
    _id
    message
  }
}
`;
interface Product {
  _id: string;
  productName: string;
  productCode: number;
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
  stock: number;
  status: string;
  isBlocked: boolean;

}

const VariantListing = () => {

  const pageSize = 10; // Number of items per page
  const [currentPage, setCurrentPage] = useState(0);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [maxRecords, setMaxRecords] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [cardHeaderData, setCardHeaderData] = useState({
    productCode: "",
    category: ""
  });

  const [params] = useSearchParams();
  const productCode = params.get("productCode");

  const { data, refetch } = useQuery(GET_VARIANTS, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        productCode: Number(productCode),
      },
    },
  });





  const [UpdateProductStatus] = useMutation(PUT_STATUS)



  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<{
    value: string;
    label: string;
    pass: boolean | null
  } | null>(null);

  const [statusDropdownOpen2, setStatusDropdownOpen2] = useState(false);
  const [selectedStatus2, setSelectedStatus2] = useState<{
    value: string;
    label: string;
  } | null>(null);

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [outOfStockChecked, setOutOfStockChecked] = useState<boolean>(false);

  const statusOptions = [
    { value: "all", label: "All", pass: null },
    { value: "blocked", label: "Blocked", pass: true },
    { value: "nonBlocked", label: "Active", pass: false },
  ];
  const statusOptions2 = [
    { value: "all", label: "All", },
    { value: "UNDER_VERIFICATION", label: "Pending", },
    { value: "APPROVED", label: "Approved", },
    { value: "REJECTED", label: "Rejected", },
  ];





  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await refetch({
        input: {
          productCode: Number(productCode),
        },
      });
      setProducts(result.data.getVariantsTableByAdmin.records);
      setCardHeaderData({
        category: result.data.getVariantsTableByAdmin.records[0].categoryNamePath,
        productCode: result.data.getVariantsTableByAdmin.records[0].productCode || "nill"
      }
      )
      setMaxRecords(result.data.getVariantsTableByAdmin.maxRecords);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
  }, [searchTerm, currentPage, refetch]);

  const handleStatusChange = async (status: any, e: any, proId: string) => {
    try {
      let input: any = {
        _id: proId,
        status: status,
      };
      const response = await UpdateProductStatus({ variables: { input: input } });

      console.log(response)
      toast.success(response.data.updateProductByAdmin.message)
      fetchData()

    } catch (error: any) {
      console.log(error.message);
    }
  };

  const toggleStatusDropdown = () => {
    setStatusDropdownOpen(!statusDropdownOpen);
  };

  const toggleStatusDropdown2 = () => {
    setStatusDropdownOpen2(!statusDropdownOpen2);
  };

  useEffect(() => {
    setFilteredProducts(
      products.filter(
        (item) =>
          ((selectedStatus === null || selectedStatus.value === "all" || selectedStatus.pass === null || item.isBlocked === selectedStatus.pass)) &&
          (!selectedStatus2 || selectedStatus2.value === "all" || item.status === selectedStatus2.value) &&
          (!outOfStockChecked || item.stock < 10)
      )
    );
  }, [products, selectedStatus, outOfStockChecked, selectedStatus2]);



  const handleStatusSelect = (selectedOption: any) => {
    setSelectedStatus(selectedOption);
    setStatusDropdownOpen(false);
  };
  const handleStatusSelect2 = (selectedOption: any) => {
    setSelectedStatus2(selectedOption);
    setStatusDropdownOpen2(false);
  };

  const handleOutOfStockToggle = () => {
    setOutOfStockChecked(!outOfStockChecked);
  };

  const items = [
    { text: "Dashboard", link: `/` },
    { text: "Products", link: `/product` },
  ];

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumb items={items} currentPage="Variants" />

          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <Row>
                    <Col xs={12} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
                        <h5 style={{ margin: "0" }}>Filters : </h5>
                        <Dropdown isOpen={statusDropdownOpen} toggle={toggleStatusDropdown}>
                          <DropdownToggle caret>
                            {selectedStatus ? selectedStatus.label : "Select Status"}
                            <FontAwesomeIcon icon={faAngleDown} />
                          </DropdownToggle>
                          <DropdownMenu>
                            {statusOptions.map((option) => (
                              <DropdownItem
                                key={option.value}
                                onClick={() => handleStatusSelect(option)}
                              >
                                {option.label}
                              </DropdownItem>
                            ))}
                          </DropdownMenu>
                        </Dropdown>

                        <Dropdown isOpen={statusDropdownOpen2} toggle={toggleStatusDropdown2}>
                          <DropdownToggle caret>
                            {selectedStatus2 ? selectedStatus2.label : "Verification Status"}
                            <FontAwesomeIcon icon={faAngleDown} />
                          </DropdownToggle>
                          <DropdownMenu>
                            {statusOptions2.map((option) => (
                              <DropdownItem
                                key={option.value}
                                onClick={() => handleStatusSelect2(option)}
                              >
                                {option.label}
                              </DropdownItem>
                            ))}
                          </DropdownMenu>
                        </Dropdown>

                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Label style={{ marginTop: "3px", marginLeft: "10px", width: "100px" }} check>Low Stock :</Label>
                          <FormGroup switch>
                            <Input
                              type="checkbox"
                              style={{ width: '40px', height: "20px" }}
                              checked={outOfStockChecked}
                              onChange={handleOutOfStockToggle}
                            />
                          </FormGroup>
                        </div>
                      </div>

                      <div style={{ width: "auto" }}>
                        <p style={{ margin: 0, fontWeight: 500, display: "flex", }}><p style={{ margin: 0, fontWeight: 500, width: "100px" }}>Category : </p>{cardHeaderData?.category}</p>
                        <p style={{ margin: 0, fontWeight: 500, display: "flex", }}><p style={{ margin: 0, fontWeight: 500, width: "100px" }}>Product Code : </p>{cardHeaderData?.productCode}</p>
                      </div>
                    </Col>

                  </Row>
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
                            <Th data-priority="1">Product Code</Th>
                            <Th data-priority="3">Attributes</Th>
                            <Th data-priority="3">Stock</Th>
                            <Th data-priority="1">Image</Th>
                            <Th data-priority="3">Verify Status</Th>
                            <Th data-priority="3">Status</Th>
                            <Th data-priority="3">Action</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {filteredProducts.map((product: Product, index: number) => (
                            <Tr key={index}>
                              <Td>{index + 1}</Td>
                              <Td><p style={{ maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{product?.productName}</p></Td>
                              <Td>{product.productCode}</Td>
                              <Td>{product.attributes[0]?.attributeDescription}: {product.attributes[0]?.attributeValue}</Td>

                              <Td>{product.stock}</Td>

                              <Td>
                                <img
                                  src={product.images[0]?.fileURL}
                                  alt={product?.productName}
                                  width={80}
                                  height={80}
                                />
                              </Td>
                              <Td>
                                <StatusIndicator status={product?.status} />
                              </Td>
                              <Td>
                                <StatusIndicator status={product.isBlocked ? "BLOCKED" : "ACTIVE"} />

                              </Td>
                              <Td>
                                <Button
                                  color="primary"
                                  size="sm"
                                  tag={Link}
                                  to={{
                                    pathname: "/product/details/",
                                    search: `?_id=${product._id}`,
                                  }}
                                >
                                  View
                                </Button>

                                {product?.status === "APPROVED" ? <>
                                  {null}
                                </> : <>
                                  <Button
                                    style={{ marginLeft: "10px" }}
                                    size="sm"
                                    onClick={(e) => handleStatusChange("APPROVED", e, product?._id)}
                                  >
                                    Approve
                                  </Button>
                                </>}


                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </div>
                  </div>

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
