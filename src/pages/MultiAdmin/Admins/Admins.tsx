import React, { useEffect, useState } from "react";
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import { useSearchParams } from "react-router-dom";
import { Button, Card, CardBody, CardHeader, Col, Container, FormGroup, Input, Label, Row, Table } from "reactstrap";
import Breadcrumb from "src/components/Common/Breadcrumb";
import CustomButton from "src/components/Common/CustomButton";
import Loader from "src/components/Common/Loader";
import Confirmation from "src/components/Confirmation";
import StatusIndicator from "src/components/statusIndicator/StatusIndicator";
// import AddRole from "./Popups/AddRole";
import { gql, useMutation, useQuery } from "@apollo/client";
import { toast } from "react-toastify";
import AddAdmin from "./Popups/AddAdmin";
import EditAdmin from "./Popups/EditAdmin";
const items = [{ text: "Dashboard", link: `/` }];

const GET_ADMINS = gql`
  query GetAllAdminData($input: getAllAdminDataInput) {
    getAllAdminData(input: $input) {
      maxRecords
      records {
        _id
        fullName
        email
        accType
        isBlocked
        roles {
          _id
          name
          description
          permissions
          isEnable
        }
      }
    }
  }
`;

const CHANGE_STATUS = gql`
  mutation SuspendAdmin($input: suspendAdminInput!) {
    suspendAdmin(input: $input) {
      status
      msg
    }
  }
`;
const DELETE_ADMIN = gql`
  mutation DeleteAdminAccount($input: deleteAdminAccountInput!) {
    deleteAdminAccount(input: $input) {
      status
      msg
    }
  }
`;

const Admins = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  const [adminId, setAdminID] = useState("");
  const [admins, setAdmins] = useState<any[]>([]);
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
    loading: adminsLoading,
    error: adminsError,
    data: adminsDataResponse,
    refetch: adminsRefetch,
  } = useQuery(GET_ADMINS, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        page: currentPage,
        size: pageSize,
        // isBlocked: null,
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
            id: id,
            status: !status,
          },
        },
      });
      console.log("RESPONSE = ", response);
      if (response && response?.data?.suspendAdmin?.status) {
        toast.success(response?.data?.suspendAdmin?.msg);
      } else {
        toast.error(response?.data?.suspendAdmin?.msg);
      }
      adminsRefetch();
    } catch (error: any) {
      console.log("ERROR = ", error);
      toast.error(error);
    }
  };
  const [DeleteAdmin] = useMutation(DELETE_ADMIN);

  const handleDeleteAdmin = async () => {
    try {
      const response = await DeleteAdmin({
        variables: {
          input: {
            id: adminId,
          },
        },
      });
      console.log("RESPONSE = ", response);
      if (response && response?.data?.deleteAdminAccount?.status) {
        toast.success(response?.data?.deleteAdminAccount?.msg);
        setOpenDelete(false);
        adminsRefetch();
      } else {
        toast.error(response?.data?.deleteAdminAccount?.msg);
      }
    } catch (error: any) {
      console.log("ERROR = ", error);
      toast.error(error);
    }
  };

  useEffect(() => {
    if (adminsDataResponse && adminsDataResponse.getAllAdminData?.records) {
      console.log("RESPONSE = ", adminsDataResponse?.getAllAdminData?.records);
      setAdmins(adminsDataResponse && adminsDataResponse?.getAllAdminData?.records);
    }
  }, [adminsDataResponse]);

  const totalRecords = adminsDataResponse?.getAllAdminData?.maxRecords || 0;
  const totalPages = Math.ceil(totalRecords / pageSize);
  console.log("ADMINS = ", adminsDataResponse);
  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            items={items}
            currentPage="Admins"
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
                        placeholder="Search by Admin Name"
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
                        name="Add Admin"
                        icon="material-symbols:add"
                      />
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Row>
                    {adminsLoading ? (
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
                                <th>Email</th>
                                <th>Account Type</th>
                                <th>Role</th>
                                <th style={{ width: "100px", textAlign: "center" }}>Status</th>
                                <th style={{ width: "100px", textAlign: "center" }}>Action</th>
                              </tr>
                            </thead>

                            <tbody>
                              {admins &&
                                admins.map((item, index) => (
                                  <tr key={index}>
                                    <td style={{ textAlign: "center" }}>{currentPage * pageSize + (index + 1)}</td>
                                    <td>{item?.fullName}</td>
                                    <td>{item?.email}</td>
                                    {/* <td>{item?.permissions}</td> */}
                                    <td>
                                      {item?.accType
                                        .replace(/[_-]/g, " ")
                                        .toLowerCase()
                                        .replace(/\b\w/g, (char: any) => char.toUpperCase())}{" "}
                                    </td>
                                    <td>
                                      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                        {item?.roles?.length
                                          ? item?.roles.map((role: any, index: any) => (
                                              <p
                                                className="m-0 shadow-success rounded-1"
                                                style={{ padding: 5, cursor: "default" }}
                                                key={role?._id}
                                              >
                                                {role?.name}
                                              </p>
                                            ))
                                          : ""}
                                      </div>
                                    </td>
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
                                              item?.isBlocked ? "bg-danger border-danger" : "bg-success border-success"
                                            }
                                            type="switch"
                                            style={{ width: "40px", height: "20px" }}
                                            checked={!item?.isBlocked}
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
                                            setAdminID(item?._id);
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
                                            setAdminID(item?._id);
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

      <Confirmation
        isOpen={openDelete}
        toggle={deleteToggle}
        submit={handleDeleteAdmin}
        text={`Are you sure you want to Delete this Admin?`}
      />
      <AddAdmin
        isOpen={showAddModal}
        toggle={addModalToggle}
        refetch={adminsRefetch}
      />
      <EditAdmin
        adminID={adminId}
        isOpen={showEditModal}
        toggle={editModalToggle}
        refetch={adminsRefetch}
      />
    </>
  );
};

export default Admins;
