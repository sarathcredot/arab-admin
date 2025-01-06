import { capitalCase } from "change-case";
import Lottie from "lottie-react";
import animation from "./noDataAnimation.json";

import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Collapse,
  Container,
  Nav,
  NavItem,
  NavLink,
  Row,
  Table,
  Tooltip,
} from "reactstrap";
import userAvatar from "src/assets/images/users/user-dummy-img.jpg";
import CustomButton from "src/components/Common/CustomButton";
import Loader from "src/components/Common/Loader";
import SettlementPopup from "./SettlementPopup";
import EditFormDeliveryBoy from "./EditFormDeliveryBoy";
import { toast } from "react-toastify";
import { gql, useMutation, useQuery } from "@apollo/client";
import Iconify from "src/components/iconify/Iconify";
import SettlementExcelList from "./ExcelLists/SettlementExcelList";
import { filter } from "lodash";
import DynamicFilter from "src/components/filter/DynamicFilter";
import AssignedOrders from "./AssignedOrders";
import Breadcrumb from "src/components/Common/Breadcrumb";
import EditSettlementPopup from "./EditSettlementPopup";
import SuspendDeliveryBoy from "./SuspendDeliveryBoy";

// Agent Type
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
  lastSettlementID: string;
}

const GET_DETAIL = gql`
  query GetDeliveryAgent($input: GetDeliveryAgentInput!) {
    getDeliveryAgent(input: $input) {
      currentPage
      deliveryAgent {
        _id
        fullName
        contactNumber
        userID
        ID
        agentType
        isActive
        vendorID
        lastSettlementID
        licence {
          fileType
          fileURL
          mimeType
          originalName
        }
        wallet {
          cashInHand
          lastSettlementDate
          totalSettlement
          grandTotal
        }
        settlementHistory {
          _id
          type
          amount
          remarks
          totalAmount
          balance
          createdAt
        }
      }
      totalItems
      totalPages
    }
  }
`;

const EXPORT_SETTLEMENTS = gql`
  mutation ExportAdminSettlementHistory($input: ExportAdminSettlementHistoryInput!) {
    exportAdminSettlementHistory(input: $input) {
      message
    }
  }
`;

