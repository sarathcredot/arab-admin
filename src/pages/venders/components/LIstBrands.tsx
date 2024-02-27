import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
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
  Label,
} from "reactstrap";
import Breadcrumb from "src/components/Common/Breadcrumb";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";

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
  const [assignBrandData, setAssignBrandData] = useState<IBrandRecord[]>([]);
  const [activeTab, setActiveTab] = useState<boolean>();
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10; // Number of items per page
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedBrands, setSelectedBrands] = useState<
    Array<{ label: string; value: string }>
  >([]);

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

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


  const GET_ASSIGN_BRAND = gql`
  query GetAllBrandRecordsWithVendorByAdmin($input: getAllBrandRecordsWithVendorByAdminInput!) {
  getAllBrandRecordsWithVendorByAdmin(input: $input) {
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
}`


  const PUT_VENDOR = gql`
mutation UpdateVendorProfileByAdmin($input: VendorEditProfileByAdminInput!) {
  updateVendorProfileByAdmin(input: $input) {
    _id
    message
  }
}`


  const [UpdateVendorProfileByAdmin] = useMutation(PUT_VENDOR)

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

  const {
    loading: assignBrandLoading,
    error: assignBrandError,
    data: assignBrandDataResponse,
    refetch: assignBrandRefetch,
  } = useQuery(GET_ASSIGN_BRAND, {
    variables: {
      input: {
        page: currentPage,
        size: 10,
        vendorId: id,
      },
    },
  });


  useEffect(() => {
    if (brandDataResponse && brandDataResponse.getAllBrandRecordsByAdmin) {
      setBrandData(brandDataResponse.getAllBrandRecordsByAdmin.records);
    }
    if (assignBrandDataResponse && assignBrandDataResponse.getAllBrandRecordsWithVendorByAdmin) {
      setAssignBrandData(assignBrandDataResponse.getAllBrandRecordsWithVendorByAdmin.records);
    }
  }, [brandDataResponse, brandRefetch, assignBrandDataResponse, id]);

  if (brandError) {
    console.error("Error fetching vendor data:", brandError);
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

  const handleBrandSelection = (
    selectedOptions: Array<{ label: string; value: string }>
  ) => {
    setSelectedBrands(selectedOptions);
  };

  const handleAssignBrands = async () => {
    if (selectedBrands.length > 0) {
      const brandIds = selectedBrands.map((brand) => brand.value);
      try {
        const response: any = await UpdateVendorProfileByAdmin({
          variables: {
            input: {
              _id: id,
              brands: brandIds,
            },
          },
        });

        toast.success(response?.message)
        setSelectedBrands([])
        assignBrandRefetch();
      } catch (error: any) {
        console.error("Error assigning brands:", error.message);
      }
    } else {
      console.error("Please select at least one brand to assign");
    }
  };


  return (
    <>

      <Card style={{
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        marginTop: "20px",
      }}>
        <CardBody>
          {/* <Input
                    type="text"
                    placeholder="Search by name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: "50%", marginBottom: "20px" }}
                  /> */}

          <div className="d-flex justify-content-end mb-3">
            <Label className="mt-2 " style={{ marginRight: "20px" }}>
              Assign Brands:
            </Label>
            <Select
              isMulti
              options={brandData.map((brand) => ({
                label: brand.brandName,
                value: brand._id,
              }))}
              value={selectedBrands}
              onChange={(selectedOptions: any) =>
                handleBrandSelection(selectedOptions)
              }
              placeholder="Select Brands..."
              styles={{
                control: (styles: any) => ({
                  ...styles,
                  width: "300px",
                  marginRight: "10px",
                  // width: "200px",
                }),
              }}
            />
            <Button onClick={() => handleAssignBrands()} style={{ backgroundColor: "#000000" }}>
              Assign Brands
            </Button>
          </div>

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
              {assignBrandData
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
                          style={{ width: "50px", height: "50px" }}
                        />
                      )}
                    </td>
                    <td
                      style={{
                        color: brand.isBlocked ? "red" : "#5cb85c",
                      }}
                    >
                      {brand.isBlocked ? "Blocked" : "Active"}
                    </td>
                    <td>
                      <Link to={`/brands/${brand._id}`}>
                        <Button style={{ marginLeft: "20px" }}>
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
    </>
  );
};

export default BrandList;
