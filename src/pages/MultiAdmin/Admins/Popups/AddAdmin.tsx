import { gql, useMutation, useQuery } from "@apollo/client";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { AdminValidation } from "src/validation/validation";
import Select from "react-select";

const CREATE_ADMIN = gql`
  mutation CreateAdmin($input: createAdminInput!, $image: Upload) {
    createAdmin(input: $input, image: $image) {
      status
      msg
    }
  }
`;
const GET_ROLES = gql`
  query GetAllRolesBySuperAdmin($input: getAllRolesBySuperAdminInput) {
    getAllRolesBySuperAdmin(input: $input) {
      success
      data {
        _id
        name
        isEnable
      }
      maxRecords
    }
  }
`;

const AddAdmin = ({ isOpen, toggle, refetch }: any) => {
  const [CreateAdmin] = useMutation(CREATE_ADMIN);

  const [roles, setRoles] = useState<any>([]);
  const [selectedRoles, setSelectedRoles] = useState<any>([]);
  const [roleError, setRoleError] = useState("");
  console.log("ROLE == ", selectedRoles);
  // get roles query
  const {
    loading: rolesLoading,
    error: rolesError,
    data: rolesDataResponse,
    refetch: rolesRefetch,
  } = useQuery(GET_ROLES, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        isEnable: true,
      },
    },
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullName: "",
      email: "",
      accType: "",
      password: "",
      image: "",
    },

    validationSchema: AdminValidation,
    onSubmit: async (values, { resetForm }) => {
      await onSubmit(values, { resetForm });
    },
  });

  const onSubmit = async (values: any, { resetForm }: any) => {
    if (values?.accType === "SUB_ADMIN" && !selectedRoles.length) {
      return setRoleError("Please select an admin role");
    }
    try {
      let variables: any = {
        input: {
          fullName: values?.fullName,
          email: values?.email,
          accType: values?.accType,
          password: values?.password,
          role: values?.accType === "SUB_ADMIN" ? selectedRoles.map((item: any) => item?.value) : null,
        },
      };
      if (values.image) {
        variables = {
          ...variables,
          image: values?.image,
        };
      }
      console.log("variables=", variables);

      const response = await CreateAdmin({
        variables,
      });
      if (response?.data?.createAdmin?.status) {
        toast.success(response?.data?.createAdmin?.msg);
        refetch?.();
        toggle();
        resetForm();
      }
      console.log("RESPONSE = ", response);
    } catch (error: any) {
      console.log("error>>>>>", error);

      toast.error(error.message);
      console.log(error.message);
    }
  };

  useEffect(() => {
    console.log("error", formik.errors);
  }, [formik.errors]);

  useEffect(() => {
    if (rolesDataResponse && rolesDataResponse.getAllRolesBySuperAdmin?.data) {
      console.log("RESPONSE = ", rolesDataResponse.getAllRolesBySuperAdmin?.data);
      setRoles(rolesDataResponse && rolesDataResponse.getAllRolesBySuperAdmin?.data);
    }
  }, [rolesDataResponse]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        size="md"
      >
        <ModalHeader toggle={toggle}>Add Admin</ModalHeader>
        <ModalBody>
          <Form onSubmit={formik.handleSubmit}>
            <FormGroup>
              <Label for="fullName">Full Name</Label>
              <Input
                type="text"
                id="fullName"
                name="fullName"
                placeholder=" Enter Full Name"
                value={formik.values?.fullName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.fullName && formik.errors.fullName && (
                <div className="text-danger">{formik.errors.fullName}</div>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                type="text"
                id="email"
                name="email"
                placeholder=" Enter Email"
                value={formik.values?.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && <div className="text-danger">{formik.errors.email}</div>}
            </FormGroup>
            <FormGroup>
              <Label for="image">Profile Image</Label>
              <Input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                // value={formik.values?.image}
                onChange={(event) => {
                  formik.setFieldValue("image", event.currentTarget.files?.[0] || []);
                }}
                onBlur={formik.handleBlur}
              />
              {formik.touched.image && formik.errors.image && <div className="text-danger">{formik.errors.image}</div>}
            </FormGroup>
            <FormGroup>
              <Label for="accType">Account Type</Label>
              <Input
                type="select"
                id="accType"
                name="accType"
                value={formik.values?.accType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option
                  value=""
                  disabled
                >
                  Select Account Type
                </option>
                <option value={"SUPER_ADMIN"}>Super Admin</option>
                <option value={"SUB_ADMIN"}>Sub Admin</option>
              </Input>
              {formik.touched.accType && formik.errors.accType && (
                <div className="text-danger">{formik.errors.accType}</div>
              )}
            </FormGroup>

            {formik.values?.accType === "SUB_ADMIN" && (
              <FormGroup>
                <Label for="role">Admin Role</Label>
                <Select
                  options={
                    roles?.length
                      ? roles?.map((item: any) => ({
                          label: item?.name,
                          value: item?._id,
                        }))
                      : []
                  }
                  //   isMulti           // if one admin can access two roles then use isMulti
                  isLoading={rolesLoading}
                  placeholder="Select Admin Role"
                  value={selectedRoles}
                  onChange={(selected: any) => {
                    setSelectedRoles([selected]);
                    setRoleError("")
                  }}
                />
                {roleError && (
                  <div className="text-danger">{roleError}</div>
                )}
              </FormGroup>
            )}
            <FormGroup>
              <Label for="password">Password</Label>
              <Input
                type="password"
                id="password"
                name="password"
                placeholder="Enter password"
                value={formik.values?.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-danger">{formik.errors.password}</div>
              )}
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

export default AddAdmin;
