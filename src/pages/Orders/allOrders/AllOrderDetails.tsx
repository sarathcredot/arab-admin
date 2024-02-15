import React, { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";

import { gql, useQuery } from "@apollo/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import Breadcrumbs from "../../../components/Common/Breadcrumb";

import "cleave.js/dist/addons/cleave-phone.in";

import { capitalCase, sentenceCase } from "change-case";
import moment from "moment";
import userAvatar from "src/assets/images/users/user-dummy-img.jpg";
import OrderDetails from "src/components/orders/OrderProductDetails";
import OrderProductsDetails from "src/components/orders/OrderProductDetails";
import { formatCurrency } from "src/utils/formatCurrency";
formatCurrency

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

interface OrderData {
    _id: string;
    orderId: string;
    userId: string;
    paymentMode: string;
    orderDate: Date;
    orderStatus: string;
    username: string;
    shippingAddress: ShippingAddress;
    orderPriceInfo: OrderPriceInfo;
}

interface ProductsData {
    _id: string;
    userId: string;
    productId: string;
    itemId: string;
    orderId: string;
    productName: string;
    shortDescription: string;
    skuId: string;
    image: {
        fileType: string;
        fileURL: string;
        mimeType: string;
        originalName: string;
    };
    returnPeriod: string;
    mrp: number;
    sellingPrice: number;
    shippingCharge: number;
    paymentMode: string;
    paymentStatus: string;
    paymentRemark: string;
    orderDate: string;
    shippingStatus: string;
    shippedDate: string;
    deliveryDate: string;
    returnStatus: string;
    returnUserReason: string;
    returnAdminComment: string;
    returnRequestDate: string;
    returnRejectedDate: string;
    returnDate: string;
    refundStatus: string;
    refundAmount: number;
    refundRequestDate: string;
    refundDate: string;
    refundComment: string;
    cancelUserReason: string;
    cancelAdminComment: string;
    cancelledDate: string;
    courierId: string;
    invoiceNumber: string;
    invoice: {
        fileType: string;
        fileURL: string;
        mimeType: string;
        originalName: string;
    };
    username: string;
}



const ALlOrderDetails = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const orderId = searchParams.get("orderId");
    const [order, setOrder] = useState<OrderData>();
    const [orderProducts, setOrderProducts] = useState<ProductsData | []>([]);



    const GET_ORDER = gql`
    query GetAdminOrderDetails($input: GetAdminOrderDetailsInput!) {
    getAdminOrderDetails(input: $input) {
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
  `;

    const GET_ORDER_PRODUCTS = gql`
    query GetAdminOrderProducts ($input:GetAdminOrderProductsInput!){
    getAdminOrderProducts (input : $input){
    products {
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
   `


    const {
        data: orderData,
        loading: orderLoading,
        error: orderError,
        refetch: orderRefetch,
    } = useQuery(GET_ORDER, {
        variables: {
            input: {
                orderId: orderId,
            },
        },
    });

    const {
        data: orderProductsData,
        loading: orderProductsLoading,
        error: orderProductsError,
        refetch: orderProdcutsRefetch
    } = useQuery(GET_ORDER_PRODUCTS, {
        variables: {
            input: {
                orderId: orderId
            }
        }
    })

    useEffect(() => {
        if (orderProductsData && orderProductsData.getAdminOrderProducts && orderProductsData.getAdminOrderProducts.products) {
            let product: ProductsData = orderProductsData.getAdminOrderProducts.products;
            setOrderProducts(product);
        }
    }, [orderProductsData]);

    useEffect(() => {
        if (orderData && orderData.getAdminOrderDetails) {
            let order: OrderData = orderData.getAdminOrderDetails;
            setOrder(order);
        }
    }, [orderData]);

    const items = [
        { text: "Dashboard", link: `/` },
        { text: "All Orders", link: `/orders` },
    ];

    return (
        <React.Fragment>

            <div className="page-content">
                <Container fluid={true}>
                    {/* <Breadcrumbs items={items} currentPage="Details" /> */}

                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardHeader>
                                    <Row>
                                        <Col xl={6}>
                                            <div
                                                className="mb-3"
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "4px",
                                                }}
                                            >
                                            </div>
                                            <div >
                                                <div style={{ display: "flex", flexDirection: "row", }}>
                                                    <div style={{ width: "200px" }}>
                                                        <p className="form-control-static">Order Id</p>
                                                        <p className="form-control-static">Date</p>
                                                        <p className="form-control-static">Payment Mode</p>
                                                        <p className="form-control-static">Order Status</p>
                                                    </div>
                                                    <div>
                                                        <p className="form-control-static">{order?.orderId}</p>
                                                        <p className="form-control-static">{moment(order?.orderDate).format("ll")}</p>
                                                        <p className="form-control-static">{order?.paymentMode}</p>
                                                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                                            <div style={{
                                                                width: "8px", height: "8px", borderRadius: "50%",
                                                                background: order?.orderStatus === "PENDING" ? "#ff9500" : (order?.orderStatus === "IN_PROGRESS" ? "#fff200" : "green")
                                                            }} />
                                                            {order?.orderStatus.replace("_", " ")}
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </Col>
                                        <Col xl={6}>
                                            <div
                                                className="mb-3"
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "4px",
                                                }}
                                            >
                                                {/* <label
                                                        htmlFor="colorDropdown"
                                                        className="form-label"
                                                    ></label> */}
                                            </div>
                                            <div >
                                                <div style={{ display: "flex", flexDirection: "row", }}>
                                                    <div style={{ width: "200px" }}>
                                                        <p className="form-control-static">Selling Price</p>
                                                        <p className="form-control-static">Shipping Charge</p>
                                                        <p className="form-control-static">Refund Amount</p>
                                                        <p className="form-control-static" style={{ fontWeight: 500 }}>Effective Price</p>
                                                    </div>
                                                    <div style={{ textAlign: "right" }}>
                                                        <p className="form-control-static">{formatCurrency(order?.orderPriceInfo["totalSellingPrice"])}</p>
                                                        <p className="form-control-static">{formatCurrency(order?.orderPriceInfo["totalShippingCharge"])}</p>
                                                        <p className="form-control-static">{formatCurrency(order?.orderPriceInfo["totalRefundAmount"])}</p>
                                                        <p className="form-control-static" style={{ fontWeight: 500 }}>
                                                            {formatCurrency(
                                                                (order?.orderPriceInfo?.["totalSellingPrice"] ?? 0) +
                                                                (order?.orderPriceInfo?.["totalShippingCharge"] ?? 0) -
                                                                (order?.orderPriceInfo?.["totalRefundAmount"] ?? 0)
                                                            )}
                                                        </p>
                                                    </div>

                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </CardHeader>

                                <CardBody>
                                    <form action="#">
                                        <div>
                                            <Row style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
                                                <Col xl={12}>
                                                    <div
                                                        className="mb-3"
                                                        style={{ display: "flex", gap: "4px" }}
                                                    >
                                                        <label

                                                            htmlFor="cleave-date"
                                                            className="form-label"
                                                        >
                                                            User Profile:
                                                        </label>

                                                    </div>

                                                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "30px" }}>
                                                        <div style={{ width: "80px", height: "80px", borderRadius: "50%", }}>
                                                            <img width={"100%"} height={"100%"} style={{ borderRadius: "50%" }} src={userAvatar} />
                                                        </div>

                                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", border: "1px solid  rgba(0, 0, 0,0.3)", borderRadius: "7px", padding: "4px 10px", width: "350px" }}>
                                                            <p className="form-control-static" style={{ fontSize: "12px", margin: 0 }}>
                                                                Fullname:
                                                            </p>
                                                            <p className="form-control-static" style={{ fontWeight: 500, margin: 0 }}>
                                                                {order?.username && capitalCase(order?.username)}
                                                            </p>
                                                        </div>

                                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", border: "1px solid rgba(0, 0, 0,0.3)", borderRadius: "7px", padding: "4px 10px", width: "350px" }}>
                                                            <p className="form-control-static" style={{ fontSize: "12px", margin: 0 }}>
                                                                Id:
                                                            </p>
                                                            <p className="form-control-static" style={{ fontWeight: 500, margin: 0 }}>
                                                                {order?.userId}
                                                            </p>
                                                        </div>
                                                    </div>

                                                </Col>

                                                <Col xl={12}>
                                                    <div
                                                        className="mb-3"
                                                        style={{ display: "flex", gap: "4px" }}
                                                    >
                                                        <label
                                                            htmlFor="cleave-date"
                                                            className="form-label"
                                                        >
                                                            Shipping Address:
                                                        </label>

                                                    </div>

                                                    <div >
                                                        <div style={{ display: "flex", flexDirection: "row", }}>
                                                            <div style={{ width: "200px" }}>
                                                                <p className="form-control-static">email</p>
                                                                <p className="form-control-static">Mobile</p>
                                                                <p className="form-control-static">Address</p>
                                                                <p className="form-control-static">Address2</p>
                                                                <p className="form-control-static" >City</p>
                                                                <p className="form-control-static" >Landmark</p>
                                                                <p className="form-control-static" >Postcode</p>
                                                                <p className="form-control-static" >Country</p>
                                                            </div>
                                                            <div >
                                                                <p className="form-control-static">{order?.shippingAddress["email"] || "nill"}</p>
                                                                <p className="form-control-static">{order?.shippingAddress["mobile"] || "nill"}</p>
                                                                <p className="form-control-static">{order?.shippingAddress["address"] && sentenceCase(order?.shippingAddress["address"]) || "nill"} </p>
                                                                <p className="form-control-static">{order?.shippingAddress["address2"] && sentenceCase(order?.shippingAddress["address2"]) || "nill"}  </p>
                                                                <p className="form-control-static">{order?.shippingAddress["city"] && sentenceCase(order?.shippingAddress["city"]) || "nill"} </p>
                                                                <p className="form-control-static">{order?.shippingAddress["landmark"] ? sentenceCase(order?.shippingAddress["landmark"]) : "nill"} </p>
                                                                <p className="form-control-static">{order?.shippingAddress["postCode"] || "nill"}</p>
                                                                <p className="form-control-static">{order?.shippingAddress["country"] || "nill"}</p>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>

                                        <div className="border mt-3 border-dashed"></div>

                                        <div className="mt-4">
                                            <div>
                                                <Row>
                                                    <Col xl={12}>
                                                        <div className="mb-3">
                                                            <label
                                                                htmlFor="cleave-time-format"
                                                                className="form-label"
                                                            >
                                                                Products:
                                                            </label>
                                                        </div>
                                                        <div>
                                                            {Array.isArray(orderProducts) && orderProducts.map((product: ProductsData, index: number) => (
                                                                <OrderProductsDetails key={index} product={product} orderProdcutsRefetch={orderProdcutsRefetch} />
                                                            ))}
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </div>


                                    </form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment >
    );
};

export default ALlOrderDetails;
