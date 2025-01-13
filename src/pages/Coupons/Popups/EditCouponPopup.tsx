import { gql, useMutation, useQuery } from "@apollo/client";
import { useFormik } from "formik";
import moment from "moment";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import { CouponValidation } from "src/validation/validation";

interface ICouponEdit {
  _id: string;
  name: string;
  code: string;
  description: string;
  discountType: string;
  discountValue: any;
  max_discount: any;
  minOrderAmount: any;
  validBrands: any; // array
  validCategories: any; // array
  validProducts: any; // array
  validUsers: any; // array
  usageLimit: any;
  usagePerUserLimit: any;
  orderCount: any;
  startDate: any;
  expiryDate: any;
  isActive: boolean;
  // userUsage: any; // array
}

interface Props {
  isOpen: boolean;
  toggle: () => void;
  //  IAgent | null | undefined;
  refetch?: () => void;
  data?: ICouponEdit;
  // data?: any;
}

const GET_BRAND = gql`
  query GetAllBrandRecordsByAdmin($input: BrandRecordsFilter) {
    getAllBrandRecordsByAdmin(input: $input) {
      records {
        _id
        brandName
      }
      message
    }
  }
`;
const GET_CATEGORIES = gql`
  query Records($input: categoryForCouponInput!) {
    getCategoriesByAdminForCoupon(input: $input) {
      records {
        _id
        categoryName
      }
    }
  }
`;
const GET_PRODUCTS = gql`
  query Records($input: ProductFiltersforCoupon) {
    getProductsByAdminForCoupon(input: $input) {
      records {
        _id
        productName
      }
    }
  }
`;
const GET_USERS = gql`
  query GetUsersByAdmin($input: userFilters) {
    getUsersByAdmin(input: $input) {
      maxRecords
      records {
        _id
        displayName
      }
    }
  }
`;
const EDIT_COUPON = gql`
  mutation EditCouponsByAdmin($input: EditCouponsByAdminInput!) {
    editCouponsByAdmin(input: $input) {
      success
      message
    }
  }
`;

