import React, { useEffect, useState } from 'react'
import { Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Row } from 'reactstrap'
import SummaryCard from './SummaryCard'
import ReactApexChart from 'react-apexcharts'
import CountUp from "react-countup";
import { gql, useQuery } from '@apollo/client';
import moment from 'moment';
import { ApexOptions } from 'apexcharts';
import OrderAmountGraphCard from './OrderAmountGraphCard';

interface OrderData {
    pendingOrders: number;
    progressOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    returnedOrders: number;
};

interface OrdersPie {
    deliveredOrders: number;
    cancelledOrders: number;
    returnedOrders: number;
}

interface DashboardOrdersGraphResponse {
    y1: number[];
    x: string[];
}

function OrdersOverview({ vendorId }: any) {

    const [orderCounts, setOrderCounts] = useState<OrderData>({
        pendingOrders: 0,
        progressOrders: 0,
        shippedOrders: 0,
        deliveredOrders: 0,
        cancelledOrders: 0,
        returnedOrders: 0,
    });
    const [ordersPie, setOrdersPie] = useState<OrdersPie>({
        deliveredOrders: 0,
        cancelledOrders: 0,
        returnedOrders: 0,
    });

    const [selectedType, setSelectedType] = useState<string>("DAY");
    const [startDate, setStartDate] = useState(moment().subtract(2, 'weeks').format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));
    const [pieStartDate, setPieStartDate] = useState("");
    const [pieEndDate, setPieEndDate] = useState('');
    const [ordersGraph, setOrdersGraph] = useState<DashboardOrdersGraphResponse>({
        y1: [],
        x: [],
    });

    useEffect(() => {
        let startDate;
        switch (selectedType) {
            case "DAY":
                startDate = moment().subtract(2, 'weeks').format('YYYY-MM-DD');
                break;
            case "WEEK":
                startDate = moment().subtract(3, 'months').format('YYYY-MM-DD');
                break;
            case "MONTH":
                startDate = moment().subtract(10, 'months').format('YYYY-MM-DD');
                break;
            case "YEAR":
                startDate = moment().subtract(5, 'years').format('YYYY-MM-DD');
                break;
            default:
                startDate = '';
                break;
        }
        setStartDate(startDate);
    }, [selectedType]);



    const handleTypeSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedType(e.target.value)
    }




    const options: Object = {
        chart: {
            height: 400,
            type: "bar",
            toolbar: { show: false },
            sparkline: {
                enabled: false
            },
            parentHeightOffset: 0,
            animations: { enabled: true },
            foreColor: "#999",
        },
        plotOptions: {
            bar: {
                horizontal: false
            }
        },
        colors: ["#b12349"],
        stroke: {
            curve: "smooth",
            width: 2,
        },
        xaxis: {
            categories: ordersGraph?.x,
            labels: {
                show: true,
                formatter: function (val: string) {
                    return val;
                }
            },
            axisTicks: {
                show: true,
            },
            axisBorder: {
                show: true,
            },
        },
        yaxis: {
            labels: {
                show: true,
            },
        },
        tooltip: {
            x: {
                show: true,
            },
            y: {
                title: {
                    formatter: function (seriesName: any) {
                        return "";
                    },
                },
                formatter: function (val: any) {
                    const intValue = parseInt(val);

                    if (intValue === 1) {
                        return intValue.toString() + " order";
                    } else {
                        return intValue.toString() + " orders";
                    }
                }
            },
            marker: {
                show: false,
            },
        },
    };


    const donutGraphOptions: any = {
        chart: {
            type: "donut",
            width: "100%",
            toolbar: { show: false },
        },
        colors: ["#35C27F", "#FF5733", "#FFC107"],
        labels: ["Total Delivered", "Total Cancelled", "Total Returned"],
        dataLabels: {
            formatter: function (val: any, opts: any) {
                return opts.w.config.series[opts.seriesIndex]
            },
        },
        plotOptions: {
            pie: {
                donut: {
                    size: "65%",
                },
            },
        },
        legend: {
            show: true,
            position: "bottom",
            horizontalAlign: "center",
            floating: false,
            fontSize: "14px",
            offsetX: 0,
            offsetY: 10,
        },
        tooltip: {
            enabled: true,
            y: {
                formatter: function (val: any) {
                    return val;
                },
            },
        },
    };





    const GET_ORDER_COUNTS = gql` 
 query GetDashboardOrderSummary($input: GetDashboardOrderSummaryInput!) {
  getDashboardOrderSummary(input: $input) {
    pendingOrders
    progressOrders
    shippedOrders
    deliveredOrders
    cancelledOrders
    returnedOrders
  }
}
    `;


    const { data: ordersCountsData, refetch: usersCountRefetch } = useQuery(GET_ORDER_COUNTS, {
        variables: {
            input: {
                ...(vendorId && { vendorId })
            }
        }
    })

    useEffect(() => {
        if (ordersCountsData && ordersCountsData?.getDashboardOrderSummary) {
            setOrderCounts(ordersCountsData?.getDashboardOrderSummary)
        }
    }, [usersCountRefetch, ordersCountsData]);

    const GET_ORDERS_GRAPH = gql` 
  query GetDashboardOrdersGraph($input: GetDashboardOrdersGraphInput!) {
  getDashboardOrdersGraph(input: $input) {
    y1
    x
  }
}
    `;

    const { data: ordersGraphData, refetch: ordersGraphRefetch } = useQuery(GET_ORDERS_GRAPH, {
        variables: {
            input: {
                "startDate": startDate,
                "endDate": endDate,
                "graphType": selectedType,
                ...(vendorId && { vendorId })
            }
        }
    })

    useEffect(() => {
        if (ordersGraphData && ordersGraphData?.getDashboardOrdersGraph) {
            setOrdersGraph(ordersGraphData?.getDashboardOrdersGraph)
        }
    }, [ordersGraphData, ordersGraphRefetch, selectedType, startDate, endDate]);


    const GET_ORDERS_PIE = gql` 
query GetDashboardOrdersPieChartData($input: GetDashboardOrdersPieChartDataInput!) {
  getDashboardOrdersPieChartData(input: $input) {
    deliveredOrders
    cancelledOrders
    returnedOrders
  }
}
    `;

    const { data: ordersPieData, refetch: ordersPieRefetch } = useQuery(GET_ORDERS_PIE, {
        variables: {
            input: {
                "startDate": pieStartDate,
                "endDate": pieEndDate,
                ...(vendorId && { vendorId })
            }
        }
    }

    );

    useEffect(() => {
        if (ordersPieData && ordersPieData?.getDashboardOrdersPieChartData) {
            setOrdersPie(ordersPieData?.getDashboardOrdersPieChartData)
        }
    }, [ordersPieData, ordersPieRefetch,]);


    return (
        <>
            <Row>

                <Col xs={12} sm={4} xl={2}>
                    <SummaryCard title="Pending Orders" icon="ic:baseline-inventory" total={orderCounts.pendingOrders ?? 0} />
                </Col>
                <Col xs={12} sm={4} xl={2}>
                    <SummaryCard title="In Progress Orders" icon="ic:baseline-inventory" total={orderCounts.progressOrders ?? 0} />
                </Col>
                <Col xs={12} sm={4} xl={2}>
                    <SummaryCard title="Shipped Orders" icon="ic:baseline-inventory" total={orderCounts.shippedOrders ?? 0} />
                </Col>
                <Col xs={12} sm={4} xl={2}>
                    <SummaryCard title="Delivered  Today" icon="ic:baseline-inventory" total={orderCounts.deliveredOrders ?? 0} />
                </Col>
                <Col xs={12} sm={4} xl={2}>
                    <SummaryCard title="Cancelled Today" icon="ic:baseline-inventory" total={orderCounts.cancelledOrders ?? 0} />
                </Col>
                <Col xs={12} sm={4} xl={2}>
                    <SummaryCard title="Returned Today" icon="ic:baseline-inventory" total={orderCounts.returnedOrders ?? 0} />
                </Col>
            </Row>



            <Row>
                <Col xs={12} sm={12} xl={8}>
                    <Card className="card-h-100" style={{ height: "500px", width: "100%", borderRadius: "7px", borderColor: "1px solid #F9F9F9", boxShadow: "1px solid #F9F9F9" }}>
                        <CardHeader>
                            <h5>
                                Orders
                            </h5>
                        </CardHeader>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: '10px 20px 10px 20px' }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "340px" }}>
                                <FormGroup >
                                    <Label check >Start Date</Label>
                                    <Input value={startDate} onChange={(e) => setStartDate((e.target.value))} type="date" id="startDate" style={{ width: "150px" }} />
                                </FormGroup>
                                <FormGroup >
                                    <Label check for="endDate">End Date</Label>
                                    <Input value={endDate} onChange={(e) => setEndDate(e.target.value)} type="date" id="endDate" style={{ width: "150px" }} />
                                </FormGroup>
                            </div>

                            <FormGroup >
                                <Label check for="type">Type</Label>
                                <Input type="select" id="type" style={{ width: "150px" }}
                                    value={selectedType}
                                    onChange={handleTypeSelect}
                                >
                                    <option value={"DAY"}>Day</option>
                                    <option value={"WEEK"}>Week</option>
                                    <option value={"MONTH"}>Month</option>
                                    <option value={"YEAR"}>Year</option>
                                </Input>
                            </FormGroup>
                        </div>
                        <CardBody style={{ display: "flex", flexDirection: "column", }}>
                            <ReactApexChart
                                // options={options}
                                series={[{ data: ordersGraph?.y1 }]}
                                type="bar"
                                className="apex-charts  "
                                dir="ltr"
                                height={280}
                                options={options}
                            />

                        </CardBody>
                    </Card>


                </Col>
                <Col xs={12} sm={12} xl={4}>
                    <Card className="card-h-100" style={{ height: "500px", width: "100%", borderRadius: "7px", borderColor: "1px solid #F9F9F9", boxShadow: "1px solid #F9F9F9" }}>
                        <CardHeader>
                            <h5>
                                Total  Orders
                            </h5>
                        </CardHeader>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: '10px 20px 10px 20px' }}>
                            <FormGroup >
                                <Label check for="pieStartDate">Start Date</Label>
                                <Input value={pieStartDate} onChange={(e) => setPieStartDate((e.target.value))} type="date" id="pieStartDate" style={{ width: "150px" }} />
                            </FormGroup>
                            <FormGroup >
                                <Label check for="pieEndDate">End Date</Label>
                                <Input value={pieEndDate} onChange={(e) => setPieEndDate(e.target.value)} type="date" id="pieEndDate" style={{ width: "150px" }} />
                            </FormGroup>
                        </div>

                        <CardBody style={{ display: "flex", flexDirection: "column", marginTop: "" }}>
                            <ReactApexChart
                                series={[ordersPie.deliveredOrders, ordersPie.cancelledOrders, ordersPie.returnedOrders]}
                                type="donut"
                                className="apex-charts  "
                                dir="ltr"
                                height={320}
                                options={{
                                    ...donutGraphOptions,
                                    colors: ['#2ab57d', '#ffbf53', '#fd625e'], //he desired color here
                                }}
                            />

                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>


    )
}

export default OrdersOverview