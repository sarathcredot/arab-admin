import React, { useState } from "react";
import { Row, Col, Card, CardBody, CardHeader, Button } from "reactstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Link } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";

const GET_ALL_CMS2_RECORDS = gql`
  query GetAllCms2RecordsByAdmin($input: Cms2RecordsByAdminFilter) {
    getAllCms2RecordsByAdmin(input: $input) {
      maxRecords
      records {
        _id
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
        }
        pageName
        sectionName
        subTitle
        title
      }
    }
  }
`;

interface CmsTwoRecord {
  _id: string;
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
  }[];
  pageName: string;
  sectionName: string;
  subTitle: string;
  title: string;
  isBlocked: string;
}

const CmstwoListing = () => {
  // document.title = "CMS Listing ";

  const pageSize = 10; // Number of items per page
  const [currentPage, setCurrentPage] = useState(0);

  const { data, loading, error } = useQuery(GET_ALL_CMS2_RECORDS, {
    variables: {
      input: {
        page: currentPage,
        size: pageSize,
      },
    },
  });
  console.log("data--------", data);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const cmsTwoRecords = data.getAllCms2RecordsByAdmin.records;
  const maxRecords = data.getAllCms2RecordsByAdmin.maxRecords;
  console.log("imageurl", cmsTwoRecords?.items);

  const totalPages = Math.ceil(maxRecords / pageSize);

  const handleNextPage = () => {
    if (currentPage + 1 <= totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          {/* <Breadcrumbs title="Tables" breadcrumbItem="" /> */}
          <Row>
            <Col lg={12}>
              <div className="d-flex justify-content-end mb-3">
                {/* Add link to your Add CMS page */}
                <Link to="/add-cms2">
                  <button
                    style={{
                      backgroundColor: "black",
                      color: "white",
                      width: "100px",
                      height: "40px",
                      borderRadius: "10px",
                    }}
                  >
                    Add CMS
                  </button>
                </Link>
              </div>
            </Col>
          </Row>

          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <h4 className="card-title">CMS Records</h4>
                </CardHeader>
                <CardBody>
                  <div className="table-rep-plugin">
                    <div
                      className="table-responsive mb-0"
                      data-pattern="priority-columns"
                    >
                      <Table
                        id="cms-records-table"
                        className="table table-striped table-bordered"
                      >
                        <Thead>
                          <Tr>
                            <Th>Serial No</Th>
                            <Th data-priority="1">Page Name</Th>
                            <Th data-priority="3">Section Name</Th>
                            <Th data-priority="3">Title</Th>
                            <Th data-priority="1">Subtitle</Th>
                            <Th data-priority="3">Images</Th>
                            <Th data-priority="3">Status</Th>
                            <Th data-priority="3">View</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {cmsTwoRecords.map(
                            (cmsRecord: CmsTwoRecord, index: number) => (
                              <Tr key={index}>
                                <Td>{index + 1}</Td>
                                <Td>{cmsRecord.pageName}</Td>
                                <Td>{cmsRecord.sectionName}</Td>
                                <Td>{cmsRecord.title}</Td>
                                <Td>{cmsRecord.subTitle}</Td>
                                <Td>
                                  <img
                                    src={cmsRecord.items[0]?.image?.fileURL}
                                    alt={cmsRecord.title}
                                    width={80}
                                    height={80}
                                  />
                                  {console.log(
                                    "Image URL:",
                                    cmsRecord.items[0]?.image?.fileURL
                                  )}
                                </Td>
                                <Td>
                                  {cmsRecord.isBlocked ? "Blocked" : "Active"}
                                </Td>
                                <Td>
                                  <Button
                                    color="white"
                                    style={{
                                      backgroundColor: "black",
                                      alignItems: "center",
                                      color: "white",
                                    }}
                                    tag={Link}
                                    to={{
                                      pathname: "/cmstwo/details/",
                                      search: `?_id=${cmsRecord._id}`,
                                    }}
                                  >
                                    View
                                  </Button>
                                </Td>
                              </Tr>
                            )
                          )}
                        </Tbody>
                      </Table>
                    </div>
                  </div>
                  <Row>
                    <Col>
                      <div className="d-flex justify-content-end mt-0 ">
                        <ul className="pagination">
                          <li
                            className={`page-item ${currentPage === 0 ? "disabled" : ""
                              }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(currentPage - 1)}
                              disabled={currentPage === 0}
                            >
                              Previous
                            </button>
                          </li>

                          {Array.from({ length: totalPages }, (_, index) => (
                            <li
                              key={index}
                              className={`page-item ${currentPage === index ? "active" : ""
                                }`}
                            >
                              <button
                                className="page-link"
                                onClick={() => setCurrentPage(index)}
                              >
                                {index + 1}
                              </button>
                            </li>
                          ))}

                          {currentPage < totalPages - 1 && (
                            <li
                              className={`page-item ${currentPage === totalPages - 1 ? "disabled" : ""
                                }`}
                            >
                              <button
                                className="page-link"
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages - 1}
                              >
                                Next
                              </button>
                            </li>
                          )}
                        </ul>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CmstwoListing;
