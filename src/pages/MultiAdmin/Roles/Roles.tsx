import React, { useEffect, useState } from "react";
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import { useSearchParams } from "react-router-dom";
import { Button, Card, CardBody, CardHeader, Col, Container, FormGroup, Input, Label, Row, Table } from "reactstrap";
import Breadcrumb from "src/components/Common/Breadcrumb";
import CustomButton from "src/components/Common/CustomButton";
import Loader from "src/components/Common/Loader";
import Confirmation from "src/components/Confirmation";
import StatusIndicator from "src/components/statusIndicator/StatusIndicator";
import AddRole from "./Popups/AddRole";
import { gql, useMutation, useQuery } from "@apollo/client";
import { toast } from "react-toastify";
import EditRole from "./Popups/EditRole";
const items = [{ text: "Dashboard", link: `/` }];

const GET_ROLES = gql`
  query GetAllRolesBySuperAdmin($input: getAllRolesBySuperAdminInput) {
    getAllRolesBySuperAdmin(input: $input) {
      success
      data {
        _id
        name
        description
        permissions
        isEnable
      }
      maxRecords
    }
  }
`;

const CHANGE_STATUS = gql`
  mutation UpdateStatusRoleBySuperAdmin($input: updateStatusRoleBySuperAdminInput!) {
    updateStatusRoleBySuperAdmin(input: $input) {
      success
      message
    }
  }
`;
const DELETE_ROLES = gql`
  mutation DeleteRoleBySuperAdmin($input: deleteRoleBySuperAdminInput!) {
    deleteRoleBySuperAdmin(input: $input) {
      success
      message
    }
  }
`;

const Roles = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  const [roleID, setRoleID] = useState("");
  const [roles, setRoles] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);

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
    loading: rolesLoading,
    error: rolesError,
    data: rolesDataResponse,
    refetch: rolesRefetch,
  } = useQuery(GET_ROLES, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        page: currentPage,
        size: pageSize,
        // isEnable: true,
        search: searchTerm,
      },
    },
  });

  const [changeStatus] = useMutation(CHANGE_STATUS);

  const handleStatusChange = async (id: string, status: any) => {
    try {
      const response = await changeStatus({
        variables: {
          input: {
            isEnable: status,
            roleId: id,
          },
        },
      });
      console.log("RESPONSE = ", response);
      if (response && response?.data?.updateStatusRoleBySuperAdmin?.success) {
        toast.success(response?.data?.updateStatusRoleBySuperAdmin?.message);
        setRoleID("");
      } else {
        toast.error(response?.data?.updateStatusRoleBySuperAdmin?.message);
      }
      rolesRefetch();
    } catch (error: any) {
      console.log("ERROR = ", error);
      toast.error(error);
    }
  };
  const [DeleteRole] = useMutation(DELETE_ROLES);

  const handleDeleteRole = async () => {
    try {
      const response = await DeleteRole({
        variables: {
          input: {
            roleId: roleID,
          },
        },
      });
      console.log("RESPONSE = ", response);
      if (response && response?.data?.deleteRoleBySuperAdmin?.success) {
        toast.success(response?.data?.deleteRoleBySuperAdmin?.message);
        setOpenDelete(false);
        rolesRefetch();
        setRoleID("");
      } else {
        toast.error(response?.data?.deleteRoleBySuperAdmin?.message);
      }
    } catch (error: any) {
      console.log("ERROR = ", error);
      toast.error(error);
    }
  };

  useEffect(() => {
    if (rolesDataResponse && rolesDataResponse.getAllRolesBySuperAdmin?.data) {
      console.log("RESPONSE = ", rolesDataResponse.getAllRolesBySuperAdmin?.data);
      setRoles(rolesDataResponse && rolesDataResponse.getAllRolesBySuperAdmin?.data);
    }
  }, [rolesDataResponse]);

  const totalRecords = rolesDataResponse?.getAllRolesBySuperAdmin?.maxRecords || 0;
  const totalPages = Math.ceil(totalRecords / pageSize);
  console.log("ROLES = ", rolesDataResponse);


  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            items={items}
            currentPage="Roles"
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
                        placeholder="Search by Role Name"
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
                        name="Add Role"
                        icon="material-symbols:add"
                      />
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Row>
                    {rolesLoading ? (
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
                                <th>Role Name</th>
                                <th>Description</th>
                                <th>Assigned Access</th>
                                <th style={{ width: "100px", textAlign: "center" }}>Status</th>
                                <th style={{ width: "100px", textAlign: "center" }}>Action</th>
                              </tr>
                            </thead>

                            <tbody>
                              {roles &&
                                roles.map((item, index) => (
                                  <>
                                    <tr key={index}>
                                    <td style={{ textAlign: "center" }}>{currentPage * pageSize + (index + 1)}</td>
                                      <td>{item?.name}</td>
                                      <td>{item?.description}</td>
                                      <td>
                                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                          {item?.permissions?.map((value: any, index: any) => {
                                            return (
                                              <p
                                                className="m-0 shadow-success rounded-1"
                                                style={{ padding: 5, cursor: "default" }}
                                                key={index}
                                              >
                                                {value === "cmslisting"
                                                  ? "CMS"
                                                  : value === "kyc"
                                                  ? "KYC"
                                                  : value === "product"
                                                  ? "products"
                                                  : value === "settlement"
                                                  ? "settlements"
                                                  : value.replace(/-/g, " ")}
                                              </p>
                                            );
                                          })}
                                        </div>
                                      </td>
                                      {/* <td>assigned access </td> */}
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
                                              setRoleID(item?._id);
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
                                              setRoleID(item?._id);
                                              setOpenDelete(true);
                                            }}
                                          >
                                            <MdDeleteOutline style={{ fontSize: "14px" }} />
                                          </Button>
                                        </div>
                                      </td>
                                    </tr>
                                  </>
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
          {/* </Row> */}
        </Container>
      </div>

      <Confirmation
        isOpen={openDelete}
        toggle={deleteToggle}
        submit={handleDeleteRole}
        text={`Are you sure you want to Delete this Role?`}
      />
      <AddRole
        isOpen={showAddModal}
        toggle={addModalToggle}
        refetch={rolesRefetch}
      />
      <EditRole
        roleId={roleID}
        setRoleId={setRoleID}
        isOpen={showEditModal}
        toggle={editModalToggle}
        refetch={rolesRefetch}
      />
    </>
  );
};

export default Roles;
