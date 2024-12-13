import { capitalCase } from "change-case";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Card, CardBody, CardHeader, Col, Container, Row, Table } from "reactstrap";
import userAvatar from "src/assets/images/users/user-dummy-img.jpg";
import CustomButton from "src/components/Common/CustomButton";
import Loader from "src/components/Common/Loader";
import StatusIndicator from "src/components/statusIndicator/StatusIndicator";
import SettlementPopup from "./SettlementPopup";
import EditFormDeliveryBoy from "./EditFormDeliveryBoy";
import { toast } from "react-toastify";
import ExportExcelList from "src/components/orders/ExportExcelList";
import { gql, useQuery } from "@apollo/client";

// Agent Type
interface IAgent {
  _id: string;
  fullName: string;
  contactNumber: string;
  agentType: string;
  isActive: Boolean;
  password: String;
  userID: String;
  vendorID: String;
}

const GET_DETAIL = gql`
  query($input: GetDeliveryAgentInput!){
  getDeliveryAgent(input: $input) {
    _id
    agentType
    contactNumber
    fullName
  }
}
`;

const ViewDeliveryBoys = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ID = searchParams.get("id");
  console.log({ ID });
  //   const [data, setData] = useState<IAgent>();
  const loading = false;
  const [settlemodal, setSettleModal] = useState<boolean>(false);
  const [editmodal, setEditModal] = useState<boolean>(false);
  const settleToggle = () => setSettleModal(!settlemodal);
  const editToggle = () => setEditModal(!editmodal);

  const handleExportClick = async () => {
    console.log("export btn clicked");
    toast.success("btn clicked");
  };

  const { data:detail, loading:dataLoading, error } = useQuery(GET_DETAIL, {
    fetchPolicy: "network-only",
    variables: {
      input: { agentId: "67519c893a23d96aee2051b4" },
    },
    skip:!!ID
  });
  
  if (loading) {
    console.log("Query is loading...");
  }
  if (error) {
    console.error("Query error:", error);
  }
  
  console.log("Fetched data:", detail);
  

  const data = {
    _id: "67519c893a23d96aee2051b4",
    fullName: "sanin muhammed",
    contactNumber: "9744712490",
    agentType: "Vendor",
    isActive: true,
    email: "sanin@credot.in",
    vendorID: "18736418723",
    licence: "sdhflksdjkdklddsjsd",
  };

  const wallet = {
    // grandTotal: 6100,
    totalSettled: 5500,
    CIH: 600,
    lastSettleDate: "12/12/2024",
    // deliveredOrders: 7,
    // assignedOrders: 2,
  };

  const history = [
    {
      amount: 2000,
      initialCIH: 2700,
      currentCIH: 700,
      type: "SETTLED",
      date: "11/12/2024",
      remarks: "thsd ei sajfsd sudfksd lsdjf",
    },
    {
      amount: 1400,
      initialCIH: 700,
      currentCIH: 2100,
      type: "COLLECTED",
      date: "11/12/2024",
      remarks: "",
    },
    {
      amount: 2000,
      initialCIH: 2100,
      currentCIH: 100,
      type: "SETTLED",
      date: "11/12/2024",
      remarks: "thsd ei sajfsd sudfksd lsdjf",
    },
    {
      amount: 2000,
      initialCIH: 100,
      currentCIH: 2100,
      type: "COLLECTED",
      date: "11/12/2024",
      remarks: "",
    },
    {
      amount: 1500,
      initialCIH: 2100,
      currentCIH: 600,
      type: "SETTLED",
      date: "11/12/2024",
      remarks: "thsd ei sajfsd sudfksd lsdjf",
    },
  ];

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
                        className="avatar-md rounded-circle img-thumbnail"
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
                        {/* <EditFormDeliveryBoy
                          isOpen={editmodal}
                          toggle={editToggle}
                          data={data}
                          // refetch={refetchAgent}
                        /> */}
                      </div>
                      <div style={{ display: "flex", gap: 10 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "80px" }}>
                          <p className="mb-0">Fullname :</p>
                          {/* <p className="mb-0">ID :</p> */}
                          <p className="mb-0">Email :</p>
                          <p className="mb-0">Phone : </p>
                          <p className="mb-0">Agent Type : </p>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                          <p className="mb-0"> {(data?.fullName && capitalCase(data?.fullName)) || "nill"}</p>
                          {/* <p className="mb-0"> {data?._id || "nill"}</p> */}
                          <p className="mb-0"> {data?.email || "nill"}</p>
                          <p className="mb-0"> {`+968 ${data?.contactNumber}` || "nill"}</p>
                          <p className="mb-0"> {data?.agentType || "nill"}</p>
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
                        data._id && settleToggle();
                      }}
                    />
                    {/* <SettlementPopup
                      agentID={data?._id}
                      isOpen={settlemodal}
                      toggle={settleToggle}
                    /> */}
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "150px" }}>
                      {/* <p className="mb-0">Grand Total :</p> */}
                      <p className="mb-0">Total Settled :</p>
                      <p className="mb-0">CIH :</p>
                      <p className="mb-0">Last Settled Date :</p>
                      {/* <p className="mb-0">Assigned Orders : </p>
                      <p className="mb-0">Delivered Orders : </p> */}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {/* <p className="mb-0"> {wallet?.grandTotal || "nill"}</p> */}
                      <p className="mb-0"> {wallet?.totalSettled || "nill"}</p>
                      <p className="mb-0"> {wallet?.CIH || "nill"}</p>
                      <p className="mb-0"> {wallet?.lastSettleDate || "nill"}</p>
                      {/* <p className="mb-0"> {wallet?.deliveredOrders || "nill"}</p>
                      <p className="mb-0"> {wallet?.assignedOrders || "nill"}</p> */}
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            {loading ? (
              <Loader />
            ) : (
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
                      {history?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.amount}</td>
                          <td>{item.initialCIH}</td>
                          <td>{item.currentCIH}</td>
                          <td>{item.type}</td>
                          <td>{item.date}</td>
                          <td>{item.remarks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            )}
          </Row>
        </Container>
      </div>
    </>
  );
};

export default ViewDeliveryBoys;
