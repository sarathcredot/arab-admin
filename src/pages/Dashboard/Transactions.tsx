import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody
} from "reactstrap";

//SimpleBar
import { gql, useQuery } from "@apollo/client";
import Iconify from "src/components/iconify/Iconify";

interface OrderSummary {
  pending: number;
  approvedToday: number;
  rejectedToday: number;
}

const Transactions = ({ vendorId }: any) => {

  const [orderSummary, setOrderSummary] = useState<OrderSummary>({
    pending: 0,
    approvedToday: 0,
    rejectedToday: 0,
  });


  const GET_ORDERS_SUMMARY = gql` 
query GetDashboardReturnedOrderSummary($input: GetDashboardReturnedOrderSummaryInput!) {
  getDashboardReturnedOrderSummary(input: $input) {
    pending
    approvedToday
    rejectedToday
  }
}

      `;

  const { data: orderSummaryData, refetch: orderSummaryRefetch } = useQuery(GET_ORDERS_SUMMARY, {
    variables: {
      input: {
        ...(vendorId && { vendorId })
      }
    }
  });

  useEffect(() => {
    if (orderSummaryData && orderSummaryData?.getDashboardReturnedOrderSummary) {
      setOrderSummary(orderSummaryData?.getDashboardReturnedOrderSummary)
    }
  }, [orderSummaryData, orderSummaryRefetch]);



  return (
    <React.Fragment>
      <Card style={{ height: '100%' }}>
        <div className="card-header align-items-center d-flex">
          <h4 className="card-title mb-0 flex-grow-1">Return Today</h4>
          <div className="flex-shrink-0">

          </div>
        </div>

        <CardBody className="px-0">

          <table className="table align-middle table-nowrap table-borderless">
            <tbody >
              <tr style={{ borderRadius: "36px", backgroundColor: "#FAF9F9" }}>
                <td style={{ width: "50px" }}>
                  <div className="font-size-22 text-warning" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <Iconify icon="carbon:time-filled" width={22} />
                    <h5 className="font-size-14" style={{ margin: "0" }}> Pending</h5>
                  </div>
                </td>

                <td>
                  <div className="text-end">
                    <h5 className="font-size-14 text-muted mb-0">
                      {orderSummary.pending}
                    </h5>
                    <p className="text-muted mb-0 font-size-12">
                      Orders
                    </p>
                  </div>
                </td>

                <td>

                </td>

              </tr>

              <tr style={{ borderRadius: "36px", backgroundColor: "#FAF9F9" }}>
                <td style={{ width: "50px" }}>
                  <div className="font-size-22 text-success" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <Iconify icon="mdi:tick-circle" width={22} />
                    <h5 className="font-size-14 " style={{ margin: "0" }}> Approved</h5>
                  </div>
                </td>

                <td>
                  <div className="text-end">
                    <h5 className="font-size-14 text-muted mb-0">
                      {orderSummary.approvedToday}
                    </h5>
                    <p className="text-muted mb-0 font-size-12">
                      Orders
                    </p>
                  </div>
                </td>
                <td>
                </td>
              </tr>

              <tr style={{ borderRadius: "36px", backgroundColor: "#FAF9F9" }}>

                <td style={{ width: "50px" }}>
                  <div className="font-size-22 text-danger" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <Iconify icon="carbon:close-filled" width={22} />
                    <h5 className="font-size-14 " style={{ margin: "0" }}> Rejected</h5>
                  </div>
                </td>



                <td>
                  <div className="text-end">
                    <h5 className="font-size-14 text-muted mb-0">
                      {orderSummary.rejectedToday}
                    </h5>
                    <p className="text-muted mb-0 font-size-12">
                      Orders
                    </p>
                  </div>
                </td>
                <td>
                </td>
              </tr>
            </tbody>
          </table>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default Transactions;
