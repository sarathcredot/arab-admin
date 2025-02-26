import React, { useState } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { categoryValidation } from "src/validation/validation";
import { useMutation, gql, useQuery } from "@apollo/client";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { isLeafType } from "graphql";

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
  isLeaf?: boolean;
  // sizeChart: sizeChart;
  returnPolicy:string;
  warrantyPolicy:string;
  isBlocked: boolean;
}

interface Props {
  isOpen: boolean;
  toggle: () => void;
  isSelected?: Category | null | undefined;
  isEdit?: Category | null | undefined;
  refetch: () => void;
  isLeaf: boolean | undefined;
  childrefetch: () => void;
}

const GET_ALL_RETURN_POLICIES = gql`
  query GetAllPoliciesBySuperAdmin($input: getAllPoliciesBySuperAdminInput) {
  getAllPoliciesBySuperAdmin(input: $input) {
    success
    data {
      _id
      name
    }
  }
}
`;
const GET_ALL_WARRANTY_POLICIES = gql`
  query GetAllWarrantyPoliciesBySuperAdmin($input: getAllWarrantyPoliciesBySuperAdminInput) {
  getAllWarrantyPoliciesBySuperAdmin(input: $input) {
    data {
      _id
      name
    }
  }
}
`;

const CategoryForm: React.FC<Props> = ({
  isOpen,
  toggle,
  isSelected,
  isEdit,
  refetch,
  childrefetch,
  isLeaf

}) => {
  const navigate = useNavigate();

  const [isChecked, setIsChecked] = useState<boolean>(
    isEdit?.isLeaf !== undefined ? isEdit.isLeaf : false
  );

  const [isBlockCategoryChecked, setIsBlockCategoryChecked] = useState<boolean>(
    isEdit?.isBlocked !== undefined ? isEdit.isBlocked : false
  );



// get all return policies
const {
  loading: policiesLoading,
  error: policiesError,
  data: returnPoliciesDataResponse,
  refetch: policiesRefetch,
} = useQuery(GET_ALL_RETURN_POLICIES, {
  fetchPolicy: "network-only",
  variables: {
    input: {},
  },
});

  // get all warranty policies
  const {
    loading: warrantyPoliciesLoading,
    error: warrantyPoliciesError,
    data: warrantyPoliciesDataResponse,
    refetch: warrantyPoliciesRefetch,
  } = useQuery(GET_ALL_WARRANTY_POLICIES, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        isEnable:true,
      },
    },
  });

  const POST_CATEGORY = gql`
mutation CreateCategory($input: CreateCategoryInput!, $image: Upload) {
  createCategory(input: $input, image: $image) {
    _id
  }
}

  `;

  const PUT_CATEGORY = gql`
    mutation UpdateCategory($input: UpdateCategoryInput!, $image: Upload) {
      updateCategory(input: $input, image: $image) {
        _id
      }
    }
  `;

  const [createCategory] = useMutation(POST_CATEGORY);
  const [updateCategory] = useMutation(PUT_CATEGORY);

  const checking = () => {
    setIsChecked((prev) => !prev);
  };
  console.log("CATEGORY EDIT = ",isEdit)
  const onSubmit = async (values: any, { resetForm }: any) => {
    try {

      if (isEdit) {
        let variables: any = {
          input: {
            _id: isEdit?._id,
            categoryName: values?.name,
            description: values?.description,
            parentId: isSelected?._id,
            isBlocked: isBlockCategoryChecked,
            returnPolicy:values?.returnPolicy||null,
            warrantyPolicy:values?.warrantyPolicy||null
          },
        };
        if (values.image) {
          variables = {
            ...variables,
            image: values?.image,
          };
        }
        const response = await updateCategory({
          variables
        });
        resetForm();
        checking()

        if (response) {
          toast.success("Successfully updated category");
          refetch();
          childrefetch();
          navigate("/category");


        }
        return toggle();
      } else {

        let variables: any = {
          input: {

            categoryName: values?.name,
            description: values?.description,
            parentId: isSelected?._id,
            isLeaf: isChecked,
            isBlocked: isBlockCategoryChecked,
            returnPolicy:values?.returnPolicy||null,
            warrantyPolicy:values?.warrantyPolicy||null
          },
        };
        if (values.image) {
          variables = {
            ...variables,
            image: values?.image,
          };
        }
        const response = await createCategory({
          variables,
        });
        resetForm();
        checking()
        if (response) {
          toast.success("Successfully added category");
          refetch();
          childrefetch();
          navigate("/category");


        }
        return toggle();
      }
    } catch (error: any) {
      toast.error(error.message);
      console.error("Error adding category:", error);
    }
  };

  const formik: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: isEdit ? isEdit.categoryName : "",
      description: isEdit ? isEdit.description : "",
      returnPolicy: isEdit && isEdit.returnPolicy ? isEdit.returnPolicy :isSelected&& isSelected?.returnPolicy?isSelected?.returnPolicy: "",
      warrantyPolicy: isEdit && isEdit.warrantyPolicy ? isEdit.warrantyPolicy :isSelected&& isSelected?.warrantyPolicy?isSelected?.warrantyPolicy: "",
      image: null
    },
    validationSchema: categoryValidation,
    onSubmit: async (values, { resetForm }) => {
      await onSubmit(values, { resetForm });
    },
  });

  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>("");

  const openImageModal = (imageUrl: any) => {
    setSelectedImageUrl(imageUrl);
    setIsImageModalOpen(true);
  };

  const checkingBlockCategory = () => {
    setIsBlockCategoryChecked((prev) => !prev);
  };

  return (
    <>
      <ToastContainer />
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>Add Category</ModalHeader>
        <ModalBody>
          <Form onSubmit={formik.handleSubmit}>
            <FormGroup>
              <Label for="categoryName">Name</Label>
              <Input
                type="text"
                id="categoryName"
                name="name"
                placeholder="Enter category name *"
                value={formik.values?.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name && (
                <div className="text-danger">{formik.errors.name}</div>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="categoryDescription">Description</Label>
              <Input
                type="text"
                id="categoryDescription"
                name="description"
                placeholder="Enter category description"
                value={formik.values?.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.description && formik.errors.description && (
                <div className="text-danger">{formik.errors.description}</div>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="categoryImage">Category Icon</Label>

              {/* {isEdit && isEdit.sizeChart ? (
                <div>
                  <img
                    src={isEdit.sizeChart.fileURL}
                    alt="Size Chart"
                    style={{
                      width: "50px",
                      height: "50px",
                      cursor: "pointer",
                    }}
                    onClick={() => openImageModal(isEdit.sizeChart.fileURL)}
                  />
                </div>
              ) : null} */}

              <Input
                style={{ marginTop: "10px" }}
                type="file"
                id="categoryImage"
                accept="image/*"
                name="image"
                onChange={(event) => {
                  formik.setFieldValue(
                    "image",
                    event.currentTarget.files?.[0]
                  );
                }}
                onBlur={formik.handleBlur}
              />

              {formik.touched.image && formik.errors.image && (
                <div className="text-danger">{formik.errors.image}</div>
              )}
            </FormGroup>

            <FormGroup>
              <Label for="returnPolicy">Return Policy</Label>
              <div style={{
                display:"flex",
                alignItems:"center",
                gap:"10px"
              }}>

              <Input
                type="select"
                name="returnPolicy"
                id="returnPolicy"
                value={formik.values?.returnPolicy}
                onChange={formik.handleChange}
                >
                <option disabled value="">select return policy</option>
                {returnPoliciesDataResponse&&returnPoliciesDataResponse?.getAllPoliciesBySuperAdmin?.data?.map((item:any,index:any)=>(
                  <option value={item?._id} key={index}>{item?.name}</option>
                ))}
            </Input>
            {formik.values?.returnPolicy&&
            <Button
            color="primary"
            type="button"
            onClick={()=>{
              formik.setFieldValue("returnPolicy","")
            }}
            >Remove</Button>
          }
              </div>
            </FormGroup>
            <FormGroup>
              <Label for="warrantyPolicy">Warranty Policy</Label>
              <div style={{
                display:"flex",
                alignItems:"center",
                gap:"10px"
              }}>

              <Input
                type="select"
                name="warrantyPolicy"
                id="warrantyPolicy"
                value={formik.values?.warrantyPolicy}
                onChange={formik.handleChange}
                >
                <option disabled value="">select warranty policy</option>
                {warrantyPoliciesDataResponse&&warrantyPoliciesDataResponse?.getAllWarrantyPoliciesBySuperAdmin?.data?.map((item:any,index:any)=>(
                  <option value={item?._id} key={index}>{item?.name}</option>
                ))}
            </Input>
            {formik.values?.warrantyPolicy&&
            <Button
            color="primary"
            type="button"
            onClick={()=>{
              formik.setFieldValue("warrantyPolicy","")
            }}
            >Remove</Button>
          }
              </div>
            </FormGroup>

            {!isEdit ? (
              <FormGroup check>
                <Label check>
                  <Input
                    type="checkbox"
                    id="isLeaf"
                    name="isLeaf"
                    checked={isChecked}
                    onClick={(e) => {
                      checking();
                    }}
                  />{" "}
                  final Category
                </Label>
              </FormGroup>
            ) : ""}


            {isEdit ? (
              <div>
                <FormGroup check style={{ marginTop: "10px" }}>
                  <Label check>
                    <Input
                      type="checkbox"
                      id="blockCategory"
                      name="blockCategory"
                      defaultChecked={isEdit?.isBlocked}
                      onChange={() => {
                        checkingBlockCategory();
                      }}
                    />{" "}
                    Block category
                  </Label>
                </FormGroup>
              </div>
            ) : null}

            <ModalFooter style={{ marginTop: "20px" }}>
              <Button type="submit" color="primary" >Submit</Button>
              <Button onClick={toggle}>
                Cancel
              </Button>
            </ModalFooter>

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
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default CategoryForm;
