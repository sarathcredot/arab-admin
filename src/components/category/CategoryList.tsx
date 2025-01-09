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
  BreadcrumbItem,
} from "reactstrap";
import CategoryForm from "./CategoryForm";
import { gql, useMutation, useQuery } from "@apollo/client";
import { ToastContainer } from "react-toastify";
import { result } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import CustomButton from "../Common/CustomButton";
import { Link } from "react-router-dom";
import { capitalCase } from "change-case";
import Loader from "../Common/Loader";
import StatusIndicator from "../statusIndicator/StatusIndicator";

interface sizeChart {
  fileType: string;
  fileURL: string;
  mimeType: string;
  originalName: string;
}

interface Category {
  _id: string;
  categoryName: string;
  fullCategoryName?: string;
  description: string;
  children?: Category[];
  isLeaf: boolean;
  categoryImage?: {
    fileType: string;
    fileURL: string;
    mimeType: string;
    originalName: string;
  };
  isBlocked: boolean;
}

interface Props { }

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
      query GetAllChildCategories($input: GetAllChildLevelCategoriesInput!) {
  getAllChildCategories(input: $input) {
    records {
      categoryName
      _id
      isBlocked
      fullCategoryName
      isLeaf
      description
      categoryImage {
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
    query GetAllChildCategories($input: GetAllChildLevelCategoriesInput!) {
  getAllChildCategories(input: $input) {
    records {
      categoryName
      _id
      isBlocked
      fullCategoryName
      isLeaf
      description
      categoryImage {
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
    fetchPolicy: "network-only",
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
    if (!breadcrumb.find(item => item._id === category._id)) {
      setBreadcrumb([...breadcrumb, category]);
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    if (index === -1) {
      setShowSubCategories(false);
      setBreadcrumb([]);
      setSelectedCategory(null);
    } else {
      const newBreadcrumb = breadcrumb.slice(0, index + 1);
      setShowSubCategories(index < breadcrumb.length - 1);
      setSelectedCategory(newBreadcrumb[index]);
      setBreadcrumb(newBreadcrumb);
    }
  };

  const isLastItem = (index: number) => {
    return index === breadcrumb.length - 1;
  };

  const statusOptions = [
    { value: "all", label: "All" },
    { value: "false", label: "Active" },
    { value: "true", label: "Blocked" },
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
            (selectedStatus.value === "true" ? true : false)
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

  const items = [
    { text: "Dashboard", link: `/` },
  ];

  return (
    <>
      <ToastContainer />
      <div className="page-content">
        <Container fluid={true} >

          <Row>
            <Col xs={12}>
              <div className="page-title-right">
                <ol className="breadcrumb m-0" style={{ marginBottom: "10px" }}>
                  {breadcrumb.length !== 0 && (
                    <BreadcrumbItem key={-1}>
                      <Link onClick={() => handleBreadcrumbClick(-1)} to="#">
                        Categories
                      </Link>
                    </BreadcrumbItem>
                  )}
                  {breadcrumb.map((item, index) => (
                    <BreadcrumbItem key={index} active>
                      {isLastItem(index) ? (
                        <span>{capitalCase(item.categoryName)}</span>
                      ) : (
                        <Link onClick={() => handleBreadcrumbClick(index)} to="#">
                          {capitalCase(item.categoryName)}
                        </Link>
                      )}
                    </BreadcrumbItem>
                  ))}
                </ol>
              </div>
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <div style={{ marginTop: "20px" }} className="page-title-box d-sm-flex align-items-center justify-content-between">
                <h4 className="mb-0 font-size-18">
                  {breadcrumb.length > 0 ? capitalCase(breadcrumb[breadcrumb.length - 1].categoryName) : "Categories"}
                </h4>
              </div>
            </Col>
          </Row>




          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <Row>
                    <Col xs={6} style={{ display: "flex", gap: "20px", }}>
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

                    <Col xs={6} style={{ display: "flex", justifyContent: "flex-end", }}>

                      <CustomButton name="Add Category" icon="material-symbols:add"
                        onClick={() => toggleAddModal()}
                      />
                    </Col>

                  </Row>
                </CardHeader>
                <CardBody>
                  <CategoryForm
                    isOpen={showAddModal}
                    toggle={toggleAddModal}
                    isSelected={selectedCategory}
                    isEdit={editCategory}
                    isLeaf={breadcrumb.length >= 2 ? true : false}
                    refetch={categoryRefetch}
                    childrefetch={childCategoryRefetch}
                  />
                  {
                    categoryLoading ?
                      <Loader />
                      :

                      <div className="table-rep-plugin">

                        <div className="table-responsive mb-0" data-pattern="priority-columns">


                          <Table id="tech-companies-1" className="table table-striped table-bordered">
                            <thead>
                              <tr>
                                <th>No</th>
                                <th>Name</th>
                                <th>Description</th>
                                {/* <th>Size Chart Image</th> */}
                                <th className="text-center">Status</th>
                                <th style={{width:"120px",textAlign:"center"}}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredCategory.map((category, index) => (
                                <tr key={category._id}>
                                  <td>{index + 1}</td>
                                  <td>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                      {category.categoryImage && category.categoryImage.fileURL && (
                                        <img src={category.categoryImage.fileURL} alt={category.categoryName} style={{ width: "30px", height: "30px" }} />
                                      )}
                                      <span>{category.categoryName}</span>
                                    </div>
                                  </td>

                                  <td>{category.description}</td>
                                  {/* <td>
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
                            </td> */}

                                  <td>
                                  <div style={{ display: "flex", alignItems: "center",justifyContent:"center" }}>
                                    <StatusIndicator status={category?.isBlocked == false ? "Active" : "Blocked"} />
                                  </div>
                                  </td>

                                  <td >
                                  <div style={{ display: "flex", alignItems: "center",gap:10 }}>
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
                                      color="primary"
                                      size="sm"
                                      onClick={() => handleEdit(category)}
                                      
                                      >
                                      Edit
                                    </Button>{" "}
                                      </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      </div>
                  }

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

  }
};

export default CategoryList;
