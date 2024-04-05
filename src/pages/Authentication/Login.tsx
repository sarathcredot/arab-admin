import React, { useEffect, useState } from "react";

import {
  Row,
  Col,
  Container,
  Form,
  Input,
  FormFeedback,
  Label,
  Alert,
} from "reactstrap";

import PropTypes from "prop-types";

//redux
import { useSelector, useDispatch } from "react-redux";

import { Link, useNavigate } from "react-router-dom";
import withRouter from "../../components/Common/withRouter";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

//Social Media Imports
import { GoogleLogin } from "react-google-login";
// import TwitterLogin from "react-twitter-auth"
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

// actions
import { loginUser, socialLogin } from "../../store/actions";

// import images
import logo from "../../assets/images/arabDealLogo.svg";

//Import config
import config from "../../config";
import CarouselPage from "../AuthenticationInner/CarouselPage";
import { createSelector } from "reselect";
import { gql, useMutation } from "@apollo/client";
import { ToastContainer, toast } from "react-toastify";

interface LoginProps {
  history: object;
}

const Login = (props: any) => {
  const dispatch = useDispatch();

  const errorData = createSelector(
    (state: any) => state.login,
    (state) => ({
      error: state.error,
    })
  );
  // Inside your component
  const { error } = useSelector(errorData);
  const navigate = useNavigate();

  // const signIn = (res: any, type: any) => {
  //   if (type === "google" && res) {
  //     const postData = {
  //       name: res.profileObj.name,
  //       email: res.profileObj.email,
  //       token: res.tokenObj.access_token,
  //       idToken: res.tokenId,
  //     };
  //     dispatch(socialLogin(postData, props.router.navigate, type));
  //   } else if (type === "facebook" && res) {
  //     const postData = {
  //       name: res.name,
  //       email: res.email,
  //       token: res.accessToken,
  //       idToken: res.tokenId,
  //     };
  //     dispatch(socialLogin(postData, props.router.navigate, type));
  //   }
  // };

  // // handleGoogleLoginResponse
  // const googleResponse = (response: Object) => {
  //   signIn(response, "google");
  // };

  // // handleFacebookLoginResponse
  // const facebookResponse = (response: Object) => {
  //   signIn(response, "facebook");
  // };

  const LOGIN_MUTATION = gql`
    mutation UpdateCategory($input: AdminLoginInput!) {
      loginAdmin(input: $input) {
        _id
        token
      }
    }
  `;

  const [loginAdmin] = useMutation(LOGIN_MUTATION);

  // document.title = "Login | Arab Deals";

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await loginAdmin({
          variables: {
            input: {
              email: values.email,
              password: values.password,
            },
          },
        });

        if (response.data.loginAdmin.token) {
          localStorage.setItem("admin_token", response.data.loginAdmin.token);
          toast.success("Successfully logged in");
          navigate("/dashboard");
        } else {
          return toast.error("please provide the valid email or password ");
        }
      } catch (error) {
        console.log(error);
        return toast.error("please provide the valid email or password ");
      }
    },
  });

  const signIn = (type: any) => {
    dispatch(socialLogin(type, props.router.navigate));
  };

  const socialResponse = (type: any) => {
    signIn(type);
  };

  const [passwordShow, setPasswordShow] = useState(false);
  const token = localStorage.getItem("admin_token");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      navigate("/");
    }
  }, [token]);

  return (
    <React.Fragment>
      <ToastContainer />
      <div className="auth-page">
        <Container fluid className="p-0">
          <Row className="g-0">
            <Col lg={4} md={5} className="col-xxl-3">
              <div className="auth-full-page-content d-flex p-sm-5 p-4">
                <div className="w-100">
                  <div className="d-flex flex-column h-100">
                    {/* <div className="mb-4 mb-md-5 text-center">
                      <Link to="/dashboard" className="d-block auth-logo">
                        <img src={logo} alt="" height="28" />{" "}
                        <span className="logo-txt">Arab Deals Admin Portal</span>
                      </Link>
                    </div> */}
                    <div className="auth-content my-auto">
                      <div className="text-center">
                        {/* <h5 className="mb-0">Welcome Back !</h5>
                        <p className="text-muted mt-2">
                          Sign in to continue to Arab Deals.
                        </p> */}

                        <img src={logo} alt="" height="90%" />
                        <p
                          className="text-muted mt-5"
                          style={{
                            color: "#00000",
                            textAlign: "center",
                            fontSize: "25px",
                            fontWeight: "300",
                            lineHeight: "normal",
                            letterSpacing: "0.5px",
                            fontFamily: "Arial",
                          }}
                        >
                          Welcome Back!
                        </p>
                      </div>
                      <Form
                        className="custom-form mt-4 pt-2"
                        onSubmit={(e) => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}
                      >
                        {/* {error ? <Alert color="danger">{error}</Alert> : null} */}
                        <div className="mb-3">
                          {/* <Label className="form-label">Email</Label> */}
                          <Input
                            name="email"
                            className="form-control"
                            placeholder="Enter Email"
                            type="email"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.email || ""}
                            invalid={
                              validation.touched.email &&
                                validation.errors.email
                                ? true
                                : false
                            }

                            style={{ borderRadius: "15px ", height: "52px", fontFamily: "Arial", }}
                          />
                          {validation.touched.email &&
                            validation.errors.email ? (
                            <FormFeedback type="invalid">
                              {validation.errors.email}
                            </FormFeedback>
                          ) : null}
                        </div>

                        <div className="mb-3">
                          {/* <Label className="form-label">Password</Label> */}
                          <div className="d-flex align-items-start">
                            {/* <div className="flex-grow-1">
                              <Label className="form-label">Password</Label>
                            </div> */}
                            {/* <div className="flex-shrink-0">
                              <div className="">
                                <Link
                                  to="/page-recoverpw"
                                  className="text-muted"
                                >
                                  Forgot password?
                                </Link>
                              </div>
                            </div> */}
                          </div>
                          <div className="input-group auth-pass-inputgroup" >
                            <Input
                              name="password"
                              value={validation.values.password || ""}
                              type={passwordShow ? "text" : "password"}
                              placeholder="Enter Password"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              invalid={
                                validation.touched.password &&
                                  validation.errors.password
                                  ? true
                                  : false
                              }
                              style={{ borderTopLeftRadius: "15px ", borderBottomLeftRadius: "15px ", height: "52px", fontFamily: "Arial", }}
                            />
                            <button
                              onClick={() => setPasswordShow(!passwordShow)}
                              className="btn btn-light shadow-none ms-0"
                              type="button"
                              id="password-addon"
                              style={{ borderTopRightRadius: "15px ", borderBottomRightRadius: "15px", height: "52px", }}
                            >
                              <i className={`mdi ${passwordShow ? "mdi-eye-outline" : "mdi-eye-off-outline"}`}></i>
                            </button>
                            {validation.touched.password &&
                              validation.errors.password ? (
                              <FormFeedback type="invalid">
                                {validation.errors.password}
                              </FormFeedback>
                            ) : null}
                          </div>
                        </div>

                        <div className="row mb-4">
                          <div className="col">
                            {/* <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="remember-check"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="remember-check"
                              >
                                Remember me
                              </label>
                            </div> */}

                            <div className="mt-3 d-grid">
                              <button
                                className="btn  btn-block"
                                type="submit"
                                style={{
                                  backgroundColor: "rgba(43, 43, 42, 1)",
                                  color: "#FFFFFF",
                                  borderRadius: "30px",
                                  height: "52px",
                                  fontSize: "14px",
                                  fontWeight: "600",
                                  lineHeight: "34px",
                                  letterSpacing: "1px",
                                  fontFamily: "Arial",

                                }}
                              // onClick={() => logIn()}
                              >
                                LOGIN
                              </button>
                            </div>
                          </div>
                        </div>
                      </Form>

                      {/* <div className="mt-4 text-center">
                        <h5 className="font-size-14 mb-3">Sign in with</h5>

                        <ul className="list-inline">
                          <li className="list-inline-item">
                            <FacebookLogin
                              appId={config.facebook.APP_ID}
                              autoLoad={false}
                              callback={facebookResponse}
                              render={(renderProps: any) => (
                                <Link
                                  to="#"
                                  className="social-list-item bg-primary text-white border-primary"
                                  onClick={renderProps.onClick}
                                >
                                  <i className="mdi mdi-facebook" />
                                </Link>
                              )}
                            />
                            <Link
                              to="#"
                              className="social-list-item bg-primary text-white border-primary"
                              onClick={e => {
                                e.preventDefault();
                                socialResponse("facebook");
                              }}
                            >
                              <i className="mdi mdi-facebook" />
                            </Link>
                          </li>
                          <li className="list-inline-item">
                           <TwitterLogin
                             loginUrl={
                               "http://localhost:4000/api/v1/auth/twitter"
                         
                             onSuccess={this.twitterResponse}
                             onFailure={this.onFailure}
                             requestTokenUrl={
                               "http://localhost:4000/api/v1/auth/twitter/revers"
                             }
                             showIcon={false}
                             tag={"div"}
                           >
                             <a
                               href=""
                               className="social-list-item bg-info text-white border-info"
                             >
                               <i className="mdi mdi-twitter"/>
                             </a>
                           </TwitterLogin>
                          </li>
                          <li className="list-inline-item">
                            <GoogleLogin
                              clientId="CLIENT_ID" 
                              render={(renderProps) => (
                                <Link
                                  to="#"
                                  className="social-list-item bg-danger text-white border-danger"
                                  onClick={renderProps.onClick}
                                >
                                  <i className="mdi mdi-google" />
                                </Link>
                              )}
                              onSuccess={googleResponse}
                              onFailure={() => { }}
                            />

                            <Link
                              to="#"
                              className="social-list-item bg-danger text-white border-danger"
                              onClick={e => {
                                e.preventDefault();
                                socialResponse("google");
                              }}
                            >
                              <i className="mdi mdi-google" />
                            </Link>
                          </li>
                        </ul>
                      </div> */}

                      {/* <div className="mt-5 text-center">
                        <p className="text-muted mb-0">
                          Don't have an account ?{" "}
                          <Link
                            to="/register"
                            className="text-primary fw-semibold"
                          >
                            {" "}
                            Signup now{" "}
                          </Link>{" "}
                        </p>
                      </div> */}
                    </div>
                    <div className="mt-4 mt-md-5 text-center">
                      {/* <p className="mb-0">
                        © {new Date().getFullYear()} Minia . Crafted with{" "}
                        <i className="mdi mdi-heart text-danger"></i> by
                        Themesbrand
                      </p> */}
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <CarouselPage />
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(Login);
Login.propTypes = {
  history: PropTypes.object,
};
