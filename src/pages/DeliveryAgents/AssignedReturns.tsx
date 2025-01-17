import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Col, Collapse, Row, Table } from "reactstrap";
import CustomButton from "src/components/Common/CustomButton";
import DynamicFilter from "src/components/filter/DynamicFilter";
import ExportExcelList from "src/components/orders/ExportExcelList";
import SettlementExcelList from "./ExcelLists/SettlementExcelList";
import Loader from "src/components/Common/Loader";
import { Link } from "react-router-dom";
import StatusIndicator from "src/components/statusIndicator/StatusIndicator";
import noDataSvg from "../../assets/images/noDataSvg.svg";

interface Props {
  agentId: string | null;
  DATE: string;
}

interface IOrder {
  _id: string;
  orderId: string;
  itemId: string;
  userId: {
    _id:string;
    fullName:string;
  }
  productName: string;
  sellingPrice: number;
  paymentStatus: string;
  orderDate: string;
  returnOrderAssignedOn: string;
  shippingStatus: string;
  returnStatus: string;
  returnAddress: {
    firstname: string;
  };
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
  query GetDeliveryAgentReturnOrder($input: GetDeliveryAgentReturnOrderInput!) {
    getDeliveryAgentReturnOrder(input: $input) {
      records {
        _id
        userId {
          _id
          fullName
        }
        productId
        vendorId
        vendorName
        orderId
        itemId
        productName
        shortDescription
        skuId
        warehouseSkuId
        returnPeriod
        mrp
        sellingPrice
        shippingCharge
        paymentMode
        paymentStatus
        paymentRemark
        orderDate
        shippingStatus
        shippedDate
        deliveryDate
        returnStatus
        returnUserReason
        returnAdminComment
        returnRequestDate
        returnRejectedDate
        returnDate
        refundStatus
        refundAmount
        refundRequestDate
        refundDate
        refundComment
        cancelUserReason
        cancelAdminComment
        cancelledDate
        courierId
        invoiceNumber
        deliveryAgentId
        deliveryAgentName

        returnAddress {
          firstname
          email
          mobile
          streetName
          city
          houseNumber
          country
          postCode
          apartment
          suite
          unit
          governorate
          village
          governorateID
          villageID
        }
        deliveryAssignedOn
        returnOrderAssignedOn
        returndeliveryAgentId
        returndeliveryAgentName
        returnCollectorBoy {
          _id
          fullName
          contactNumber
          userID
          password
          agentType
          vendorID
          ID
        }
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

const AssignedReturns: React.FC<Props> = ({ agentId, DATE }) => {
  const [orders, setOrders] = useState<IOrder[]>();
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  const [filters, setFilters] = useState({
    returnStatus: "",
  });

  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };
  const handleFilterSubmit = (formData: any) => {
    setCurrentPage(0);
    console.log({ formData });

    setFilters({
      returnStatus: formData.returnStatus,
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
      input: { agentId, limit: pageSize, page: currentPage, returnStatus: filters?.returnStatus, date: DATE },
    },
    skip: !agentId || !DATE,
  });

  useEffect(() => {
    if (ordersData && ordersData.getDeliveryAgentReturnOrder) {
      console.log("RETURNS = ", ordersData.getDeliveryAgentReturnOrder);

      setOrders(ordersData.getDeliveryAgentReturnOrder.records);
    }
  }, [agentId, ordersData, ordersDataLoading]);
  console.log("DATA = ", ordersData);
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
      label: "Return Status",
      type: "select",
      name: "returnStatus",
      options: [
        { value: "APPROVED", label: "Approved" },
        { value: "RETURNED TO WAREHOUSE", label: "Returned To Warehouse" },
        { value: "COLLECTED", label: "Collected" },
        { value: "DELIVERED", label: "Delivered" },
        { value: "REJECTED", label: "Rejected" },
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
              padding: "10px 0px ",
            }}
          >
            <h5>Returns History</h5>
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
                  <th>Assigned Date</th>
                  {/* <th>Payment Status</th> */}
                  <th className="text-center">Delivery Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders?.map((item, index) => {
                  const formattedDate = new Date(item.returnOrderAssignedOn).toLocaleDateString("en-GB");
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item?.itemId}</td>
                      <td>{item?.returnAddress?.firstname??item?.userId?.fullName}</td>
                      <td>
                        {item?.productName?.length > 20 ? `${item?.productName.slice(0, 20)}...` : item?.productName}
                      </td>
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
                            status={item?.returnStatus}
                          />
                        </div>
                      </td>
                      <td>
                        <Link to={`/shipping-orders/details?orderId=${item?.orderId}&_id=${item?._id}`}>
                          <Button
                          style={{
                            display:"block",
                            margin:"auto"
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
            <h4>No Return Orders Assigned</h4>
          </div>
      )}
    </>
  );
};

export default AssignedReturns;
