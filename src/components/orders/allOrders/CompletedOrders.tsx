import { gql, useMutation, useQuery } from "@apollo/client";
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
import { toast } from "react-toastify";
import AllOrderFilters from "../AllOrderFilters";
import Loader from "src/components/Common/Loader";
import CustomButton from "src/components/Common/CustomButton";


interface ShippingAddress {
    _id: string;
    firstname: string;
    email: string;
    mobile: string;
    streetName: string;
    city: string;
    houseNumber: string;
    country: string;
    postCode: string;
    apartment?: string; // Optional field
    suite?: string; // Optional field
    unit?: string; // Optional field
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
    vendorId: string; // Added vendorId
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


const CompletedOrders = () => {

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
    maxRecords
    records {
      _id
      orderId
      userId
      vendorId
      paymentMode
      orderDate
      orderStatus
      username
      shippingAddress {
        _id
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
        fetchPolicy: "network-only",
        variables: {
            input: {
                page: currentPage,
                size: pageSize,
                orderId: filterData.orderId || searchTerm,
                orderStatus: "COMPLETED",
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
                    orderStatus: "COMPLETED",
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

    // EXPORT 

    const EXPORT_ORDERS = gql`
      mutation ExportAdminOrders($input: ExportAdminOrdersInput!) {
         exportAdminOrders(input: $input) {
           message
         }
       }`;

    const [ExportAdminOrders] = useMutation(EXPORT_ORDERS);

    const handleExportClick = async () => {
        try {
            const result = await ExportAdminOrders({
                variables: {
                    input: {
                        orderId: filterData.orderId || searchTerm,
                        orderStatus: "COMPLETED",
                        ...(filterData._id && { _id: filterData._id }),
                        ...(filterData.userId && { userId: filterData.userId }),
                        startDate: filterData?.startDate,
                        endDate: filterData?.endDate,
                        paymentMode: filterData?.paymentMode,
                    }
                }
            })

            if (result.data.exportAdminOrders) {
                toast.success("Export Successfull")
            }
        } catch (error: any) {
            toast.success(error)
            console.log(error)
        }
    }

    const handleFormSubmit = (formData: FilterData) => {
        setFilterData(formData);
        setCurrentPage(0);
        fetchData();
    };

    const [copiedIndex, setCopiedIndex] = useState(null);
    const [copiedPage, setCopiedPage] = useState(0);
    const copyToClipboard = (text: any, index: any) => {

        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setCopiedPage(currentPage);
    }
    const items = [
        { text: "Dashboard", link: `/` },
    ];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "30px", marginTop: "30px" }}>
            <Row style={{ display: "flex", alignItems: "center", }}>
                <Col xs={9} style={{ display: "flex", gap: "20px", }}>
                    <Input
                        type="text"
                        placeholder="Search by Order Id"
                        value={searchTerm}
                        onChange={handleSearch}
                        style={{ width: "30%" }}
                    />

                </Col>
                <Col xs={3} style={{ display: "flex", gap: "20px", justifyContent: "flex-end" }}>

                    <Button onClick={handleExportClick} outline color="primary" style={{ width: "100px", display: "flex", gap: "5px", alignItems: "center", justifyContent: "center", }} >
                        <Iconify icon="ph:export-bold" />
                        Export
                    </Button>
                    <Button onClick={toggle} style={{ background: "black", width: "100px", display: "flex", gap: "5px", alignItems: "center", justifyContent: "center", }} >
                        <Iconify icon="foundation:filter" />
                        Filters
                    </Button>

                </Col>
                <Collapse isOpen={isOpen} style={{ marginTop: '20px', }}>
                    <AllOrderFilters onSubmit={handleFormSubmit} />

                </Collapse>

            </Row>
            <Card>
                <CardBody>
                    <div>
                        {
                            ordersLoading ?
                                <Loader />
                                :
                                <Table id="tech-companies-1" className="table table-striped table-bordered">
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
                                                <td>
                                                    {
                                                        order?.username &&
                                                        <div style={{ display: "flex", gap: "10px", alignItems: "center", justifyContent: "space-between" }}>
                                                            {order?.username && capitalCase(order?.username)}
                                                            <CustomButton outline disabled={copiedPage === currentPage && copiedIndex === index}
                                                                name=""
                                                                onClick={() => copyToClipboard(order.userId, index)}
                                                                icon="mingcute:copy-line" style={{
                                                                    display: "flex",
                                                                    flexDirection: "row",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    backgroundColor: "black",
                                                                    color: "white",
                                                                    width: "30px",
                                                                    height: "30px",
                                                                    borderRadius: "50%    ",
                                                                    gap: "5px",
                                                                    fontSize: "10px",
                                                                    border: "none",
                                                                }} />
                                                        </div>
                                                    }
                                                </td>
                                                <td>{order.paymentMode}</td>
                                                <td><div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                                    <div style={{
                                                        width: "8px", height: "8px", borderRadius: "50%",
                                                        background: order?.orderStatus === "PENDING" ? "#ff9500" : (order.orderStatus === "IN_PROGRESS" ? "#fff200" : "green")
                                                    }} />
                                                    {order.orderStatus.replace("_", " ")}
                                                </div>
                                                </td>
                                                <td>  {`${order.shippingAddress["streetName"]},  ${order.shippingAddress["city"]}`}</td>
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
                                                <td><Button size="sm" onClick={() => navigate(`/orders/details?orderId=${order.orderId}`)} color="primary">View</Button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                        }
                    </div>
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

export default CompletedOrders