const ViewDeliveryBoys = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ID = searchParams.get("id");
  console.log({ ID });

  const [TAB, setTAB] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  const [data, setData] = useState<IAgent>();

  const [settlemodal, setSettleModal] = useState<boolean>(false);
  const [editmodal, setEditModal] = useState<boolean>(false);
  const settleToggle = () => setSettleModal(!settlemodal);
  const editToggle = () => setEditModal(!editmodal);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);

  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    type: null,
  });

  const [isSuspendOpen, setIsSuspendOpen] = useState(false);
  const suspendToggle = () => setIsSuspendOpen(!isSuspendOpen);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const editToggleCollapse = () => setIsEditOpen(!isEditOpen);
  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  const handleFilterSubmit = (formData: any) => {
    setCurrentPage(0);
    setFilters({
      startDate: formData.startDate,
      endDate: formData.endDate,
      type: formData.type,
    });
  };

  const {
    data: detail,
    loading: detailLoading,
    refetch: refetchData,
    error,
  } = useQuery(GET_DETAIL, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        agentId: ID,
        page: currentPage,
        limit: pageSize,
        startDate: filters?.startDate,
        endDate: filters?.endDate,
        type: filters?.type || "SETTLED",
      },
    },
    skip: !ID,
  });

  if (detailLoading) {
    console.log("Query is loading...");
  }
  if (error) {
    console.error("Query error:", error);
  }

  console.log("Fetched data:", detail);

  useEffect(() => {
    if (detail && detail.getDeliveryAgent.deliveryAgent) {
      setData(detail.getDeliveryAgent.deliveryAgent);
    }
  }, [ID, detail]);

  console.log("AGENT== ", data);

  const [exportSettlements] = useMutation(EXPORT_SETTLEMENTS);

  const handleExportClick = async () => {
    console.log("export btn clicked");

    try {
      const result = await exportSettlements({
        variables: {
          input: {
            agentId: data?._id,
            endDate: null,
            page: null,
            size: null,
            startDate: null,
          },
        },
      });

      if (result.data.exportAdminSettlementHistory) {
        console.log("result =", result.data);
        toast.success(result.data.exportAdminSettlementHistory?.message);
      }
    } catch (error: any) {
      toast.error(error);
      console.log(error);
    }
  };

  const handleImageClick = (fileURL: string) => {
    if (fileURL) {
      window.open(fileURL);
    } else {
      console.error("Failed to get file URL.");
    }
  };
  console.log("TOTAL ITEMS = ", detail?.getDeliveryAgent?.totalItems);

  const totalRecords = detail?.getDeliveryAgent?.totalItems || 0;
  const totalPages = Math.ceil(totalRecords / pageSize);
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
  const items = [
    { text: "Dashboard", link: `/` },
    { text: "Delivery", link: null },
    { text: "Delivery Boys", link: `/delivery-boys` },
  ];
  return (
    <>
      <div className="page-content">
        <Container fluid>
          {/* <Breadcrumb
            items={items}
            currentPage="Details page"
          /> */}
          <h4>Detail Page</h4>
          <Row  
          // style={{ padding: "12px" }}
          
          >
            <Col
            xs={12}
              lg={6}
              style={{ padding: 6 }}
            >
              <Card style={{ height: "100%" }}>
                {detailLoading ? (
                  <Loader />
                ) : (
                  <CardBody>
                    <div style={{ display: "flex", gap: "20px" }}>
                      <div>
                        <img
                          src={userAvatar}
                          alt="avatar"
                          className="avatar rounded-circle img-thumbnail"
                          width={"70px"}
                        />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                            <h5 style={{ margin: "0" }}>{(data?.fullName && capitalCase(data?.fullName)) || "User"}</h5>
                            <div
                              style={{
                                // width: "80px",
                                height: "25px",
                                border: `1px solid ${data?.isActive ? "green" : "#dc4016"}`,
                                borderRadius: "18px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: `${data?.isActive ? "green" : "#dc4016"}`,
                                cursor: "pointer",
                                padding: 10,
                              }}
                              id={"Tooltip"}
                              onClick={() => setIsSuspendOpen(true)}
                            >
                              <SuspendDeliveryBoy
                                isOpen={isSuspendOpen}
                                toggle={suspendToggle}
                                agentId={data?._id}
                                isActive={data?.isActive}
                                refetch={refetchData}
                              />
                              <p style={{ margin: "0" }}> {data?.isActive == true ? "Active" : "Blocked"}</p>
                            </div>
                            <Tooltip
                              placement={"right"}
                              isOpen={tooltipOpen}
                              target={"Tooltip"}
                              toggle={toggle}
                            >
                              Click to Edit
                            </Tooltip>
                          </div>
                          <CustomButton
                            name=""
                            icon="ic:baseline-edit"
                            onClick={editToggle}
                          />
                          <EditFormDeliveryBoy
                            isOpen={editmodal}
                            toggle={editToggle}
                            data={data}
                            refetch={refetchData}
                          />
                        </div>
                        <div style={{ display: "flex", gap: 10 }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "80px" }}>
                            <p className="mb-0">Fullname :</p>
                            <p className="mb-0">Email :</p>
                            <p className="mb-0">Phone : </p>
                            <p className="mb-0">Agent Type : </p>
                            <p
                              className="mb-0 "
                              style={{
                                cursor: "pointer",
                                width: "200px",
                                display: "flex",
                                alignItems: "end",
                                gap: 6,
                                fontWeight: "bold",
                                zIndex: 900,
                              }}
                              onClick={() => handleImageClick(data?.licence?.fileURL || "")}
                            >
                              View Driving Licence
                              <Iconify icon="mingcute:upload-line" />
                            </p>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            <p className="mb-0"> {(data?.fullName && capitalCase(data?.fullName)) || "nill"}</p>
                            <p className="mb-0"> {data?.userID || "nill"}</p>
                            <p className="mb-0"> {`+968 ${data?.contactNumber}` || "nill"}</p>
                            <p className="mb-0"> {data?.agentType || "nill"}</p>
                            <div style={{ display: "flex", alignItems: "center", scale: ".9" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                )}
              </Card>
            </Col>
            <Col
              xs={12}
              lg={6}
              style={{ padding: 6, minHeight: "100%" }}
            >
              <Card style={{ height: "100%" }}>
                <CardBody style={{ paddingLeft: "25px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <h4 style={{ margin: "7px 0 12px " }}>Wallet</h4>
                    <CustomButton
                      name="Settle"
                      icon="carbon:wallet"
                      onClick={() => {
                        data?._id && settleToggle();
                      }}
                    />
                    <SettlementPopup
                      agentId={data?._id}
                      isOpen={settlemodal}
                      toggle={settleToggle}
                      refetch={refetchData}
                    />
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "150px" }}>
                      <p className="mb-0">Total Settlement :</p>
                      <p className="mb-0">Cash In Hand :</p>
                      <p className="mb-0">Last Settlement Date :</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <p className="mb-0"> {data?.wallet?.totalSettlement || 0}</p>
                      <p className="mb-0"> {data?.wallet?.cashInHand || 0}</p>
                      <p className="mb-0">
                        {" "}
                        {data?.wallet?.lastSettlementDate
                          ? new Date(data.wallet?.lastSettlementDate).toLocaleDateString("en-GB").replace(/\//g, "-")
                          : "nill"}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Nav
              tabs
              style={{ marginTop: "20px" }}
            >
              <NavItem>
                <NavLink
                  className={TAB === false ? "tab-button active" : "tab-button"}
                  onClick={() => setTAB(false)}
                >
                  SETTLEMENTS
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={TAB === true ? "tab-button active" : "tab-button"}
                  onClick={() => setTAB(true)}
                >
                  ORDERS
                </NavLink>
              </NavItem>
            </Nav>
            {!TAB ? (
              detailLoading ? (
                <Loader />
              ) : data && data?.settlementHistory?.length > 0 ? (
                <>
                  <div className="table-rep-plugin mt-2">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 0",
                      }}
                    >
                      <h4>Settlement History</h4>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {data?._id && (
                          <SettlementExcelList
                            agentId={data?._id}
                            name={"SETTLEMENT_EXPORT"}
                          />
                        )}
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
                      </div>
                    </div>
                    <Collapse isOpen={isOpen}>
                      <DynamicFilter
                        filterOptions={filterOptions}
                        onSubmit={handleFilterSubmit}
                      />
                    </Collapse>
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
                            <th>Amount</th>
                            <th>Initial CIH</th>
                            <th>Current CIH</th>
                            <th>Type</th>
                            <th>Settlement Date</th>
                            <th>Remarks</th>
                            {/* <th style={{ width: "50px" }}>Action</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {data?.settlementHistory?.map((item, index, array) => {
                            const formattedDate = new Date(item.createdAt).toLocaleDateString("en-GB");
                            return (
                              <tr key={index}>
                                <td>{currentPage * pageSize + (index + 1)}</td>
                                <td>{item.amount}</td>
                                <td>{item.totalAmount}</td>
                                <td>{item.balance}</td>
                                <td>{item.type}</td>
                                <td>{formattedDate.replace(/\//g, "-")}</td>
                                <td>{item.remarks}</td>
                                {/* {data.lastSettlementID === item._id ? (
                                  <td>
                                    <Button
                                      color="primary"
                                      size="sm"
                                      onClick={() => setIsEditOpen(true)}
                                    >
                                      Edit
                                    </Button>
                                    <EditSettlementPopup
                                      isOpen={isEditOpen}
                                      toggle={editToggleCollapse}
                                      settlementId={data?.lastSettlementID}
                                      data={{ amount: item.amount, remarks: item.remarks }}
                                      refetch={refetchData}
                                    />
                                  </td>
                                ) : (
                                  <td>{}</td>
                                )} */}
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </div>
                  </div>
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
                </>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "20px",
                  }}
                >
                  
                  <p>No Settlements</p>
                </div>
              )
            ) : (
              <AssignedOrders
                TAB={TAB}
                agentId={ID}
              />
            )}
          </Row>
        </Container>
      </div>
    </>
  );
};

export default ViewDeliveryBoys;
