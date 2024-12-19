import { gql, useMutation } from "@apollo/client";
import { useFormik } from "formik";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { SettlementValidation } from "src/validation/validation";

interface Props {
  isOpen: boolean;
  toggle: () => void;
  settlementId: string | undefined;
  data: {
    amount: number;
    remarks: string;
  };
  refetch: () => void;
}

const POST_SETTLEMENT = gql`
  mutation EditSettlement($input: EditSettlementInput!) {
    editSettlement(input: $input) {
      _id
      message
    }
  }
`;

const EditSettlementPopup: React.FC<Props> = ({ isOpen, toggle, settlementId, data, refetch }) => {
  const [createSettlement] = useMutation(POST_SETTLEMENT);
  console.log({ settlementId, data });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      amount: data?.amount,
      remarks: data?.remarks,
    },

    validationSchema: SettlementValidation,
    onSubmit: async (values, { resetForm }) => {
      await onSubmit(values, { resetForm });
    },
  });

  const onSubmit = async (values: any, { resetForm }: any) => {
    try {
      let variables: any = {
        input: {
          settlementId,
          amount: values?.amount,
          remarks: values?.remarks,
        },
      };

      const response = await createSettlement({
        variables,
      });

      if (response) {
        refetch();

        toast.success("Successfully Edited Settlement");
        toggle();
        resetForm();
      }

      return toggle();
    } catch (error: any) {
      toast.error(error.message);
      console.log(error.message);
    }
  };
  return (
    <>
      <Modal
        isOpen={isOpen}
        toggle={toggle}
      >
        <ModalHeader toggle={toggle}>Edit Settlement</ModalHeader>
        <ModalBody>
          <Form onSubmit={formik.handleSubmit}>
            <FormGroup>
              <Label for="amount">Amount</Label>
              <Input
                type="number"
                id="amount"
                name="amount"
                placeholder=" Enter Amount"
                value={formik.values?.amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.amount && formik.errors.amount && (
                <div className="text-danger">{formik.errors.amount}</div>
              )}
            </FormGroup>
            <FormGroup>
              <Label for="remarks">Remarks</Label>
              <Input
                type="textarea"
                id="remarks"
                name="remarks"
                rows={3}
                placeholder=" Enter Remarks"
                value={formik.values?.remarks}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.remarks && formik.errors.remarks && (
                <div className="text-danger">{formik.errors.remarks}</div>
              )}
            </FormGroup>
            <ModalFooter style={{ marginTop: "20px" }}>
              <Button color="primary">Submit</Button>
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

export default EditSettlementPopup;
