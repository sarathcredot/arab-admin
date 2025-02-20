import React, { useEffect, useState } from "react";
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
  brandValidation,
  categoryValidation,
  vendoreValidation,
} from "src/validation/validation";
import { useMutation, gql, useQuery } from "@apollo/client";
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
  returnPolicy:string;
}

interface Props {
  isOpen: boolean;
  toggle: () => void;
  isEdit?: IBrand | null | undefined;
  refetch: () => void;
  childrefetch?: () => void;
}

const GET_ALL_POLICIES = gql`
  query GetAllPoliciesBySuperAdmin($input: getAllPoliciesBySuperAdminInput) {
  getAllPoliciesBySuperAdmin(input: $input) {
    success
    data {
      _id
      name
      description
      duration
      isEnable
      returnCharge
      
    }
    maxRecords
  }
}
`;

const BrandForm: React.FC<Props> = ({
  isOpen,
  toggle,
  isEdit,
  refetch,
  childrefetch,
}) => {
  const navigate = useNavigate();

  const [isBlockCategoryChecked, setIsBlockCategoryChecked] = useState<any>(
    false
  );

  useEffect(() => {
    setIsBlockCategoryChecked(isEdit?.isBlocked)
  }, [isEdit?.isBlocked])
console.log("IS EDIT = ",isEdit)
  const [isPopularChecked, setIsPopularChecked] = useState<any>(false);

  useEffect(() => {
    setIsPopularChecked(isEdit?.isPopular)
  }, [isEdit?.isPopular])

  const POST_BRAND = gql`
   mutation AddBrand($input: AddBrandInput!, $image: Upload) {
  addBrand(input: $input, image: $image) {
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

      // get all policies
      const {
        loading: policiesLoading,
        error: policiesError,
        data: policiesDataResponse,
        refetch: policiesRefetch,
      } = useQuery(GET_ALL_POLICIES, {
        fetchPolicy: "network-only",
        variables: {
          input: {},
        },
      });

  const [createBrand] = useMutation(POST_BRAND);
  const [updateBrand] = useMutation(PUT_BRAND);

  // when clicking the add brand
  const onSubmit = async (values: any, { resetForm }: any) => {
    try {
      if (isEdit) {
        let variables: any = {
          input: {
            _id: isEdit._id,
            brandName: values.brandName,
            isBlocked: isBlockCategoryChecked,
            priority: values.priority,
            isPopular: isPopularChecked,
            returnPolicy:values?.returnPolicy||null,
          },
        };
        if (values.image) {
          variables = {
            ...variables,
            image: values?.image,
          };
        }

        const response = await updateBrand({
          variables,
        });
        if (response) {
          refetch();

          toast.success("Successfully updated brand");
          navigate("/brands");
          resetForm();
        }
        return toggle();
      }

      let variables: any = {
        input: {
          brandName: values.brandName,
          isBlocked: null,
          priority: values.priority,
          isPopular: isPopularChecked,
          returnPolicy:values?.returnPolicy||null,

        },
      };
      if (values.image) {
        variables = {
          ...variables,
          image: values?.image,
        };
      }

      const response = await createBrand({
        variables,
      });

      if (response) {
        refetch();
        toast.success("Successfully created brand");
        navigate("/brands");
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
      brandName: isEdit ? isEdit.brandName : "",
      priority: isEdit ? isEdit.priority : "",
      returnPolicy:isEdit && isEdit?.returnPolicy ? isEdit?.returnPolicy :"",
      image: null,
    },
    validationSchema: brandValidation,
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
    setIsBlockCategoryChecked((prev: any) => !prev);
  };

  const checkingpolpularity = () => {
    setIsPopularChecked((prev: any) => !prev);
  }

  return (
    <>
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>{isEdit ? "Edit Brand" : "Add Brand"}</ModalHeader>
        <ModalBody>
          <Form onSubmit={formik.handleSubmit}>
            <FormGroup>
              <Label for="categoryName">Brand Name</Label>
              <Input
                type="text"
                id="brandName"
                name="brandName"
                placeholder="Please enter Brand Name"
                value={formik.values?.brandName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.brandName && formik.errors.brandName && (
                <div className="text-danger">{formik.errors.brandName}</div>
              )}
            </FormGroup>

            <FormGroup>
              <Label for="categoryImage">Logo</Label>

              {isEdit && isEdit.logo ? (
                <div>
                  <img
                    src={isEdit.logo.fileURL}
                    alt="brand logo"
                    style={{
                      width: "50px",
                      height: "50px",
                      cursor: "pointer",
                    }}
                    onClick={() => openImageModal(isEdit.logo.fileURL)}
                  />
                </div>
              ) : null}

              <Input
                style={{ marginTop: "10px" }}
                type="file"
                id="brandimage"
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


            <FormGroup>
              <Label for="categoryName">priority</Label>
              <Input
                type="number"
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
                {policiesDataResponse&&policiesDataResponse?.getAllPoliciesBySuperAdmin?.data?.map((item:any,index:any)=>(
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


            <FormGroup check style={{ marginTop: "10px" }}>
              <Label check>
                <Input
                  type="checkbox"
                  id="ispopular"
                  name="ispopular"
                  defaultChecked={isEdit?.isPopular}
                  onChange={() => {
                    checkingpolpularity()
                  }}
                />{" "}
                Popularity
              </Label>
            </FormGroup>


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
      <ToastContainer/>
    </>
  );
};

export default BrandForm;
