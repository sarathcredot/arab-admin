import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Button,
  Label,
  Input,
  FormFeedback,
  Form,
  Table,
  CardHeader,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

//redux
import { useSelector, useDispatch } from "react-redux";

import withRouter from "../../components/Common/withRouter";

//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb";

import userAvatar from "src/assets/images/users/user-dummy-img.jpg";


import avatar from "../../assets/images/users/avatar-1.jpg";

// actions
import { editProfile, resetProfileFlag } from "../../store/actions";
import { createSelector } from "reselect";
import { gql, useMutation, useQuery } from "@apollo/client";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { capitalCase, sentenceCase } from "change-case";
import moment from "moment";
import { formatCurrency } from "src/utils/formatCurrency";
import "./UserProfile.css"
import CustomButton from "src/components/Common/CustomButton";


interface UserData {
  email: string;
  name: string;
  _id: string;
  phoneNumber: string;
  age: string;
  gender: string;
  isBlocked: boolean;
  createdAt: string;
}

interface Order {
  _id: string;
  productId: string;
  orderId: string;
  itemId: string;
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
  orderDate: string;
  shippingStatus: string;
  shippedDate: string;
  deliveryDate: string;
  returnStatus: string;
  returnDate: string;
  returnRequestDate: string;
  returnRejectedDate: string;
  returnUserReason: string;
  refundStatus: string;
  refundAmount: number;
  refundDate: string;
  cancelledDate: string;
  cancelUserReason: string;
  courierId: string;
  invoiceNumber: string;
  invoice: {
    fileType: string;
    fileURL: string;
    mimeType: string;
    originalName: string;
  };
}

