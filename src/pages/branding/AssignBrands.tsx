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

  interface IBrands {
    _id: string;
    brandName: string;
    isBlocked: boolean;
    logo: {
      fileURL: string;
    };
  }

  interface IAssingCategory {
    brandId: string;
    brandName: string;
    categories: Category[];
  }

  const [selectedBrand, setSelectedBrand] = useState<any>();
  const [Brands, setBrands] = useState<IBrands[]>([]);
  const [categories, setCategoryData] = useState<Category[]>([]);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<
    Array<{ label: string; value: string }>
  >([]);
  const [assignCategoryDatas, setAssignCategoryDatas] =
    useState<IAssingCategory>();
  const PUT_BRAND = gql`
    mutation UpdateBrand($input: updateBrandInput!) {
      updateBrand(input: $input) {
        _id
        message
      }
    }
  `;

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
    }
  `;

  const GET_ASSIGNED_CATEGORY = gql`
    query GetCategoryDetailsWithBrand(
      $input: CategoriesDetailsWithBrandIdInput!
    ) {
      getCategoryDetailsWithBrand(input: $input) {
        records {
          categories {
            _id
            categoryName
            description
            fullCategoryName
            isBlocked
            isLeaf
          }
          brandId
          brandName
        }
      }
    }
  `;

  const [UpdateBrand] = useMutation(PUT_BRAND);
  const { loading: categoriesLoading, data: categoriesData } =
    useQuery(GET_LEAF_RECORDS);

  const {
    loading: assignCategoryLoading,
    data: assignCategoryData,
    refetch: assignCategoryRefetch,
  } = useQuery(GET_ASSIGNED_CATEGORY, {
    variables: { input: { brandId: selectedBrand?.value || "" } },
  });

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
    if (selectedBrand) {
      assignCategoryRefetch({
        input: { brandId: selectedBrand?.value },
      });
      setAssignCategoryDatas(
        assignCategoryData?.getCategoryDetailsWithBrand?.records
      );
    }
  }, [selectedBrand]);

  const handleBrandSelected = (brand: IBrands) => {
    setSelectedBrand(brand);
  };





 

  const handleAssignBrand = async () => {
    if (selectedCategory.length > 0) {
      const categoryIds = selectedCategory.map((category) => category.value);

      try {
        const response: any = await UpdateBrand({
          variables: {
            input: {
              _id: selectedBrand.value,
              categories: categoryIds,
            },
          },
        });
        if (response){
          
         await assignCategoryRefetch();
         
        }
       
        toast.success("Successfully updated");
        setSelectedCategory([]);
      } catch (error: any) {
        console.error("Error assigning brands:", error.message);
        toast.error(error.message);
      }
    } else {
      console.error("Please select at least one brand to assign");
      toast.error("Please select at least one brand to assign");
    }
  };

  const handleCategorySelection = (
    selectedOptions: Array<{ label: string; value: string }>
  ) => {
    setSelectedCategory(selectedOptions);
  };

  return (
    <>
      <div className="page-content">
        <ToastContainer />
        <Container fluid={true}>
          <Breadcrumb
            title="Dashboard"
            link="/"
            breadcrumbItem="Assign-Brands"
          />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <Row>
                    <Col xs={3}>
                      <ReactSelect
                        value={selectedBrand || ""}
                        onChange={(selectedOption: any) => {
                          handleBrandSelected(selectedOption);
                        }}
                        options={Brands.map((brand: IBrands) => ({
                          value: brand._id,
                          label: brand.brandName,
                        }))}
                        placeholder="Select Brand"
                        isSearchable
                      />
                    </Col>{" "}
                    <Col
                      xs={8}
                      className="text-right"
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginLeft: "130px",
                      }}
                    >
                      <div className="d-flex justify-content-end mb-3">
                        <Label
                          className="mt-2 "
                          style={{ marginRight: "20px" }}
                        >
                          Assign Category:
                        </Label>
                        <Select
                          isMulti
                          options={categories.map((category) => ({
                            label: category.fullCategoryName,
                            value: category._id,
                          }))}
                          value={selectedCategory}
                          onChange={(selectedOptions: any) =>
                            handleCategorySelection(selectedOptions)
                          }
                          placeholder="Select Category..."
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
                          Assign Category
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
                        <th style={{ width: "40%" }}>Category Name</th>
                        <th style={{ width: "40%" }}>Categorey FullName</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedBrand ? (
                        <>
                          {assignCategoryDatas?.categories?.map(
                            (value: Category, index: any) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{value.categoryName}</td>
                                <td>{value.fullCategoryName}</td>
                              </tr>
                            )
                          )}
                        </>
                      ) : (
                        <tr>
                          <td colSpan={3} className="text-center">
                            Please select a Brand
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
