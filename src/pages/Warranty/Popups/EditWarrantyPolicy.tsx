import { gql, useMutation, useQuery } from "@apollo/client";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { WarrantyPolicyValidation } from "src/validation/validation";

const EDIT_POLICY = gql`
  mutation UpdateWarrantyPolicyByAdmin($input: updateWarrantyPolicyByAdminInput) {
    updateWarrantyPolicyByAdmin(input: $input) {
      success
      message
    }
  }
`;
const GET_ONE_POLICY = gql`
  query GetWarrantyPolicyByAdmin($input: getWarrantyPolicyByAdminInput!) {
    getWarrantyPolicyByAdmin(input: $input) {
      _id
      name
      description
      duration
      isEnable
      isDeleted
      warrantyType
    }
  }
`;

const EditWarrantyPolicy = ({ isOpen, toggle, warrantyID, refetch }: any) => {
  const [EditPolicy] = useMutation(EDIT_POLICY);
  const {
    data: policyData,
    error: policyError,
    loading: policyLoading,
    refetch: policyRefetch,
  } = useQuery(GET_ONE_POLICY, {
    variables: {
      input: {
        warrantyPolicyId: warrantyID,
      },
    },
    fetchPolicy: "network-only",
  });

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
          warrantyPolicyId: warrantyID,
          name: values?.name,
          description: values?.description,
          duration: values?.duration,
          warrantyType: values?.warrantyType,
        },
      };
      console.log("variables=", variables);

      const response = await EditPolicy({
        variables,
      });
      if (response?.data?.updateWarrantyPolicyByAdmin?.success) {
        toast.success(response?.data?.updateWarrantyPolicyByAdmin?.message);
        policyRefetch();
        refetch?.();
        toggle();
        resetForm();
      }
      console.log("RESPONSE = ", response);
    } catch (error: any) {
      console.log("error>>>>>", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (policyData && policyData?.getWarrantyPolicyByAdmin) {
      formik.setValues({
        ...formik.values,
        name: policyData?.getWarrantyPolicyByAdmin?.name || "",
        description: policyData?.getWarrantyPolicyByAdmin?.description || "",
        duration: policyData?.getWarrantyPolicyByAdmin?.duration || "",
        warrantyType: policyData?.getWarrantyPolicyByAdmin?.warrantyType || [],
      });
    }
  }, [policyData, warrantyID, policyRefetch, isOpen]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        size="md"
      >
        <ModalHeader toggle={toggle}>Edit Warranty Policy</ModalHeader>
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
                placeholder="Enter warranty duration in months"
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

export default EditWarrantyPolicy;
