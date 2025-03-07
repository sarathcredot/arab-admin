import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardImg,
  Col,
  Container,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";

import { gql, useMutation, useQuery } from "@apollo/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import Breadcrumbs from "src/components/Common/Breadcrumb";

import "cleave.js/dist/addons/cleave-phone.in";

import { capitalCase, sentenceCase } from "change-case";
import moment from "moment";
import userAvatar from "src/assets/images/users/user-dummy-img.jpg";
import OrderDetails from "src/components/orders/OrderProductDetails";
import { formatCurrency } from "src/utils/formatCurrency";
import OrderProductsDetails from "src/components/orders/OrderProductDetails";
import Iconify from "src/components/iconify";
import OrderShippingAddress from "src/components/orders/OrderShippingAddress";
import StatusChip from "src/components/statusIndicator/StatusChip";
import StatusIndicator from "src/components/statusIndicator/StatusIndicator";
import WarrantyProductDetail from "./Components/WarrantyProductDetail";
import CustomSwiper from "src/components/swiper/Swiper";
import { capitalize } from "lodash";
import CustomButton from "src/components/Common/CustomButton";
import { toast } from "react-toastify";
import styles from "./Warranty.module.scss";

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

// interface OrderPriceInfo {
//   totalMRP: number;
//   totalSellingPrice: number;
//   totalShippingCharge: number;
//   totalRefundAmount: number;
// }

// interface requestData {
//   _id: string;
//   orderId: string;
//   userId: string;
//   paymentMode: string;
//   orderDate: Date;
//   orderStatus: string;
//   username: string;
//   shippingAddress: ShippingAddress;
//   orderPriceInfo: OrderPriceInfo;
// }

// interface ProductsData {
//   _id: string | null;
//   userId: string | null;
//   productId: string | null;
//   orderId: string | null;
//   productName: string | null;
//   shortDescription: string | null;
//   warehouseSkuId: string | null;
//   skuId: string | null;
//   image: {
//     fileType: string | null;
//     fileURL: string | null;
//     mimeType: string | null;
//     originalName: string | null;
//   } | null;
//   returnPeriod: string | null;
//   mrp: number | null;
//   sellingPrice: number | null;
//   shippingCharge: number | null;
//   paymentMode: string | null;
//   paymentStatus: string | null;
//   paymentRemark: string | null;
//   orderDate: string | null;
//   shippingStatus: string | null;
//   shippedDate: string | null;
//   deliveryDate: string | null;
//   returnStatus: string | null;
//   returnUserReason: string | null;
//   returnAdminComment: string | null;
//   returnRequestDate: string | null;
//   returnRejectedDate: string | null;
//   returnDate: string | null;
//   refundStatus: string | null;
//   refundAmount: number | null;
//   refundRequestDate: string | null;
//   refundDate: string | null;
//   refundComment: string | null;
//   cancelUserReason: string | null;
//   cancelAdminComment: string | null;
//   cancelledDate: string | null;
//   courierId: string | null;
//   invoiceNumber: string | null;
//   invoice: {
//     fileType: string | null;
//     fileURL: string | null;
//     mimeType: string | null;
//     originalName: string | null;
//   } | null;
//   username: string | null;
//   itemId: string | null;
// }

