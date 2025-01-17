import React, { useState, useEffect } from "react";
import { Button, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useFormik } from "formik";
import Select from "react-select";
import { DeliveryBoyValidation } from "src/validation/validation";
import { gql, useMutation, useQuery } from "@apollo/client";
import { ToastContainer, toast } from "react-toastify";
import Iconify from "src/components/iconify/Iconify";
import styles from "./style.module.css";

// // Agent Type
// interface IAgent {
//   _id: string;
//   name: string;
//   code: string;
//   couponType: string;
//   isActive: Boolean;
//   userID: String;
//   vendorID: String;
//   password: String;
// }
// coupon type
interface ICoupon {
  _id: string;
  name: string;
  code: string;
  description: string;
  couponType: string;
  discountType: string;
  couponApplicableType: string;
  discountValue: number;
  max_discount: number;
  minOrderAmount: number;
  validCatogories: any; // array
  validProducts: any; // array
  validUsers: any; // array
  usageLimit: number;
  usagePerUserLimit: number;
  startDate: string;
  expiryDate: string;
  isActive: boolean;
  userUsage: any; // array
}

interface Props {
  isOpen: boolean;
  toggle: () => void;
  //  IAgent | null | undefined;
  refetch?: () => void;
  childrefetch?: () => void;
}

const POST_DELIVERY_BOY = gql`
  mutation CreateDeliveryAgent($input: CreateDeliveryAgentInput!, $image: Upload) {
    createDeliveryAgent(input: $input, image: $image) {
      _id
      message
      error
    }
  }
`;

const GET_USERS = gql`
  query GetUsersByAdmin($input: userFilters) {
    getUsersByAdmin(input: $input) {
      maxRecords
      records {
        _id
        firstName
        email
        lastName
        displayName
      }
    }
  }
`;

