import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useSearchParams } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Collapse,
  Container,
  Input,
  Nav,
  NavItem,
  NavLink,
  Row,
  Table,
} from "reactstrap";
import CustomButton from "src/components/Common/CustomButton";
import DynamicFilter from "src/components/filter/DynamicFilter";
import FormVender from "../venders/FormVender";
import Loader from "src/components/Common/Loader";
import { MdEdit } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import StatusIndicator from "src/components/statusIndicator/StatusIndicator";
import { Link } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
// import AddAgentForm from "./AddFormDeliveryBoy";
import Breadcrumb from "src/components/Common/Breadcrumb";
import AddCoupon from "./Popups/AddCoupon";
import AddCouponPopup from "./Popups/AddCouponPopup";
import EditCouponPopup from "./Popups/EditCouponPopup";
import SuspendCoupon from "./Popups/SuspendCoupon";
import DeleteCoupon from "./Popups/DeleteCoupon";
// import "./style.css"

// coupon type
interface ICoupon {
  _id: string;
  name: string;
  code: string;
  description: string;
  discountType: string;
  discountValue: number;
  max_discount: number;
  minOrderAmount: number;
  validBrands: any; // array
  validCategories: any; // array
  validProducts: any; // array
  validUsers: any; // array
  usageLimit: number;
  usagePerUserLimit: number;
  orderCount: number;
  startDate: string;
  expiryDate: string;
  isActive: boolean;
}

const GET_ALL_COUPONS = gql`
  query Records($input: getAllCoupenToAdminInput!) {
    getAllCoupenToAdmin(input: $input) {
      records {
        _id
        name
        code
        description
        orderCount
        discountType
        couponApplicableType
        discountValue
        max_discount
        minOrderAmount
        validCategories {
          category
        }
        validProducts {
          product
        }
        validUsers {
          user
        }
        validBrands {
          brand
        }
        usageLimit
        usagePerUserLimit
        startDate
        expiryDate
        isActive
      }
      maxRecords
    }
  }
`;