const GET_REQUEST = gql`
  query GetClaimRequestDetailsByAdmin($input: getClaimRequestDetailsByAdminInput!) {
    getClaimRequestDetailsByAdmin(input: $input) {
      _id
      user {
        _id
        displayName
      }
      product {
        warranty {
          name
          description
          duration
          warrantyType
        }
        productName
        deliveryDate
        shippingStatus
        orderDate
        paymentStatus
        shippingCharge
        sellingPrice
        shortDescription
        paymentMode
        vendorId
        itemId
        courierId
        invoiceNumber
        warehouseSkuId
        productId
      }
      createdAt
      issueDescription
      order
      warrantyId
      claimStatus
      claimType
      claimDate
      rejectedReason
      rejectedDate
      productImage {
        fileType
        fileURL
        mimeType
        originalName
      }
      warrantyAddress {
        firstname
        email
        mobile
        country
        postCode
        governorate
        village
        governorateID
        villageID
        address
      }
      vendor {
        fullName
      }
      products {
        images {
          fileType
          fileURL
          mimeType
          originalName
        }
      }
      replacementReason
      replacementShippedDate
      replacementCompletedDate
      returnedWarehouseDate
      postponedDate
      postponedReason
      deliveryAgentId
      productImageUploadByAgent {
        fileType
        fileURL
        mimeType
        originalName
      }
      deliveryAgentAssignedOn
      deliveryAgentName
      agent {
        contactNumber
        agentType
      }
    }
  }
`;

