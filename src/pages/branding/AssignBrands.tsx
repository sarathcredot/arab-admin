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

function AssignBrands() {
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

  interface IBrands {
         _id: string;
      brandName: string;
      isBlocked: boolean;
      logo: {
        fileURL: string;
      };
  }

  interface IAssingBrand {
    _id: string;
    categoryName: string;
    brands: IBrands[];
  }

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>();
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [colors, setColors] = useState([]);
  const [editColor, setEditColor] = useState<ColorType | null>(null);
  const [Brands, setBrands] = useState<IBrands[]>([]);
  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  const [categories, setCategoryData] = useState([]);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<{
    value: string;
    label: string;
  } | null>(null);

  const [selectedBrands, setSelectedBrands] = useState<
    Array<{ label: string; value: string }>
  >([]);

  const [assignBrandDatas, setAssignBrandDatas] =
    useState<IAssingBrand>();

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


const GET_BRAND = gql`
   query GetAllBrandRecordsByAdmin($input: BrandRecordsFilter) {
  getAllBrandRecordsByAdmin(input: $input) {
    maxRecords
    message
    records {
      _id
      brandName
      isBlocked
    }
  }
}`;


const GET_ASSIGNED_CATEGORY =  gql`query GetBrandDetailsWithCategory($input: BrandsDetailsWithCategoryIdInput!) {
  getBrandDetailsWithCategory(input: $input) {
    message
    record {
      _id
      categoryName
      brands {
        _id
        brandName
        isBlocked
        logo {
          fileType
          fileURL
          mimeType
          originalName
        }
        isPopular
        priority
      }
    }
  }
}`;

  const [updateCategory] = useMutation(PUT_CETEGORY);

  const { loading: categoriesLoading, data: categoriesData } =
    useQuery(GET_LEAF_RECORDS);

  const {
    loading: assignBrandLoading,
    data: assignBrandsData,
    refetch: assignBrandRefetch,
  } = useQuery(GET_ASSIGNED_CATEGORY, {
    variables: { input: { categoryId: selectedCategory?.value || "" } },
  });

  const {
    loading: attributesLoding,
    data: attributesData,
    refetch: attributesRefetch,
  } = useQuery(GET_ALL_ATTRIBUTES);


  const {
    loading: brandLoading,
    error: brandError,
    data: brandDataResponse,
    refetch: brandRefetch,
  } = useQuery(GET_BRAND, {
    variables: {
      input: {
        page: null,
        size: 10,
        
      },
    },
  });


  useEffect(() => {
    if (categoriesData) {
      setCategoryData(categoriesData?.getAllLeafRecords?.records);
    }

    if (brandDataResponse) {
      setBrands(brandDataResponse?.getAllBrandRecordsByAdmin?.records);
    }

  }, [categoriesData, brandDataResponse]);

  useEffect(() => {
    if (selectedCategory) {
      assignBrandRefetch({
        input: { categoryId: selectedCategory?.value },
      });
      setAssignBrandDatas(
        assignBrandsData?.getBrandDetailsWithCategory?.record
      );
    }
  }, [selectedCategory , assignBrandRefetch, brandRefetch]);

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

  const handleAssignBrand = async () => {
   
    if (selectedBrands.length > 0) {
      const brandIds = selectedBrands.map(
        (brand) => brand.value
      );

     
      try {
        const response: any = await updateCategory({
          variables: {
            input: {
              _id: selectedCategory.value,
              brands: brandIds,
            },
          },
        });
        assignBrandRefetch()
        brandRefetch()
        toast.success("Successfully updated");
        setSelectedBrands([]);
        // assignAttributeRefetch()
       
      } catch (error: any) {
        console.error("Error assigning brands:", error.message);
        toast.error(error.message)
      }
    } else {
      console.error("Please select at least one brand to assign");
      toast.error("Please select at least one brand to assign");
     
    }
  };

  const handleBrandSelection = (
    selectedOptions: Array<{ label: string; value: string }>
  ) => {
    setSelectedBrands(selectedOptions);
  };

  console.log(assignBrandDatas);

  return (
    <>
      <div className="page-content">
        <ToastContainer/>
        <Container fluid={true}>
          <Breadcrumb title="Dashboard" link="/" breadcrumbItem="Assign-Brands" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <Row>
                  
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
                  
                    <Col
                      xs={4}
                      className="text-right"
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginLeft: "100px",
                      }}
                    >
                     

                      <div className="d-flex justify-content-end mb-3">
                        <Label
                          className="mt-2 "
                          style={{ marginRight: "20px" }}
                        >
                          Assign Brands:
                        </Label>
                        <Select
                          isMulti
                          options={Brands.map((brand) => ({
                            label: brand.brandName,
                            value: brand._id,
                          }))}
                          value={selectedBrands}
                          onChange={(selectedOptions: any) =>
                            handleBrandSelection(selectedOptions)
                          }
                          placeholder="Select Attributes..."
                          styles={{
                            control: (styles: any) => ({
                              ...styles,
                              marginRight: "10px",
                              width: "200px",
                            }),
                          }}
                        />
                        <Button
                          style={{ backgroundColor: "#000000" }}
                          onClick={handleAssignBrand}
                        >
                          Assign Brands 
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
                        <th style={{ width: "40%" }}>Brand Name</th>
                        <th style={{ width: "40%" }}>Logo</th>
                        {/* <th style={{ width: "40%" }}>status</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCategory ? (
                        <>
                          {assignBrandDatas?.brands?.map(
                            (value: IBrands, index: any) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{value.brandName}</td>
                                {/* <td>{value.description}</td>
                                <td>{value.name}</td> */}
                                <td>
          {value.logo && (
            <img
              src={value.logo.fileURL}
              alt={`Logo for ${value.brandName}`}
              style={{ width: '50px', height: '50px' }}
            />
          )}
        </td>
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

export default AssignBrands;