const AddCoupon: React.FC<Props> = ({ isOpen, toggle, refetch }) => {
  const [createDeliveryBoy] = useMutation(POST_DELIVERY_BOY);

  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([
    {
      value: "783a6a58s7as1as68767",
      label: "Desktops",
    },
    {
      value: "783a6dda583tf2as68767",
      label: "Mobile",
    },
    {
      value: "783a6a58s71as68767",
      label: "Watch",
    },
  ]);

  const [validUsers, setValidUsers] = useState([]);
  const [validCatagories, setValidCatagories] = useState([]);
  const [validProducts, setValidProducts] = useState([]);

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

  useEffect(() => {
    if (usersDataResponse?.getUsersByAdmin?.records) {
      console.log(usersDataResponse?.getUsersByAdmin?.records);
      const formattedUsers = usersDataResponse?.getUsersByAdmin?.records?.map((item: any) => ({
        value: item?._id,
        label: item?.displayName || "user",
      }));

      setUsers(formattedUsers);
    }
  }, [usersDataResponse, isOpen]);

  if (usersError) {
    console.log("ERROR = ", usersError);
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "",
      code: "",
      description: "",
      couponType: "",
      discountType: "",
      couponApplicableType: "",
      discountValue: "",
      max_discount: "",
      minOrderAmount: "",
      usageLimit: "",
      usagePerUserLimit: "",
      startDate: "",
      expiryDate: "",
    },

    validationSchema: DeliveryBoyValidation,
    onSubmit: async (values, { resetForm }) => {
      await onSubmit(values, { resetForm });
    },
  });

  const onSubmit = async (values: any, { resetForm }: any) => {
    try {
      console.log(true);

      let variables: any = {
        input: {
          name: values?.name,
          code: values?.code,
          description: values?.description,
          couponType: values?.couponType,
          discountType: values?.discountType,
          couponApplicableType: values?.couponApplicableType,
          discountValue: values?.discountValue,
          max_discount: values?.max_discount,
          minOrderAmount: values?.minOrderAmount,
          usageLimit: values?.usageLimit,
          usagePerUserLimit: values?.usagePerUserLimit,
          startDate: values?.startDate,
          expiryDate: values?.expiryDate,
          validUsers: validUsers.length && validUsers,
        },
      };
      if (values.image) {
        variables = {
          ...variables,
          image: values?.image,
        };
      }
      console.log("variables=", variables);

      const response = await createDeliveryBoy({
        variables,
      });
      if (response) {
        console.log("RESPONSE = ", response);
        toast.success("Successfully created a Delivery Boy");
        refetch?.();
        toggle();
        resetForm();
      }
      console.log("RESPONSE = ", response);
    } catch (error: any) {
      console.log("catch errorrrrrrr");
      console.log("error>>>>>", error);

      toast.error(error.message);
      console.log(error.message);
    }
  };

  useEffect(() => {
    console.log("error", formik.errors);
  }, [formik.errors]);

  console.log("FORMIK = ", formik.values);
  console.log("USER = ", users);
  console.log("VALID USER = ", validUsers);
  return (
    <>
      <Modal
        isOpen={isOpen}
        toggle={toggle}
      >
        <ModalHeader toggle={toggle}>Add Coupon</ModalHeader>
        <ModalBody>
          <Form onSubmit={formik.handleSubmit}>
            <FormGroup>
              <Label for="name">Name</Label>
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
            <FormGroup>
              <Label>Coupon Code</Label>
              <Input
                type="text"
                id="code"
                name="code"
                placeholder=" ENTER COUPON CODE"
                value={formik.values?.code}
                onChange={(e) => {
                  const upperCaseValue = e.target.value.toUpperCase();
                  formik.setFieldValue("code", upperCaseValue);
                }}
                onBlur={formik.handleBlur}
              />
              {formik.touched.code && formik.errors.code && <div className="text-danger">{formik.errors.code}</div>}
            </FormGroup>
            <FormGroup>
              <Label>Description</Label>
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
            <FormGroup>
              <div>
                <Label className="form-label pt-2">Coupon Type</Label>
                <Input
                  name="couponType"
                  placeholder="Select Coupon Type"
                  type="select"
                  value={formik.values?.couponType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option
                    value=""
                    disabled
                  >
                    Select Coupon Type
                  </option>
                  <option value={"USER_SPECIFIC"}>User Specific</option>
                  <option value={"GLOBAL"}>Global</option>
                  <option value={"FIRST_ORDER"}>First Order</option>
                  <option value={"FESTIVE_SALE"}>Festive Sale</option>
                </Input>
                {formik.touched.couponType && formik.errors.couponType && (
                  <div className="text-danger">{formik.errors.couponType}</div>
                )}
              </div>
            </FormGroup>
            {formik.values?.couponType === "USER_SPECIFIC" && (
              <FormGroup>
                <div>
                  <Label className="form-label pt-2">Select Users</Label>
                  <Select
                    options={users}
                    isMulti
                    onChange={(selected: any) => {
                      setValidUsers(selected.map((item: any) => ({ user: item?.value })));
                    }}
                  />
                </div>
              </FormGroup>
            )}
            <FormGroup>
              <div>
                <Label className="form-label pt-2">Discount Type</Label>
                <Input
                  name="discountType"
                  placeholder="Select Discount Type"
                  type="select"
                  value={formik.values?.discountType}
                  onChange={formik.handleChange}
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
                </Input>
                {formik.touched.discountType && formik.errors.discountType && (
                  <div className="text-danger">{formik.errors.discountType}</div>
                )}
              </div>
            </FormGroup>
            <FormGroup>
              <div>
                <Label className="form-label pt-2">Coupon Applicable Type</Label>
                <Input
                  name="couponApplicableType"
                  placeholder="Select Applicable Type"
                  type="select"
                  value={formik.values?.couponApplicableType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option
                    value=""
                    disabled
                  >
                    Select Applicable Type
                  </option>
                  <option value={"ORDER"}>Order</option>
                  <option value={"SHIPPING"}>Shipping</option>
                  <option value={"CATEGORY"}>Category</option>
                </Input>
                {formik.touched.couponApplicableType && formik.errors.couponApplicableType && (
                  <div className="text-danger">{formik.errors.couponApplicableType}</div>
                )}
              </div>
            </FormGroup>
            {formik.values?.couponApplicableType === "CATEGORY" && (
              <FormGroup>
                <div>
                  <Label className="form-label pt-2">Select Categories</Label>
                  <Select
                    options={categories}
                    isMulti
                    // onChange={(selected: any) => {

                    // }}
                  />
                </div>
              </FormGroup>
            )}
            <FormGroup>
              <Label for="userID">Discount Value</Label>
              <Input
                type="number"
                id="discountValue"
                name="discountValue"
                placeholder="Enter discount value"
                value={formik.values?.discountValue}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.discountValue && formik.errors.discountValue && (
                <div className="text-danger">{formik.errors.discountValue}</div>
              )}
            </FormGroup>
            {formik.values?.discountType === "PERCENTAGE" && (
              <FormGroup>
                <div>
                  <Label className="form-label pt-2">Maximum Discount</Label>
                  <Input
                    name="max_discount"
                    placeholder="Enter maximum amount"
                    id="max_discount"
                    type="number"
                    value={formik.values.max_discount || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />

                  {formik.touched.max_discount && formik.errors.max_discount && (
                    <div className="text-danger">{formik.errors.max_discount}</div>
                  )}
                </div>
              </FormGroup>
            )}
            <FormGroup>
              <Label for="password">Minimum Order Amount</Label>
              <Input
                type="number"
                id="minOrderAmount"
                name="minOrderAmount"
                placeholder=" Enter amount"
                value={formik.values?.minOrderAmount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.minOrderAmount && formik.errors.minOrderAmount && (
                <div className="text-danger">{formik.errors.minOrderAmount}</div>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="password">Usage Limit</Label>
              <Input
                type="number"
                id="usageLimit"
                name="usageLimit"
                placeholder=" Enter limit"
                value={formik.values?.usageLimit}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.usageLimit && formik.errors.usageLimit && (
                <div className="text-danger">{formik.errors.usageLimit}</div>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="usagePerUserLimit">Usage Per User</Label>
              <Input
                type="number"
                id="usagePerUserLimit"
                name="usagePerUserLimit"
                placeholder=" Enter limit"
                value={formik.values?.usagePerUserLimit}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.usagePerUserLimit && formik.errors.usagePerUserLimit && (
                <div className="text-danger">{formik.errors.usagePerUserLimit}</div>
              )}
            </FormGroup>

            <FormGroup>
              <Label for="startDate">Validity Period</Label>
              <div
                style={{
                  display: "flex",
                  gap: 10,
                }}
              >
                <Input
                  type="date"
                  id="startDate"
                  name="startDate"
                  placeholder=" Enter date"
                  value={formik.values?.startDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <Input
                  type="date"
                  id="expiryDate"
                  name="expiryDate"
                  placeholder=" Enter date"
                  value={formik.values?.expiryDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {(formik.touched.startDate && formik.touched.expiryDate && formik.errors.startDate) ||
                (formik.errors.expiryDate && (
                  <div className="text-danger">{formik.errors.startDate ?? formik.errors.expiryDate}</div>
                ))}
            </FormGroup>
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

export default AddCoupon;
