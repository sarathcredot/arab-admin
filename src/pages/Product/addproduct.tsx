import React, { useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FileWithPath } from "react-dropzone";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormGroup,
  Input,
  Label,
  Row
} from "reactstrap";
import styles from "./kyc.module.css";

import { Icon } from "@ailibs/feather-react-ts";
// import FileUpload from "react-drag-n-drop-image";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/Common/Breadcrumb";

import ImageUploading, { ImageListType } from "react-images-uploading";
import CustomButton from "src/components/Common/CustomButton";
import Iconify from "src/components/iconify";

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
  rating: string;
  skuId: string;
  warehouseSkuId: string;
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
  status: string;
}


interface AddProductProps {
  Edit?: boolean;
  editedProduct?: any | undefined;
}

const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: ProductInput!, $images: [Upload]) {
    createProduct(input: $input, images: $images) {
      message
    }
  }
`;
const UPDATE_PRODUCT = gql`
  mutation UpdateProductByAdmin($input: UpdateProductByAdminInput!, $images: [Upload], $productDetailImages: [Upload]) {
  updateProductByAdmin(input: $input, images: $images, productDetailImages: $productDetailImages) {
    _id
    message
  }
}
`;


const AddProduct: React.FC<AddProductProps> = ({ Edit, editedProduct }) => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductForm>({
    criteriaMode: "all",
    shouldFocusError: true,
    mode: "onBlur",
  });
  interface IAttribute {
    _id: string;
  }

  const navigate = useNavigate();
  const [createproduct] = useMutation(CREATE_PRODUCT);
  const [updateproduct] = useMutation(UPDATE_PRODUCT);
  const [categoryData, setCategoryData] = useState<any>([]);
  const [brandData, setBrandData] = useState<any>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [remarks, setRemarks] = useState<any>([""]);
  const [attributeid, setattributeid] = useState<IAttribute[] | []>([]);
  const [selectedbrand, setselectedbrand] = useState<any>({});


  const handleAddRemark = () => {
    setRemarks([...remarks, ""]);
  };

  const handleRemoveRemark = (index: any) => {
    const updatedRemarks = [...remarks];
    updatedRemarks.splice(index, 1);
    setRemarks(updatedRemarks);
  };

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
      setValue("images", editedProduct?.images);
      setValue("isBlocked", editedProduct?.isBlocked)
      setValue("warehouseSkuId", editedProduct?.warehouseSkuId)
      setValue("status", editedProduct?.status)
    }
  }, [editedProduct]);


  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  const getSelectedCategoryData = () => {
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

    const formdatas = {
      _id: editedProduct?._id,
      isBlocked: data.isBlocked,
      brandId: selectedbrand?.id,
      brandName: selectedbrand?.name,
      categoryId: Edit ? editedProduct?.categoryId : selectedCategory,
      description: data?.description,
      mrp: parseInt(data?.mrp),
      price: parseInt(data?.price),
      productInfo: remarks && remarks?.length > 0 ? remarks : [""],
      productName: data?.productName,
      productShortInfo: data?.productShortInfo,
      // rating: parseInt(data?.rating),
      sellingPrice: parseInt(data?.sellingPrice),
      shortDescription: data?.shortDescription,
      skuId: data?.skuId,
      stock: parseInt(data?.stock),
      warehouseSkuId: data?.warehouseSkuId,
      status: data?.status
    };
    try {
      if (Edit) {
        try {
          const response = await updateproduct({
            variables: { input: { ...formdatas }, images: selectedImages },
          });
          if (response) {
            toast.success(response?.data?.createProduct?.message);
            navigate("/product");
          }
        } catch (error: any) {
          toast.error(error.message);
        }
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const items = [
    { text: "Dashboard", link: `/` },
    { text: "Prodducts", link: `/product` },
    { text: "Variants", link: `/product/variant?productCode=${editedProduct?.productCode}` },
  ];


  const [images, setImages] = useState([]);
  const [selectedImages, setselectedImages] = useState([]);

  const onImageChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    setImages(imageList as never[]);
    const transformedList = imageList.map(item => item.file);
    setselectedImages(transformedList as never[]);
  };


  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb items={items} currentPage="Edit Product" />
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
                        render={({ field: { value, onChange } }) => (
                          <>
                            <Input
                              type="text"
                              value={value}
                              onChange={onChange}

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
                    </Row>

                    <FormGroup>
                      <Label for="description">Description:</Label>
                      <Controller
                        control={control}
                        name="description"
                        render={({ field: { value, onChange } }) => (
                          <>
                            <Input
                              style={{ minHeight: "100px" }}
                              type="textarea"
                              value={value}
                              onChange={onChange}
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

                      <Col md={4}>
                        <FormGroup>
                          <Label for="mrp">MRP :</Label>
                          <Controller
                            control={control}
                            name="mrp"

                            render={({ field: { value, onChange } }) => (
                              <>
                                <Input
                                  type="number"
                                  value={value}
                                  onChange={onChange}


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

                      <Col md={4}>
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
                      <Col md={4}>
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
                          <Label for="status">Status :</Label>
                          <Controller
                            control={control}
                            name="status"
                            render={({ field: { value, onChange } }) => (
                              <Input
                                type="select"
                                id="status"
                                value={value}
                                onChange={(e) =>
                                  onChange(e.target.value)
                                }
                              >
                                <option value="">Select an option</option>
                                <option value="PENDING">PENDING</option>
                                <option value="UNDER_VERIFICATION">UNDER VERIFICATION</option>
                                <option value="APPROVED">APPROVED</option>
                                <option value="REJECTED">REJECTED</option>
                              </Input>
                            )}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="isBlocked">Blocking Status :</Label>
                          <Controller
                            control={control}
                            name="isBlocked"
                            render={({ field: { value, onChange } }) => (
                              <Input
                                type="select"
                                id="isBlocked"
                                value={value == true ? "true" : "false"}
                                onChange={(e) =>
                                  onChange(e.target.value === "true")
                                }
                              >
                                <option value="">Select an option</option>
                                <option value="true">Blocked</option>
                                <option value="false">Active</option>
                              </Input>
                            )}
                          />
                        </FormGroup>
                      </Col>
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
                          <Label for="warehouseSkuId">Warehouse SKU ID:</Label>
                          <Controller
                            control={control}
                            name="warehouseSkuId"
                            render={({ field }) => (
                              <>
                                <Input
                                  type="text"
                                  id="warehouseSkuId"
                                  {...field}

                                />
                                {errors.warehouseSkuId && (
                                  <p className="text-danger">
                                    {errors.warehouseSkuId.message}
                                  </p>
                                )}
                              </>
                            )}
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      {/* <Col md={6}>
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
                      </Col> */}

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
                                  +
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
                                  -
                                </Button>
                              )}
                            </div>
                          </FormGroup>
                        ))}
                      </FormGroup>
                    </Row>

                    <div style={{ padding: "0px 0px 0 0px" }}>
                      <label>Images :</label>
                      <ImageUploading
                        multiple
                        value={images}
                        onChange={onImageChange}
                        maxNumber={7}
                      >
                        {({
                          imageList,
                          onImageUpload,
                          onImageRemoveAll,
                          onImageUpdate,
                          onImageRemove,
                          isDragging,
                          dragProps,
                        }) => (
                          // write your building UI
                          <div className="upload__image-wrapper" style={{ display: "flex", flexDirection: "column", gap: "10px" }} >
                            <div
                              style={{ color: isDragging ? "red" : undefined, width: "100%", height: "100px", border: "1px dashed black", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}
                              onClick={onImageUpload}
                              {...dragProps} >
                              Click or Drop here
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              {
                                imageList.length ? <label>Selected Images :</label> : ""
                              }
                              {
                                imageList.length ?
                                  <CustomButton onClick={onImageRemoveAll} name="Remove all images" icon="mdi:remove" /> : ""
                              }
                            </div>
                            <div style={{ display: 'flex', flexWrap: "wrap", gap: "20px" }}>
                              {imageList.map((image, index) => (
                                <div key={index} className="image-item">
                                  <div style={{ position: 'relative' }}>
                                    <img src={image.dataURL} alt="" style={{ width: "200px" }} />
                                    <div className="image-item__btn-wrapper">
                                      <Button onClick={() => onImageRemove(index)} style={{ position: 'absolute', top: 0, right: 0, margin: "4px", padding: "4px" }}><Iconify icon="mdi:close" /></Button>
                                      <Button onClick={() => onImageUpdate(index)} style={{ position: 'absolute', top: 0, left: 0, margin: "4px", padding: "4px" }}><Iconify icon="ic:baseline-edit" /></Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                          </div>
                        )}
                      </ImageUploading>

                    </div>

                    <Button
                      type="submit"
                      style={{
                        marginTop: "20px",
                        backgroundColor: "black",
                        color: "white",
                        width: "120px",
                        height: "40px",
                        borderRadius: "10px",
                      }}
                    >
                      Submit
                    </Button>
                  </Form>
                </CardBody>
              </Card>
            </Col >
          </Row >
        </Container >
      </div >
    </React.Fragment >
  );
};

export default AddProduct;

function CustomBody() {
  return <div>Select / Drag and drop Photos</div>;
}

// const MediaUpload: React.FC<any> = ({
//   setValue,
//   watch,
//   control,
//   editedProduct,
// }) => {
//   const [files, setFiles] = useState([]);
//   const images = watch("images", []);
//   const media = watch("media", []);

//   const onChange = (file: any) => {
//     console.log(file);
//     setValue("images", file);
//     setFiles(file);
//   };
//   console.log(files);

//   useEffect(() => {
//     setFiles(images || []);
//   }, []);

//   const onRemoveImage = (id: any) => {
//     setFiles((prev) => prev.filter((i: any) => i.id !== id));
//   };
//   const onError = (error: any) => {
//     console.error(error);
//   };
//   const removePrev = (n: any) => {
//     setValue("media", media.slice(0, n).concat(media.slice(n + 1)));
//   };
//   return (
//     <div>
//       <FileUpload
//         className="drop-section"
//         onError={onError}
//         body={<CustomBody />}
//         overlap={false}
//         fileValue={files}
//         onChange={onChange}
//       />
//       <div className="upload-image-box">
//         {media?.map((item: any, index: any) => {
//           return (
//             <div
//               aria-hidden
//               style={{
//                 width: 80,
//                 height: 80,
//                 marginRight: 10,
//                 position: "relative",
//                 flexWrap: "wrap",
//               }}
//               key={item.id}
//             >
//               <img
//                 style={{ width: 80, height: 80 }}
//                 src={item.url || item.preview || item?.fileURL}
//                 alt="images"
//               />
//               <div
//                 style={{
//                   position: "absolute",
//                   top: 3,
//                   right: 5,
//                   cursor: "pointer",
//                 }}
//                 onClick={() => removePrev(index)}
//               >
//                 <Icon name="x" size={15} />
//               </div>
//             </div>
//           );
//         })}
//         {files?.map((item: any) => {
//           return (
//             <div
//               aria-hidden
//               style={{
//                 width: 80,
//                 height: 80,
//                 marginRight: 10,
//                 position: "relative",
//                 flexWrap: "wrap",
//               }}
//               key={item.id}
//             >
//               <img
//                 style={{ width: 80, height: 80 }}
//                 src={item.preview}
//                 alt="images"
//               />
//               <div
//                 style={{
//                   position: "absolute",
//                   top: 3,
//                   right: 5,
//                   cursor: "pointer",
//                 }}
//                 onClick={() => onRemoveImage(item.id)}
//               >
//                 <Icon name="x" size={15} />
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };
