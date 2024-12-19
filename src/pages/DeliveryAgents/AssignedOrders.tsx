import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Col, Collapse, Table } from "reactstrap";
import CustomButton from "src/components/Common/CustomButton";
import DynamicFilter from "src/components/filter/DynamicFilter";
import ExportExcelList from "src/components/orders/ExportExcelList";

interface Props {
  agentId: string | null;
  TAB: boolean;
}

interface IOrder {
  _id: string;
  orderId: string;
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

const AssignedOrders: React.FC<Props> = ({ agentId, TAB }) => {
  const [orders, setOrders] = useState<IOrder[]>();
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 5;

  const [filters, setFilters] = useState({
    shippingStatus: "",
  });

  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };
  const handleFilterSubmit = (formData: any) => {
    setCurrentPage(0);
    console.log({formData});
    
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
    <div className="table-rep-plugin mt-2">
      <div
        style={{
          display: "flex",
          alignItems: "end",
          justifyContent: "space-between",
          padding: "10px 0px 15px",
        }}
      >
        <h5>Assigned Orders History</h5>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <ExportExcelList name={"TRANSACTION_EXPORT"} />
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
            // onClick={handleExportClick}
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
              <th>User Name</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Order Date</th>
              <th>Payment Status</th>
              <th>Shipping Status</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((item, index) => {
              // const formattedDate = new Date(item.createdAt).toLocaleDateString("en-GB");
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item?.orderId}</td>
                  <td>{item?.userName}</td>
                  <td>{item?.productName?.length > 20 ? `${item?.productName.slice(0, 20)}...` : item?.productName}</td>
                  <td>{item?.sellingPrice}</td>
                  <td>{item?.orderDate}</td>
                  {/* <td>{formattedDate.replace(/\//g, "-")}</td> */}
                  <td>{item?.paymentStatus}</td>
                  <td>{item?.shippingStatus}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default AssignedOrders;
