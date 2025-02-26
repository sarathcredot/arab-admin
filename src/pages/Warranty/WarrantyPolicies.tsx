import React, { useEffect, useState } from "react";
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import { useSearchParams } from "react-router-dom";
import { Button, Card, CardBody, CardHeader, Col, Container, FormGroup, Input, Label, Row, Table } from "reactstrap";
import Breadcrumb from "src/components/Common/Breadcrumb";
import CustomButton from "src/components/Common/CustomButton";
import Loader from "src/components/Common/Loader";
// import AddRole from "./Popups/AddRole";
import { gql, useMutation, useQuery } from "@apollo/client";
import { toast, ToastContainer } from "react-toastify";
// import AddPolicy from "./Popups/AddPolicy";
import Confirmation from "src/components/Confirmation";
import AddWarrantyPolicy from "./Popups/AddWarrantyPolicy";
import EditWarrantyPolicy from "./Popups/EditWarrantyPolicy";
// import EditPolicy from "./Popups/EditPolicy";
const items = [
  { text: "Dashboard", link: `/` },
  { text: "Warranty", link: null },
];

const GET_ALL_POLICIES = gql`
  query GetAllWarrantyPoliciesBySuperAdmin($input: getAllWarrantyPoliciesBySuperAdminInput) {
    getAllWarrantyPoliciesBySuperAdmin(input: $input) {
      success
      data {
        _id
        name
        description
        duration
        isEnable
        isDeleted
        warrantyType
      }
      maxRecords
    }
  }
`;

const GET_SHIPPING_SETTINGS = gql`
  query GetShippingSettings {
    getShippingSettings {
      defaultReturnPolicy
    }
  }
`;
const CHANGE_STATUS = gql`
  mutation UpdateStatusWarrantyPolicyByAdmin($input: updateStatusWarrantyPolicyByAdminInput!) {
    updateStatusWarrantyPolicyByAdmin(input: $input) {
      success
      message
    }
  }
`;
const DELETE_POLICY = gql`
  mutation DeleteWarrantyPolicyByAdmin($input: deleteWarrantyPolicyByAdminInput!) {
    deleteWarrantyPolicyByAdmin(input: $input) {
      success
      message
    }
  }
`;

