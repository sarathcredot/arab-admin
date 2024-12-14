import { capitalCase } from "change-case";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Card, CardBody, CardHeader, Col, Container, Nav, NavItem, NavLink, Row, Table } from "reactstrap";
import userAvatar from "src/assets/images/users/user-dummy-img.jpg";
import CustomButton from "src/components/Common/CustomButton";
import Loader from "src/components/Common/Loader";
import StatusIndicator from "src/components/statusIndicator/StatusIndicator";
import SettlementPopup from "./SettlementPopup";
import EditFormDeliveryBoy from "./EditFormDeliveryBoy";
import { toast } from "react-toastify";
import ExportExcelList from "src/components/orders/ExportExcelList";
import { gql, useQuery } from "@apollo/client";
import { fetchSignedUrl, useFetchSignedUrl } from "src/utils/fetchSignedUrl";
import Iconify from "src/components/iconify/Iconify";

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
}

const GET_DETAIL = gql`
  query GetDeliveryAgent($input: GetDeliveryAgentInput!) {
    getDeliveryAgent(input: $input) {
      _id
      fullName
      contactNumber
      userID
      agentType
      isActive
      vendorID
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
  }
`;

const ViewDeliveryBoys = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ID = searchParams.get("id");
  console.log({ ID });
  const [data, setData] = useState<IAgent>();
  const loading = false;
  const [settlemodal, setSettleModal] = useState<boolean>(false);
  const [editmodal, setEditModal] = useState<boolean>(false);
  const settleToggle = () => setSettleModal(!settlemodal);
  const editToggle = () => setEditModal(!editmodal);
  const handleExportClick = async () => {
    console.log("export btn clicked");
    toast.success("btn clicked");
  };

  const {
    data: detail,
    loading: detailLoading,
    refetch: refetchData,
    error,
  } = useQuery(GET_DETAIL, {
    fetchPolicy: "network-only",
    variables: {
      input: { agentId: ID },
    },
    skip: !ID,
  });
  if (loading) {
    console.log("Query is loading...");
  }
  if (error) {
    console.error("Query error:", error);
  }

  console.log("Fetched data:", detail);

  useEffect(() => {
    if (detail && detail.getDeliveryAgent) {
      setData(detail.getDeliveryAgent);
    }
  }, [ID, detail]);

  console.log(data);

  const handleImageClick = (fileURL: string) => {
    if (fileURL) {
      window.open(fileURL);
    } else {
      console.error("Failed to get file URL.");
    }
  };

  return (
    <>
      <div className="page-content">
        <Container fluid>
          {/* <Breadcrumb items={items} currentPage="User Profile" /> */}
          <Row style={{ padding: "12px" }}>
            <Col
              lg="6"
              style={{ padding: 0, paddingRight: "5px" }}
            >
              <Card style={{ height: "100%" }}>
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
                              width: "80px",
                              height: "20px",
                              border: `1px solid ${data?.isActive ? "green" : "#dc4016"}`,
                              borderRadius: "18px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: `${data?.isActive ? "green" : "#dc4016"}`,
                            }}
                          >
                            <p style={{ margin: "0" }}> {data?.isActive == true ? "Active" : "Blocked"}</p>
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
                          {/* <p className="mb-0">ID :</p> */}
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
                              zIndex: 999,
                            }}
                            onClick={() => handleImageClick(data?.licence?.fileURL || "")}
                          >
                            View Licence
                            <Iconify icon="mingcute:upload-line" />
                          </p>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                          <p className="mb-0"> {(data?.fullName && capitalCase(data?.fullName)) || "nill"}</p>
                          {/* <p className="mb-0"> {data?._id || "nill"}</p> */}
                          <p className="mb-0"> {data?.userID || "nill"}</p>
                          <p className="mb-0"> {`+968 ${data?.contactNumber}` || "nill"}</p>
                          <p className="mb-0"> {data?.agentType || "nill"}</p>
                          <div style={{ display: "flex", alignItems: "center", scale: ".9" }}>
                            {/* <CustomButton
                              name=""
                              icon="mingcute:upload-line"
                              onClick={() => handleImageClick(data?.licence?.fileURL || "")}
                            /> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col
              lg="6"
              style={{ padding: 0, paddingLeft: "5px", minHeight: "100%" }}
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
                      {/* <p className="mb-0">Grand Total :</p> */}
                      <p className="mb-0">Total Settlement :</p>
                      <p className="mb-0">Cash In Hand :</p>
                      <p className="mb-0">Last Settlement Date :</p>
                      {/* <p className="mb-0">Assigned Orders : </p>
                      <p className="mb-0">Delivered Orders : </p> */}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {/* <p className="mb-0"> {wallet?.grandTotal || "nill"}</p> */}
                      <p className="mb-0"> {data?.wallet.totalSettlement || 0}</p>
                      <p className="mb-0"> {data?.wallet.cashInHand || 0}</p>
                      <p className="mb-0">
                        {" "}
                        {data?.wallet.lastSettlementDate
                          ? new Date(data.wallet.lastSettlementDate).toLocaleDateString("en-GB").replace(/\//g, "-")
                          : "nill"}
                      </p>
                      {/* <p className="mb-0"> {wallet?.deliveredOrders || "nill"}</p>
                      <p className="mb-0"> {wallet?.assignedOrders || "nill"}</p> */}
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
                {/* <Nav tabs>
                  <NavItem>
                    <NavLink
                      className={activeTab === undefined ? "tab-button active" : "tab-button"}
                      onClick={() => setActiveTab(undefined)}
                    >
                      SETTLEMENTS
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={activeTab === false ? "tab-button active" : "tab-button"}
                      onClick={() => setActiveTab(false)}
                    >
                      ORDERS
                    </NavLink>
                  </NavItem>
                </Nav> */}
            {loading ? (
              <Loader />
            ) : data && data?.settlementHistory?.length > 0 ? (
              <div className="table-rep-plugin mt-2">
                <div
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0" }}
                >
                  <h5>Settlement History</h5>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {/* <ExportExcelList name={"TRANSACTION_EXPORT"} /> */}
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
                  </div>
                </div>
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
                        <th>Date</th>
                        <th>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.settlementHistory?.map((item, index) => {
                        // Format the createdAt date
                        const formattedDate = new Date(item.createdAt).toLocaleDateString("en-GB"); // "dd/mm/yyyy" format

                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.amount}</td>
                            <td>{item.totalAmount}</td>
                            <td>{item.balance}</td>
                            <td>{item.type}</td>
                            <td>{formattedDate.replace(/\//g, "-")}</td>
                            <td>{item.remarks}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              </div>
            ) : (
              <div>No Settlements</div>
            )}
          </Row>
        </Container>
      </div>
    </>
  );
};

export default ViewDeliveryBoys;
