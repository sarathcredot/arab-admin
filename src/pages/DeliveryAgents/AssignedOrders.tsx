import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Col, Collapse, Row, Table } from "reactstrap";
import CustomButton from "src/components/Common/CustomButton";
import DynamicFilter from "src/components/filter/DynamicFilter";
import ExportExcelList from "src/components/orders/ExportExcelList";
import SettlementExcelList from "./ExcelLists/SettlementExcelList";
import Loader from "src/components/Common/Loader";
import Lottie from "lottie-react";
import animation from "./noDataAnimation.json";
import { Link } from "react-router-dom";

interface Props {
  agentId: string | null;
  TAB: boolean;
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
}

// assigned orders query
const GET_ORDERS = gql`
  query GetAssignedOrderByDeliveryAgent($input: GetAssignedOrderByDeliveryAgentInput) {
    getAssignedOrderByDeliveryAgent(input: $input) {
      maxRecords
      records {
        _id
        orderId
        itemId
        userId
        productName
        sellingPrice
        paymentStatus
        orderDate
        shippingStatus
        deliveryAgentId
        userName
        email
        mobileNumber
        houseNumber
        streetName
        apartment
        suite
        unit
        city
        country
        postCode
      }
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

const AssignedOrders: React.FC<Props> = ({ agentId, TAB }) => {
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
  } = useQuery(GET_ORDERS, {
    fetchPolicy: "network-only",
    variables: {
      input: { _id: agentId, size: pageSize, page: currentPage, shippingStatus: filters?.shippingStatus },
    },
    skip: !TAB || !agentId,
  });

  useEffect(() => {
    if (ordersData && ordersData.getAssignedOrderByDeliveryAgent) {
      console.log("ORDERS = ", ordersData.getAssignedOrderByDeliveryAgent);

      setOrders(ordersData.getAssignedOrderByDeliveryAgent.records);
    }
  }, [agentId, ordersData, TAB]);

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

  const totalRecords = ordersData?.getAssignedOrderByDeliveryAgent?.maxRecords || 0;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const filterOptions = [
    {
      label: "Shipping Status",
      type: "select",
      name: "shippingStatus",
      options: [
        { value: "PENDING", label: "PENDING" },
        { value: "PACKAGE_IN_PROGRESS", label: "PACKAGE_IN_PROGRESS" },
        { value: "SHIPPED", label: "SHIPPED" },
        { value: "DELIVERED", label: "DELIVERED" },
        { value: "CANCELED", label: "CANCELED" },
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
            <h5>Orders History</h5>
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
                  <th>Order ID</th>
                  <th>Customer Name</th>
                  <th>Product Name</th>
                  <th>Order Date</th>
                  {/* <th>Payment Status</th> */}
                  <th>Delivery Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders?.map((item, index) => {
                  const formattedDate = new Date(item.orderDate).toLocaleDateString("en-GB");
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item?.itemId}</td>
                      <td>{item?.userName}</td>
                      <td>
                        {item?.productName?.length > 20 ? `${item?.productName.slice(0, 20)}...` : item?.productName}
                      </td>
                      <td>{formattedDate.replace(/\//g, "-")}</td>
                      {/* <td>{item?.paymentStatus}</td> */}
                      <td>{item?.shippingStatus}</td>
                      <td>
                        <Link to={`/shipping-orders/details?orderId=${item?.orderId}&_id=${item?._id}`}>
                          <Button
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
            alignItems: "center",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <p>No Orders Assigned</p>
        </div>
      )}
    </>
  );
};

export default AssignedOrders;
