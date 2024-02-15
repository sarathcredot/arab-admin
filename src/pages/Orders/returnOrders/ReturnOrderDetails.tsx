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
import { formatCurrency } from "src/utils/formatCurrency";
import OrderProductsDetails from "src/components/orders/OrderProductDetails";
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
  _id: string | null;
  userId: string | null;
  productId: string | null;
  orderId: string | null;
  productName: string | null;
  shortDescription: string | null;
  skuId: string | null;
  image: {
    fileType: string | null;
    fileURL: string | null;
    mimeType: string | null;
    originalName: string | null;
  } | null;
  returnPeriod: string | null;
  mrp: number | null;
  sellingPrice: number | null;
  shippingCharge: number | null;
  paymentMode: string | null;
  paymentStatus: string | null;
  paymentRemark: string | null;
  orderDate: string | null;
  shippingStatus: string | null;
  shippedDate: string | null;
  deliveryDate: string | null;
  returnStatus: string | null;
  returnUserReason: string | null;
  returnAdminComment: string | null;
  returnRequestDate: string | null;
  returnRejectedDate: string | null;
  returnDate: string | null;
  refundStatus: string | null;
  refundAmount: number | null;
  refundRequestDate: string | null;
  refundDate: string | null;
  refundComment: string | null;
  cancelUserReason: string | null;
  cancelAdminComment: string | null;
  cancelledDate: string | null;
  courierId: string | null;
  invoiceNumber: string | null;
  invoice: {
    fileType: string | null;
    fileURL: string | null;
    mimeType: string | null;
    originalName: string | null;
  } | null;
  username: string | null;
  itemId: string | null;
}


const ReturnOrderDetails = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderData>();

  const [product, setProduct] = useState<ProductsData | null>(null);
  const orderProductId = searchParams.get("_id");

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

  useEffect(() => {
    if (orderData && orderData.getAdminOrderDetails) {
      let order: OrderData = orderData.getAdminOrderDetails;
      setOrder(order);
    }
  }, [orderData]);



  const GET_ORDER_PRODUCT = gql`
  query GetAdminOrderProduct($input: GetAdminOrderProductInput!) {
   getAdminOrderProduct(input: $input) {
       _id
   userId
   productId
   orderId
   itemId
   productName
   shortDescription
   skuId
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
   image {
     fileURL
     fileType
     mimeType
     originalName
   }
   invoice {
     fileURL
     fileType
     mimeType
     originalName
   }
 }
}
  `

  const {
    data: orderProductData,
    loading: orderProductLoading,
    error: orderProductError,
    refetch: orderProdcutRefetch
  } = useQuery(GET_ORDER_PRODUCT, {
    variables: {
      input: {
        _id: orderProductId
      }
    }
  })

  useEffect(() => {
    if (orderProductData && orderProductData.getAdminOrderProduct) {
      let product: ProductsData = orderProductData.getAdminOrderProduct;
      setProduct(product);
    }
  }, [orderProductData]);




  const items = [
    { text: "Dashboard", link: `/` },
    { text: "Return Orders", link: `/return-orders` },
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
                          </div>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                              <div onClick={() => navigate(`/orders/details?orderId=${order?.orderId}`)}>
                                {order?.orderId}
                              </div>
                              <div style={{ display: "flex", alignItems: "center", border: "1px solid #b12349", borderRadius: "9px", padding: "5px 10px  5px 10px", cursor: "pointer", color: "#b12349" }} onClick={() => navigate(`/orders/details?orderId=${order?.orderId}`)}>
                                <Iconify icon="tabler:hand-click" style={{ color: "#b12349" }} />
                                here
                              </div>
                            </div>
                            <p className="form-control-static">{moment(order?.orderDate).format("ll")}</p>
                            <p className="form-control-static">{order?.paymentMode}</p>

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
                              <OrderProductsDetails product={product} orderProdcutsRefetch={orderProdcutRefetch} />

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

export default ReturnOrderDetails;