const UserProfile = () => {

  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId")
  const navigate = useNavigate();

  const [data, setData] = useState<UserData>();

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const pageSize = 5;
  const [maxRecords, setMaxRecords] = useState<number>(0);

  const GET_USER = gql`
    query GetUserProfileByAdmin($input: GetUserProfileByAdminInput!) {
  getUserProfileByAdmin(input: $input) {
    _id
    phoneNumber
    email
    gender
    age
    name
    isBlocked
    createdAt
  }
}
  `;
  const GET_USER_ORDER = gql`
    query GetUserOrderProductsByAdmin($input: GetUserOrderProductsByAdminInput!) {
  getUserOrderProductsByAdmin(input: $input) {
    maxRecords
    records {
      _id
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
      orderDate
      shippingStatus
      shippedDate
      deliveryDate
      returnStatus
      returnDate
      returnRequestDate
      returnRejectedDate
      returnUserReason
      refundStatus
      refundAmount
      refundDate
      cancelledDate
      cancelUserReason
      courierId
      invoiceNumber
      invoice {
        fileType
        fileURL
        mimeType
        originalName
      }
    }
  }
}
  `;


  const {
    loading: ordersLoading,
    error: ordersError,
    data: ordersDataResponse,
    refetch: ordersRefetch,
  } = useQuery(GET_USER_ORDER, {
    variables: {
      input: {
        page: currentPage,
        size: pageSize,
        userId: userId
      },
    },
  });

  const fetchData = async () => {
    try {
      const result = await ordersRefetch({
        input: {
          page: currentPage,
          size: pageSize,
          userId: userId
        },
      });
      setOrders(result.data.getUserOrderProductsByAdmin.records);
      setMaxRecords(result.data.getUserOrderProductsByAdmin.maxRecords);
    } catch (error: any) {
      console.error(error)
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, ordersRefetch, ordersLoading]);

  const UPDATAE_PROFILE = gql`
  mutation EditUserByAdmin($input: UserEditByAdminInput! ) {
  editUserByAdmin(input: $input) {
    _id
    
  }
}
  `;

  const [updateProfile] = useMutation(UPDATAE_PROFILE);

  const {
    loading: userLoading,
    error: userError,
    data: userData,
    refetch: userRefetch,
  } = useQuery(GET_USER, {
    variables: {
      input: {
        userId: userId
      }
    }
  });


  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      email: "",
      name: "",
      phoneNumber: "",
      isBlocked: false
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email format").required(),
      name: Yup.string().required("Name is required"),
      phoneNumber: Yup.string().required("phoneNumber is required"),
      isBlocked: Yup.string().required("Status is required"),


    }),
    onSubmit: async (values) => {
      try {
        let variables: any = {
          input: {
            userId: userId,
            email: values?.email,
            name: values?.name,
            phoneNumber: values?.phoneNumber,
            isBlocked: values?.isBlocked?.toString() === 'true' ? true : false,
            gender: data?.gender && sentenceCase(data?.gender),
            age: data?.age
          },
        };

        const response = await updateProfile({
          variables,
        });

        if (response) {
          userRefetch();
          toast.success("Successfully Updated Profile");
          setModal(false)

        }
      } catch (error: any) {
        toast.error(error.message);
        console.log(error);
      }
    },
  });


  useEffect(() => {
    if (
      userData &&
      userData.getUserProfileByAdmin
    ) {
      setData(userData.getUserProfileByAdmin);
      formik.setValues(userData.getUserProfileByAdmin);
    }
  }, [userData, userRefetch]);



  const totalPages = Math.ceil(maxRecords / pageSize);
  // // document.title = "Profile | collin";

  const items = [
    { text: "Dashboard", link: `/` },
    { text: "Users", link: `/user` },
  ];

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);



  const renderProductItem = (product: any, index: number) => {
    const { image, name, productName, sellingPrice, orderId, productId,
      orderDate, shippingStatus, courierId, _id, invoice, itemId,
      shippingCharge, deliveryDate, returnStatus, returnDate, refundStatus, refundAmount } = product;
    const formattedDate = moment(orderDate).format("YYYY-MM-DD");
    return (
      <Card onClick={() => navigate(`/shipping-orders/details?orderId=${orderId}&_id=${_id}`)} key={index}
        className="clickable-card"
        style={{
          display: 'flex', flexDirection: "row",
          justifyContent: "space-between",
          padding: '1rem 1rem', cursor: "pointer"
        }}>

        <div style={
          { display: 'flex', flexDirection: "row" }
        }>
          <div style={{ width: '100px', marginRight: '1rem' }}>
            <img
              src={image.fileURL || ""}
              alt={name}
              style={{ height: '100%', width: '100%', objectFit: 'cover', borderRadius: '8px', backgroundColor: '#CBD5E0' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>

            <h3 style={{ fontSize: '1.25rem', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{productName}</h3>
            <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#4A5568' }}>
              <span>{orderId}</span>
            </p>

            <div style={{ display: 'flex', fontSize: '0.875rem', color: '#4A5568' }}>
              <span>Shipping  : <b>{shippingStatus}</b></span>
              {returnStatus !== "NA" &&
                <>
                  <div style={{ margin: "0 6px", borderLeft: "1px solid #797e87" }} />
                  <span>Return  : <b>{returnStatus}</b></span>
                </>
              }
              {refundStatus !== "NA" &&
                <>
                  <div style={{ margin: "0 6px", borderLeft: "1px solid #797e87" }} />
                  <span>Refund  : <b>{refundStatus}</b></span>
                </>
              }
            </div>
            <div style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#4A5568' }}>  <p style={{ color: '#6B7280' }}>
              Order Date : {formattedDate}
            </p>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", height: "auto", justifyContent: "space-between" }}>
          <div >
            <h6>{formatCurrency(sellingPrice + shippingCharge)}</h6>
          </div>
          <div >
            <Button color="primary" size="sm">View</Button>
          </div>
        </div>
      </Card >

    );
  };



  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* <Breadcrumb items={items} currentPage="User Profile" /> */}
          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <div style={{ display: "flex", gap: "20px", }}>
                    <div>
                      <img
                        src={userAvatar}
                        alt="avatar"
                        className="avatar-md rounded-circle img-thumbnail"
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                          <h5 style={{ margin: "0" }}>{data?.name && capitalCase(data?.name)}</h5>
                          <div style={{ width: "80px", height: '20px', border: `1px solid ${data?.isBlocked ? "#dc4016" : "green"}`, borderRadius: "18px", display: "flex", alignItems: "center", justifyContent: "center", color: `${data?.isBlocked ? "#dc4016" : "green"}` }}>
                            <p style={{ margin: "0" }}>  {data?.isBlocked == false ? "Active" : "Blocked"}</p>
                          </div>
                        </div>
                        <CustomButton name="Edit User" icon="ic:baseline-edit" onClick={toggle} />
                      </div>
                      <div style={{ display: "flex" }}>

                        <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: "80px" }}>
                          <p className="mb-0">Email :</p>
                          <p className="mb-0">Name : </p>
                          <p className="mb-0">Phone : </p>
                          <p className="mb-0">Gender : </p>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                          <p className="mb-0"> {data?.email}</p>
                          <p className="mb-0"> {data?.name && capitalCase(data?.name)}</p>
                          <p className="mb-0"> {data?.phoneNumber}</p>
                          <p className="mb-0"> {data?.gender}</p>
                        </div>

                      </div>

                    </div>
                  </div>
                </CardBody>
              </Card>

            </Col>
          </Row>

          <div>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "10px" }}>
              <h4 className="mb-0 font-size-18">Orders</h4>

              <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                {orders.map(renderProductItem)}
              </div>

            </div>
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
          </div>


          <Modal isOpen={modal} toggle={toggle} >
            <ModalHeader toggle={toggle}>Update Profile</ModalHeader>
            <Form
              className="form-horizontal"
              onSubmit={(e) => {
                e.preventDefault();
                formik.handleSubmit();
                return false;
              }}
            >
              <ModalBody>
                <div className="">

                  <div
                    className="form-group pt-2"
                    style={{ display: "flex", flexDirection: "column", gap: "15px" }}
                  >
                    <div>
                      <Label className="form-label">Name</Label>
                      <Input
                        name="name"
                        className="form-control"
                        placeholder="Enter new Name"
                        type="text"
                        value={formik.values?.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />

                      {formik.touched.name && formik.errors.name && (
                        <div className="text-danger">{formik.errors.name}</div>
                      )}
                    </div>
                    <div>

                      <Label className="form-label">Email</Label>
                      <Input
                        name="email"
                        className="form-control"
                        placeholder="Enter new email"
                        type="text"
                        value={formik.values?.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />

                      {formik.touched.email && formik.errors.email && (
                        <div className="text-danger">{formik.errors.email}</div>
                      )}
                    </div>
                    <div>

                      <Label className="form-label pt-2">Phone Number</Label>
                      <Input
                        name="phoneNumber"
                        className="form-control"
                        placeholder="Enter New Phone Number"
                        type="text"
                        value={formik.values?.phoneNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />

                      {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                        <div className="text-danger">
                          {formik.errors.phoneNumber}
                        </div>
                      )}
                    </div>
                    <div>

                      <Label className="form-label pt-2">Status</Label>
                      <Input
                        name="isBlocked"
                        placeholder="Select Status"
                        type="select"
                        value={formik.values?.isBlocked?.toString()}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      >
                        <option disabled>
                          Select Status
                        </option>
                        <option value="false">
                          Active
                        </option>
                        <option value="true">
                          Blocked
                        </option>
                      </Input>

                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" type="submit">
                  Submit
                </Button>{' '}
                <Button color="secondary" onClick={toggle}>
                  Cancel
                </Button>
              </ModalFooter>
            </Form>
          </Modal>

        </Container>
      </div >
    </React.Fragment >
  );
};

export default withRouter(UserProfile);
