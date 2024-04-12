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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Collapse,
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
import { toast } from "react-toastify";
import CustomButton from "src/components/Common/CustomButton";
import DynamicFilter from "src/components/filter/DynamicFilter";
import Loader from "src/components/Common/Loader";

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

  const [assignAttributeDatas, setAssignAttributeDatas] = useState([]);


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
   query GetAttributesDetailsWithCategoryByAdmin($input: AttributesDetailsWithCategoryIdInput!) {
  getAttributesDetailsWithCategoryByAdmin(input: $input) {
    record {
      _id
      categoryName
      attributes {
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
    message
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
    fetchPolicy: "network-only",
    variables: { input: { categoryId: selectedCategory } },
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
    if (categoriesData) {
      const initialCategory = categoriesData?.getAllLeafRecords?.records[0];
      if (initialCategory) {
        setSelectedCategory(initialCategory._id);
        setAssignAttributeDatas(
          assignAttributeData?.getAttributesDetailsWithCategoryByAdmin?.record.attributes
        );
      }
    }
  }, [categoriesData]);

  const fetchData = async () => {
    try {
      if (selectedCategory) {
        const result = await assignAttributeRefetch({
          input: { categoryId: selectedCategory },
        });
        setAssignAttributeDatas(
          result.data?.getAttributesDetailsWithCategoryByAdmin?.record.attributes
        );
      }
    } catch (error: any) {
      console.log(error)
    }
  }

  useEffect(() => {

    fetchData();

  }, [selectedCategory]);



  const handleCategorySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCategory(e.target.value);
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



  const [searchTerm, setSearchTerm] = useState<string>("");
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleAssignAttribute = async () => {

    if (setectedAttributes.length > 0) {
      const attributeIds = setectedAttributes.map(
        (attribute) => attribute.value
      );
      try {
        const response: any = await updateCategory({
          variables: {
            input: {
              _id: selectedCategory,
              attributes: attributeIds,
            },
          },
        });

        toast.success("Attribute added");
        setSelectedAttributes([]);
        fetchData();
        await attributesRefetch()
        toggle();
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

  const items = [
    { text: "Dashboard", link: `/` },
  ];


  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);


  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  const handleFilterSubmit = (formData: any) => {
    console.log(formData);
  };

  const filterOptions = [
    {
      label: 'Order ID',
      type: 'text',
      name: 'orderId',
    },
    {
      label: 'Start Date',
      type: 'date',
      name: 'startDate',
    },
    {
      label: 'End Date',
      type: 'date',
      name: 'endDate',
    },
    {
      label: 'Payment Mode',
      type: 'select',
      name: 'paymentMode',
      options: [
        { value: 'COD', label: 'COD' },
        { value: 'ONLINE', label: 'ONLINE' },
      ],
    },
    {
      label: 'User ID',
      type: 'text',
      name: 'userId',
    },
  ];




  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb items={items} currentPage="Assign-Attribute" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <div style={{ display: 'flex', alignItems: "center", justifyContent: "space-between" }}>
                    <Input
                      type="select"
                      value={selectedCategory}
                      onChange={handleCategorySelect}
                      style={{ width: "500px" }}
                    >
                      <option value="" disabled>Select Category</option>
                      {categories.map((category: Category) => (
                        <option key={category._id} value={category._id}>{category.fullCategoryName}</option>
                      ))}
                    </Input>
                    {/* <CustomButton onClick={toggleCollapse} name="Filters" icon="clarity:filter-solid" /> */}
                  </div>

                </CardHeader>
                <CardHeader>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    {/* <Input
                      type="text"
                      placeholder="Search by name"
                      value={searchTerm}
                      onChange={handleSearch}
                      style={{ width: "450px", }}
                    /> */}
                    <CustomButton name="Assign Attributes" icon="fluent:tab-add-20-filled" onClick={toggle} />
                  </div>
                </CardHeader>
                <CardBody>
                  {assignAttributeLoading
                    ?
                    <Loader />
                    :

                    <div className="table-rep-plugin">

                      <div className="table-responsive mb-0" data-pattern="priority-columns">


                        <Table id="tech-companies-1" className="table table-striped table-bordered">
                          <thead>
                            <tr>
                              <th style={{ width: "10%" }}>Sl.No</th>
                              <th style={{ width: "40%" }}>Attribute Type</th>
                              <th style={{ width: "40%" }}>Description</th>
                              <th style={{ width: "40%" }}>Name</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedCategory ? (
                              <>
                                {assignAttributeDatas?.map(
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
                      </div>
                    </div>
                  }
                </CardBody>
              </Card>

              <Modal isOpen={modal} toggle={toggle} >
                <ModalHeader toggle={toggle}>Assign Attributes</ModalHeader>
                <ModalBody>
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


                      }),
                    }}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onClick={handleAssignAttribute}>
                    Submit
                  </Button>{' '}
                  <Button color="secondary" onClick={toggle}>
                    Cancel
                  </Button>
                </ModalFooter>
              </Modal>

            </Col>
          </Row>
        </Container>
      </div >
    </>
  );
}

export default Assignattribute;