const EditCouponPopup: React.FC<Props> = ({ isOpen, toggle, refetch, data }) => {
  const [editCoupon] = useMutation(EDIT_COUPON);

  const [validBrands, setValidBrands] = useState([]);
  const [validCategories, setValidCategories] = useState([]);
  const [validProducts, setValidProducts] = useState([]);
  const [validUsers, setValidUsers] = useState([]);

  // get brands query
  const {
    loading: brandLoading,
    error: brandError,
    data: brandDataResponse,
    refetch: brandRefetch,
  } = useQuery(GET_BRAND, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        paginationEnabled: false,
      },
    },
  });
  // get categories query
  const {
    loading: categoryLoading,
    error: categoryError,
    data: categoryDataResponse,
    refetch: categoryRefetch,
  } = useQuery(GET_CATEGORIES, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        brands: validBrands.length ? validBrands.map((item: any) => item?.value) : null,
      },
    },
  });
  // get products query
  const {
    loading: productLoading,
    error: productError,
    data: productDataResponse,
    refetch: productRefetch,
  } = useQuery(GET_PRODUCTS, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        brands: validBrands.length ? validBrands.map((item: any) => item?.value) : null,
        categories: validCategories.length ? validCategories.map((item: any) => item?.value) : null,
      },
    },
  });

  // get users query
  const {
    loading: usersLoading,
    error: usersError,
    data: usersDataResponse,
    refetch: usersRefetch,
  } = useQuery(GET_USERS, {
    fetchPolicy: "network-only",
    variables: {
      input: {},
    },
  });

  if (usersError) {
    console.log("ERROR = ", usersError);
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "",
      code: "",
      description: "",
      discountType: "",
      max_discount: "", // if only %
      discountValue: "",
      minOrderAmount: "",
      usageLimit: "",
      usagePerUserLimit: "",
      orderCount: "",
      startDate: "",
      expiryDate: "",
    },

    validationSchema: CouponValidation,
    onSubmit: async (values, { resetForm }) => {
      await onSubmit(values, { resetForm });
    },
  });

  const onSubmit = async (values: any, { resetForm }: any) => {
    try {
      let variables: any = {
        input: {
          _id: data?._id,
          name: values?.name,
          code: values?.code,
          description: values?.description,
          discountType: values?.discountType,
          max_discount: values?.max_discount === "" ? 0 : values?.max_discount,
          discountValue: values?.discountValue === "" ? 0 : values?.discountValue,
          minOrderAmount: values?.minOrderAmount === "" ? 0 : values?.minOrderAmount,
          usageLimit: values?.usageLimit === "" ? 0 : values?.usageLimit,
          usagePerUserLimit: values?.usagePerUserLimit === "" ? 0 : values?.usagePerUserLimit,
          orderCount: values?.orderCount === "" ? 0 : values?.orderCount,
          startDate: values?.startDate,
          expiryDate: values?.expiryDate,
          validBrands: validBrands.length ? validBrands.map((item: any) => ({ brand: item?.value })) : [],
          validCategories: validCategories.length
            ? validCategories.map((item: any) => ({ category: item?.value }))
            : [],
          validProducts: validProducts.length ? validProducts.map((item: any) => ({ product: item?.value })) : [],
          validUsers: validUsers.length ? validUsers.map((item: any) => ({ user: item?.value })) : [],
        },
      };
      console.log("variables = ", variables);

      const response = await editCoupon({
        variables,
      });
      if (response?.data?.editCouponsByAdmin?.success) {
        toast.success(response?.data?.editCouponsByAdmin?.message);
        refetch?.();
        // toggle();
        // resetForm();
      }
      console.log("RESPONSE = ", response);
    } catch (error: any) {
      console.log("catch errorrrrrrr");
      console.log("error>>>>>", error);

      toast.error(error.message);
      console.log(error.message);
    }
  };

  console.log("CATEGORIES = ", categoryDataResponse);
  console.log("VALID BRANDS = ", validBrands);
  console.log("PRODUCTS = ", productDataResponse);
  console.log("VALID USER = ", validUsers);
  console.log("VALID CATEGORIES = ", validCategories);
  console.log("FORMIK = ", formik.values);

  useEffect(() => {
    if (data) {
      console.log("DATA = ", data);
      formik.setValues({
        name: data?.name ?? "",
        code: data?.code ?? "",
        description: data?.description ?? "",
        discountType: data?.discountType ?? "",
        max_discount: data?.max_discount ?? "",
        discountValue: data?.discountValue ?? "",
        minOrderAmount: data?.minOrderAmount ?? "",
        usageLimit: data?.usageLimit ?? "",
        usagePerUserLimit: data?.usagePerUserLimit ?? "",
        orderCount: data?.orderCount ?? "",
        startDate: moment(data?.startDate).format("YYYY-MM-DD") ?? "",
        expiryDate: moment(data?.expiryDate).format("YYYY-MM-DD") ?? "",
      });
      setValidBrands(data?.validBrands ?? []);
      setValidCategories(data?.validCategories ?? []);
      setValidProducts(data?.validProducts ?? []);
      setValidUsers(data?.validUsers ?? []);
    }
  }, [data]);

  return (
    <>
      <Modal
        size="lg"
        isOpen={isOpen}
        toggle={toggle}
      >
        <ModalHeader toggle={toggle}>Edit Coupon</ModalHeader>
        <ModalBody>
          <Form onSubmit={formik.handleSubmit}>
            <Row style={{ marginBottom: 5 }}>
              <h5 style={{ fontSize: "15px" }}>General</h5>
              <Col>
                <FormGroup>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    placeholder=" Enter Coupon Name"
                    value={formik.values?.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.name && formik.errors.name && <div className="text-danger">{formik.errors.name}</div>}
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Input
                    type="text"
                    id="code"
                    name="code"
                    placeholder=" Enter Coupon Code"
                    value={formik.values?.code}
                    onChange={(e) => {
                      const upperCaseValue = e.target.value.toUpperCase();
                      formik.setFieldValue("code", upperCaseValue);
                    }}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.code && formik.errors.code && <div className="text-danger">{formik.errors.code}</div>}
                </FormGroup>
              </Col>
              <Col md={12}>
                <FormGroup>
                  <Input
                    type="textarea"
                    id="description"
                    name="description"
                    placeholder=" Enter coupon description"
                    value={formik.values?.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.description && formik.errors.description && (
                    <div className="text-danger">{formik.errors.description}</div>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <Row style={{ marginBottom: 5, flexWrap: "wrap" }}>
              <h5 style={{ fontSize: "15px" }}>Discount</h5>
              <Col>
                <FormGroup>
                  <div>
                    <Input
                      name="discountType"
                      placeholder="Select Discount Type"
                      type="select"
                      value={formik.values?.discountType}
                      onChange={(e) => {
                        formik.handleChange(e);
                        formik.setFieldValue("discountValue", "");
                        formik.setFieldValue("max_discount", "");
                      }}
                      onBlur={formik.handleBlur}
                    >
                      <option
                        value=""
                        disabled
                      >
                        Select Discount Type
                      </option>
                      <option value={"PERCENTAGE"}>Percentage</option>
                      <option value={"FLAT"}>Flat</option>
                      <option value={"FREE_SHIPPING"}>Free Shipping</option>
                    </Input>
                    {formik.touched.discountType && formik.errors.discountType && (
                      <div className="text-danger">{formik.errors.discountType}</div>
                    )}
                  </div>
                </FormGroup>
              </Col>
              {formik.values?.discountType === "PERCENTAGE" && (
                <Col>
                  <FormGroup>
                    <Input
                      type="number"
                      id="max_discount"
                      name="max_discount"
                      placeholder=" Enter Maximum Discount Amount"
                      value={formik.values?.max_discount}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </FormGroup>
                </Col>
              )}
              {formik.values?.discountType !== "FREE_SHIPPING" && (
                <Col>
                  <FormGroup>
                    <Input
                      type="number"
                      id="discountValue"
                      name="discountValue"
                      placeholder=" Enter Discount Amount"
                      value={formik.values?.discountValue}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </FormGroup>
                </Col>
              )}
              <Col>
                <FormGroup>
                  <Input
                    type="number"
                    id="minOrderAmount"
                    name="minOrderAmount"
                    placeholder=" Enter Minimum Order Amount"
                    value={formik.values?.minOrderAmount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.minOrderAmount && formik.errors.minOrderAmount && (
                    <div className="text-danger">{formik.errors.minOrderAmount}</div>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <Row style={{ marginBottom: 5 }}>
              <h5 style={{ fontSize: "15px" }}>Restriction</h5>
              <Col>
                <FormGroup>
                  <Select
                    options={
                      brandDataResponse && brandDataResponse?.getAllBrandRecordsByAdmin?.records?.length
                        ? brandDataResponse?.getAllBrandRecordsByAdmin?.records.map((item: any) => ({
                            label: item?.brandName,
                            value: item?._id,
                          }))
                        : []
                    }
                    isMulti
                    isLoading={brandLoading}
                    placeholder="Select Brands"
                    value={validBrands}
                    onChange={(selected: any) => {
                      setValidBrands(selected);
                      setValidCategories([]);
                      setValidProducts([]);
                    }}
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Select
                    options={
                      categoryDataResponse && categoryDataResponse?.getCategoriesByAdminForCoupon?.records?.length
                        ? categoryDataResponse?.getCategoriesByAdminForCoupon?.records.map((item: any) => ({
                            label: item?.categoryName,
                            value: item?._id,
                          }))
                        : []
                    }
                    isMulti
                    isLoading={brandLoading}
                    placeholder="Select Categories"
                    value={validCategories}
                    onChange={(selected: any) => {
                      setValidCategories(selected);
                      setValidProducts([]);
                    }}
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Select
                    options={
                      productDataResponse && productDataResponse?.getProductsByAdminForCoupon?.records?.length
                        ? productDataResponse?.getProductsByAdminForCoupon?.records.map((item: any) => ({
                            label: item?.productName,
                            value: item?._id,
                          }))
                        : []
                    }
                    isMulti
                    isLoading={productLoading}
                    placeholder="Select Products"
                    value={validProducts}
                    onChange={(selected: any) => {
                      setValidProducts(
                        selected.map((item: any) => ({
                          label: item?.label.length > 10 ? ` ${item?.label.slice(0, 10)}...` : item?.label,
                          value: item?.value,
                        }))
                      );
                    }}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row style={{ marginBottom: 5 }}>
              <h5 style={{ fontSize: "15px" }}>Usage Limit</h5>
              <Col md={6}>
                <FormGroup>
                  <Select
                    options={
                      usersDataResponse && usersDataResponse?.getUsersByAdmin?.records?.length
                        ? usersDataResponse?.getUsersByAdmin?.records.map((item: any) => ({
                            label: item?.displayName || "user",
                            value: item?._id,
                          }))
                        : []
                    }
                    isMulti
                    isLoading={brandLoading}
                    placeholder="Select Users"
                    value={validUsers}
                    onChange={(selected: any) => {
                      setValidUsers(selected);
                    }}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Input
                    type="number"
                    id="usageLimit"
                    name="usageLimit"
                    placeholder=" Enter Total Redemptions"
                    value={formik.values?.usageLimit}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.usageLimit && formik.errors.usageLimit && (
                    <div className="text-danger">{formik.errors.usageLimit}</div>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Input
                    type="number"
                    id="usagePerUserLimit"
                    name="usagePerUserLimit"
                    placeholder=" Enter Per-User Limit"
                    value={formik.values?.usagePerUserLimit}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.usagePerUserLimit && formik.errors.usagePerUserLimit && (
                    <div className="text-danger">{formik.errors.usagePerUserLimit}</div>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Input
                    type="number"
                    id="orderCount"
                    name="orderCount"
                    placeholder=" Enter Applicable Order No."
                    value={formik.values?.orderCount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.orderCount && formik.errors.orderCount && (
                    <div className="text-danger">{formik.errors.orderCount}</div>
                  )}
                </FormGroup>
              </Col>
            </Row>
            <Row style={{ marginBottom: 5 }}>
              <h5 style={{ fontSize: "15px" }}>Validity Period</h5>
              <Col>
                <FormGroup>
                  <Input
                    type="date"
                    id="startDate"
                    name="startDate"
                    placeholder=" Enter Start Date"
                    value={formik.values?.startDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.startDate && formik.errors.startDate && (
                    <div className="text-danger">{formik.errors.startDate}</div>
                  )}
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Input
                    type="date"
                    id="expiryDate"
                    name="expiryDate"
                    placeholder=" Enter Per-User Limit"
                    value={formik.values?.expiryDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </FormGroup>
              </Col>
            </Row>
            <ModalFooter style={{ marginTop: "20px" }}>
              <Button color="primary">Submit</Button>
              <Button
                color="secondary"
                onClick={toggle}
              >
                Cancel
              </Button>
            </ModalFooter>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default EditCouponPopup;
