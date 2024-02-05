import React, { useEffect, useState } from "react";
// import Breadcrumb from "../Common/Breadcrumb";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
  Table,
  Button,
  Input,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem, Modal, ModalHeader, ModalBody, ModalFooter,

} from "reactstrap";
import { gql, useQuery, useMutation } from "@apollo/client";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import Breadcrumb from "src/components/Common/Breadcrumb";


interface Users {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    displayName: string;
    address: string;
    countryCode: string;
    mobileNumber: string;
    hash: string;
    isBlocked: boolean;
  }
  

const UserList = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToBlock, setUserToBlock] = useState<Users | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [users, setUsers] = useState<Users[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<{
    value: string;
    label: string;
    pass: boolean | null
  } | null>(null);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const pageSize = 10;
  const [maxRecords, setMaxRecords] = useState<number>(0);

  const openModal = (user: Users) => {
    setUserToBlock(user);
    setIsModalOpen(true);
  };

  const GET_USERS = gql`
  query GetUsersByAdmin($input: userFilters) {
  getUsersByAdmin(input: $input) {
    maxRecords
    records {
      _id
      email
      firstName
      lastName
      displayName
      address
      countryCode
      mobileNumber
      hash
      isBlocked
     
    }
  }
}
 
`;

  const BLOCK_USERS = gql`mutation UserBlock($input: userBlockInput!) {
    userBlock(input: $input) {
      message
    }
  }
`;
  const [UserBlock, { loading, error }] = useMutation(BLOCK_USERS);

  const {
    loading: usersLoading,
    error: usersError,
    data: usersDataResponse,
    refetch: usersRefetch,
  } = useQuery(GET_USERS, {
    variables: {
      input: {
        page: currentPage,
        size: pageSize,
        
      },
    },
  });


  const handleUserBlock = async (isBlocked: boolean) => {
    try {
      const result = await UserBlock({
        variables: {
          input: {
            _id: userToBlock?._id,
            isBlocked
          },
        },
      });

      if (result.data.userBlock) {
        if (isBlocked) {
          toast.success("User blocked Successfully")
        }
        else {
          toast.success("User unblocked Successfully")
        }
        fetchData();
      }
      setIsModalOpen(false);

    } catch (error) {
      console.error(error);
    }
  }

  const fetchData = async () => {
    try {
      const result = await usersRefetch({
        input: {
          page: currentPage,
          size: pageSize,
          isBlocked: selectedStatus?.pass,
          query: searchTerm
        },
      });
      setUsers(result.data.getUsersByAdmin.records);
      setMaxRecords(result.data.getUsersByAdmin.maxRecords);
    } catch (error: any) {
      console.error(error)
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedStatus, currentPage, searchTerm, usersRefetch]);

  const totalPages = Math.ceil(maxRecords / pageSize);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const statusOptions = [
    { value: "all", label: "All", pass: null },
    { value: "blocked", label: "Blocked", pass: true },
    { value: "nonBlocked", label: "Active", pass: false },
  ];

  const toggleStatusDropdown = () => {
    setStatusDropdownOpen(!statusDropdownOpen);
  };

  const handleStatusSelect = (selectedOption: any) => {
    setSelectedStatus(selectedOption);
    setStatusDropdownOpen(false);
  };

  const handleSearch = (event: any) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      <ToastContainer />
      <div className="page-content">
        <Container fluid={true} style={{ marginTop: "40px" }}>
          <Breadcrumb title="Dashboard" breadcrumbItem="Users" link="/" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <Row>
                    <Col xs={5} style={{ display: "flex", gap: "20px", }}>
                      <Input
                        type="text"
                        placeholder="Search by phone Number"
                        value={searchTerm}
                        onChange={handleSearch}
                        style={{ width: "50%" }}
                      />
                      <Dropdown
                        isOpen={statusDropdownOpen}
                        toggle={toggleStatusDropdown}
                      >
                        <DropdownToggle caret>
                          {selectedStatus
                            ? selectedStatus?.label
                            : "Select Status"}{" "}
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
                    </Col>


                  </Row>
                </CardHeader>
                <CardBody>

                  <Table
                    responsive
                    className="table table-bordered table-centered mb-0"
                  >
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Phone Number</th>
                        <th>Email</th>
                        <th>Name</th>
                        {/* <th>Gender</th> */}
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, index) => (
                        <tr key={user._id}>
                          <td>{index + 1}</td>
                          <td>{user.mobileNumber}</td>
                          <td>{user.email}</td>
                          {/* <td>{user.firstName}</td> */}
                          <td>{user.firstName}</td>
                          <td>
                            {user?.isBlocked == false ? "Active" : "Block"}
                          </td>
                          <td>
                            {"  "}
                            <Button
                              size="sm"
                              onClick={() => openModal(user)}
                              style={{
                                backgroundColor: "Black",
                              }}
                            >
                              {user.isBlocked ? "Unblock" : "Block"}
                            </Button>{" "}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </CardBody>
                <Row>
                  <Col>
                    <div className="d-flex justify-content-end mt-0 me-3">
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
                              {index}
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
            </Col>
          </Row>
        </Container>

        <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(!isModalOpen)}>
          <ModalHeader toggle={() => setIsModalOpen(!isModalOpen)}>
          {userToBlock?.isBlocked ? "Confirm unblock" : "Confirm Block"}
            
          </ModalHeader>
          <ModalBody>
            Are you sure you want to {userToBlock?.isBlocked ? "unblock" : "Block"} this user?
          </ModalBody>
          <ModalFooter>
            <Button
              style={{ backgroundColor: "black" }}
              onClick={() => {
                handleUserBlock(!userToBlock?.isBlocked)
              }
              }
            >
              {userToBlock?.isBlocked ? "Yes, unblock" : "Yes, block"}

            </Button>{" "}
            <Button color="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

      </div>
    </>
  );

};

export default UserList;