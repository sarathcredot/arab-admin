import { capitalCase } from "change-case";

import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Card,
  CardBody,
  Col,
  Collapse,
  Container,
  FormGroup,
  Input,
  Label,
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
import AssignedOrderBundle from "./Bundles/AssignedOrderBundle";
import AssignedReturnBundle from "./Bundles/AssignedReturnBundle";
import Confirmation from "src/components/Confirmation";
import AssignedReturns from "./AssignedReturns";
import noDataSvg from "../../assets/images/noDataSvg.svg";
import AssignedWarrantiesBundle from "./Bundles/AssignedWarrantiesBundle";
import AssignedWarranties from "./AssignWarranties";

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
  governorate: string;
  governorateID: string;
  village: string;
  villageID: string;
  isActive: boolean;
  isAvailable: boolean;
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
        governorate
        governorateID
        village
        villageID
        isActive
        isAvailable
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

const UPDATE_AVAILABILITY = gql`
  mutation UpdateAvailableStatusByAdmin($input: UpdateAvailableStatusInput!) {
    updateAvailableStatusByAdmin(input: $input) {
      _id
      message
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

  const [view, setView] = useState(false);
  const [DATE, setDATE] = useState("");
  const [TAB, setTAB] = useState<any>(false);
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
    type: "SETTLED",
  });

  const [isSuspendOpen, setIsSuspendOpen] = useState(false);
  const suspendToggle = () => setIsSuspendOpen(!isSuspendOpen);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const editToggleCollapse = () => setIsEditOpen(!isEditOpen);
  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  const [openAvailable, setOpenAvailable] = useState(false);
  const handleToggle = () => {
    setOpenAvailable(!openAvailable);
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
    fetchPolicy: "network-only",
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

  console.log("AGENT == ", data);

  const [updateAvailability] = useMutation(UPDATE_AVAILABILITY);
  const handleAvailability = async () => {
    try {
      const response = await updateAvailability({
        variables: {
          input: {
            agentId: data?._id,
            isAvailable: !data?.isAvailable,
          },
        },
      });
      console.log("RESPONSE AVAILABLE = ", response);
      if (response?.data?.updateAvailableStatusByAdmin) {
        toast.success(response?.data?.updateAvailableStatusByAdmin.message);
        handleToggle();
      }
    } catch (error: any) {
      console.log("ERROR = ", error);
      toast.error(error);
    }
    refetchData();
  };

  const [exportSettlements] = useMutation(EXPORT_SETTLEMENTS);

  const handleExportClick = async () => {
    console.log("export btn clicked");

    try {
      const result = await exportSettlements({
        variables: {
          input: {
            agentId: data?._id,
            page: currentPage,
            size: pageSize,
            startDate: filters?.startDate,
            endDate: filters?.endDate,
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
    // {
    //   label: "Type",
    //   type: "select",
    //   name: "type",
    //   options: [
    //     { value: "SETTLED", label: "SETTLED" },
    //     { value: "COLLECTED", label: "COLLECTED" },
    //   ],
    // },
  ];
  const items = [
    { text: "Dashboard", link: `/` },
    { text: "Delivery", link: null },
    { text: "Delivery Boys", link: `/delivery-boys` },
  ];

  useEffect(() => {
    setView(false);
    setDATE("");
  }, [TAB]);

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
                              className={data?.isActive ? "active-hover" : "blocked-hover"}
                              // style={{
                              //   height: "25px",
                              //   border: `1px solid ${data?.isActive ? "green" : "#dc4016"}`,
                              //   borderRadius: "18px",
                              //   display: "flex",
                              //   alignItems: "center",
                              //   justifyContent: "center",
                              //   color: `${data?.isActive ? "green" : "#dc4016"}`,
                              //   cursor: "pointer",
                              //   padding: 10,

                              // }}
                              onClick={() => setIsSuspendOpen(true)}
                            >
                              <p style={{ margin: "0" }}> {data?.isActive == true ? "Active" : "Blocked"}</p>
                              <SuspendDeliveryBoy
                                isOpen={isSuspendOpen}
                                toggle={suspendToggle}
                                agentId={data?._id}
                                isActive={data?.isActive}
                                refetch={refetchData}
                              />
                            </div>
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
                                width: "200px",
                                display: "flex",
                                alignItems: "end",
                                gap: 6,
                                zIndex: 900,
                              }}
                            >
                              Driving Licence :
                              <span
                                style={{
                                  cursor: "pointer",
                                }}
                                onClick={() => handleImageClick(data?.licence?.fileURL || "")}
                              >
                                <Iconify icon="mingcute:upload-line" />
                              </span>
                            </p>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            <p className="mb-0"> {(data?.fullName && capitalCase(data?.fullName)) || "nill"}</p>
                            <p className="mb-0"> {data?.userID || "nill"}</p>
                            <p className="mb-0"> {`+968 ${data?.contactNumber}` || "nill"}</p>
                            <p className="mb-0"> {data?.agentType || "nill"}</p>
                          </div>
                        </div>
                        <FormGroup
                          switch
                          className="mt-2"
                        >
                          <Input
                            className={data?.isAvailable === true ? "bg-success border-success" : ""}
                            type="switch"
                            style={{ width: "40px", height: "20px" }}
                            checked={data?.isAvailable}
                            onChange={handleToggle}
                          />
                          <Label
                            style={{ marginTop: "3px", marginLeft: "10px" }}
                            check
                          >
                            {data?.isAvailable === true ? "Available" : "Not Available"}
                          </Label>
                        </FormGroup>
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
                      <p className="mb-0">Cash In Hand :</p>
                      <p className="mb-0">Total Settlement :</p>
                      <p className="mb-0">Last Settlement Date :</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <p className="mb-0"> {data?.wallet?.cashInHand || 0}</p>
                      <p className="mb-0"> {data?.wallet?.totalSettlement || 0}</p>
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
                  className={TAB === "SETTLEMENTS" ? "tab-button active" : "tab-button"}
                  onClick={() => setTAB("SETTLEMENTS")}
                >
                  Settlements
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={TAB === "ORDERS" ? "tab-button active" : "tab-button"}
                  onClick={() => setTAB("ORDERS")}
                >
                  Orders
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={TAB === "RETURNS" ? "tab-button active" : "tab-button"}
                  onClick={() => setTAB("RETURNS")}
                >
                  Returns
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={TAB === "WARRANTIES" ? "tab-button active" : "tab-button"}
                  onClick={() => setTAB("WARRANTIES")}
                >
                  Warranties
                </NavLink>
              </NavItem>
            </Nav>
            {TAB === "SETTLEMETS" ? (
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
                      <h5>Settlement History</h5>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {data?._id && (
                          <SettlementExcelList
                            agentId={data?._id}
                            name={"SETTLEMENT_EXPORT"}
                          />
                        )}
                        <CustomButton
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
                            <th>Settled Amount</th>
                            <th>Initial Balance</th>
                            <th>Balance</th>
                            {/* <th>Type</th> */}
                            <th>Settled Date</th>
                            <th>Remarks</th>
                            {/* <th style={{ width: "100px" }}>Action</th> */}
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
                                {/* <td>{item.type}</td> */}
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
                    gap: 15,
                    padding: 40,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={noDataSvg}
                    alt="no data image"
                  />
                  <h4>No Settlements</h4>
                </div>
              )
            ) : TAB==="ORDERS" ? (
              !view ? (
                <AssignedOrderBundle
                  agentId={ID}
                  setView={setView}
                  setDATE={setDATE}
                />
              ) : (
                <AssignedOrders
                  agentId={ID}
                  DATE={DATE}
                />
              )
            ) : TAB === "RETURNS" ? (
              !view ? (
                <AssignedWarrantiesBundle
                  agentId={ID}
                  setView={setView}
                  setDATE={setDATE}
                />
              ) : (
                <AssignedWarranties
                  agentId={ID}
                  DATE={DATE}
                />
              )
            ) :TAB === "WARRANTIES" ? (
              !view ? (
                <AssignedReturnBundle
                  agentId={ID}
                  setView={setView}
                  setDATE={setDATE}
                />
              ) : (
                <AssignedReturns
                  agentId={ID}
                  DATE={DATE}
                />
              )
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 15,
                  padding: 40,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={noDataSvg}
                  alt="no data image"
                />
                <h4>No Returns Assigned</h4>
              </div>
            )}
          </Row>
        </Container>
      </div>
      <Confirmation
        isOpen={openAvailable}
        toggle={handleToggle}
        submit={handleAvailability}
        text={"Are you sure you want to update your availability status?"}
      />
    </>
  );
};

export default ViewDeliveryBoys;
