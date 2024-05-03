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
  Form
} from "reactstrap";
import CustomButton from "src/components/Common/CustomButton";
import { fetchSignedUrl, useFetchSignedUrl } from "src/utils/fetchSignedUrl";
import { vendorCompanyValidation } from "src/validation/validation";


interface ICompany {
  _id: string;
  vendorId: string;
  companyName: string;
  companyType: string;
  crNumber: string;
  status: string;
  crLicense: {
    fileType: string;
    fileURL: string;
    mimeType: string;
    originalName: string;
  } | undefined;
  cooCertificate: {
    fileType: string;
    fileURL: string;
    mimeType: string;
    originalName: string;
  } | undefined;
  address: string;
  remarks: string[] | any;
}

interface IPropes {
  IdCompany?: string;
}

function ViewCardCompany({ IdCompany }: IPropes) {

  const [companyData, setCompanyData] = useState<ICompany>();
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);


  const PUT_KYC_APPROVE_COMPANY_DETAILS = gql`
    mutation UpdateVendorCompanyByAdmin($input: UpdateVendorCompanyByAdminInput!, $crLicense: Upload, $cooCertificate: Upload) {
  updateVendorCompanyByAdmin(input: $input, crLicense: $crLicense, cooCertificate: $cooCertificate) {
    message
  }
}
  `;

  const GET_COMPANY_DATA = gql`
    query GetVendorCompanyRecordByAdmin($input: VendorCompanyIdInput!) {
      getVendorCompanyRecordByAdmin(input: $input) {
        message
        record {
          _id
          vendorId
          companyName
          companyType
          crNumber
          status
          crLicense {
            fileType
            fileURL
            mimeType
            originalName
          }
          cooCertificate {
            fileType
            fileURL
            mimeType
            originalName
          }
          remarks
        }
      }
    }
  `;

  const {
    loading: companyLoading,
    error: companyError,
    data: companyDataResponse,
    refetch: companyRefetch,
  } = useQuery(GET_COMPANY_DATA, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        _id: IdCompany,
      },
    },
  });


  useEffect(() => {
    if (companyDataResponse?.getVendorCompanyRecordByAdmin) {
      setCompanyData(companyDataResponse.getVendorCompanyRecordByAdmin.record);
    }

  }, [companyDataResponse, IdCompany]);


  const [UpdateVendorCompanyByAdmin] = useMutation(
    PUT_KYC_APPROVE_COMPANY_DETAILS
  );



  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      companyName: "",
      companyType: "",
      crNumber: "",
      status: "",
      remarks: [],
      cooCertificate: "",
      crLicense: "",
    },

    validationSchema: vendorCompanyValidation,
    onSubmit: async (values) => {
      await onSubmit(values);
    },
  });

  useEffect(() => {
    formik.setValues({
      companyName: companyData?.companyName || '',
      companyType: companyData?.companyType || '',
      crNumber: companyData?.crNumber || '',
      status: companyData?.status || '',
      remarks: Array.isArray(companyData?.remarks) ? companyData?.remarks.join(', ') : companyData?.remarks || [],
      cooCertificate: '',
      crLicense: '',
    });
  }, [modal, companyRefetch]);



  const onSubmit = async (values: any) => {
    try {
      let variables: any = {
        input: {
          _id: IdCompany,
          companyName: values?.companyName || '',
          companyType: values?.companyType || '',
          crNumber: values?.crNumber || '',
          status: values?.status || "",
          remarks: Array.isArray(values?.remarks) ? values.remarks : (values?.remarks ? values.remarks.split(',').map((item: any) => item.trim()) : []),
        },
      };

      if (values.crLicense) {
        variables = {
          ...variables,
          crLicense: values.crLicense

        }
      }
      if (values.cooCertificate) {
        variables = {
          ...variables,
          cooCertificate: values.cooCertificate

        }
      }


      const response = await UpdateVendorCompanyByAdmin({ variables });

      if (response) {
        toast.success("Successfully updated Company Details");
        companyRefetch();
        setModal(false)
      }
    } catch (error: any) {
      console.log(error)
      toast.error(error.message)
    }
  };



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
        window.open(signedUrl)
      } else {
        console.error('Failed to get signed URL.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  return (
    <div>
      <Card style={{
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        marginTop: "20px",
      }}>
        <CardBody>
          <CardText>
            <Row>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                <CustomButton name="Edit Company" icon="ic:baseline-edit" onClick={toggle} />
              </div>
            </Row>
            <Row>
              <Col md={6}>
                <div>
                  <p className="">
                    <strong>Company Name : </strong>
                    {companyData?.companyName || " nill"}
                  </p>
                  <p className="mt-4">
                    <strong>Company Type : </strong>
                    {companyData?.companyType || " nill"}
                  </p>
                  <p className="mt-4">
                    <strong>Address : </strong>
                    {companyData?.address || " nill"}
                  </p>
                  <p className="mt-4">
                    <strong>CR Number : </strong>
                    {companyData?.crNumber || " nill"}{" "}
                  </p>
                </div>

                <div className="truncate-text mt-4">
                  <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    {companyData?.cooCertificate && (
                      <CustomButton
                        name="COO Certificate"
                        icon="mingcute:upload-line"
                        onClick={() =>
                          handleImageClick(companyData?.cooCertificate?.fileURL || "", companyData?.cooCertificate?.mimeType || "")
                        }
                      />
                    )}
                    {companyData?.crLicense && (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <CustomButton
                          name="CR License"
                          icon="mingcute:upload-line"
                          onClick={() =>
                            handleImageClick(companyData?.crLicense?.fileURL || "", companyData?.crLicense?.mimeType || "")
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              </Col>

              <Col md={6}>
                <p className="mt-4">
                  <strong>Status:</strong>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "5px 10px",
                      borderRadius: "15px",
                      border: `2px solid ${getStatusColor(companyData?.status)}`,
                      color: getStatusColor(companyData?.status),
                      marginLeft: "10px",
                      fontSize: "13px"
                    }}
                  >
                    {companyData?.status.replace("_", " ")}
                  </span>
                </p>

                <p className="mt-4">
                  <strong>Remarks:</strong>
                </p>
                <ul>
                  {companyData && companyData.remarks.map((remark: any, index: any) => (
                    <li key={index}>{remark}</li>
                  ))}
                </ul>
              </Col>
            </Row>

          </CardText>
        </CardBody>
      </Card>

      <Modal isOpen={modal} toggle={toggle} style={{ minWidth: "700px" }}>
        <ModalHeader toggle={toggle}>Edit Company Details</ModalHeader>
        <ModalBody>
          <Form onSubmit={formik.handleSubmit}>
            <FormGroup>
              <Label >Company name</Label>
              <Input
                type="text"
                id="name"
                name="companyName"
                placeholder="Please enter Company name"
                value={formik.values?.companyName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.companyName && formik.errors.companyName && (
                <div className="text-danger">{formik.errors.companyName}</div>
              )}
            </FormGroup>

            <Row>
              <Col xs={6}>
                <FormGroup>
                  <Label >Company Type</Label>
                  <Input
                    name="companyType"
                    placeholder="Please enter company type "
                    value={formik.values?.companyType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.companyType && formik.errors.companyType && (
                    <div className="text-danger">{formik.errors.companyType}</div>
                  )}
                </FormGroup>
              </Col>
              <Col xs={6}>
                <FormGroup>
                  <Label >CR number</Label>
                  <Input
                    name="crNumber"
                    placeholder="Please enter company type "
                    value={formik.values?.crNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.crNumber && formik.errors.crNumber && (
                    <div className="text-danger">{formik.errors.crNumber}</div>
                  )}
                </FormGroup>
              </Col>
            </Row>



            <FormGroup>
              <Label >Status</Label>
              <Input
                type="select"
                name="status"
                placeholder="Select status"
                value={formik.values?.status}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="" disabled>Select  status</option>
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
              <Label >remarks</Label>
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
              <Col xs={6}>
                <FormGroup>
                  <Label for="image " className="pt-2">
                    Coo Certificate
                  </Label>
                  <Input
                    type="file"
                    id="image"
                    accept="image/*"
                    name="cooCertificate"
                    onChange={(event) => {
                      formik.setFieldValue(
                        "cooCertificate",
                        event.currentTarget.files?.[0]
                      );
                    }}
                  />
                </FormGroup>
              </Col>
              <Col xs={6}>
                <FormGroup>
                  <Label for="image " className="pt-2">
                    CR License
                  </Label>
                  <Input
                    type="file"
                    id="image"
                    accept="image/*"
                    name="crLicense"
                    onChange={(event) => {
                      formik.setFieldValue(
                        "crLicense",
                        event.currentTarget.files?.[0]
                      );
                    }}
                  />
                </FormGroup>
              </Col>
            </Row>





            <ModalFooter style={{ marginTop: "20px" }}>
              <Button color="primary" type="submit">
                Submit
              </Button>
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

    </div >
  );
}

export default ViewCardCompany;
