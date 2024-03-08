import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
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
}

function ViewBrands() {
  const { id } = useParams();


  const [brandData, setBrandData] = useState<IBrand>();
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const GET_ABRAND = gql`
    query GetBrandRecordByAdmin($input: BrandIdInput!) {
      getBrandRecordByAdmin(input: $input) {
        record {
          _id
          brandName
          isBlocked
          priority
          isPopular
          logo {
            fileType
            fileURL
            mimeType
            originalName
          }
        }
      }
    }
  `;

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
    { text: "Brands", link: `/brands` },
  ];


  return (
    <div className="page-content">

      <Container fluid={true} >
        <Breadcrumb items={items} currentPage="Brand Details" />
        <Card style={{ width: "100%", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
          <CardBody style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
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
            <span>
              <span>Brand Name :</span> <label> {brandData?.brandName}</label>
            </span>
            <CardText>
              <div>
                <span style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                  <span>Status :</span>
                  <StatusIndicator status={brandData?.isBlocked ? "BLOCKED" : "ACTIVE"} variant="chip" />

                </span>
              </div>
            </CardText>
            <div >
              <CustomButton name="Edit Brand" icon="ic:baseline-edit" onClick={() => toggleAddModal()} />

              {/* <Button variant="success">Delete</Button> */}
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
    </div>
  );
}

export default ViewBrands;
