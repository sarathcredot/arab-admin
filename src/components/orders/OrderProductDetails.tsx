import React, { ChangeEvent, useEffect } from "react";
import "cleave.js/dist/addons/cleave-phone.in";
import FeatherIcon from "feather-icons-react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, CardBody, CardHeader, CardImg, CardSubtitle, CardText, CardTitle, Col, Collapse, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";


import { FormGroup, Input, Label } from "reactstrap";


import "cleave.js/dist/addons/cleave-phone.in";
import { useState } from "react";
import { formatCurrency } from "src/utils/formatCurrency";
import moment from "moment";
import Iconify from "../iconify/Iconify";
import { capitalCase } from "change-case";
import { gql, useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { fetchSignedUrl, useFetchSignedUrl } from "src/utils/fetchSignedUrl";
import { number } from "yup";
import CustomButton from "../Common/CustomButton";

interface ProductEditFormData {
    invoiceNumber: string;
    courierId: string;
    paymentStatus: string;
    shippedDate: string | null;
    deliveredDate: string | null;
    canceledDate: string | null;
    returnRequestDate: string | null;
    returnRejectDate: string | null;
    returnDate: string | null;
    refundRequestDate: string | null;
    refundDate: string | null;
    refundAmount: number;
    shippingCharge: number;
}



function OrderProductDetails({ product, orderProdcutsRefetch, orderRefetch }: any) {

    const navigate = useNavigate();

    // [[[[[[  shipping ]]]]]]]]

    const [shippingModal, setShippingModal] = useState(false);
    const [shippingStatus, setShippingStatus] = useState("");
    const [shippedDate, setShippedDate] = useState('');
    const [deliveredDate, setDeliveredDate] = useState('');
    const [canceledDate, setCanceledDate] = useState('');
    const [cancelComment, setCancelComment] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('');

    // [[[[[[  return ]]]]]]]]

    const [returnStatus, setReturnStatus] = useState("");
    const [returnModal, setReturnModal] = useState(false);
    const [returnDate, setReturnDate] = useState('');
    const [returnRejectDate, setReturnRejectDate] = useState('');
    const [returnComment, setReturnComment] = useState('');
    const [returnRequestDate, setReturnRequestDate] = useState('');

    // [[[[[[  refund ]]]]]]]]

    const [refundStatus, setRefundStatus] = useState('');
    const [refundModal, setRefundModal] = useState(false);
    const [refundDate, setRefundDate] = useState('');
    const [refundRequestDate, setRefundRequestDate] = useState('');
    const [refundComment, setRefundComment] = useState('');

    // [[[[[[[[[[ INVOICE ]]]]]]]]]]

    const [invoiceModal, setInvoiceModal] = useState(false);
    const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
    const [invoiceNumber, setInvoiceNumber] = useState("");
    const [signedUrl, setSignedUrl] = useState("");

    // [[[[[[[[[[[[[ COMMENTS ]]]]]]]]]]]]]

    const [commentEditModal, setCommentEditModal] = useState(false);
    const [commentFormData, setCommentFormData] = useState({
        cancelReasonUser: '',
        cancelCommentAdmin: '',
        returnReasonUser: '',
        returnCommentAdmin: '',
        refundCommentAdmin: '',
    });

    // [[[[[[[[[[[[ PRODUCT EDIT ]]]]]]]]]]]]

    const [productEditModal, setProductEditModal] = useState(false);
    const initialProductEditFormData: ProductEditFormData = {
        invoiceNumber: '',
        courierId: '',
        paymentStatus: '',
        shippedDate: null,
        deliveredDate: null,
        canceledDate: null,
        returnRequestDate: null,
        returnRejectDate: null,
        returnDate: null,
        refundRequestDate: null,
        refundDate: null,
        refundAmount: 0,
        shippingCharge: 0,
    };
    const [productEditFormData, setProductEditFormData] = useState<ProductEditFormData>(initialProductEditFormData);



    useEffect(() => {
        setProductEditFormData({
            courierId: product?.courierId,
            invoiceNumber: product?.invoiceNumber,
            paymentStatus: product?.paymentStatus,
            shippedDate: product?.shippedDate ? moment(product.shippedDate).format('YYYY-MM-DD') : null,
            deliveredDate: product?.deliveryDate ? moment(product.deliveryDate).format('YYYY-MM-DD') : null,
            canceledDate: product?.cancelledDate ? moment(product.cancelledDate).format('YYYY-MM-DD') : null,
            returnRequestDate: product?.returnRequestDate ? moment(product.returnRequestDate).format('YYYY-MM-DD') : null,
            returnRejectDate: product?.returnRejectedDate ? moment(product.returnRejectedDate).format('YYYY-MM-DD') : null,
            returnDate: product?.returnDate ? moment(product.returnDate).format('YYYY-MM-DD') : null,
            refundRequestDate: product?.refundRequestDate ? moment(product.refundRequestDate).format('YYYY-MM-DD') : null,
            refundDate: product?.refundDate ? moment(product.refundDate).format('YYYY-MM-DD') : null,
            refundAmount: product?.refundAmount,
            shippingCharge: product?.shippingCharge

        })
    }, [product,])

    useEffect(() => {
        setCommentFormData({
            cancelReasonUser: product?.cancelUserReason,
            cancelCommentAdmin: product?.cancelAdminComment,
            returnReasonUser: product?.returnUserReason,
            returnCommentAdmin: product?.returnAdminComment,
            refundCommentAdmin: product?.refundComment,
        });
    }, [commentEditModal, product])

    useEffect(() => {
        setInvoiceNumber(product?.invoiceNumber);
    }, [product])

    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    const toggleInvoiceModal = () => setInvoiceModal(!invoiceModal);



    // =========================  SHIPPING ================================

    const toggleShippingModal = () => {
        setShippingModal(!shippingModal);
    }

    const handleShippingStatusChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setShippingModal(!shippingModal);
        setShippingStatus(e.target.value)
    }

    const handleShippingStatusSubmit = async () => {

        if (shippingStatus === "SHIPPED") {
            if (!shippedDate) {
                toast.error("Shipped Date is required");
                return;
            }
        }
        if (shippingStatus === "DELIVERED") {
            if (!deliveredDate) {
                toast.error("Delivered Date is required");
                return;
            }
            if (!paymentStatus) {
                toast.error("Payment Status is required");
                return;
            }
        }
        if (shippingStatus === "CANCELED") {
            if (!canceledDate) {
                toast.error("Canceled Date is required");
                return;
            }
            if (!cancelComment) {
                toast.error("Canceled comment is required");
                return;
            }
        }

        try {
            const result = await UpdateProduct({
                variables: {
                    input: {
                        _id: product?._id,
                        shippingStatus: shippingStatus,
                        shippedDate: shippedDate,
                        deliveryDate: deliveredDate,
                        paymentStatus: paymentStatus,
                        cancelledDate: canceledDate,
                        cancelAdminComment: cancelComment
                    },
                },
            });
            if (result.data.updateAdminOrderProduct) {
                orderProdcutsRefetch();
                setShippingModal(!shippingModal);
                orderRefetch();
                toast.success("Shipping Status has been updated")
                setShippedDate("");
                setDeliveredDate("");
                setCanceledDate("");
                setCancelComment("");
                setPaymentStatus("")
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.message);
        }
    }


    // =========================== RETURN =================================

    const toggleReturnModal = () => {
        setReturnModal(!returnModal);
    }

    const handleReturnStatusChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setReturnModal(!returnModal);
        setReturnStatus(e.target.value)
    }

    const handleReturnStatusSubmit = async () => {

        if (returnStatus === "PENDING") {
            if (!returnRequestDate) {
                toast.error("Return Request Date is required");
                return;
            }
        }
        if (returnStatus === "APPROVED") {
            if (!returnDate) {
                toast.error("Return Date is required");
                return;
            }
            if (!returnComment) {
                toast.error("Return comment is required");
                return;
            }
        }
        if (returnStatus === "REJECTED") {
            if (!returnRejectDate) {
                toast.error("Return Reject Date is required");
                return;
            }
            // if (!returnComment) {
            //     toast.error("Return Comment is required");
            //     return;
            // }
        }

        try {
            const result = await UpdateProduct({
                variables: {
                    input: {
                        _id: product?._id,
                        returnStatus: returnStatus,
                        returnRequestDate: returnRequestDate,
                        returnDate: returnDate,
                        returnRejectedDate: returnRejectDate,
                        cancelAdminComment: cancelComment,
                        returnAdminComment: returnComment
                    },
                },
            });
            if (result.data.updateAdminOrderProduct) {
                orderProdcutsRefetch();
                setReturnModal(!returnModal);
                orderRefetch();
                toast.success("Return Status has been updated")
                setReturnComment("");
                setReturnDate("");
                setReturnRejectDate("");
                setReturnRequestDate("");
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.message);
        }
    }

    // =========================== REFUND =====================================

    const toggleRefundModal = () => {
        setRefundModal(!refundModal);
    }

    const handleRefundStatusChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setRefundModal(!refundModal);
        setRefundStatus(e.target.value)
    }

    const handleRefundStatusSubmit = async () => {

        if (refundStatus === "PENDING") {
            if (!refundRequestDate) {
                toast.error("Refund Request Date is required");
                return;
            }
        }
        if (refundStatus === "PAID") {
            if (!refundDate) {
                toast.error("Refund Date is required");
                return;
            }
            if (!refundComment) {
                toast.error("Refund comment is required");
                return;
            }
        }

        try {
            const result = await UpdateProduct({
                variables: {
                    input: {
                        _id: product?._id,
                        refundStatus: refundStatus,
                        refundRequestDate: refundRequestDate,
                        refundDate: refundDate,
                        refundComment: refundComment,
                        refundAmount: product.sellingPrice
                    },
                },
            });
            if (result.data.updateAdminOrderProduct) {
                orderRefetch();
                orderProdcutsRefetch();
                setRefundModal(!refundModal);
                toast.success("Refund Status has been updated")
                setRefundComment("");
                setRefundDate("");
                setRefundRequestDate("");
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.message);
        }
    }

    // INVOICE

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.currentTarget.files?.[0];
        if (file) {
            setInvoiceFile(file);
        }
    };

    const handleInvoiceSubmit = async () => {


        try {
            if (!product?._id) {
                throw new Error("Missing required data for update.");
            }

            let variables: any = {
                input: {
                    _id: product?._id,
                    invoiceNumber: invoiceNumber
                },
            };
            if (invoiceFile) {
                variables = {
                    ...variables,
                    invoice: invoiceFile,
                };
            }
            const result = await UpdateProduct({
                variables
            });

            if (result.data.updateAdminOrderProduct) {
                orderRefetch();
                orderProdcutsRefetch();
                setInvoiceModal(!invoiceModal);
                toast.success("Invoice has been updated")
                setInvoiceNumber("");
                setInvoiceFile(null);
                handleFetchSignedUrl();
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.message);
        }
    }


    const getAdminSignedUrl = useFetchSignedUrl()

    const handleFetchSignedUrl = async () => {
        const url = product?.invoice?.fileURL;
        const mimeType = product?.invoice?.mimeType;

        const signedUrl = await fetchSignedUrl(getAdminSignedUrl, url, mimeType);
        if (signedUrl) {
            setSignedUrl(signedUrl)
        } else {
            console.error('Failed to fetch signed URL');
        }
    };

    useEffect(() => {
        handleFetchSignedUrl();
    }, [orderProdcutsRefetch, signedUrl, product?.invoice?.fileURL])



    // COMMENTS

    const toggleCommentEditModal = () => {
        setCommentEditModal(!commentEditModal)
    };

    const handleCommentsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCommentFormData({
            ...commentFormData,
            [name]: value,
        });
    };

    const handleCommentEditSubmit = async () => {
        try {
            const result = await UpdateProduct({
                variables: {
                    input: {
                        _id: product?._id,
                        cancelUserReason: commentFormData.cancelReasonUser,
                        cancelAdminComment: commentFormData.cancelCommentAdmin,
                        returnUserReason: commentFormData.returnReasonUser,
                        returnAdminComment: commentFormData.returnCommentAdmin,
                        refundComment: commentFormData.refundCommentAdmin,
                    },
                },
            });
            if (result.data.updateAdminOrderProduct) {
                orderRefetch();
                orderProdcutsRefetch();
                setCommentEditModal(!commentEditModal);
                toast.success("Comments has been updated")
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.message);
        }
    }

    // PRODUCT

    const toggleProductEditModal = () => {
        setProductEditModal(!productEditModal)
    };

    const handleProductEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProductEditFormData({
            ...productEditFormData,
            [name]: value,
        });
    };

    const handleProductEditSubmit = async () => {
        try {
            const result = await UpdateProduct({
                variables: {
                    input: {
                        _id: product?._id,
                        courierId: productEditFormData.courierId,
                        invoiceNumber: productEditFormData.invoiceNumber,
                        paymentStatus: productEditFormData.paymentStatus,
                        shippedDate: productEditFormData.shippedDate,
                        deliveryDate: productEditFormData.deliveredDate,
                        cancelledDate: productEditFormData.canceledDate,
                        returnRequestDate: productEditFormData.returnRequestDate,
                        returnRejectedDate: productEditFormData.returnRejectDate,
                        returnDate: productEditFormData.returnDate,
                        refundRequestDate: productEditFormData.refundRequestDate,
                        refundDate: productEditFormData.refundDate,
                        refundAmount: parseFloat(parseFloat(`${productEditFormData.refundAmount}`).toFixed(2)),
                        shippingCharge: parseFloat(parseFloat(`${productEditFormData.shippingCharge}`).toFixed(2)),
                    },
                },
            });
            if (result.data.updateAdminOrderProduct) {
                orderProdcutsRefetch();
                setProductEditModal(!productEditModal);
                orderRefetch();
                toast.success("Product has been updated")
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.message);
        }
    }

    const UPDATE_PRODUCT = gql`
    mutation UpdateAdminOrderProduct($input: UpdateAdminOrderProductInput!, $invoice: Upload) {
    updateAdminOrderProduct(input: $input, invoice: $invoice) {
     _id
     }
    }
    `;

    const [UpdateProduct] = useMutation(UPDATE_PRODUCT);


    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Card className="my-2" style={{ boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.05)" }}>
                <CardHeader>
                    <div style={{ width: "400px", cursor: "pointer", }} onClick={() => navigate(`/vendors/view?id=${product?.vendorId}`)} >
                        <p style={{ margin: 0, fontWeight: 500, display: "flex", fontSize: "16px" }}><p style={{ margin: 0, fontWeight: 500, width: "120px", fontSize: "16px" }}>Vendor ID : </p>{product?.vendorId}</p>
                        <p style={{ margin: 0, fontWeight: 500, display: "flex", fontSize: "16px" }}><p style={{ margin: 0, fontWeight: 500, width: "120px", fontSize: "16px" }}>Vendor name : </p>{product?.vendorName && capitalCase(product?.vendorName)}</p>
                    </div>
                </CardHeader>
                <CardBody style={{ display: "flex", flexDirection: "column", gap: "15px" }}>

                    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "20px", width: "80%", cursor: "pointer" }} onClick={() => navigate(`/product/details?_id=${product?.productId}`)}>
                            <div style={{ width: "80px" }}>
                                <CardImg
                                    alt="product"
                                    src={product?.image?.fileURL ?? ""}
                                    style={{
                                        height: 80
                                    }}
                                    top
                                    width="80px"
                                />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                                <CardTitle tag="h4" >
                                    <p style={{ fontSize: "20px", margin: "0" }}>
                                        {product?.productName}
                                    </p>
                                </CardTitle>
                                <CardSubtitle
                                    className="mb-2 text-muted"
                                    tag="h6"
                                >
                                    SKU : {product?.warehouseSkuId || "nill"}
                                </CardSubtitle>
                            </div>
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
                            <CustomButton icon="ic:baseline-edit" onClick={toggleProductEditModal} name="Edit Product" />
                        </div>

                    </div>


                    <CardText>
                        {product?.shortDescription}
                    </CardText>
                    <Row>

                        <Col xl={4}>

                            <CardText>
                                <p className="form-control-static" style={{ fontWeight: 500 }}>
                                    Details
                                </p>

                                <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
                                    <div style={{ width: "220px", }}>
                                        <p className="form-control-static" style={{ margin: 10 }} >Item Id</p>
                                        <p className="form-control-static" style={{ margin: 10 }}>Courier ID
                                        </p>
                                        <p className="form-control-static" style={{ margin: 10 }} >Invoice Number</p>
                                        <p className="form-control-static" style={{ margin: 10 }} >Pyment Status</p>
                                        <p className="form-control-static" style={{ margin: 10 }} >Selling Price</p>
                                        <p className="form-control-static" style={{ margin: 10 }} >Shipping Charge</p>
                                        {
                                            product?.refundAmount ?
                                                <p className="form-control-static" style={{ margin: 10 }} >Refund Amount</p> : ""
                                        }
                                    </div>
                                    <div style={{ width: "100%" }}>
                                        <p className="form-control-static" style={{ margin: 10 }} >{product?.itemId || "nill"}</p>
                                        <p className="form-control-static" style={{ margin: 10 }} >{product?.courierId || "nill"}</p>
                                        <p className="form-control-static" style={{ margin: 10 }} >{product?.invoiceNumber || "nill"}</p>
                                        <p className="form-control-static" style={{ margin: 10 }} >{product?.paymentStatus || "nill"}</p>
                                        <p className="form-control-static" style={{ margin: 10 }} >{formatCurrency(product?.sellingPrice)}</p>
                                        <p className="form-control-static" style={{ margin: 10 }} >{formatCurrency(product?.shippingCharge)}</p>
                                        {
                                            product?.refundAmount ?
                                                <p className="form-control-static" style={{ margin: 10 }} >{formatCurrency(product?.refundAmount)}</p> : ""
                                        }
                                    </div>
                                </div>
                            </CardText>
                        </Col>
                        <Col xl={4}>
                            <div>
                                <FormGroup>
                                    <Label for="exampleSelect">
                                        Shipping Status
                                    </Label>
                                    <Input
                                        id="exampleSelect"
                                        name="select"
                                        type="select"
                                        value={product?.shippingStatus}
                                        onChange={(e) => handleShippingStatusChange(e)}
                                    >
                                        <option value={"PENDING"}>
                                            PENDING
                                        </option>
                                        <option value={"PACKAGE_IN_PROGRESS"}>
                                            PACKAGE IN PROGRESS
                                        </option>
                                        <option value={"SHIPPED"}>
                                            SHIPPED
                                        </option>
                                        <option value={"DELIVERED"}>
                                            DELIVERED
                                        </option>
                                        <option value={"CANCELED"}>
                                            CANCELED
                                        </option>
                                    </Input>
                                </FormGroup>

                                <FormGroup>
                                    <Label for="exampleSelect">
                                        Return Status
                                    </Label>
                                    <Input
                                        id="exampleSelect"
                                        name="select"
                                        type="select"
                                        value={product?.returnStatus}
                                        onChange={(e) => handleReturnStatusChange(e)}
                                    >
                                        <option value={"NA"}>
                                            NA
                                        </option>
                                        <option value={"PENDING"}>
                                            PENDING
                                        </option>
                                        <option value={"APPROVED"}>
                                            APPROVED
                                        </option>
                                        <option value={"REJECTED"}>
                                            REJECTED
                                        </option>
                                    </Input>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="exampleSelect">
                                        Refund Status
                                    </Label>
                                    <Input
                                        id="exampleSelect"
                                        name="select"
                                        type="select"
                                        value={product?.refundStatus}
                                        onChange={(e) => handleRefundStatusChange(e)}
                                    >
                                        <option value={"NA"}>
                                            NA
                                        </option>
                                        <option value={"PENDING"}>
                                            PENDING
                                        </option>
                                        <option value={"PAID"}>
                                            PAID
                                        </option>
                                    </Input>
                                </FormGroup>

                            </div>
                        </Col>
                        <Col xl={4}>
                            <CardText>
                                <p className="form-control-static" style={{ fontWeight: 500 }}>
                                    Date
                                </p>

                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <div style={{ width: "200px" }}>
                                        {product?.orderDate && <p className="form-control-static" style={{ margin: 10 }}>Order Date</p>}
                                        {product?.shippedDate && <p className="form-control-static" style={{ margin: 10 }}>Shipped Date</p>}
                                        {product?.deliveryDate && <p className="form-control-static" style={{ margin: 10 }}>Delivery Date</p>}
                                        {product?.returnRequestDate && <p className="form-control-static" style={{ margin: 10 }}>Return Request Date</p>}
                                        {product?.returnDate && <p className="form-control-static" style={{ margin: 10 }}>Return Date</p>}
                                        {product?.returnRejectedDate && <p className="form-control-static" style={{ margin: 10 }}>Return Rejected Date</p>}
                                        {product?.refundRequestDate && <p className="form-control-static" style={{ margin: 10 }}>Refund Request Date</p>}
                                        {product?.refundDate && <p className="form-control-static" style={{ margin: 10 }}>Refund Date</p>}
                                        {product?.cancelledDate && <p className="form-control-static" style={{ margin: 10 }}>Cancelled Date</p>}
                                    </div>
                                    <div>
                                        {product?.orderDate && <p className="form-control-static" style={{ margin: 10 }}>{moment(product?.orderDate).format("L")}</p>}
                                        {product?.shippedDate && <p className="form-control-static" style={{ margin: 10 }}>{moment(product?.shippedDate).format("L")}</p>}
                                        {product?.deliveryDate && <p className="form-control-static" style={{ margin: 10 }}>{moment(product?.deliveryDate).format("L")}</p>}
                                        {product?.returnRequestDate && <p className="form-control-static" style={{ margin: 10 }}>{moment(product?.returnRequestDate).format("L")}</p>}
                                        {product?.returnDate && <p className="form-control-static" style={{ margin: 10 }}>{moment(product?.returnDate).format("L")}</p>}
                                        {product?.returnRejectedDate && <p className="form-control-static" style={{ margin: 10 }}>{moment(product?.returnRejectedDate).format("L")}</p>}
                                        {product?.refundRequestDate && <p className="form-control-static" style={{ margin: 10 }}>{moment(product?.refundRequestDate).format("L")}</p>}
                                        {product?.refundDate && <p className="form-control-static" style={{ margin: 10 }}>{moment(product?.refundDate).format("L")}</p>}
                                        {product?.cancelledDate && <p className="form-control-static" style={{ margin: 10 }}>{moment(product?.cancelledDate).format("L")}</p>}
                                    </div>
                                </div>

                            </CardText>
                        </Col>
                    </Row>

                    <div style={{ marginBottom: "55px" }}>
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px" }}>

                            <div >
                                <label
                                    htmlFor="cleave-time-format"
                                    style={{ margin: "0" }}
                                >
                                    Invoice:
                                </label>
                            </div>
                            <Button
                                onClick={toggleInvoiceModal}

                                style={{
                                    backgroundColor: "black",
                                    color: "white",
                                    width: "auto",
                                    height: "40px",
                                    borderRadius: "10px",
                                    fontSize: "13px"
                                }}
                            >
                                {
                                    (!product?.invoiceNumber && !product?.invoice?.fileURL) ?
                                        <><FeatherIcon icon="plus" className="icon-sm" /> Add Invoice</>
                                        :
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                                            <Iconify icon="ic:baseline-edit" style={{ fontSize: "5px" }} width={18} />
                                            Edit Invoice
                                        </div>
                                }
                            </Button>
                        </div>
                        <div style={{ marginTop: "30px" }}>
                            <img style={{ cursor: "pointer", border: "1px solid black" }} width={"150px"} src={signedUrl} onClick={() => window.open(signedUrl)} />
                        </div>
                    </div>

                    <Button onClick={toggle} color="primary" style={{ margin: "0 auto 0px auto" }}>
                        {!isOpen ?
                            <>
                                View More
                                <FeatherIcon icon="chevron-down" className="icon-sm" />
                            </>
                            :
                            <>
                                View Less
                                <FeatherIcon icon="chevron-up" className="icon-sm" />
                            </>
                        }
                    </Button>
                    <div >
                        <Collapse isOpen={isOpen}>
                            <Card>
                                <CardBody>
                                    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "flex-end" }}>
                                        <Button
                                            onClick={toggleCommentEditModal}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                gap: "4px",
                                                backgroundColor: "black",
                                                color: "white",
                                                width: "auto",
                                                height: "40px",
                                                borderRadius: "10px",
                                                fontSize: "12px"
                                            }}
                                        >
                                            <Iconify icon="ic:baseline-edit" style={{ fontSize: "5px" }} width={16} />  Edit Comments
                                        </Button>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

                                        <div>
                                            <h5 style={{ color: "#b12349", marginBottom: "20px", }}>Cancel</h5>
                                            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>

                                                <div style={{ display: "flex", gap: "20px" }}>
                                                    <h6 style={{ width: "130px" }}>User Reason</h6>
                                                    <div>
                                                        <p style={{ width: "500px" }}>{product?.cancelUserReason || "nill"}</p>
                                                    </div>
                                                </div>
                                                <div style={{ display: "flex", gap: "20px" }}>
                                                    <h6 style={{ width: "130px" }}>Admin Comment</h6>
                                                    <div>
                                                        <p style={{ width: "500px" }}>{product?.cancelAdminComment || "nill"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h5 style={{ color: "#b12349", marginBottom: "20px" }}>Return</h5>
                                            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>

                                                <div style={{ display: "flex", gap: "20px" }}>
                                                    <h6 style={{ width: "130px" }}>User Reason</h6>
                                                    <div>
                                                        <p style={{ width: "500px" }}>{product?.returnUserReason || "nill"}</p>
                                                    </div>
                                                </div>
                                                <div style={{ display: "flex", gap: "20px" }}>
                                                    <h6 style={{ width: "130px" }}>Admin Comment</h6>
                                                    <div>
                                                        <p style={{ width: "500px" }}>{product?.returnAdminComment || "nill"}</p>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h5 style={{ color: "#b12349", marginBottom: "20px" }}>Refund</h5>
                                            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                                                <div style={{ display: "flex", gap: "20px" }}>
                                                    <h6 style={{ width: "130px" }}>Admin Comment</h6>
                                                    <div>
                                                        <p style={{ width: "500px" }}>{product?.refundComment || "nill"}</p>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>



                                </CardBody>
                            </Card>
                        </Collapse>

                    </div>

                </CardBody>
            </Card>

            {/* ================== SHIPPPING MODAL ===================== */}

            <Modal isOpen={shippingModal} toggle={toggleShippingModal} >
                <ModalHeader toggle={toggleShippingModal}>Shipping Status</ModalHeader>
                <ModalBody>
                    {
                        shippingStatus === "PENDING" &&
                        <p>Are you sure you want to change the status to <b>{capitalCase(shippingStatus)} </b> ?</p>
                    }
                    {
                        shippingStatus === "PACKAGE_IN_PROGRESS" &&
                        <p>Are you sure you want to change the status to <b>{capitalCase(shippingStatus)} </b> ?</p>
                    }
                    {
                        shippingStatus === "SHIPPED" &&
                        <>
                            <p>Are you sure you want to change the status to <b>{capitalCase(shippingStatus)} </b>?</p>

                            <FormGroup>
                                <Label for="shippedDate">Enter Shipped Date</Label>
                                <Input
                                    type="date"
                                    name="shippedDate"
                                    id="shippedDate"
                                    required
                                    value={shippedDate}
                                    onChange={(e) => setShippedDate(e.target.value)}

                                />
                            </FormGroup>
                        </>
                    }
                    {
                        shippingStatus === "DELIVERED" &&
                        <>
                            <p>Are you sure you want to change the status to <b>{capitalCase(shippingStatus)} </b>?</p>

                            <FormGroup>
                                <Label for="deliveredDate">Enter Delivered Date</Label>
                                <Input
                                    type="date"
                                    name="deliveredDate"
                                    id="deliveredDate"
                                    value={deliveredDate}
                                    onChange={(e) => setDeliveredDate(e.target.value)}
                                />
                            </FormGroup>

                            <FormGroup >
                                <Label
                                    for="paymentStatus"
                                >
                                    Select Payment Status
                                </Label>
                                <Input
                                    id="paymentStatus"
                                    name="paymentStatus"
                                    type="select"
                                    value={paymentStatus}
                                    onChange={(e) => setPaymentStatus(e.target.value)}
                                >
                                    <option value={""}>
                                        Select Payment Status
                                    </option>
                                    <option value={"PENDING"}>
                                        PENDING
                                    </option>
                                    <option value={"COMPLETED"}>
                                        COMPLETED
                                    </option >
                                </Input>
                            </FormGroup>
                        </>
                    }
                    {
                        shippingStatus === "CANCELED" &&
                        <>
                            <p>Are you sure you want to change the status to <b>{capitalCase(shippingStatus)} </b>?</p>

                            <FormGroup>
                                <Label for="canceledDate">Enter Canceled Date</Label>
                                <Input
                                    type="date"
                                    name="canceledDate"
                                    id="canceledDate"
                                    value={canceledDate}
                                    onChange={(e) => setCanceledDate(e.target.value)}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="cancelComment">Admin Comment</Label>
                                <Input
                                    type="text"
                                    name="cancelComment"
                                    id="cancelComment"
                                    value={cancelComment}
                                    onChange={(e) => setCancelComment(e.target.value)}
                                />
                            </FormGroup>
                        </>
                    }
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleShippingStatusSubmit}>
                        Submit
                    </Button>{' '}
                    <Button color="secondary" onClick={toggleShippingModal}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>


            {/* ================== RETURN MODAL ===================== */}

            <Modal isOpen={returnModal} toggle={toggleReturnModal} >
                <ModalHeader toggle={toggleReturnModal}>Return Status</ModalHeader>
                <ModalBody>
                    {
                        returnStatus === "NA" &&
                        <p>Are you sure you want to change the status to <b>{capitalCase(returnStatus)} </b> ?</p>
                    }
                    {
                        returnStatus === "PENDING" &&
                        <>
                            <p>Are you sure you want to change the status to <b>{capitalCase(returnStatus)} </b> ?</p>

                            <FormGroup>
                                <Label for="returnRequestDate">Enter Return Request Date</Label>
                                <Input
                                    type="date"
                                    name="returnRequestDate"
                                    id="returnRequestDate"
                                    required
                                    value={returnRequestDate}
                                    onChange={(e) => setReturnRequestDate(e.target.value)}

                                />
                            </FormGroup>
                        </>
                    }
                    {
                        returnStatus === "APPROVED" &&
                        <>
                            <p>Are you sure you want to change the status to <b>{capitalCase(returnStatus)} </b>?</p>

                            <FormGroup>
                                <Label for="returnDate">Enter Return Date</Label>
                                <Input
                                    type="date"
                                    name="returnDate"
                                    id="returnDate"
                                    required
                                    value={returnDate}
                                    onChange={(e) => setReturnDate(e.target.value)}

                                />
                            </FormGroup>

                            <FormGroup>
                                <Label for="returnComment">Admin Comment</Label>
                                <Input
                                    type="text"
                                    name="returnComment"
                                    id="returnComment"
                                    value={returnComment}
                                    onChange={(e) => setReturnComment(e.target.value)}
                                />
                            </FormGroup>
                        </>
                    }
                    {
                        returnStatus === "REJECTED" &&
                        <>
                            <p>Are you sure you want to change the status to <b>{capitalCase(returnStatus)} </b>?</p>

                            <FormGroup>
                                <Label for="returnRejectDate ">Enter Canceled Date</Label>
                                <Input
                                    type="date"
                                    name="returnRejectDate"
                                    id="returnRejectDate  "
                                    value={returnRejectDate}
                                    onChange={(e) => setReturnRejectDate(e.target.value)}
                                />
                            </FormGroup>
                            {/* <FormGroup>
                                <Label for="returnAdminComment">Return Admin Comment</Label>
                                <Input
                                    type="text"
                                    name="returnAdminComment"
                                    id="returnAdminComment"
                                    value={returnAdminComment}
                                    onChange={(e) => returnAdminComment(e.target.value)}
                                />
                            </FormGroup> */}
                        </>
                    }
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleReturnStatusSubmit}>
                        Submit
                    </Button>{' '}
                    <Button color="secondary" onClick={toggleReturnModal}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>

            {/* ================== REFUND MODAL ===================== */}

            <Modal isOpen={refundModal} toggle={toggleRefundModal} >
                <ModalHeader toggle={toggleRefundModal}>Refund Status</ModalHeader>
                <ModalBody>
                    {
                        refundStatus === "NA" &&
                        <p>Are you sure you want to change the status to <b>{capitalCase(refundStatus)} </b> ?</p>
                    }
                    {
                        refundStatus === "PENDING" &&
                        <>
                            <p>Are you sure you want to change the status to <b>{capitalCase(refundStatus)} </b> ?</p>

                            <FormGroup>
                                <Label for="refundRequestDate">Enter Refund Request Date</Label>
                                <Input
                                    type="date"
                                    name="refundRequestDate"
                                    id="refundRequestDate"
                                    required
                                    value={refundRequestDate}
                                    onChange={(e) => setRefundRequestDate(e.target.value)}

                                />
                            </FormGroup>
                        </>
                    }
                    {
                        refundStatus === "PAID" &&
                        <>
                            <p>Are you sure you want to change the status to <b>{capitalCase(refundStatus)} </b>?</p>

                            <FormGroup>
                                <Label for="refundDate">Enter Refund Date</Label>
                                <Input
                                    type="date"
                                    name="refundDate"
                                    id="refundDate"
                                    required
                                    value={refundDate}
                                    onChange={(e) => setRefundDate(e.target.value)}
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label for="refundComment">Admin Comment</Label>
                                <Input
                                    type="text"
                                    name="refundComment"
                                    id="refundComment"
                                    value={refundComment}
                                    onChange={(e) => setRefundComment(e.target.value)}
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label for="refundAmount">Refund Amount</Label>
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">&#x20B9;</span>
                                    </div>
                                    <Input
                                        type="text"
                                        name="refundAmount"
                                        id="refundAmount"
                                        value={product?.sellingPrice}
                                        disabled
                                    />
                                </div>
                            </FormGroup>
                        </>
                    }

                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleRefundStatusSubmit}>
                        Submit
                    </Button>{' '}
                    <Button color="secondary" onClick={toggleRefundModal}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>

            {/* ================  INVOICE MODAL ================= */}

            <Modal isOpen={invoiceModal} toggle={toggleInvoiceModal} >
                <ModalHeader toggle={toggleInvoiceModal}>Invoice</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label for="invoiceNumber">Enter Invoice Number</Label>
                        <Input
                            type="text"
                            name="invoiceNumber"
                            id="invoiceNumber"
                            required
                            value={invoiceNumber}
                            onChange={(e) => setInvoiceNumber(e.target.value)}

                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="invoiceFile">Invoice</Label>
                        <Input
                            type="file"
                            name="invoiceFile"
                            id="invoiceFile"
                            required
                            onChange={handleFileChange}
                        />
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleInvoiceSubmit}>
                        Submit
                    </Button>{' '}
                    <Button color="secondary" onClick={toggleInvoiceModal}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>


            {/*============= PRODUCT EDIT MODAL =============*/}



            <Modal isOpen={productEditModal} toggle={toggleProductEditModal} style={{ maxWidth: '1000px', width: '100%' }}>
                <ModalHeader toggle={toggleProductEditModal}>Edit Product Details</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col xl={6}>
                            <Row>
                                <Col xs={12}>
                                    <FormGroup>
                                        <Label for="invoiceNumber">Enter Invoice Number</Label>
                                        <Input
                                            type="text"
                                            name="invoiceNumber"
                                            id="invoiceNumber"
                                            value={productEditFormData.invoiceNumber}
                                            onChange={handleProductEditInputChange}

                                        />
                                    </FormGroup>
                                </Col>
                                <Col xs={12}>
                                    <FormGroup>
                                        <Label for="courierId">Enter Courier ID</Label>
                                        <Input
                                            type="text"
                                            name="courierId"
                                            id="courierId"
                                            value={productEditFormData.courierId}
                                            onChange={handleProductEditInputChange}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col xs={6}>
                                    <FormGroup >
                                        <Label
                                            for="paymentStatus"
                                        >
                                            Select Payment Status
                                        </Label>
                                        <Input
                                            id="paymentStatus"
                                            name="paymentStatus"
                                            type="select"
                                            value={productEditFormData.paymentStatus}
                                            onChange={handleProductEditInputChange}
                                        >
                                            <option value={"COMPLETED"}>
                                                COMPLETED
                                            </option >
                                            <option value={"PENDING"}>
                                                PENDING
                                            </option>
                                        </Input>
                                    </FormGroup>
                                </Col>
                                <Col xs={6}>
                                    <FormGroup>
                                        <Label for="shippingCharge">Shipping Charge</Label>
                                        <div className="input-group">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">&#x20B9;</span>
                                            </div>
                                            <Input
                                                type="number"
                                                name="shippingCharge"
                                                id="shippingCharge"
                                                value={productEditFormData?.shippingCharge}
                                                onChange={handleProductEditInputChange}
                                            />
                                        </div>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Col>
                        <Col xl={6}>
                            <Row>
                                <Col xl={4}>
                                    <FormGroup>
                                        <Label for="shippedDate">Shipped Date</Label>
                                        <Input
                                            type="date"
                                            name="shippedDate"
                                            id="shippedDate"
                                            value={moment(productEditFormData.shippedDate).format('YYYY-MM-DD')}
                                            onChange={handleProductEditInputChange}
                                            disabled={!["SHIPPED", "DELIVERED", "CANCELED"].includes(product?.shippingStatus)}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col xl={4}>
                                    <FormGroup>
                                        <Label for="deliveredDate">Delivered Date</Label>
                                        <Input
                                            type="date"
                                            name="deliveredDate"
                                            id="deliveredDate"
                                            value={moment(productEditFormData.deliveredDate).format('YYYY-MM-DD')}
                                            onChange={handleProductEditInputChange}
                                            disabled={!["DELIVERED"].includes(product?.shippingStatus)}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col xl={4}>
                                    <FormGroup>
                                        <Label for="canceledDate">Cancelled Date</Label>
                                        <Input
                                            type="date"
                                            name="canceledDate"
                                            id="canceledDate"
                                            value={moment(productEditFormData.canceledDate).format('YYYY-MM-DD')}
                                            onChange={handleProductEditInputChange}
                                            disabled={!["CANCELED"].includes(product?.shippingStatus)}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col xl={4}>
                                    <FormGroup>
                                        <Label for="returnRequestDate">Return Requested</Label>
                                        <Input
                                            type="date"
                                            name="returnRequestDate"
                                            id="returnRequestDate"
                                            value={moment(productEditFormData.returnRequestDate).format('YYYY-MM-DD')}
                                            onChange={handleProductEditInputChange}
                                            disabled={!["PENDING", "APPROVED"].includes(product?.returnStatus)}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col xl={4}>
                                    <FormGroup>
                                        <Label for="returnDate">Return Date</Label>
                                        <Input
                                            type="date"
                                            name="returnDate"
                                            id="returnDate"
                                            value={moment(productEditFormData.returnDate).format('YYYY-MM-DD')}
                                            onChange={handleProductEditInputChange}
                                            disabled={!["APPROVED"].includes(product?.returnStatus)}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col xl={4}>
                                    <FormGroup>
                                        <Label for="returnRejectDate">Return Rejected</Label>
                                        <Input
                                            type="date"
                                            name="returnRejectDate"
                                            id="returnRejectDate"
                                            value={moment(productEditFormData.returnRejectDate).format('YYYY-MM-DD')}
                                            onChange={handleProductEditInputChange}
                                            disabled={!["REJECTED"].includes(product?.returnStatus)}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>


                            <Row>
                                <Col xl={4}>
                                    <FormGroup>
                                        <Label for="refundRequestDate">Refund Requested</Label>
                                        <Input
                                            type="date"
                                            name="refundRequestDate"
                                            id="refundRequestDate"
                                            value={moment(productEditFormData.refundRequestDate).format('YYYY-MM-DD')}
                                            onChange={handleProductEditInputChange}
                                            disabled={!["PENDING", "PAID"].includes(product?.refundStatus)}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col xl={4}>
                                    <FormGroup>
                                        <Label for="refundDate">Refund Date</Label>
                                        <Input
                                            type="date"
                                            name="refundDate"
                                            id="refundDate"
                                            value={moment(productEditFormData.refundDate).format('YYYY-MM-DD')}
                                            onChange={handleProductEditInputChange}
                                            disabled={!["PAID"].includes(product?.refundStatus)}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col xl={4}>
                                    <FormGroup>
                                        <Label for="refundAmount">Refund Amount</Label>
                                        <div className="input-group">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text">&#x20B9;</span>
                                            </div>
                                            <Input
                                                type="number"
                                                name="refundAmount"
                                                id="refundAmount"
                                                value={productEditFormData?.refundAmount}
                                                disabled={!["PAID"].includes(product?.refundStatus)}
                                                onChange={handleProductEditInputChange}
                                            />
                                        </div>
                                    </FormGroup>
                                </Col>
                            </Row>


                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleProductEditSubmit}>
                        Submit
                    </Button>{' '}
                    <Button color="secondary" onClick={toggleProductEditModal}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>

            {/* ============== COMMENTS EDIT MODAL =============== */}


            <Modal isOpen={commentEditModal} toggle={toggleCommentEditModal} >
                <ModalHeader toggle={toggleCommentEditModal}>Edit Comments</ModalHeader>
                <ModalBody>

                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        {
                            product?.shippingStatus === "CANCELED" &&
                            <div>
                                <h5 style={{ color: "#b12349", marginBottom: "10px", }}>Cancel</h5>
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

                                    <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                                        <h6 style={{ width: "180px" }}>User Reason</h6>

                                        <Input
                                            style={{ width: "100% !important" }}
                                            type="text"
                                            name="cancelReasonUser"
                                            id="cancelReasonUser"
                                            value={commentFormData.cancelReasonUser}
                                            onChange={handleCommentsInputChange}
                                        />
                                    </div>
                                    <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                                        <h6 style={{ width: "180px" }}>Admin Comment</h6>

                                        <Input
                                            style={{ width: "100% !important" }}
                                            type="text"
                                            name="cancelCommentAdmin"
                                            id="cancelCommentAdmin"
                                            value={commentFormData.cancelCommentAdmin}
                                            onChange={handleCommentsInputChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        }

                        {
                            product?.returnStatus !== "NA" &&
                            <div>
                                <h5 style={{ color: "#b12349", marginBottom: "10px", }}>Return</h5>
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

                                    <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                                        <h6 style={{ width: "180px" }}>User Reason</h6>

                                        <Input
                                            style={{ width: "100% !important" }}
                                            type="text"
                                            name="returnReasonUser"
                                            id="returnReasonUser"
                                            value={commentFormData.returnReasonUser}
                                            onChange={handleCommentsInputChange}
                                        />
                                    </div>
                                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                        <h6 style={{ width: "195px" }}>Admin Comment</h6>

                                        <Input
                                            style={{ width: "100% !important" }}
                                            type="text"
                                            name="returnCommentAdmin"
                                            id="returnCommentAdmin"
                                            value={commentFormData.returnCommentAdmin}
                                            onChange={handleCommentsInputChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        }

                        {
                            product?.refundStatus === "PAID" &&

                            <div>
                                <h5 style={{ color: "#b12349", marginBottom: "20px", }}>Refund</h5>
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

                                    <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                                        <h6 style={{ width: "180px" }}>Admin Comment</h6>

                                        <Input
                                            style={{ width: "100% !important" }}
                                            type="text"
                                            name="refundCommentAdmin"
                                            id="refundCommentAdmin"
                                            value={commentFormData.refundCommentAdmin}
                                            onChange={handleCommentsInputChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        }
                    </div>

                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleCommentEditSubmit}>
                        Submit
                    </Button>{' '}
                    <Button color="secondary" onClick={toggleCommentEditModal}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>

        </div >
    )
}

export default OrderProductDetails;