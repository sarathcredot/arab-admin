import React, { useEffect, useState } from 'react'
import { Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Row } from 'reactstrap'
import SummaryCard from './SummaryCard'
import ReactApexChart from 'react-apexcharts'
import CountUp from "react-countup";
import { gql, useQuery } from '@apollo/client';
import { ApexOptions } from 'apexcharts';
import moment from 'moment';

interface UserData {
    totalVendors: number;
    activeVendors: number;
    blockedVendors: number;
    todayVendors: number;
    weekVendors: number;
    monthVendors: number;
    yearVendors: number;
}

interface DashboardUsersGraphResponse {
    y1: number[];
    x: string[];
}


function VendorsOverview() {
    const [usersCounts, setUsersCounts] = useState<UserData>({
        totalVendors: 0,
        activeVendors: 0,
        blockedVendors: 0,
        todayVendors: 0,
        weekVendors: 0,
        monthVendors: 0,
        yearVendors: 0,
    });

    const [usersGraph, setUsersGraph] = useState<DashboardUsersGraphResponse>({
        y1: [],
        x: [],

    });

    const [selectedType, setSelectedType] = useState<string>("DAY");
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState(moment().format('YYYY-MM-DD'));



    useEffect(() => {
        let startDate;
        switch (selectedType) {
            case "DAY":
                startDate = moment().subtract(2, 'weeks').format('YYYY-MM-DD');
                break;
            case "WEEK":
                startDate = moment().subtract(2, 'months').format('YYYY-MM-DD');
                break;
            case "MONTH":
                startDate = moment().subtract(6, 'months').format('YYYY-MM-DD');
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

    const options: ApexOptions = {
        chart: {
            height: 190,
            type: "line",
            toolbar: { show: false },
            sparkline: {
                enabled: false
            },
            animations: { enabled: true },
            foreColor: "#999",

        },
        colors: ["#b12349"],
        stroke: {
            curve: "smooth",
            width: 2,
        },
        xaxis: {
            categories: usersGraph?.x,
            labels: {
                show: true,
                formatter: function (val: string) {
                    return val
                }
            },
            axisTicks: {
                show: false,
            },
            axisBorder: {
                show: false,
            },
        },
        yaxis: {
            labels: {
                show: true,
            },
        },
        tooltip: {
            fixed: {
                enabled: false,
            },
            x: {
                show: true,
            },
            y: {
                title: {
                    formatter: function (seriesName) {
                        return "";
                    },
                },
                formatter: function (val: any) {
                    const intValue = parseInt(val);

                    if (intValue === 1) {
                        return intValue.toString() + " user";
                    } else {
                        return intValue.toString() + " users";
                    }
                }
            },
            marker: {
                show: false,
            },
        },
    };


    const GET_USERS_COUNTS = gql` 
  query GetDashboardVendorsSummary {
  getDashboardVendorsSummary {
    totalVendors
    activeVendors
    blockedVendors
    todayVendors
    weekVendors
    monthVendors
    yearVendors
  }
}
    `;

    const { data: usersCountsData, refetch: usersCountRefetch } = useQuery(GET_USERS_COUNTS)

    useEffect(() => {
        if (usersCountsData && usersCountsData?.getDashboardVendorsSummary) {
            setUsersCounts(usersCountsData?.getDashboardVendorsSummary)
        }
    }, [usersCountsData, usersCountRefetch]);



    const GET_USERS_GRAPH = gql` 
  query GetDashboardVendorsGraph($input: GetDashboardVendorsGraphInput!) {
  getDashboardVendorsGraph(input: $input) {
    y1
    x
  }
}
    `;

    const { data: usersGraphData, refetch: usersGraphRefetch } = useQuery(GET_USERS_GRAPH, {
        variables: {
            input: {
                "startDate": startDate,
                "endDate": endDate,
                "graphType": selectedType
            }
        }
    })

    useEffect(() => {
        if (usersGraphData && usersGraphData?.getDashboardVendorsGraph) {
            setUsersGraph(usersGraphData?.getDashboardVendorsGraph)
        }
    }, [usersGraphData, usersGraphRefetch, selectedType]);



    return (
        <>
            <Row>
                <Col xs={12} sm={4} xl={2}>
                    <SummaryCard title="Active Vendors" icon="mdi:user" total={usersCounts?.activeVendors ?? 0} />
                </Col>
                <Col xs={12} sm={4} xl={2}>
                    <SummaryCard title="Blocked Vendors" icon="mdi:user-block" total={usersCounts?.blockedVendors ?? 0} />
                </Col>
                <Col xs={12} sm={4} xl={2}>
                    <SummaryCard title="Joined Today" icon="vaadin:calendar-user" total={usersCounts?.todayVendors ?? 0} />
                </Col>
                <Col xs={12} sm={4} xl={2}>
                    <SummaryCard title="Joined This Week" icon="vaadin:calendar-user" total={usersCounts?.weekVendors ?? 0} />
                </Col>
                <Col xs={12} sm={4} xl={2}>
                    <SummaryCard title="Joined This Month" icon="vaadin:calendar-user" total={usersCounts?.monthVendors ?? 0} />
                </Col>
                <Col xs={12} sm={4} xl={2}>
                    <SummaryCard title="Total Vendors" icon="fa-solid:users" total={usersCounts?.totalVendors ?? 0} />
                </Col>
            </Row>

            <Row>
                <Col xs={12}>
                    <Card className="card-h-100" style={{ height: "400px", width: "100%", borderRadius: "7px", borderColor: "1px solid #F9F9F9", boxShadow: "1px solid #F9F9F9" }}>
                        <CardHeader>
                            <h5>
                                Vendors
                            </h5>
                        </CardHeader>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: '10px 20px 10px 20px' }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "340px" }}>
                                <FormGroup >
                                    <Label check >Start Date</Label>
                                    <Input value={startDate} onChange={(e) => setStartDate((e.target.value))} type="date" id="startDate" style={{ width: "150px" }} />
                                </FormGroup>
                                <FormGroup >
                                    <Label check >End Date</Label>
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
                        <CardBody style={{ display: "flex", flexDirection: "column", padding: "10px" }}>
                            <ReactApexChart
                                series={[{ data: usersGraph?.y1 }]}
                                type="line"
                                // className="apex-charts"
                                dir="ltr"
                                height={190}
                                options={options}
                            />

                        </CardBody>
                    </Card>
                </Col>

            </Row >
        </>
    )
}

export default VendorsOverview