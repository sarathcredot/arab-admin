import { gql, useMutation, useQuery } from "@apollo/client";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { WarrantyPolicyValidation } from "src/validation/validation";

const CREATE_POLICY = gql`
  mutation CreateWarrantyPolicyBySuperAdmin($input: createWarrantyPolicyBySuperAdminInput!) {
    createWarrantyPolicyBySuperAdmin(input: $input) {
      success
      message
    }
  }
`;

const AddWarrantyPolicy = ({ isOpen, toggle, refetch }: any) => {
  const [CreatePolicy] = useMutation(CREATE_POLICY);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "",
      description: "",
      duration: "",
      warrantyType: [] as any[],
    },

    validationSchema: WarrantyPolicyValidation,
    onSubmit: async (values, { resetForm }) => {
      await onSubmit(values, { resetForm });
    },
  });

  const onSubmit = async (values: any, { resetForm }: any) => {
    try {
      let variables: any = {
        input: {
          name: values?.name,
          description: values?.description,
          duration: values?.duration,
          warrantyType: values?.warrantyType,
        },
      };
      console.log("variables=", variables);

      const response = await CreatePolicy({
        variables,
      });
      if (response && response?.data?.createWarrantyPolicyBySuperAdmin?.success) {
        toast.success(response?.data?.createWarrantyPolicyBySuperAdmin?.message);
        refetch?.();
        toggle();
        resetForm();
      } else {
        toast.error(response?.data?.createWarrantyPolicyBySuperAdmin?.message);
      }
      console.log("RESPONSE = ", response);
    } catch (error: any) {
      console.log("error>>>>>", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    console.log("error", formik.errors);
  }, [formik.errors]);
  console.log("formik data = ", formik.values);

  return (
    <>
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        size="md"
      >
        <ModalHeader toggle={toggle}>Add Warranty Policy</ModalHeader>
        <ModalBody>
          <Form onSubmit={formik.handleSubmit}>
            <FormGroup>
              <Label for="name">Policy Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                placeholder=" Enter warranty policy name"
                value={formik.values?.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name && <div className="text-danger">{formik.errors.name}</div>}
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                type="textarea"
                id="description"
                name="description"
                placeholder=" Enter warranty policy description"
                value={formik.values?.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows={4}
              />
              {formik.touched.description && formik.errors.description && (
                <div className="text-danger">{formik.errors.description}</div>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="duration">Duration</Label>
              <Input
                type="number"
                id="duration"
                name="duration"
                placeholder="Enter duration in months"
                value={formik.values?.duration}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.duration && formik.errors.duration && (
                <div className="text-danger">{formik.errors.duration}</div>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="warrantyType">Warranty Type</Label>
              <FormGroup>
                <Input
                  type="checkbox"
                  id="warrantyType-1"
                  name="warrantyType"
                  checked={formik.values.warrantyType && formik.values.warrantyType?.includes("REPLACEMENT")}
                  onChange={(e) => {
                    if (e.target.checked) {
                      formik.setFieldValue("warrantyType", [...formik.values.warrantyType, "REPLACEMENT"]);
                    } else {
                      formik.setFieldValue(
                        "warrantyType",
                        formik.values.warrantyType.filter((item) => item !== "REPLACEMENT")
                      );
                    }
                  }}
                />
                <Label
                  className="ms-2"
                  for="warrantyType-1"
                  style={{ fontSize: "13px", fontWeight: "normal" }}
                >
                  Replacement
                </Label>
              </FormGroup>
              <FormGroup>
                <Input
                  type="checkbox"
                  id="warrantyType-2"
                  name="warrantyType"
                  disabled
                  checked={formik.values.warrantyType && formik.values.warrantyType?.includes("REPAIR")}
                  onChange={(e) => {
                    if (e.target.checked) {
                      formik.setFieldValue("warrantyType", [...formik.values.warrantyType, "REPAIR"]);
                    } else {
                      formik.setFieldValue(
                        "warrantyType",
                        formik.values.warrantyType.filter((item) => item !== "REPAIR")
                      );
                    }
                  }}
                />
                <Label
                  className="ms-2"
                  for="warrantyType-2"
                  style={{ fontSize: "13px", fontWeight: "normal" }}
                >
                  Repair
                </Label>
                {formik.touched.warrantyType && formik.errors.warrantyType && (
                  <div className="text-danger">
                    {typeof formik.errors.warrantyType === "string"
                      ? formik.errors.warrantyType
                      : formik.errors.warrantyType?.toString()}
                  </div>
                )}
              </FormGroup>
            </FormGroup>

            <ModalFooter style={{ marginTop: "20px" }}>
              <Button
                type="submit"
                color="primary"
              >
                Submit
              </Button>
              <Button
                color="secondary"
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

export default AddWarrantyPolicy;
