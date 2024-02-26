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
  categoryValidation,
  vendoreValidation,
} from "src/validation/validation";
import { useMutation, gql } from "@apollo/client";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { isLeafType } from "graphql";

interface IVendore {
  _id: string;
  name: string;
  email: string;
  phone: string;
  isBlocked: boolean;
}

interface Props {
  isOpen: boolean;
  toggle: () => void;
  isEdit?: IVendore | null | undefined;
  refetch: () => void;
  childrefetch?: () => void;
}

const FormVender: React.FC<Props> = ({
  isOpen,
  toggle,
  isEdit,
  refetch,
  childrefetch,
}) => {
  const navigate = useNavigate();

  const [isBlockCategoryChecked, setIsBlockCategoryChecked] = useState<boolean>(
    isEdit?.isBlocked !== undefined ? isEdit.isBlocked : false
  );

  const POST_VENDORE = gql`
    mutation CreateVendorByAdmin($input: VendorSignUpByAdminInput!) {
      createVendorByAdmin(input: $input) {
        _id
        message
        token
      }
    }
  `;

  const [createAvendore] = useMutation(POST_VENDORE);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "",
      email: "",
      phone: "",
    },

    validationSchema: vendoreValidation,
    onSubmit: async (values, { resetForm }) => {
      await onSubmit(values, { resetForm });
    },
  });


  // when clicking the add category
  const onSubmit = async (values: any, { resetForm }: any) => {
    console.log(values, "VAUEMONEEEEEEEEEEEEEEEEEEEEEEEEEE")
    try {
      let variables: any = {
        input: {
          email: values?.email,
          fullName: values?.name,
          mobileNumber: values?.phone.toString(),
          isBlocked: null,
          isKycCompleted: null,
        },
      };


      console.log(variables, "variables")

      const response = await createAvendore({
        variables,
      });

      if (response) {
        refetch();

        toast.success("Successfully Created A vendor");
        navigate("/vendors");
        resetForm();
      }

      return toggle();
    } catch (error: any) {
      console.log(error.message);
    }
  };


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
        <ModalHeader toggle={toggle}>Add Vendor</ModalHeader>
        <ModalBody>
          <Form onSubmit={formik.handleSubmit}>
            <FormGroup>
              <Label for="categoryName">Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                placeholder="Please enter Name"
                value={formik.values?.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name && (
                <div className="text-danger">{formik.errors.name}</div>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="categoryName">email</Label>
              <Input
                type="text"
                id="email"
                name="email"
                placeholder="Please enter your email Address"
                value={formik.values?.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-danger">{formik.errors.email}</div>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="categoryDescription">Phone Number</Label>
              <Input
                type="number"
                id="phone"
                name="phone"
                placeholder="Please Enter Your Mobile Number"
                value={formik.values?.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.phone && formik.errors.phone && (
                <div className="text-danger">{formik.errors.phone}</div>
              )}
            </FormGroup>

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
              <Button color="primary">
                Submit
              </Button>
              <Button
                color="secondary"
                onClick={toggle}
              >
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

export default FormVender;
