import React, { useEffect, useState } from "react";
import {

  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Input,
  Row,
  Table,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import CategoryForm from "src/components/category/CategoryForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import AddColor from "./AddColor";
import { boolean } from "yup";
import { gql, useQuery } from "@apollo/client";
import Select from "react-select/dist/declarations/src/Select";
import ReactSelect from "react-select";
import Breadcrumb from "src/components/Common/Breadcrumb";


function ColorList() {
  interface Category {
    _id: string;
    categoryName: string;
    fullCategoryName: string;
  }

  interface ColorType {
    _id: string;
    categoryIdPath: string;
    colorCode: string;
    colorName: string;
    isBlocked: boolean;
  }

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>();
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [colors, setColors] = useState([]);
  const [editColor, setEditColor]=useState<ColorType | null>(null)

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  const [categories, setCategoryData] = useState([]);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<{
    value: string;
    label: string;
  } | null>(null);

  const [filteredColors, setFilteredColors] = useState<ColorType[]>([]);
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

  const GET_ALL_COLORES = gql`
    query GetAllColorsWithCategoryId($input: CategoryIdInput) {
      getAllColorsWithCategoryId(input: $input) {
        records {
          categoryIdPath
          colorCode
          colorName
          isBlocked
        }
      }
    }
  `;

  const { loading: categoriesLoading, data: categoriesData } =
    useQuery(GET_LEAF_RECORDS);
  const {
    loading: colorsLoading,
    data: colorsData,
    refetch: refetchColors,
  } = useQuery(GET_ALL_COLORES, {
    variables: { input: { categoryId: selectedCategory?.value } },
  });

  useEffect(() => {
    if (categoriesData) {
      setCategoryData(categoriesData?.getAllLeafRecords?.records);
    }
  }, [categoriesData]);

  useEffect(() => {
    if (selectedCategory) {
      refetchColors({ input: { categoryId: selectedCategory?.value } });
      setColors(colorsData?.getAllColorsWithCategoryId?.records);
    }
  }, [selectedCategory, refetchColors, colorsData]);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
  };

  const toggleAddModal = () => {
    setShowAddModal(!showAddModal);
    if (showAddModal) {
      setEditColor(null);
    }
  };

  const toggleStatusDropdown = () => {
    setStatusDropdownOpen(!statusDropdownOpen);
  };

  const handleStatusSelect = (selectedOption: any) => {
    setSelectedStatus(selectedOption);
    setStatusDropdownOpen(false);
  };

  const statusOptions = [
    { value: "all", label: "All" },
    { value: "blocked", label: "Blocked" },
    { value: "nonBlocked", label: "Non-Blocked" },
  ];

  console.log(selectedCategory);

  useEffect(() => {
    if (selectedStatus) {
      const filtered = colors.filter((color: ColorType) => {
        if (selectedStatus.value === "all") {
          return true;
        } else {
          return color.isBlocked === (selectedStatus.value === "blocked");
        }
      });
      setFilteredColors(filtered);
    } else {
      setFilteredColors(colors);
    }
  }, [selectedStatus, colors]);


  function handleEdit(data: ColorType) {
    setEditColor(data);
    toggleAddModal();
  }


  console.log(colors,"selected");
  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          
          <Breadcrumb title="Dashboard" link="/" breadcrumbItem="ColorList"/>
         
       
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <Row>
                    {/* <Col xs={3}>
                      <h5 className="mb-0">Colors</h5>
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
                          {categories.map((category: Category, index) => (
                            <DropdownItem
                              key={index}
                              onClick={() => handleCategorySelect(category)}
                            >
                              {category.fullCategoryName.split("/").join("  /  ")}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </Dropdown>
                    </Col> */}
                    <Col xs={4}>
                      <ReactSelect
                        value={selectedCategory || ""}
                        onChange={(selectedOption: any) => {
                          handleCategorySelect(selectedOption);
                        }}
                        options={categories.map((category: Category) => ({
                          value: category._id,
                          label: category.fullCategoryName
                        }))}
                        placeholder="Select Category"
                        isSearchable
                       
                      />
                    </Col>{" "}
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
                    {/* <Col xs={2}>
                      <Input
                        type="text"
                        value=""
                        placeholder="Selected Category"
                        readOnly
                        style={{ width: "100%" }}
                      />
                    </Col> */}
                    <Col xs={4} className="text-right" style={{display:"flex",justifyContent:"flex-end", marginLeft:"100px"}}>
                      <Button
                        style={{ backgroundColor: "#000000" }}
                        onClick={() => toggleAddModal()}
                        disabled={!selectedCategory}
                      >
                        Add Color
                      </Button>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <AddColor
                    isOpen={showAddModal}
                    toggle={toggleAddModal}
                    SelectedCategory={selectedCategory?.value}
                    refetch={refetchColors}
                    isEdit={editColor}
                  />
                  <Table
                    responsive
                    className="table table-bordered table-centered mb-0"
                    style={{ width: "100%" }}
                  >
                    <thead>
                      <tr>
                        <th style={{ width: "10%" }}>No</th>
                        <th style={{ width: "40%" }}>Color Name</th>
                        <th style={{ width: "40%" }}>Color Code</th>
                        <th style={{ width: "40%" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCategory ? (
                        <>
                          {filteredColors?.map((color: ColorType, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{color.colorName}</td>
                              <td>
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "3px",
                                    alignItems: "center",
                                  }}
                                >
                                  <div
                                    style={{
                                      backgroundColor: color.colorCode,
                                      width: "30px",
                                      height: "30px",
                                      borderRadius: "50%",
                                    }}
                                  ></div>

                                  {color.colorCode}
                                </div>
                              </td>
                              <td>
                                <Button
                                  size="sm"
                                  style={{
                                    backgroundColor: "rgba(177, 35, 73, 1)",
                                  }}

                                  onClick={() => handleEdit(color)}
                                >
                                  Edit
                                </Button>{" "}
                              </td>
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
    </>
  );
}

export default ColorList;
