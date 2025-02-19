import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link, useSearchParams } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Container,
} from "reactstrap";
import Breadcrumb from "src/components/Common/Breadcrumb";
import BrandForm from "./BrandForm";
import AssignBrands from "./AssignBrands";
import StatusIndicator from "src/components/statusIndicator/StatusIndicator";
import CustomButton from "src/components/Common/CustomButton";
import { ToastContainer } from "react-toastify";

interface ILogo {
  fileType: string;
  fileURL: string;
  mimeType: string;
  originalName: string;
}

interface IBrand {
  _id: string;
  brandName: string;
  isBlocked: boolean;
  logo: ILogo;
  isPopular: boolean;
  priority: number;
  returnPolicy:string;
}


const GET_ONE_POLICY = gql`
  query GetReturnPolicyByAdmin($input: getReturnPolicyByAdminInput!) {
    getReturnPolicyByAdmin(input: $input) {
      _id
      name
      description
      duration
      isEnable
      returnCharge
      isDeleted
    }
  }
`;


function ViewBrands() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const origin = searchParams.get("origin")
  const vendorId = searchParams.get("vendorId")
  const [brandData, setBrandData] = useState<IBrand>();
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const GET_ABRAND = gql`
    query GetBrandRecordByAdmin($input: BrandIdInput!) {
  getBrandRecordByAdmin(input: $input) {
    record {
      _id
      brandName
      isBlocked
      logo {
        fileType
        fileURL
        mimeType
        originalName
      }
      isPopular
      priority
      returnPolicy
    }
    message
  }
}
  `;


const {
  data: policyData,
  error: policyError,
  loading: policyLoading,
  refetch: policyRefetch,
} = useQuery(GET_ONE_POLICY, {
  variables: {
    input: {
      returnPolicyId: brandData?.returnPolicy,
    },
  },
  skip:!brandData?.returnPolicy,
  fetchPolicy: "network-only",
});
  const {
    loading: brandLoading,
    error: brandError,
    data: brandDataResponse,
    refetch: brandRefetch,
  } = useQuery(GET_ABRAND, {
    variables: {
      input: {
        _id: id,
      },
    },
  });

  useEffect(() => {
    if (brandDataResponse && brandDataResponse.getBrandRecordByAdmin) {
      setBrandData(brandDataResponse.getBrandRecordByAdmin?.record);
    }
  }, [id, brandDataResponse]);

  const toggleAddModal = () => {
    setShowAddModal(!showAddModal);
  };

  const items = [
    { text: "Dashboard", link: `/` },

  ];

  if (origin && origin === "vendor") {
    items.push(
      { text: "Vendor", link: `/vendors/view?id=${vendorId}` },
    )
  } else {
    items.push(
      { text: "Brands", link: `/brands` },
    )
  }


  return (
    <div className="page-content">

      <Container fluid={true} >
        <Breadcrumb items={items} currentPage="Brand Details" />
        <Card style={{ width: "100%", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
          <CardBody style={{ display: "flex", alignItems: "center", justifyContent: "space-between",gap:"7%" }}>
            <CardImg
              style={{
                height: "100px",
                width: "100px",
                objectFit: "contain",
                margin: "20px ",
                border: "5px solid #fff",
              }}
              variant="top"
              src={brandData?.logo?.fileURL}
              alt="Profile"
            />
            <div style={{
              display:"flex",
              flexDirection:"column",
              width:"100%"

            }}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%"}}>

            <span>
              <span>Brand Name :</span> <label> {brandData?.brandName} &nbsp; {brandData?.isPopular && <button style={{ border: "1px solid red", color: "red", background: "white", borderRadius: "7px" }} > {brandData?.isPopular && "Popular"}</button>}</label>
            </span>
            <CardText>
              <div>
                <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                  <span>Status :</span>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <StatusIndicator status={brandData?.isBlocked ? "Blocked" : "Active"} variant="chip" />
                  </div>

                </span>
              </div>
            </CardText>
            <div >
              <CustomButton name="Edit Brand" icon="ic:baseline-edit" onClick={() => toggleAddModal()} />
            </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:5}}>
              <p>
              Return Policy : 
              </p>
              <p style={{fontWeight:"bold"}}>{policyData?.getReturnPolicyByAdmin?.name||"nill"}</p>
            </div>
            </div>

          </CardBody>
        </Card>
        <BrandForm
          isOpen={showAddModal}
          toggle={toggleAddModal}
          isEdit={brandData}
          refetch={brandRefetch}
        />

        <AssignBrands brandId={id} />
      </Container>
      <ToastContainer/>
    </div>
  );
}

export default ViewBrands;
