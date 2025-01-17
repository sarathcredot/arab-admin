import { gql, useMutation, useQuery } from "@apollo/client";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { capitalCase, sentenceCase } from "change-case";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Modal,
  ModalBody, ModalFooter,
  ModalHeader,
  Nav,
  NavItem,
  NavLink,
  Row
} from "reactstrap";
import Breadcrumb from "../../components/Common/Breadcrumb";
import CustomButton from "../../components/Common/CustomButton";
import Loader from "../../components/Common/Loader";
import StatusIndicator from "src/components/statusIndicator/StatusIndicator";
import DeletedUserList from "./DeletedUserList";

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  mobileNumber: string;
  isBlocked: boolean;
}


interface UserFilter {
  mobileNumber: string;
  firstName: string;
  id: string;
}


const UserList = () => {
  const navigate = useNavigate();
  const [activeTab,setActiveTab]=useState("ALL")
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToBlock, setUserToBlock] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<{
    value: string;
    label: string;
    pass: boolean | null
  } | null>(null);
  const [userFilter, setUserFilter] = useState<UserFilter>({
    mobileNumber: '',
    firstName: '',
    id: ''
  });

  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedPage, setCopiedPage] = useState(0);


  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const pageSize = 10;
  const [maxRecords, setMaxRecords] = useState<number>(0);

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
      mobileNumber
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
    fetchPolicy: "network-only",
    variables: {
      input: {
        page: currentPage,
        size: pageSize,
        isBlocked: selectedStatus?.pass
        query: userFilter.mobileNumber,
        // phoneNumber: userFilter.mobileNumber,
        // ...((userFilter.id) && { _id: userFilter.id }),
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
          query: userFilter.mobileNumber,
          // phoneNumber: userFilter.mobileNumber,
          // ...((userFilter.id) && { _id: userFilter.id }),
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
  }, [selectedStatus, currentPage, userFilter, usersRefetch]);


  const totalPages = Math.ceil(maxRecords / pageSize);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const statusOptions = [
    { value: "all", label: "All", pass: null },
    { value: "false", label: "Active", pass: false },
    { value: "true", label: "Blocked", pass: true },
  ];

  const toggleStatusDropdown = () => {
    setStatusDropdownOpen(!statusDropdownOpen);
  };

  const handleStatusSelect = (selectedOption: any) => {
    setSelectedStatus(selectedOption);
    setStatusDropdownOpen(false);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserFilter((prevUserFilter) => ({
      ...prevUserFilter,
      [name]: value,
    }));
  };



  const copyToClipboard = (text: any, index: any) => {

    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setCopiedPage(currentPage);
  }
  const items = [
    { text: "Dashboard", link: `/` },
  ];

  return (
    <>
      <div className="page-content">
        <Container fluid={true} >
          <Breadcrumb items={items} currentPage="Users" />
          <Nav tabs>
            <NavItem>
              <NavLink
                className={activeTab === "ALL" ? "tab-button active" : "tab-button"}
                onClick={()=>setActiveTab("ALL")}
              >
                All Users
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === "DELETED" ? "tab-button active" : "tab-button"}
                onClick={()=>setActiveTab("DELETED")}
              >
                Deleted Users
              </NavLink>
            </NavItem>
          </Nav>
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <Row>
                    <Col xs={8} style={{ display: "flex", gap: "20px", }}>
                      <Input
                        type="text"
                        name="mobileNumber"
                        placeholder="Search by phone number"
                        value={userFilter.mobileNumber}
                        onChange={handleSearch}
                        style={{ width: "50%" }}
                      />
                      {activeTab==="ALL"&&
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
                  }
                    </Col>


                  </Row>
                </CardHeader>
                  <CardBody>
                  {usersLoading ? (
                    <Loader />
                  ) : (
                    <div className="table-rep-plugin">

                      <div className="table-responsive mb-0" data-pattern="priority-columns">


                        <Table id="tech-companies-1" className="table table-striped table-bordered">
                          <Thead>
                            <Tr>
                              <Th style={{width:50,textAlign:"center"}}>Sl.No</Th>
                              <Th>Phone Number</Th>
                              <Th>Fullname</Th>
                              <Th>Email</Th>
                              {activeTab==="ALL"&&
                              <Th className="text-center">Status</Th>
                            }
                              <Th className="text-center">Actions</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {users.map((user, index) => (
                              <Tr key={user._id}>
                                <Td className="text-center">{currentPage * pageSize + index + 1}</Td>
                                <Td>{user.mobileNumber}</Td>
                                <Td>
                                  <div style={{ display: "flex", gap: "15px", alignItems: "center", justifyContent: "space-between" }}>
                                    <p style={{ margin: "0", width: "140px" }}>  {capitalCase(`${user.firstName || ""} ${user.lastName || ""}`)}</p>
                                    <CustomButton outline disabled={copiedPage === currentPage && copiedIndex === index} name=""
                                      onClick={() => copyToClipboard(user._id, index)}
                                      icon="mingcute:copy-line" style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: "black",
                                        color: "white",
                                        width: "30px",
                                        height: "30px",
                                        borderRadius: "50%",
                                        gap: "5px",
                                        fontSize: "10px",
                                        border: "none",
                                      }} />
                                  </div>
                                </Td>
                                <Td>{user.email}</Td>
                                {activeTab==="ALL"&&
                                <Td>
                                <div style={{ display: "flex", alignItems: "center",justifyContent:"center" }}>
                                  <StatusIndicator status={user?.isBlocked ? "Blocked" : "Active"} variant={"default"} />
                                </div>
                                </Td>
                                }
                                <Td>
                                  {"  "}
                                  <Button
                                  style={{
                                    display: "block",
                                    margin: "auto",
                                  }}
                                  size="sm"
                                  color="primary"
                                  
                                  onClick={() => navigate(`/user/view?userId=${user._id}`)}
                                  >
                                    View
                                  </Button>{" "}
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </div>
                    </div>
                  )}
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
              style={{ backgroundColor: "rgba(177, 35, 73, 1)" }}
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
