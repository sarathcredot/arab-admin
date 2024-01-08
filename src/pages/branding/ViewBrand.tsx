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

  return (
    <Container fluid={true} style={{ marginTop: "100px" }}>
      <Breadcrumb title="Dashboard" breadcrumbItem="Brand" link="/" />
      <Card style={{ width: "50rem", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
        <CardImg
          style={{
            height: "200px",
            width: "200px",
            objectFit: "cover",
            // borderRadius: "50%",
            margin: "20px ",
            border: "5px solid #fff", // Add a border around the image
          }}
          variant="top"
          src={brandData?.logo?.fileURL}
          alt="Profile"
        />
        <CardBody>
          <CardText>
            <div>
              <p>
                <strong>Barand Name :</strong> {brandData?.brandName}
              </p>
              <p>
                <strong>Status :</strong>{" "}
                {brandData?.isBlocked ? "BLOCKED" : "ACTIVE"}
              </p>
            </div>
          </CardText>
          <div>
            <Button color="success" onClick={() => toggleAddModal()}>
              Edit
            </Button>{" "}
            <Button variant="success">Delete</Button>
          </div>
        </CardBody>
      </Card>
      <BrandForm
        isOpen={showAddModal}
        toggle={toggleAddModal}
        isEdit={brandData}
        refetch={brandRefetch}
      />
    </Container>
  );
}

export default ViewBrands;
