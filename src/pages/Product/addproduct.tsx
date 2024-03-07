import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useDropzone, FileWithPath } from "react-dropzone";
import { gql, useQuery, useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import styles from "./kyc.module.css";
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
import FileUpload from "react-drag-n-drop-image";
import { Icon } from "@ailibs/feather-react-ts";
import { Link, useNavigate } from "react-router-dom";

interface ProductInfoInput {
  [key: string]: string;
}
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
  offerPrice: number;
  productCode: number;
  productInfo: string[];
  productShortInfo: string;
  brandName: string;
  categoryNamePath: string;
  _id: string;
  media: any;
  images: any
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
  brandName: string;
}

interface AddProductProps {
  Edit?: boolean;
  editedProduct?: any | undefined; // Add this line
  // ... other properties
}
const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: ProductInput!, $images: [Upload]) {
    createProduct(input: $input, images: $images) {
      message
    }
  }
`;
const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($input: ProductUpdateInput!, $images: [Upload]) {
    updateProduct(input: $input, images: $images) {
      _id
      message
    }
  }
`;
const GET_CATEGORY = gql`
  query GetAllCategoriesOfVendor($input: vendorIdInput!) {
    getAllCategoriesOfVendor(input: $input) {
      records {
        _id
        categoryName
        fullCategoryName
        isBlocked
        isLeaf
      }
    }
  }
`;
const GET_BRAND = gql`
  query GetAllBrandRecordsWithVendorByVendor(
    $input: getAllBrandRecordsWithVendorByVendorInput!
  ) {
    getAllBrandRecordsWithVendorByVendor(input: $input) {
      maxRecords
      message
      records {
        _id
        brandName
        isBlocked
        logo {
          fileType
          fileURL
          originalName
        }
        isPopular
        priority
      }
    }
  }
`;

