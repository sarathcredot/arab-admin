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
import Iconify from "../iconify/Iconify";
import { capitalCase } from "change-case";
import { gql, useMutation, useQuery } from "@apollo/client";
import { toast, ToastContainer } from "react-toastify";
import { fetchSignedUrl, useFetchSignedUrl } from "src/utils/fetchSignedUrl";
import { Dropdown } from "react-bootstrap";
import { BsThreeDotsVertical } from "react-icons/bs";

import { IoMdAdd } from "react-icons/io";

import styles from "./OrderProductDetails.module.scss";
import CustomSwiper from "../swiper/Swiper";
import ConfirmationOtpPopup from "./ConfirmationOtpPopup";

type ASSIGN_ORDER_TYPE = "COLLECT" | "DELIVERY" | null;

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

const CREATE_SHIPPING_OTP = gql`
  mutation UpdateAdminOrderProductOtpSent($input: updateAdminOrderProductOtpSentInput) {
    updateAdminOrderProductOtpSent(input: $input) {
      status
      otp
      msg
    }
  }
`;
const VERIFY_SHIPPING_OTP = gql`
  mutation DeliveryStatusOtpVerifyAdmin($input: deliveryStatusOtpVerifyAdminInput) {
    deliveryStatusOtpVerifyAdmin(input: $input) {
      status
      msg
    }
  }
`;


