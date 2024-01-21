import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Table,
  Input,
  Button,
  Nav,
  NavItem,
  NavLink,
  Label,
} from "reactstrap";
import Breadcrumb from "src/components/Common/Breadcrumb";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import AttributeForm from "./AttributeForm";
import SubAttributeForm from "./SubAttributeForm";

interface AttributeValue {
  _id: string;
  value: string;
  colorCode: string;
  priority: number;
  isBlocked: boolean;
}

interface IAttribute {
  _id: string;
  attributeType: string;
  name: string;
  description: string;
  attributeValues: AttributeValue[];
  isBlocked: boolean;
}

  

const ValueAttributeList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [attributeData, setAttributeData] = useState<IAttribute>();
//   const [assignBrandData, setAssignBrandData] = useState<IBrandRecord[]>([]);
  const [activeTab, setActiveTab] = useState<boolean>();
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10; // Number of items per page
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedBrands, setSelectedBrands] = useState<
    Array<{ label: string; value: string }>
  >([]);
  const { id } = useParams();
  const GET_SUBATTRIBUTES = gql`
    query GetAttributeRecordByAdmin($input: AttributeRecordByAdminInput!) {
  getAttributeRecordByAdmin(input: $input) {
    message
    record {
      _id
      attributeType
      name
      description
      attributeValues {
        _id
        value
        colorCode
        priority
        isBlocked
      }
      isBlocked
    }
  }
}
  `;





// const PUT_VENDOR=gql`


// `


// const [UpdateVendorProfileByAdmin]=useMutation(PUT_VENDOR)

const {
  loading: attributeLoading,
  error: attributeError,
  data: attributeResponse,
  refetch: attributeRefetch,
} = useQuery(GET_SUBATTRIBUTES, {
  variables: {
    input: {
      attributeId: id
    },
  },
});





useEffect(() => {
  if (attributeResponse && attributeResponse.getAttributeRecordByAdmin) {
    setAttributeData(attributeResponse.getAttributeRecordByAdmin.record);
  }
}, [attributeResponse, attributeRefetch, id, activeTab]);


  if (attributeError) {
    console.error("Error fetching vendor data:", attributeError);
    // Handle error, display an error message, etc .
  }

  const totalPages = Math.ceil(10 / pageSize);

  const handleNextPage = () => {
    if (currentPage + 1 < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };


  console.log(attributeData,"wertyui")

  const toggleAddModal = () => {
    setShowAddModal(!showAddModal);
  };

  const handleBrandSelection = (
    selectedOptions: Array<{ label: string; value: string }>
  ) => {
    setSelectedBrands(selectedOptions);
  };

  // const handleAssignBrands = async () => {
  //   if (selectedBrands.length > 0) {
  //     const brandIds = selectedBrands.map((brand) => brand.value);
  //     try {
  //       const response:any = await UpdateVendorProfileByAdmin({
  //         variables: {
  //           input: {
  //             _id: id,
  //             brands: brandIds,
  //           },
  //         },
  //       });
  
  //       toast.success(response?.message)
  //       setSelectedBrands([])
        
  //     } catch (error:any) {
  //       console.error("Error assigning brands:", error.message);
  //     }
  //   } else {
  //     console.error("Please select at least one brand to assign");
  //   }
  // };
  


  return (
    <>
      <div className="page-content">
      <ToastContainer/>

        <Container fluid={true}>
        <Breadcrumb title="Dashboard" breadcrumbItem={attributeData?.description.toString()} link="/" />
          {/* <Nav tabs>
            <NavItem>
              <NavLink
                className={activeTab === undefined ? "active" : ""}
                onClick={() => setActiveTab(undefined)}
              >
                All
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === false ? "active" : ""}
                onClick={() => setActiveTab(false)}
              >
                Active
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === true ? "active" : ""}
            {}    onClick={() => setActiveTab(true)}
              >
                Blocked
              </NavLink>
            </NavItem>
          </Nav> */}

          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <Input
                    type="text"
                    placeholder="Search by name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: "50%", marginBottom: "3px" }}
                  />

                  <div className="d-flex justify-content-end mb-3">
                    
                    <Button  onClick={() => toggleAddModal()} style={{backgroundColor:"#000000"}}>
                      Add Attribute
                    </Button>

                    <SubAttributeForm isOpen={showAddModal} toggle={toggleAddModal} refetch={attributeRefetch} Id={id} />
                  </div>

                  <Table
                    responsive
                    className="table table-bordered table-centered mb-0"
                  >
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>value</th>
                        <th>colorCode</th>
                        <th>priority</th>
                        <th>Status</th>
                        {/* <th>Action</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {attributeData?.attributeValues
                        .filter((attribute) =>
                        attribute.value
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                        )
                        .map((attribute, index) => (
                          <tr key={attribute._id}>
                            <td>{index + 1}</td>
                            <td>{attribute.value}</td>
                            <td>{attribute.colorCode}</td>
                            <td>{attribute.priority}</td>                            
                            <td
                              style={{
                                color: attribute.isBlocked ? "red" : "#5cb85c",
                              }}
                            >
                              {attribute.isBlocked ? "Blocked" : "Active"}
                            </td>
                            {/* <td>
                              <Link to={`/attributes/${attribute._id}`}>
                                <Button style={{ marginLeft: "20px" }}>
                                  View
                                </Button>
                              </Link>
                            </td> */}
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </CardBody>

                {/* <Row>
                  <Col>
                    <div className="d-flex justify-content-end mt-0 ">
                      <ul className="pagination">
                        <li
                          className={`page-item ${
                            currentPage === 0 ? "disabled" : ""
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
                            className={`page-item ${
                              currentPage === index ? "active" : ""
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
                            className={`page-item ${
                              currentPage === totalPages - 1 ? "disabled" : ""
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
                </Row> */}
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default ValueAttributeList;
