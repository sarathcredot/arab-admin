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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  CardHeader,
} from "reactstrap";
import Breadcrumb from "src/components/Common/Breadcrumb";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import CustomButton from "src/components/Common/CustomButton";
import StatusIndicator from "src/components/statusIndicator/StatusIndicator";

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
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;
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
    fetchPolicy: "network-only",
    variables: {
      input: {
        "paginationEnabled": false
      },
    },
  });

  const {
    loading: assignBrandLoading,
    error: assignBrandError,
    data: assignBrandDataResponse,
    refetch: assignBrandRefetch,
  } = useQuery(GET_ASSIGN_BRAND, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        page: currentPage,
        size: pageSize,
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

  const totalPages = Math.ceil(assignBrandData.length / pageSize);


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
        toggle();
      } catch (error: any) {
        console.error("Error assigning brands:", error.message);
      }
    } else {
      console.error("Please select at least one brand to assign");
    }
  };


  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);


  return (
    <>

      <Card style={{
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        marginTop: "20px",
      }}>
        <CardHeader>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Input
              type="text"
              placeholder="Search by brand name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "450px", }}
            />

            <CustomButton onClick={toggle} name="Assign Brands" icon="fluent:tab-add-20-filled" />
          </div>
        </CardHeader>
        <CardBody>




          <div className="table-rep-plugin">

            <div className="table-responsive mb-0" data-pattern="priority-columns">


              <Table id="tech-companies-1" className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th>Sl.No</th>
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
                          <Link to={`/brands/${brand._id}?origin=vendor&vendorId=${id}`}>
                            <Button color="primary" size="sm">
                              View
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>
          </div>
        </CardBody>

        <Modal isOpen={modal} toggle={toggle} >
          <ModalHeader toggle={toggle}>Assign Categories</ModalHeader>
          <ModalBody>
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
                }),
              }}
            />

          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handleAssignBrands}>
              Submit
            </Button>{' '}
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>



        <Row>
          <Col>
            <div className="d-flex justify-content-end mt-0 me-3">

              <ul className="pagination">
                {
                  currentPage !== 0 &&
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
                }

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
