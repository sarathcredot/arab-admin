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
import { gql, useMutation, useQuery } from "@apollo/client";
import Breadcrumb from "src/components/Common/Breadcrumb";
import { toast } from "react-toastify";
import ExportExcelList from "src/components/orders/ExportExcelList";
import SettlementPopup from "../DeliveryAgents/SettlementPopup";
import Iconify from "src/components/iconify/Iconify";

// Agent Type// Agent Type
interface ILicence {
  fileType: string;
  fileURL: string;
  mimeType: string;
  originalName: string;
}

interface IWallet {
  cashInHand: number;
  lastSettlementDate: string;
  totalSettlement: number;
  grandTotal: number;
}

interface ISettlementHistory {
  _id: string;
  type: string;
  amount: number;
  remarks: string;
  totalAmount: number;
  balance: number;
  createdAt: string;
}

interface IAgent {
  _id: string;
  fullName: string;
  contactNumber: string;
  userID: string;
  agentType: string;
  isActive: boolean;
  vendorID: string;
  licence: ILicence;
  wallet: IWallet;
  settlementHistory: ISettlementHistory[];
}

const GET_ALL_AGENTS = gql`
  query {
    getAllAgentData {
      _id
      fullName
      contactNumber
      agentType
      isActive
      vendorID
      password
      wallet {
        cashInHand
        lastSettlementDate
        totalSettlement
        grandTotal
      }
      
    }
  }
`;

const SettlementPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const tab = searchParams.get("tab");
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;
  const [agentData, setAgentData] = useState<IAgent[]>([]);
  const [activeTab, setActiveTab] = useState<boolean>();
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [settlemodal, setSettleModal] = useState<boolean>(false);
  const [agentId, setAgentId] = useState("");

  const [filters, setFilters] = useState({
    email: "",
    status: false,
    mobileNumber: "",
  });
  const loading = false;

    const {
      loading: agentLoading,
      error: agentError,
      data: agentDataResponse,
      refetch: refetchAgent,
    } = useQuery(GET_ALL_AGENTS);
    const toggleAddModal = () => {
      setShowAddModal(!showAddModal);
    };

  const [isOpen, setIsOpen] = useState(false);
  const settleToggle = () => setSettleModal(!settlemodal);
  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  const handleFilterSubmit = (formData: any) => {
    setFilters({
      email: formData.email,
      status: formData.status == "true" ? true : false,
      mobileNumber: formData.mobileNumber,
    });
  };

  //   const [ExportAdminOrders] = useMutation(EXPORT_ORDERS);

  const handleExportClick = async () => {
    console.log("export btn clicked");
    toast.success("btn clicked");

    // try {
    //     const result = await ExportAdminOrders({
    //         variables: {
    //             input: {
    //                 orderId: filterData.orderId || searchTerm,
    //                 orderStatus: "PENDING",
    //                 ...(filterData._id && { _id: filterData._id }),
    //                 ...(filterData.userId && { userId: filterData.userId }),
    //                 startDate: filterData?.startDate,
    //                 endDate: filterData?.endDate,
    //                 paymentMode: filterData?.paymentMode,
    //             }
    //         }
    //     })

    //     if (result.data.exportAdminOrders) {
    //         toast.success("Export Successfull")
    //     }
    // } catch (error: any) {
    //     toast.success(error)
    //     console.log(error)
    // }
  };
  const items = [
    { text: "Dashboard", link: `/` },
    { text: "Delivery", link: null },
  ];

    useEffect(() => {
      if (agentDataResponse && agentDataResponse) {
        setAgentData(agentDataResponse?.getAllAgentData);
      }
    }, [agentDataResponse, activeTab, filters, searchTerm]);

    console.log("dattaaaaaa=",agentData)
  //   if (agentError) {
  //     console.error("Error fetching agent data:", agentError);
  //   }
  //   const totalRecords = agentDataResponse?.getAllAgentData?.maxRecords || 0;
  //   const totalPages = Math.ceil(totalRecords / pageSize);
  const filterOptions = [
    {
      label: "Start Date",
      type: "date",
      name: "startDate",
    },
    {
      label: "End Date",
      type: "date",
      name: "endDate",
    },
    {
      label: "Type",
      type: "select",
      name: "type",
      options: [
        { value: "SETTLED", label: "SETTLED" },
        { value: "COLLECTED", label: "COLLECTED" },
      ],
    },
  ];

  const history = [
    {
      _id: "1",
      agentId: "12312831",
      name: "sanin",
      phone: "9744712490",
      lastSettleDate: "12/12/2024",
      totalSettlement: 5000,
      balance: 1500,
    },
    {
      _id: "2",
      agentId: "872376472",
      name: "riyas",
      phone: "9744712490",
      lastSettleDate: "11/12/2024",
      totalSettlement: 6000,
      balance: 2000,
    },
    {
      _id: "3",
      agentId: "12343432",
      name: "sharath",
      phone: "9744712490",
      lastSettleDate: "11/12/2024",
      totalSettlement: 4500,
      balance: 2000,
    },
    {
      _id: "4",
      agentId: "433211232",
      name: "janna",
      phone: "9744712490",
      lastSettleDate: "10/12/2024",
      totalSettlement: 4000,
      balance: 1200,
    },
    {
      _id: "5",
      agentId: "997783732",
      name: "sadil",
      phone: "9744712490",
      lastSettleDate: "9/12/2024",
      totalSettlement: 4400,
      balance: 2300,
    },
  ];
  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb
            items={items}
            currentPage="Settlements"
          />
          <div style={{ position: "absolute", top: "175px", right: "50px" }}>
            {/* <ExportExcelList name={"TRANSACTION_EXPORT"} /> */}
          </div>
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
                SETTLED
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === true ? "tab-button active" : "tab-button"}
                onClick={() => setActiveTab(true)}
              >
                COLLECTED
              </NavLink>
            </NavItem>
          </Nav> */}
          <Row style={{ marginTop: "20px" }}>
            <Col lg={12}>
              <Card>
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
                      style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10 }}
                    >
                      <CustomButton
                        bgColor="unset"
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "40px",
                          borderRadius: "10px",
                          gap: "5px",
                          fontSize: "13px",
                        }}
                        outline
                        color="primary"
                        name="Export"
                        icon="ph:export-bold"
                        onClick={handleExportClick}
                      />

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
                  <Row>
                    {agentLoading ? (
                      <Loader />
                    ) : (
                      <div className="table-rep-plugin mt-2">
                        {/* <h5>Transaction History</h5> */}
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
                                <th>Name</th>
                                <th>Phone Number</th>
                                <th>Last Settled Date</th>
                                <th>Total Settlement</th>
                                <th>Balance</th>
                                <th style={{ width: "150px", textAlign: "center" }}>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {agentData.length>0 && agentData?.map((item, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{item?.fullName}</td>
                                  <td>{item?.contactNumber}</td>
                                  <td>{item?.wallet.lastSettlementDate &&new Date(item.wallet.lastSettlementDate).toLocaleDateString("en-GB").replace(/\//g, "-")}</td>
                                  <td>{item?.wallet.totalSettlement}</td>
                                  <td>{item?.wallet.cashInHand}</td>
                                  <td
                                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
                                  >
                                    {/* <CustomButton
                                      name="Settle"
                                      icon="carbon:wallet"
                                      /> */}
                                    <Button
                                      onClick={() => {
                                        setAgentId(item._id);
                                        agentId && settleToggle();
                                      }}
                                      color="primary"
                                      size="sm"
                                      style={{ display: "flex", alignItems: "center", gap: 5 }}
                                    >
                                      <Iconify
                                        icon={"carbon:wallet"}
                                        width={"15px"}
                                      />
                                      Settle
                                    </Button>

                                    <Link to={`/delivery-boys/view?id=${item._id}`}>
                                      <Button
                                        color="primary"
                                        size="sm"
                                      >
                                        Profile
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
                    <SettlementPopup
                      agentId={agentId}
                      isOpen={settlemodal}
                      toggle={settleToggle}
                      refetch={refetchAgent}
                    />
                  </Row>
                </CardBody>

                {/* pagination does not added */}

                {/* <Row style={{ marginRight: "10px" }}>
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
                </Row> */}
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default SettlementPage;
