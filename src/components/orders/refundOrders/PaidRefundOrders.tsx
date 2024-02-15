import { gql, useQuery } from "@apollo/client";
import { capitalCase } from "change-case";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
    Button,
    Card,
    CardBody,
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




interface FileData {
    fileType: string;
    fileURL: string;
    mimeType: string;
    originalName: string;
}

interface Order {
    _id: string;
    orderId: string;
    itemId: string;
    userId: string;
    paymentMode: string;
    orderStatus: string;
    username: string;
    refundComment: string;
    productId?: ObjectId;
    productName?: string;
    skuId?: string;
    refundStatus: string;
    mrp?: number;
    sellingPrice?: number;
    shippingCharge?: number;
    paymentStatus?: string;
    deliveryDate?: Date;
    refundAmount?: number;
    invoiceNumber?: string;
    image?: FileData;
    invoice?: FileData;
    refundDate: string;
    refundRequestDate: string;
}

type ObjectId = string;

interface FormState {
    _id: string;
    refundRequestStartDate: string;
    refundRequestEndDate: string;
    paymentMode: string;
    userId: string;
    productId: string;
    skuId: string;
    paymentStatus: string;
    shippingStatus: string;
    courierId: string;
    invoiceNumber: string;
    sort: string;
    orderId: string;
    itemId: string;

}

interface FilterData {
    _id: string;
    refundRequestStartDate: string;
    refundRequestEndDate: string;
    paymentMode: string;
    userId: string;
    productId: string;
    skuId: string;
    paymentStatus: string;
    shippingStatus: string;
    courierId: string;
    invoiceNumber: string;
    sort: string;
    orderId: string;
    itemId: string;
}



