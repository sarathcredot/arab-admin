import React, { useState, useEffect } from "react";
import { Button, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useFormik } from "formik";
import { DeliveryBoyValidation } from "src/validation/validation";
import { gql, useMutation, useQuery } from "@apollo/client";
import { ToastContainer, toast } from "react-toastify";
import Iconify from "src/components/iconify/Iconify";
import styles from "./style.module.css";

// Agent Type
interface IAgent {
  _id: string;
  fullName: string;
  contactNumber: string;
  agentType: string;
  isActive: Boolean;
  userID: String;
  vendorID: String;
  password: String;
}

// vendor type
interface IVendor {
  _id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  isBlocked: boolean;
  isKycCompleted: boolean;
  outletId: string;
  outletName: string;
  outletStatus: string;
  companyId: string;
  companyName: string;
  companyStatus: string;
}

interface Props {
  isOpen: boolean;
  toggle: () => void;
  //  IAgent | null | undefined;
  refetch: () => void;
  childrefetch?: () => void;
}

const POST_DELIVERY_BOY = gql`
  mutation CreateDeliveryAgent($input: CreateDeliveryAgentInput!, $image: Upload) {
    createDeliveryAgent(input: $input, image: $image) {
      _id
      message
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

const AddFormDeliveryBoy: React.FC<Props> = ({ isOpen, toggle, refetch, childrefetch }) => {
  const [createDeliveryBoy] = useMutation(POST_DELIVERY_BOY);
  const [vendorData, setVendorData] = useState<IVendor[]>([]);
  console.log("vendor data==", vendorData);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullName: "",
      countryCode: "+968",
      contactNumber: "",
      agentType: "",
      userID: "",
      vendorID: "",
      image: "",
      password: "",
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
          fullName: values?.fullName,
          contactNumber: values?.contactNumber.toString(),
          agentType: values?.agentType,
          userID: values?.userID,
          vendorID: values.vendorID||null ,
          password: values?.password,
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
      console.log("response = ",response)
      if (response) {
        refetch();

        toast.success("Successfully created a Delivery Boy");
        toggle();
        resetForm();
      }
      console.log("response>>",response);
      
      return toggle();
    } catch (error: any) {
      console.log("error>>>>>",error);
      
      toast.error(error.message);
      console.log(error.message);
    }
  };

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

  console.log("licence =", formik?.values?.image);
  console.log("vendorID =", formik?.values?.vendorID);

  useEffect(() => {
    if (vendorDataResponse && vendorDataResponse.getAllVendorsRecordsByAdmin) {
      setVendorData(vendorDataResponse.getAllVendorsRecordsByAdmin.records);
    }
  }, [vendorDataResponse]);
  useEffect(()=>{
    console.log("error",formik.errors);
    
  },[formik.errors])
  useEffect(()=>{
    console.log("hhkjsdhjsd");
    
  },[])
  return (
    <>
      <Modal
        isOpen={isOpen}
        toggle={toggle}
      >
        <ModalHeader toggle={toggle}>Add Delivery Boy</ModalHeader>
        <ModalBody>
          <Form onSubmit={formik.handleSubmit}>
            <FormGroup>
              <Label for="fullName">Full Name</Label>
              <Input
                type="text"
                id="fullName"
                name="fullName"
                placeholder=" Enter Full Name"
                value={formik.values?.fullName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.fullName && formik.errors.fullName && (
                <div className="text-danger">{formik.errors.fullName}</div>
              )}
            </FormGroup>
            <FormGroup>
              <Label>Phone Number</Label>
              <div className="input-group">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text bg-white">
                      <Iconify icon="openmoji:flag-oman" />
                    </span>
                  </div>
                  

                  <Input
                    type="text"
                    id="countryCode"
                    name="countryCode"
                    value={formik.values?.countryCode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled
                    style={{ width: "70px", flex: "none", backgroundColor: "#f8f9fa", color: "#6c757d" }}
                  />
                  <Input
                    type="text"
                    id="contactNumber"
                    name="contactNumber"
                    placeholder=" Enter Phone Number"
                    value={formik.values?.contactNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
              </div>

              {formik.touched.contactNumber && formik.errors.contactNumber && (
                <div className="text-danger">{formik.errors.contactNumber}</div>
              )}
            </FormGroup>
            <FormGroup>
              <div>
                <Label className="form-label pt-2">Type</Label>
                <Input
                  name="agentType"
                  placeholder="Select Agent Type"
                  type="select"
                  value={formik.values?.agentType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="" disabled>Select Agent Type</option>
                  <option value={"ArabDeals"}>ArabDeals</option>
                  <option value={"Vendor"}>Vendor</option>
                  <option value={"ThirdParty"}>ThirdParty</option>
                </Input>
              </div>
            </FormGroup>
            {formik.values?.agentType === "Vendor" && (
              <FormGroup>
                <div>
                  <Label className="form-label pt-2">Select Vendor</Label>
                  <Input
                    name="vendorID"
                    placeholder="Select Vendor"
                    id="vendorID"
                    type="select"
                    value={formik.values.vendorID||""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    defaultValue={vendorData[0]?._id}
                  >
                    <option value="" disabled>Select Vendor</option>
                    {vendorData &&
                      vendorData.map((item) => (
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
              <Label for="userID">Email</Label>
              <Input
                type="email"
                id="userID"
                name="userID"
                placeholder=" Enter Email"
                value={formik.values?.userID}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.userID && formik.errors.userID && <div className="text-danger">{formik.errors.userID}</div>}
            </FormGroup>
            <FormGroup>
              <Label
                for="image "
                className="pt-2"
              >
                Licence
              </Label>
              <Input
                type="file"
                id="image"
                accept="image/*"
                name="image"
                onChange={(event) => {
                  formik.setFieldValue("image", event.currentTarget.files?.[0] || []);
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input
                type="password"
                id="password"
                name="password"
                placeholder=" Enter Password"
                value={formik.values?.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-danger">{formik.errors.password}</div>
              )}
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

export default AddFormDeliveryBoy;
