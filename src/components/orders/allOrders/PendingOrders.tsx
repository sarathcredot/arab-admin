import { gql, useQuery } from "@apollo/client";
import { capitalCase } from "change-case";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Col,
    Collapse,
    Form, FormGroup,
    Input,
    Label,
    Row,
    Table
} from "reactstrap";
import { formatCurrency } from "src/utils/formatCurrency";


import { useNavigate } from "react-router-dom";
import Iconify from "src/components/iconify";


interface ShippingAddress {
    _id: string;
    fullname: string;
    email: string;
    mobile: string;
    country: string;
    state: string;
    city: string;
    address: string;
    address2: string;
    postCode: string;
    landmark: string;
    alternateMobile: string;
}

interface OrderPriceInfo {
    totalMRP: number;
    totalSellingPrice: number;
    totalShippingCharge: number;
    totalRefundAmount: number;
}

interface Order {
    _id: string;
    orderId: string;
    userId: string;
    paymentMode: string;
    orderDate: string;
    orderStatus: string;
    username: string;
    shippingAddress: ShippingAddress;
    orderPriceInfo: OrderPriceInfo;
}

interface FormState {
    _id: string;
    startDate: string;
    endDate: string;
    paymentMode: string;
    userId: string;
    orderId: string;
}
interface FilterData {
    _id: string;
    startDate: string;
    endDate: string;
    paymentMode: string;
    userId: string;
    orderId: string;

}


