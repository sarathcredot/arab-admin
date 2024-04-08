import React, { useEffect, useState } from "react";
import { Row, Col, Card, CardBody, CardHeader, Button, Container, Nav, NavItem, NavLink } from "reactstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Link } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import Breadcrumb from "../../components/Common/Breadcrumb";
import StatusIndicator from "src/components/statusIndicator/StatusIndicator";
import CustomButton from "src/components/Common/CustomButton";
import Loader from "src/components/Common/Loader";

const GET_ALL_CMS_RECORDS = gql`
query GetAllCmsRecordsByAdmin($input: CmsRecordsByAdminFilter) {
  getAllCmsRecordsByAdmin(input: $input) {
    message
    records {
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
    maxRecords
  }
}

`;

interface CmsRecord {
  _id: string; // Add this line
  buttons: {
    buttonText: string;
    redirectionURL: string;
  }[];
  description: string;
  images: {
    fileType: string;
    fileURL: string;
    mimeType: string;
    originalName: string;
  }[];
  isBlocked: boolean;
  sectionName: string;
  pageName: string;
  subTitle: string;
  title: string;
}

const CmsListing = () => {

  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(0);

  const [activeTab, setActiveTab] = useState("HOME");
  const [cmsRecords, setCmsRecords] = useState([]);

  const [maxRecords, setMaxRecords] = useState(0);


  const { data, loading, error, refetch } = useQuery(GET_ALL_CMS_RECORDS, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        page: currentPage,
        size: pageSize,
        pageName: activeTab === "HOME" ? "Home" : "Offer"
      },
    },
  });

  useEffect(() => {

    const fetchData = async () => {
      try {
        const result = await refetch({
          input: {
            page: currentPage,
            size: pageSize,
            pageName: activeTab === "HOME" ? "Home" : "Offer"
          },
        });
        setCmsRecords(result.data.getAllCmsRecordsByAdmin.records);
        setMaxRecords(result.data.getAllCmsRecordsByAdmin.maxRecords);
      } catch (error: any) {
        console.log(error)
      }
    }
    fetchData();
  }, [refetch, currentPage, activeTab])


  const totalPages = Math.ceil(maxRecords / pageSize);

  const handleNextPage = () => {
    if (currentPage + 1 <= totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const toggleTab = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(0)
  };


  const items = [
    { text: "Dashboard", link: `/` },
  ];

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb items={items} currentPage="CMS Pages" />

          <Nav tabs>
            <NavItem>
              <NavLink
                className={activeTab === "HOME" ? "tab-button active" : "tab-button"}
                onClick={() => toggleTab("HOME")}
              >
                Home
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === "OFFER" ? "tab-button active" : "tab-button"}
                onClick={() => toggleTab("OFFER")}
              >
                Offer
              </NavLink>
            </NavItem>
          </Nav>



          <Row style={{ marginTop: "20px" }}>
            <Col>
              <Card>
                <CardHeader>
                  <Row>
                    <Col lg={12}>
                      <div className="d-flex justify-content-end">
                        <Link to="/add-cms">
                          <CustomButton
                            name="Add CMS"
                            icon="ic:sharp-add"
                          />

                        </Link>
                      </div>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div className="table-rep-plugin">
                    <div
                      className="table-responsive mb-0"
                      data-pattern="priority-columns"
                    >
                      {
                        loading ?
                          <Loader />
                          :
                          <Table
                            id="cms-records-table"
                            className="table table-striped table-bordered"
                          >
                            <Thead>
                              <Tr>
                                <Th>Sl.No</Th>
                                <Th data-priority="1">Page Name</Th>
                                <Th data-priority="3">Section Name</Th>
                                <Th data-priority="3">Images</Th>
                                <Th data-priority="3">Status</Th>
                                <Th data-priority="3">View</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {cmsRecords.map(
                                (cmsRecord: CmsRecord, index: number) => (
                                  <Tr key={index}>
                                    <Td>{currentPage * pageSize + index + 1}</Td>
                                    <Td>{cmsRecord.pageName}</Td>
                                    <Td>{cmsRecord.sectionName}</Td>
                                    <Td>
                                      <img
                                        src={cmsRecord.images[0]?.fileURL}
                                        alt={cmsRecord.title}
                                        width={80}
                                      />
                                    </Td>
                                    <Td>
                                      <StatusIndicator status={cmsRecord.isBlocked ? "BLOCKED" : "ACTIVE"} />

                                    </Td>
                                    <Td>
                                      <Button
                                        color="primary"
                                        size="sm"
                                        tag={Link}
                                        to={{
                                          pathname: "/cms/details/",
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
                      }
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
        </Container>
      </div>
    </React.Fragment >
  );
};

export default CmsListing;
