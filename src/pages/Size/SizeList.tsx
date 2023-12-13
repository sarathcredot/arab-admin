import React, { useEffect, useState } from "react";
import {

  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Row,
  Table,
} from "reactstrap";
import AddColor from "../Color/AddColor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import SizeAdd from "./SizeAdd";
import { gql, useQuery } from "@apollo/client";
import ReactSelect from "react-select";
import Breadcrumb from "src/components/Common/Breadcrumb";

function SizeList() {
  interface Category {
    _id: string;
    categoryName: string;
    fullCategoryName: string;
  }

  interface SizeType {
    categoryIdPath: string;
    isBlocked: string;
    size: string;
  }

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>();
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  const [size, setSize] = useState([]);
  console.log(size);
  // const categories = ['Category 1', 'Category 2', 'Category 3'];
  const [categories, setCategoryData] = useState([]);
  const [filteredSize, setFilteredSize] = useState<SizeType[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [selectCategoryData, setSelectedCategoryData] = useState<any>()

  const GET_LEAF_RECORDS = gql`
    query GetAllLeafRecords {
      getAllLeafRecords {
        records {
          categoryName
          _id
          isBlocked
          fullCategoryName
        }
      }
    }
  `;

  const GET_ALL_SIZE = gql`
    query GetAllSizesWithCatgeoryId($input: CategoryIdInput) {
      getAllSizesWithCatgeoryId(input: $input) {
        records {
          categoryIdPath
          isBlocked
          size
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(GET_LEAF_RECORDS);

  const {
    loading: sizeLoading,
    data: sizeData,
    refetch: refetchSize,
  } = useQuery(GET_ALL_SIZE, {
    variables: { input: { categoryId: selectedCategory?.value } },
  });

  useEffect(() => {
    if (data) {
      setCategoryData(data?.getAllLeafRecords?.records || []);
    }
  }, [data]);

  useEffect(() => {
    if (selectedCategory) {
      refetchSize({ input: { categoryId: selectedCategory?.value } });
      setSize(sizeData?.getAllSizesWithCatgeoryId?.records);
    }
  }, [selectedCategory, refetchSize, sizeData]);

  const handleCategorySelect = (category: any) => {
    console.log(category,"any category selected")
    setSelectedCategory(category);
    // setSelectedCategoryData(category);
  };
  const toggleAddModal = () => {
    setShowAddModal(!showAddModal);
  };

  const statusOptions = [
    { value: "all", label: "All" },
    { value: "blocked", label: "Blocked" },
    { value: "nonBlocked", label: "Non-Blocked" },
  ];

  const toggleStatusDropdown = () => {
    setStatusDropdownOpen(!statusDropdownOpen);
  };

  const handleStatusSelect = (selectedOption: any) => {
    setSelectedStatus(selectedOption);
    setStatusDropdownOpen(false); 
  };

  useEffect(() => {
    if (selectedStatus) {
      const filtered = size.filter((size: any) => {
        if (selectedStatus.value === "all") {
          return true; 
        } else {
          return size?.isBlocked === (selectedStatus.value === "blocked"?true:false)
        }
      });
      setFilteredSize(filtered);
    } else {
      setFilteredSize(size);
    }
  }, [selectedStatus, size]);

  console.log(selectCategoryData, {selectedCategory},"jdjsdjdjfidsjf")

  return (
    <div>
      <div className="page-content">
        <Container fluid={true} >
        <Breadcrumb title="Dashboard" link="/" breadcrumbItem="SizeList"/>
        
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <Row>
                    {/* <Col xs={3}>
                      <h5 className="mb-0">Size</h5>
                    </Col> */}
                    {/* <Col xs={3}>
                      <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                      <DropdownToggle caret>
                          {selectedCategory
                            ? selectedCategory.fullCategoryName
                            : "Select Category"}
                          {"  "}
                          <FontAwesomeIcon
                            icon={faAngleDown}
                            style={{ marginRight: "5px" }}
                          />
                        </DropdownToggle>
                        <DropdownMenu>
                          {categories?.map((category:Category, index) => (
                            <DropdownItem key={index} onClick={() => handleCategorySelect(category)}>
                             {category.fullCategoryName.split("/").join("  /  ")}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </Dropdown>
                    </Col> */}

                    <Col xs={4}>
                      
                      <ReactSelect
                        value={selectedCategory}
                        onChange={(selectedOption: any) =>{
                          handleCategorySelect(selectedOption) 
                          // setSelectedCategory(selectedOption?.value);
                         
                        }}
                        options={categories.map((category: Category) => ({
                          value: category._id,
                          label: category.fullCategoryName
                        }))}
                        placeholder="Select Category"
                        isSearchable

                       

                        
                      />
                      
                    </Col>

                    <Col xs={3}>
                      <Dropdown
                        isOpen={statusDropdownOpen}
                        toggle={toggleStatusDropdown}
                      >
                        <DropdownToggle caret>
                          {selectedStatus
                            ? selectedStatus?.label
                            : "Select Status"}{" "}

<FontAwesomeIcon icon={faAngleDown} />
                        </DropdownToggle>
                        <DropdownMenu>
                          {statusOptions.map((option) => (
                            <DropdownItem
                              key={option.value}
                              onClick={() => handleStatusSelect(option)}
                            >
                              {option.label}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </Dropdown>
                    </Col>
                   
                    <Col xs={4} className="text-right" style={{display:"flex",justifyContent:"flex-end", marginLeft:"100px"}}>
                      <Button style={{backgroundColor: "rgba(0, 0, 0, 1)" }} onClick={() => toggleAddModal()}  disabled={!selectedCategory}>
                        Add Size
                      </Button>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <SizeAdd
                    isOpen={showAddModal}
                    toggle={toggleAddModal}
                    SelectedCategory={selectedCategory?.value}
                    refetch={refetchSize}
                  />
                  <Table
                    responsive
                    className="table table-bordered table-centered mb-0"
                    style={{ width: "100%" }}
                  >
                    <thead>
                      <tr>
                        <th style={{ width: "10%" }}>No</th>
                        <th style={{ width: "40%" }}>Size</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCategory ? (
                        <>
                          {filteredSize?.map((size: SizeType, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{size.size}</td>
                            </tr>
                          ))}
                        </>
                      ) : (
                        <tr>
                          <td colSpan={3} className="text-center">
                            Please select a category
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default SizeList;
