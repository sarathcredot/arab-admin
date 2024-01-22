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
  Label,
} from "reactstrap";
import CategoryForm from "src/components/category/CategoryForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

import { boolean } from "yup";
import { gql, useMutation, useQuery } from "@apollo/client";
// import Select from "react-select/dist/declarations/src/Select";
import ReactSelect from "react-select";
import Breadcrumb from "src/components/Common/Breadcrumb";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";

function Assignattribute() {
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

  interface IAttribute {
    _id: string;
    attributeType: string;
    name: string;
    description: string;
    isBlocked: boolean;
  }

  interface IAssingAttribute {
    _id: string;
    categoryName: string;
    attributes: IAttribute[];
  }

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>();
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [colors, setColors] = useState([]);
  const [editColor, setEditColor] = useState<ColorType | null>(null);
  const [attributes, setAttribute] = useState<IAttribute[]>([]);
  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  const [categories, setCategoryData] = useState([]);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<{
    value: string;
    label: string;
  } | null>(null);

  const [setectedAttributes, setSelectedAttributes] = useState<
    Array<{ label: string; value: string }>
  >([]);

  const [assignAttributeDatas, setAssignAttributeDatas] =
    useState<IAssingAttribute>();

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

  const GET_ALL_ATTRIBUTES_WITH_CATEGORY_ID = gql`
    query GetAttributesDetailsWithCategory(
      $input: AttributesDetailsWithCategoryIdInput!
    ) {
      getAttributesDetailsWithCategory(input: $input) {
        message
        record {
          _id
          categoryName
          attributes {
            _id
            attributeType
            description
            isBlocked
            name
          }
        }
      }
    }
  `;

  const GET_ALL_ATTRIBUTES = gql`
    query GetAllAttributeRecordsByAdmin($input: AttributeRecordsByAdminFilter) {
      getAllAttributeRecordsByAdmin(input: $input) {
        maxRecords
        records {
          _id
          attributeType
          name
          description
          isBlocked
        }
      }
    }
  `;

  const PUT_CETEGORY = gql`
    mutation UpdateCategory($input: UpdateCategoryInput!) {
      updateCategory(input: $input) {
        _id
        message
      }
    }
  `;

  const [updateCategory] = useMutation(PUT_CETEGORY);

  const { loading: categoriesLoading, data: categoriesData } =
    useQuery(GET_LEAF_RECORDS);

  const {
    loading: assignAttributeLoading,
    data: assignAttributeData,
    refetch: assignAttributeRefetch,
  } = useQuery(GET_ALL_ATTRIBUTES_WITH_CATEGORY_ID, {
    variables: { input: { categoryId: selectedCategory?.value || "" } },
  });

  const {
    loading: attributesLoding,
    data: attributesData,
    refetch: attributesRefetch,
  } = useQuery(GET_ALL_ATTRIBUTES);
  useEffect(() => {
    if (categoriesData) {
      setCategoryData(categoriesData?.getAllLeafRecords?.records);
    }

    if (attributesData) {
      setAttribute(attributesData?.getAllAttributeRecordsByAdmin?.records);
    }
  }, [categoriesData, attributesData]);

  useEffect(() => {
    if (selectedCategory) {
      assignAttributeRefetch({
        input: { categoryId: selectedCategory?.value },
      });
      setAssignAttributeDatas(
        assignAttributeData?.getAttributesDetailsWithCategory?.record
      );
    }
  }, [selectedCategory]);

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


  function handleEdit(data: ColorType) {
    setEditColor(data);
    toggleAddModal();
  }

  const handleAssignAttribute = async () => {
   
    if (setectedAttributes.length > 0) {
      const attributeIds = setectedAttributes.map(
        (attribute) => attribute.value
      );
      try {
        const response: any = await updateCategory({
          variables: {
            input: {
              _id: selectedCategory.value,
              attributes: attributeIds,
            },
          },
        });

        toast.success(response?.message);
        setSelectedAttributes([]);
        assignAttributeRefetch()
      } catch (error: any) {
        toast.error(error.message);
        console.error("Error assigning brands:", error.message);
      }
    } else {
      console.error("Please select at least one brand to assign");
    }
  };

  const handleBrandSelection = (
    selectedOptions: Array<{ label: string; value: string }>
  ) => {
    setSelectedAttributes(selectedOptions);
  };

  console.log(assignAttributeDatas);

  return (
    <>
      <div className="page-content">
        <ToastContainer/>
        <Container fluid={true}>
          <Breadcrumb title="Dashboard" link="/" breadcrumbItem="Assign-Attribute" />
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
                          label: category.fullCategoryName,
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
                    <Col
                      xs={4}
                      className="text-right"
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginLeft: "100px",
                      }}
                    >
                      {/* <Button
                          style={{ backgroundColor: "#000000" }}
                          onClick={() => toggleAddModal()}
                          disabled={!selectedCategory}
                        >
                          Add Color
                        </Button> */}

                      <div className="d-flex justify-content-end mb-3">
                        <Label
                          className="mt-2 "
                          style={{ marginRight: "20px" }}
                        >
                          Assign Attributes:
                        </Label>
                        <Select
                          isMulti
                          options={attributes.map((attribute) => ({
                            label: attribute.description,
                            value: attribute._id,
                          }))}
                          value={setectedAttributes}
                          onChange={(selectedOptions: any) =>
                            handleBrandSelection(selectedOptions)
                          }
                          placeholder="Select Attributes..."
                          styles={{
                            control: (styles: any) => ({
                              ...styles,
                              marginRight: "10px",
                              // width: "200px",
                            
                              
                            }),
                          }}
                        />
                        <Button
                          style={{ backgroundColor: "#000000" }}
                          onClick={handleAssignAttribute}
                        >
                          Assign Attributes
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Table
                    responsive
                    className="table table-bordered table-centered mb-0"
                    style={{ width: "100%" }}
                  >
                    <thead>
                      <tr>
                        <th style={{ width: "10%" }}>No</th>
                        <th style={{ width: "40%" }}>Attribute Type</th>
                        <th style={{ width: "40%" }}>Description</th>
                        <th style={{ width: "40%" }}>Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCategory ? (
                        <>
                          {assignAttributeDatas?.attributes?.map(
                            (value: IAttribute, index: any) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{value.attributeType}</td>
                                <td>{value.description}</td>
                                <td>{value.name}</td>
                              </tr>
                            )
                          )}
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

export default Assignattribute;
