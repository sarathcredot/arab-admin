import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody
} from "reactstrap";

//SimpleBar
import SimpleBar from "simplebar-react";
import Iconify from "src/components/iconify/Iconify";
import { formatCurrency } from 'src/utils/formatCurrency';

interface OrderSummary {
  pendingAmount: number;
  paidToday: number;
}


const RefundTransactions = ({ vendorId }: any) => {
  const [orderSummary, setOrderSummary] = useState<OrderSummary>({
    pendingAmount: 0,
    paidToday: 0
  });


  const GET_ORDERS_SUMMARY = gql` 
query GetDashboardRefundOrdersSummary($input: getDashboardRefundOrdersSummaryInput!) {
  getDashboardRefundOrdersSummary(input: $input) {
    pendingAmount
    paidToday
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
    if (orderSummaryData && orderSummaryData?.getDashboardRefundOrdersSummary) {
      setOrderSummary(orderSummaryData?.getDashboardRefundOrdersSummary)
    }
  }, [orderSummaryData, orderSummaryRefetch]);

  return (
    <React.Fragment>
      <Card style={{ height: "100%" }}>
        <div className="card-header align-items-center d-flex">
          <h4 className="card-title mb-0 flex-grow-1">Refund Today</h4>
          <div className="flex-shrink-0">

          </div>
        </div>

        <CardBody className="px-0"
          style={{ maxHeight: "352px" }} >
          <table className="table align-middle table-nowrap table-borderless">
            <tbody >
              <tr style={{ borderRadius: "36px", backgroundColor: "#FAF9F9" }}>
                <td style={{ width: "50px" }}>
                  <div className="font-size-22 text-warning" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <Iconify icon="carbon:time-filled" />
                    <h5 className="font-size-14 " style={{ margin: "0" }}> Total Pending Amount</h5>
                  </div>
                </td>

                <td>
                  <div className="text-end">
                    <h5 className="font-size-14 text-muted mb-0">
                      {formatCurrency(orderSummary.pendingAmount)}
                    </h5>
                  </div>
                </td>
                <td>

                </td>

              </tr>

              <tr style={{ borderRadius: "36px", backgroundColor: "#FAF9F9" }}>
                <td style={{ width: "50px" }}>
                  <div className="font-size-22 text-success" style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <Iconify icon="mdi:tick-circle" />
                    <h5 className="font-size-14 " style={{ margin: "0" }}> Total Paid Today</h5>
                  </div>
                </td>



                <td>
                  <div className="text-end">
                    <h5 className="font-size-14 text-muted mb-0">
                      {formatCurrency(orderSummary.paidToday)}
                    </h5>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default RefundTransactions;