const PendingOrders = () => {

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [orders, setOrders] = useState<Order[]>([]);
    const pageSize = 10;
    const [maxRecords, setMaxRecords] = useState<number>(0);
    const [isOpen, setIsOpen] = useState<boolean>(false);


    const [formData, setFormData] = useState<FormState>({
        _id: "",
        startDate: "",
        endDate: "",
        paymentMode: "",
        userId: "",
        orderId: ""

    });
    const [filterData, setFilterData] = useState<FilterData>({
        _id: "",
        startDate: "",
        endDate: "",
        paymentMode: "",
        userId: "",
        orderId: ""
    });


    const navigate = useNavigate();

    const GET_ORDERS = gql`
    query GetAdminOrders($input: GetAdminOrdersInput!) {
    getAdminOrders(input: $input) {
    maxRecords,
    records {
      _id
      orderId
      userId
      paymentMode
      orderDate
      orderStatus
      username
      shippingAddress {
        _id
        fullname
        email
        mobile
        country
        state
        city
        address
        address2
        postCode
        landmark
        alternateMobile
      }
      orderPriceInfo {
        totalMRP
        totalSellingPrice
        totalShippingCharge
        totalRefundAmount
      }
    }
  }
}
`;

    const {
        loading: ordersLoading,
        error: ordersError,
        data: ordersDataResponse,
        refetch: ordersRefetch,
    } = useQuery(GET_ORDERS, {
        variables: {
            input: {
                page: currentPage,
                size: pageSize,
                orderId: filterData.orderId || searchTerm,
                orderStatus: "PENDING",
                ...(filterData._id && { _id: filterData._id }),
                ...(filterData.userId && { userId: filterData.userId }),
                startDate: filterData.startDate,
                endDate: filterData.endDate,
                paymentMode: filterData.paymentMode,
            },
        },
    });

    const fetchData = async () => {
        try {
            const result = await ordersRefetch({
                input: {
                    page: currentPage,
                    size: pageSize,
                    orderId: filterData.orderId || searchTerm,
                    orderStatus: "PENDING",
                    ...(filterData._id && { _id: filterData._id }),
                    ...(filterData.userId && { userId: filterData.userId }),
                    startDate: filterData?.startDate,
                    endDate: filterData?.endDate,
                    paymentMode: filterData?.paymentMode,

                },
            });
            setOrders(result.data.getAdminOrders.records);
            setMaxRecords(result.data.getAdminOrders.maxRecords);
        } catch (error: any) {
            console.error(error)
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, searchTerm, ordersRefetch, ordersLoading, filterData]);


    const totalPages = Math.ceil(maxRecords / pageSize);

    const handleSearch = (event: any) => {
        setSearchTerm(event.target.value);
    };


    const toggle = () => setIsOpen(!isOpen);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFilterData(formData)
    };


    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "30px", marginTop: "30px" }}>
            <Row style={{ display: "flex", alignItems: "center", }}>
                <Col xs={11} style={{ display: "flex", gap: "20px", }}>
                    <Input
                        type="text"
                        placeholder="Search by Order Id"
                        value={searchTerm}
                        onChange={handleSearch}
                        style={{ width: "30%" }}
                    />

                </Col>
                <Col xs={1} style={{ display: "flex", gap: "20px", }}>
                    <Button onClick={toggle} style={{ width: "100%", display: "flex", gap: "5px", alignItems: "center", justifyContent: "center", background: "black" }} >
                        <Iconify icon="foundation:filter" />
                        Filters
                    </Button>

                </Col>
                <Collapse isOpen={isOpen} style={{ marginTop: '20px', }}>
                    <Card>
                        <CardBody>
                            <CardTitle><h4 style={{ marginBottom: "20px" }}>Filters</h4></CardTitle>
                            <Form onSubmit={handleSubmit}>
                                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
                                    <div>
                                        <FormGroup>
                                            <Label for="orderId">Order ID</Label>
                                            <Input
                                                type="text"
                                                name="orderId"
                                                id="orderId"
                                                value={formData.orderId}
                                                onChange={handleChange}
                                            />
                                        </FormGroup>
                                    </div>
                                    <div>
                                        <FormGroup>
                                            <Label for="startDate">Start Date</Label>
                                            <Input
                                                type="date"
                                                name="startDate"
                                                id="startDate"
                                                value={formData.startDate}
                                                onChange={handleChange}

                                            />
                                        </FormGroup>
                                    </div>
                                    <div>
                                        <FormGroup>
                                            <Label for="endDate">End Date</Label>
                                            <Input
                                                type="date"
                                                name="endDate"
                                                id="endDate"
                                                value={formData.endDate}
                                                onChange={handleChange}

                                            />
                                        </FormGroup>
                                    </div>
                                    <div>
                                        <FormGroup>
                                            <Label for="paymentMode">Payment Mode</Label>
                                            <Input
                                                type="select"
                                                name="paymentMode"
                                                id="paymentMode"
                                                value={formData.paymentMode}
                                                onChange={handleChange}

                                            >
                                                <option value="">Select Payment Mode</option>
                                                <option value="COD">COD</option>
                                                {/* <option value="ONLINE">ONLINE</option> */}
                                            </Input>
                                        </FormGroup>
                                    </div>

                                    <div>
                                        <FormGroup>
                                            <Label for="userId">User ID</Label>
                                            <Input
                                                type="text"
                                                name="userId"
                                                id="userId"
                                                value={formData.userId}
                                                onChange={handleChange}

                                            />
                                        </FormGroup>
                                    </div>
                                </div>
                                <Button color="primary" type="submit">Apply Filters</Button>
                            </Form>
                        </CardBody>
                    </Card>
                </Collapse>

            </Row>
            <Card>
                <CardBody>

                    <Table
                        responsive
                        className="table table-bordered table-centered mb-0"
                    >
                        <thead>
                            <tr>
                                <th>No</th>
                                <th> Order Date</th>

                                <th>Order Id</th>
                                <th>Username</th>
                                <th>Payment Mode</th>
                                <th>Order Status</th>
                                <th>Address</th>
                                <th>Amount</th>
                                <th>View</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, index) => (
                                <tr key={order._id}>
                                    <td> {currentPage * pageSize + index + 1}</td>
                                    <td>{moment(order.orderDate).format("ll")}</td>
                                    <td>{order.orderId}</td>
                                    <td>{order.username && capitalCase(order.username)}</td>
                                    <td>{order.paymentMode}</td>
                                    <td>
                                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                            <div style={{
                                                width: "8px", height: "8px", borderRadius: "50%",
                                                background: order?.orderStatus === "PENDING" ? "#ff9500" : (order.orderStatus === "IN_PROGRESS" ? "#fff200" : "green")
                                            }} />
                                            {order.orderStatus.replace("_", " ")}
                                        </div>
                                    </td>
                                    <td>  {`${order.shippingAddress["city"]},  ${order.shippingAddress["state"]}`}</td>
                                    <td>
                                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                            <div>
                                                <div>
                                                    Total MRP:
                                                </div>
                                                <div>
                                                    Total Selling:
                                                </div>
                                                <div>
                                                    Total Refund:
                                                </div>
                                                <div>
                                                    Total Shipping :
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                                                <div>
                                                    {formatCurrency(order.orderPriceInfo.totalMRP)}
                                                </div>
                                                <div>
                                                    {formatCurrency(order.orderPriceInfo.totalSellingPrice)}
                                                </div>
                                                <div>
                                                    {formatCurrency(order.orderPriceInfo.totalRefundAmount)}
                                                </div>
                                                <div>
                                                    {formatCurrency(order.orderPriceInfo.totalShippingCharge)}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><Button size="sm" onClick={() => navigate(`/orders/details?orderId=${order.orderId}`)} style={{ background: "#b12349" }}>View</Button></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </CardBody>
                <Row>
                    <Col>
                        <div className="d-flex justify-content-end mt-0 me-3">
                            <ul className="pagination">
                                <li
                                    className={`page-item ${currentPage === 0 ? "disabled" : ""
                                        }`}
                                >
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
                                        className={`page-item ${currentPage === index ? "active" : ""
                                            }`}
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
                                    <li
                                        className={`page-item ${currentPage === totalPages - 1 ? "disabled" : ""
                                            }`}
                                    >
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
            </Card>
        </div>
    )
}

export default PendingOrders