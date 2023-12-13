import React, { useEffect, useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
  Table,
  Button,
  Input,
  Pagination,
  PaginationItem,
  PaginationLink,
  Modal,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import CategoryForm from "./CategoryForm";
import { gql, useMutation, useQuery } from "@apollo/client";
import { ToastContainer } from "react-toastify";
import { result } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

interface sizeChart {
  fileType: string;
  fileURL: string;
  mimeType: string;
  originalName: string;
}

interface Category {
  _id: string;
  categoryName: string;
  description: string;
  children?: Category[];
  isLeaf: boolean;
  sizeChart: sizeChart;
  isBlocked: boolean;
}

interface Props {}

const CategoryList: React.FC<Props> = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  // const [itemsPerPage] = useState<number>(5);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [showSubCategories, setShowSubCategories] = useState<boolean>(false);
  const [categoryData, setCategoryData] = useState<Category[]>([]);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>("");
  const [breadcrumb, setBreadcrumb] = useState<Category[]>([]);
  const [topCategory, setTopCategory] = useState<boolean>(false);
  const [filteredCategory, setFilteredCategory] = useState<Category[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const GET_CATEGORY = gql`
    query Records($input: GetAllChildLevelCategoriesInput!) {
      getAllChildCategories(input: $input) {
        records {
          categoryName
          _id
          isBlocked
          fullCategoryName
          isLeaf
          description
          sizeChart {
            fileType
            fileURL
            mimeType
            originalName
          }
        }
      }
    }
  `;

  const GET_CHAILEDCATGORY = gql`
    query Records($input: GetAllChildLevelCategoriesInput!) {
      getAllChildCategories(input: $input) {
        records {
          categoryName
          _id
          isBlocked
          fullCategoryName
          isLeaf
          description
          sizeChart {
            fileType
            fileURL
            mimeType
            originalName
          }
        }
      }
    }
  `;
  const {
    loading: categoryLoading,
    error: categoryError,
    data: categoryDataResponse,
    refetch: categoryRefetch,
  } = useQuery(GET_CATEGORY, {
    variables: {
      input: {
        parent: null,
      },
    },
  });
  const {
    loading: childCategoryLoading,
    error: childCategoryError,
    data: childCategoryData,
    refetch: childCategoryRefetch,
  } = useQuery(GET_CHAILEDCATGORY, {
    variables: {
      input: {
        parent:
          breadcrumb.length === 0
            ? null
            : breadcrumb[breadcrumb.length - 1]._id,
      },
    },
  });

  const handleGoBack = () => {
    const newBreadcrumb = breadcrumb.slice(0, breadcrumb.length - 1);
    setBreadcrumb(newBreadcrumb);
  };

  useEffect(() => {
    if (showSubCategories) {
      setCategoryData(childCategoryData?.getAllChildCategories?.records || []);
    } else {
      setCategoryData(
        categoryDataResponse?.getAllChildCategories?.records || []
      );
    }
  }, [
    categoryLoading,
    showSubCategories,
    categoryDataResponse,
    childCategoryData,
    topCategory,
  ]);

  const openImageModal = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
    setIsImageModalOpen(true);
  };

  const flattenedCategories: Category[] = flattenCategories(categoryData);

  // const [currentItems, totalPages] = getCurrentPageItems(flattenedCategories, currentPage, itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const toggleAddModal = () => {
    setShowAddModal(!showAddModal);
    if (showAddModal) {
      setEditCategory(null);
    }
  };

  const handleAddCategory = () => {
    toggleAddModal();
  };

  const handleNext = (category: Category) => {
    setSelectedCategory(category);
    setShowSubCategories(true);
    setBreadcrumb([...breadcrumb, category]);
  };

  const handleBreadcrumbClick = (index: number) => {
    if (index === -1) {
      // Clicked on base category (top level)
      setShowSubCategories(false);
      setBreadcrumb([]);
      setSelectedCategory(null);
    } else {
      const newBreadcrumb = breadcrumb.slice(0, index + 1);
      setBreadcrumb(newBreadcrumb);
      setShowSubCategories(index < breadcrumb.length - 1);
      setSelectedCategory(newBreadcrumb[index]);
    }
  };

  const statusOptions = [
    { value: "all", label: "All" },
    { value: "blocked", label: "Blocked" },
    { value: "nonBlocked", label: "Active" },
  ];

  const toggleStatusDropdown = () => {
    setStatusDropdownOpen(!statusDropdownOpen);
  };

  const handleStatusSelect = (selectedOption: any) => {
    setSelectedStatus(selectedOption);
    setStatusDropdownOpen(false);
  };

  const handleSearch = (event: any) => {
    setSearchTerm(event.target.value);
    console.log(event.target.value);
  };

  useEffect(() => {
    if (selectedStatus) {
      const filtered = categoryData.filter((size: any) => {
        const isNameMatch = size.categoryName
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        if (selectedStatus.value === "all") {
          return isNameMatch;
        } else {
          return (
            isNameMatch &&
            size?.isBlocked ===
              (selectedStatus.value === "blocked" ? true : false)
          );
        }
      });
      setFilteredCategory(filtered);
    } else {
      const filtered = categoryData.filter((size: any) =>
        size.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategory(filtered);
    }
  }, [selectedStatus, categoryData, breadcrumb, searchTerm]);

  return (
    <>
      <ToastContainer />
      <div className="page-content">
        <div className="mb-0" style={{ display: "flex", gap: "5px" }}>
          {breadcrumb.length > 0 && (
            <span
              style={{ cursor: "pointer", color: "black", fontWeight: "bold" }}
              onClick={() => handleBreadcrumbClick(-1)}
            >
              Home /
            </span>
          )}
          {breadcrumb.map((category, index) => (
            <span key={category._id} color="gray ">
              {index > 0 && " / "}
              {index === breadcrumb.length - 1 ? (
                category.categoryName
              ) : (
                <span
                  style={{
                    cursor: "pointer",
                    color: "black",
                    fontWeight: "bold",
                  }}
                  onClick={() => handleBreadcrumbClick(index)}
                >
                  {category.categoryName}
                </span>
              )}
            </span>
          ))}
        </div>
        <Container fluid={true} style={{ marginTop: "40px" }}>
          <Breadcrumb title="Dashboard" breadcrumbItem="Category" link="/" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <Row>
                    <Col xs={5} style={{display:"flex", gap:"20px",}}>
                      <Input
                        type="text"
                        placeholder="Search by name"
                        value={searchTerm}
                        onChange={handleSearch}
                        style={{ width: "50%" }}
                      />
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

                    <Col xs={6} style={{display:"flex", gap:"20px", justifyContent: "flex-end",marginLeft:"127px"}}>
                     
                      <Button
                        style={{ backgroundColor: "rgba(0, 0, 0, 1)" }}
                        onClick={() => toggleAddModal()}
                      >
                        Add Category
                      </Button>
                    </Col>
                    
                  </Row>
                </CardHeader>
                <CardBody>
                  <CategoryForm
                    isOpen={showAddModal}
                    toggle={toggleAddModal}
                    isSelected={selectedCategory}
                    isEdit={editCategory}
                    refetch={categoryRefetch}
                    childrefetch={childCategoryRefetch}
                  />
                  <Table
                    responsive
                    className="table table-bordered table-centered mb-0"
                  >
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Size Chart Image</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCategory.map((category, index) => (
                        <tr key={category._id}>
                          <td>{index + 1}</td>
                          <td>{category.categoryName}</td>
                          <td>{category.description}</td>
                          <td>
                            {category.sizeChart && (
                              <img
                                src={category?.sizeChart?.fileURL}
                                alt="Size Chart"
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  openImageModal(category?.sizeChart?.fileURL)
                                }
                              />
                            )}
                          </td>

                          <td>
                            {category?.isBlocked == false ? "Active" : "Block"}
                          </td>

                          <td>
                            {category.isLeaf ? null : (
                              <Button
                                size="sm"
                                onClick={() => handleNext(category)}
                                style={{ backgroundColor: "rgba(0, 0, 0, 1)" }}
                              >
                                Next
                              </Button>
                            )}
                            {"  "}
                            <Button
                              size="sm"
                              onClick={() => handleEdit(category)}
                              style={{
                                backgroundColor: "rgba(177, 35, 73, 1)",
                              }}
                            >
                              Edit
                            </Button>{" "}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  <Modal
                    isOpen={isImageModalOpen}
                    toggle={() => setIsImageModalOpen(!isImageModalOpen)}
                  >
                    <img
                      src={selectedImageUrl}
                      alt="Full Size Chart"
                      style={{ width: "100%" }}
                    />
                  </Modal>

                  {/* <Pagination className="mt-3">
                    <PaginationItem disabled={currentPage === 1}>
                      <PaginationLink previous onClick={() => paginate(currentPage - 1)} />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, index) => (
                      <PaginationItem key={index} active={index + 1 === currentPage}>
                        <PaginationLink onClick={() => paginate(index + 1)}>{index + 1}</PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem disabled={currentPage === totalPages}>
                      <PaginationLink next onClick={() => paginate(currentPage + 1)} />
                    </PaginationItem>
                  </Pagination> */}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );

  function flattenCategories(categories: Category[]): Category[] {
    let flattenedCategories: Category[] = [];
    categories.forEach((category) => {
      flattenedCategories.push(category);
      if (category.children && category.children.length > 0) {
        flattenedCategories = [
          ...flattenedCategories,
          ...flattenCategories(category.children),
        ];
      }
    });
    return flattenedCategories;
  }

  function getCurrentPageItems(
    data: Category[],
    currentPage: number,
    itemsPerPage: number
  ): [Category[], number] {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(data.length / itemsPerPage);
    return [currentItems, totalPages];
  }

  function handleEdit(data: Category) {
    setEditCategory(data);
    toggleAddModal();
  }

  function handleDelete(id: string) {
    console.log(`Delete button clicked for ID: ${id}`);
  }
};

export default CategoryList;
