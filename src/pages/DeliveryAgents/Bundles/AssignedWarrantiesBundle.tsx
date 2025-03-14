import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Col, Collapse, Input, Row, Table } from "reactstrap";
import CustomButton from "src/components/Common/CustomButton";
import DynamicFilter from "src/components/filter/DynamicFilter";
import ExportExcelList from "src/components/orders/ExportExcelList";
import SettlementExcelList from "../ExcelLists/SettlementExcelList";
import Loader from "src/components/Common/Loader";
import noDataSvg from "src/assets/images/noDataSvg.svg";

interface Props {
  agentId: string | null;
  setView: any;
  setDATE: any;
}

interface IOrder {
  _id: string;
  date: string;
  count: number;
}

// get assigned orders with date group
const GET_ORDERS_WITH_DATE = gql`
  query GetAssignedWarrantyCallDeliveryAgent($input: getAssignedWarrantyCallDeliveryAgentInput!) {
    getAssignedWarrantyCallDeliveryAgent(input: $input) {
      records {
        _id
        date
        count
      }
      maxRecords
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

const AssignedWarrantiesBundle: React.FC<Props> = ({ agentId, setView, setDATE }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [orders, setOrders] = useState<IOrder[]>();
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
  });

  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  const {
    data: ordersData,
    loading: ordersDataLoading,
    refetch: refetchOrdersData,
    error: ordersError,
  } = useQuery(GET_ORDERS_WITH_DATE, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        _id: agentId,
        page: currentPage,
        size: pageSize,
        startDate: filters?.startDate || null,
        endDate: filters?.endDate || null,

        // search: (searchTerm && new Date(parseInt(searchTerm)).toISOString()) || "",
      },
    },
    skip: !agentId,
  });

  useEffect(() => {
    if (ordersData && ordersData.getAssignedWarrantyCallDeliveryAgent) {
      console.log("ORDERS = ", ordersData.getAssignedWarrantyCallDeliveryAgent);

      setOrders(ordersData.getAssignedWarrantyCallDeliveryAgent.records);
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

  const totalRecords = ordersData?.getAssignedWarrantyCallDeliveryAgent?.maxRecords || 0;
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
      <div className="table-rep-plugin mt-2">
        <div
          style={{
            display: "flex",
            alignItems: "end",
            justifyContent: "space-between",
            padding: "10px 0px",
            gap: 10,
            // background: "#f1f1f1",
          }}
        >
          <h5>Warranties History Group</h5>
          <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
            {/* start:  */}
            <Input
              type="date"
              onChange={(e) => {
                setFilters((prev) => ({
                  ...prev,
                  startDate: e.target.value,
                }));
              }}
            />
            {/* end:  */}
            <Input
              type="date"
              onChange={(e) => {
                setFilters((prev) => ({
                  ...prev,
                  endDate: e.target.value,
                }));
              }}
            />
          </div>
        </div>

        {/* <Input
          type="number"
          placeholder="Search by Group ID"
          value={searchTerm}
          onChange={(e) => {
            setCurrentPage(0);
            setSearchTerm(e.target.value);
          }}
          style={{ width: "40%", marginBottom: 15 }}
        /> */}
        {ordersDataLoading ? (
          <Loader />
        ) : (orders && orders?.length > 0) || searchTerm ? (
          <>
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
                    <th style={{ width: "50px", textAlign: "center" }}>#</th>
                    <th>Group ID</th>
                    <th>Date</th>
                    <th
                      style={{
                        width: 150,
                      }}
                    >
                      Orders Assigned
                    </th>
                    <th style={{ width: "100px", textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders?.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td className="text-center">{index + 1}</td>
                        <td>{item?.date ? new Date(item?.date).getTime() : ""}</td>
                        <td className="">{item?._id}</td>
                        <td className="text-center">{item?.count}</td>
                        <td>
                          <Button
                            color="primary"
                            size="sm"
                            style={{
                              display: "block",
                              margin: "auto",
                            }}
                            onClick={() => {
                              setView(true);
                              setDATE(item?.date);
                            }}
                          >
                            View
                          </Button>
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
            <h4>No Warranty Pickups Assigned</h4>
          </div>
        )}
      </div>
    </>
  );
};

export default AssignedWarrantiesBundle;