const WarrantyOrderProductDetails = () => {
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get("id");
  const navigate = useNavigate();
  const [request, setRequest] = useState<any>();
  const [product, setProduct] = useState<any | null>(null);
  const [claimStatus, setClaimStatus] = useState("");
  const [claimDate, setClaimDate] = useState("");
  const [rejectedDate, setRejectedDate] = useState("");
  const [rejectedReason, setRejectedReason] = useState("");
  const [imageSwiperModal, setImageSwiperModal] = useState(false);
  const [initialSlide, setInitialSlide] = useState(0);
  const toggleImageSwiperModal = (index: any) => {
    setInitialSlide(index);
    setImageSwiperModal(!imageSwiperModal);
  };
  const [approveModal, setApproveModal] = useState(false);
  const toggleApproveModal = () => {
    setApproveModal(!approveModal);
  };
  const handleRequestStatusChange = async (value: string) => {
    setApproveModal(!approveModal);
    setClaimStatus(value);
  };

  const orderProductId = searchParams.get("_id");

  const {
    data: requestData,
    loading: requestLoading,
    error: requestError,
    refetch: requestRefetch,
  } = useQuery(GET_REQUEST, {
    variables: {
      input: {
        claimRequestId: requestId,
      },
    },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (requestData && requestData?.getClaimRequestDetailsByAdmin) {
      let request = requestData?.getClaimRequestDetailsByAdmin;
      setRequest(request);
    }
  }, [requestData]);
  console.log("REQUEST = ", request);

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
  `;

  const UPDATE_REQUEST_STATUS = gql`
    mutation UpdateClaimStatusByAdmin($input: updateClaimStatusByAdminInput!) {
      updateClaimStatusByAdmin(input: $input) {
        success
        message
      }
    }
  `;

  const {
    data: orderProductData,
    loading: orderProductLoading,
    error: orderProductError,
    refetch: orderProdcutRefetch,
  } = useQuery(GET_ORDER_PRODUCT, {
    variables: {
      input: {
        _id: orderProductId,
      },
    },
  });

  useEffect(() => {
    if (orderProductData && orderProductData.getAdminOrderProduct) {
      let product = orderProductData.getAdminOrderProduct;
      setProduct(product);
    }
  }, [orderProductData]);

  const [UpdateRequestStatus] = useMutation(UPDATE_REQUEST_STATUS);

  const items = [
    { text: "Dashboard", link: `/` },
    { text: "Warranty", link: null },
    { text: "Claims And Requests", link: `/warranty-claims` },
  ];

  // const calculatePaidAmount = () => {
  //   const isPaid = product?.paymentStatus === "COMPLETED";
  //   const totalSellingPrice = isPaid ? (product?.sellingPrice || 0) : 0;
  //   const totalShippingCharge = isPaid ? (product?.shippingCharge || 0) : 0;
  //   const totalRefundAmount = order?.orderPriceInfo?.totalRefundAmount || 0;
  //   const paidAmount = totalSellingPrice + totalShippingCharge - totalRefundAmount;

  //   return paidAmount;
  // };

  const calculatePaidAmount = () => {
    const isPaid = product?.paymentStatus === "COMPLETED";
    const totalSellingPrice = isPaid ? product?.sellingPrice || 0 : 0;
    const totalShippingCharge = isPaid ? product?.shippingCharge || 0 : 0;
    const paidAmount = totalSellingPrice + totalShippingCharge;

    return paidAmount;
  };

  const calculateTotalSellingPrice = () => {
    let totalSellingPrice = 0;
    if (!request?.product?.cancelledDate) {
      if (request?.product?.paymentStatus === "COMPLETED" || request?.product?.paymentStatus === "PENDING") {
        totalSellingPrice += request?.product?.sellingPrice || 0;
      }
    } else {
      if (request?.product.paymentStatus === "COMPLETED") {
        totalSellingPrice += request?.product?.sellingPrice || 0;
      }
    }
    return totalSellingPrice;
  };

  const calculateTotalShippingCharge = () => {
    let totalShippingCharge = 0;
    if (!request?.product?.cancelledDate) {
      if (request?.product?.paymentStatus === "COMPLETED" || request?.product?.paymentStatus === "PENDING") {
        totalShippingCharge += request?.product?.shippingCharge || 0;
      }
    }
    return totalShippingCharge;
  };

  const handleClaimStatusSubmit = async () => {
    let Date = null;
    let Reason = null;
    if (claimStatus === "APPROVED") {
      if (claimDate) {
        Date = claimDate;
      } else if (!claimDate) {
        toast.error("Approved Date is required");
        return;
      }
    }
    if (claimStatus === "REJECTED") {
      if (rejectedDate) {
        Date = rejectedDate;
      } else if (!rejectedDate) {
        toast.error("Rejected Date is required");
        return;
      }
      if (rejectedReason) {
        Reason = rejectedReason;
      } else if (!rejectedReason) {
        toast.error("rejected reason is required");
        return;
      }
    }

    try {
      const response = await UpdateRequestStatus({
        variables: {
          input: {
            claimRequestId: request?._id,
            claimStatus: claimStatus,
            Date: Date,
            Reason: Reason,
          },
        },
      });

      if (response?.data?.updateClaimStatusByAdmin) {
        requestRefetch();
        setApproveModal(!approveModal);
        toast.success("Shipping Status has been updated");
        setClaimDate("");
        setRejectedDate("");
        setRejectedReason("");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs
            items={items}
            currentPage="Details"
          />
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
                      ></div>
                      <div>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                          <div style={{ width: "200px" }}>
                            <p className="form-control-static">Warranty ID</p>
                            <p className="form-control-static">Warranty Name</p>
                            {/* <p className="form-control-static">Description</p> */}
                            <p className="form-control-static">Duration</p>
                            <p className="form-control-static">Requested Date</p>
                            <p className="form-control-static">Order ID</p>
                            <p className="form-control-static">Order Date</p>
                            <p className="form-control-static">Payment Mode</p>
                            <p className="form-control-static">Warranty Type</p>
                            {product?.returnStatus !== "NA" && <p className="form-control-static">Warranty Status</p>}
                            {/* {
                              product?.shippingStatus !== "NA" &&
                              <p className="form-control-static">Shipping Status</p>
                            } */}
                            {/* {
                              product?.refundStatus !== "NA" &&
                              <p className="form-control-static">Refund Status</p>
                            } */}
                          </div>
                          <div>
                            <p className="form-control-static">{request?.warrantyId}</p>
                            <p className="form-control-static">{request?.product?.warranty?.name || "nill"}</p>
                            {/* <p className="form-control-static">{request?.product?.warranty?.description}</p> */}
                            <p className="form-control-static">
                              {request?.product?.warranty?.duration
                                ? `${request?.product?.warranty?.duration} Months`
                                : "nill"}
                            </p>
                            <p className="form-control-static">{moment(request?.createdAt).format("ll")}</p>
                            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                              <p
                                style={{ cursor: "pointer" }}
                                onClick={() => navigate(`/orders/details?orderId=${request?.order}`)}
                              >
                                {request?.order || ""}
                              </p>
                              <p
                                style={{ display: "flex", alignItems: "center", cursor: "pointer", color: "#e30613" }}
                                onClick={() => navigate(`/orders/details?orderId=${request?.order}`)}
                              >
                                <Iconify
                                  icon="majesticons:open"
                                  style={{ color: "#e30613" }}
                                />
                                {/* Open Order */}
                              </p>
                            </div>
                            <p className="form-control-static">{moment(request?.product?.orderDate).format("ll")}</p>
                            <p className="form-control-static">{request?.paymentMode ?? "COD"}</p>
                            <p className="form-control-static">{capitalize(request?.claimType)}</p>
                            {request?.claimStatus !== "NA" && (
                              <p className="form-control-static">
                                <StatusChip status={request?.claimStatus ?? ""} />
                                {/* <StatusIndicator variant="chip" status={request?.claimStatus ?? ""} /> */}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col
                      xl={6}
                      className="mt-3"
                    >
                      <p>Client side Images</p>
                      <div className={styles.images_container}>
                        {request?.productImage?.map((image: any, index: any) => (
                          <>
                            <div className={styles.image_div}>
                              <CardImg
                                className={styles.image}
                                alt="product"
                                src={image?.fileURL ?? ""}
                                style={{
                                  height: 70,
                                  width: 70,
                                  cursor: "pointer",
                                }}
                                top
                                width="80px"
                                key={index}
                                onClick={() => toggleImageSwiperModal(index)}
                              />
                              <div
                                className={styles.eye_icon}
                                onClick={() => toggleImageSwiperModal(index)}
                              >
                                <i className="fas fa-eye"></i>{" "}
                              </div>
                            </div>
                          </>
                        ))}
                      </div>
                      <p className="mt-3">Agent side Images</p>
                      <div className={styles.images_container}>
                        {request?.productImageUploadByAgent?.map((image: any, index: any) => (
                          <>
                            <div className={styles.image_div}>
                              <CardImg
                                className={styles.image}
                                alt="product"
                                src={image?.fileURL ?? ""}
                                style={{
                                  height: 70,
                                  width: 70,
                                  cursor: "pointer",
                                }}
                                top
                                width="80px"
                                key={index}
                                onClick={() => toggleImageSwiperModal(index)}
                              />
                              <div
                                className={styles.eye_icon}
                                onClick={() => toggleImageSwiperModal(index)}
                              >
                                <i className="fas fa-eye"></i>{" "}
                              </div>
                            </div>
                          </>
                        ))}
                      </div>

                      {/* <div>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                          <div style={{ width: "200px" }}>
                            <p className="form-control-static">Selling Price</p>
                            <p className="form-control-static">Shipping Charge</p>
                            <p
                              className="form-control-static"
                              style={{ fontWeight: 500 }}
                            >
                              Paid Amount
                            </p>
                            <p className="form-control-static">Refund Amount</p>
                            <hr />
                            <p
                              className="form-control-static"
                              style={{ fontWeight: 500 }}
                            >
                              Effective Price
                            </p>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <p className="form-control-static">{formatCurrency(calculateTotalSellingPrice())}</p>
                            <p className="form-control-static">{formatCurrency(calculateTotalShippingCharge())}</p>
                            <p
                              className="form-control-static"
                              style={{ fontWeight: 500 }}
                            >
                              {formatCurrency(calculatePaidAmount())}
                            </p>
                            <p className="form-control-static">{formatCurrency(request?.product?.refundAmount)}</p>
                            <hr />
                            <p
                              className="form-control-static"
                              style={{ fontWeight: 500 }}
                            >
                              {formatCurrency(calculatePaidAmount() - (request?.product?.refundAmount ?? 0))}
                            </p>
                          </div>
                        </div>
                      </div> */}
                    </Col>
                  </Row>
                  {request?.claimStatus === "PENDING" && (
                    <Row>
                      <div
                        style={{
                          width: "auto",
                          marginLeft: "auto",
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <CustomButton
                          name="Approve"
                          icon="mdi:approve"
                          onClick={() => handleRequestStatusChange("APPROVED")}
                        />
                        <CustomButton
                          name="Reject"
                          icon="material-symbols:close"
                          bgColor="#e30613"
                          onClick={() => handleRequestStatusChange("REJECTED")}
                        />
                      </div>
                    </Row>
                  )}
                </CardHeader>

                <CardBody>
                  <form action="#">
                    <OrderShippingAddress
                      isWarranty={true}
                      order={request}
                    />
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
                                Product:
                              </label>
                            </div>
                            <div>
                              <WarrantyProductDetail
                                product={request}
                                requestRefetch={requestRefetch}
                                orderRefetch={requestRefetch}
                              />
                            </div>
                          </Col>
                          {/* {request?.claimStatus === "PENDING" && (
                            <Col xl={12}>
                              <Card
                                className="my-2"
                                style={{
                                  boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.05)",
                                  padding: 20,
                                }}
                              >
                                <div
                                  style={{
                                    width: "auto",
                                    marginLeft: "auto",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                  }}
                                >
                                  <CustomButton
                                    name="Approve"
                                    icon="mdi:approve"
                                    onClick={() => handleRequestStatusChange("APPROVED")}
                                  />
                                  <CustomButton
                                    name="Reject"
                                    icon="material-symbols:close"
                                    bgColor="#e30613"
                                    onClick={() => handleRequestStatusChange("REJECTED")}
                                  />
                                </div>
                              </Card>
                            </Col>
                          )} */}
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

      {/* ================== CLAIM STATUS MODAL ===================== */}

      <Modal
        isOpen={approveModal}
        toggle={toggleApproveModal}
      >
        <ModalHeader toggle={toggleApproveModal}>Warranty Status</ModalHeader>
        <ModalBody>
          {claimStatus === "PENDING" && (
            <p>
              Are you sure you want to change the status to <b>{capitalCase(claimStatus)} </b> ?
            </p>
          )}
          {claimStatus === "APPROVED" && (
            <>
              <p>
                Are you sure you want to <b>Approve </b> this Request ?
              </p>
              <FormGroup>
                <Label for="claimDate">Enter Approved Date</Label>
                <Input
                  type="date"
                  name="claimDate"
                  id="claimDate"
                  required
                  value={claimDate}
                  onChange={(e) => setClaimDate(e.target.value)}
                />
              </FormGroup>
            </>
          )}
          {claimStatus === "REJECTED" && (
            <>
              <p>
                Are you sure you want to <b>Reject </b> this Request ?
              </p>

              <FormGroup>
                <Label for="rejectedDate">Enter Rejected Date</Label>
                <Input
                  type="date"
                  name="rejectedDate"
                  id="rejectedDate"
                  value={rejectedDate}
                  onChange={(e) => setRejectedDate(e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label for="rejectedReason">Admin Rejected Reason</Label>
                <Input
                  type="text"
                  name="rejectedReason"
                  id="rejectedReason"
                  value={rejectedReason}
                  onChange={(e) => setRejectedReason(e.target.value)}
                />
              </FormGroup>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={handleClaimStatusSubmit}
          >
            Submit
          </Button>{" "}
          <Button
            color="secondary"
            onClick={toggleApproveModal}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* IMAGE SWIPER MODAL */}
      <Modal
        isOpen={imageSwiperModal}
        toggle={toggleImageSwiperModal}
        // size="lg"
        fullscreen
        style={{ "--bs-modal-bg": "transparent",backdropFilter:"blur(10px)" } as any}
      >
        <ModalHeader style={{border:0,padding:"10px 20px 0"}} toggle={toggleImageSwiperModal}></ModalHeader>
        <ModalBody
          style={{ padding:"0 0 20px" }}
          onClick={toggleImageSwiperModal}
        >
          <CustomSwiper
            data={request?.productImage}
            initialSlide={initialSlide}
          />
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default WarrantyOrderProductDetails;