const PaidRefundOrders = () => {

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [orders, setOrders] = useState<Order[]>([]);
    const pageSize = 10;
    const [maxRecords, setMaxRecords] = useState<number>(0);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const [formData, setFormData] = useState<FormState>({
        _id: "",
        refundRequestStartDate: "",
        refundRequestEndDate: "",
        paymentMode: "",
        userId: "",
        productId: "",
        skuId: "",
        paymentStatus: "",
        shippingStatus: "",
        courierId: "",
        invoiceNumber: "",
        sort: "",
        orderId: "",
        itemId: "",

    });

    const [filterData, setFilterData] = useState<FilterData>({
        _id: "",
        refundRequestStartDate: "",
        refundRequestEndDate: "",
        paymentMode: "",
        userId: "",
        productId: "",
        skuId: "",
        paymentStatus: "",
        shippingStatus: "",
        courierId: "",
        invoiceNumber: "",
        sort: "",
        orderId: "",
        itemId: "",
    });

    const navigate = useNavigate();

    const GET_ORDERS = gql`
    query GetAdminRefundProducts($input: GetAdminRefundProductsInput!) {
        getAdminRefundProducts(input: $input) {
    maxRecords,
     records {
        _id
      userId
      productId
      orderId
      itemId
      productName
      shortDescription
      skuId
      image {
        fileType
        fileURL
        mimeType
        originalName
      }
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
      invoice {
        fileType
        fileURL
        mimeType
        originalName
      }
      username
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
                orderId: searchTerm,
                returnStatus: "PAID",
                sort: "Paid",
                ...((filterData._id) && { _id: filterData._id }),
                ...((filterData.itemId) && { itemId: filterData.itemId }),
                ...((filterData.productId) && { productId: filterData.productId }),
                ...((filterData.skuId) && { skuId: filterData.skuId }),
                ...((filterData.paymentMode) && { paymentMode: filterData.paymentMode }),
                ...((filterData.paymentStatus) && { paymentStatus: filterData.paymentStatus }),
                ...((filterData.refundRequestStartDate) && { refundRequestStartDate: filterData.refundRequestStartDate }),
                ...((filterData.refundRequestEndDate) && { refundRequestEndDate: filterData.refundRequestEndDate }),
                ...((filterData.courierId) && { courierId: filterData.courierId }),
                ...((filterData.invoiceNumber) && { invoiceNumber: filterData.invoiceNumber }),
            },
        },
    });

    const fetchData = async () => {
        try {
            const result = await ordersRefetch({
                input: {
                    page: currentPage,
                    size: pageSize,
                    orderId: searchTerm || filterData.orderId,
                    refundStatus: "PAID",
                    sort: "Paid",
                    ...((filterData._id) && { _id: filterData._id }),
                    ...((filterData.itemId) && { itemId: filterData.itemId }),
                    ...((filterData.productId) && { productId: filterData.productId }),
                    ...((filterData.skuId) && { skuId: filterData.skuId }),
                    ...((filterData.paymentMode) && { paymentMode: filterData.paymentMode }),
                    ...((filterData.paymentStatus) && { paymentStatus: filterData.paymentStatus }),
                    ...((filterData.refundRequestStartDate) && { refundRequestStartDate: filterData.refundRequestStartDate }),
                    ...((filterData.refundRequestEndDate) && { refundRequestEndDate: filterData.refundRequestEndDate }),
                    ...((filterData.courierId) && { courierId: filterData.courierId }),
                    ...((filterData.invoiceNumber) && { invoiceNumber: filterData.invoiceNumber }),
                },
            });
            setOrders(result.data.getAdminRefundProducts.records);
            setMaxRecords(result.data.getAdminRefundProducts.maxRecords);
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
        <div>
            <Row style={{ display: "flex", alignItems: "center", margin: "20px 0px" }}>
                <Col xs={11} style={{ display: "flex", gap: "20px", }}>
                    <Row style={{ width: "100%" }}>
                        <Col xl={4}>

                            <Input
                                type="text"
                                placeholder="Search by Order Id"
                                value={searchTerm}
                                onChange={handleSearch}
                                style={{ width: "100%" }}
                            />
                        </Col>
                        <Col xl={4}>
                        </Col>
                    </Row>

                </Col>
                <Col xl={1} style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button onClick={toggle} style={{ width: "100%", display: "flex", gap: "5px", alignItems: "center", justifyContent: "center", background: "black" }} >
                        <Iconify icon="foundation:filter" />
                        Filters
                    </Button>

                </Col>
                <Collapse isOpen={isOpen} style={{ marginTop: '20px' }}>
                    <Card>
                        <CardBody>
                            <CardTitle><h4 style={{ marginBottom: "20px" }}>Filters</h4></CardTitle>
                            <Form onSubmit={handleSubmit}>
                                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
                                    <div style={{ width: "200px" }}>
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

                                    <div style={{ width: "200px" }}>
                                        <FormGroup>
                                            <Label for="itemId">Item ID</Label>
                                            <Input
                                                type="text"
                                                name="itemId"
                                                id="itemId"
                                                value={formData.itemId}
                                                onChange={handleChange}
                                            />
                                        </FormGroup>
                                    </div>
                                    <div style={{ width: "200px" }}>
                                        <FormGroup>
                                            <Label for="courierId">Courier ID</Label>
                                            <Input
                                                type="text"
                                                name="courierId"
                                                id="courierId"
                                                value={formData.courierId}
                                                onChange={handleChange}
                                            />
                                        </FormGroup>
                                    </div>
                                    <div style={{ width: "200px" }}>
                                        <FormGroup>
                                            <Label for="invoiceNumber">Invoice Number</Label>
                                            <Input
                                                type="text"
                                                name="invoiceNumber"
                                                id="invoiceNumber"
                                                value={formData.invoiceNumber}
                                                onChange={handleChange}
                                            />
                                        </FormGroup>
                                    </div>

                                    <div style={{ width: "200px" }}>
                                        <FormGroup>
                                            <Label for="skuId">SKU ID</Label>
                                            <Input
                                                type="text"
                                                name="skuId"
                                                id="skuId"
                                                value={formData.skuId}
                                                onChange={handleChange}
                                            />
                                        </FormGroup>
                                    </div>

                                </div>

                                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>

                                    <div style={{ width: "200px" }}>
                                        <FormGroup>
                                            <Label for="productId">Product ID</Label>
                                            <Input
                                                type="text"
                                                name="productId"
                                                id="productId"
                                                value={formData.productId}
                                                onChange={handleChange}
                                            />
                                        </FormGroup>
                                    </div>


                                    <div style={{ width: "200px" }}>
                                        <FormGroup>
                                            <Label for="paymentStatus">Payment Status</Label>
                                            <Input
                                                type="select"
                                                name="paymentStatus"
                                                id="paymentStatus"
                                                value={formData.paymentStatus}
                                                onChange={handleChange}
                                            >
                                                <option value="">All</option>
                                                <option value="PENDING">PENDING</option>
                                                <option value="COMPLETED">COMPLETED</option>
                                            </Input>
                                        </FormGroup>
                                    </div>


                                    <div style={{ width: "200px" }}>
                                        <FormGroup>
                                            <Label for="refundRequestStartDate">Start Date</Label>
                                            <Input
                                                type="date"
                                                name="refundRequestStartDate"
                                                id="refundRequestStartDate"
                                                value={formData.refundRequestStartDate}
                                                onChange={handleChange}
                                            />
                                        </FormGroup>
                                    </div>
                                    <div style={{ width: "200px" }}>
                                        <FormGroup>
                                            <Label for="refundRequestEndDate">End Date</Label>
                                            <Input
                                                type="date"
                                                name="refundRequestEndDate"
                                                id="refundRequestEndDate"
                                                value={formData.refundRequestEndDate}
                                                onChange={handleChange}
                                            />
                                        </FormGroup>
                                    </div>
                                    <div style={{ width: "200px" }}>
                                        <FormGroup >
                                            <Label for="paymentMode">Payment Mode</Label>
                                            <Input
                                                type="select"
                                                name="paymentMode"
                                                id="paymentMode"
                                                value={formData.paymentMode}
                                                onChange={handleChange}
                                            >
                                                <option value="">All</option>
                                                <option value="COD">COD</option>
                                                {/* <option value="ONLINE">ONLINE</option> */}
                                            </Input>
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
                                <th>Requested On</th>
                                <th>Refund Date</th>
                                <th>Order Id</th>
                                <th>Username</th>
                                <th>Product</th>
                                <th>Payment Mode</th>
                                <th>Amount</th>
                                <th>Refund Comment</th>
                                <th>View</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders?.map((order, index) => (
                                <tr key={order?._id}>
                                    <td> {currentPage * pageSize + index + 1}</td>
                                    <td>{moment(order?.refundRequestDate).format("ll")}</td>
                                    <td>{moment(order?.refundDate).format("ll")}</td>
                                    <td>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                            <div>
                                                <p style={{ margin: "0", fontSize: "10px", fontWeight: "500" }}> Order Id :</p>
                                                {<p style={{ fontSize: "14px", margin: "0", }}>{order?.orderId}</p>}
                                            </div>
                                            <div>
                                                <p style={{ margin: "0", fontSize: "10px", fontWeight: '500' }}> Item Id :</p>
                                                {<p style={{ fontSize: "14px", margin: "0", }}>{order?.itemId}</p>}
                                            </div>
                                        </div>
                                    </td>
                                    <td>{capitalCase(order?.username)}</td>

                                    <td>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                            <div>
                                                <img width={"50px"} src={order?.image?.fileURL} />
                                            </div>

                                            <div>
                                                {order?.productName}
                                            </div>
                                        </div>
                                    </td>
                                    <td>{order?.paymentMode}</td>

                                    <td>
                                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                            <div>
                                                {/* <div>
                                                     MRP:
                                                </div> */}
                                                <div>
                                                    Selling:
                                                </div>
                                                <div>
                                                    Shipping :
                                                </div>
                                                <div>
                                                    Refund:
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                                                {/* <div>
                                                    {formatCurrency(order.mrp)}
                                                </div> */}
                                                <div>
                                                    {formatCurrency(order?.sellingPrice)}
                                                </div>
                                                <div>
                                                    {formatCurrency(order?.shippingCharge)}
                                                </div>
                                                <div>
                                                    {formatCurrency(order.refundAmount)}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {order?.refundComment || "null"}
                                    </td>
                                    <td><Button size="sm" color="primary" onClick={() => navigate(`/refund-orders/details?orderId=${order?.orderId}&_id=${order?._id}`)}>View</Button></td>
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

export default PaidRefundOrders