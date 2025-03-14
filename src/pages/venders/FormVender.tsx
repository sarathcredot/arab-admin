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
  InputGroupText,
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
import Iconify from "src/components/iconify/Iconify";



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

  const [selectedCountry, setSelectedCountry] = useState('qa');


  const POST_VENDORE = gql`
    mutation CreateVendorByAdmin($input: VendorSignUpByAdminInput!, $image: Upload) {
  createVendorByAdmin(input: $input, image: $image) {
    _id
    message
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
      countryCode: "+968",
      image: "",
    },

    validationSchema: vendoreValidation,
    onSubmit: async (values, { resetForm }) => {
      await onSubmit(values, { resetForm });
    },
  });
  const onSubmit = async (values: any, { resetForm }: any) => {
    try {
      let variables: any = {
        input: {
          email: values?.email,
          fullName: values?.name,
          mobileNumber: values?.phone.toString(),
          countryCode: values?.countryCode,
          isBlocked: isBlockCategoryChecked
        },
      };


      if (values.image) {
        variables = {
          ...variables,
          image: values?.image,
        };
      }

      const response = await createAvendore({
        variables,
      });

      if (response) {
        
        refetch();

        toast.success("Successfully created a vendor");
        toggle();
        resetForm();
      }

      return toggle();
    } catch (error: any) {
      toast.error(error.message);
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
                placeholder="Enter name"
                value={formik.values?.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name && (
                <div className="text-danger">{formik.errors.name}</div>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="categoryName">Email</Label>
              <Input
                type="text"
                id="email"
                name="email"
                placeholder="Enter your email address"
                value={formik.values?.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-danger">{formik.errors.email}</div>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Phone number</Label>
              <div className="input-group">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text bg-white"><Iconify icon="openmoji:flag-oman" />
                    {/* {formik.values?.countryCode} */}
                    </span>
                  </div>
                 <InputGroupText>{formik.values?.countryCode}</InputGroupText>
                  <Input
                type="number"
                id="phone"
                name="phone"
                placeholder="Enter your mobile number"
                value={formik.values?.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
                </div>
              </div>

              {formik.touched.phone && formik.errors.phone && (
                <div className="text-danger">{formik.errors.phone}</div>
              )}
            </FormGroup>

            {/* <FormGroup>
              <Label for="categoryDescription">Phone number</Label>
              <Input
                type="number"
                id="phone"
                name="phone"
                placeholder="Please enter your mobile number"
                value={formik.values?.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.phone && formik.errors.phone && (
                <div className="text-danger">{formik.errors.phone}</div>
              )}
            </FormGroup> */}



            <FormGroup>
              <Label for="profileImage " className="pt-2">
                Image
              </Label>
              <Input
                type="file"
                id="profileImage"
                accept="image/*"
                name="image"
                onChange={(event) => {
                  formik.setFieldValue(
                    "image",
                    event.currentTarget.files?.[0] || []
                  );
                }}
              />
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