const AddProduct: React.FC<AddProductProps> = ({ Edit, editedProduct }) => {
  document.title = "Product | Arab Deals ";
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset, // Add this line
    formState: { errors },
  } = useForm<ProductForm>({
    // Add validation rules
    criteriaMode: "all",
    shouldFocusError: true,
    mode: "onBlur",
  });
  interface IAttribute {
    _id: string;
  }
  console.log(Edit);
  console.log(editedProduct);

  const navigate = useNavigate();
  const [createproduct] = useMutation(CREATE_PRODUCT);
  const [updateproduct] = useMutation(UPDATE_PRODUCT);
  const [categoryData, setCategoryData] = useState<any>([]);
  const [brandData, setBrandData] = useState<any>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [productInfo, setProductInfo] = useState<string[]>();
  const [remarks, setRemarks] = useState<any>([""]);
  const [attributeid, setattributeid] = useState<IAttribute[] | []>([]);
  const [selectedbrand, setselectedbrand] = useState<any>({});
  const [fileError, setFileError] = useState<string | null>(null);

  // get attributeid values
  const handleAttributesSelectChange = (selectedValues: IAttribute[]) => {
    console.log("Selected Values:", selectedValues);
    setattributeid(selectedValues);
    // You can do further processing with the selected values here
  };
  const handleAddRemark = () => {
    setRemarks([...remarks, ""]);
  };

  const handleRemoveRemark = (index: any) => {
    const updatedRemarks = [...remarks];
    updatedRemarks.splice(index, 1); // Remove the remark at the specified index
    setRemarks(updatedRemarks);
  };
  console.log(categoryData);
  console.log("select", selectedCategory);

  const id = localStorage?.getItem("vendorid");
  const {
    loading: categoryLoading,
    error: categoryError,
    data: categoryDataResponse,
    refetch: categoryRefetch,
  } = useQuery(GET_CATEGORY, {
    variables: {
      input: {
        vendorId: id,
      },
    },
  });

  const {
    loading: brandLoading,
    error: brandError,
    data: brandDataResponse,
    refetch: brandRefetch,
  } = useQuery(GET_BRAND, {
    variables: {
      input: {
        vendorId: id,
        page: null,
        size: 10,
      },
    },
  });

  useEffect(() => {
    if (editedProduct) {
      setValue("productName", editedProduct?.productName || "");

      setValue("description", editedProduct?.description || "");
      setValue("sellingPrice", editedProduct?.sellingPrice);
      setValue("price", editedProduct?.price || "");
      setValue("rating", editedProduct?.rating);
      setValue("offerPrice", editedProduct?.offerPrice);
      setValue("productCode", editedProduct?.productCode);
      setValue("mrp", editedProduct?.mrp);
      setValue("productShortInfo", editedProduct?.productShortInfo || "");
      setValue("shortDescription", editedProduct?.shortDescription || "");
      setValue("skuId", editedProduct?.skuId || "");
      setValue("stock", editedProduct?.stock);
      setValue("tags", editedProduct?.tags);
      setValue("brandName", editedProduct?.brandName || "");
      setValue("categoryNamePath", editedProduct?.categoryNamePath || "");
      setValue("media", editedProduct?.images);
      setRemarks(editedProduct ? editedProduct?.productInfo : [""]);
      setValue("images", editedProduct?.images)
    }
  }, [editedProduct]);
  useEffect(() => {
    setCategoryData(
      categoryDataResponse?.getAllCategoriesOfVendor?.records || []
    );
    setBrandData(
      brandDataResponse?.getAllBrandRecordsWithVendorByVendor?.records
    );
  }, [categoryDataResponse, brandDataResponse]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  // const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  const getSelectedCategoryData = () => {
    // Find the selected category in categoryData based on _id
    if (editedProduct) {
      const selectedCategoryData = editedProduct?.categoryId;
      console.log(selectedCategoryData);

      return selectedCategoryData;
    } else {
      const selectedCategoryData = categoryData.find(
        (category: any) => category._id === selectedCategory
      );
      return selectedCategoryData?._id;
    }
  };


  const fieldRules = {
    productName: {
      required: "Name is required",
    },
    description: {
      required: "Description is required",
    },
    shortDescription: {
      required: "ShortDescription is required",
    },
    mrp: {
      required: "Mrp is required",
    },
    sellingPrice: {
      required: "SellingPrice is required",
    },
    tags: {
      required: "mrp is required",
    },
    media: {
      required: "media required"
    },
    material: {
      required: "material required"
    },
    offerPrice: {
      required: "offerPrice required"
    },
    productCode: {
      required: "productCode required"
    },
    productInfo: {
      required: "This field is required.",
    },
    productShortInfo: {
      required: "This field is required.",
    },
    price: {
      required: "This field is required.",
    },
    stock: {
      required: "This field is required.",
    },
    brand: {
      required: "Brand is required",
    },
    rating: {
      required: "Rating is required",
      pattern: {
        value: /^[0-4](\.\d{1,2})?$/, // Adjust the pattern as needed
        message: "Invalid rating. Please enter a valid value less than 5.",
      },
    },
    images: {
      required: "Please select at least one image",
    },
  }


  const onSubmit: SubmitHandler<ProductForm> = async (data: any) => {
    console.log("clickk");

    data.attribute = attributeid;
    console.log("data", data);

    const formdatas = {
      _id: editedProduct?._id,
      isBlocked: editedProduct ? editedProduct?.isBlocked : data?.isBlocked,
      brandId: selectedbrand?.id,
      brandName: selectedbrand?.name,
      categoryId: Edit ? editedProduct?.categoryId : selectedCategory,
      description: data?.description,
      offerPrice: parseInt(data?.offerPrice),
      vendorId: id,
      material: data?.material,
      mrp: parseInt(data?.mrp),
      price: parseInt(data?.price),
      productCode: parseInt(data?.productCode),
      productInfo: remarks && remarks?.length > 0 ? remarks : [""],
      productName: data?.productName,
      productShortInfo: data?.productShortInfo,
      rating: parseInt(data?.rating),
      sellingPrice: parseInt(data?.sellingPrice),
      shortDescription: data?.shortDescription,
      skuId: data?.skuId,
      stock: parseInt(data?.stock),
      tags: editedProduct ? (editedProduct?.tags).join(" ") : data?.tags,
      attributes: attributeid,
    };
    console.log("formdatas", formdatas);

    const file = data?.images?.map((image: any) => image.file);

    // if (data && data?.images?.length < 0) {
    //   console.log("errorclick");

    //   setFileError("Please select at least one file.");
    // }
    //  else {
    try {
      if (Edit) {
        formdatas.tags = (data?.tags).join(" ");
        console.log("click");
        // formdatas._id=editedProduct?._id,

        const response = await updateproduct({
          variables: { input: { ...formdatas }, images: file },
        });
        console.log(response);
        if (response) {
          toast.success(response?.data?.createProduct?.message);
          navigate("/product");
        }
      } else {
        const response = await createproduct({
          variables: { input: { ...formdatas }, images: file },
        });
        console.log(response);
        if (response) {
          toast.success(response?.data?.createProduct?.message);
          navigate("/product");
        }
      }
    } catch (error: any) {
      console.log(error);
    }
    // }
  };


  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          {/* <Breadcrumb
            title="product"
            breadcrumbItem={Edit ? "Edit Product" : "Add Product"}
            link="/product"
          /> */}

          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <Form
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <FormGroup>
                      <Label for="name">Name:</Label>
                      <Controller
                        control={control}
                        name="productName"
                        // rules={{ required: "Name is required" }}
                        render={({ field: { value, onChange } }) => (
                          <>
                            <Input
                              type="text"
                              value={value}
                              onChange={onChange}
                              // {...field}
                              className={styles.inputfield}
                            />

                          </>
                        )}
                        rules={fieldRules.productName}
                      />
                      {errors?.productName ? (
                        <div className={styles.errmsg}>
                          {errors?.productName?.message}
                        </div>
                      ) : null}
                    </FormGroup>
                    <FormGroup>
                      <label>Category:</label>
                      <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                        <DropdownToggle caret disabled={Edit}>
                          {editedProduct && editedProduct?.categoryNamePath}
                          {selectedCategory
                            ? categoryData.find(
                              (category: any) =>
                                category._id === getSelectedCategoryData()
                            )?.fullCategoryName
                            : "Select Category"}
                          <FontAwesomeIcon
                            icon={faAngleDown}
                            style={{ marginRight: "5px" }}
                          />
                        </DropdownToggle>
                        <DropdownMenu>
                          {categoryData?.map((category: any) => (
                            <DropdownItem
                              key={category._id}
                              onClick={() => setSelectedCategory(category._id)}
                            >
                              {category.fullCategoryName}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </Dropdown>
                    </FormGroup>
                    {/* <Catattributes
                      selectedCategoryData={getSelectedCategoryData()}
                      onSelectChange={handleAttributesSelectChange}
                      editedProduct={editedProduct}
                    /> */}

                    <FormGroup>
                      <Label for="name">Brand:</Label>
                      <Controller
                        control={control}
                        name="brandName"
                        render={({ field: { value, onChange } }) => (
                          <>
                            <Input
                              type="select"
                              value={value}
                              onChange={(event: any) => {
                                const selectedBrand = brandData.find(
                                  (brand: any) =>
                                    brand.brandName === event.target.value
                                );

                                // Check if a brand is found before updating the state
                                if (selectedBrand) {
                                  setselectedbrand({
                                    name: selectedBrand.brandName,
                                    id: selectedBrand._id,
                                  });
                                }
                                onChange(event);
                              }}
                              defaultValue={editedProduct?.brandName || "Select"}
                            >
                              <option value="">Select</option>
                              {brandData?.map((brand: any, index: number) => {
                                return (
                                  <option key={index} value={brand?.brandName}>
                                    {brand?.brandName}
                                  </option>
                                );
                              })}
                            </Input>
                          </>
                        )}
                        rules={fieldRules.brand}
                      />
                      {errors?.brandName && (
                        <div className={styles.errmsg}>{errors?.brandName?.message}</div>
                      )}
                    </FormGroup>
                    <FormGroup>
                      <Label for="description">Description:</Label>
                      <Controller
                        control={control}
                        name="description"
                        // rules={{ required: "Description is required" }}
                        render={({ field: { value, onChange } }) => (
                          <>
                            <Input
                              type="textarea"
                              value={value}
                              onChange={onChange}
                              className={styles.inputfield}
                            // {...field}
                            />

                          </>
                        )}
                        rules={fieldRules.description}
                      />
                      {errors?.description ? (
                        <div className={styles.errmsg}>
                          {errors?.description?.message}
                        </div>
                      ) : null}
                    </FormGroup>

                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="productShortInfo">
                            Product ShortInfo:
                          </Label>
                          <Controller
                            control={control}
                            name="productShortInfo"
                            // rules={{
                            //   required: "Product ShortInfo is required",
                            // }}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <Input
                                  type="text"
                                  value={value}
                                  onChange={onChange}
                                  // {...field}
                                  className={styles.inputfield}
                                />

                              </>
                            )}
                            rules={fieldRules.productShortInfo}
                          />
                          {errors?.productShortInfo ? (
                            <div className={styles.errmsg}>
                              {errors?.productShortInfo?.message}
                            </div>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="shortDescription">
                            Product Short Description:
                          </Label>
                          <Controller
                            control={control}
                            name="shortDescription"
                            // rules={{
                            //   required: "Short Description is required",
                            // }}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <Input
                                  type="text"
                                  value={value}
                                  onChange={onChange}

                                  className={styles.inputfield}
                                />

                              </>
                            )}
                            rules={fieldRules.productName}
                          />
                          {errors?.shortDescription ? (
                            <div className={styles.errmsg}>
                              {errors?.shortDescription?.message}
                            </div>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="price">Product Code:</Label>
                          <Controller
                            control={control}
                            name="productCode"

                            render={({ field: { value, onChange } }) => (
                              <>
                                <Input
                                  type="number"
                                  value={value}
                                  onChange={onChange}

                                  className={styles.inputfield}
                                />

                              </>
                            )}
                            rules={fieldRules.productCode}
                          />
                          {errors?.productCode ? (
                            <div className={styles.errmsg}>
                              {errors?.productCode?.message}
                            </div>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="price">Price:</Label>
                          <Controller
                            control={control}
                            name="price"
                            // rules={{ required: "Price is required" }}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <Input
                                  type="number"

                                  value={value}
                                  onChange={onChange}
                                  className={styles.inputfield}
                                />

                              </>
                            )}
                            rules={fieldRules.price}
                          />
                          {errors?.price ? (
                            <div className={styles.errmsg}>
                              {errors?.price?.message}
                            </div>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="sellingPrice">Selling Price:</Label>
                          <Controller
                            control={control}
                            name="sellingPrice"
                            render=
                            {({ field: { value, onChange } }) => (
                              <>
                                <Input
                                  type="number"
                                  value={value}
                                  onChange={onChange}

                                  className={styles.inputfield}

                                />

                              </>
                            )}
                            rules={fieldRules.sellingPrice}
                          />
                          {errors?.sellingPrice ? (
                            <div className={styles.errmsg}>
                              {errors?.sellingPrice?.message}
                            </div>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="mrp">mrp:</Label>
                          <Controller
                            control={control}
                            name="mrp"

                            render={({ field: { value, onChange } }) => (
                              <>
                                <Input
                                  type="number"
                                  value={value}
                                  onChange={onChange}

                                  className={styles.inputfield}
                                />

                              </>
                            )}
                            rules={fieldRules.mrp}
                          />
                          {errors?.mrp ? (
                            <div className={styles.errmsg}>
                              {errors?.mrp?.message}
                            </div>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="offerPrice">Offer Price:</Label>
                          <Controller
                            control={control}
                            name="offerPrice"

                            render={({ field: { value, onChange } }) => (
                              <>
                                <Input
                                  type="number"

                                  className={styles.inputfield}
                                  value={value}
                                  onChange={onChange}
                                />

                              </>
                            )}
                            rules={fieldRules.offerPrice}
                          />
                          {errors?.offerPrice ? (
                            <div className={styles.errmsg}>
                              {errors?.offerPrice?.message}
                            </div>
                          ) : null}
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
                                className={styles.inputfield}
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
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="stock">Stock:</Label>
                          <Controller
                            control={control}
                            name="stock"

                            render={({ field: { value, onChange } }) => (
                              <>
                                <Input
                                  type="text"
                                  value={value}
                                  onChange={onChange}
                                  className={styles.inputfield}
                                />

                              </>
                            )}
                            rules={fieldRules.stock}
                          />
                          {errors?.stock ? (
                            <div className={styles.errmsg}>
                              {errors?.stock?.message}
                            </div>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="tags">Tags:</Label>
                          <Controller
                            control={control}
                            name="tags"
                            rules={{ required: "Tags is required" }}
                            render={({ field }) => (
                              <>
                                <Input
                                  type="text"
                                  id="tags"
                                  {...field}
                                  className={styles.inputfield}
                                />
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

                            render={({ field: { value, onChange } }) => (
                              <>
                                <Input
                                  type="number"

                                  value={value}
                                  onChange={onChange}
                                  className={styles.inputfield}
                                />

                              </>
                            )}
                            rules={fieldRules.rating}
                          />
                          {errors?.rating ? (
                            <div className={styles.errmsg}>
                              {errors?.rating?.message}
                            </div>
                          ) : null}
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
                                <Input
                                  type="text"
                                  id="skuid"
                                  {...field}
                                  className={styles.inputfield}
                                />
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
                      <FormGroup>
                        <Label for="productInfo">Product Info:</Label>

                        {remarks?.map((remark: any, index: any) => (
                          <FormGroup
                            key={index}
                            style={{ marginBottom: "10px" }}
                          >
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <Input
                                type="text"
                                id={`remark-${index}`}
                                name={`remark-${index}`}
                                value={remark}
                                onChange={(e) => {
                                  const updatedRemarks = [...remarks];
                                  updatedRemarks[index] = e.target.value;
                                  setRemarks(updatedRemarks);
                                }}
                                required
                                style={{ marginRight: "10px" }}
                              />
                              {index === remarks.length - 1 && (
                                <Button
                                  color="primary"
                                  onClick={handleAddRemark}
                                >
                                  + {/* Plus icon */}
                                </Button>
                              )}{" "}
                              {index !== 0 && (
                                <Button
                                  style={{
                                    marginLeft: "5px",
                                    marginRight: "5px",
                                  }}
                                  color="danger"
                                  onClick={() => handleRemoveRemark(index)}
                                >
                                  - {/* Minus icon */}
                                </Button>
                              )}
                            </div>
                          </FormGroup>
                        ))}
                      </FormGroup>
                    </Row>
                    <FormGroup>
                      <Label for="material">Material:</Label>
                      <Controller
                        control={control}
                        name="material"

                        render={({ field: { value, onChange } }) => (
                          <>
                            <Input
                              type="text"
                              value={value}
                              onChange={onChange}

                              className={styles.inputfield}
                            />

                          </>
                        )}
                        rules={fieldRules.material}
                      />
                      {errors?.material ? (
                        <div className={styles.errmsg}>
                          {errors?.material?.message}
                        </div>
                      ) : null}
                    </FormGroup>

                    <Card>
                      <CardHeader>
                        <label>Media</label>
                      </CardHeader>
                      <CardBody>
                        <Controller
                          control={control}
                          name="images"
                          render={({ field }) => (
                            <>
                              <MediaUpload
                                setValue={setValue}
                                watch={watch}
                                control={control}
                                editedProduct={editedProduct}
                              />
                            </>
                          )}
                          rules={fieldRules.images}
                        />
                        {errors?.images && (
                          <div className={styles.errmsg}>{String(errors?.images?.message)}</div>
                        )}

                      </CardBody>
                    </Card>

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
                      {Edit ? "Edit Product" : "Add product"}
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

function CustomBody() {
  return <div>Select / Drag and drop Photos</div>;
}

const MediaUpload: React.FC<any> = ({
  setValue,
  watch,
  control,
  editedProduct,
}) => {
  const [files, setFiles] = useState([]);
  const images = watch("images", []);
  const media = watch("media", []);
  console.log(editedProduct);
  console.log(media);

  const onChange = (file: any) => {
    console.log(file);
    setValue("images", file);
    setFiles(file);
  };
  console.log(files);

  useEffect(() => {
    setFiles(images || []);
  }, []);

  const onRemoveImage = (id: any) => {
    setFiles((prev) => prev.filter((i: any) => i.id !== id));
  };
  const onError = (error: any) => {
    console.error(error);
  };
  const removePrev = (n: any) => {
    setValue("media", media.slice(0, n).concat(media.slice(n + 1)));
  };
  return (
    <div>
      <FileUpload
        className="drop-section"
        onError={onError}
        body={<CustomBody />}
        overlap={false}
        fileValue={files}
        onChange={onChange}
      />
      <div className="upload-image-box">
        {media?.map((item: any, index: any) => {
          return (
            <div
              aria-hidden
              style={{
                width: 80,
                height: 80,
                marginRight: 10,
                position: "relative",
                flexWrap: "wrap",
              }}
              key={item.id}
            >
              <img
                style={{ width: 80, height: 80 }}
                src={item.url || item.preview || item?.fileURL}
                alt="images"
              />
              <div
                style={{
                  position: "absolute",
                  top: 3,
                  right: 5,
                  cursor: "pointer",
                }}
                onClick={() => removePrev(index)}
              >
                <Icon name="x" size={15} />
              </div>
            </div>
          );
        })}
        {files?.map((item: any) => {
          return (
            <div
              aria-hidden
              style={{
                width: 80,
                height: 80,
                marginRight: 10,
                position: "relative",
                flexWrap: "wrap",
              }}
              key={item.id}
            >
              <img
                style={{ width: 80, height: 80 }}
                src={item.preview}
                alt="images"
              />
              <div
                style={{
                  position: "absolute",
                  top: 3,
                  right: 5,
                  cursor: "pointer",
                }}
                onClick={() => onRemoveImage(item.id)}
              >
                <Icon name="x" size={15} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
