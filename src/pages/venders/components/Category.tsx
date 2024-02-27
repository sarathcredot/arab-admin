import React, { useEffect, useState } from "react";

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
  Label,
} from "reactstrap";

import { gql, useMutation, useQuery } from "@apollo/client";
import { ToastContainer, toast } from "react-toastify";
import { result } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import { useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
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
  fullCategoryName: string;
}

interface Props { }

const CategoryList: React.FC<Props> = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<
    Array<{ label: string; value: string }>
  >([]);
  const [categoryData, setCategoryData] = useState<Category[]>([]);
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [assignedCategryData, setAssignedCategryData] = useState<Category[]>([]);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id")

  const GET_ALL_ISLEAF_CATEGORY = gql`
    query Records {
      getAllLeafRecords {
        records {
          categoryName
          _id
          isBlocked
          fullCategoryName
          isLeaf
          description
        }
      }
    }
  `;


  const GET_ASSIGNED_CATEGORY = gql`
  query Records($input: vendorIdInput!) {
  getAllCategoriesOfVendor(input: $input) {
    records {
      categoryName
      _id
      isBlocked
      fullCategoryName
      isLeaf
    }
  }
}
`;

  const PUT_VENDOR = gql`mutation UpdateVendorProfileByAdmin($input: VendorEditProfileByAdminInput!) {
  updateVendorProfileByAdmin(input: $input) {
    _id
    message
  }
}`;

  const [UpdateVendorProfileByAdmin] = useMutation(PUT_VENDOR)

  const {
    loading: categoryLoading,
    error: categoryError,
    data: categoryDataResponse,
    refetch: categoryRefetch,
  } = useQuery(GET_ALL_ISLEAF_CATEGORY);


  const {
    loading: assignCategoryLoading,
    error: assignCategoryError,
    data: assignCategoryDataResponse,
    refetch: assignCategoryRefetch,
  } = useQuery(GET_ASSIGNED_CATEGORY, {
    variables: {
      input: {
        vendorId: id
      }
    }
  });


  useEffect(() => {
    if (categoryDataResponse) {
      setCategoryData(categoryDataResponse?.getAllLeafRecords?.records || []);
    }
  }, [categoryDataResponse])

  useEffect(() => {
    if (assignCategoryDataResponse) {
      setAssignedCategryData(assignCategoryDataResponse?.getAllCategoriesOfVendor?.records || [])
    }
  }, [assignCategoryDataResponse]);

  const openImageModal = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
    setIsImageModalOpen(true);
  };

  const flattenedCategories: Category[] = flattenCategories(categoryData);

  // const [currentItems, totalPages] = getCurrentPageItems(flattenedCategories, currentPage, itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const toggleAddModal = () => {
    setShowAddModal(!showAddModal);

  };

  const handleAddCategory = () => {
    toggleAddModal();
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
  };

  const handleBrandSelection = (
    selectedOptions: Array<{ label: string; value: string }>
  ) => {
    setSelectedCategory(selectedOptions);
  };


  const handleAssignCategory = async () => {
    if (selectedCategory.length > 0) {
      const categoryIds = selectedCategory.map((category) => category.value);
      console.log(categoryIds, "selectedCategory")
      try {
        const response: any = await UpdateVendorProfileByAdmin({
          variables: {
            input: {
              _id: id,
              categories: categoryIds
            },
          },
        });

        toast.success(response?.message)
        assignCategoryRefetch()
        categoryRefetch()
        setSelectedCategory([])

      } catch (error: any) {
        toast.error(error.message);
      }
    } else {
      toast.error("Please select at least one brand to assign");
    }
  };

  return (
    <>

      <Card style={{
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        marginTop: "20px",
      }}>
        <CardHeader>
          <Row>

            <div className="d-flex justify-content-end mb-3">
              <Label className="mt-2 " style={{ marginRight: "20px" }}>
                Assign Categories :
              </Label>
              <Select
                isMulti
                options={categoryData.map((category) => ({
                  label: category.categoryName,
                  value: category._id,
                }))}
                value={selectedCategory}
                onChange={(selectedOptions: any) =>
                  handleBrandSelection(selectedOptions)
                }
                placeholder="Select Category...."
                styles={{
                  control: (styles: any) => ({
                    ...styles,
                    width: "300px",
                    marginRight: "10px",
                    // width: "200px",
                  }),
                }}
              />
              <Button onClick={() => handleAssignCategory()} style={{ backgroundColor: "#000000" }}>
                Assign Categories
              </Button>
            </div>
          </Row>
        </CardHeader>
        <CardBody>
          <Table id="tech-companies-1" className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>No</th>
                <th>Name</th>
                <th>Category full Name</th>

                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {assignedCategryData?.map((category, index) => (
                <tr key={category._id}>
                  <td> {currentPage + index + 1}</td>
                  <td>{category.categoryName}</td>
                  <td>{category.fullCategoryName}</td>

                  <td>
                    {category?.isBlocked == false ? "Active" : "Block"}
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

  // function handleEdit(data: Category) {
  //   setEditCategory(data);
  //   toggleAddModal();
  // }

  function handleDelete(id: string) {
    console.log(`Delete button clicked for ID: ${id}`);
  }
};

export default CategoryList;
