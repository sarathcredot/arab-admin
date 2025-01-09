import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Container,
  CardHeader,
  Button,
} from "reactstrap";

import Breadcrumbs from "../../components/Common/Breadcrumb";
import { gql, useQuery } from "@apollo/client";
import { useSearchParams } from "react-router-dom";
import AddCmsSection from "./AddcmsSection";
import Breadcrumb from "../../components/Common/Breadcrumb";
import StatusIndicator from "src/components/statusIndicator/StatusIndicator";
import CustomButton from "src/components/Common/CustomButton";

interface CmsRecordData {
  _id: string;
  buttons: {
    buttonText: string;
    redirectionURL: string;
  }[];
  description: string;
  isBlocked: boolean;
  images: {
    fileType: string;
    fileURL: string;
    mimeType: string;
    originalName: string;
  }[];
  pageName: string;
  sectionName: string;
  subTitle: string;
  title: string;
}

const CmsRecordDetails = () => {
  const [searchParams] = useSearchParams();
  const _id = searchParams.get("_id");
  const [cmsRecord, setCmsRecord] = useState<CmsRecordData>();
  const [editedProduct, setEditedProduct] = useState<CmsRecordData | undefined>(
    undefined
  );

  const GET_CMS_RECORD = gql`
    query GetCmsRecordByAdmin($input: cmsRecordByAdminFilter!) {
  getCmsRecordByAdmin(input: $input) {
    record {
      _id
      pageName
      sectionName
      images {
        fileType
        fileURL
        mimeType
        originalName
      }
      buttons {
        buttonText
        redirectionURL
      }
      isBlocked
    }
    message
  }
}
  `;

  const { data, loading, error } = useQuery(GET_CMS_RECORD, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        _id: _id,
      },
    },
    skip: !_id,
  });

  useEffect(() => {
    if (data && data.getCmsRecordByAdmin && data.getCmsRecordByAdmin.record) {
      setCmsRecord(data.getCmsRecordByAdmin.record);
    }
  }, [data]);

  const [edit, setEdit] = useState(false);

  const handleEditProduct = () => {
    setEditedProduct(cmsRecord);
    setEdit(true);
  };

  const items = [
    { text: "Dashboard", link: `/` },
    { text: "Cms Pages", link: `/cmslisting` },
  ];

  return (
    <React.Fragment>
      {edit ? (
        <AddCmsSection Edit={true} editedcms={editedProduct} />
      ) : (
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb items={items} currentPage="CMS Details" />
            <div className="d-flex justify-content-end mb-3">
              <CustomButton
                onClick={handleEditProduct}
                name="Edit Cms"
                icon="ic:baseline-edit"
              />

            </div>
            <Row>
              <Col lg={12}>
                <Card>
                  <CardBody>
                    {/* Row 1: Page Name, Section Name, Title */}
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">Page Name:</label>
                        <p className="form-control-static">
                          {cmsRecord?.pageName}
                        </p>
                      </div>

                      <div className="col-md-4">
                        <label className="form-label">Section Name:</label>
                        <p className="form-control-static">
                          {cmsRecord?.sectionName}
                        </p>
                      </div>


                    </div>

                    {/* Border */}
                    <div className="border mt-3 mb-3"></div>


                    {/* Row 3: Images */}
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label">Images:</label>
                        <div style={{ display: "flex" }}>
                          {cmsRecord?.images.map((item, index) => (
                            <div
                              key={index}
                              className="relative"
                              style={{ marginRight: "10px" }}
                            >
                              <img
                                src={item?.fileURL}
                                className="w-full rounded-2xl object-cover products-image"
                                alt={`image ${index + 1}`}
                                style={{
                                  width: "100px",
                                  height: "100px",
                                  objectFit: "cover",
                                  borderRadius: "8px",
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Border */}
                    <div className="border mt-3 mb-3"></div>

                    {/* Row 4: Buttons */}
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label">Buttons:</label>
                        {cmsRecord?.buttons.map((button, index) => (
                          <div key={index}>
                            <p>
                              Button Text: {button.buttonText}, Redirection URL:{" "}
                              {button.redirectionURL}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Border */}
                    <div className="border mt-3 mb-3"></div>

                    {/* Row 5: Is Blocked */}
                    <div className="row mb-3">
                      <div className="col-md-12" style={{ display: "flex", alignItems: "center" }}>
                        <label >Status : &nbsp; </label>
                        <p className="form-control-static" style={{ width: "100px" }}>
                          <StatusIndicator status={cmsRecord?.isBlocked ? "Blocked" : "Active"} variant="chip" />
                        </p>
                      </div>
                    </div>

                    {/* Add other fields as needed */}
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      )}
    </React.Fragment>
  );
};

export default CmsRecordDetails;