const WarrantyPolicies = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  const [policyID, setPolicyID] = useState("");
  const [policies, setPolicies] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  console.log({ policyID });
  const addModalToggle = () => {
    setShowAddModal(!showAddModal);
  };
  const editModalToggle = () => {
    setShowEditModal(!showEditModal);
  };
  const deleteToggle = () => {
    setOpenDelete(!openDelete);
  };

  // get roles query
  const {
    loading: policiesLoading,
    error: policiesError,
    data: policiesDataResponse,
    refetch: policiesRefetch,
  } = useQuery(GET_ALL_POLICIES, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        page: currentPage,
        size: pageSize,
        search: searchTerm,
      },
    },
  });

  const {
    data: shippingData,
    loading: shippingLoading,
    refetch: shippingRefetch,
  } = useQuery(GET_SHIPPING_SETTINGS, {
    fetchPolicy: "network-only",
  });
  console.log("DEFAULT = ", shippingData);
  const [changeStatus] = useMutation(CHANGE_STATUS);

  const handleStatusChange = async (id: string, status: any) => {
    try {
      const response = await changeStatus({
        variables: {
          input: {
            warrantyPolicyId: id,
            isEnable: status,
          },
        },
      });
      console.log("RESPONSE = ", response);
      if (response && response?.data?.updateStatusWarrantyPolicyByAdmin?.success) {
        toast.success(response?.data?.updateStatusWarrantyPolicyByAdmin?.message);
      } else {
        toast.error(response?.data?.updateStatusWarrantyPolicyByAdmin?.message);
      }
      policiesRefetch();
    } catch (error: any) {
      console.log("ERROR = ", error);
      toast.error(error);
    }
  };
  const [DeletePolicy] = useMutation(DELETE_POLICY);

  const handleDeletePolicy = async () => {
    try {
      const response = await DeletePolicy({
        variables: {
          input: {
            warrantyPolicyId: policyID,
          },
        },
      });
      console.log("RESPONSE = ", response);
      if (response && response?.data?.deleteWarrantyPolicyByAdmin?.success) {
        toast.success(response?.data?.deleteWarrantyPolicyByAdmin?.message);
        policiesRefetch();
      } else {
        toast.error(response?.data?.deleteWarrantyPolicyByAdmin?.message);
      }
    } catch (error: any) {
      console.log("ERROR = ", error);
      toast.error(error?.message);
    }
    setOpenDelete(false);
  };

  useEffect(() => {
    if (policiesDataResponse && policiesDataResponse.getAllWarrantyPoliciesBySuperAdmin?.data) {
      console.log("RESPONSE = ", policiesDataResponse?.getAllWarrantyPoliciesBySuperAdmin?.data);
      setPolicies(policiesDataResponse && policiesDataResponse?.getAllWarrantyPoliciesBySuperAdmin?.data);
    }
  }, [policiesDataResponse]);

  const totalRecords = policiesDataResponse?.getAllWarrantyPoliciesBySuperAdmin?.maxRecords || 0;
  const totalPages = Math.ceil(totalRecords / pageSize);
  console.log("policies = ", policiesDataResponse);
  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            items={items}
            currentPage="Warranty Policies"
          />
          <Row style={{ marginTop: "20px" }}>
            <Col lg={12}>
              <Card>
                {/* <CardHeader style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                  <CustomButton
                    // onClick={() => toggleAddModal()}
                    name="Add Coupon"
                    icon="material-symbols:add"
                  />
                </CardHeader> */}
                <CardHeader>
                  <Row>
                    <Col
                      xs={9}
                      style={{ display: "flex", alignItems: "center", gap: "20px" }}
                    >
                      <Input
                        type="text"
                        placeholder="Search by Policy Name"
                        value={searchTerm}
                        onChange={(e) => {
                          setCurrentPage(0);
                          setSearchTerm(e.target.value);
                        }}
                        style={{ width: "50%" }}
                      />
                    </Col>
                    <Col
                      xs={3}
                      style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}
                    >
                      <CustomButton
                        onClick={() => setShowAddModal(true)}
                        name="Add Policy"
                        icon="material-symbols:add"
                      />
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Row>
                    {policiesLoading ? (
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
                                <th>Policy Name</th>
                                <th>{"Duration (Months)"}</th>
                                <th>Warranty Type</th>
                                <th style={{ width: "100px", textAlign: "center" }}>Status</th>
                                <th style={{ width: "100px", textAlign: "center" }}>Action</th>
                              </tr>
                            </thead>

                            <tbody>
                              {policies &&
                                policies.map((item, index) => (
                                  <tr key={index}>
                                    <td style={{ textAlign: "center" }}>{currentPage * pageSize + (index + 1)}</td>
                                    <td>
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <p style={{ margin: 0 }}>{item?.name}</p>
                                        {/* <p style={{margin:0,fontWeight:"bold"}}>
                                          {item?._id === shippingData?.getShippingSettings?.defaultReturnPolicy
                                            ? "[default]"
                                            : ""}
                                        </p> */}
                                      </div>
                                    </td>
                                    <td>{item?.duration} Month</td>
                                    <td>{item?.warrantyType?.join(", ")}</td>
                                    <td style={{ textAlign: "center" }}>
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          cursor: "pointer",
                                        }}
                                      >
                                        <FormGroup switch>
                                          <Input
                                            className={
                                              item?.isEnable ? "bg-success border-success" : "bg-danger border-danger"
                                            }
                                            type="switch"
                                            style={{ width: "40px", height: "20px" }}
                                            checked={item?.isEnable}
                                            onChange={(e) => handleStatusChange(item?._id, e.target.checked)}
                                          />
                                        </FormGroup>
                                      </div>
                                    </td>
                                    <td style={{ width: "100px" }}>
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          gap: 10,
                                        }}
                                      >
                                        <Button
                                          style={{
                                            display: "block",
                                            // width:"100%"
                                          }}
                                          color="dark"
                                          size="sm"
                                          onClick={() => {
                                            setPolicyID(item?._id);
                                            setShowEditModal(true);
                                          }}
                                        >
                                          <MdEdit
                                            style={{
                                              fontSize: "12px",
                                            }}
                                          />
                                        </Button>
                                        <Button
                                          style={{
                                            display: "block",
                                            // width:"100%"
                                          }}
                                          color="primary"
                                          size="sm"
                                          onClick={() => {
                                            setPolicyID(item?._id);
                                            setOpenDelete(true);
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
              </Card>
            </Col>
          </Row>
          {/* pagination */}

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
        </Container>
      </div>
      <AddWarrantyPolicy
        isOpen={showAddModal}
        toggle={addModalToggle}
        refetch={policiesRefetch}
      />
      <EditWarrantyPolicy
        warrantyID={policyID}
        isOpen={showEditModal}
        toggle={editModalToggle}
        refetch={policiesRefetch}
      />
      <Confirmation
        isOpen={openDelete}
        toggle={deleteToggle}
        submit={handleDeletePolicy}
        text={`Are you sure you want to delete this Warranty?`}
      />

      <ToastContainer />
    </>
  );
};

export default WarrantyPolicies;
