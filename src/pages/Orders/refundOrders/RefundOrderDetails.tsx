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
import Iconify from "src/components/iconify";
import OrderShippingAddress from "src/components/orders/OrderShippingAddress";
import StatusChip from "src/components/statusIndicator/StatusChip";

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
  addressType: string;
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
  warehouseSkuId: string | null;

  itemId: string | null;
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
}


const RefundOrderDetails = () => {
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




  const GET_ORDER_PRODUCT = gql`
query GetAdminOrderProduct($input: GetAdminOrderProductInput!) {
  getAdminOrderProduct(input: $input) {
    _id
    userId
    vendorId
    productId
    vendorName
    itemId
    orderId
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
    warehouseSkuId
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

  const items = [
    { text: "Dashboard", link: `/` },
    { text: "Refund Orders", link: `/refund-orders` },
  ];




  const calculatePaidAmount = () => {
    const isPaid = product?.paymentStatus === "COMPLETED";
    const totalSellingPrice = isPaid ? (product?.sellingPrice || 0) : 0;
    const totalShippingCharge = isPaid ? (product?.shippingCharge || 0) : 0;
    const paidAmount = totalSellingPrice + totalShippingCharge;

    return paidAmount;
  };


  const calculateTotalSellingPrice = () => {
    let totalSellingPrice = 0;
    if (!product?.cancelledDate) {
      if (product?.paymentStatus === "COMPLETED" || product?.paymentStatus === "PENDING") {
        totalSellingPrice += product?.sellingPrice || 0;;
      }
    } else {
      if (product.paymentStatus === "COMPLETED") {
        totalSellingPrice += product?.sellingPrice || 0;;
      }
    }
    return totalSellingPrice;
  };

  const calculateTotalShippingCharge = () => {
    let totalShippingCharge = 0;
    if (!product?.cancelledDate) {
      if (product?.paymentStatus === "COMPLETED" || product?.paymentStatus === "PENDING") {
        totalShippingCharge += product?.shippingCharge || 0;
      }
    }
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
                            {
                              product?.shippingStatus !== "NA" &&
                              <p className="form-control-static">Shipping Status</p>
                            }
                            {
                              product?.returnStatus !== "NA" &&
                              <p className="form-control-static">Return  Status</p>
                            }
                            {
                              product?.refundStatus !== "NA" &&
                              <p className="form-control-static">Refund Status</p>
                            }
                          </div>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                              <div onClick={() => navigate(`/orders/details?orderId=${order?.orderId}`)}>
                                {order?.orderId}
                              </div>
                              <div style={{ display: "flex", alignItems: "center", border: "1px solid #e30613", borderRadius: "9px", padding: "5px 10px  5px 10px", cursor: "pointer", color: "#e30613" }} onClick={() => navigate(`/orders/details?orderId=${order?.orderId}`)}>
                                <Iconify icon="majesticons:open" style={{ color: "#e30613" }} />
                                Open Order
                              </div>
                            </div>
                            <p className="form-control-static">{moment(order?.orderDate).format("ll")}</p>
                            <p className="form-control-static">{order?.paymentMode ?? "nill"}</p>
                            {
                              product?.shippingStatus !== "NA" &&
                              <p className="form-control-static">  <StatusChip status={product?.shippingStatus ?? ""} /></p>
                            }
                            {
                              product?.returnStatus !== "NA" &&
                              <p className="form-control-static"> <StatusChip status={product?.returnStatus ?? ""} /></p>
                            }
                            {
                              product?.refundStatus !== "NA" &&
                              <p className="form-control-static">  <StatusChip status={product?.refundStatus ?? ""} /></p>
                            }

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
                            <p className="form-control-static">{formatCurrency(product?.refundAmount)}</p>
                            <hr />
                            <p className="form-control-static" style={{ fontWeight: 500 }}>
                              {formatCurrency(
                                calculatePaidAmount() -
                                (product?.refundAmount ?? 0)
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
                            <div>
                              <OrderProductsDetails product={product} orderProdcutsRefetch={orderProdcutRefetch} orderRefetch={orderRefetch} />
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

export default RefundOrderDetails;