const Coupons: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  const [couponID, setCouponID] = useState("");
  const [couponActive, setCouponActive] = useState<boolean>();
  const [coupons, setCoupons] = useState<ICoupon[]>([]);
  const [activeTab, setActiveTab] = useState<boolean>();
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showSuspendModal, setShowSuspendModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const [filters, setFilters] = useState({
    startDate: "",
    expiryDate: "",
    isActive: "",
  });

  console.log("couponID = ", couponID);

  const toggleAddModal = () => {
    setShowAddModal(!showAddModal);
  };
  const toggleEditModal = () => {
    setShowEditModal(!showEditModal);
  };
  const toggleSuspendModal = () => {
    setShowSuspendModal(!showSuspendModal);
  };
  const toggleDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  const handleFilterSubmit = (formData: any) => {
    setCurrentPage(0);
    setFilters({
      startDate: formData.startDate,
      expiryDate: formData.expiryDate,
      isActive: formData.isActive,
    });
  };

  // get coupons query
  const {
    loading: couponLoading,
    error: couponError,
    data: couponDataResponse,
    refetch: couponRefetch,
  } = useQuery(GET_ALL_COUPONS, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        page: currentPage,
        size: pageSize,
        isActive: filters?.isActive ? (filters?.isActive == "true" ? "true" : "false") : null,
        startDate: filters?.startDate || null,
        expiryDate: filters?.expiryDate || null,
        search:searchTerm
      },
    },
  });
  console.log("is active = ", String(filters?.isActive));
  useEffect(() => {
    if (couponDataResponse?.getAllCoupenToAdmin?.records) {
      console.log("COUPONS = ", couponDataResponse);
      setCoupons(couponDataResponse?.getAllCoupenToAdmin?.records);
    }
  }, [couponDataResponse, couponRefetch]);

  const items = [{ text: "Dashboard", link: `/` }];

  const totalRecords = couponDataResponse?.getAllCoupenToAdmin?.maxRecords || 0;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const filterOptions = [
    {
      label: "Status",
      type: "select",
      name: "isActive",
      options: [
        { value: "true", label: "Active" },
        { value: "false", label: "Suspended" },
      ],
    },
    {
      label: "Start date",
      type: "date",
      name: "startDate",
    },
    {
      label: "Expiry date",
      type: "date",
      name: "expiryDate",
    },
  ];

  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            items={items}
            currentPage="Coupons"
          />
          {/* <Nav tabs>
            <NavItem>
              <NavLink
                className={activeTab === undefined ? "tab-button active" : "tab-button"}
                onClick={() => setActiveTab(undefined)}
              >
                All
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === false ? "tab-button active" : "tab-button"}
                onClick={() => setActiveTab(false)}
              >
                All
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === true ? "tab-button active" : "tab-button"}
                onClick={() => setActiveTab(true)}
              >
                All
              </NavLink>
            </NavItem>
          </Nav> */}
          <Row style={{ marginTop: "20px" }}>
            <Col lg={12}>
              <Card>
                <CardHeader style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                  <CustomButton
                    onClick={() => toggleAddModal()}
                    name="Add Coupon"
                    icon="material-symbols:add"
                  />
                </CardHeader>
                <CardHeader>
                  <Row>
                    <Col
                      xs={9}
                      style={{ display: "flex", alignItems: "center", gap: "20px" }}
                    >
                      <Input
                        type="text"
                        placeholder="Search by coupon code"
                        value={searchTerm}
                        onChange={(e) => {
                          setCurrentPage(0);
                          setSearchTerm(e.target.value.toUpperCase());
                        }}
                        style={{ width: "50%" }}
                      />
                    </Col>
                    <Col
                      xs={3}
                      style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}
                    >
                      <CustomButton
                        onClick={toggleCollapse}
                        name="Filters"
                        icon="clarity:filter-solid"
                      />
                    </Col>
                  </Row>
                </CardHeader>

                <CardBody>
                  <Collapse isOpen={isOpen}>
                    <DynamicFilter
                      toggle={toggleCollapse}
                      filterOptions={filterOptions}
                      onSubmit={handleFilterSubmit}
                    />
                  </Collapse>

                  <Row>
                    {couponLoading ? (
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
                                <th>Name</th>
                                <th>Code</th>
                                {/* <th>Description</th> */}
                                <th>Discount Amount</th>
                                <th>Validity Period</th>
                                <th>Usage Limit</th>
                                <th style={{ width: "100px", textAlign: "center" }}>Status</th>
                                <th style={{ width: "100px", textAlign: "center" }}>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {coupons?.map((item, index) => (
                                <tr key={item?._id}>
                                  <td className="text-center">{currentPage * pageSize + (index + 1)}</td>
                                  <td>{item?.name}</td>
                                  <td>{item?.code}</td>
                                  {/* <td>
                                    {item?.description&&item?.description.length > 10
                                      ? ` ${item?.description.slice(0, 10)}...`
                                      : item?.description}
                                  </td> */}
                                  <td>
                                    {item?.discountValue && item?.discountValue !== 0 ? item?.discountValue : ""}{" "}
                                    {item?.discountValue ? (item?.discountType === "FLAT" ? "OMR" : "%") : ""}
                                  </td>
                                  <td>
                                    {new Date(item?.startDate).toLocaleDateString("en-GB").replace(/\//g, "-")} -{" "}
                                    {new Date(item?.expiryDate).toLocaleDateString("en-GB").replace(/\//g, "-")}
                                  </td>
                                  <td>{item?.usageLimit}</td>
                                  <td>
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => {
                                        setCouponID(item?._id);
                                        setCouponActive(!item?.isActive);
                                        setShowSuspendModal(true);
                                      }}
                                    >
                                      <StatusIndicator
                                        variant="default"
                                        status={item.isActive === true ? "Active" : "Suspended"}
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
                                      {/* <Button
                                        style={{
                                          display: "block",
                                          // width:"100%"
                                        }}
                                        color="dark"
                                        size="sm"
                                        onClick={() => {
                                          setCouponID(item?._id);
                                          setShowEditModal(true);
                                        }}
                                      >
                                        <MdEdit
                                          style={{
                                            fontSize: "12px",
                                          }}
                                        />
                                      </Button> */}
                                      <Button
                                        style={{
                                          display: "block",
                                          // width:"100%"
                                        }}
                                        color="primary"
                                        size="sm"
                                        onClick={() => {
                                          setCouponID(item?._id);
                                          setShowDeleteModal(true);
                                        }}
                                      >
                                        <MdDeleteOutline style={{ fontSize: "14px" }} />
                                      </Button>
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

                {/* pagination does not added */}

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
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <AddCouponPopup
        isOpen={showAddModal}
        toggle={toggleAddModal}
        refetch={couponRefetch}
      />
      <EditCouponPopup
        isOpen={showEditModal}
        toggle={toggleEditModal}
        couponID={couponID}
        setCouponID={setCouponID}
        refetch={couponRefetch}
      />
      <SuspendCoupon
        isOpen={showSuspendModal}
        toggle={toggleSuspendModal}
        refetch={couponRefetch}
        isActive={couponActive}
        setCouponID={setCouponID}
        couponID={couponID}
      />
      <DeleteCoupon
        isOpen={showDeleteModal}
        toggle={toggleDeleteModal}
        refetch={couponRefetch}
        setCouponID={setCouponID}
        couponID={couponID}
      />
    </>
  );
};

export default Coupons;
