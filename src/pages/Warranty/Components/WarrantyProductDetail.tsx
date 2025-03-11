import React, { ChangeEvent, useEffect, useMemo } from "react";
import "cleave.js/dist/addons/cleave-phone.in";
import FeatherIcon from "feather-icons-react";
import { Link, useNavigate } from "react-router-dom";
import { CiEdit, CiDeliveryTruck } from "react-icons/ci";
import { PiClockCounterClockwise } from "react-icons/pi";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardImg,
  CardSubtitle,
  CardText,
  CardTitle,
  Col,
  Collapse,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";

import { FormGroup, Input, Label } from "reactstrap";

import "cleave.js/dist/addons/cleave-phone.in";
import { useState } from "react";
import { formatCurrency } from "src/utils/formatCurrency";
import moment from "moment";
// import Iconify from "../iconify/Iconify";
import { capitalCase } from "change-case";
import { gql, useMutation, useQuery } from "@apollo/client";
import { toast, ToastContainer } from "react-toastify";
import { fetchSignedUrl, useFetchSignedUrl } from "src/utils/fetchSignedUrl";
import { Dropdown } from "react-bootstrap";
import { BsThreeDotsVertical } from "react-icons/bs";

import { IoMdAdd } from "react-icons/io";

import styles from "src/components/orders/OrderProductDetails.module.scss";
import Iconify from "src/components/iconify/Iconify";
import ConfirmationOtpPopup from "src/components/orders/ConfirmationOtpPopup";
// import CustomSwiper from "../swiper/Swiper";

type CLAIM_TYPE = "REPLACEMENT" | "REPAIR" | null;

const ASSIGN_ORDER = gql`
  mutation WarrantyCallAssignDeliveryAgent($input: warrantyCallAssignDeliveryAgent!) {
    warrantyCallAssignDeliveryAgent(input: $input) {
      status
      msg
    }
  }
`;

const GET_VENDOR_FOR_SELECT = gql`
  query GetAllVendors($input: VendorsRecordsByAdminFilter) {
    getAllVendorsRecordsByAdmin(input: $input) {
      maxRecords
      records {
        _id
        fullName
      }
      message
    }
  }
`;

const GET_LOCATION = gql`
  query GetLocationsData {
    getLocationsData {
      name
      _id
      villages {
        _id
        name
      }
    }
  }
`;
const GET_PRODUCT_DELIVERY_TYPE_DELIVERY_AGENTS = gql`
  query GetProductDeliveryTypeDeliveryAgents($input: GetProductDeliveryTypeDeliveryAgentsInput!) {
    getProductDeliveryTypeDeliveryAgents(input: $input) {
      deliveryType
      deliveryAgents {
        _id
        fullName
        agentType
      }
    }
  }
`;

const GET_PRODUCT_DELIVERY_TYPE_DELIVERY_AGENTS_CUSTOMIZE = gql`
  query GetDeliveryAgentlistCustomizOrderAssigen($input: getDeliveryAgentlistCustomizOrderAssigenInput) {
    getDeliveryAgentlistCustomizOrderAssigen(input: $input) {
      _id
      fullName
      contactNumber
    }
  }
`;

const UPDATE_REQUEST_STATUS = gql`
  mutation UpdateClaimStatusByAdmin($input: updateClaimStatusByAdminInput!) {
    updateClaimStatusByAdmin(input: $input) {
      success
      message
      otp
    }
  }
`;
const VERIFY_OTP = gql`
  mutation ClaimOtpVerificationByAdminAGentStatus($input: claimOtpVerificationByAdminAGentStatusInput) {
    claimOtpVerificationByAdminAGentStatus(input: $input) {
      status
      msg
    }
  }
`;

