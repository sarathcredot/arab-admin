import { gql, useMutation, useQuery } from "@apollo/client";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { AdminValidation, ReturnPolicyValidation } from "src/validation/validation";
import Select from "react-select";

const CREATE_POLICY = gql`
  mutation CreateReturnPolicyBySuperAdmin($input: createReturnPolicyBySuperAdminInput!) {
    createReturnPolicyBySuperAdmin(input: $input) {
      success
      message
    }
  }
`;

const AddPolicy = ({ isOpen, toggle, refetch }: any) => {
  const [CreatePolicy] = useMutation(CREATE_POLICY);

  const [conditions, setConditions] = useState<any>([""]);
  console.log("conditions = ", conditions);
  const [conditionError, setConditionError] = useState("");

  const handleAddCondition = () => {
    setConditions([...conditions, ""]);
  };

  const handleRemoveCondition = (index: any) => {
    const updatedConditions = [...conditions];
    updatedConditions.splice(index, 1); // Remove the remark at the specified index
    setConditions(updatedConditions);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "",
      description: "",
      duration: "",
    },

    validationSchema: ReturnPolicyValidation,
    onSubmit: async (values, { resetForm }) => {
      await onSubmit(values, { resetForm });
    },
  });

  const onSubmit = async (values: any, { resetForm }: any) => {
    if (!conditions?.length) {
      return setConditionError("At least one condition is required");
    } else if (!conditions?.some((item: any) => item !== "")) {
      return setConditionError("At least one condition is required");
    }
    try {
      let variables: any = {
        input: {
          name: values?.name,
          description: values?.description,
          conditions,
          duration: values?.duration,
        },
      };
      console.log("variables=", variables);

      const response = await CreatePolicy({
        variables,
      });
      if (response && response?.data?.createReturnPolicyBySuperAdmin?.success) {
        toast.success(response?.data?.createReturnPolicyBySuperAdmin?.message);
        refetch?.();
        toggle();
        resetForm();
        setConditions([""])
      }else{
          toast.error(response?.data?.createReturnPolicyBySuperAdmin?.message);
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

  return (
    <>
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        size="md"
      >
        <ModalHeader toggle={toggle}>Add Return Policy</ModalHeader>
        <ModalBody>
          <Form onSubmit={formik.handleSubmit}>
            <FormGroup>
              <Label for="name">Policy Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                placeholder=" Enter return policy name"
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
                placeholder=" Enter return policy description"
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
              <Label for="conditions">Conditions</Label>
              {conditions?.map((condition: any, index: any) => (
                <FormGroup
                  key={index}
                  style={{ marginBottom: "10px" }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Input
                      type="text"
                      id={`condition-${index}`}
                      name={`condition-${index}`}
                      placeholder="Add conditions"
                      value={condition}
                      onChange={(e) => {
                        const updatedConditions = [...conditions];
                        updatedConditions[index] = e.target.value;
                        setConditions(updatedConditions);
                        setConditionError("");
                      }}
                      style={{
                        marginRight: "10px",
                        borderRadius: "0px",
                        backgroundColor: "#f8f9fa",
                      }}
                    />
                    {index === conditions.length - 1 && (
                      <Button
                        color="primary"
                        onClick={handleAddCondition}
                        style={{ borderRadius: "0px" }}
                      >
                        + {/* Plus icon */}
                      </Button>
                    )}{" "}
                    {index !== 0 && (
                      <Button
                        style={{
                          marginLeft: "5px",
                          marginRight: "5px",
                          borderRadius: "0px",
                        }}
                        color="danger"
                        onClick={() => handleRemoveCondition(index)}
                      >
                        - {/* Minus icon */}
                      </Button>
                    )}
                  </div>
                </FormGroup>
              ))}
              {conditionError && (
                <div
                  className="text-danger"
                  style={{ marginTop: "-10px" }}
                >
                  {conditionError}
                </div>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="duration">Return Period</Label>
              <Input
                type="number"
                id="duration"
                name="duration"
                placeholder="Enter Return Period in Days"
                value={formik.values?.duration}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.duration && formik.errors.duration && (
                <div className="text-danger">{formik.errors.duration}</div>
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

export default AddPolicy;
