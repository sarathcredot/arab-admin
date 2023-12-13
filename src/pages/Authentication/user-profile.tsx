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
} from "reactstrap";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

//redux
import { useSelector, useDispatch } from "react-redux";

import withRouter from "../../components/Common/withRouter";

//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb";

import avatar from "../../assets/images/users/avatar-1.jpg";

// actions
import { editProfile, resetProfileFlag } from "../../store/actions";
import { createSelector } from "reselect";
import { gql, useMutation, useQuery } from "@apollo/client";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router";
interface profilePic {
  fileURL: string;
}
interface AdminData {
  email: string;
  fullName: string;
  profilePic: profilePic;
}
const UserProfile = () => {
  const dispatch = useDispatch();

  const userprofileData = createSelector(
    (state: any) => state.profile,
    (state) => ({
      error: state.error,
      success: state.success,
    })
  );
  // Inside your component
  const { error, success } = useSelector(userprofileData);

  const [data, setData] = useState<AdminData>();

  const GET_ADMIN = gql`
    query Record {
      getAdminRecord {
        record {
          email
          fullName
          profilePic {
            fileURL
          }
        }
      }
    }
  `;

  const UPDATAE_PROFILE = gql`
    mutation Mutation($input: AdminEditProfileInput!, $image: Upload) {
      updateAdminProfile(input: $input, image: $image) {
        _id
        message
      }
    }
  `;

  const [updateProfile] = useMutation(UPDATAE_PROFILE);

  const {
    loading: adminLoading,
    error: adminError,
    data: adminData,
    refetch: adminRefetch,
  } = useQuery(GET_ADMIN);

  // useEffect(() => {
  //   const authUser: any = localStorage.getItem("authUser");
  //   if (authUser) {
  //     const obj = JSON.parse(authUser);
  //     if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
  //       setname(obj.displayName);
  //       setemail(obj.email);
  //       setidx(obj.uid);
  //     } else if (
  //       process.env.REACT_APP_DEFAULTAUTH === "fake" ||
  //       process.env.REACT_APP_DEFAULTAUTH === "jwt"
  //     ) {
  //       setname(obj.username);
  //       setemail(obj.email);
  //       setidx(obj.uid);
  //     }
  //     setTimeout(() => {
  //       dispatch(resetProfileFlag());
  //     }, 3000);
  //   }
  // }, [dispatch, success]);
  const navigate = useNavigate();
  const formik = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: "",

      password: "",
      image: null,
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email format"),
      password: Yup.string().min(6, "Password must be at least 6 characters"),
    
    }),
    onSubmit: async (values) => {
      try {
        let variables: any = {
          input: {
            email: values?.email,
            password: values?.password,
          },
        };

        if (values.image) {
          variables = {
            ...variables,
            image: values?.image,
          };
        }

        const response = await updateProfile({
          variables,
        });

        if (response) {
          adminRefetch();
          localStorage.setItem("adminData", JSON.stringify("admin_collin_Data updated"));
          toast.success("Successfully Updated Profile");
          formik.resetForm();
        }
      } catch (error: any) {
        toast.error(error.message);
        console.log(error);
      }
    },
  });

  useEffect(() => {
    if (
      adminData &&
      adminData.getAdminRecord &&
      adminData.getAdminRecord.record
    ) {
      setData(adminData.getAdminRecord.record);
    }
  }, [adminData, adminRefetch]);

  document.title = "Profile | collin";

  return (
    <React.Fragment>
      <ToastContainer />
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumb title="" breadcrumbItem="Profile" />

          <Row>
            <Col lg="12">
              {error && error ? <Alert color="danger">{error}</Alert> : null}
              {success ? <Alert color="success">{success}</Alert> : null}

              <Card>
                <CardBody>
                  <div className="d-flex">
                    <div className="ms-3">
                      <img
                        src={data?.profilePic?.fileURL}
                        alt=""
                        className="avatar-md rounded-circle img-thumbnail"
                      />
                    </div>
                    <div className="flex-grow-1 align-self-center ms-3">
                      <div className="text-muted">
                        <h5>{data?.fullName}</h5>
                        <p className="mb-1">Email : {data?.email} </p>
                        <p className="mb-0">Name: {data?.fullName}</p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <h4 className="card-title mb-4">Update Profile</h4>

          <Card style={{ width: "50%" }}>
            <CardBody>
              <div className="">
                <Form
                  className="form-horizontal"
                  onSubmit={(e) => {
                    e.preventDefault();
                    formik.handleSubmit();
                    return false;
                  }}
                >
                  <div
                    className="form-group pt-2"
                    style={{ alignItems: "center", justifyContent: "center" }}
                  >
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

                    <Label className="form-label pt-2">Password</Label>
                    <Input
                      name="password"
                      className="form-control"
                      placeholder="Enter new password"
                      type="password"
                      value={formik.values?.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />

                    {formik.touched.password && formik.errors.password && (
                      <div className="text-danger">
                        {formik.errors.password}
                      </div>
                    )}
                    <Label for="profileImage " className="pt-2">
                      Pofile Pic
                    </Label>
                    <Input
                      type="file"
                      id="profileImage"
                      accept="image/*"
                      name="image"
                      onChange={(event) => {
                        formik.setFieldValue(
                          "image",
                          event.currentTarget.files?.[0] || []
                        );
                      }}
                      onBlur={formik.handleBlur}
                    />
                  </div>

                  <div className="text-center mt-4">
                    <Button
                      type="submit"
                      style={{ backgroundColor: "rgba(0, 0, 0, 1)" }}
                    >
                      Update Profile
                    </Button>
                  </div>
                </Form>
              </div>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(UserProfile);