function WarrantyProductDetail({ product, requestRefetch, orderRefetch }: any) {
  const navigate = useNavigate();

  // [[[[[[  WARRANTY ]]]]]]]]

  const [approveModal, setApproveModal] = useState(false);
  const [claimStatus, setClaimStatus] = useState("");
  // const [claimDate, setClaimDate] = useState("");
  // const [rejectedDate, setRejectedDate] = useState("");
  // const [shippedDate, setShippedDate] = useState("");
  // const [completedDate, setCompletedDate] = useState("");
  // const [warehouseDate, setWarehouseDate] = useState("");
  const [rejectedReason, setRejectedReason] = useState("");
  const [shippingOTP, setShippingOTP] = useState<string>("");
  const [openShippingStatusOTP, setOpenShippingStatusOTP] = useState<boolean>(false);

  // [[[[[[[[[[ INVOICE ]]]]]]]]]]

  const [invoiceModal, setInvoiceModal] = useState(false);
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [signedUrl, setSignedUrl] = useState("");

  // [[[[[[[[[[[[[ COMMENTS ]]]]]]]]]]]]]

  const [commentEditModal, setCommentEditModal] = useState(false);
  const [commentFormData, setCommentFormData] = useState({
    issueDescription: "",
    adminRejectedReason: "",
  });

  useEffect(() => {
    setCommentFormData({
      issueDescription: product?.issueDescription,
      adminRejectedReason: product?.rejectedReason,
    });
  }, [commentEditModal, product]);

  useEffect(() => {
    setInvoiceNumber(product?.invoiceNumber);
  }, [product]);

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const toggleInvoiceModal = () => setInvoiceModal(!invoiceModal);
  const toggleDeliveryAssignModal = () => {
    setDeliveryBoyId("");
    setDeliveryBoyName("");
    setDeliveryAssignModal(!deliveryAssignModal);
  };

  // =========================  SHIPPING ================================
  const [AssignOrder] = useMutation(ASSIGN_ORDER);
  const [UpdateRequestStatus] = useMutation(UPDATE_REQUEST_STATUS);
  const [VerifyOTP] = useMutation(VERIFY_OTP);

  const toggleApproveModal = () => {
    setApproveModal(!approveModal);
    setIsCustomize(false);
  };
  const toggleShippingOtpModal = () => {
    setOpenShippingStatusOTP(!openShippingStatusOTP);
  };

  const handleRequestStatusChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setClaimStatus(e.target.value);

    if (
      e.target.value === "REPLACEMENT_COMPLETED" ||
      e.target.value === "OUT_FOR_DELIVERY" ||
      e.target.value === "RETURNED_TO_WAREHOUSE" ||
      e.target.value === "POSTPONED"
    ) {
      if (product?.deliveryAgentId) {
        setApproveModal(!approveModal);
      } else {
        toast.error("Please assign a delivery agent before proceeding.");
      }
    } else {
      setApproveModal(!approveModal);
    }
  };

  const handleClaimStatusSubmit = async () => {
    // let Date = null;
    let Reason = null;
    let agentStatus = false;
    if (claimStatus === "APPROVED") {
      // if (claimDate) {
      //   Date = claimDate;
      // } else {
      //   toast.error("Approved Date is required");
      //   return;
      // }
    }
    if (claimStatus === "REJECTED") {
      if (product?.deliveryAgentId) {
        agentStatus = true;
      }
      if (rejectedReason) {
        Reason = rejectedReason;
      } else {
        toast.error("rejected reason is required");
        return;
      }
    }
    if (claimStatus === "OUT_FOR_DELIVERY") {
      agentStatus = true;
    }
    if (claimStatus === "REPLACEMENT_COMPLETED") {
      agentStatus = true;
    }
    if (claimStatus === "RETURNED_TO_WAREHOUSE") {
      agentStatus = true;
    }
    if (claimStatus === "POSTPONED") {
      agentStatus = true;
    }

    try {
      const result = await UpdateRequestStatus({
        variables: {
          input: {
            claimRequestId: product?._id,
            claimStatus: claimStatus,
            Date: new Date().toISOString().split("T")[0],
            Reason: Reason,
            agentStatus,
          },
        },
      });
      console.log("RESULT = ", result);
      if (result?.data?.updateClaimStatusByAdmin?.success) {
        const data = result?.data?.updateClaimStatusByAdmin;
        setApproveModal(!approveModal);
        if (data?.otp) {
          toggleShippingOtpModal();
        } else {
          requestRefetch();
          orderRefetch();
          setRejectedReason("");
          // setClaimDate("");
          // setRejectedDate("");
          toast.success("Shipping Status has been updated");
          if (claimStatus === "REPLACEMENT_SHIPPED") {
            handleAssignClick(result?.data?.updateAdminOrderProduct?._id, "REPLACEMENT");
          }
        }
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const result = await VerifyOTP({
        variables: {
          input: {
            agentId: product?.deliveryAgentId,
            claimRequestId: product?._id,
            claimStatus: claimStatus,
            code: shippingOTP,
            remarks: rejectedReason,
          },
        },
      });
      if (result?.data?.claimOtpVerificationByAdminAGentStatus?.status) {
        toast.success(result?.data?.claimOtpVerificationByAdminAGentStatus?.msg);
        requestRefetch();
        orderRefetch();
        setRejectedReason("");
        toggleShippingOtpModal();
      }
    } catch (error: any) {
      console.log("ERROR = ", error);
      toast.error(error?.message || error);
    }
  };

  // =========================== RETURN =================================

  const getAdminSignedUrl = useFetchSignedUrl();

  const handleFetchSignedUrl = async () => {
    const url = product?.invoice?.fileURL;
    const mimeType = product?.invoice?.mimeType;

    const signedUrl = await fetchSignedUrl(getAdminSignedUrl, url, mimeType);
    if (signedUrl) {
      setSignedUrl(signedUrl);
    } else {
      console.error("Failed to fetch signed URL");
    }
  };

  useEffect(() => {
    handleFetchSignedUrl();
  }, [requestRefetch, signedUrl, product?.invoice?.fileURL]);

  // COMMENTS

  const toggleCommentEditModal = () => {
    setCommentEditModal(!commentEditModal);
  };

  const handleCommentsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCommentFormData({
      ...commentFormData,
      [name]: value,
    });
  };

  const handleCommentEditSubmit = async () => {
    // try {
    //   const result = await UpdateProduct({
    //     variables: {
    //       input: {
    //         _id: product?._id,
    //         cancelUserReason: commentFormData.cancelReasonUser,
    //         cancelAdminComment: commentFormData.cancelCommentAdmin,
    //         returnUserReason: commentFormData.returnReasonUser,
    //         returnAdminComment: commentFormData.returnCommentAdmin,
    //         refundComment: commentFormData.refundCommentAdmin,
    //       },
    //     },
    //   });
    //   if (result.data.updateAdminOrderProduct) {
    //     orderRefetch();
    //     requestRefetch();
    //     setCommentEditModal(!commentEditModal);
    //     toast.success("Comments has been updated");
    //   }
    // } catch (error: any) {
    //   console.error(error);
    //   toast.error(error.message);
    // }
  };

  //DELIVERY BOY ASSIGN ORDER ==============================================

  const [deliveryAssignModal, setDeliveryAssignModal] = useState(false);
  const [deliveryBoyId, setDeliveryBoyId] = useState<string>();
  const [deliveryBoyName, setDeliveryBoyName] = useState<string>("");
  const [claimType, setClaimType] = useState<CLAIM_TYPE>(null);
  const [deliveryAgentType, setDeliveryAgentType] = useState<"ArabDeals" | "Vendor" | "ThirdParty" | "">("");
  const [isCustomize, setIsCustomize] = useState(false);
  const [vendorId, setVendorId] = useState("");
  const [villageId, setVillageId] = useState("");
  const [governateId, setGovernateId] = useState("");
  const [villages, setvillages] = useState([]);

  const [bundleCount, setBundleCount] = useState("1");

  const [orderItemId, setOrderItemId] = useState<any>(null);

  const handleCustomize = (value: any) => {
    if (value) {
      setGovernateId(product?.warrantyAddress?.governorateID);
      handleGovernorateChange(product?.warrantyAddress?.governorateID);
      setVillageId(product?.warrantyAddress?.villageID);
    }
    setIsCustomize(value);
  };

  const handleGovernorateChange = (governorateId: any) => {
    setGovernateId(governorateId);
    const selectedGovernorate = getLocation?.getLocationsData?.find((g: any) => g._id === governorateId);
    setvillages(selectedGovernorate?.villages || []);
  };

  const handleAssignClick = (itemId: string, claimType: CLAIM_TYPE) => {
    toggleDeliveryAssignModal();
    // setOrderItemId(itemId);
    setClaimType(claimType);
  };

  const { data: getLocation, loading: getLocationLoading, error: getLocationError } = useQuery(GET_LOCATION);

  const {
    loading: vendorLoading,
    error: vendorError,
    data: vendorDataResponse,
  } = useQuery(GET_VENDOR_FOR_SELECT, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        isKycCompleted: true,
      },
    },
  });

  const {
    data: deliveryAgentList,
    loading: deliveryAgentListLoading,
    error: deliveryAgentListError,
    refetch: refetchDeliveryAgentsList,
  } = useQuery(GET_PRODUCT_DELIVERY_TYPE_DELIVERY_AGENTS, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        productId: product?.product?.productId,
        villageID: product?.warrantyAddress?.villageID,
        governorateID: product?.warrantyAddress?.governorateID,
      },
    },
    skip: isCustomize,
  });

  const customizeInput = useMemo(() => {
    let obj: any = {};

    if (villageId) {
      obj.villageID = villageId;
    }
    if (governateId) {
      obj.governorateID = governateId;
    }
    if (vendorId) {
      obj.vendorID = vendorId;
    }
    if (deliveryAgentType) {
      obj.deliveryAgentType = deliveryAgentType;
    }

    return obj;
  }, [villageId, governateId, vendorId, deliveryAgentType]);

  const {
    data: deliveryAgentListCustomize,
    loading: deliveryAgentCustomizeListLoading,
    error: deliveryAgentCustomizeListError,
    refetch: refetchDeliveryAgentsListCustomize,
  } = useQuery(GET_PRODUCT_DELIVERY_TYPE_DELIVERY_AGENTS_CUSTOMIZE, {
    fetchPolicy: "network-only",
    variables: {
      input: customizeInput,
    },
    skip: !isCustomize,
  });

  useEffect(() => {
    if (deliveryAgentList?.getProductDeliveryTypeDeliveryAgents?.deliveryType) {
      setDeliveryAgentType(deliveryAgentList?.getProductDeliveryTypeDeliveryAgents?.deliveryType);
    }
  }, [deliveryAgentList]);

  useEffect(() => {
    if (isCustomize) {
      refetchDeliveryAgentsListCustomize();
    } else {
      refetchDeliveryAgentsList();
    }
  }, [isCustomize]);

  const handleAssignOrder = async () => {
    console.log("in 1");
    try {
      if (!orderItemId && !product?._id) throw new Error("Can't find order Item !");
      if (!deliveryBoyId) throw new Error("Select a Delivery Agent!");
      if (!deliveryBoyName) throw new Error("Select a Delivery Agent!");

      const variables = {
        input: {
          warrantyCallID: product?._id,
          deliveryAgentId: deliveryBoyId,
          deliveryAgentName: deliveryBoyName,
          bundleCount: parseInt(bundleCount),
        },
      };

      let response: any = null;

      if (claimType === "REPLACEMENT") {
        response = await AssignOrder({
          variables,
        });
      } else if (claimType === "REPAIR") {
      }
      console.log("claimType = ", claimType);

      console.log("RESPONSE = ", response);
      if (response) {
        const { errors, data } = response;
        console.log("RESS = ", { errors, data });

        const success = data?.warrantyCallAssignDeliveryAgent?.status
          ? data?.warrantyCallAssignDeliveryAgent?.status
          : data?.returnwarrantyCallAssignDeliveryAgent?.status;
        const message = data?.warrantyCallAssignDeliveryAgent?.msg
          ? data?.warrantyCallAssignDeliveryAgent?.msg
          : data?.returnwarrantyCallAssignDeliveryAgent?.msg;

        if (success) {
          toast.success(message);
          setVillageId("");
          setvillages([]);
          setGovernateId("");
          setVendorId("");
          setIsCustomize(false);
          toggleDeliveryAssignModal();
          requestRefetch();
        }
      }
    } catch (error: any) {
      console.log(error, "ERROR IN ASSIGN ORDER !!");
      toast.error(error?.message);
    }
  };
  console.log("PRODUCT = ", product);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <Card
        className="my-2"
        style={{
          boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.05)",
        }}
      >
        <CardHeader>
          <div
            style={{ width: "400px", cursor: "pointer" }}
            onClick={() => navigate(`/vendors/view?id=${product?.product?.vendorId}`)}
          >
            <p
              style={{
                margin: 0,
                fontWeight: 500,
                display: "flex",
                fontSize: "16px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontWeight: 500,
                  width: "120px",
                  fontSize: "16px",
                }}
              >
                Vendor ID :{" "}
              </p>
              {product?.product?.vendorId}
            </p>
            <p
              style={{
                margin: 0,
                fontWeight: 500,
                display: "flex",
                fontSize: "16px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontWeight: 500,
                  width: "120px",
                  fontSize: "16px",
                }}
              >
                Vendor name :{" "}
              </p>
              {product?.vendor && capitalCase(product?.vendor?.fullName)}
            </p>
          </div>
        </CardHeader>
        <CardBody style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                width: "80%",
                cursor: "pointer",
              }}
              onClick={() => navigate(`/product/details?_id=${product?.product?.productId}`)}
            >
              <div style={{ width: "80px" }}>
                <CardImg
                  alt="product"
                  src={product?.products?.images[0]?.fileURL ?? ""}
                  style={{
                    height: 70,
                    width: 70,
                  }}
                  top
                  width="80px"
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <CardTitle tag="h4">
                  <p style={{ fontSize: "20px", margin: "0" }}>{product?.product?.productName}</p>
                </CardTitle>
                <CardSubtitle
                  className="mb-2 text-muted"
                  tag="h6"
                >
                  W.Sku ID : {product?.product?.warehouseSkuId || "nill"}
                </CardSubtitle>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              {/* <CustomButton
                icon="ic:baseline-edit"
                onClick={toggleProductEditModal}
                name="Edit Product"
              /> */}
              <Dropdown>
                <Dropdown.Toggle
                  style={{ margin: 0, padding: 0 }}
                  variant=""
                  id="dropdown-basic"
                >
                  <div
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      padding: "4px",
                    }}
                  >
                    <BsThreeDotsVertical size={20} />
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => handleAssignClick(product?._id, "REPLACEMENT")}
                    style={{ display: "flex", gap: 5 }}
                    disabled={product?.claimStatus !== "REPLACEMENT_SHIPPED"}
                  >
                    <CiDeliveryTruck size={20} />
                    Assign Delivery Boy
                  </Dropdown.Item>
                  <Dropdown.Item
                    style={{ display: "flex", gap: 5 }}
                    onClick={() =>
                      navigate(
                        `/warranty-claims/details/activity-log?warranty=${product?.warrantyId}&_id=${product?._id}`
                      )
                    }
                  >
                    <PiClockCounterClockwise size={20} />
                    Activity Log
                  </Dropdown.Item>
                  {/* <Dropdown.Divider /> */}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>

          <CardText>{product?.shortDescription}</CardText>
          <Row>
            <Col xl={4}>
              <CardText>
                <p
                  className="form-control-static"
                  style={{ fontWeight: 500 }}
                >
                  Details
                </p>

                <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
                  <div style={{ width: "220px" }}>
                    <p
                      className="form-control-static"
                      style={{ margin: 10 }}
                    >
                      Item Id
                    </p>
                    <p
                      className="form-control-static"
                      style={{ margin: 10 }}
                    >
                      Courier ID
                    </p>
                    <p
                      className="form-control-static"
                      style={{ margin: 10 }}
                    >
                      Invoice Number
                    </p>
                    <p
                      className="form-control-static"
                      style={{ margin: 10 }}
                    >
                      Pyment Status
                    </p>
                    <p
                      className="form-control-static"
                      style={{ margin: 10 }}
                    >
                      Selling Price
                    </p>
                    <p
                      className="form-control-static"
                      style={{ margin: 10 }}
                    >
                      Shipping Charge
                    </p>
                    {product?.refundAmount ? (
                      <p
                        className="form-control-static"
                        style={{ margin: 10 }}
                      >
                        Refund Amount
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                  <div style={{ width: "100%" }}>
                    <p
                      className="form-control-static"
                      style={{ margin: 10 }}
                    >
                      {product?.product?.itemId || "nill"}
                    </p>
                    <p
                      className="form-control-static"
                      style={{ margin: 10 }}
                    >
                      {product?.product?.courierId || "nill"}
                    </p>
                    <p
                      className="form-control-static"
                      style={{ margin: 10 }}
                    >
                      {product?.product?.invoiceNumber || "nill"}
                    </p>
                    <p
                      className="form-control-static"
                      style={{ margin: 10 }}
                    >
                      {product?.product?.paymentStatus || "nill"}
                    </p>
                    <p
                      className="form-control-static"
                      style={{ margin: 10 }}
                    >
                      {formatCurrency(product?.product?.sellingPrice)}
                    </p>
                    <p
                      className="form-control-static"
                      style={{ margin: 10 }}
                    >
                      {formatCurrency(product?.product?.shippingCharge)}
                    </p>
                    {product?.refundAmount ? (
                      <p
                        className="form-control-static"
                        style={{ margin: 10 }}
                      >
                        {formatCurrency(product?.refundAmount)}
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </CardText>
            </Col>
            <Col xl={4}>
              <div>
                <FormGroup>
                  <Label for="exampleSelect">Warranty Status</Label>
                  {product?.claimStatus === "REJECTED" || product?.claimStatus === "PENDING" ? (
                    <Input
                      id="exampleSelect"
                      name="select"
                      type="select"
                      value={product?.claimStatus}
                      disabled
                    >
                      <option value={"PENDING"}>Pending</option>
                      <option value={"REJECTED"}>Rejected</option>
                    </Input>
                  ) : (
                    <Input
                      id="exampleSelect"
                      name="select"
                      type="select"
                      value={product?.claimStatus}
                      onChange={(e) => handleRequestStatusChange(e)}
                    >
                      <option
                        disabled
                        value={"PENDING"}
                      >
                        Pending
                      </option>
                      <option value={"REJECTED"}>Rejected</option>
                      <option value={"APPROVED"}>Approved</option>
                      <option value={"PACKAGE_IN_PROGRESS"}>Package in progress</option>
                      <option value={"REPLACEMENT_SHIPPED"}>Shipped</option>
                      <option value={"OUT_FOR_DELIVERY"}>Out for delivery</option>
                      <option value={"REPLACEMENT_COMPLETED"}>Replacement Completed</option>
                      <option value={"RETURNED_TO_WAREHOUSE"}>Returned to warehouse</option>
                      <option value={"POSTPONED"}>Postponed to tomorrow</option>
                    </Input>
                  )}
                </FormGroup>
              </div>
            </Col>
            <Col xl={4}>
              <CardText>
                <p
                  className="form-control-static"
                  style={{ fontWeight: 500 }}
                >
                  Date
                </p>

                <div style={{ display: "flex", flexDirection: "row" }}>
                  <div style={{ width: "200px" }}>
                    {product?.product?.orderDate && (
                      <p
                        className="form-control-static"
                        style={{ margin: 10 }}
                      >
                        Order Date
                      </p>
                    )}
                    {product?.product?.shippedDate && (
                      <p
                        className="form-control-static"
                        style={{ margin: 10 }}
                      >
                        Order Shipped Date
                      </p>
                    )}
                    {product?.product?.deliveryDate && (
                      <p
                        className="form-control-static"
                        style={{ margin: 10 }}
                      >
                        Delivery Date
                      </p>
                    )}
                    {product?.createdAt && (
                      <p
                        className="form-control-static"
                        style={{ margin: 10 }}
                      >
                        Requested Date
                      </p>
                    )}
                    {product?.claimDate && (
                      <p
                        className="form-control-static"
                        style={{ margin: 10 }}
                      >
                        Request Approved Date
                      </p>
                    )}
                    {product?.replacementShippedDate && (
                      <p
                        className="form-control-static"
                        style={{ margin: 10 }}
                      >
                        Shipped Date
                      </p>
                    )}
                    {product?.replacementCompletedDate && (
                      <p
                        className="form-control-static"
                        style={{ margin: 10 }}
                      >
                        Replacement Completed Date
                      </p>
                    )}
                    {product?.returnedWarehouseDate && (
                      <p
                        className="form-control-static"
                        style={{ margin: 10 }}
                      >
                        Returned To Warehouse Date
                      </p>
                    )}
                    {product?.rejectedDate && (
                      <p
                        className="form-control-static"
                        style={{ margin: 10 }}
                      >
                        Request Rejected Date
                      </p>
                    )}
                  </div>
                  <div>
                    {product?.product?.orderDate && (
                      <p
                        className="form-control-static"
                        style={{ margin: 10 }}
                      >
                        {moment(product?.product?.orderDate).format("L")}
                      </p>
                    )}
                    {product?.product?.shippedDate && (
                      <p
                        className="form-control-static"
                        style={{ margin: 10 }}
                      >
                        {moment(product?.product?.shippedDate).format("L")}
                      </p>
                    )}
                    {product?.product?.deliveryDate && (
                      <p
                        className="form-control-static"
                        style={{ margin: 10 }}
                      >
                        {moment(product?.product?.deliveryDate).format("L")}
                      </p>
                    )}
                    {product?.createdAt && (
                      <p
                        className="form-control-static"
                        style={{ margin: 10 }}
                      >
                        {moment(product?.createdAt).format("L")}
                      </p>
                    )}
                    {product?.claimDate && (
                      <p
                        className="form-control-static"
                        style={{ margin: 10 }}
                      >
                        {moment(product?.claimDate).format("L")}
                      </p>
                    )}
                    {product?.replacementShippedDate && (
                      <p
                        className="form-control-static"
                        style={{ margin: 10 }}
                      >
                        {moment(product?.replacementShippedDate).format("L")}
                      </p>
                    )}
                    {product?.replacementCompletedDate && (
                      <p
                        className="form-control-static"
                        style={{ margin: 10 }}
                      >
                        {moment(product?.replacementCompletedDate).format("L")}
                      </p>
                    )}
                    {product?.returnedWarehouseDate && (
                      <p
                        className="form-control-static"
                        style={{ margin: 10 }}
                      >
                        {moment(product?.returnedWarehouseDate).format("L")}
                      </p>
                    )}
                    {product?.rejectedDate && (
                      <p
                        className="form-control-static"
                        style={{ margin: 10 }}
                      >
                        {moment(product?.rejectedDate).format("L")}
                      </p>
                    )}
                  </div>
                </div>
              </CardText>
            </Col>
          </Row>
          <Row style={{ display: "flex" }}>
            <Col xl={4}>
              <CardText>
                <p
                  className="form-control-static"
                  style={{ fontWeight: 500 }}
                >
                  Delivery Boy Details
                </p>

                <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
                  <div style={{ width: "220px" }}>
                    <p
                      className="form-control-static"
                      style={{ margin: 10 }}
                    >
                      Agent Type
                    </p>
                    <p
                      className="form-control-static"
                      style={{ margin: 10 }}
                    >
                      Delivery Boy
                    </p>
                    <p
                      className="form-control-static"
                      style={{ margin: 10 }}
                    >
                      Mobile
                    </p>
                    <p
                      className="form-control-static"
                      style={{ margin: 10 }}
                    >
                      Assigned On
                    </p>
                  </div>
                  <div style={{ width: "100%" }}>
                    <p
                      className="form-control-static"
                      style={{ margin: 10 }}
                    >
                      {product?.agent?.agentType || "nill"}
                    </p>
                    <p
                      className="form-control-static"
                      style={{ margin: 10 }}
                    >
                      {product?.deliveryAgentName || "nill"}
                    </p>
                    <p
                      className="form-control-static"
                      style={{ margin: 10 }}
                    >
                      {product?.agent?.contactNumber || "nill"}
                    </p>
                    <p
                      className="form-control-static"
                      style={{ margin: 10 }}
                    >
                      {(product?.deliveryAgentAssignedOn && moment(product?.deliveryAgentAssignedOn).format("L")) ||
                        "nill"}
                    </p>
                  </div>
                </div>
              </CardText>
            </Col>
          </Row>

          {/* <div style={{ marginBottom: "55px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div>
                <label htmlFor="cleave-time-format" style={{ margin: "0" }}>
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
                  fontSize: "13px",
                }}
              >
                {!product?.invoiceNumber && !product?.invoice?.fileURL ? (
                  <>
                    <FeatherIcon icon="plus" className="icon-sm" /> Add Invoice
                  </>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "4px",
                    }}
                  >
                    <Iconify
                      icon="ic:baseline-edit"
                      style={{ fontSize: "5px" }}
                      width={18}
                    />
                    Edit Invoice
                  </div>
                )}
              </Button>
            </div>
            <div style={{ marginTop: "30px" }}>
              <img
                style={{ cursor: "pointer", border: "1px solid black" }}
                width={"150px"}
                src={signedUrl}
                onClick={() => window.open(signedUrl)}
              />
            </div>
          </div> */}

          <Button
            onClick={toggle}
            color="primary"
            style={{ margin: "0 auto 0px auto" }}
          >
            {!isOpen ? (
              <>
                View More
                <FeatherIcon
                  icon="chevron-down"
                  className="icon-sm"
                />
              </>
            ) : (
              <>
                View Less
                <FeatherIcon
                  icon="chevron-up"
                  className="icon-sm"
                />
              </>
            )}
          </Button>
          <div>
            <Collapse isOpen={isOpen}>
              <Card>
                <CardBody>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "flex-end",
                    }}
                  >
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
                        fontSize: "12px",
                      }}
                    >
                      <Iconify
                        icon="ic:baseline-edit"
                        style={{ fontSize: "5px" }}
                        width={16}
                      />{" "}
                      Edit Comments
                    </Button>
                  </div>
                  <div className={styles.comment_image_container}>
                    <div style={{ width: "100%" }}>
                      <div>
                        <h5 style={{ color: "#b12349", marginBottom: "20px" }}>Warranty</h5>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 0,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: "20px",
                              width: "100%",
                            }}
                          >
                            <h6 style={{ width: "160px" }}>User Reason</h6>
                            <div>
                              <p>: {product?.issueDescription || "nill"}</p>
                            </div>
                          </div>
                          {product?.claimStatus === "REJECTED" && (
                            <div style={{ display: "flex", gap: "20px" }}>
                              <h6 style={{ width: "180px" }}>Admin Rejected Reason</h6>
                              <div>
                                <p>: {product?.rejectedReason || "nill"}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className={styles.image_container}>
                      {product?.returnProductImage &&
                        product?.returnProductImage?.length > 0 &&
                        product?.returnProductImage?.map((el: any) => (
                          <div
                            key={el?._id}
                            className={styles.returnImageContainer}
                            // onClick={toggleReturnImageSwiperModal}
                          >
                            <img
                              key={el?._id}
                              src={el?.fileURL}
                              alt="Return product Image"
                              width={100}
                              height={100}
                            />
                            <div className={styles.viewIcon}>
                              <i className="fas fa-eye"></i>{" "}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Collapse>
          </div>
        </CardBody>
      </Card>

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
                Are you sure you want to <b>{capitalCase(claimStatus)} this Request </b>?
              </p>
              {/* <FormGroup>
                <Label for="claimDate">Enter Approved Date</Label>
                <Input
                  type="date"
                  name="claimDate"
                  id="claimDate"
                  required
                  value={claimDate}
                  onChange={(e) => setClaimDate(e.target.value)}
                />
              </FormGroup> */}
            </>
          )}
          {claimStatus === "REJECTED" && (
            <>
              <p>
                Are you sure you want to <b>{capitalCase(claimStatus)} this Request </b>?
              </p>

              {/* <FormGroup>
                <Label for="rejectedDate">Enter Rejected Date</Label>
                <Input
                  type="date"
                  name="rejectedDate"
                  id="rejectedDate"
                  value={rejectedDate}
                  onChange={(e) => setRejectedDate(e.target.value)}
                />
              </FormGroup> */}
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
          {claimStatus === "PACKAGE_IN_PROGRESS" && (
            <p>
              Are you sure you want to change the status to <b>{capitalCase(claimStatus)} </b> ?
            </p>
          )}
          {claimStatus === "OUT_FOR_DELIVERY" && (
            <p>
              Are you sure you want to change the status to <b>{capitalCase(claimStatus)} </b> ?
            </p>
          )}
          {claimStatus === "POSTPONED" && (
            <p>
              Are you sure you want to change the status to <b>{capitalCase(claimStatus)} </b> ?
            </p>
          )}
          {claimStatus === "REPLACEMENT_SHIPPED" && (
            <>
              <p>
                Are you sure you want to change the status to <b>{capitalCase(claimStatus)} </b>?
              </p>
              {/* <FormGroup>
                <Label for="shippedDate">Enter Shipped Date</Label>
                <Input
                  type="date"
                  name="shippedDate"
                  id="shippedDate"
                  required
                  value={shippedDate}
                  onChange={(e) => setShippedDate(e.target.value)}
                />
              </FormGroup> */}
            </>
          )}
          {claimStatus === "REPLACEMENT_COMPLETED" && (
            <>
              <p>
                Are you sure you want to change the status to <b>{capitalCase(claimStatus)} </b>?
              </p>
              {/* <FormGroup>
                <Label for="shippedDate">Enter Completed Date</Label>
                <Input
                  type="date"
                  name="completedDate"
                  id="completedDate"
                  required
                  value={completedDate}
                  onChange={(e) => setCompletedDate(e.target.value)}
                />
              </FormGroup> */}
            </>
          )}
          {claimStatus === "RETURNED_TO_WAREHOUSE" && (
            <>
              <p>
                Are you sure you want to change the status to <b>{capitalCase(claimStatus)} </b>?
              </p>
              {/* <FormGroup>
                <Label for="shippedDate">Enter returned to warehouse Date</Label>
                <Input
                  type="date"
                  name="warehouseDate"
                  id="warehouseDate"
                  required
                  value={warehouseDate}
                  onChange={(e) => setWarehouseDate(e.target.value)}
                />
              </FormGroup> */}
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

      {/* ================  DELIVERY BOY ASSIGN MODAL ================= */}

      <Modal
        isOpen={deliveryAssignModal}
        toggle={toggleDeliveryAssignModal}
      >
        <ModalHeader toggle={toggleDeliveryAssignModal}>
          Assign Delivery Boy {claimType === "REPLACEMENT" && ""}
        </ModalHeader>
        <ModalBody>
          <div
            className="form-check form-switch mb-3"
            dir="ltr"
          >
            <input
              checked={isCustomize}
              type="checkbox"
              className="form-check-input"
              id="customSwitch1"
              onChange={(e: any) => {
                handleCustomize(e.target.checked);
              }}
            />
            <label
              className="form-check-label"
              htmlFor="customSwitch1"
            >
              Customize Delivery Agent Type ?
            </label>
          </div>
          <div style={{ display: "flex", gap: "2%" }}>
            <div style={{ width: "60%" }}>
              <FormGroup>
                <Label for="agentType">Agent Type</Label>
                <Input
                  type="select"
                  name="agentType"
                  id="agentType"
                  value={deliveryAgentType}
                  disabled={!isCustomize}
                  onChange={(e: any) => setDeliveryAgentType(e?.target?.value)}
                >
                  <option
                    value=""
                    disabled
                  >
                    Select Delivery Agent Type
                  </option>
                  {["ArabDeals", "Vendor", "ThirdParty"].map((el) => (
                    <option
                      key={el}
                      value={el}
                    >
                      {el}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </div>
            <div style={{ width: "38%" }}>
              <FormGroup>
                <Label for="agentType">Bundle Count</Label>
                <Input
                  type="text"
                  name="bundleCount"
                  id="bundleCount"
                  value={bundleCount}
                  onChange={(e: any) => setBundleCount(e?.target?.value)}
                />
              </FormGroup>
            </div>
          </div>
          {isCustomize && (
            <>
              {deliveryAgentType === "Vendor" && (
                <FormGroup>
                  <div>
                    <Label className="form-label pt-2">Select Vendor</Label>
                    <Input
                      name="vendorID"
                      placeholder="Select Vendor"
                      id="vendorID"
                      type="select"
                      value={vendorId || ""}
                      onChange={(e) => setVendorId(e.target.value)}
                      // onBlur={formik.handleBlur}
                      defaultValue={vendorDataResponse?.getAllVendorsRecordsByAdmin?.records[0]?._id}
                    >
                      <option
                        value=""
                        disabled
                      >
                        Select Vendor
                      </option>
                      {vendorDataResponse &&
                        vendorDataResponse?.getAllVendorsRecordsByAdmin &&
                        vendorDataResponse?.getAllVendorsRecordsByAdmin?.records?.length > 0 &&
                        vendorDataResponse.getAllVendorsRecordsByAdmin?.records.map((item: any) => (
                          <option
                            key={item._id}
                            value={item._id}
                          >
                            {item.fullName}
                          </option>
                        ))}
                    </Input>
                  </div>
                </FormGroup>
              )}
              <FormGroup>
                <Label className="form-label pt-2">Select Governorate</Label>
                <Input
                  name="governorateID"
                  placeholder="Select Governate"
                  id="governorateID"
                  type="select"
                  value={governateId || ""}
                  onChange={(e) => handleGovernorateChange(e.target.value)}
                >
                  <option
                    value=""
                    disabled
                  >
                    Select Governate
                  </option>
                  {getLocation?.getLocationsData &&
                    getLocation?.getLocationsData?.length &&
                    getLocation?.getLocationsData?.map((gov: any) => (
                      <option
                        key={gov._id}
                        value={gov._id}
                      >
                        {gov.name}
                      </option>
                    ))}
                </Input>
              </FormGroup>
              <FormGroup>
                <Label className="form-label pt-2">Select Wilayat</Label>
                <Input
                  name="villageID"
                  placeholder="Select Wilayat"
                  id="villageID"
                  type="select"
                  value={villageId || ""}
                  onChange={(e) => setVillageId(e.target.value)}
                  disabled={!villages.length}
                >
                  <option
                    value=""
                    disabled
                  >
                    Select Wilayat
                  </option>
                  {villages &&
                    villages?.length &&
                    villages?.map((wil: any) => (
                      <option
                        key={wil._id}
                        value={wil._id}
                      >
                        {wil.name}
                      </option>
                    ))}
                </Input>
              </FormGroup>
            </>
          )}
          <Col>
            <FormGroup>
              <Label for="deliveryBoy">Select Delivery Boy</Label>
              <Input
                id="deliveryBoy"
                name="deliveryBoy"
                type="select"
                // value={deliveryBoyId}
                placeholder="Select Delivery Boy"
                value={deliveryBoyId}
                onChange={(e: any) => {
                  const selectedValue = e?.target?.value; // The ID (value) of the selected option
                  const selectedName = e?.target?.options[e?.target?.selectedIndex]?.text; // The name (text) of the selected option
                  setDeliveryBoyId(selectedValue); // Save ID in state
                  setDeliveryBoyName(selectedName); // Save name in state
                }}
              >
                <option
                  value=""
                  selected
                  disabled
                >
                  Select Delivery Boy
                </option>
                {deliveryAgentList &&
                deliveryAgentList?.getProductDeliveryTypeDeliveryAgents &&
                deliveryAgentList?.getProductDeliveryTypeDeliveryAgents?.deliveryAgents?.length > 0
                  ? deliveryAgentList?.getProductDeliveryTypeDeliveryAgents?.deliveryAgents?.map((agent: any) => (
                      <option
                        key={agent?._id}
                        id={agent?.fullName}
                        value={agent?._id}
                      >
                        {agent?.fullName}
                      </option>
                    ))
                  : deliveryAgentListCustomize && deliveryAgentListCustomize?.getDeliveryAgentlistCustomizOrderAssigen
                  ? deliveryAgentListCustomize?.getDeliveryAgentlistCustomizOrderAssigen?.map((agent: any) => (
                      <option
                        key={agent?._id}
                        id={agent?.fullName}
                        value={agent?._id}
                      >
                        {agent?.fullName}
                      </option>
                    ))
                  : []}
              </Input>
            </FormGroup>
          </Col>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={handleAssignOrder}
          >
            Submit
          </Button>{" "}
          <Button
            color="secondary"
            onClick={toggleDeliveryAssignModal}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* ============== COMMENTS EDIT MODAL =============== */}

      <Modal
        isOpen={commentEditModal}
        toggle={toggleCommentEditModal}
      >
        <ModalHeader toggle={toggleCommentEditModal}>Edit Comments</ModalHeader>
        <ModalBody>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <h5 style={{ color: "#b12349", marginBottom: "20px" }}>Warranty</h5>
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  alignItems: "center",
                }}
              >
                <h6 style={{ width: "180px" }}>User Reason</h6>

                <Input
                  style={{ width: "100% !important" }}
                  type="text"
                  name="userReason"
                  id="userReason"
                  value={commentFormData.issueDescription}
                  onChange={handleCommentsInputChange}
                />
              </div>
              {product?.claimStatus === "REJECTED" ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      gap: "20px",
                      alignItems: "center",
                    }}
                  >
                    <h6 style={{ width: "180px" }}>Admin Rejected Reason</h6>

                    <Input
                      style={{ width: "100% !important" }}
                      type="text"
                      name="adminRejectedReason"
                      id="adminRejectedReason"
                      value={commentFormData.adminRejectedReason}
                      onChange={handleCommentsInputChange}
                    />
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={handleCommentEditSubmit}
          >
            Submit
          </Button>{" "}
          <Button
            color="secondary"
            onClick={toggleCommentEditModal}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <ToastContainer />
      <ConfirmationOtpPopup
        submit={handleVerifyOtp}
        isOpen={openShippingStatusOTP}
        toggle={toggleShippingOtpModal}
        otp={shippingOTP}
        setOtp={setShippingOTP}
      />
    </div>
  );
}

export default WarrantyProductDetail;
