import { gql, useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import {
  Form,
  FormGroup,
  Modal,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "react-bootstrap";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  CardText,
  Col,
  Input,
  Label,
  ModalBody,
  Row
} from "reactstrap";
import { fetchSignedUrl, useFetchSignedUrl } from "src/utils/fetchSignedUrl";

interface IKycRecord {
  _id: string;
  businessOutlet: {
    _id: string;
    address: string;
    exteriorImage: {
      fileURL: string;
    };
    interiorImage: {
      fileURL: string;
    };
    name: string;
    remarks: string[];
    sectionName: string;
    status: string;
  };
  companyDetails: {
    _id: string;
    companyLicenceImage: {
      fileURL: string;
    };
    crLicence: string;
    crNumber: string;
    name: string;
    remarks: string[];
    sectionName: string;
    status: string;
    type: string;
  };
  isKycCompleted: boolean;
  fullName: string;
  sellingProduct: {
    _id: string;
    sectionName: string;
    discription: string;
    brand: string;
    status: string;
    remarks: string[];
    sellingProductImage: {
      fileURL: string;
    };
  };
  vendorId: string;
}

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
  };
  cooCertificate: {
    fileType: string;
    fileURL: string;
    mimeType: string;
    originalName: string;
  };
  address: string;
  remarks: string[];
}

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
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [modal, setModal] = useState(false);
  const [companyData, setCompanyData] = useState<ICompany>();
  const [outletData, setOutletData] = useState<IOutletRecord>();
  const toggle: any = () => setModal(!modal);

  const PUT_KYC_APPROVE_BUSINESS_DETAILS = gql`
    mutation VendorOutletStatusUpdation(
      $input: VendorOutletStatusUpdationInput!
    ) {
      vendorOutletStatusUpdation(input: $input) {
        _id
        message
        status
      }
    }
  `;

  const PUT_KYC_APPROVE_COMPANY_DETAILS = gql`
    mutation VendorCompanyStatusUpdation(
      $input: VendorCompanyStatusUpdationInput!
    ) {
      vendorCompanyStatusUpdation(input: $input) {
        _id
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
  }, [outletDataResponse, IdBusiness])


  const [VendorOutletStatusUpdation] = useMutation(
    PUT_KYC_APPROVE_BUSINESS_DETAILS
  );
  const [VendorCompanyStatusUpdation] = useMutation(
    PUT_KYC_APPROVE_COMPANY_DETAILS
  );

  const [options, setOptions] = useState("");

  const [remarks, setRemarks] = useState<any>([""]);

  const handleAddRemark = () => {
    setRemarks([...remarks, ""]);
  };

  const handleRemoveRemark = (index: any) => {
    const updatedRemarks = [...remarks];
    updatedRemarks.splice(index, 1);
    setRemarks(updatedRemarks);
  };
  const handleApproval = async (statusValue?: any, event?: any) => {
    try {
      if (event) {
        event.preventDefault();
      }

      let mutation, inputKey, id;

      switch (options) {
        case "businessOutlet":
          mutation = VendorOutletStatusUpdation;
          inputKey = "businessOutlet";
          id = IdBusiness;
          break;

        default:
          return;
      }

      const variables: any = {
        input: {
          remarks: remarks ? remarks : [],
          status: statusValue.toString(),
          _id: id,
        },
      };

      const response = await mutation({ variables });

      if (response) {
        setRemarks([""]);
        setOptions("");
        setShowRejectModal(false);
        toast.success("Successfully updated Kyc Status");
        outletRefetch();
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const handleRejection = (clickedData: string) => {
    setShowRejectModal(true);
    setOptions(clickedData);
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
      <>
        <Card style={{
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          marginTop: "20px",
        }}>
          <CardBody>
            <CardText>
              <Row>
                <Col md={6}>
                  <div>
                    <p className="mt-5">
                      <strong>Business Name :</strong> {outletData?.outletName || " nill"}
                    </p>
                    <p className="mt-5">
                      <strong>Address : </strong>
                      {outletData?.address || " nill"}
                    </p>
                  </div>


                  <p className="mt-5">
                    <div className="truncate-text">
                      {outletData?.exteriorImage && (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <span
                            onClick={() =>
                              handleImageClick(
                                outletData?.exteriorImage?.fileURL, outletData?.exteriorImage?.mimeType
                              )
                            }
                            style={{
                              cursor: "pointer",
                              border: "1px solid #ccc",
                              padding: "8px",
                              borderRadius: "5px",
                              transition: "background-color 0.3s",
                              marginRight: "10px", // Adjust spacing between the spans
                            }}
                          >
                            Exterior Image
                            <i className="fas fa-external-link-alt"></i>
                          </span>

                          <span
                            onClick={() =>
                              handleImageClick(
                                outletData?.exteriorImage?.fileURL, outletData?.exteriorImage?.mimeType
                              )
                            }
                            style={{
                              cursor: "pointer",
                              border: "1px solid #ccc",
                              padding: "8px",
                              borderRadius: "5px",
                              transition: "background-color 0.3s",
                            }}
                          >
                            Interior Image
                            <i className="fas fa-external-link-alt"></i>
                          </span>
                        </div>
                      )}
                    </div>
                  </p>
                </Col>

                <Col md={6}>
                  <p className="mt-5">
                    <strong>Status:</strong>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "5px 10px",
                        borderRadius: "15px",
                        border: `2px solid ${getStatusColor(outletData?.status)}`,
                        color: getStatusColor(outletData?.status),
                        marginLeft: "10px",
                        fontSize: "13px"
                      }}
                    >
                      {outletData?.status?.replace("_", " ")}
                    </span>
                  </p>

                  <p className="mt-5">
                    {outletData && (
                      <CardText>
                        <strong>Remarks:</strong>
                        <ul>
                          {outletData?.remarks.map(
                            (remark: any, index: any) => (
                              <li key={index}>{remark}</li>
                            )
                          )}
                        </ul>
                      </CardText>
                    )}
                  </p>
                </Col>
              </Row>


            </CardText>
            {!(outletData?.status === "COMPLETED") ? (
              <>
                <Button
                  color="primary"
                  onClick={() => {
                    handleApproval("COMPLETED");
                    setOptions("businessOutlet");
                  }}
                >
                  Approve
                </Button>
                <Button
                  onClick={() => handleRejection("businessOutlet")}
                  style={{ marginLeft: "10px" }}
                >
                  Reject
                </Button>
              </>
            ) : null}
          </CardBody>
        </Card>
      </>



      <Modal show={showImageModal} onHide={() => setShowImageModal(false)}>
        <ModalHeader closeButton>
          <ModalTitle>Image Popup</ModalTitle>
        </ModalHeader>
        <ModalBody>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Popup"
              style={{ width: "50%", height: "50%" }}
            />
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowImageModal(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>

      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
        <ModalHeader>Add Remark</ModalHeader>
        <Form>
          <ModalBody>
            <Label
              for="remark"
              style={{
                marginBottom: "10px",
                display: "block",
                fontWeight: "bold",
              }}
            >
              Remarks:
            </Label>
            {remarks.map((remark: any, index: any) => (
              <FormGroup key={index} style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Input
                    type="text"
                    id={`remark-${index}`}
                    name={`remark-${index}`}
                    value={remark}
                    onChange={(e) => {
                      const updatedRemarks = [...remarks];
                      updatedRemarks[index] = e.target.value;
                      setRemarks(updatedRemarks);
                    }}
                    required
                    style={{ marginRight: "10px" }}
                  />
                  {index === remarks.length - 1 && (
                    <Button color="primary" onClick={handleAddRemark}>
                      + {/* Plus icon */}
                    </Button>
                  )}{" "}
                  {index !== 0 && (
                    <Button
                      style={{ marginLeft: "5px", marginRight: "5px" }}
                      color="danger"
                      onClick={() => handleRemoveRemark(index)}
                    >
                      - {/* Minus icon */}
                    </Button>
                  )}
                </div>
              </FormGroup>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              type="submit"
              onClick={(event) => handleApproval("REJECTED", event)}
            >
              Submit
            </Button>{" "}
            <Button
              color="secondary"
              onClick={() => {
                setShowRejectModal(false);
                setRemarks([""]);
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </div >
  );
}

export default ViewCardBusiness;
