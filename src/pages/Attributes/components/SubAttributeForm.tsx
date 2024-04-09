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
import {
  AttributeValidation,
  brandValidation,
  categoryValidation,
  subAttributeVAlidation,
  vendoreValidation,
} from "src/validation/validation";
import { useMutation, gql } from "@apollo/client";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { isLeafType } from "graphql";

interface ILogo {
  fileType: string;
  fileURL: string;
  mimeType: string;
  originalName: string;
}

interface IBrand {
  _id: string;
  brandName: string;
  logo: ILogo;
  isBlocked: boolean;
  isPopular: boolean;
  priority: number;
  normal: string;
}

interface IAttribute {
  _id: string;
  attributeType: string;
  name: string;
  description: string;
  isBlocked: boolean;
}
interface Props {
  isOpen: boolean;
  toggle: () => void;
  isEdit?: IBrand | null | undefined;
  refetch: () => void;
  Id?: String | null;
  attributData?: IAttribute | null;
}

const SubAttributeForm: React.FC<Props> = ({
  isOpen,
  toggle,
  isEdit,
  refetch,
  Id,
  attributData,
}) => {
  const navigate = useNavigate();

  const [isBlockCategoryChecked, setIsBlockCategoryChecked] = useState<boolean>(
    isEdit?.isBlocked !== undefined ? isEdit.isBlocked : false
  );

  const [selectedNormal, setSelectedNormal] = useState<string>(
    isEdit?.normal || "Normal"
  );

  const POST_ATTRIBUTE = gql`
    mutation CreateAttributeValue($input: CreateAttributeValueInput!) {
      createAttributeValue(input: $input) {
        _id
        message
      }
    }
  `;

  const PUT_BRAND = gql`
    mutation UpdateBrand($input: updateBrandInput!, $image: Upload) {
      updateBrand(input: $input, image: $image) {
        _id
        message
      }
    }
  `;

  const [CreateAttributeValue] = useMutation(POST_ATTRIBUTE);
  const [updateBrand] = useMutation(PUT_BRAND);

  // when clicking the add category
  const onSubmit = async (values: any, { resetForm }: any) => {
    try {
      let variables: any = {
        input: {
          attributeId: Id,
          colorCode: values.colorCode || "",
          isBlocked: isBlockCategoryChecked,
          priority: parseInt(values.priority),
          value: values.attributeValue,
        },
      };

      const response = await CreateAttributeValue({
        variables,
      });

      if (response) {
        refetch();
        toast.success("Successfully created Attribute");
        resetForm();
      }
      return toggle();
    } catch (error: any) {
      console.log(error);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      colorCode: "",

      priority: "",
      attributeValue: "",
    },
    validationSchema: subAttributeVAlidation,
    onSubmit: async (values, { resetForm }) => {
      await onSubmit(values, { resetForm });
    },
  });

  const checkingBlockCategory = () => {
    setIsBlockCategoryChecked((prev) => !prev);
  };

  return (
    <>
      <ToastContainer />
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>Create Attribute Value </ModalHeader>
        <ModalBody>
          <Form onSubmit={formik.handleSubmit}>
            <FormGroup>
              <Label for="attributeName">Attribute value</Label>
              <Input
                type="text"
                id="attributeValue"
                name="attributeValue"
                placeholder="Please Enter The Attribute value"
                value={formik.values?.attributeValue}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.attributeValue &&
                formik.errors.attributeValue && (
                  <div className="text-danger">
                    {formik.errors.attributeValue}
                  </div>
                )}
            </FormGroup>
            {
              attributData?.attributeType === "COLOR" &&
              <FormGroup FormGroup >
                <Label for="attributeName">Color Code</Label>
                <Input
                  type="text"
                  id="colorCode"
                  name="colorCode"
                  placeholder="Please Enter The color code"
                  value={formik.values?.colorCode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.colorCode && formik.errors.colorCode && (
                  <div className="text-danger">{formik.errors.colorCode}</div>
                )}
              </FormGroup>
            }

            <FormGroup>
              <Label for="categoryName">priority</Label>
              <Input
                type="text"
                id="priority"
                name="priority"
                placeholder="Please enter the priority"
                value={formik.values?.priority}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.priority && formik.errors.priority && (
                <div className="text-danger">{formik.errors.priority}</div>
              )}
            </FormGroup>

            {isEdit ? (
              <div>
                <FormGroup check style={{ marginTop: "10px" }}>
                  <Label check>
                    <Input
                      type="checkbox"
                      id="blockBrand"
                      name="blockBrand"
                      defaultChecked={isEdit?.isBlocked}
                      onChange={() => {
                        checkingBlockCategory();
                      }}
                    />{" "}
                    Block Brand
                  </Label>
                </FormGroup>
              </div>
            ) : null}

            <ModalFooter style={{ marginTop: "20px" }}>
              <Button
                onClick={toggle}
              >
                Cancel
              </Button>
              <Button color="primary">
                Submit
              </Button>
            </ModalFooter>
          </Form>
        </ModalBody>
      </Modal >
    </>
  );
};

export default SubAttributeForm;
