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
import { useMutation, gql } from "@apollo/client";
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
  sizeChart: sizeChart;
  isBlocked: boolean;
}

interface Props {
  isOpen: boolean;
  toggle: () => void;
  isSelected?: Category | null | undefined;
  isEdit?: Category | null | undefined;
  refetch: () => void;
  childrefetch: () => void;
}

const CategoryForm: React.FC<Props> = ({
  isOpen,
  toggle,
  isSelected,
  isEdit,
  refetch,
  childrefetch,
}) => {
  const navigate = useNavigate();

  const [isChecked, setIsChecked] = useState<boolean>(
    isEdit?.isLeaf !== undefined ? isEdit.isLeaf : false
  );

  const [isBlockCategoryChecked, setIsBlockCategoryChecked] = useState<boolean>(
    isEdit?.isBlocked !== undefined ? isEdit.isBlocked : false
  );
  

  

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

  // when clicking the add category
  const onSubmit = async (values: any ,{resetForm}:any) => {
    try {
      // values.preventDefault();
      let variables: any = {
        input: {
          _id: isEdit?._id,
          categoryName: values?.name,
          description: values?.description,
          parentId: isSelected?._id,
          isLeaf: isChecked,
          isBlocked: isBlockCategoryChecked
        },
      };
      if (values.image) {
        variables = {
          ...variables,
          image: values?.image,
        };
      }
      if (isEdit) {
        const response = await updateCategory({
          variables,
        });

        if (response) {
          toast.success("Successfully updated category");
          refetch();
          childrefetch();
          navigate("/category");
          resetForm();
          checking()
        }
        return toggle();
      } else {
        const response = await createCategory({
          variables,
        });

        if (response) {
          toast.success("Successfully added category");
          refetch();
          childrefetch();
          navigate("/category");
          resetForm();
          checking()
        }
        return toggle();
      }
    } catch (error: any) {
      toast.error(error.message);
      console.error("Error adding category:", error);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: isEdit ? isEdit.categoryName : "",
      description: isEdit ? isEdit.description : "",
      image: null,
    },
    validationSchema: categoryValidation,
    onSubmit: async (values,{ resetForm }) => {
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
                placeholder="Enter category name"
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
              <Label for="categoryImage">Size Chart</Label>

              {isEdit && isEdit.sizeChart ? (
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
              ) : null}

              <Input
                style={{ marginTop: "10px" }}
                type="file"
                id="categoryImage"
                accept="image/*"
                name="image"
                onChange={(event) => {
                  formik.setFieldValue(
                    "image",
                    event.currentTarget.files?.[0] || []
                  );
                }}
                onBlur={formik.handleBlur}
              />

              {formik.touched.image && formik.errors.image && (
                <div className="text-danger">{formik.errors.image}</div>
              )}
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
            ):""}
            

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
              <Button  style={{backgroundColor:"rgba(0, 0, 0, 1)"}}>Add</Button>
              <Button style={{backgroundColor:"rgba(177, 35, 73, 1)"}} onClick={toggle}>
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
