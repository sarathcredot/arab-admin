import { gql, useMutation, useQuery } from "@apollo/client";
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
import { toast } from "react-toastify";
import ProductOrdersFilters from "../ShippingOrdersFilters";
import Loader from "src/components/Common/Loader";




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
    orderDate: string;
    orderStatus: string;
    username: string;
    productId?: ObjectId;
    productName?: string;
    skuId?: string;
    mrp?: number;
    sellingPrice?: number;
    shippingCharge?: number;
    paymentStatus?: string;
    shippingStatus?: string;
    shippedDate?: Date;
    deliveryDate?: Date;
    refundAmount?: number;
    invoiceNumber?: string;
    cancelledDate?: string;
    image?: FileData;
    invoice?: FileData;
}

type ObjectId = string;

interface FormState {
    _id: string;
    shippingStartDate: string;
    shippingEndDate: string;
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
    shippingStartDate: string;
    shippingEndDate: string;
    paymentMode: string;
    userId: string;
    productId: string;
    skuId: string;
    paymentStatus: string;
    shippingStatus: string;
    courierId: string;
    invoiceNumber: string;
    sort: string;
    orderId: string,
    itemId: string
}



const CancelledOrders = () => {

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [orders, setOrders] = useState<Order[]>([]);
    const pageSize = 10;
    const [maxRecords, setMaxRecords] = useState<number>(0);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const [formData, setFormData] = useState<FormState>({
        _id: "",
        shippingStartDate: "",
        shippingEndDate: "",
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
        shippingStartDate: "",
        shippingEndDate: "",
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
    query GetAdminShippingProducts($input: GetAdminShippingProductsInput!) {
    getAdminShippingProducts(input: $input) {
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
        fetchPolicy: "network-only",
        variables: {
            input: {
                page: currentPage,
                size: pageSize,
                shippingStatus: "CANCELED",
                sort: "Cancel",
                orderId: searchTerm,
                ...((filterData._id) && { _id: filterData._id }),
                ...((filterData.itemId) && { itemId: filterData.itemId }),
                ...((filterData.productId) && { productId: filterData.productId }),
                ...((filterData.skuId) && { skuId: filterData.skuId }),
                ...((filterData.paymentMode) && { paymentMode: filterData.paymentMode }),
                ...((filterData.paymentStatus) && { paymentStatus: filterData.paymentStatus }),
                ...((filterData.shippingStatus) && { shippingStatus: filterData.shippingStatus }),
                ...((filterData.shippingStartDate) && { cancelledStartDate: filterData.shippingStartDate }),
                ...((filterData.shippingEndDate) && { cancelledEndDate: filterData.shippingEndDate }),
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
                    shippingStatus: "CANCELED",
                    sort: "Cancel",
                    orderId: searchTerm || filterData.orderId,
                    ...((filterData._id) && { _id: filterData._id }),
                    ...((filterData.itemId) && { itemId: filterData.itemId }),
                    ...((filterData.productId) && { productId: filterData.productId }),
                    ...((filterData.skuId) && { skuId: filterData.skuId }),
                    ...((filterData.paymentMode) && { paymentMode: filterData.paymentMode }),
                    ...((filterData.paymentStatus) && { paymentStatus: filterData.paymentStatus }),
                    ...((filterData.shippingStatus) && { shippingStatus: filterData.shippingStatus }),
                    ...((filterData.shippingStartDate) && { cancelledStartDate: filterData.shippingStartDate }),
                    ...((filterData.shippingEndDate) && { cancelledEndDate: filterData.shippingEndDate }),
                    ...((filterData.courierId) && { courierId: filterData.courierId }),
                    ...((filterData.invoiceNumber) && { invoiceNumber: filterData.invoiceNumber }),
                },
            });
            setOrders(result.data.getAdminShippingProducts.records);
            setMaxRecords(result.data.getAdminShippingProducts.maxRecords);
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
mutation ExportAdminShippingProducts($input: ExportAdminShippingProductsInput!) {
exportAdminShippingProducts(input: $input) {
message
}
}`;

    const [ExportAdminOrders] = useMutation(EXPORT_ORDERS);

    const handleExportClick = async () => {
        try {
            const result = await ExportAdminOrders({
                variables: {
                    input: {
                        shippingStatus: "CANCELED",
                        sort: "Cancel",
                        orderId: searchTerm || filterData.orderId,
                        ...((filterData._id) && { _id: filterData._id }),
                        ...((filterData.itemId) && { itemId: filterData.itemId }),
                        ...((filterData.productId) && { productId: filterData.productId }),
                        ...((filterData.skuId) && { skuId: filterData.skuId }),
                        ...((filterData.paymentMode) && { paymentMode: filterData.paymentMode }),
                        ...((filterData.paymentStatus) && { paymentStatus: filterData.paymentStatus }),
                        ...((filterData.shippingStatus) && { shippingStatus: filterData.shippingStatus }),
                        ...((filterData.shippingStartDate) && { cancelledStartDate: filterData.shippingStartDate }),
                        ...((filterData.shippingEndDate) && { cancelledEndDate: filterData.shippingEndDate }),
                        ...((filterData.courierId) && { courierId: filterData.courierId }),
                        ...((filterData.invoiceNumber) && { invoiceNumber: filterData.invoiceNumber }),
                    }
                }
            })

            if (result.data.exportAdminShippingProducts) {
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
    };

    return (
        <div>
            <Row style={{ display: "flex", alignItems: "center", margin: "20px 0px" }}>
                <Col xs={9} style={{ display: "flex", gap: "20px", }}>
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
                <Collapse isOpen={isOpen} style={{ marginTop: '20px' }}>
                    <ProductOrdersFilters onSubmit={handleFormSubmit} />

                </Collapse>

            </Row>

            <Card>
                <CardBody>
                    <div>
                        {
                            ordersLoading ? <Loader />
                                :
                                <Table id="tech-companies-1" className="table table-striped table-bordered">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Cancelled Date</th>
                                            <th>Id</th>
                                            <th>Username</th>
                                            <th>Product</th>
                                            <th>Payment Mode</th>
                                            <th>Payment Status</th>
                                            <th>Amount</th>
                                            <th>View</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders?.map((order, index) => (
                                            <tr key={order?._id}>
                                                <td> {currentPage * pageSize + index + 1}</td>
                                                <td>{moment(order?.cancelledDate).format("ll")}</td>
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
                                                <td>{order?.username && capitalCase(order?.username)}</td>

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
                                                <td><div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                                    <div style={{
                                                        width: "8px", height: "8px", borderRadius: "50%",
                                                        background: order?.paymentStatus === "PENDING" ? "#ff9500" : (order?.paymentStatus === "IN_PROGRESS" ? "#fff200" : "green")
                                                    }} />
                                                    {order?.paymentStatus?.replace("_", " ")}
                                                </div>
                                                </td>
                                                <td>
                                                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                                        <div>
                                                            {/* <div>
                                                     MRP:
                                                    </div> */}
                                                            <div>
                                                                Selling:
                                                            </div>
                                                            {/* <div>
                                                    Refund:
                                                </div> */}
                                                            <div>
                                                                Shipping :
                                                            </div>
                                                        </div>
                                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                                                            {/* <div>
                                                    {formatCurrency(order.mrp)}
                                                </div> */}
                                                            <div>
                                                                {formatCurrency(order?.sellingPrice)}
                                                            </div>
                                                            {/* <div>
                                                    {formatCurrency(order.refundAmount)}
                                                </div> */}
                                                            <div>
                                                                {formatCurrency(order?.shippingCharge)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td><Button size="sm" color="primary" onClick={() => navigate(`/shipping-orders/details?orderId=${order?.orderId}&_id=${order?._id}`)}>View</Button></td>
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

export default CancelledOrders