import { gql, useQuery } from "@apollo/client";
import moment from "moment";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Card, CardBody, FormGroup, Input, Label, Row } from "reactstrap";
import { formatCurrency } from 'src/utils/formatCurrency'; interface OrdersPie {
  pending: number;
  paid: number;
}


const RefundGraphCard = ({ vendorId }: any) => {

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [ordersPie, setOrdersPie] = useState<OrdersPie>({
    pending: 0,
    paid: 0,
  });

  const piechartColors = ["#ffbf53", "#2ab57d", "#fd625e"];

  const options: Object = {
    chart: {
      width: 227,
      height: 227,
      type: "pie",
    },
    dataLabels: {
      enabled: true,
      style: {
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: "bold",
      },
      formatter: function (val: any, opts: any) {
        return formatCurrency(opts.w.config.series[opts.seriesIndex])

      },
    },
    labels: ["Pending", "Paid",],
    colors: piechartColors,
    stroke: {
      width: 0,
    },
    legend: {
      show: false,
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: function (val: any) {
          return formatCurrency(val);
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };

  const GET_ORDERS_PIE = gql` 
query GetDashboardRefundOrdersPieChartData($input: GetDashboardRefundOrdersPieChartDataInput!) {
  getDashboardRefundOrdersPieChartData(input: $input) {
    pending
    paid
  }
}
    `;

  const { data: ordersPieData, refetch: ordersPieRefetch } = useQuery(GET_ORDERS_PIE, {
    variables: {
      input: {
        "startDate": startDate,
        "endDate": endDate,
        ...(vendorId && { vendorId })
      }
    }
  }

  );

  useEffect(() => {
    if (ordersPieData && ordersPieData?.getDashboardRefundOrdersPieChartData) {
      setOrdersPie(ordersPieData?.getDashboardRefundOrdersPieChartData)
    }
  }, [ordersPieData, ordersPieRefetch,]);

  return (
    <React.Fragment>

      <Card className="card-h-100" style={{ height: "100%" }}>
        <CardBody>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", }}>
            <FormGroup >
              <Label check >Start Date</Label>
              <Input value={startDate} onChange={(e) => setStartDate((e.target.value))} type="date" id="startDate" style={{ width: "150px" }} />
            </FormGroup>
            <FormGroup >
              <Label check >End Date</Label>
              <Input value={endDate} onChange={(e) => setEndDate(e.target.value)} type="date" id="endDate" style={{ width: "150px" }} />
            </FormGroup>
          </div>


          <Row className="align-items-center">
            <div className="col-sm">
              <div id="wallet-balance" className="apex-charts">
                <ReactApexChart
                  options={options}
                  series={[ordersPie.pending, ordersPie.paid]}
                  type="donut"
                  height="227"
                />
              </div>
            </div>
            <div className="col-sm align-self-center">
              <div className="mt-4 mt-sm-0">
                <div>
                  <p className="mb-2">
                    <i className="mdi mdi-circle align-middle font-size-10 me-2 text-warning"></i>{" "}
                    Pending
                  </p>
                  <h5>
                    {formatCurrency(ordersPie.pending)}

                  </h5>
                </div>

                <div className="mt-4 pt-2">
                  <p className="mb-2">
                    <i className="mdi mdi-circle align-middle font-size-10 me-2 text-success"></i>{" "}
                    Paid
                  </p>
                  <h5>
                    {formatCurrency(ordersPie.paid)}

                  </h5>
                </div>


              </div>
            </div>
          </Row>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default RefundGraphCard;
