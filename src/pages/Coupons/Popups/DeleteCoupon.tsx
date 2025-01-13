import React from "react";
import { Modal, ModalBody } from "reactstrap";
import { useNavigate } from "react-router";
import CustomButton from "src/components/Common/CustomButton";
import { gql, useMutation } from "@apollo/client";
import { toast } from "react-toastify";

const DELETE_COUPON = gql`
  mutation AdminDeleteTheCoupon($input: adminDeleteTheCouponInput!) {
  adminDeleteTheCoupon(input: $input) {
    status
    msg
  }
}
`;

const DeleteCoupon = ({ isOpen, toggle, couponID, refetch }: any) => {
  const [deleteCoupon] = useMutation(DELETE_COUPON);

  const submit = async () => {
    try {
      const response = await deleteCoupon({
        variables: {
          input: {
            _id: couponID,
          },
        },
      });
      if (response?.data?.adminDeleteTheCoupon?.status) {
        toast.success(response?.data?.adminDeleteTheCoupon?.msg);
        refetch();
        toggle();
      }
      console.log("DELETE RESPONSE = ", response);
    } catch (error: any) {
      console.log("DELETE ERROR = ", error);
      toast.error(error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      centered={true}
      style={{
        maxWidth: "400px",
        padding: 20,
      }}
    >
      <ModalBody
        style={{
          padding: "30px",
        }}
      >
        <h5>Are you sure you want to delete this coupon?</h5>
        <div className=" d-flex justify-content-end gap-2">
          <CustomButton
            name="Cancel"
            color="#E30613"
            bgColor="#fff"
            width="30%"
            className=" mt-3"
            padding="5px"
            onClick={() => toggle()}
          />
          <CustomButton
            name="Yes"
            bgColor="#000"
            width="30%"
            className=" mt-3"
            onClick={() => submit()}
          />
        </div>
      </ModalBody>
    </Modal>
  );
};

export default DeleteCoupon;