function OrderProductDetails({
  product,
  orderProdcutsRefetch,
  orderRefetch,
  address,
  type,
}: any) {
  const navigate = useNavigate();
  console.log("PRODUCT = ",product)

  // [[[[[[  shipping ]]]]]]]]

  const [shippingModal, setShippingModal] = useState(false);
  const [shippingStatus, setShippingStatus] = useState("");
  const [shippedDate, setShippedDate] = useState<any>(null);
  const [deliveredDate, setDeliveredDate] = useState<any>(null);
  const [canceledDate, setCanceledDate] = useState<any>(null);
  const [cancelComment, setCancelComment] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [shippingOTP,setShippingOTP] = useState<string>("")
  const [openShippingStatusOTP,setOpenShippingStatusOTP] = useState<boolean>(false)
  const [paymentMode,setPaymentMode] = useState<string>("")
  const [CreateShippingOTP] = useMutation(CREATE_SHIPPING_OTP)
  const [VerifyShippingOTP] = useMutation(VERIFY_SHIPPING_OTP)

  // [[[[[[  return ]]]]]]]]

  const [returnSwiperModal, setReturnSwiperModal] = useState(false);
  const [returnStatus, setReturnStatus] = useState("");
  const [returnModal, setReturnModal] = useState(false);
  const [returnDate, setReturnDate] = useState("");
  const [returnRejectDate, setReturnRejectDate] = useState("");
  const [returnComment, setReturnComment] = useState("");
  const [returnRequestDate, setReturnRequestDate] = useState("");
  const [initialSlide,setInitialSlide] = useState(0)

  // [[[[[[  refund ]]]]]]]]

  const [refundStatus, setRefundStatus] = useState("");
  const [refundModal, setRefundModal] = useState(false);
  const [refundDate, setRefundDate] = useState("");
  const [refundRequestDate, setRefundRequestDate] = useState("");
  const [refundComment, setRefundComment] = useState("");

  // [[[[[[[[[[ INVOICE ]]]]]]]]]]

  const [invoiceModal, setInvoiceModal] = useState(false);
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [signedUrl, setSignedUrl] = useState("");

  // [[[[[[[[[[[[[ COMMENTS ]]]]]]]]]]]]]

  const [commentEditModal, setCommentEditModal] = useState(false);
  const [commentFormData, setCommentFormData] = useState({
    cancelReasonUser: "",
    cancelCommentAdmin: "",
    returnReasonUser: "",
    returnCommentAdmin: "",
    refundCommentAdmin: "",
  });

  // [[[[[[[[[[[[ PRODUCT EDIT ]]]]]]]]]]]]

  const [productEditModal, setProductEditModal] = useState(false);
  const initialProductEditFormData: ProductEditFormData = {
    invoiceNumber: "",
    courierId: "",
    paymentStatus: "",
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
  const [productEditFormData, setProductEditFormData] =
    useState<ProductEditFormData>(initialProductEditFormData);

  useEffect(() => {
    setProductEditFormData({
      courierId: product?.courierId,
      invoiceNumber: product?.invoiceNumber,
      paymentStatus: product?.paymentStatus,
      shippedDate: product?.shippedDate
        ? moment(product.shippedDate).format("YYYY-MM-DD")
        : null,
      deliveredDate: product?.deliveryDate
        ? moment(product.deliveryDate).format("YYYY-MM-DD")
        : null,
      canceledDate: product?.cancelledDate
        ? moment(product.cancelledDate).format("YYYY-MM-DD")
        : null,
      returnRequestDate: product?.returnRequestDate
        ? moment(product.returnRequestDate).format("YYYY-MM-DD")
        : null,
      returnRejectDate: product?.returnRejectedDate
        ? moment(product.returnRejectedDate).format("YYYY-MM-DD")
        : null,
      returnDate: product?.returnDate
        ? moment(product.returnDate).format("YYYY-MM-DD")
        : null,
      refundRequestDate: product?.refundRequestDate
        ? moment(product.refundRequestDate).format("YYYY-MM-DD")
        : null,
      refundDate: product?.refundDate
        ? moment(product.refundDate).format("YYYY-MM-DD")
        : null,
      refundAmount: product?.refundAmount,
      shippingCharge: product?.shippingCharge,
    });
  }, [product]);

  useEffect(() => {
    setCommentFormData({
      cancelReasonUser: product?.cancelUserReason,
      cancelCommentAdmin: product?.cancelAdminComment,
      returnReasonUser: product?.returnUserReason,
      returnCommentAdmin: product?.returnAdminComment,
      refundCommentAdmin: product?.refundComment,
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

  const toggleShippingModal = () => {
    setShippingModal(!shippingModal);
    setIsCustomize(false);
    orderRefetch();
  };
  const toggleShippingOtpModal = ()=>{
    setOpenShippingStatusOTP(!openShippingStatusOTP)
  };

  const handleShippingStatusChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setShippingStatus(e.target.value);
    if(e.target.value==="DELIVERED" || e.target.value==="OUT_FOR_DELIVERY"){
      if(product?.deliveryAgentId){
        setShippingModal(!shippingModal);
      }else{
        toast.error("Please assign a delivery agent before proceeding.")
      }
    }else if(e.target.value==="CANCELED"){
      if(product?.deliveryAgentId){
        try {
          const response = await CreateShippingOTP({
            variables:{
              input:{
                orderId:product?._id
              }
            }
          })
          if(response?.data?.updateAdminOrderProductOtpSent?.status){
            const data = response?.data?.updateAdminOrderProductOtpSent;
            toast.success(data?.msg||"OTP has been sent to the customer.")
            toggleShippingOtpModal();

          }
        } catch (error:any) {
          toast.error(error)
        }

      }else{
        setShippingModal(!shippingModal);
      }
    }
    else {
      setShippingModal(!shippingModal);
    }
  };

  const handleShippingOTP = async () => {
    if(paymentMode&& paymentStatus){

      setShippingModal(!shippingModal);
      try {
          const response = await CreateShippingOTP({
            variables:{
              input:{
                orderId:product?._id
              }
            }
          })
          if(response?.data?.updateAdminOrderProductOtpSent?.status){
            const data = response?.data?.updateAdminOrderProductOtpSent;
            toast.success(data?.msg||"OTP has been sent to the customer.")
            toggleShippingOtpModal()
          }
        } catch (error:any) {
          toast.error(error)
        }
      }else{
        toast.error("To proceed, please select a payment method and set the payment status.")
      }
  }


  const handleShippingStatusSubmit = async () => {
    // if (shippingStatus === "SHIPPED") {
      // if (!shippedDate) {
      //   toast.error("Shipped Date is required");
      //   return;
      // }
    // }
    if (shippingStatus === "DELIVERED") {
      // if (!deliveredDate) {
      //   toast.error("Delivered Date is required");
      //   return;
      // }
      if (!paymentStatus) {
        toast.error("Payment Status is required");
        return;
      }
    }
    if (shippingStatus === "CANCELED") {
      // if (!canceledDate) {
      //   toast.error("Canceled Date is required");
      //   return;
      // }
      if (!cancelComment) {
        toast.error("Canceled comment is required");
        return;
      }
    }

    console.log({shippedDate,deliveredDate,canceledDate})
    try {
      const result = await UpdateProduct({
        variables: {
          input: {
            _id: product?._id,
            shippingStatus: shippingStatus,
            shippedDate:shippingStatus==="SHIPPED"?new Date().toISOString().split("T")[0]: null,
            deliveryDate: shippingStatus==="DELIVERED"?new Date().toISOString().split("T")[0]: null,
            paymentStatus: paymentStatus,
            cancelledDate: shippingStatus==="CANCELED"?new Date().toISOString().split("T")[0]: null,
            cancelAdminComment: cancelComment,
          },
        },
      });

      if (result.data.updateAdminOrderProduct) {
        orderProdcutsRefetch();
        setShippingModal(false);
        orderRefetch();
        toast.success("Shipping Status has been updated");
        setShippedDate(null);
        setDeliveredDate(null);
        setCanceledDate(null);
        setCancelComment("");
        setPaymentStatus("");
        if (shippingStatus === "SHIPPED") {
          handleAssignClick(result?.data?.updateAdminOrderProduct?._id,"DELIVERY")
          // toggleDeliveryAssignModal();
        }
      }
    } catch (error: any) {
      console.log("ERROR = ",error);
      toast.error(error.message);
    }
  };

  const submitDeliveryOTP =async ()=>{
      try {
        const response = await VerifyShippingOTP({
          variables:{
            input:{
              agentId: product?.deliveryAgentId,
              code: shippingOTP,
              deliveryStatus: shippingStatus,
              orderItemId: product?._id,
              paymentMode: paymentMode,
              remarks: null,
              // returnRemark: null,
              // returnStatus: returnStatus,
            }
          }
      });
      if(response?.data?.deliveryStatusOtpVerifyAdmin?.status){
        const data = response?.data?.deliveryStatusOtpVerifyAdmin;
        toast.success(data?.msg)
        toggleShippingOtpModal()
        setShippingOTP("")
        // setShippingModal(!shippingModal);
        handleShippingStatusSubmit()

      }
    } catch (error:any) {
      console.log("ERROR = ",error)
      toast.error(error.message)
    }
  }
  const submitCancelOTP = async ()=>{
    try {
        const response = await VerifyShippingOTP({
          variables:{
            input:{
              agentId: product?.deliveryAgentId,
              orderItemId: product?._id,
              code: shippingOTP,
              deliveryStatus: shippingStatus,
            }
          }
      });
      if(response?.data?.deliveryStatusOtpVerifyAdmin?.status){
        const data = response?.data?.deliveryStatusOtpVerifyAdmin;
        toast.success(data?.msg)
        toggleShippingOtpModal()
        setShippingOTP("")
        setShippingModal(!shippingModal);

      }
    } catch (error:any) {
      console.log("ERROR = ",error)
      toast.error(error.message)
    }
  }

  // =========================== RETURN =================================

  const toggleReturnImageSwiperModal = () => {
    setReturnSwiperModal(!returnSwiperModal);
  };

  const toggleReturnModal = () => {
    setReturnModal(!returnModal);
  };

  const handleReturnStatusChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setReturnModal(!returnModal);
    setReturnStatus(e.target.value);
  };

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
            returnAdminComment: returnComment,
          },
        },
      });
      if (result.data.updateAdminOrderProduct) {
        orderProdcutsRefetch();
        setReturnModal(!returnModal);
        orderRefetch();
        toast.success("Return Status has been updated");
        setReturnComment("");
        setReturnDate("");
        setReturnRejectDate("");
        setReturnRequestDate("");
        if (returnStatus === "APPROVED") {
          handleAssignClick(product?._id, "COLLECT") 
        }
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    }
  };

  // =========================== REFUND =====================================

  const toggleRefundModal = () => {
    setRefundModal(!refundModal);
  };

  const handleRefundStatusChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRefundModal(!refundModal);
    setRefundStatus(e.target.value);
  };

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
            refundAmount: product.sellingPrice,
          },
        },
      });
      if (result.data.updateAdminOrderProduct) {
        orderRefetch();
        orderProdcutsRefetch();
        setRefundModal(!refundModal);
        toast.success("Refund Status has been updated");
        setRefundComment("");
        setRefundDate("");
        setRefundRequestDate("");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    }
  };

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
          invoiceNumber: invoiceNumber,
        },
      };
      if (invoiceFile) {
        variables = {
          ...variables,
          invoice: invoiceFile,
        };
      }
      const result = await UpdateProduct({
        variables,
      });

      if (result.data.updateAdminOrderProduct) {
        orderRefetch();
        orderProdcutsRefetch();
        setInvoiceModal(!invoiceModal);
        toast.success("Invoice has been updated");
        setInvoiceNumber("");
        setInvoiceFile(null);
        handleFetchSignedUrl();
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    }
  };

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
  }, [orderProdcutsRefetch, signedUrl, product?.invoice?.fileURL]);

  // COMMENTS

  const toggleCommentEditModal = () => {
    setCommentEditModal(!commentEditModal);
  };

  const handleCommentsInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
        toast.success("Comments has been updated");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    }
  };

  // PRODUCT

  const toggleProductEditModal = () => {
    setProductEditModal(!productEditModal);
  };

  const handleProductEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
            refundAmount: parseFloat(
              parseFloat(`${productEditFormData.refundAmount}`).toFixed(2)
            ),
            shippingCharge: parseFloat(
              parseFloat(`${productEditFormData.shippingCharge}`).toFixed(2)
            ),
          },
        },
      });
      if (result.data.updateAdminOrderProduct) {
        orderProdcutsRefetch();
        setProductEditModal(!productEditModal);
        orderRefetch();
        toast.success("Product has been updated");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    }
  };
  const UPDATE_PRODUCT = gql`
    mutation UpdateAdminOrderProduct(
      $input: UpdateAdminOrderProductInput!
      $invoice: Upload
    ) {
      updateAdminOrderProduct(input: $input, invoice: $invoice) {
        _id
      }
    }
  `;

  const [UpdateProduct] = useMutation(UPDATE_PRODUCT);

  //DELIVERY BOY ASSIGN ORDER ==============================================

  const [deliveryAssignModal, setDeliveryAssignModal] = useState(false);
  const [deliveryBoyId, setDeliveryBoyId] = useState<string>();
  const [deliveryBoyName, setDeliveryBoyName] = useState<string>();
  const [assignOrderType, setAssignOrderType] = useState<
    "COLLECT" | "DELIVERY" | null
  >(null);
  const [deliveryAgentType, setDeliveryAgentType] = useState<
    "ArabDeals" | "Vendor" | "ThirdParty" | ""
  >("");
  const [isCustomize, setIsCustomize] = useState(false);
  const [vendorId, setVendorId] = useState("");
  const [villageId, setVillageId] = useState("");
  const [governateId, setGovernateId] = useState("");
  const [villages, setvillages] = useState([]);

  const [bundleCount, setBundleCount] = useState(1);

  const [orderItemId, setOrderItemId] = useState<any>(null);

  const handleGovernorateChange = (governorateId: any) => {
    setGovernateId(governorateId);
    const selectedGovernorate = getLocation?.getLocationsData?.find(
      (g: any) => g._id === governorateId
    );
    setvillages(selectedGovernorate?.villages || []);
  };
  
  const handleCustomize = (value:any)=>{
    if (value) {
      if(type){
        if(type==="SHIPPING"){
          setGovernateId(address?.governorateID);
          handleGovernorateChange(address?.governorateID);
          setVillageId(address?.villageID);
        }else if(type==="RETURN"){
          setGovernateId(product?.returnAddress?.governorateID);
          handleGovernorateChange(product?.returnAddress?.governorateID);
          setVillageId(product?.returnAddress?.villageID);

        }
      }else{
        setGovernateId(product?.shippingAddress?.governorateID);
        handleGovernorateChange(product?.shippingAddress?.governorateID);
        setVillageId(product?.shippingAddress?.villageID);
      }
    }
    setIsCustomize(value)
  }
  const handleAssignClick = (
    itemId: string,
    assingOrderType: ASSIGN_ORDER_TYPE
  ) => {
    toggleDeliveryAssignModal();
    setOrderItemId(itemId);
    setAssignOrderType(assingOrderType);
  };

  const ASSIGN_ORDER = gql`
    mutation OrderAssignDeliveryAgent($input: OrderAssignDeliveryAgentInput!) {
      orderAssignDeliveryAgent(input: $input) {
        status
        msg
      }
    }
  `;

  const ASSIGN_RETURN_ORDER = gql`
    mutation OrderAssignDeliveryAgent($input: OrderAssignDeliveryAgentInput!) {
      returnOrderAssignDeliveryAgent(input: $input) {
        status
        msg
      }
    }
  `;

  const [AssignOrder] = useMutation(ASSIGN_ORDER);
  const [AssignReturnOrder] = useMutation(ASSIGN_RETURN_ORDER);

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

  const {
    data: getLocation,
    loading: getLocationLoading,
    error: getLocationError,
  } = useQuery(GET_LOCATION);

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

  const GET_PRODUCT_DELIVERY_TYPE_DELIVERY_AGENTS = gql`
    query GetProductDeliveryTypeDeliveryAgents(
      $input: GetProductDeliveryTypeDeliveryAgentsInput!
    ) {
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
    query GetDeliveryAgentlistCustomizOrderAssigen(
      $input: getDeliveryAgentlistCustomizOrderAssigenInput
    ) {
      getDeliveryAgentlistCustomizOrderAssigen(input: $input) {
        _id
        fullName
        contactNumber
      }
    }
  `;

  const {
    data: deliveryAgentList,
    loading: deliveryAgentListLoading,
    error: deliveryAgentListError,
    refetch: refetchDeliveryAgentsList,
  } = useQuery(GET_PRODUCT_DELIVERY_TYPE_DELIVERY_AGENTS, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        productId: product?.productId,
        villageID:type ? type === "SHIPPING"? address?.villageID :type === "RETURN"?product?.returnAddress?.villageID :product?.shippingAddress?.villageID:product?.shippingAddress?.villageID,
        governorateID:type ? type === "SHIPPING"? address?.governorateID :type === "RETURN"?product?.returnAddress?.governorateID :product?.shippingAddress?.governorateID:product?.shippingAddress?.governorateID,
      },
    },
    skip: isCustomize,
  });
  console.log("AGENTS = ",deliveryAgentList)

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
  console.log("customizeInput = ",customizeInput)

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
      setDeliveryAgentType(
        deliveryAgentList?.getProductDeliveryTypeDeliveryAgents?.deliveryType
      );
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
    console.log("in 1")
    try {
      if (!orderItemId && !product?._id)
        
        throw new Error("Can't find order Item !");
      if (!deliveryBoyId) throw new Error("Select a Delivery Agent!");
      if (!deliveryBoyName) throw new Error("Select a Delivery Agent!");

      const variables = {
        input: {
          orderItemId: orderItemId ? orderItemId : product?._id,
          deliveryAgentId: deliveryBoyId,
          deliveryAgentName: deliveryBoyName,
          bundleCount: bundleCount,
        },
      };

      let response: any = null;

      if (assignOrderType === "DELIVERY") {
        response = await AssignOrder({
          variables,
        });
      } else if (assignOrderType === "COLLECT") {
        response = await AssignReturnOrder({
          variables,
        });
      }
      console.log("assignOrderType = ",assignOrderType)

      console.log("RESPONSE = ",response)
      if(response){

      const { errors, data } = response;
      console.log("RESS = ",{errors,data})

      const success = data?.orderAssignDeliveryAgent?.status
        ? data?.orderAssignDeliveryAgent?.status
        : data?.returnOrderAssignDeliveryAgent?.status;
      const message = data?.orderAssignDeliveryAgent?.msg
        ? data?.orderAssignDeliveryAgent?.msg
        : data?.returnOrderAssignDeliveryAgent?.msg;

      if (success) {
        toast.success(message);
        setVillageId("");
        setvillages([]);
        setGovernateId("");
        setVendorId("");
        setIsCustomize(false);
        toggleDeliveryAssignModal();
        orderProdcutsRefetch();
      }
    }
    } catch (error: any) {
      console.log(error, "ERROR IN ASSIGN ORDER !!");
      toast.error(error?.message);
    }
  };

  console.log("PRODUCTTTT = ",product)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <Card
        className="my-2"
        style={{
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.05)",
        }}
      >
        <CardHeader>
          <div
            style={{ width: "400px", cursor: "pointer" }}
            onClick={() => navigate(`/vendors/view?id=${product?.vendorId}`)}
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
              {product?.vendorId}
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
              {product?.vendorName && capitalCase(product?.vendorName)}
            </p>
          </div>
        </CardHeader>
        <CardBody
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                width: "80%",
                cursor: "pointer",
              }}
              onClick={() =>
                navigate(`/product/details?_id=${product?.productId}`)
              }
            >
              <div style={{ width: "80px" }}>
                <CardImg
                  alt="product"
                  src={product?.image?.fileURL ?? ""}
                  style={{
                    height: 80,
                    width: 80,
                  }}
                  top
                  width="80px"
                />
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "5px" }}
              >
                <CardTitle tag="h4">
                  <p style={{ fontSize: "20px", margin: "0" }}>
                    {product?.productName}
                  </p>
                </CardTitle>
                <CardSubtitle className="mb-2 text-muted" tag="h6">
                  W.Sku ID : {product?.warehouseSkuId || "nill"}
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
                    onClick={toggleProductEditModal}
                    style={{ display: "flex", gap: 5 }}
                  >
                    <CiEdit size={20} />
                    Edit Product
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleAssignClick(product?._id, "DELIVERY")}
                    style={{ display: "flex", gap: 5 }}
                    disabled={!["SHIPPED","POSTPONED"].includes(product?.shippingStatus)}
                  >
                    <CiDeliveryTruck size={20} />
                    Assign Delivery Boy
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleAssignClick(product?._id, "COLLECT")}
                    style={{ display: "flex", gap: 5 }}
                    disabled={product?.returnStatus !== "APPROVED"}
                    >
                    <CiDeliveryTruck size={20} />
                    Assign Delivery Boy (Return)
                  </Dropdown.Item>
                  <Dropdown.Item
                  style={{ display: "flex", gap: 5 }}
                  onClick={()=> navigate(`/shipping-orders/details/activity-log?orderId=${product?.orderId}&_id=${product?._id}`)}
                  >
                  <PiClockCounterClockwise size={20} />
                    Activity Log
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    onClick={toggleInvoiceModal}
                    style={{ display: "flex", gap: 5 }}
                  >
                    {!product?.invoiceNumber && !product?.invoice?.fileURL ? (
                      // <Button
                      //   onClick={toggleInvoiceModal}
                      //   style={{
                      //     backgroundColor: "black",
                      //     color: "white",
                      //     width: "100%",
                      //     height: "40px",
                      //     borderRadius: "10px",
                      //     fontSize: "13px",
                      //   }}
                      // >
                      <>
                        <IoMdAdd size={20} />
                        {`Add Invoice `}
                        {/* <FeatherIcon icon="plus"  />  */}
                        {/* </Button> */}
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
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>

          <CardText>{product?.shortDescription}</CardText>
          <Row>
            <Col xl={4}>
              <CardText>
                <p className="form-control-static" style={{ fontWeight: 500 }}>
                  Details
                </p>

                <div
                  style={{ display: "flex", flexDirection: "row", gap: "20px" }}
                >
                  <div style={{ width: "220px" }}>
                    <p className="form-control-static" style={{ margin: 10 }}>
                      Item Id
                    </p>
                    <p className="form-control-static" style={{ margin: 10 }}>
                      Courier ID
                    </p>
                    <p className="form-control-static" style={{ margin: 10 }}>
                      Invoice Number
                    </p>
                    <p className="form-control-static" style={{ margin: 10 }}>
                      Pyment Status
                    </p>
                    <p className="form-control-static" style={{ margin: 10 }}>
                      Selling Price
                    </p>
                    <p className="form-control-static" style={{ margin: 10 }}>
                      Shipping Charge
                    </p>
                    {product?.refundAmount ? (
                      <p className="form-control-static" style={{ margin: 10 }}>
                        Refund Amount
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                  <div style={{ width: "100%" }}>
                    <p className="form-control-static" style={{ margin: 10 }}>
                      {product?.itemId || "nill"}
                    </p>
                    <p className="form-control-static" style={{ margin: 10 }}>
                      {product?.courierId || "nill"}
                    </p>
                    <p className="form-control-static" style={{ margin: 10 }}>
                      {product?.invoiceNumber || "nill"}
                    </p>
                    <p className="form-control-static" style={{ margin: 10 }}>
                      {product?.paymentStatus || "nill"}
                    </p>
                    <p className="form-control-static" style={{ margin: 10 }}>
                      {formatCurrency(product?.sellingPrice)}
                    </p>
                    <p className="form-control-static" style={{ margin: 10 }}>
                      {formatCurrency(product?.shippingCharge)}
                    </p>
                    {product?.refundAmount ? (
                      <p className="form-control-static" style={{ margin: 10 }}>
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
                  <Label for="exampleSelect">Shipping Status</Label>
                  <Input
                    id="exampleSelect"
                    name="select"
                    type="select"
                    value={product?.shippingStatus}
                    onChange={(e) => handleShippingStatusChange(e)}
                  >
                    <option disabled value={"PENDING"}>Pending</option>
                    <option value={"PACKAGE_IN_PROGRESS"}>
                      Package in progress
                    </option>
                    <option value={"SHIPPED"}>Shipped</option>
                    <option value={"OUT_FOR_DELIVERY"}>Out For Delivery</option>
                    <option value={"DELIVERED"}>Delivered</option>
                    <option value={"CANCELED"}>Canceled</option>
                    <option value={"POSTPONED"}>Postponed To Tomorrow</option>
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label for="exampleSelect">Return Status</Label>
                  <Input
                    id="exampleSelect"
                    name="select"
                    type="select"
                    value={product?.returnStatus}
                    onChange={(e) => handleReturnStatusChange(e)}
                  >
                    <option value={"NA"}>NA</option>
                    <option value={"PENDING"}>Pending</option>
                    <option value={"APPROVED"}>Approved</option>
                    <option value={"REJECTED"}>Rejected</option>
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label for="exampleSelect">Refund Status</Label>
                  <Input
                    id="exampleSelect"
                    name="select"
                    type="select"
                    value={product?.refundStatus}
                    onChange={(e) => handleRefundStatusChange(e)}
                  >
                    <option value={"NA"}>NA</option>
                    <option value={"PENDING"}>Pending</option>
                    <option value={"PAID"}>Paid</option>
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
                    {product?.orderDate && (
                      <p className="form-control-static" style={{ margin: 10 }}>
                        Order Date
                      </p>
                    )}
                    {product?.shippedDate && (
                      <p className="form-control-static" style={{ margin: 10 }}>
                        Shipped Date
                      </p>
                    )}
                    {product?.deliveryDate && (
                      <p className="form-control-static" style={{ margin: 10 }}>
                        Delivery Date
                      </p>
                    )}
                    {product?.returnRequestDate && (
                      <p className="form-control-static" style={{ margin: 10 }}>
                        Return Request Date
                      </p>
                    )}
                    {product?.returnDate && (
                      <p className="form-control-static" style={{ margin: 10 }}>
                        Return Date
                      </p>
                    )}
                    {product?.returnRejectedDate && (
                      <p className="form-control-static" style={{ margin: 10 }}>
                        Return Rejected Date
                      </p>
                    )}
                    {product?.refundRequestDate && (
                      <p className="form-control-static" style={{ margin: 10 }}>
                        Refund Request Date
                      </p>
                    )}
                    {product?.refundDate && (
                      <p className="form-control-static" style={{ margin: 10 }}>
                        Refund Date
                      </p>
                    )}
                    {product?.cancelledDate && (
                      <p className="form-control-static" style={{ margin: 10 }}>
                        Cancelled Date
                      </p>
                    )}
                  </div>
                  <div>
                    {product?.orderDate && (
                      <p className="form-control-static" style={{ margin: 10 }}>
                        {moment(product?.orderDate).format("L")}
                      </p>
                    )}
                    {product?.shippedDate && (
                      <p className="form-control-static" style={{ margin: 10 }}>
                        {moment(product?.shippedDate).format("L")}
                      </p>
                    )}
                    {product?.deliveryDate && (
                      <p className="form-control-static" style={{ margin: 10 }}>
                        {moment(product?.deliveryDate).format("L")}
                      </p>
                    )}
                    {product?.returnRequestDate && (
                      <p className="form-control-static" style={{ margin: 10 }}>
                        {moment(product?.returnRequestDate).format("L")}
                      </p>
                    )}
                    {product?.returnDate && (
                      <p className="form-control-static" style={{ margin: 10 }}>
                        {moment(product?.returnDate).format("L")}
                      </p>
                    )}
                    {product?.returnRejectedDate && (
                      <p className="form-control-static" style={{ margin: 10 }}>
                        {moment(product?.returnRejectedDate).format("L")}
                      </p>
                    )}
                    {product?.refundRequestDate && (
                      <p className="form-control-static" style={{ margin: 10 }}>
                        {moment(product?.refundRequestDate).format("L")}
                      </p>
                    )}
                    {product?.refundDate && (
                      <p className="form-control-static" style={{ margin: 10 }}>
                        {moment(product?.refundDate).format("L")}
                      </p>
                    )}
                    {product?.cancelledDate && (
                      <p className="form-control-static" style={{ margin: 10 }}>
                        {moment(product?.cancelledDate).format("L")}
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
                <p className="form-control-static" style={{ fontWeight: 500 }}>
                  Delivery Details
                </p>

                <div
                  style={{ display: "flex", flexDirection: "row", gap: "20px" }}
                >
                  <div style={{ width: "220px" }}>
                    <p className="form-control-static" style={{ margin: 10 }}>
                      Agent Type
                    </p>
                    <p className="form-control-static" style={{ margin: 10 }}>
                      Delivery Boy
                    </p>
                    <p className="form-control-static" style={{ margin: 10 }}>
                      Mobile
                    </p>
                    <p className="form-control-static" style={{ margin: 10 }}>
                      Assigned On
                    </p>
                  </div>
                  <div style={{ width: "100%" }}>
                    <p className="form-control-static" style={{ margin: 10 }}>
                      {product?.deliveryBoy?.agentType || "nill"}
                    </p>
                    <p className="form-control-static" style={{ margin: 10 }}>
                      {product?.deliveryBoy?.fullName || "nill"}
                    </p>
                    <p className="form-control-static" style={{ margin: 10 }}>
                      {product?.deliveryBoy?.contactNumber || "nill"}
                    </p>
                    <p className="form-control-static" style={{ margin: 10 }}>
                      {(product?.deliveryAssignedOn &&
                        moment(product?.deliveryAssignedOn).format("L")) ||
                        "nill"}
                    </p>
                  </div>
                </div>
              </CardText>
            </Col>
            <Col xl={4}>
              <CardText>
                <p className="form-control-static" style={{ fontWeight: 500 }}>
                  Return Details
                </p>

                <div
                  style={{ display: "flex", flexDirection: "row", gap: "20px" }}
                >
                  <div style={{ width: "220px" }}>
                    <p className="form-control-static" style={{ margin: 10 }}>
                      Agent Type
                    </p>
                    <p className="form-control-static" style={{ margin: 10 }}>
                      Return Collector
                    </p>
                    <p className="form-control-static" style={{ margin: 10 }}>
                      Mobile
                    </p>
                    <p className="form-control-static" style={{ margin: 10 }}>
                      Assigned On
                    </p>
                  </div>
                  <div style={{ width: "100%" }}>
                    <p className="form-control-static" style={{ margin: 10 }}>
                      {product?.returnCollectorBoy?.agentType || "nill"}
                    </p>
                    <p className="form-control-static" style={{ margin: 10 }}>
                      {product?.returnCollectorBoy?.fullName || "nill"}
                    </p>
                    <p className="form-control-static" style={{ margin: 10 }}>
                      {product?.returnCollectorBoy?.contactNumber || "nill"}
                    </p>
                    <p className="form-control-static" style={{ margin: 10 }}>
                      {(product?.returnOrderAssignedOn &&
                        moment(product?.returnOrderAssignedOn).format("L")) ||
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
                <FeatherIcon icon="chevron-down" className="icon-sm" />
              </>
            ) : (
              <>
                View Less
                <FeatherIcon icon="chevron-up" className="icon-sm" />
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
                    
                    <div className={styles.comment_container}>
                      <div>
                        <h5 style={{ color: "#b12349", marginBottom: "20px" }}>
                          Cancel
                        </h5>
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
                            <h6>User Reason</h6>
                            <div>
                              <p>{product?.cancelUserReason || "nill"}</p>
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: "20px" }}>
                            <h6>Admin Comment</h6>
                            <div>
                              <p>{product?.cancelAdminComment || "nill"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h5 style={{ color: "#b12349", marginBottom: "20px" }}>
                          Return
                        </h5>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0",
                          }}
                        >
                          <div style={{ display: "flex", gap: "20px" }}>
                            <h6>User Reason</h6>
                            <div>
                              <p>{product?.returnUserReason || "nill"}</p>
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: "20px" }}>
                            <h6>Admin Comment</h6>
                            <div>
                              <p>{product?.returnAdminComment || "nill"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h5 style={{ color: "#b12349", marginBottom: "20px" }}>
                          Refund
                        </h5>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0",
                          }}
                        >
                          <div style={{ display: "flex", gap: "20px" }}>
                            <h6>Admin Comment</h6>
                            <div>
                              <p>{product?.refundComment || "nill"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={styles.image_container}>
                      {product?.returnProductImage &&
                        product?.returnProductImage?.length > 0 &&
                        product?.returnProductImage?.map((el: any,index:any) => (
                          <>
                          <div
                            key={el?._id}
                            className={styles.returnImageContainer}
                            onClick={()=>{
                              setInitialSlide(index)
                              toggleReturnImageSwiperModal()
                            }}
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
                          </>
                        ))}
                    </div>
                    </div>
                    {/* <div className={styles.image_container}>
                      {product?.returnProductImage &&
                        product?.returnProductImage?.length > 0 &&
                        product?.returnProductImage?.map((el: any,index:any) => (
                          <div
                            key={el?._id}
                            className={styles.returnImageContainer}
                            onClick={()=>{
                              setInitialSlide(index)
                              toggleReturnImageSwiperModal()
                            }}
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
                    </div> */}
                    </div>
                </CardBody>
              </Card>
            </Collapse>
          </div>
        </CardBody>
      </Card>

      {/* ================== RETURN IMAGES MODAL ===================== */}

      <Modal 
        isOpen={returnSwiperModal} 
        toggle={toggleReturnImageSwiperModal}
        fullscreen
        style={{ "--bs-modal-bg": "transparent",backdropFilter:"blur(10px)" } as any}
      >
        <ModalHeader style={{border:0,padding:"10px 20px 0"}} toggle={toggleReturnImageSwiperModal}></ModalHeader>
        <ModalBody
          style={{ padding:"0 0 20px" }}
        >
          <CustomSwiper data={product?.returnProductImage} initialSlide={initialSlide} />
        </ModalBody>
      </Modal>

      {/* ================== SHIPPPING MODAL ===================== */}

      <Modal isOpen={shippingModal} toggle={toggleShippingModal}>
        <ModalHeader toggle={toggleShippingModal}>Shipping Status</ModalHeader>
        <ModalBody>
          {shippingStatus === "PENDING" && (
            <p>
              Are you sure you want to change the status to{" "}
              <b>{capitalCase(shippingStatus)} </b> ?
            </p>
          )}
          {shippingStatus === "PACKAGE_IN_PROGRESS" && (
            <p>
              Are you sure you want to change the status to{" "}
              <b>{capitalCase(shippingStatus)} </b> ?
            </p>
          )}
          {shippingStatus === "OUT_FOR_DELIVERY" && (
            <p>
              Are you sure you want to change the status to{" "}
              <b>{capitalCase(shippingStatus)} </b> ?
            </p>
          )}
          {shippingStatus === "POSTPONED" && (
            <p>
              Are you sure you want to postpone this order to tomorrow ?
              {/* <b>{capitalCase(shippingStatus)} </b> ? */}
            </p>
          )}
          {shippingStatus === "SHIPPED" && (
            <>
              <p>
                Are you sure you want to change the status to{" "}
                <b>{capitalCase(shippingStatus)} </b>?
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
          {shippingStatus === "DELIVERED" && (
            <>
              {/* <p>
                Are you sure you want to change the status to{" "}
                <b>{capitalCase(shippingStatus)} </b>?
              </p> */}

              {/* <FormGroup>
                <Label for="deliveredDate">Enter Delivered Date</Label>
                <Input
                  type="date"
                  name="deliveredDate"
                  id="deliveredDate"
                  value={deliveredDate}
                  onChange={(e) => setDeliveredDate(e.target.value)}
                />
              </FormGroup> */}

              <FormGroup>
                <Label for="paymentMode">Select Payment Method</Label>
                <Input
                  id="paymentMode"
                  name="paymentMode"
                  type="select"
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                >
                  <option value={""}>Select Payment Method</option>
                  <option value={"COD"}>CASH ON DELIVERY</option>
                  <option value={"CARD"}>CARD ON DELIVERY</option>
                </Input>
              </FormGroup>
              <FormGroup>
                <Label for="paymentStatus">Select Payment Status</Label>
                <Input
                  id="paymentStatus"
                  name="paymentStatus"
                  type="select"
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                >
                  <option value={""}>Select Payment Status</option>
                  <option value={"PENDING"}>PENDING</option>
                  <option value={"COMPLETED"}>COMPLETED</option>
                </Input>
              </FormGroup>
            </>
          )}
          {shippingStatus === "CANCELED" && (
            <>
              <p>
                Are you sure you want to change the status to{" "}
                <b>{capitalCase(shippingStatus)} </b>?
              </p>

              {/* <FormGroup>
                <Label for="canceledDate">Enter Canceled Date</Label>
                <Input
                  type="date"
                  name="canceledDate"
                  id="canceledDate"
                  value={canceledDate}
                  onChange={(e) => setCanceledDate(e.target.value)}
                />
              </FormGroup> */}
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
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={shippingStatus==="DELIVERED"?handleShippingOTP:handleShippingStatusSubmit}>
            Submit
          </Button>{" "}
          <Button color="secondary" onClick={toggleShippingModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* ================== RETURN MODAL ===================== */}

      <Modal isOpen={returnModal} toggle={toggleReturnModal}>
        <ModalHeader toggle={toggleReturnModal}>Return Status</ModalHeader>
        <ModalBody>
          {returnStatus === "NA" && (
            <p>
              Are you sure you want to change the status to{" "}
              <b>{capitalCase(returnStatus)} </b> ?
            </p>
          )}
          {returnStatus === "PENDING" && (
            <>
              <p>
                Are you sure you want to change the status to{" "}
                <b>{capitalCase(returnStatus)} </b> ?
              </p>

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
          )}
          {returnStatus === "APPROVED" && (
            <>
              <p>
                Are you sure you want to change the status to{" "}
                <b>{capitalCase(returnStatus)} </b>?
              </p>

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
          )}
          {returnStatus === "REJECTED" && (
            <>
              <p>
                Are you sure you want to change the status to{" "}
                <b>{capitalCase(returnStatus)} </b>?
              </p>

              <FormGroup>
                <Label for="returnRejectDate ">Enter Rejected Date</Label>
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
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleReturnStatusSubmit}>
            Submit
          </Button>{" "}
          <Button color="secondary" onClick={toggleReturnModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* ================== REFUND MODAL ===================== */}

      <Modal isOpen={refundModal} toggle={toggleRefundModal}>
        <ModalHeader toggle={toggleRefundModal}>Refund Status</ModalHeader>
        <ModalBody>
          {refundStatus === "NA" && (
            <p>
              Are you sure you want to change the status to{" "}
              <b>{capitalCase(refundStatus)} </b> ?
            </p>
          )}
          {refundStatus === "PENDING" && (
            <>
              <p>
                Are you sure you want to change the status to{" "}
                <b>{capitalCase(refundStatus)} </b> ?
              </p>

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
          )}
          {refundStatus === "PAID" && (
            <>
              <p>
                Are you sure you want to change the status to{" "}
                <b>{capitalCase(refundStatus)} </b>?
              </p>

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
                    <span className="input-group-text">OMR</span>
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
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleRefundStatusSubmit}>
            Submit
          </Button>{" "}
          <Button color="secondary" onClick={toggleRefundModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* ================  INVOICE MODAL ================= */}

      <Modal isOpen={invoiceModal} toggle={toggleInvoiceModal}>
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
          </Button>{" "}
          <Button color="secondary" onClick={toggleInvoiceModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* ================  DELIVERY BOY ASSIGN MODAL ================= */}

      <Modal isOpen={deliveryAssignModal} toggle={toggleDeliveryAssignModal}>
        <ModalHeader toggle={toggleDeliveryAssignModal}>
          Assign Delivery Boy {assignOrderType === "COLLECT" && " (Return)"}
        </ModalHeader>
        <ModalBody>
          <div className="form-check form-switch mb-3" dir="ltr">
            <input
              checked={isCustomize}
              type="checkbox"
              className="form-check-input"
              id="customSwitch1"
              onChange={(e: any) => handleCustomize(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="customSwitch1">
              Customize Delivery Agent Type ?
            </label>
          </div>
          <div style={{display: "flex", gap: "2%"}}>
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
                  <option value="" disabled>
                    Select Delivery Agent Type
                  </option>
                  {["ArabDeals", "Vendor", "ThirdParty"].map((el) => (
                    <option key={el} value={el}>
                      {el}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </div>
            <div style={{width: "38%"}}>
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
                      defaultValue={
                        vendorDataResponse?.getAllVendorsRecordsByAdmin
                          ?.records[0]?._id
                      }
                    >
                      <option value="" disabled>
                        Select Vendor
                      </option>
                      {vendorDataResponse &&
                        vendorDataResponse?.getAllVendorsRecordsByAdmin &&
                        vendorDataResponse?.getAllVendorsRecordsByAdmin?.records
                          ?.length > 0 &&
                        vendorDataResponse.getAllVendorsRecordsByAdmin?.records.map(
                          (item: any) => (
                            <option key={item._id} value={item._id}>
                              {item.fullName}
                            </option>
                          )
                        )}
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
                  <option value="" disabled>
                    Select Governate
                  </option>
                  {getLocation?.getLocationsData &&
                    getLocation?.getLocationsData?.length &&
                    getLocation?.getLocationsData?.map((gov: any) => (
                      <option key={gov._id} value={gov._id}>
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
                  <option value="" disabled>
                    Select Wilayat
                  </option>
                  {villages &&
                    villages?.length &&
                    villages?.map((wil: any) => (
                      <option key={wil._id} value={wil._id}>
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
                onChange={(e: any) => {
                  const selectedValue = e?.target?.value; // The ID (value) of the selected option
                  const selectedName =
                    e?.target?.options[e?.target?.selectedIndex]?.text; // The name (text) of the selected option
                  setDeliveryBoyId(selectedValue); // Save ID in state
                  setDeliveryBoyName(selectedName); // Save name in state
                }}
              >
                <option value="" selected disabled>
                  Select Delivery Boy
                </option>
                {deliveryAgentList &&
                deliveryAgentList?.getProductDeliveryTypeDeliveryAgents &&
                deliveryAgentList?.getProductDeliveryTypeDeliveryAgents
                  ?.deliveryAgents?.length > 0
                  ? deliveryAgentList?.getProductDeliveryTypeDeliveryAgents?.deliveryAgents?.map(
                      (agent: any) => (
                        <option
                          key={agent?._id}
                          id={agent?.fullName}
                          value={agent?._id}
                        >
                          {agent?.fullName}
                        </option>
                      )
                    )
                  : deliveryAgentListCustomize &&
                    deliveryAgentListCustomize?.getDeliveryAgentlistCustomizOrderAssigen
                  ? deliveryAgentListCustomize?.getDeliveryAgentlistCustomizOrderAssigen?.map(
                      (agent: any) => (
                        <option
                          key={agent?._id}
                          id={agent?.fullName}
                          value={agent?._id}
                        >
                          {agent?.fullName}
                        </option>
                      )
                    )
                  : []}
              </Input>
            </FormGroup>
          </Col>
          {/* <FormGroup>
            <Label for="agentType">Agent Type</Label>
            <Input
              type="select"
              name="agentType"
              id="agentType"
              value={deliveryAgentType}
              onChange={(e: any) => setDeliveryAgentType(e?.target?.value)}
            >
              <option value="" disabled>
                Select Delivery Agent Type
              </option>
              {["ArabDeals", "Vendor", "ThirdParty"].map((el) => (
                <option key={el} value={el}>
                  {el}
                </option>
              ))}
            </Input>
          </FormGroup>
          <Col>
            <FormGroup>
              <Label for="deliveryBoy">Select Delivery Boy</Label>
              <Input
                id="deliveryBoy"
                name="deliveryBoy"
                type="select"
                value={deliveryBoyId}
                placeholder="Select Delivery Boy"
                onChange={(e: any) => {
                  const selectedValue = e?.target?.value; // The ID (value) of the selected option
                  const selectedName =
                    e?.target?.options[e?.target?.selectedIndex]?.text; // The name (text) of the selected option
                  setDeliveryBoyId(selectedValue); // Save ID in state
                  setDeliveryBoyName(selectedName); // Save name in state
                }}
              >
                <option value="" disabled>
                  Select Delivery Boy
                </option>
                {deliveryAgentList &&
                  deliveryAgentList?.getProductDeliveryTypeDeliveryAgents &&
                  deliveryAgentList?.getProductDeliveryTypeDeliveryAgents
                    ?.deliveryAgents?.length > 0 &&
                  deliveryAgentList?.getProductDeliveryTypeDeliveryAgents?.deliveryAgents?.map(
                    (agent: any) => (
                      <option
                        key={agent?._id}
                        id={agent?.fullName}
                        value={agent?._id}
                      >
                        {agent?.fullName}
                      </option>
                    )
                  )}
              </Input>
            </FormGroup>
          </Col> */}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleAssignOrder}>
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

      {/*============= PRODUCT EDIT MODAL =============*/}

      <Modal
        isOpen={productEditModal}
        toggle={toggleProductEditModal}
        style={{ maxWidth: "1000px", width: "100%" }}
      >
        <ModalHeader toggle={toggleProductEditModal}>
          Edit Product Details
        </ModalHeader>
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
                  <FormGroup>
                    <Label for="paymentStatus">Select Payment Status</Label>
                    <Input
                      id="paymentStatus"
                      name="paymentStatus"
                      type="select"
                      value={productEditFormData.paymentStatus}
                      onChange={handleProductEditInputChange}
                    >
                      <option value={"COMPLETED"}>COMPLETED</option>
                      <option value={"PENDING"}>PENDING</option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col xs={6}>
                  <FormGroup>
                    <Label for="shippingCharge">Shipping Charge</Label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">OMR</span>
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
                      value={moment(productEditFormData.shippedDate).format(
                        "YYYY-MM-DD"
                      )}
                      onChange={handleProductEditInputChange}
                      disabled={
                        !["SHIPPED", "DELIVERED", "CANCELED"].includes(
                          product?.shippingStatus
                        )
                      }
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
                      value={moment(productEditFormData.deliveredDate).format(
                        "YYYY-MM-DD"
                      )}
                      onChange={handleProductEditInputChange}
                      disabled={
                        !["DELIVERED"].includes(product?.shippingStatus)
                      }
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
                      value={moment(productEditFormData.canceledDate).format(
                        "YYYY-MM-DD"
                      )}
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
                      value={moment(
                        productEditFormData.returnRequestDate
                      ).format("YYYY-MM-DD")}
                      onChange={handleProductEditInputChange}
                      disabled={
                        !["PENDING", "APPROVED"].includes(product?.returnStatus)
                      }
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
                      value={moment(productEditFormData.returnDate).format(
                        "YYYY-MM-DD"
                      )}
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
                      value={moment(
                        productEditFormData.returnRejectDate
                      ).format("YYYY-MM-DD")}
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
                      value={moment(
                        productEditFormData.refundRequestDate
                      ).format("YYYY-MM-DD")}
                      onChange={handleProductEditInputChange}
                      disabled={
                        !["PENDING", "PAID"].includes(product?.refundStatus)
                      }
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
                      value={moment(productEditFormData.refundDate).format(
                        "YYYY-MM-DD"
                      )}
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
                        <span className="input-group-text">OMR</span>
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
          </Button>{" "}
          <Button color="secondary" onClick={toggleProductEditModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* ============== COMMENTS EDIT MODAL =============== */}

      <Modal isOpen={commentEditModal} toggle={toggleCommentEditModal}>
        <ModalHeader toggle={toggleCommentEditModal}>Edit Comments</ModalHeader>
        <ModalBody>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {product?.shippingStatus === "CANCELED" && (
              <div>
                <h5 style={{ color: "#b12349", marginBottom: "10px" }}>
                  Cancel
                </h5>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
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
                      name="cancelReasonUser"
                      id="cancelReasonUser"
                      value={commentFormData.cancelReasonUser}
                      onChange={handleCommentsInputChange}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "20px",
                      alignItems: "center",
                    }}
                  >
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
            )}

            {product?.returnStatus !== "NA" && (
              <div>
                <h5 style={{ color: "#b12349", marginBottom: "10px" }}>
                  Return
                </h5>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
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
                      name="returnReasonUser"
                      id="returnReasonUser"
                      value={commentFormData.returnReasonUser}
                      onChange={handleCommentsInputChange}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
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
            )}

            {product?.refundStatus === "PAID" && (
              <div>
                <h5 style={{ color: "#b12349", marginBottom: "20px" }}>
                  Refund
                </h5>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "20px",
                      alignItems: "center",
                    }}
                  >
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
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleCommentEditSubmit}>
            Submit
          </Button>{" "}
          <Button color="secondary" onClick={toggleCommentEditModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <ToastContainer />
      <ConfirmationOtpPopup submit={shippingStatus==="DELIVERED"?submitDeliveryOTP:shippingStatus==="CANCELED"?submitCancelOTP:()=>{}} isOpen={openShippingStatusOTP} toggle={toggleShippingOtpModal} otp={shippingOTP} setOtp={setShippingOTP}  />
    </div>
  );
}

export default OrderProductDetails;
