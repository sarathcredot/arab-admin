import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Form, FormGroup, Modal, ModalFooter, ModalHeader, ModalTitle } from "react-bootstrap";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  AccordionBody,
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Container,
  Input,
  Label,
  ModalBody,
} from "reactstrap";
import Breadcrumb from "src/components/Common/Breadcrumb";

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

function ViewKyc() {
  const { id } = useParams();
  const [kycData, setKycData] = useState<IKycRecord>();
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [modal, setModal] = useState(false);

  const toggle :any= () => setModal(!modal);



  const GET_A_KYC = gql`
    query GetKycRecordByAdmin($input: GetKycRecordInput!) {
      getKycRecordByAdmin(input: $input) {
        message
        record {
          _id
          businessOutlet {
            _id
            sectionName
            name
            address
            interiorImage {
              fileURL
            }
            exteriorImage {
              fileURL
            }
            status
            remarks
          }
          companyDetails {
            _id
            sectionName
            name
            type
            crNumber
            crLicence
            status
            remarks
            companyLicenceImage {
              fileURL
            }
          }
          isKycCompleted
          sellingProduct {
            _id
            sectionName
            discription
            brand
            status
            remarks
            sellingProductImage {
              fileURL
            }
          }
          vendorId
        }
      }
    }
  `;

  const PUT_KYC_APPROVE_SELLING = gql`
    mutation UpdateKycSellingProductApprovalByAdmin(
      $input: UpdateKycSellingProductApprovalInput!
    ) {
      updateKycSellingProductApprovalByAdmin(input: $input) {
        message
      }
    }
  `;

  const PUT_KYC_APPROVE_BUSINESS_DETAILS = gql`
    mutation UpdateKycBusinessOutletApprovalByAdmin(
      $input: UpdateKycBusinessOutletApprovalInput!
    ) {
      updateKycBusinessOutletApprovalByAdmin(input: $input) {
        message
      }
    }
  `;

  const PUT_KYC_APPROVE_COMPANY_DETAILS = gql`
    mutation UpdateKycCompanyDetailsApprovalByAdmin(
      $input: UpdateKycCompanyDetailsApprovalInput!
    ) {
      updateKycCompanyDetailsApprovalByAdmin(input: $input) {
        message
      }
    }
  `;

  const {
    loading: kycLoading,
    error: kycError,
    data: kycDataResponse,
    refetch: kycRefetch,
  } = useQuery(GET_A_KYC, {
    variables: {
      input: {
        _id: id,
      },
    },
  });

  useEffect(() => {
    if (kycDataResponse && kycDataResponse.getKycRecordByAdmin) {
      setKycData(kycDataResponse.getKycRecordByAdmin.record);
    }
  }, [kycDataResponse]);

  console.log(kycData);
  console.log('Loading:', kycLoading);
console.log('Error:', kycError);
console.log('Data:', kycDataResponse,);


  const handleImageClick = (fileURL: string) => {
    setSelectedImage(fileURL);
    setShowImageModal(true);
  };
  const [UpdateKycSellingProductApprovalByAdmin] = useMutation(
    PUT_KYC_APPROVE_SELLING
  );
  const [UpdateKycBusinessOutletApprovalByAdmin] = useMutation(
    PUT_KYC_APPROVE_BUSINESS_DETAILS
  );
  const [UpdateKycCompanyDetailsApprovalByAdmin] = useMutation(
    PUT_KYC_APPROVE_COMPANY_DETAILS
  );

  const [options,setOptions]=useState("")


  const [remarks, setRemarks] = useState<any>(['']); // Initial state with an empty remark

  const handleAddRemark = () => {
    setRemarks([...remarks,'']); // Add an empty remark to the array
  };

  const handleRemoveRemark = (index:any) => {
    const updatedRemarks = [...remarks];
    updatedRemarks.splice(index, 1); // Remove the remark at the specified index
    setRemarks(updatedRemarks);
  };
 const handleApproval = async (statusValue?: any, event?: any) => {
  
  try {
    if (event) {
      event.preventDefault();
    }

    let mutation, inputKey;

    switch (options) {
      case "businessOutlet":
        mutation = UpdateKycBusinessOutletApprovalByAdmin;
        inputKey = "businessOutlet";
        break;
      case "companyDetails":
        mutation = UpdateKycCompanyDetailsApprovalByAdmin;
        inputKey = "companyDetails";
        break;
      case "sellingProduct":
        mutation = UpdateKycSellingProductApprovalByAdmin;
        inputKey = "sellingProduct";
        break;
      default:
        return;
    }

    const variables: any = {
      input: {
        [inputKey]: {
          remarks: remarks?remarks:[],
          status: statusValue,
        },
        _id: id,
      },
    };

    const response = await mutation({ variables });

    console.log(response);
    if (response) {
      setRemarks([''])
      setOptions("")
      setShowRejectModal(false);
      toast.success("Successfully updated Kyc Status");
     
      
      
      return kycRefetch();
    }
  } catch (error: any) {
    console.log(error.message);
  }
};



  const handleRejection = (clickedData:string) => {
    setShowRejectModal(true);
    setOptions(clickedData);
  };



  return (
    <div>
      <ToastContainer/>
      <Container fluid={true} style={{ marginTop: "100px" }}>
        <Breadcrumb title="Dashboard" breadcrumbItem="Kyc" link="/" />
        <Card style={{ width: "40rem" }}>
          <CardBody>
            <CardTitle>
              <strong>Vendor Data</strong>
            </CardTitle>
            <CardText>
              <div>
              <p>
                {" "}
                <strong>Full Name : </strong>
                {kycData?.fullName}
              </p>
              <p>
                <strong>Kyc Status : </strong>
                {kycData?.isKycCompleted ? "Completed" : "Pending"}
              </p>
              </div>
              
            </CardText>
            <Link to={`/vendors/${kycData?.vendorId}`}>
              <Button style={{ marginLeft: "20px" }}>View</Button>
            </Link>
          </CardBody>
        </Card>

        <div style={{ display: "flex", gap: "30px" }}>
          <Card style={{ width: "40rem" }}>
            <CardBody>
              <CardTitle>
                <strong>Business Outlet Data</strong>
              </CardTitle>
              <CardText>
                <div>
                <p>
                  <strong>Business Name :</strong>{" "}
                  {kycData?.businessOutlet?.name}
                </p>
                <p>
                  <strong>Address : </strong>
                  {kycData?.businessOutlet?.address}
                </p>
                </div>
               
                {kycData?.businessOutlet && (
                  <CardText>
                    <strong>Remarks:</strong>
                    <ul>
                      {kycData.businessOutlet.remarks.map(
                        (remark: any, index: any) => (
                          <li key={index}>{remark}</li>
                        )
                      )}
                    </ul>
                  </CardText>
                )}
                <p>
                  <div className="truncate-text">
                    {kycData?.businessOutlet && (
                      <div
                        onClick={() =>
                          handleImageClick(
                            kycData?.businessOutlet?.exteriorImage?.fileURL
                          )
                        }
                      >
                        <img
                          src={kycData?.businessOutlet?.exteriorImage?.fileURL}
                          alt="Exterior Image"
                          style={{ maxWidth: "50%", height:"50%", cursor: "pointer" }}
                        />
                      </div>
                    )}
                  </div>
                  <strong>Status : </strong>
                  {kycData?.businessOutlet?.status}{" "}
                </p>
              </CardText>
              {!(kycData?.businessOutlet?.status === "COMPLETED") ? (
                <>
                  <Button
                    variant="success"
                    onClick={() =>{
                      handleApproval( "COMPLETED")
                      setOptions("businessOutlet")

                    }}
                  >
                    Approve
                  </Button>
                  <Button color="danger" onClick={()=>handleRejection("businessOutlet")} style={{ marginLeft: "4px" }}>
                    Reject
                  </Button>
                </>
              ) : null}
            </CardBody>
          </Card>
          <Card style={{ width: "40rem" }}>
            <CardBody>
              <CardTitle>
                <strong>Company Details</strong>
              </CardTitle>
              <CardText>

                <div>


                <p>
                  <strong>Company Name : </strong>
                  {kycData?.companyDetails?.name}
                </p>
                <p>
                  <strong>Address : </strong>
                  {kycData?.businessOutlet?.address}
                </p>
                <p>
                  <strong>CR License : </strong>
                  {kycData?.companyDetails?.crLicence}{" "}
                </p>
                <p>
                  <strong>CR Number : </strong>
                  {kycData?.companyDetails?.crNumber}{" "}
                </p>

                </div>
               

                <div className="truncate-text">
                  {kycData?.companyDetails && (
                    <div
                      onClick={() =>
                        handleImageClick(
                          kycData?.companyDetails?.companyLicenceImage?.fileURL
                        )
                      }
                    >
                      <img
                        src={
                          kycData?.companyDetails?.companyLicenceImage?.fileURL
                        }
                        alt="Company Licence Image"
                        style={{ maxWidth: "50%" ,height:"50%", cursor: "pointer" }}
                      />
                    </div>
                  )}
                </div>
                {kycData?.companyDetails && (
                  <CardText>
                    <strong>Remarks:</strong>
                    <ul>
                      {kycData.companyDetails.remarks.map(
                        (remark: any, index: any) => (
                          <li key={index}>{remark}</li>
                        )
                      )}
                    </ul>
                  </CardText>
                )}
                <p>
                  <strong>Status : </strong>
                  {kycData?.companyDetails?.status}{" "}
                </p>
              </CardText>
              {!(kycData?.companyDetails?.status === "COMPLETED") ? (
                <>
                  <Button
                    variant="success"
                   onClick={() =>{ handleApproval("COMPLETED"); setOptions("companyDetails")}}
                  >
                    Approve
                  </Button>
                  <Button color="danger" onClick={()=>handleRejection("companyDetails")} style={{ marginLeft: "4px" }}>
                    Reject
                  </Button>
                </>
              ) : null}
            </CardBody>
          </Card>
        </div>

        <Card style={{ width: "40rem" }}>
          <CardBody>
            <CardTitle>
              {" "}
              <strong>Selling Product Data </strong>
            </CardTitle>
            <CardText>
              <div>
              <p>
                <strong>Brand Name : </strong>
                {kycData?.sellingProduct?.brand}
              </p>
              </div>
             
              <div className="truncate-text">
                {/* ... (unchanged) */}
                {kycData?.sellingProduct && (
                  <div
                    onClick={() =>
                      handleImageClick(
                        kycData?.sellingProduct?.sellingProductImage?.fileURL
                      )
                    }
                  >
                    <img
                      src={
                        kycData?.sellingProduct?.sellingProductImage?.fileURL
                      }
                      alt="Selling Product Image"
                      style={{ maxWidth: "50%" ,height:"50%", cursor: "pointer" }}
                    />
                  </div>
                )}
              </div>
              {kycData?.sellingProduct && (
                <CardText>
                  <strong>Remarks:</strong>
                  <ul>
                    {kycData.sellingProduct.remarks.map(
                      (remark: any, index: any) => (
                        <li key={index}>{remark}</li>
                      )
                    )}
                  </ul>
                </CardText>
              )}
              <div>
              <p>
                <strong>Status : </strong>
                {kycData?.sellingProduct?.status}{" "}
              </p>
              </div>
             
            </CardText>
            {!(kycData?.sellingProduct?.status === "COMPLETED") ? (
              <>
                <Button
                  variant="success"
                  onClick={() =>{ handleApproval("COMPLETED"); setOptions("sellingProduct")}}
                >
                  Approve
                </Button>
                <Button onClick={()=>handleRejection("sellingProduct")} color="danger" style={{ marginLeft: "4px" }}>
                  Reject
                </Button>
              </>
            ) : null}
          </CardBody>
        </Card>
      </Container>

      <Modal show={showImageModal} onHide={() => setShowImageModal(false)}>
        <ModalHeader closeButton>
          <ModalTitle>Image Popup</ModalTitle>
        </ModalHeader>
        <ModalBody>
          {selectedImage && (
            <img src={selectedImage} alt="Popup" style={{ width: "50%", height:"50%" }} />
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setShowImageModal(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>


      
      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
  <ModalHeader >Add Remark </ModalHeader>
  <Form>
    <ModalBody>
      <Label for="remark" style={{ marginBottom: '10px', display: 'block', fontWeight: 'bold' }}>
        Remarks:
      </Label>
      {remarks.map((remark:any, index:any) => (
        <FormGroup key={index} style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }} >
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
              style={{ marginRight: '10px' }}
            />
            {index === remarks.length - 1 && (
              <Button color="primary" onClick={handleAddRemark}>
                + {/* Plus icon */}
              </Button> 
            )}{" "}
            {index !== 0 && (
              <Button style={{ marginLeft: '5px', marginRight: '5px' }} color="danger" onClick={() => handleRemoveRemark(index)}>
                - {/* Minus icon */}
              </Button>
            )}
          </div>
        </FormGroup>
      ))}
    </ModalBody>
    <ModalFooter>
      <Button color="primary" type="submit" onClick={(event) => handleApproval("REJECTED", event)}>
        Submit
      </Button>{' '}
      <Button color="secondary" onClick={() =>{ setShowRejectModal(false); setRemarks([''])}}>
        Cancel
      </Button>
    </ModalFooter>
  </Form>
</Modal>



      
    </div>
  );
}

export default ViewKyc;
