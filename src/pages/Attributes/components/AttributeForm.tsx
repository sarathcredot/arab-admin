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

interface Props {
  isOpen: boolean;
  toggle: () => void;
  isEdit?: IBrand | null | undefined;
  refetch: () => void;

}

const AttributeForm: React.FC<Props> = ({
  isOpen,
  toggle,
  isEdit,
  refetch,

}) => {
  const navigate = useNavigate();

  const [isBlockCategoryChecked, setIsBlockCategoryChecked] = useState<boolean>(
    isEdit?.isBlocked !== undefined ? isEdit.isBlocked : false
  );




  const [selectedNormal, setSelectedNormal] = useState<string>(
    isEdit?.normal || "Normal"
  );


  const POST_ATTRIBUTE = gql`
mutation CreateAttribute($input: CreateAttributeInput!) {
  createAttribute(input: $input) {
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

  const [CreateAttribute] = useMutation(POST_ATTRIBUTE);
  const [updateBrand] = useMutation(PUT_BRAND);

  // when clicking the add category
  const onSubmit = async (values: any, { resetForm }: any) => {
    try {


      let variables: any = {
        input: {
          attributeType: selectedNormal === "Normal" ? "NORMAL" : "COLOR",
          description: values.description,
          isBlocked: null,
          name: values.attributeName


        },
      };


      const response = await CreateAttribute({
        variables,
      });

      if (response) {
        refetch();
        toast.success("Successfully created Attribute");
        navigate("/attributes");
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
      attributeName: "",
      description: "",
    },
    validationSchema: AttributeValidation,
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
        <ModalHeader toggle={toggle}>Create Attribute</ModalHeader>
        <ModalBody>
          <Form onSubmit={formik.handleSubmit}>

            <FormGroup>
              <Label for="attributetype">Attribute Type</Label>
              <Input
                type="select"
                id="attributetype"
                name="attributetype"
                value={selectedNormal}
                onChange={(e) => setSelectedNormal(e.target.value)}
              >
                <option value="Normal">Normal</option>
                <option value="AnotherOption">Color</option>
              </Input>
            </FormGroup>

            <FormGroup>
              <Label for="attributeName">Attribute Name</Label>
              <Input
                type="text"
                id="attributeName"
                name="attributeName"
                placeholder="Please Enter Attribute Name"
                value={formik.values?.attributeName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.attributeName && formik.errors.attributeName && (
                <div className="text-danger">{formik.errors.attributeName}</div>
              )}
            </FormGroup>

            <FormGroup>
              <Label for="categoryName">Description</Label>
              <Input
                type="text"
                id="description"
                name="description"
                placeholder="Please Enter Description"
                value={formik.values?.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.description && formik.errors.description && (
                <div className="text-danger">{formik.errors.description}</div>
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
              <Button color="primary">
                Submit
              </Button>
              <Button
                onClick={toggle}
              >
                Cancel
              </Button>
            </ModalFooter>

          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default AttributeForm;
