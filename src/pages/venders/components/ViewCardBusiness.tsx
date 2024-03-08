import React from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  CardText,
  Col,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Form,
} from "reactstrap";
import CustomButton from "src/components/Common/CustomButton";
import { fetchSignedUrl, useFetchSignedUrl } from "src/utils/fetchSignedUrl";
import { vendorBusinessOutletValidation } from "src/validation/validation";

interface IOutletRecord {
  _id: string;
  vendorId: string;
  outletName: string;
  country: string;
  district: string;
  village: string;
  address: string;
  contactPersonName: string;
  contactPersonNumber: string;
  contactPersonDesignation: string;
  status: string;
  remarks: string[];
  outletLicense: {
    fileType: string;
    fileURL: string;
    mimeType: string;
    originalName: string;
  };
  interiorImage: {
    fileType: string;
    fileURL: string;
    mimeType: string;
    originalName: string;
  };
  exteriorImage: {
    fileType: string;
    fileURL: string;
    mimeType: string;
    originalName: string;
  };
}

interface IPropes {
  IdBusiness?: string;
}

function ViewCardBusiness({ IdBusiness }: IPropes) {
  const [outletData, setOutletData] = useState<IOutletRecord>();
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  const PUT_KYC_APPROVE_BUSINESS_DETAILS = gql`
    mutation UpdateVendorOutletByAdmin(
      $input: UpdateVendorOutletByAdminInput!
      $outletLicense: Upload
      $interiorImage: Upload
      $exteriorImage: Upload
    ) {
      updateVendorOutletByAdmin(
        input: $input
        outletLicense: $outletLicense
        interiorImage: $interiorImage
        exteriorImage: $exteriorImage
      ) {
        message
      }
    }
  `;

  const GET_BUSINESS_OUTLET = gql`
    query GetVendorOutletRecordByAdmin($input: VendorOutletRecordByAdminInput!) {
      getVendorOutletRecordByAdmin(input: $input) {
        record {
          _id
          vendorId
          outletName
          country
          district
          village
          address
          contactPersonName
          contactPersonNumber
          contactPersonDesignation
          status
          remarks
          outletLicense {
            fileType
            fileURL
            mimeType
            originalName
          }
          interiorImage {
            fileType
            fileURL
            mimeType
            originalName
          }
          exteriorImage {
            fileType
            fileURL
            mimeType
            originalName
          }
        }
        message
      }
    }
  `;

  const {
    loading: outletLoding,
    error: outletError,
    data: outletDataResponse,
    refetch: outletRefetch,
  } = useQuery(GET_BUSINESS_OUTLET, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        _id: IdBusiness,
      },
    },
  });

  useEffect(() => {
    if (outletDataResponse?.getVendorOutletRecordByAdmin) {
      setOutletData(outletDataResponse.getVendorOutletRecordByAdmin.record);
    }
  }, [outletDataResponse, IdBusiness]);

  const [UpdateVendorOutletByAdmin] = useMutation(PUT_KYC_APPROVE_BUSINESS_DETAILS);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      outletName: "",
      country: "",
      district: "",
      village: "",
      address: "",
      contactPersonName: "",
      contactPersonNumber: "",
      contactPersonDesignation: "",
      status: "",
      remarks: "",
      exteriorImage: "",
      interiorImage: "",
      outletLicense: "",
    },
    validationSchema: vendorBusinessOutletValidation,
    onSubmit: async (values) => {
      await onSubmit(values);
    },
  });

  useEffect(() => {
    formik.setValues({
      outletName: outletData?.outletName || "",
      country: outletData?.country || "",
      district: outletData?.district || "",
      village: outletData?.village || "",
      address: outletData?.address || "",
      contactPersonName: outletData?.contactPersonName || "",
      contactPersonNumber: outletData?.contactPersonNumber || "",
      contactPersonDesignation: outletData?.contactPersonDesignation || "",
      interiorImage: "",
      exteriorImage: "",
      outletLicense: "",
      status: outletData?.status || "",
      remarks: Array.isArray(outletData?.remarks)
        ? outletData?.remarks.join(", ")
        : outletData?.remarks || "",
    });
  }, [modal, outletRefetch]);

  const onSubmit = async (values: any) => {
    try {
      let variables: any = {
        input: {
          _id: IdBusiness,
          outletName: values?.outletName || "",
          country: values?.country || "",
          district: values?.district || "",
          village: values?.village || "",
          address: values?.address || "",
          contactPersonName: values?.contactPersonName || "",
          contactPersonNumber: values?.contactPersonNumber || "",
          contactPersonDesignation: values?.contactPersonDesignation || "",
          status: values?.status || "",
          remarks: Array.isArray(values?.remarks)
            ? values.remarks
            : values?.remarks
            ? values.remarks.split(",").map((item: any) => item.trim())
            : [],
        },
      };

      if (values.outletLicense) {
        variables = {
          ...variables,
          outletLicense: values.outletLicense,
        };
      }
      if (values.exteriorImage) {
        variables = {
          ...variables,
          exteriorImage: values.exteriorImage,
        };
      }
      if (values.interiorImage) {
        variables = {
          ...variables,
          interiorImage: values.interiorImage,
        };
      }

      const response = await UpdateVendorOutletByAdmin({ variables });

      if (response) {
        toast.success("Successfully updated Company Details");
        outletRefetch();
        setModal(false);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  console.log(formik.values);

  function getStatusColor(status: any) {
    switch (status) {
      case "COMPLETED":
        return "#4CAF50";
      case "REJECTED":
        return "#F44336";
      case "UNDER_VERIFICATION":
        return "#fa8900";
      case "PENDING":
        return "#faf200";
    }
  }

  const getSignedUrlMutation = useFetchSignedUrl();

  const handleImageClick = async (fileURL: string, mimeType: string) => {
    try {
      const signedUrl = await fetchSignedUrl(getSignedUrlMutation, fileURL, mimeType);
      if (signedUrl) {
        window.open(signedUrl, "_blank");
      } else {
        console.error("Failed to get signed URL.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <>
        <Card
          style={{
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            marginTop: "20px",
          }}
        >
          <CardBody>
            <CardText>
              <Row>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                  <CustomButton name="Edit Business" icon="ic:baseline-edit" onClick={toggle} />
                </div>
              </Row>
              <Row>
                <Col md={6}>
                  <div>
                    <p className="mt-3">
                      <strong>Business Name :</strong> {outletData?.outletName || " nill"}
                    </p>
                    <p className="mt-3">
                      <strong>Address : </strong>
                      {outletData?.address || " nill"}
                    </p>
                    <p className="mt-3">
                      <strong>Country :</strong> {outletData?.country || " nill"}
                    </p>
                    <p className="mt-3">
                      <strong>District :</strong> {outletData?.district || " nill"}
                    </p>
                    <p className="mt-3">
                      <strong>Village :</strong> {outletData?.village || " nill"}
                    </p>
                  </div>
                  <p className="mt-3">
                    <div className="truncate-text">
                      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                        {outletData?.exteriorImage && (
                          <CustomButton
                            name="Exterior Image"
                            icon="mingcute:upload-line"
                            onClick={() =>
                              handleImageClick(
                                outletData?.exteriorImage?.fileURL,
                                outletData?.exteriorImage?.mimeType
                              )
                            }
                          />
                        )}
                        {outletData?.interiorImage && (
                          <CustomButton
                            name="Interior Image"
                            icon="mingcute:upload-line"
                            onClick={() =>
                              handleImageClick(
                                outletData?.interiorImage?.fileURL,
                                outletData?.interiorImage?.mimeType
                              )
                            }
                          />
                        )}
                        {outletData?.outletLicense && (
                          <CustomButton
                            name="Outlet License"
                            icon="mingcute:upload-line"
                            onClick={() =>
                              handleImageClick(
                                outletData?.outletLicense?.fileURL,
                                outletData?.outletLicense?.mimeType
                              )
                            }
                          />
                        )}
                      </div>
                    </div>
                  </p>
                </Col>
                <Col md={6}>
                  <p className="mt-3">
                    <strong>Status:</strong>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "5px 10px",
                        borderRadius: "15px",
                        border: `2px solid ${getStatusColor(outletData?.status)}`,
                        color: getStatusColor(outletData?.status),
                        marginLeft: "10px",
                        fontSize: "13px",
                      }}
                    >
                      {outletData?.status?.replace("_", " ")}
                    </span>
                  </p>

                  <p className="mt-3">
                    <strong>Contact Person Name :</strong>{" "}
                    {outletData?.contactPersonName || " nill"}
                  </p>
                  <p className="mt-3">
                    <strong>Contact Person Number :</strong>{" "}
                    {outletData?.contactPersonNumber || " nill"}
                  </p>
                  <p className="mt-3">
                    <strong>Contact Person Designation :</strong>{" "}
                    {outletData?.contactPersonDesignation || " nill"}
                  </p>
                  <p className="mt-3">
                    {outletData && (
                      <CardText>
                        <strong>Remarks:</strong>
                        <ul>
                          {outletData?.remarks.map((remark: any, index: any) => (
                            <li key={index}>{remark}</li>
                          ))}
                        </ul>
                      </CardText>
                    )}
                  </p>
                </Col>
              </Row>
            </CardText>
          </CardBody>
        </Card>
      </>

      <Modal isOpen={modal} toggle={toggle} style={{ minWidth: "700px" }}>
        <ModalHeader>Edit Outlet Details</ModalHeader>
        <ModalBody>
          <Form onSubmit={formik.handleSubmit}>
            <FormGroup>
              <Label>Outlet name</Label>
              <Input
                type="text"
                id="name"
                name="outletName"
                placeholder="Please enter outlet name"
                value={formik.values?.outletName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.outletName && formik.errors.outletName && (
                <div className="text-danger">{formik.errors.outletName}</div>
              )}
            </FormGroup>
            <Row>
              <Col xs={4}>
                <FormGroup>
                  <Label>Country</Label>
                  <Input
                    name="country"
                    placeholder="Please enter country "
                    value={formik.values?.country}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.country && formik.errors.country && (
                    <div className="text-danger">{formik.errors.country}</div>
                  )}
                </FormGroup>
              </Col>
              <Col xs={4}>
                <FormGroup>
                  <Label>District</Label>
                  <Input
                    name="district"
                    placeholder="Please enter district "
                    value={formik.values?.district}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.district && formik.errors.district && (
                    <div className="text-danger">{formik.errors.district}</div>
                  )}
                </FormGroup>
              </Col>
              <Col xs={4}>
                <FormGroup>
                  <Label>Village</Label>
                  <Input
                    name="village"
                    placeholder="Please enter village "
                    value={formik.values?.village}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.village && formik.errors.village && (
                    <div className="text-danger">{formik.errors.village}</div>
                  )}
                </FormGroup>
              </Col>
            </Row>

            <FormGroup>
              <Label>Address</Label>
              <Input
                name="address"
                placeholder="Please enter address "
                value={formik.values?.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.address && formik.errors.address && (
                <div className="text-danger">{formik.errors.address}</div>
              )}
            </FormGroup>

            <Row>
              <Col xs={4}>
                <FormGroup>
                  <Label>Contact person name</Label>
                  <Input
                    name="contactPersonName"
                    placeholder="Enter contact person name "
                    value={formik.values?.contactPersonName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.contactPersonName && formik.errors.contactPersonName && (
                    <div className="text-danger">{formik.errors.contactPersonName}</div>
                  )}
                </FormGroup>
              </Col>
              <Col xs={4}>
                <FormGroup>
                  <Label>Contact person number</Label>
                  <Input
                    name="contactPersonNumber"
                    placeholder=" enter contact person number "
                    value={formik.values?.contactPersonNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.contactPersonNumber && formik.errors.contactPersonNumber && (
                    <div className="text-danger">{formik.errors.contactPersonNumber}</div>
                  )}
                </FormGroup>
              </Col>
              <Col xs={4}>
                <FormGroup>
                  <Label>Contact person designation</Label>
                  <Input
                    name="contactPersonDesignation"
                    placeholder=" enter person designation "
                    value={formik.values?.contactPersonDesignation}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.contactPersonDesignation &&
                    formik.errors.contactPersonDesignation && (
                      <div className="text-danger">{formik.errors.contactPersonDesignation}</div>
                    )}
                </FormGroup>
              </Col>
            </Row>

            <FormGroup>
              <Label>Status</Label>
              <Input
                type="select"
                name="status"
                placeholder="Select status"
                value={formik.values?.status}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="" disabled>
                  Select status
                </option>
                <option value="PENDING">Pending</option>
                <option value="UNDER_VERIFICATION">Under Verification</option>
                <option value="COMPLETED">Completed</option>
                <option value="REJECTED">Rejected</option>
              </Input>
              {formik.touched.status && formik.errors.status && (
                <div className="text-danger">{formik.errors.status}</div>
              )}
            </FormGroup>

            <FormGroup>
              <Label>remarks</Label>
              <Input
                name="remarks"
                placeholder="Please enter remarks  (separate with commas)"
                value={formik.values?.remarks}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.remarks && formik.errors.remarks && (
                <div className="text-danger">{formik.errors.remarks}</div>
              )}
            </FormGroup>

            <Row>
              <Col xs={4}>
                <FormGroup>
                  <Label className="pt-2">Exterior Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    name="exteriorImage"
                    onChange={(event) => {
                      formik.setFieldValue("exteriorImage", event.currentTarget.files?.[0]);
                    }}
                  />
                </FormGroup>
              </Col>
              <Col xs={4}>
                <FormGroup>
                  <Label for="image " className="pt-2">
                    Interior Image
                  </Label>
                  <Input
                    type="file"
                    id="image"
                    accept="image/*"
                    name="interiorImage"
                    onChange={(event) => {
                      formik.setFieldValue("interiorImage", event.currentTarget.files?.[0]);
                    }}
                  />
                </FormGroup>
              </Col>
              <Col xs={4}>
                <FormGroup>
                  <Label for="image " className="pt-2">
                    Outlet License
                  </Label>
                  <Input
                    type="file"
                    id="image"
                    accept="image/*"
                    name="outletLicense"
                    onChange={(event) => {
                      formik.setFieldValue("outletLicense", event.currentTarget.files?.[0]);
                    }}
                  />
                </FormGroup>
              </Col>
            </Row>

            <ModalFooter style={{ marginTop: "20px" }}>
              <Button color="primary" type="submit">
                Submit
              </Button>
              <Button color="secondary" onClick={toggle}>
                Cancel
              </Button>
            </ModalFooter>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  );
}

export default ViewCardBusiness;
