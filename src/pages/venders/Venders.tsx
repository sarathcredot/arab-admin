import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  CardHeader,
  Collapse,
} from "reactstrap";
import Breadcrumb from "src/components/Common/Breadcrumb";
import FormVender from "./FormVender";
import Loader from "src/components/Common/Loader";
import CustomButton from "src/components/Common/CustomButton";
import StatusIndicator from "src/components/statusIndicator/StatusIndicator";
import DynamicFilter from "src/components/filter/DynamicFilter";


interface IVendor {
  _id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  isBlocked: boolean;
  isKycCompleted: boolean;
  outletId: string;
  outletName: string;
  outletStatus: string;
  companyId: string;
  companyName: string;
  companyStatus: string;
}

const VendorList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [vendorData, setVendorData] = useState<IVendor[]>([]);
  const [activeTab, setActiveTab] = useState<boolean>();
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    email: "",
    status: false,
    mobileNumber: ""
  });

  const GET_VENDOR = gql`
      query GetAllVendorsRecordsByAdmin($input: VendorsRecordsByAdminFilter) {
  getAllVendorsRecordsByAdmin(input: $input) {
    maxRecords
    records {
      _id
      fullName
      email
      countryCode
      mobileNumber
      profilePic {
        fileType
        fileURL
        mimeType
        originalName
      }
      isBlocked
      isKycCompleted
      outletId
      outletName
      outletStatus
      companyId
      companyName
      companyStatus
      brands
      categories
    }
    message
  }
}
    `;

  const {
    loading: vendorLoading,
    error: vendorError,
    data: vendorDataResponse,
    refetch: refetchVendore
  } = useQuery(GET_VENDOR, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        page: currentPage,
        size: pageSize,
        isKycCompleted: activeTab,
        ...([true, false].includes(filters.status) && { isBlocked: filters.status }),
        mobileNumber: filters.mobileNumber,
        fullName: searchTerm,
        email: filters.email
      },
    },
  });

  useEffect(() => {
    if (vendorDataResponse && vendorDataResponse.getAllVendorsRecordsByAdmin) {
      setVendorData(vendorDataResponse.getAllVendorsRecordsByAdmin.records);

    }
  }, [vendorDataResponse, currentPage, activeTab, filters, searchTerm]);

  if (vendorError) {
    console.error("Error fetching vendor data:", vendorError);
  }

  const totalRecords = vendorDataResponse?.getAllVendorsRecordsByAdmin.maxRecords || 0;
  const totalPages = Math.ceil(totalRecords / pageSize);

  const handleNextPage = () => {
    if (currentPage + 1 < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const toggleAddModal = () => {
    setShowAddModal(!showAddModal);
  };

  const items = [
    { text: "Dashboard", link: `/` },
  ];


  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };




  const handleFilterSubmit = (formData: any) => {
    setFilters({
      email: formData.email,
      status: formData.status == 'true' ? true : false,
      mobileNumber: formData.mobileNumber
    });
  };



  const filterOptions = [
    {
      label: 'Mobile Number',
      type: 'text',
      name: 'mobileNumber',
    },
    {
      label: 'Email',
      type: 'text',
      name: 'email',
    },
    {
      label: 'Status',
      type: 'select',
      name: 'status',
      options: [
        { value: 'true', label: 'COMPLETED' },
        { value: 'false', label: 'PENDING' },
      ],
    },
  ];


  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb items={items} currentPage="Vendors" />
          <Nav tabs>
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
                Pending
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === true ? "tab-button active" : "tab-button"}
                onClick={() => setActiveTab(true)}
              >
                Verified
              </NavLink>
            </NavItem>

          </Nav>

          <Row style={{ marginTop: "20px" }}>
            <Col lg={12}>
              <Card>

                <CardHeader style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                  <CustomButton onClick={() => toggleAddModal()} name="Add Vendor" icon="material-symbols:add" />
                </CardHeader>

                <CardHeader>
                  <Row>
                    <Col xs={9} style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                      <Input
                        type="text"
                        placeholder="Search by fullname"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: "50%", }}
                      />

                    </Col>
                    <Col xs={3} style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>

                      <CustomButton onClick={toggleCollapse} name="Filters" icon="clarity:filter-solid" />
                    </Col>

                  </Row>
                </CardHeader>



                <CardBody>

                  <Collapse isOpen={isOpen}>
                    <DynamicFilter
                      filterOptions={filterOptions}
                      onSubmit={handleFilterSubmit}
                    />
                  </Collapse>

                  <FormVender isOpen={showAddModal} toggle={toggleAddModal} refetch={refetchVendore} />

                  <Row>
                    {
                      vendorLoading ?
                        <Loader />
                        :
                        <div className="table-rep-plugin">

                          <div className="table-responsive mb-0" data-pattern="priority-columns">


                            <Table
                              id="tech-companies-1"
                              className="table table-striped table-bordered"
                            >
                              <thead>
                                <tr>
                                  <th>#</th>
                                  <th>Full Name</th>
                                  <th>Mobile Number</th>
                                  <th>Email</th>
                                  <th>Company Name</th>
                                  <th style={{textAlign:"center"}}>KYC Status</th>
                                  <th style={{textAlign:"center"}}>Status</th>
                                  <th style={{width:"100px",textAlign:"center"}}>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {vendorData?.map((vendor, index) => (
                                  <tr key={vendor._id}>
                                    <td>{currentPage * pageSize + index + 1}</td>
                                    <td>{vendor.fullName}</td>
                                    <td>{vendor.mobileNumber}</td>
                                    <td>{vendor.email}</td>
                                    <td>{vendor.companyName}</td>
                                    <td className="">
                                    <div style={{ display: "flex", alignItems: "center",justifyContent:"center" }}>
                                      <StatusIndicator status={vendor.isKycCompleted === true ? "Completed" : "Pending"} />
                                    </div>
                                    </td>
                                    <td
                                    >
                                    <div style={{ display: "flex", alignItems: "center",justifyContent:"center" }}>
                                      <StatusIndicator status={vendor?.isBlocked === true ? "Blocked" : "Active"} />
                                    </div>
                                    </td>
                                    <td>
                                      <Link to={`/vendors/view?id=${vendor._id}`}>
                                        <Button
                                         style={{
                                          display: "block",
                                          margin: "auto",
                                        }}
                                          color="primary"
                                          size="sm">
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
                    }
                  </Row>
                </CardBody>

                <Row style={{ marginRight: "10px" }}>
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
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default VendorList;
