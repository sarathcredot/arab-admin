import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useDropzone, FileWithPath } from "react-dropzone";
import { gql, useQuery, useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import {
  Row,
  Col,
  Card,
  CardBody,
  Container,
  CardHeader,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Table,
  ButtonToggle,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

import Breadcrumbs from "../../components/Common/Breadcrumb";

interface ProductForm {
  productName: string;
  description: string;
  shortDescription: string;
  price: string;
  mrp: string;
  sellingPrice: string;
  tags: string;
  image: FileWithPath[];
  stock: string;
  isBlocked: boolean;
  // showFirst: boolean;
  rating: string;
  skuId: string;
  material: string;
  size: string;
  color: string;
}
interface ProductData {
  _id: string;
  color: string;
  size: string;
  description: string;
  material: string;
  shortDescription: string;
  images: {
    fileURL: string;
  }[];
  mrp: number;
  productCode: string;
  productName: string;
  rating: number;
  sellingPrice: number;
  price: number;
  tags: string;
  stock: string;
  skuId: number;
  categoryNamePath: string;
  isBlocked: boolean;
}

interface AddProductProps {
  Edit?: boolean;
  editedProduct?: ProductData | undefined; // Add this line
  // ... other properties
}
const CREATE_PRODUCT = gql`
  mutation Mutation($input: ProductInput!, $images: [Upload]) {
    createProduct(input: $input, images: $images) {
      product {
        _id
      }
    }
  }
`;
const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($input: ProductUpdateInput!, $images: [Upload]) {
    updateProduct(input: $input, images: $images) {
      _id
    }
  }
`;
const AddProduct: React.FC<AddProductProps> = ({ Edit, editedProduct }) => {
  const {
    control,
    handleSubmit,
    setValue, // Add this line
    formState: { errors },
  } = useForm<ProductForm>({
    // Add validation rules
    criteriaMode: "all",
    shouldFocusError: true,
    mode: "onBlur",
  });
  interface Category {
    _id: string;
    categoryName: string;
    fullCategoryName: string;
  }

  interface ColorType {
    categoryIdPath: string;
    colorCode: string;
    colorName: string;
    isBlocked: boolean;
  }
  interface SizeType {
    categoryIdPath: string;
    isBlocked: string;
    size: string;
  }

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [colors, setColors] = useState([]);
  const [size, setSize] = useState([]);

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  const [categories, setCategoryData] = useState([]);

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

  const { loading: categoriesLoading, data: categoriesData } =
    useQuery(GET_LEAF_RECORDS);

  const {
    loading: colorsLoading,
    data: colorsData,
    refetch: refetchColors,
  } = useQuery(GET_ALL_COLORES, {
    variables: { input: { categoryId: selectedCategory?._id } },
    skip: !selectedCategory?._id, // Skip the query if categoryId is not available
  });
  const {
    loading: sizeLoading,
    data: sizeData,
    refetch: refetchSize,
  } = useQuery(GET_ALL_SIZE, {
    variables: { input: { categoryId: selectedCategory?._id } },
    skip: !selectedCategory?._id,
  });

  useEffect(() => {
    if (selectedCategory) {
      refetchSize({ input: { categoryId: selectedCategory._id } }).then(() => {
        setSize(sizeData?.getAllSizesWithCatgeoryId?.records);
      });
    }
  }, [selectedCategory, refetchSize, sizeData]);

  useEffect(() => {
    if (categoriesData) {
      setCategoryData(categoriesData?.getAllLeafRecords?.records);
    }
  }, [categoriesData]);

  useEffect(() => {
    if (selectedCategory) {
      refetchColors({ input: { categoryId: selectedCategory?._id } });
    }
  }, [selectedCategory, refetchColors]);

  useEffect(() => {
    if (colorsData) {
      setColors(colorsData?.getAllColorsWithCategoryId?.records);
    }
  }, [colorsData]);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
  };

  const toggleAddModal = () => {
    setShowAddModal(!showAddModal);
  };

  const [createProduct] = useMutation(CREATE_PRODUCT);
  const [updateProduct] = useMutation(UPDATE_PRODUCT);

  useEffect(() => {
    if (Edit && editedProduct) {
      // Set default values for each form field based on editedProduct
      setValue("productName", editedProduct.productName);
      setValue("description", editedProduct.description);
      setValue("shortDescription", editedProduct.shortDescription);
      // setValue("category",editedProduct.categoryNamePath);
      setValue("price", editedProduct.price.toString());
      setValue("mrp", editedProduct.mrp.toString());
      setValue("sellingPrice", editedProduct.sellingPrice.toString());
      setValue("tags", editedProduct.tags);
      setValue("stock", editedProduct.stock);
      setValue("skuId", editedProduct.skuId.toString());
      setValue("rating", editedProduct.rating.toString());
      setValue("isBlocked", editedProduct.isBlocked ? true : false);
      setValue("material", editedProduct.material);
      setValue("size", editedProduct.size);
      setValue("color", editedProduct.color);
    }
  }, [Edit, editedProduct, setValue]);

  const onSubmit: SubmitHandler<ProductForm> = async (data) => {
    try {
      // Add images to the FormData
      // if (data.image) {
      //   data.image.forEach((file) => formData.append("images", file));
      // }

      // Shared variables for mutation and input parameters
      const mutation = Edit ? updateProduct : createProduct;
      const inputParams = {
        categoryId: selectedCategory?._id
          ? selectedCategory._id.toString()
          : null,
        productName: data.productName,
        description: data.description,
        shortDescription: data.shortDescription || null,
        price: parseFloat(data.price),
        mrp: parseFloat(data.mrp),
        sellingPrice: parseFloat(data.sellingPrice),
        tags: data.tags,
        stock: parseInt(data.stock, 10),
        isBlocked: data.isBlocked,
        rating: parseInt(data.rating, 10),
        skuId: data.skuId,
        material: data.material,
        size: data.size,
        color: data.color,
      };

      if (selectedCategory?._id) {
        inputParams.categoryId = selectedCategory._id.toString();
      }

      if (colorsData && selectedCategory) {
        inputParams.color = data.color;
      }

      if (sizeData && selectedCategory) {
        inputParams.size = data.size;
      }

      // Check if it's an edit or add operation
      const response = await mutation({
        variables: {
          input: Edit
            ? { ...inputParams, _id: editedProduct?._id }
            : inputParams,
          images: acceptedFiles ? acceptedFiles : [],
        },
      });

      toast.success(`Product ${Edit ? "updated" : "added"} successfully!`);
    } catch (error:any) {
      if (error instanceof Error) {
        console.log(
          `Error ${Edit ? "updating" : "creating"} product:`,
          error.message
        );
        toast.error(error.message);
      } else {
        console.log(`Error ${Edit ? "updating" : "creating"} product:`, error);
        toast.error(error.message);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone();

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs
            title="product"
            breadcrumbItem={Edit ? "Edit Product" : "Add Product"}
            link="/product"
          />

          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <FormGroup>
                      <Label for="name">Name:</Label>
                      <Controller
                        control={control}
                        name="productName"
                        rules={{ required: "Name is required" }}
                        render={({ field }) => (
                          <>
                            <Input type="text" id="name" {...field} />
                            {errors.productName && (
                              <p className="text-danger">
                                {errors.productName.message}
                              </p>
                            )}
                          </>
                        )}
                      />
                    </FormGroup>

                    {editedProduct ? (
                      <>
                        <label>Category:</label>

                        <Input
                          type="text"
                          defaultValue={editedProduct.categoryNamePath}
                          disabled
                        />

                        <label>Size</label>

                        <Input
                          type="text"
                          defaultValue={editedProduct.size}
                          disabled
                        />

                        <label>Color</label>

                        <Input
                          type="text"
                          defaultValue={editedProduct.color}
                          disabled
                        />
                      </>
                    ) : (
                      <>
                        <FormGroup>
                          <label>Category:</label>
                          <Dropdown
                            isOpen={dropdownOpen}
                            toggle={toggleDropdown}
                          >
                            <DropdownToggle caret disabled={Edit}>
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
                                  {category.fullCategoryName}
                                </DropdownItem>
                              ))}
                            </DropdownMenu>
                          </Dropdown>
                        </FormGroup>

                        <FormGroup>
                          <Label for="color">Color:</Label>
                          {colorsLoading ? (
                            <p>Loading colors...</p>
                          ) : (
                            <>
                              {colorsData && selectedCategory ? (
                                <Controller
                                  control={control}
                                  name="color"
                                  rules={{ required: "Color is required" }}
                                  render={({ field }) => (
                                    <Input type="select" id="color" {...field}>
                                      <option value="">Select Color</option>
                                      {colors.map(
                                        (colorOption: ColorType, index) => (
                                          <option
                                            key={index}
                                            value={colorOption.colorName}
                                          >
                                            {colorOption.colorName}
                                          </option>
                                        )
                                      )}
                                    </Input>
                                  )}
                                />
                              ) : (
                                <Input
                                  type="select"
                                  name="color"
                                  id="color"
                                  disabled
                                >
                                  <option value="">
                                    Please select a category
                                  </option>
                                </Input>
                              )}
                            </>
                          )}
                        </FormGroup>

                        <FormGroup>
                          <Label for="size">Size:</Label>
                          {sizeLoading ? (
                            <p>Loading sizes...</p>
                          ) : (
                            <>
                              {sizeData && selectedCategory ? (
                                <Controller
                                  control={control}
                                  name="size"
                                  rules={{ required: "Size is required" }}
                                  render={({ field }) => (
                                    <Input type="select" id="size" {...field}>
                                      <option value="">Select Size</option>
                                      {size?.map(
                                        (sizeOption: SizeType, index) => (
                                          <option
                                            key={index}
                                            value={sizeOption.size}
                                          >
                                            {sizeOption.size}
                                          </option>
                                        )
                                      )}
                                    </Input>
                                  )}
                                />
                              ) : (
                                <Input
                                  type="select"
                                  name="size"
                                  id="size"
                                  disabled
                                >
                                  <option value="">
                                    Please select a category
                                  </option>
                                </Input>
                              )}
                            </>
                          )}
                        </FormGroup>
                    <FormGroup>
                      <Label for="shortDescription">Short Description:</Label>
                      <Controller
                        control={control}
                        name="shortDescription"
                        rules={{ required: "Short Description is required" }}
                        render={({ field }) => (
                          <>
                            <Input
                              type="textarea"
                              id="shortdescription"
                              {...field}
                            />
                            {errors.shortDescription && (
                              <p className="text-danger">
                                {errors.shortDescription.message}
                              </p>
                            )}
                          </>
                        )}
                      />
                    </FormGroup>
                      </>
                    )}

                    <FormGroup>
                      <Label for="description">Description:</Label>
                      <Controller
                        control={control}
                        name="description"
                        rules={{ required: "Description is required" }}
                        render={({ field }) => (
                          <>
                            <Input
                              type="textarea"
                              id="description"
                              {...field}
                            />
                            {errors.description && (
                              <p className="text-danger">
                                {errors.description.message}
                              </p>
                            )}
                          </>
                        )}
                      />
                    </FormGroup>

                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="price">Price:</Label>
                          <Controller
                            control={control}
                            name="price"
                            rules={{ required: "Price is required" }}
                         
                            render={({ field }) => (
                              <>
                                <Input type="number"  id="price" {...field} />
                                {errors.price && (
                                  <p className="text-danger">
                                    {errors.price.message}
                                  </p>
                                )}
                              </>
                            )}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="price">Selling Price:</Label>
                          <Controller
                            control={control}
                            name="sellingPrice"
                            rules={{ required: "sellingPrice is required" }}
                            render={({ field }) => (
                              <>
                                <Input
                                  type="number"
                                  id="price"
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                  value={field.value}
                                />
                                {errors.sellingPrice && (
                                  <p className="text-danger">
                                    {errors.sellingPrice.message}
                                  </p>
                                )}
                              </>
                            )}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="price">mrp:</Label>
                          <Controller
                            control={control}
                            name="mrp"
                            rules={{ required: "mrp is required" }}
                            render={({ field }) => (
                              <>
                                <Input   type="number" id="price" {...field} />
                                {errors.mrp && (
                                  <p className="text-danger">
                                    {errors.mrp.message}
                                  </p>
                                )}
                              </>
                            )}
                          />
                        </FormGroup>
                      </Col>

                      <Col md={6}>
                        <FormGroup>
                          <Label for="isBlocked">Status</Label>
                          <Controller
                            control={control}
                            name="isBlocked"
                            render={({ field }) => (
                              <Input
                                type="select"
                                id="isBlocked"
                                onChange={(e) =>
                                  field.onChange(e.target.value === "true")
                                }
                              >
                                <option value="">Select an option</option>
                                <option value="true">Block</option>
                                <option value="false">Activate</option>
                              </Input>
                            )}
                          />
                        </FormGroup>

                        {/* <FormGroup>
                          <Label for="showFirst">Show First:</Label>
                          <Controller
                            control={control}
                            name="showFirst"
                            render={({ field }) => (
                              <Input
                                type="checkbox"
                                checked={field.value}
                                onChange={() => field.onChange(!field.value)}
                              />
                            )}
                          />
                        </FormGroup> */}
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="stock">Stock:</Label>
                          <Controller
                            control={control}
                            name="stock"
                            rules={{ required: "Stock is required" }}
                            render={({ field }) => (
                              <>
                                <Input type="text" id="stock" {...field} />
                                {errors.stock && (
                                  <p className="text-danger">
                                    {errors.stock.message}
                                  </p>
                                )}
                              </>
                            )}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="tags">Tags:</Label>
                          <Controller
                            control={control}
                            name="tags"
                            render={({ field }) => (
                              <>
                                <Input type="text" id="tags" {...field} />
                                {errors.tags && (
                                  <p className="text-danger">
                                    {errors.tags.message}
                                  </p>
                                )}
                              </>
                            )}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="rating">Rating:</Label>
                          <Controller
                            control={control}
                            name="rating"
                            render={({ field }) => (
                              <>
                                <Input type="number" id="rating" {...field} />
                                {errors.rating && (
                                  <p className="text-danger">
                                    {errors.rating.message}
                                  </p>
                                )}
                              </>
                            )}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="skuid">SKU ID:</Label>
                          <Controller
                            control={control}
                            name="skuId"
                            render={({ field }) => (
                              <>
                                <Input type="text" id="skuid" {...field} />
                                {errors.skuId && (
                                  <p className="text-danger">
                                    {errors.skuId.message}
                                  </p>
                                )}
                              </>
                            )}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <FormGroup>
                      <Label for="material">Material:</Label>
                      <Controller
                        control={control}
                        name="material"
                        render={({ field }) => (
                          <>
                            <Input type="text" id="material" {...field} />
                            {errors.material && (
                              <p className="text-danger">
                                {errors.material.message}
                              </p>
                            )}
                          </>
                        )}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="image">Image:</Label>
                      <Controller
                        control={control}
                        name="image"
                        render={({ field }) => (
                          <>
                            <div {...getRootProps()} className="dropzone">
                              <input {...getInputProps()} />
                              {isDragActive ? (
                                <p>Drop the files here ...</p>
                              ) : (
                                <p>
                                  Drag 'n' drop some files here, or click to
                                  select files
                                </p>
                              )}
                            </div>
                            <ul>
                              {acceptedFiles.map((file, index) => (
                                <li key={index}>
                                  {file.name} - {file.size} bytes
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                      />
                    </FormGroup>
                    <Button
                      type="submit"
                      style={{
                        backgroundColor: "black",
                        color: "white",
                        width: "120px",
                        height: "40px",
                        borderRadius: "10px",
                      }}
                    >
                      {Edit ? "Edit Product" : "Add product "}
                    </Button>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <ToastContainer />
    </React.Fragment>
  );
};

export default AddProduct;
