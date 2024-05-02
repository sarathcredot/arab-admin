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
import { formatCurrency } from "src/utils/formatCurrency"; import OrderProductsDetails from "src/components/orders/OrderProductDetails";
import OrderShippingAddress from "src/components/orders/OrderShippingAddress";

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
    apartment?: string;
    suite?: string;
    unit?: string;
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
    vendorId?: string; // Assuming vendorId is optional based on the response
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
    warehouseSkuId: string | null;

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
    const [orderProducts, setOrderProducts] = useState([]);


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
  `;

    const GET_ORDER_PRODUCTS = gql`
    query GetAdminOrderProducts($input: GetAdminOrderProductsInput!) {
  getAdminOrderProducts(input: $input) {
    products {
      _id
      userId
      productId
      vendorId
      vendorName
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
      warehouseSkuId
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
        fetchPolicy: "network-only",
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
        fetchPolicy: "network-only",
        variables: {
            input: {
                orderId: orderId
            }
        }
    })

    useEffect(() => {
        if (orderProductsData && orderProductsData.getAdminOrderProducts && orderProductsData.getAdminOrderProducts.products) {
            let product = orderProductsData.getAdminOrderProducts.products;
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


    const calculatePaidAmount = () => {
        const completedProducts = orderProducts?.filter((item: any) => {
            if (item.cancelledDate) {
                return item.paymentStatus === "COMPLETED";
            } else {
                return item.paymentStatus === "COMPLETED" || (item.paymentStatus === "PENDING" && item.shippingStatus === "SHIPPED");
            }
        });
        const totalSellingPrice = completedProducts?.reduce((acc: any, curr: any) => acc + (curr?.sellingPrice || 0), 0);
        const totalShippingCharge = completedProducts?.reduce((acc: any, curr: any) => acc + (curr?.shippingCharge || 0), 0);
        const paidAmount = (totalSellingPrice || 0) + (totalShippingCharge || 0)
        return paidAmount;
    };

    const calculateTotalSellingPrice = () => {
        let totalSellingPrice = 0;
        orderProducts.forEach((product: any) => {
            if (!product.cancelledDate) {
                if (product.paymentStatus === "COMPLETED") {
                    totalSellingPrice += product.sellingPrice;
                } else if (product.paymentStatus === "PENDING") {
                    totalSellingPrice += product.sellingPrice;
                }
            } else {
                if (product.paymentStatus === "COMPLETED") {
                    totalSellingPrice += product.sellingPrice;
                }
            }
        });
        return totalSellingPrice;
    };

    const calculateTotalShippingCharge = () => {
        let totalShippingCharge = 0;
        orderProducts.forEach((product: any) => {
            if (!product.cancelledDate) {
                if (product.paymentStatus === "COMPLETED") {
                    totalShippingCharge += product.shippingCharge;
                } else if (product.paymentStatus === "PENDING") {
                    totalShippingCharge += product.shippingCharge;
                }
            }
        });
        return totalShippingCharge;
    };




    return (
        <React.Fragment>

            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs items={items} currentPage="Details" />
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
                                            </div>

                                            <div >
                                                <div style={{ display: "flex", flexDirection: "row", }}>
                                                    <div style={{ width: "200px" }}>
                                                        <p className="form-control-static">Selling Price</p>
                                                        <p className="form-control-static">Shipping Charge</p>
                                                        <p className="form-control-static" style={{ fontWeight: 500 }}>Paid Amount</p>
                                                        <p className="form-control-static">Refund Amount</p>
                                                        <hr />
                                                        <p className="form-control-static" style={{ fontWeight: 500 }}>Effective Price</p>
                                                    </div>
                                                    <div style={{ textAlign: "right" }}>
                                                        <p className="form-control-static">{formatCurrency(calculateTotalSellingPrice())}</p>
                                                        <p className="form-control-static">{formatCurrency(calculateTotalShippingCharge())}</p>
                                                        <p className="form-control-static" style={{ fontWeight: 500 }}>
                                                            {formatCurrency(
                                                                calculatePaidAmount()
                                                            )}
                                                        </p>
                                                        <p className="form-control-static">{formatCurrency(order?.orderPriceInfo["totalRefundAmount"])}</p>
                                                        <hr />
                                                        <p className="form-control-static" style={{ fontWeight: 500 }}>
                                                            {formatCurrency(
                                                                calculatePaidAmount() -
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
                                        <OrderShippingAddress order={order} />

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
                                                        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
                                                            {Array.isArray(orderProducts) && orderProducts.map((product: ProductsData, index: number) => (
                                                                <OrderProductsDetails key={index} product={product} orderProdcutsRefetch={orderProdcutsRefetch} orderRefetch={orderRefetch} />
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
