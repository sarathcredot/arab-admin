import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { Row, Col, Card, CardBody, Container, CardHeader } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import AddCmsTwoSection from "./AddcmsTwo";

// Define your GraphQL query for getCms2RecordByAdmin
const GET_CMS_TWO_RECORD = gql`
  query GetCms2RecordByAdmin($input: cms2RecordByAdminFilter!) {
    getCms2RecordByAdmin(input: $input) {
      record {
        items {
          button {
            buttonText
            redirectionURL
          }
          image {
            fileType
            fileURL
            mimeType
            originalName
          }
          subTitle
          title
          _id
        }
        _id
        pageName
        sectionName
        subTitle
        title
      }
    }
  }
`;

// Define your CmsTwoRecord interface
interface CmsTwoRecord {
  _id: string;
  pageName: string;
  sectionName: string;
  subTitle: string;
  title: string;
  items: {
    button: {
      buttonText: string;
      redirectionURL: string;
    };
    image: {
      fileType: string;
      fileURL: string;
      mimeType: string;
      originalName: string;
    };
    subTitle: string;
    title: string;
    _id:string;
  }[];
  isBlocked: string;
}
interface AddCmsTwoSectionProps {
  edit?: boolean;
  editedcms?: CmsTwoRecord | undefined; // Add this line
  // ... other properties
}

const CmsTwoRecordDetails = () => {
  const [cmsTwoRecord, setCmsTwoRecord] = useState<CmsTwoRecord>();
  const [editedcmstwo, setEditedcmstwo] = useState<CmsTwoRecord | undefined>(
    undefined
  );
  const [edit, setEdit] = useState(false);
  const [searchParams] = useSearchParams();
  const _id = searchParams.get("_id");
  const { data, loading, error, refetch } = useQuery(GET_CMS_TWO_RECORD, {
    variables: {
      input: {
        _id: _id,
      },
    },
    skip: !_id,
  });

  useEffect(() => {
    if (data && data.getCms2RecordByAdmin && data.getCms2RecordByAdmin.record) {
      const cmsTwoRecord: CmsTwoRecord = data.getCms2RecordByAdmin.record;
      setCmsTwoRecord(cmsTwoRecord);
    }
  }, [data]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }
  const handleEditProduct = () => {
    setEditedcmstwo(cmsTwoRecord);
    setEdit(true);
  };

  return (
    <React.Fragment>
      {edit ? (
        <AddCmsTwoSection edit={true} editedcmstwo={cmsTwoRecord} />
      ) : (
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumbs
              title="CMS Record"
              breadcrumbItem="CMS2 Record Details"
            />
            <div className="d-flex justify-content-end mb-3">
              <button
                onClick={handleEditProduct}
                style={{
                  backgroundColor: "black",
                  color: "white",
                  width: "100px",
                  height: "40px",
                  borderRadius: "10px",
                }}
              >
                Edit Cms
              </button>
            </div>
            <Row>
              <Col lg={12}>
                <Card>
                  <CardBody>
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label className="form-label">Page Name:</label>
                        <p className="form-control-static">
                          {cmsTwoRecord?.pageName}
                        </p>
                      </div>

                      <div className="col-md-4">
                        <label className="form-label">Section Name:</label>
                        <p className="form-control-static">
                          {cmsTwoRecord?.sectionName}
                        </p>
                      </div>

                      <div className="col-md-4">
                        <label className="form-label">Title:</label>
                        <p className="form-control-static">
                          {cmsTwoRecord?.title}
                        </p>
                      </div>
                    </div>

                    {/* Border */}
                    <div className="border mt-3 mb-3"></div>

                    {/* Row 2: Description */}
                    <div className="row mb-3">
                      <label className="form-label">SubTitle:</label>
                      <p className="form-control-static">
                        {cmsTwoRecord?.subTitle}
                      </p>
                    </div>

                    <div className="border mt-3 mb-3"></div>

                    {/* Row 3: Images */}
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label">Images:</label>
                        <div style={{ display: "flex" }}>
                          {cmsTwoRecord?.items.map((item: any, index: any) => (
                            <div
                              key={index}
                              className="relative"
                              style={{ marginRight: "10px" }}
                            >
                              <img
                                src={item?.image?.fileURL}
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
                        <label className="form-label">Items:</label>
                        {cmsTwoRecord?.items.map((item, index) => (
                          <div key={index}>
                            <p>
                              Title: {item.title}, Subtitle: {item.subTitle}
                            </p>
                            <p>
                              Button Text: {item.button.buttonText}, Redirection
                              URL: {item.button.redirectionURL}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Border */}
                    <div className="border mt-3 mb-3"></div>

                    {/* Row 5: Is Blocked */}
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <label className="form-label">Status</label>
                        <p className="form-control-static">
                          {cmsTwoRecord?.isBlocked ? "Yes" : "No"}
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

export default CmsTwoRecordDetails;
