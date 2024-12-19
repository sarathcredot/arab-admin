import React, { useEffect, useState } from "react";
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
import StatusIndicator from "src/components/statusIndicator/StatusIndicator";
import { Link } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import AddAgentForm from "./AddFormDeliveryBoy";
import Breadcrumb from "src/components/Common/Breadcrumb";

// Agent Type
interface IAgent {
  _id: string;
  fullName: string;
  contactNumber: string;
  agentType: string;
  isActive: Boolean;
  vendorID: String;
  password: String;
}

// Agent Query
const GET_ALL_AGENT = gql`
  query GetAllAgentData($input: getAllAgentDataInput) {
  getAllAgentData(input: $input) {
    maxRecords
    records {
      _id
      fullName
      contactNumber
      userID
      password
      agentType
      isActive
      vendorID
      wallet {
        cashInHand
        lastSettlementDate
        totalSettlement
        grandTotal
      }
    }
  }
}
`;

const DeliveryBoys: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const tab = searchParams.get("tab");
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;
  const [agentData, setAgentData] = useState<IAgent[]>([]);
  const [activeTab, setActiveTab] = useState<boolean>();
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    isActive: "",
    agentType: "",
  });

  const {
    loading: agentLoading,
    error: agentError,
    data: agentDataResponse,
    refetch: refetchAgent,
  } = useQuery(GET_ALL_AGENT, {
    variables: {
      input: {
        page: currentPage,
        size: pageSize,
        isActive: filters?.isActive,
        agentType: filters?.agentType,
        fullName:searchTerm 
      },
    },
  });
  const toggleAddModal = () => {
    setShowAddModal(!showAddModal);
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  const handleFilterSubmit = (formData: any) => {
    setCurrentPage(0)
    setFilters({
      isActive: formData.isActive,
      agentType: formData.agentType,
    });
  };
  const items = [
    { text: "Dashboard", link: `/` },
    { text: "Delivery", link: null },
  ];

  useEffect(() => {
    if (agentDataResponse && agentDataResponse) {
      console.log("agenttttt====", agentDataResponse);

      setAgentData(agentDataResponse.getAllAgentData.records);
      refetchAgent()
    }
  }, [agentDataResponse, activeTab, filters, searchTerm]);

  if (agentError) {
    console.error("Error fetching agent data:", agentError);
  }
  const totalRecords = agentDataResponse?.getAllAgentData?.maxRecords || 0;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const filterOptions = [
    {
      label: "Agent Type",
      type: "select",
      name: "agentType",
      options: [
        { value: "ArabDeals", label: "ArabDeals" },
        { value: "Vendor", label: "Vendor" },
        { value: "ThirdParty", label: "ThirdParty" },
      ],
    },
    {
      label: "Status",
      type: "select",
      name: "isActive",
      options: [
        { value: "true", label: "ACTIVE" },
        { value: "false", label: "BLOCKED" },
      ],
    },
  ];

  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            items={items}
            currentPage="Delivery Boys"
          />
          {/* <Nav tabs>
            <NavItem>
              <NavLink
                className={activeTab === undefined ? "tab-button active" : "tab-button"}
                onClick={() => setActiveTab(undefined)}
              >
                ALL
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === false ? "tab-button active" : "tab-button"}
                onClick={() => setActiveTab(false)}
              >
                ALL
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === true ? "tab-button active" : "tab-button"}
                onClick={() => setActiveTab(true)}
              >
                ALL
              </NavLink>
            </NavItem>
          </Nav> */}
          <Row style={{ marginTop: "20px" }}>
            <Col lg={12}>
              <Card>
                <CardHeader style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                  <CustomButton
                    onClick={() => toggleAddModal()}
                    name="Add Delivery Boy"
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
                        placeholder="Search by fullname"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
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
                      filterOptions={filterOptions}
                      onSubmit={handleFilterSubmit}
                    />
                  </Collapse>

                  <AddAgentForm
                    isOpen={showAddModal}
                    toggle={toggleAddModal}
                    refetch={refetchAgent}
                  />

                  <Row>
                    {agentLoading ? (
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
                                <th>#</th>
                                <th>Full Name</th>
                                <th>Mobile Number</th>
                                <th>Agent Type</th>
                                <th>Status</th>
                                <th style={{ width: "50px" }}>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {agentData?.map((agent, index) => (
                                <tr key={agent._id}>
                                  {/* <td>{currentPage * pageSize + index + 1}</td> */}
                                  <td>{(currentPage*pageSize)+(index + 1)}</td>
                                  <td>{agent.fullName}</td>
                                  <td>{agent.contactNumber}</td>
                                  <td>{agent.agentType}</td>
                                  <td>
                                    <StatusIndicator status={agent.isActive === true ? "ACTIVE" : "BLOCKED"} />
                                  </td>
                                  <td>
                                    <Link to={`/delivery-boys/view?id=${agent._id}`}>
                                      <Button
                                        color="primary"
                                        size="sm"
                                      >
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
    </>
  );
};

export default DeliveryBoys;
