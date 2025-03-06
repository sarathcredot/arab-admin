import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Col, Collapse, Row, Table } from "reactstrap";
import CustomButton from "src/components/Common/CustomButton";
import StatusIndicator from "src/components/statusIndicator/StatusIndicator";
import DynamicFilter from "src/components/filter/DynamicFilter";
import ExportExcelList from "src/components/orders/ExportExcelList";
import SettlementExcelList from "./ExcelLists/SettlementExcelList";
import Loader from "src/components/Common/Loader";
import { Link } from "react-router-dom";
import { capitalize } from "lodash";
import noDataSvg from "../../assets/images/noDataSvg.svg";

interface Props {
  agentId: string | null;
  DATE: string;
}

interface IOrder {
  _id: string;
  orderId: string;
  itemId: string;
  userId: string;
  productName: string;
  sellingPrice: number;
  paymentStatus: string;
  orderDate: string;
  shippingStatus: string;
  deliveryAgentId: string;
  userName: string;
  email: string;
  mobileNumber: string;
  houseNumber: string;
  streetName: string;
  apartment: string;
  suite: string;
  unit: string;
  city: string;
  country: string;
  postCode: string;
  deliveryAgentAssignedOn: string;
  warrantyId: string;
  claimStatus: string;
}

// assigned orders query
const GET_WARRANTIES = gql`
  query GetDeliveryAgentWarrantyCall($input: getDeliveryAgentWarrantyCallInput!) {
    getDeliveryAgentWarrantyCall(input: $input) {
      records {
        _id
        warrantyId
        userName
        productName
        deliveryAgentAssignedOn
        claimStatus
      }
      totalCount
      page
      totalPages
    }
  }
`;

const EXPORT_ORDERS = gql`
  mutation ExportAssignOrders($input: AssignOrderInput!) {
    exportAssignOrders(input: $input) {
      message
    }
  }
`;

const AssignedWarranties: React.FC<Props> = ({ agentId, DATE }) => {
  const [orders, setOrders] = useState<IOrder[]>();
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  const [filters, setFilters] = useState({
    shippingStatus: "",
  });

  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };
  const handleFilterSubmit = (formData: any) => {
    setCurrentPage(0);
    console.log({ formData });

    setFilters({
      shippingStatus: formData.shippingStatus,
    });
  };

  const {
    data: ordersData,
    loading: ordersDataLoading,
    refetch: refetchOrdersData,
    error: ordersError,
  } = useQuery(GET_WARRANTIES, {
    fetchPolicy: "network-only",
    variables: {
      input: { agentId: agentId, limit: pageSize, page: currentPage, claimStatus: filters?.shippingStatus, date: DATE },
    },
    skip: !agentId || !DATE,
  });

  useEffect(() => {
    if (ordersData && ordersData.getDeliveryAgentWarrantyCall) {
      console.log("ORDERS = ", ordersData.getDeliveryAgentWarrantyCall);

      setOrders(ordersData.getDeliveryAgentWarrantyCall.records);
    }
  }, [agentId, ordersData, ordersDataLoading]);
  console.log("DATEE = ", ordersData);
  const [exportOrders] = useMutation(EXPORT_ORDERS);

  const handleExportClick = async () => {
    console.log("export btn clicked");

    try {
      const result = await exportOrders({
        variables: {
          input: {
            agentId,
            page: currentPage,
            size: pageSize,
          },
        },
      });

      if (result.data.exportAssignOrders) {
        console.log("result =", result.data);
        toast.success(result.data.exportAssignOrders?.message);
      }
    } catch (error: any) {
      toast.error(error);
      console.log(error);
    }
  };

  const totalRecords = ordersData?.getDeliveryAgentWarrantyCall?.totalCount || 0;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const filterOptions = [
    {
      label: "Shipping Status",
      type: "select",
      name: "shippingStatus",
      options: [
        { value: "PENDING", label: "Pending" },
        { value: "PACKAGE_IN_PROGRESS", label: "Package In Progress" },
        { value: "SHIPPED", label: "Shipped" },
        { value: "DELIVERED", label: "Delivered" },
        { value: "CANCELED", label: "Canceled" },
      ],
    },
  ];
  return (
    <>
      {ordersDataLoading ? (
        <Loader />
      ) : orders && orders?.length > 0 ? (
        <div className="table-rep-plugin mt-2">
          <div
            style={{
              display: "flex",
              alignItems: "end",
              justifyContent: "space-between",
              padding: "10px 0px 15px",
            }}
          >
            <h5>Warranties History</h5>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <SettlementExcelList
                agentId={agentId}
                name={"ASSIGN_EXPORT"}
              />
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
                  <th>Warranty ID</th>
                  <th>Customer Name</th>
                  {/* <th>Product Name</th> */}
                  {/* <th>Address</th> */}
                  <th>Date</th>
                  {/* <th>Payment Status</th> */}
                  <th className="text-center">Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders?.map((item, index) => {
                  const formattedDate = new Date(item?.deliveryAgentAssignedOn).toLocaleDateString("en-GB");
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item?.warrantyId}</td>
                      <td>{item?.userName}</td>
                      {/* <td>
                        {item?.productName?.length > 20 ? `${item?.productName.slice(0, 20)}...` : item?.productName}
                      </td> */}
                      {/* <td>
                        {[item?.houseNumber, item?.apartment, item?.streetName, item?.city, item?.postCode]
                          .filter(Boolean)
                          .join(", ")
                          .slice(0, 40) +
                          ([item?.houseNumber, item?.apartment, item?.streetName, item?.city, item?.postCode]
                            .filter(Boolean)
                            .join(", ").length > 40
                            ? "..."
                            : "")}
                      </td> */}
                      <td>{formattedDate.replace(/\//g, "-")}</td>
                      {/* <td>{item?.paymentStatus}</td> */}
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <StatusIndicator
                            variant="default"
                            status={item?.claimStatus}
                          />
                        </div>
                      </td>
                      <td>
                        <Link to={`/warranty-claims/details?id=${item?._id}`}>
                          <Button
                            style={{
                              display: "block",
                              margin: "auto",
                            }}
                            color="primary"
                            size="sm"
                          >
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
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
        </div>
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
          <h4>No Orders Assigned</h4>
        </div>
      )}
    </>
  );
};

export default AssignedWarranties;
